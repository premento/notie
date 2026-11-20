// ====================
// options
// ====================

const positions = {
  top: 'top',
  bottom: 'bottom'
}

const defaultOptions = {
  alertTime: 3,
  dateMonths: ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'],
  overlayClickDismiss: true,
  overlayOpacity: 0.75,
  transitionCurve: 'ease',
  transitionDuration: 0.3,
  transitionSelector: 'all',
  // When true, `text` and button labels are rendered as plain text instead of
  // HTML. Defaults to false to preserve the documented "HTML in text" feature,
  // but should be switched on (globally or per call) whenever any part of the
  // string can originate from user input. See the Security section of README.
  escapeHtml: false,
  // Skip transitions when the OS asks for reduced motion.
  respectReducedMotion: true,
  classes: {
    container: 'notie-container',
    textbox: 'notie-textbox',
    textboxInner: 'notie-textbox-inner',
    button: 'notie-button',
    element: 'notie-element',
    elementHalf: 'notie-element-half',
    elementThird: 'notie-element-third',
    overlay: 'notie-overlay',
    backgroundSuccess: 'notie-background-success',
    backgroundWarning: 'notie-background-warning',
    backgroundError: 'notie-background-error',
    backgroundInfo: 'notie-background-info',
    backgroundNeutral: 'notie-background-neutral',
    backgroundOverlay: 'notie-background-overlay',
    alert: 'notie-alert',
    inputField: 'notie-input-field',
    selectChoice: 'notie-select-choice',
    selectChoiceRepeated: 'notie-select-choice-repeated',
    dateSelectorInner: 'notie-date-selector-inner',
    dateSelectorUp: 'notie-date-selector-up'
  },
  ids: {
    overlay: 'notie-overlay'
  },
  positions: {
    alert: positions.top,
    force: positions.top,
    confirm: positions.top,
    input: positions.top,
    select: positions.bottom,
    date: positions.top
  }
}

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key)

const shallowMerge = (base, extra) => {
  const result = {}
  for (const key in base) {
    if (hasOwn(base, key)) result[key] = base[key]
  }
  if (extra) {
    for (const key in extra) {
      // Own enumerable keys only, and never a key that could reach
      // Object.prototype.
      if (!hasOwn(extra, key)) continue
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue
      result[key] = extra[key]
    }
  }
  return result
}

let options = shallowMerge(defaultOptions, null)
options.classes = shallowMerge(defaultOptions.classes, null)
options.ids = shallowMerge(defaultOptions.ids, null)
options.positions = shallowMerge(defaultOptions.positions, null)
options.dateMonths = defaultOptions.dateMonths.slice()

export const setOptions = newOptions => {
  const next = newOptions || {}
  const merged = shallowMerge(options, next)
  merged.classes = shallowMerge(options.classes, next.classes)
  merged.ids = shallowMerge(options.ids, next.ids)
  merged.positions = shallowMerge(options.positions, next.positions)
  if (next.dateMonths && next.dateMonths.length) {
    merged.dateMonths = next.dateMonths.slice()
  }
  options = merged
  return options
}

// ====================
// helpers
// ====================

const hasWindow = typeof window !== 'undefined' && typeof document !== 'undefined'

const getBody = () => (document.body || document.documentElement)

const toArray = collection => {
  const result = []
  if (!collection) return result
  for (let i = 0; i < collection.length; i++) result.push(collection[i])
  return result
}

const delay = (seconds, callback) => setTimeout(callback, Math.max(0, seconds * 1000))

// Two frames: the first lets the browser apply the starting styles, the second
// guarantees the transition actually kicks in. `setTimeout(fn, 0)` was racy.
const nextFrame = callback => {
  if (hasWindow && typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => window.requestAnimationFrame(callback))
  } else {
    setTimeout(callback, 16)
  }
}

const prefersReducedMotion = () => {
  if (!options.respectReducedMotion) return false
  if (!hasWindow || typeof window.matchMedia !== 'function') return false
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch (e) {
    return false
  }
}

const getTransitionDuration = () => {
  if (prefersReducedMotion()) return 0
  const duration = Number(options.transitionDuration)
  return isFinite(duration) && duration >= 0 ? duration : 0
}

const getTransition = () => {
  const duration = getTransitionDuration()
  if (!duration) return 'none'
  return `${options.transitionSelector} ${duration}s ${options.transitionCurve}`
}

const blur = () => {
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur()
  }
}

const generateRandomId = () => {
  const cryptoObj = hasWindow ? (window.crypto || window.msCrypto) : null
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return `notie-${cryptoObj.randomUUID()}`
  }
  let nextNibble
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    const bytes = new Uint8Array(36)
    cryptoObj.getRandomValues(bytes)
    let index = 0
    nextNibble = () => bytes[index++ % bytes.length] & 15
  } else {
    nextNibble = () => Math.random() * 16 | 0
  }
  // RFC4122 version 4 compliant UUID
  const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = nextNibble()
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
  return `notie-${id}`
}

// classList.add() throws on an empty string and on names containing
// whitespace, and silently adds the literal class "undefined" when a class
// option is missing. This guards all three.
const addClass = (element, name) => {
  if (!element || name === undefined || name === null) return
  const tokens = String(name).split(/\s+/)
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i]) element.classList.add(tokens[i])
  }
}

// Resolved on every call so that setOptions({ classes: ... }) is honoured.
const typeToClass = type => {
  const classes = options.classes
  switch (String(type)) {
    case '1': case 'success': return classes.backgroundSuccess
    case '2': case 'warning': return classes.backgroundWarning
    case '3': case 'error': return classes.backgroundError
    case '4': case 'info': return classes.backgroundInfo
    case '5': case 'neutral': return classes.backgroundNeutral
    default: return classes.backgroundInfo
  }
}

const resolvePosition = position => (
  position === positions.bottom ? positions.bottom : positions.top
)

const shouldEscape = settings => (
  settings && settings.escapeHtml !== undefined
    ? !!settings.escapeHtml
    : !!options.escapeHtml
)

// The single place where caller-supplied strings reach the DOM.
const render = (element, value, escape) => {
  const text = value === undefined || value === null ? '' : String(value)
  if (escape) element.textContent = text
  else element.innerHTML = text
}
