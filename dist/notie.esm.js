// src/notie.js
var positions = {
  top: "top",
  bottom: "bottom"
};
var defaultOptions = {
  alertTime: 3,
  dateMonths: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  overlayClickDismiss: true,
  overlayOpacity: 0.75,
  transitionCurve: "ease",
  transitionDuration: 0.3,
  transitionSelector: "all",
  // When true, `text` and button labels are rendered as plain text instead of
  // HTML. Defaults to false to preserve the documented "HTML in text" feature,
  // but should be switched on (globally or per call) whenever any part of the
  // string can originate from user input. See the Security section of README.
  escapeHtml: false,
  // Skip transitions when the OS asks for reduced motion.
  respectReducedMotion: true,
  classes: {
    container: "notie-container",
    textbox: "notie-textbox",
    textboxInner: "notie-textbox-inner",
    button: "notie-button",
    element: "notie-element",
    elementHalf: "notie-element-half",
    elementThird: "notie-element-third",
    overlay: "notie-overlay",
    backgroundSuccess: "notie-background-success",
    backgroundWarning: "notie-background-warning",
    backgroundError: "notie-background-error",
    backgroundInfo: "notie-background-info",
    backgroundNeutral: "notie-background-neutral",
    backgroundOverlay: "notie-background-overlay",
    alert: "notie-alert",
    inputField: "notie-input-field",
    selectChoice: "notie-select-choice",
    selectChoiceRepeated: "notie-select-choice-repeated",
    dateSelectorInner: "notie-date-selector-inner",
    dateSelectorUp: "notie-date-selector-up"
  },
  ids: {
    overlay: "notie-overlay"
  },
  positions: {
    alert: positions.top,
    force: positions.top,
    confirm: positions.top,
    input: positions.top,
    select: positions.bottom,
    date: positions.top
  }
};
var hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
var shallowMerge = (base, extra) => {
  const result = {};
  for (const key in base) {
    if (hasOwn(base, key)) result[key] = base[key];
  }
  if (extra) {
    for (const key in extra) {
      if (!hasOwn(extra, key)) continue;
      if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
      result[key] = extra[key];
    }
  }
  return result;
};
var options = shallowMerge(defaultOptions, null);
options.classes = shallowMerge(defaultOptions.classes, null);
options.ids = shallowMerge(defaultOptions.ids, null);
options.positions = shallowMerge(defaultOptions.positions, null);
options.dateMonths = defaultOptions.dateMonths.slice();
var setOptions = (newOptions) => {
  const next = newOptions || {};
  const merged = shallowMerge(options, next);
  merged.classes = shallowMerge(options.classes, next.classes);
  merged.ids = shallowMerge(options.ids, next.ids);
  merged.positions = shallowMerge(options.positions, next.positions);
  if (next.dateMonths && next.dateMonths.length) {
    merged.dateMonths = next.dateMonths.slice();
  }
  options = merged;
  return options;
};
var hasWindow = typeof window !== "undefined" && typeof document !== "undefined";
var getBody = () => document.body || document.documentElement;
var toArray = (collection) => {
  const result = [];
  if (!collection) return result;
  for (let i = 0; i < collection.length; i++) result.push(collection[i]);
  return result;
};
var delay = (seconds, callback) => setTimeout(callback, Math.max(0, seconds * 1e3));
var nextFrame = (callback) => {
  let called = false;
  const run = () => {
    if (called) return;
    called = true;
    callback();
  };
  if (hasWindow && typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() => window.requestAnimationFrame(run));
  }
  setTimeout(run, 32);
};
var prefersReducedMotion = () => {
  if (!options.respectReducedMotion) return false;
  if (!hasWindow || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    return false;
  }
};
var getTransitionDuration = () => {
  if (prefersReducedMotion()) return 0;
  const duration = Number(options.transitionDuration);
  return isFinite(duration) && duration >= 0 ? duration : 0;
};
var getTransition = () => {
  const duration = getTransitionDuration();
  if (!duration) return "none";
  return `${options.transitionSelector} ${duration}s ${options.transitionCurve}`;
};
var blur = () => {
  if (document.activeElement && typeof document.activeElement.blur === "function") {
    document.activeElement.blur();
  }
};
var generateRandomId = () => {
  const cryptoObj = hasWindow ? window.crypto || window.msCrypto : null;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
    return `notie-${cryptoObj.randomUUID()}`;
  }
  let nextNibble;
  if (cryptoObj && typeof cryptoObj.getRandomValues === "function") {
    const bytes = new Uint8Array(36);
    cryptoObj.getRandomValues(bytes);
    let index = 0;
    nextNibble = () => bytes[index++ % bytes.length] & 15;
  } else {
    nextNibble = () => Math.random() * 16 | 0;
  }
  const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = nextNibble();
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
  return `notie-${id}`;
};
var addClass = (element, name) => {
  if (!element || name === void 0 || name === null) return;
  const tokens = String(name).split(/\s+/);
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i]) element.classList.add(tokens[i]);
  }
};
var typeToClass = (type) => {
  const classes = options.classes;
  switch (String(type)) {
    case "1":
    case "success":
      return classes.backgroundSuccess;
    case "2":
    case "warning":
      return classes.backgroundWarning;
    case "3":
    case "error":
      return classes.backgroundError;
    case "4":
    case "info":
      return classes.backgroundInfo;
    case "5":
    case "neutral":
      return classes.backgroundNeutral;
    default:
      return classes.backgroundInfo;
  }
};
var resolvePosition = (position) => position === positions.bottom ? positions.bottom : positions.top;
var shouldEscape = (settings) => settings && settings.escapeHtml !== void 0 ? !!settings.escapeHtml : !!options.escapeHtml;
var render = (element, value, escape) => {
  const text = value === void 0 || value === null ? "" : String(value);
  if (escape) element.textContent = text;
  else element.innerHTML = text;
};
var isEnter = (event) => event.key === "Enter" || event.keyCode === 13;
var isEscape = (event) => event.key === "Escape" || event.key === "Esc" || event.keyCode === 27;
var isSpace = (event) => event.key === " " || event.key === "Spacebar" || event.keyCode === 32;
var isTab = (event) => event.key === "Tab" || event.keyCode === 9;
var FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])'
].join(",");
var getFocusable = (element) => {
  if (!element || typeof element.querySelectorAll !== "function") return [];
  const nodes = toArray(element.querySelectorAll(FOCUSABLE_SELECTOR));
  const visible = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.offsetWidth > 0 || node.offsetHeight > 0 || node === document.activeElement) visible.push(node);
  }
  return visible;
};
var focusNode = (node) => {
  if (!node || typeof node.focus !== "function") return;
  try {
    node.focus({ preventScroll: true });
  } catch (e) {
    try {
      node.focus();
    } catch (e2) {
    }
  }
};
var focusFirst = (element) => {
  const focusable = getFocusable(element);
  focusNode(focusable.length ? focusable[0] : element);
};
var makeButton = (element, label, escape, onActivate) => {
  addClass(element, options.classes.button);
  element.setAttribute("role", "button");
  element.setAttribute("tabindex", "0");
  render(element, label, escape);
  element.onclick = onActivate;
  element.onkeydown = (event) => {
    if (isEnter(event) || isSpace(event)) {
      event.preventDefault();
      event.stopPropagation();
      onActivate(event);
    }
  };
  return element;
};
var isNotieButton = (node) => !!node && typeof node.getAttribute === "function" && node.getAttribute("role") === "button" && !!node.classList && node.classList.contains(options.classes.button);
var stack = [];
var keydownBound = false;
var handleKeydown = (event) => {
  const top = stack[stack.length - 1];
  if (!top || !top.element) return;
  if (top.modal && isTab(event)) {
    const focusable = getFocusable(top.element);
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (!top.element.contains(active)) {
      event.preventDefault();
      focusNode(first);
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      focusNode(last);
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      focusNode(first);
    }
    return;
  }
  if ((isEnter(event) || isSpace(event)) && top.element.contains(document.activeElement) && isNotieButton(document.activeElement)) return;
  if (top.listener) top.listener(event);
};
var bindKeydown = () => {
  if (keydownBound || !hasWindow) return;
  window.addEventListener("keydown", handleKeydown);
  keydownBound = true;
};
var unbindKeydown = () => {
  if (!keydownBound || stack.length || !hasWindow) return;
  window.removeEventListener("keydown", handleKeydown);
  keydownBound = false;
};
var detach = (element) => {
  if (element && element.parentNode) element.parentNode.removeChild(element);
};
var slideIn = (element, position) => {
  addClass(element, options.classes.container);
  element.style[position] = "-10000px";
  getBody().appendChild(element);
  element.style[position] = `-${element.offsetHeight}px`;
  void element.offsetHeight;
  nextFrame(() => {
    if (!element.parentNode) return;
    element.style.transition = getTransition();
    element.style[position] = "0px";
  });
};
var createOverlay = (entry) => {
  const element = document.createElement("div");
  element.id = options.ids.overlay;
  addClass(element, options.classes.overlay);
  addClass(element, options.classes.backgroundOverlay);
  element.setAttribute("aria-hidden", "true");
  element.style.opacity = "0";
  if (entry && entry.dismissible && options.overlayClickDismiss) {
    element.onclick = () => {
      if (entry.onDismiss) entry.onDismiss();
      else close(entry);
    };
  }
  getBody().appendChild(element);
  void element.offsetHeight;
  nextFrame(() => {
    if (!element.parentNode) return;
    element.style.transition = getTransition();
    element.style.opacity = options.overlayOpacity;
  });
  return element;
};
var open = (entry) => {
  entry.previousFocus = document.activeElement;
  blur();
  stack.push(entry);
  bindKeydown();
  slideIn(entry.element, entry.position);
  if (entry.modal) entry.overlay = createOverlay(entry);
};
function close(entry) {
  if (!entry || entry.closed) return;
  entry.closed = true;
  if (entry.timer) {
    clearTimeout(entry.timer);
    entry.timer = null;
  }
  const index = stack.indexOf(entry);
  if (index !== -1) stack.splice(index, 1);
  unbindKeydown();
  const duration = getTransitionDuration();
  const element = entry.element;
  if (element) {
    element.removeAttribute("id");
    element.style[entry.position] = `-${element.offsetHeight}px`;
    delay(duration, () => detach(element));
  }
  if (entry.overlay) {
    const overlay = entry.overlay;
    entry.overlay = null;
    overlay.onclick = null;
    overlay.removeAttribute("id");
    overlay.style.opacity = "0";
    delay(duration, () => detach(overlay));
  }
  const previous = entry.previousFocus;
  entry.previousFocus = null;
  if (entry.modal && previous && typeof previous.focus === "function" && document.body && document.body.contains(previous)) {
    focusNode(previous);
  }
}
var makeEntry = (element, position, extras) => {
  const id = generateRandomId();
  element.id = id;
  const entry = {
    id,
    element,
    position: resolvePosition(position),
    overlay: null,
    listener: null,
    onDismiss: null,
    isAlert: false,
    modal: false,
    dismissible: false,
    closed: false,
    timer: null,
    previousFocus: null
  };
  if (extras) {
    for (const key in extras) {
      if (hasOwn(extras, key)) entry[key] = extras[key];
    }
  }
  return entry;
};
var makeHandle = (entry) => ({
  id: entry.id,
  element: entry.element,
  hide: () => close(entry),
  isOpen: () => !entry.closed
});
var hideAlerts = (callback) => {
  const alerts = [];
  for (let i = 0; i < stack.length; i++) {
    if (stack[i].isAlert) alerts.push(stack[i]);
  }
  if (!alerts.length) return;
  const duration = getTransitionDuration();
  for (let i = 0; i < alerts.length; i++) close(alerts[i]);
  if (callback) delay(duration, callback);
};
var hideAll = (callback) => {
  const entries = stack.slice();
  const duration = getTransitionDuration();
  for (let i = entries.length - 1; i >= 0; i--) close(entries[i]);
  if (callback) delay(entries.length ? duration : 0, callback);
};
var buildTextbox = (text, escape) => {
  const elementText = document.createElement("div");
  addClass(elementText, options.classes.textbox);
  addClass(elementText, options.classes.backgroundInfo);
  const inner = document.createElement("div");
  addClass(inner, options.classes.textboxInner);
  render(inner, text, escape);
  elementText.appendChild(inner);
  return elementText;
};
var labelDialog = (element, textElement) => {
  element.setAttribute("role", "dialog");
  element.setAttribute("aria-modal", "true");
  if (textElement) {
    textElement.id = `${element.id}-label`;
    element.setAttribute("aria-labelledby", textElement.id);
  }
};
var alert = (settings = {}) => {
  const {
    type = 4,
    text,
    stay = false,
    position = options.positions.alert
  } = settings;
  let { time = options.alertTime } = settings;
  const escape = shouldEscape(settings);
  hideAlerts();
  const element = document.createElement("div");
  addClass(element, options.classes.textbox);
  addClass(element, typeToClass(type));
  addClass(element, options.classes.alert);
  element.setAttribute("role", "alert");
  element.setAttribute(
    "aria-live",
    String(type) === "3" || String(type) === "error" ? "assertive" : "polite"
  );
  const inner = document.createElement("div");
  addClass(inner, options.classes.textboxInner);
  render(inner, text, escape);
  element.appendChild(inner);
  const entry = makeEntry(element, position, { isAlert: true });
  element.onclick = () => close(entry);
  entry.listener = (event) => {
    if (isEnter(event) || isEscape(event)) {
      event.preventDefault();
      close(entry);
    }
  };
  open(entry);
  if (time && time < 1) time = 1;
  if (!stay && time) entry.timer = delay(time, () => close(entry));
  return makeHandle(entry);
};
var force = (settings = {}, callbackArg) => {
  const {
    type = 5,
    text,
    buttonText = "OK",
    callback,
    position = options.positions.force
  } = settings;
  const escape = shouldEscape(settings);
  hideAlerts();
  const element = document.createElement("div");
  const entry = makeEntry(element, position, { modal: true, dismissible: false });
  const elementText = buildTextbox(text, escape);
  labelDialog(element, elementText);
  const elementButton = document.createElement("div");
  addClass(elementButton, typeToClass(type));
  makeButton(elementButton, buttonText, escape, () => {
    close(entry);
    if (callback) callback();
    else if (callbackArg) callbackArg();
  });
  element.appendChild(elementText);
  element.appendChild(elementButton);
  entry.listener = (event) => {
    if (isEnter(event)) {
      event.preventDefault();
      elementButton.click();
    }
  };
  open(entry);
  focusFirst(element);
  return makeHandle(entry);
};
var confirm = (settings = {}, submitCallbackArg, cancelCallbackArg) => {
  const {
    text,
    submitText = "Yes",
    cancelText = "Cancel",
    submitCallback,
    cancelCallback,
    position = options.positions.confirm
  } = settings;
  const escape = shouldEscape(settings);
  hideAlerts();
  const element = document.createElement("div");
  const entry = makeEntry(element, position, { modal: true, dismissible: true });
  const elementText = buildTextbox(text, escape);
  labelDialog(element, elementText);
  const elementButtonLeft = document.createElement("div");
  addClass(elementButtonLeft, options.classes.elementHalf);
  addClass(elementButtonLeft, options.classes.backgroundSuccess);
  makeButton(elementButtonLeft, submitText, escape, () => {
    close(entry);
    if (submitCallback) submitCallback();
    else if (submitCallbackArg) submitCallbackArg();
  });
  const elementButtonRight = document.createElement("div");
  addClass(elementButtonRight, options.classes.elementHalf);
  addClass(elementButtonRight, options.classes.backgroundError);
  makeButton(elementButtonRight, cancelText, escape, () => {
    close(entry);
    if (cancelCallback) cancelCallback();
    else if (cancelCallbackArg) cancelCallbackArg();
  });
  entry.onDismiss = () => elementButtonRight.click();
  element.appendChild(elementText);
  element.appendChild(elementButtonLeft);
  element.appendChild(elementButtonRight);
  entry.listener = (event) => {
    if (isEnter(event)) {
      event.preventDefault();
      elementButtonLeft.click();
    } else if (isEscape(event)) {
      event.preventDefault();
      elementButtonRight.click();
    }
  };
  open(entry);
  focusFirst(element);
  return makeHandle(entry);
};
var INPUT_ATTRIBUTE_DEFAULTS = {
  autocapitalize: "none",
  autocomplete: "off",
  autocorrect: "off",
  step: "any",
  type: "text"
};
var OPTIONAL_INPUT_ATTRIBUTES = [
  "inputmode",
  "max",
  "maxlength",
  "min",
  "minlength",
  "pattern",
  "placeholder",
  "spellcheck"
];
var buildAllowedRegex = (allowed) => {
  if (!allowed) return null;
  if (allowed instanceof RegExp) return allowed;
  if (Array.isArray(allowed)) {
    let regexString = "";
    for (let i = 0; i < allowed.length; i++) {
      if (allowed[i] === "an") regexString += "0-9a-zA-Z";
      else if (allowed[i] === "a") regexString += "a-zA-Z";
      else if (allowed[i] === "n") regexString += "0-9";
      if (allowed[i] === "s") regexString += " ";
    }
    if (!regexString) return null;
    return new RegExp(`[^${regexString}]`, "g");
  }
  if (typeof allowed === "string") {
    try {
      return new RegExp(allowed, "g");
    } catch (e) {
      return null;
    }
  }
  return null;
};
var input = (settings = {}, submitCallbackArg, cancelCallbackArg) => {
  const {
    text,
    submitText = "Submit",
    cancelText = "Cancel",
    submitCallback,
    cancelCallback,
    position = options.positions.input
  } = settings;
  const escape = shouldEscape(settings);
  hideAlerts();
  const element = document.createElement("div");
  const entry = makeEntry(element, position, { modal: true, dismissible: true });
  const elementText = buildTextbox(text, escape);
  labelDialog(element, elementText);
  const elementInput = document.createElement("input");
  addClass(elementInput, options.classes.inputField);
  for (const name in INPUT_ATTRIBUTE_DEFAULTS) {
    if (!hasOwn(INPUT_ATTRIBUTE_DEFAULTS, name)) continue;
    const value = settings[name] === void 0 || settings[name] === null ? INPUT_ATTRIBUTE_DEFAULTS[name] : settings[name];
    if (value !== "" && value !== false) elementInput.setAttribute(name, String(value));
  }
  for (let i = 0; i < OPTIONAL_INPUT_ATTRIBUTES.length; i++) {
    const name = OPTIONAL_INPUT_ATTRIBUTES[i];
    const value = settings[name];
    if (value === void 0 || value === null || value === "") continue;
    elementInput.setAttribute(name, String(value));
  }
  if (elementText.id) elementInput.setAttribute("aria-labelledby", elementText.id);
  elementInput.value = settings.value === void 0 || settings.value === null ? "" : String(settings.value);
  const allowedRegex = buildAllowedRegex(settings.allowed);
  if (allowedRegex) {
    elementInput.oninput = () => {
      const cleaned = elementInput.value.replace(allowedRegex, "");
      if (cleaned === elementInput.value) return;
      const caret = elementInput.selectionStart;
      const removed = elementInput.value.length - cleaned.length;
      elementInput.value = cleaned;
      if (typeof caret === "number" && elementInput.setSelectionRange) {
        const next = Math.max(0, caret - removed);
        try {
          elementInput.setSelectionRange(next, next);
        } catch (e) {
        }
      }
    };
  }
  const elementButtonLeft = document.createElement("div");
  addClass(elementButtonLeft, options.classes.elementHalf);
  addClass(elementButtonLeft, options.classes.backgroundSuccess);
  makeButton(elementButtonLeft, submitText, escape, () => {
    const value = elementInput.value;
    close(entry);
    if (submitCallback) submitCallback(value);
    else if (submitCallbackArg) submitCallbackArg(value);
  });
  const elementButtonRight = document.createElement("div");
  addClass(elementButtonRight, options.classes.elementHalf);
  addClass(elementButtonRight, options.classes.backgroundError);
  makeButton(elementButtonRight, cancelText, escape, () => {
    const value = elementInput.value;
    close(entry);
    if (cancelCallback) cancelCallback(value);
    else if (cancelCallbackArg) cancelCallbackArg(value);
  });
  entry.onDismiss = () => elementButtonRight.click();
  element.appendChild(elementText);
  element.appendChild(elementInput);
  element.appendChild(elementButtonLeft);
  element.appendChild(elementButtonRight);
  entry.listener = (event) => {
    if (isEnter(event)) {
      event.preventDefault();
      elementButtonLeft.click();
    } else if (isEscape(event)) {
      event.preventDefault();
      elementButtonRight.click();
    }
  };
  open(entry);
  if (settings.autofocus === false || settings.autofocus === "false") {
    focusFirst(element);
  } else {
    elementInput.setAttribute("autofocus", "true");
    focusNode(elementInput);
  }
  return makeHandle(entry);
};
var select = (settings = {}, cancelCallbackArg) => {
  const {
    text,
    cancelText = "Cancel",
    cancelCallback,
    choices = [],
    position = options.positions.select
  } = settings;
  const escape = shouldEscape(settings);
  hideAlerts();
  const element = document.createElement("div");
  const entry = makeEntry(element, position, { modal: true, dismissible: true });
  const elementText = buildTextbox(text, escape);
  labelDialog(element, elementText);
  element.appendChild(elementText);
  const list = toArray(choices);
  for (let index = 0; index < list.length; index++) {
    const choice = list[index] || {};
    const type = choice.type === void 0 || choice.type === null ? 1 : choice.type;
    const handler = choice.handler;
    const elementChoice = document.createElement("div");
    addClass(elementChoice, typeToClass(type));
    addClass(elementChoice, options.classes.selectChoice);
    const next = list[index + 1];
    if (next) {
      const nextType = next.type === void 0 || next.type === null ? 1 : next.type;
      if (String(nextType) === String(type)) {
        addClass(elementChoice, options.classes.selectChoiceRepeated);
      }
    }
    makeButton(elementChoice, choice.text, escape, () => {
      close(entry);
      if (typeof handler === "function") handler(choice);
    });
    element.appendChild(elementChoice);
  }
  const elementCancel = document.createElement("div");
  addClass(elementCancel, options.classes.backgroundNeutral);
  makeButton(elementCancel, cancelText, escape, () => {
    close(entry);
    if (cancelCallback) cancelCallback();
    else if (cancelCallbackArg) cancelCallbackArg();
  });
  entry.onDismiss = () => elementCancel.click();
  element.appendChild(elementCancel);
  entry.listener = (event) => {
    if (isEscape(event)) {
      event.preventDefault();
      elementCancel.click();
    }
  };
  open(entry);
  focusFirst(element);
  return makeHandle(entry);
};
var date = (settings = {}, submitCallbackArg, cancelCallbackArg) => {
  const {
    submitText = "OK",
    cancelText = "Cancel",
    submitCallback,
    cancelCallback,
    position = options.positions.date
  } = settings;
  const escape = shouldEscape(settings);
  hideAlerts();
  const provided = settings.value;
  const source = provided instanceof Date && !isNaN(provided.getTime()) ? provided : /* @__PURE__ */ new Date();
  const value = new Date(source.getTime());
  const arrow = "&#9662;";
  const elementDateMonth = document.createElement("div");
  const elementDateDay = document.createElement("div");
  const elementDateYear = document.createElement("div");
  const setValueText = () => {
    elementDateMonth.textContent = options.dateMonths[value.getMonth()];
    elementDateDay.textContent = String(value.getDate());
    elementDateYear.textContent = String(value.getFullYear());
  };
  const setEditableText = (node, text) => {
    if (node.textContent === text) return;
    node.textContent = text;
    if (!hasWindow || typeof window.getSelection !== "function") return;
    try {
      const range = document.createRange();
      range.selectNodeContents(node);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
    }
  };
  const handleDayInput = (event) => {
    const daysInMonth = new Date(
      value.getFullYear(),
      value.getMonth() + 1,
      0
    ).getDate();
    let day = event.target.textContent.replace(/[^\d]/g, "").replace(/^0+/, "").slice(0, 2);
    if (Number(day) > daysInMonth) day = String(daysInMonth);
    setEditableText(event.target, day);
    if (!day) return;
    value.setDate(Number(day) < 1 ? 1 : Number(day));
  };
  const handleYearInput = (event) => {
    const year = event.target.textContent.replace(/[^\d]/g, "").replace(/^0+/, "").slice(0, 4);
    setEditableText(event.target, year);
    if (!year) return;
    value.setFullYear(Number(year));
  };
  const handleBlur = () => setValueText();
  const updateMonth = (amount) => {
    const daysInNextMonth = new Date(
      value.getFullYear(),
      value.getMonth() + amount + 1,
      0
    ).getDate();
    if (value.getDate() > daysInNextMonth) value.setDate(daysInNextMonth);
    value.setMonth(value.getMonth() + amount);
    setValueText();
  };
  const updateDay = (amount) => {
    value.setDate(value.getDate() + amount);
    setValueText();
  };
  const updateYear = (amount) => {
    const nextYear = value.getFullYear() + amount;
    if (nextYear < 0) value.setFullYear(0);
    else value.setFullYear(nextYear);
    setValueText();
  };
  const element = document.createElement("div");
  const entry = makeEntry(element, position, { modal: true, dismissible: true });
  element.setAttribute("role", "dialog");
  element.setAttribute("aria-modal", "true");
  element.setAttribute("aria-label", "Choose a date");
  const elementDateSelector = document.createElement("div");
  addClass(elementDateSelector, options.classes.backgroundInfo);
  const elementDateSelectorInner = document.createElement("div");
  addClass(elementDateSelectorInner, options.classes.dateSelectorInner);
  const makeArrow = (up, label, onActivate) => {
    const node = document.createElement("div");
    addClass(node, options.classes.elementThird);
    if (up) addClass(node, options.classes.dateSelectorUp);
    makeButton(node, arrow, false, onActivate);
    node.setAttribute("aria-label", label);
    return node;
  };
  const elementDateUpMonth = makeArrow(true, "Next month", () => updateMonth(1));
  const elementDateUpDay = makeArrow(true, "Next day", () => updateDay(1));
  const elementDateUpYear = makeArrow(true, "Next year", () => updateYear(1));
  const elementDateDownMonth = makeArrow(false, "Previous month", () => updateMonth(-1));
  const elementDateDownDay = makeArrow(false, "Previous day", () => updateDay(-1));
  const elementDateDownYear = makeArrow(false, "Previous year", () => updateYear(-1));
  addClass(elementDateMonth, options.classes.element);
  addClass(elementDateMonth, options.classes.elementThird);
  elementDateMonth.setAttribute("aria-live", "polite");
  const prepareEditable = (node, label, onInput) => {
    addClass(node, options.classes.element);
    addClass(node, options.classes.elementThird);
    node.setAttribute("contenteditable", "true");
    node.setAttribute("role", "textbox");
    node.setAttribute("inputmode", "numeric");
    node.setAttribute("aria-label", label);
    node.setAttribute("spellcheck", "false");
    node.addEventListener("input", onInput);
    node.addEventListener("blur", handleBlur);
    node.addEventListener("keydown", (event) => {
      if (isEnter(event)) event.preventDefault();
    });
  };
  prepareEditable(elementDateDay, "Day", handleDayInput);
  prepareEditable(elementDateYear, "Year", handleYearInput);
  setValueText();
  const elementButtonLeft = document.createElement("div");
  addClass(elementButtonLeft, options.classes.elementHalf);
  addClass(elementButtonLeft, options.classes.backgroundSuccess);
  makeButton(elementButtonLeft, submitText, escape, () => {
    const result = new Date(value.getTime());
    close(entry);
    if (submitCallback) submitCallback(result);
    else if (submitCallbackArg) submitCallbackArg(result);
  });
  const elementButtonRight = document.createElement("div");
  addClass(elementButtonRight, options.classes.elementHalf);
  addClass(elementButtonRight, options.classes.backgroundError);
  makeButton(elementButtonRight, cancelText, escape, () => {
    const result = new Date(value.getTime());
    close(entry);
    if (cancelCallback) cancelCallback(result);
    else if (cancelCallbackArg) cancelCallbackArg(result);
  });
  entry.onDismiss = () => elementButtonRight.click();
  elementDateSelectorInner.appendChild(elementDateUpMonth);
  elementDateSelectorInner.appendChild(elementDateUpDay);
  elementDateSelectorInner.appendChild(elementDateUpYear);
  elementDateSelectorInner.appendChild(elementDateMonth);
  elementDateSelectorInner.appendChild(elementDateDay);
  elementDateSelectorInner.appendChild(elementDateYear);
  elementDateSelectorInner.appendChild(elementDateDownMonth);
  elementDateSelectorInner.appendChild(elementDateDownDay);
  elementDateSelectorInner.appendChild(elementDateDownYear);
  elementDateSelector.appendChild(elementDateSelectorInner);
  element.appendChild(elementDateSelector);
  element.appendChild(elementButtonLeft);
  element.appendChild(elementButtonRight);
  entry.listener = (event) => {
    if (isEnter(event)) {
      event.preventDefault();
      elementButtonLeft.click();
    } else if (isEscape(event)) {
      event.preventDefault();
      elementButtonRight.click();
    }
  };
  open(entry);
  focusFirst(element);
  return makeHandle(entry);
};
var notie_default = {
  alert,
  force,
  confirm,
  input,
  select,
  date,
  setOptions,
  hideAlerts,
  hideAll
};
export {
  alert,
  confirm,
  date,
  notie_default as default,
  force,
  hideAlerts,
  hideAll,
  input,
  select,
  setOptions
};
