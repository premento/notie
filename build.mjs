import { build, transform } from 'esbuild'
import { transformAsync } from '@babel/core'
import * as sass from 'sass'
import { readFile, writeFile, mkdir, rm, copyFile } from 'node:fs/promises'
import { watch as watchFile } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))
const src = join(root, 'src')
const dist = join(root, 'dist')

const watch = process.argv.includes('--watch')
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))

const banner = `/*!
 * notie v${pkg.version} - ${pkg.homepage}
 * (c) ${pkg.author} - MIT License
 */
(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') module.exports = factory()
  else if (typeof define === 'function' && define.amd) define([], factory)
  else if (typeof exports === 'object') exports['notie'] = factory()
  else root['notie'] = factory()
})(typeof self !== 'undefined' ? self : this, function () {
`

const footer = `
return notie;
});
`

const entry = join(src, 'notie.js')

// esbuild handles module resolution and the UMD wrapper; Babel does the ES5
// downlevel (esbuild cannot lower let/const). The source deliberately avoids
// Promise and every other ES6 *runtime* API, so the result needs no polyfill
// on the browsers listed in the README.
const bundleUmd = async () => {
  const bundled = await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: 'iife',
    globalName: 'notie',
    target: ['es2020'],
    // esbuild's own CommonJS-interop helper uses for-of; lowering it here
    // keeps Babel from pulling in an iterator helper that references Array.from.
    supported: { 'for-of': false },
    banner: { js: banner },
    footer: { js: footer },
    legalComments: 'none'
  })

  const es5 = await transformAsync(bundled.outputFiles[0].text, {
    babelrc: false,
    configFile: false,
    compact: false,
    comments: true,
    presets: [
      ['@babel/preset-env', {
        modules: false,
        bugfixes: true,
        targets: { ie: '10', safari: '5.1', chrome: '11', firefox: '4', opera: '11.5' }
      }]
    ]
  })

  await writeFile(join(dist, 'notie.js'), es5.code + '\n')

  const minified = await transform(es5.code, {
    minify: true,
    target: ['es5'],
    legalComments: 'none'
  })

  // The banner is re-applied by hand so the licence survives minification.
  const licence = banner.slice(0, banner.indexOf('*/') + 2)
  await writeFile(join(dist, 'notie.min.js'), licence + '\n' + minified.code)

  console.log('script  dist/notie.js, dist/notie.min.js')
}

const bundleEsm = async () => {
  await build({
    entryPoints: [entry],
    outfile: join(dist, 'notie.esm.js'),
    bundle: true,
    format: 'esm',
    target: ['es2017'],
    legalComments: 'none'
  })
  console.log('module  dist/notie.esm.js')
}

const buildStyles = async () => {
  const expanded = sass.compile(join(src, 'notie.scss'), { style: 'expanded' })
  await writeFile(join(dist, 'notie.css'), expanded.css + '\n')

  const compressed = sass.compile(join(src, 'notie.scss'), { style: 'compressed' })
  await writeFile(join(dist, 'notie.min.css'), compressed.css + '\n')

  console.log('styles  dist/notie.css, dist/notie.min.css')
}

const buildTypes = async () => {
  await copyFile(join(src, 'notie.d.ts'), join(dist, 'notie.d.ts'))
  console.log('types   dist/notie.d.ts')
}

const buildAll = async () => {
  await bundleUmd()
  await bundleEsm()
  await buildStyles()
  await buildTypes()
}

if (!watch) await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })
await buildAll()

if (watch) {
  let pending = null
  const rebuild = () => {
    clearTimeout(pending)
    pending = setTimeout(() => {
      buildAll().catch(error => console.error(error.message))
    }, 50)
  }
  watchFile(src, { recursive: true }, rebuild)
  console.log('watching src/ ...')
}
