// Minimal static file server for the local demo and test pages.
// Dev-only: not part of the published package (see "files" in package.json).
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const port = Number(process.env.PORT) || 8731

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.gif': 'image/gif',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
}

createServer(async (req, res) => {
  let pathname = decodeURIComponent(req.url.split('?')[0])
  if (pathname.endsWith('/')) pathname += 'index.html'

  const target = join(root, normalize(pathname))
  // Never serve anything outside the repository root.
  if (!target.startsWith(root)) {
    res.writeHead(403).end('forbidden')
    return
  }

  try {
    const body = await readFile(target)
    res.writeHead(200, {
      'content-type': types[extname(target)] || 'application/octet-stream',
      'cache-control': 'no-store'
    })
    res.end(body)
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('not found')
  }
}).listen(port, () => {
  console.log(`notie dev server: http://localhost:${port}/test/`)
})
