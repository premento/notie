function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*!
 * notie v4.3.1 - https://jaredreich.com/notie
 * (c) Jared Reich - MIT License
 */
(function (root, factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define([], factory);else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') exports['notie'] = factory();else root['notie'] = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var notie = function () {
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = function __export(target, all) {
      for (var name in all) __defProp(target, name, {
        get: all[name],
        enumerable: true
      });
    };
    var __copyProps = function __copyProps(to, from, except, desc) {
      if (from && _typeof(from) === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
        key = keys[i];
        if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
          get: function (k) {
            return from[k];
          }.bind(null, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
      }
      return to;
    };
    var __toCommonJS = function __toCommonJS(mod) {
      return __copyProps(__defProp({}, "__esModule", {
        value: true
      }), mod);
    };

    // src/notie.js
    var notie_exports = {};
    __export(notie_exports, {
      alert: function alert() {
        return _alert;
      },
      confirm: function confirm() {
        return _confirm;
      },
      date: function date() {
        return _date;
      },
      "default": function _default() {
        return notie_default;
      },
      force: function force() {
        return _force;
      },
      hideAlerts: function hideAlerts() {
        return _hideAlerts;
      },
      hideAll: function hideAll() {
        return _hideAll;
      },
      input: function input() {
        return _input;
      },
      select: function select() {
        return _select;
      },
      setOptions: function setOptions() {
        return _setOptions;
      }
    });
    var positions = {
      top: "top",
      bottom: "bottom"
    };
    var defaultOptions = {
      alertTime: 3,
      dateMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
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
    var hasOwn = function hasOwn(object, key) {
      return Object.prototype.hasOwnProperty.call(object, key);
    };
    var shallowMerge = function shallowMerge(base, extra) {
      var result = {};
      for (var key in base) {
        if (hasOwn(base, key)) result[key] = base[key];
      }
      if (extra) {
        for (var _key in extra) {
          if (!hasOwn(extra, _key)) continue;
          if (_key === "__proto__" || _key === "constructor" || _key === "prototype") continue;
          result[_key] = extra[_key];
        }
      }
      return result;
    };
    var options = shallowMerge(defaultOptions, null);
    options.classes = shallowMerge(defaultOptions.classes, null);
    options.ids = shallowMerge(defaultOptions.ids, null);
    options.positions = shallowMerge(defaultOptions.positions, null);
    options.dateMonths = defaultOptions.dateMonths.slice();
    var _setOptions = function _setOptions(newOptions) {
      var next = newOptions || {};
      var merged = shallowMerge(options, next);
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
    var getBody = function getBody() {
      return document.body || document.documentElement;
    };
    var toArray = function toArray(collection) {
      var result = [];
      if (!collection) return result;
      for (var i = 0; i < collection.length; i++) result.push(collection[i]);
      return result;
    };
    var delay = function delay(seconds, callback) {
      return setTimeout(callback, Math.max(0, seconds * 1e3));
    };
    var nextFrame = function nextFrame(callback) {
      var called = false;
      var run = function run() {
        if (called) return;
        called = true;
        callback();
      };
      if (hasWindow && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(function () {
          return window.requestAnimationFrame(run);
        });
      }
      setTimeout(run, 32);
    };
    var prefersReducedMotion = function prefersReducedMotion() {
      if (!options.respectReducedMotion) return false;
      if (!hasWindow || typeof window.matchMedia !== "function") return false;
      try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch (e) {
        return false;
      }
    };
    var getTransitionDuration = function getTransitionDuration() {
      if (prefersReducedMotion()) return 0;
      var duration = Number(options.transitionDuration);
      return isFinite(duration) && duration >= 0 ? duration : 0;
    };
    var getTransition = function getTransition() {
      var duration = getTransitionDuration();
      if (!duration) return "none";
      return "".concat(options.transitionSelector, " ").concat(duration, "s ").concat(options.transitionCurve);
    };
    var blur = function blur() {
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
    };
    var generateRandomId = function generateRandomId() {
      var cryptoObj = hasWindow ? window.crypto || window.msCrypto : null;
      if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
        return "notie-".concat(cryptoObj.randomUUID());
      }
      var nextNibble;
      if (cryptoObj && typeof cryptoObj.getRandomValues === "function") {
        var bytes = new Uint8Array(36);
        cryptoObj.getRandomValues(bytes);
        var index = 0;
        nextNibble = function nextNibble() {
          return bytes[index++ % bytes.length] & 15;
        };
      } else {
        nextNibble = function nextNibble() {
          return Math.random() * 16 | 0;
        };
      }
      var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = nextNibble();
        var v = c === "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
      return "notie-".concat(id);
    };
    var addClass = function addClass(element, name) {
      if (!element || name === void 0 || name === null) return;
      var tokens = String(name).split(/\s+/);
      for (var i = 0; i < tokens.length; i++) {
        if (tokens[i]) element.classList.add(tokens[i]);
      }
    };
    var typeToClass = function typeToClass(type) {
      var classes = options.classes;
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
    var resolvePosition = function resolvePosition(position) {
      return position === positions.bottom ? positions.bottom : positions.top;
    };
    var shouldEscape = function shouldEscape(settings) {
      return settings && settings.escapeHtml !== void 0 ? !!settings.escapeHtml : !!options.escapeHtml;
    };
    var render = function render(element, value, escape) {
      var text = value === void 0 || value === null ? "" : String(value);
      if (escape) element.textContent = text;else element.innerHTML = text;
    };
    var isEnter = function isEnter(event) {
      return event.key === "Enter" || event.keyCode === 13;
    };
    var isEscape = function isEscape(event) {
      return event.key === "Escape" || event.key === "Esc" || event.keyCode === 27;
    };
    var isSpace = function isSpace(event) {
      return event.key === " " || event.key === "Spacebar" || event.keyCode === 32;
    };
    var isTab = function isTab(event) {
      return event.key === "Tab" || event.keyCode === 9;
    };
    var FOCUSABLE_SELECTOR = ["a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])", '[contenteditable="true"]', '[tabindex]:not([tabindex="-1"])'].join(",");
    var getFocusable = function getFocusable(element) {
      if (!element || typeof element.querySelectorAll !== "function") return [];
      var nodes = toArray(element.querySelectorAll(FOCUSABLE_SELECTOR));
      var visible = [];
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.offsetWidth > 0 || node.offsetHeight > 0 || node === document.activeElement) visible.push(node);
      }
      return visible;
    };
    var focusNode = function focusNode(node) {
      if (!node || typeof node.focus !== "function") return;
      try {
        node.focus({
          preventScroll: true
        });
      } catch (e) {
        try {
          node.focus();
        } catch (e2) {}
      }
    };
    var focusFirst = function focusFirst(element) {
      var focusable = getFocusable(element);
      focusNode(focusable.length ? focusable[0] : element);
    };
    var makeButton = function makeButton(element, label, escape, onActivate) {
      addClass(element, options.classes.button);
      element.setAttribute("role", "button");
      element.setAttribute("tabindex", "0");
      render(element, label, escape);
      element.onclick = onActivate;
      element.onkeydown = function (event) {
        if (isEnter(event) || isSpace(event)) {
          event.preventDefault();
          event.stopPropagation();
          onActivate(event);
        }
      };
      return element;
    };
    var isNotieButton = function isNotieButton(node) {
      return !!node && typeof node.getAttribute === "function" && node.getAttribute("role") === "button" && !!node.classList && node.classList.contains(options.classes.button);
    };
    var stack = [];
    var keydownBound = false;
    var handleKeydown = function handleKeydown(event) {
      var top = stack[stack.length - 1];
      if (!top || !top.element) return;
      if (top.modal && isTab(event)) {
        var focusable = getFocusable(top.element);
        if (!focusable.length) {
          event.preventDefault();
          return;
        }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        var active = document.activeElement;
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
    var bindKeydown = function bindKeydown() {
      if (keydownBound || !hasWindow) return;
      window.addEventListener("keydown", handleKeydown);
      keydownBound = true;
    };
    var unbindKeydown = function unbindKeydown() {
      if (!keydownBound || stack.length || !hasWindow) return;
      window.removeEventListener("keydown", handleKeydown);
      keydownBound = false;
    };
    var detach = function detach(element) {
      if (element && element.parentNode) element.parentNode.removeChild(element);
    };
    var slideIn = function slideIn(element, position) {
      addClass(element, options.classes.container);
      element.style[position] = "-10000px";
      getBody().appendChild(element);
      element.style[position] = "-".concat(element.offsetHeight, "px");
      void element.offsetHeight;
      nextFrame(function () {
        if (!element.parentNode) return;
        element.style.transition = getTransition();
        element.style[position] = "0px";
      });
    };
    var createOverlay = function createOverlay(entry) {
      var element = document.createElement("div");
      element.id = options.ids.overlay;
      addClass(element, options.classes.overlay);
      addClass(element, options.classes.backgroundOverlay);
      element.setAttribute("aria-hidden", "true");
      element.style.opacity = "0";
      if (entry && entry.dismissible && options.overlayClickDismiss) {
        element.onclick = function () {
          if (entry.onDismiss) entry.onDismiss();else close(entry);
        };
      }
      getBody().appendChild(element);
      void element.offsetHeight;
      nextFrame(function () {
        if (!element.parentNode) return;
        element.style.transition = getTransition();
        element.style.opacity = options.overlayOpacity;
      });
      return element;
    };
    var open = function open(entry) {
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
      var index = stack.indexOf(entry);
      if (index !== -1) stack.splice(index, 1);
      unbindKeydown();
      var duration = getTransitionDuration();
      var element = entry.element;
      if (element) {
        element.removeAttribute("id");
        element.style[entry.position] = "-".concat(element.offsetHeight, "px");
        delay(duration, function () {
          return detach(element);
        });
      }
      if (entry.overlay) {
        var overlay = entry.overlay;
        entry.overlay = null;
        overlay.onclick = null;
        overlay.removeAttribute("id");
        overlay.style.opacity = "0";
        delay(duration, function () {
          return detach(overlay);
        });
      }
      var previous = entry.previousFocus;
      entry.previousFocus = null;
      if (entry.modal && previous && typeof previous.focus === "function" && document.body && document.body.contains(previous)) {
        focusNode(previous);
      }
    }
    var makeEntry = function makeEntry(element, position, extras) {
      var id = generateRandomId();
      element.id = id;
      var entry = {
        id: id,
        element: element,
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
        for (var key in extras) {
          if (hasOwn(extras, key)) entry[key] = extras[key];
        }
      }
      return entry;
    };
    var makeHandle = function makeHandle(entry) {
      return {
        id: entry.id,
        element: entry.element,
        hide: function hide() {
          return close(entry);
        },
        isOpen: function isOpen() {
          return !entry.closed;
        }
      };
    };
    var _hideAlerts = function _hideAlerts(callback) {
      var alerts = [];
      for (var i = 0; i < stack.length; i++) {
        if (stack[i].isAlert) alerts.push(stack[i]);
      }
      if (!alerts.length) return;
      var duration = getTransitionDuration();
      for (var _i = 0; _i < alerts.length; _i++) close(alerts[_i]);
      if (callback) delay(duration, callback);
    };
    var _hideAll = function _hideAll(callback) {
      var entries = stack.slice();
      var duration = getTransitionDuration();
      for (var i = entries.length - 1; i >= 0; i--) close(entries[i]);
      if (callback) delay(entries.length ? duration : 0, callback);
    };
    var buildTextbox = function buildTextbox(text, escape) {
      var elementText = document.createElement("div");
      addClass(elementText, options.classes.textbox);
      addClass(elementText, options.classes.backgroundInfo);
      var inner = document.createElement("div");
      addClass(inner, options.classes.textboxInner);
      render(inner, text, escape);
      elementText.appendChild(inner);
      return elementText;
    };
    var labelDialog = function labelDialog(element, textElement) {
      element.setAttribute("role", "dialog");
      element.setAttribute("aria-modal", "true");
      if (textElement) {
        textElement.id = "".concat(element.id, "-label");
        element.setAttribute("aria-labelledby", textElement.id);
      }
    };
    var _alert = function _alert() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _settings$type = settings.type,
        type = _settings$type === void 0 ? 4 : _settings$type,
        text = settings.text,
        _settings$stay = settings.stay,
        stay = _settings$stay === void 0 ? false : _settings$stay,
        _settings$position = settings.position,
        position = _settings$position === void 0 ? options.positions.alert : _settings$position;
      var _settings$time = settings.time,
        time = _settings$time === void 0 ? options.alertTime : _settings$time;
      var escape = shouldEscape(settings);
      _hideAlerts();
      var element = document.createElement("div");
      addClass(element, options.classes.textbox);
      addClass(element, typeToClass(type));
      addClass(element, options.classes.alert);
      element.setAttribute("role", "alert");
      element.setAttribute("aria-live", String(type) === "3" || String(type) === "error" ? "assertive" : "polite");
      var inner = document.createElement("div");
      addClass(inner, options.classes.textboxInner);
      render(inner, text, escape);
      element.appendChild(inner);
      var entry = makeEntry(element, position, {
        isAlert: true
      });
      element.onclick = function () {
        return close(entry);
      };
      entry.listener = function (event) {
        if (isEnter(event) || isEscape(event)) {
          event.preventDefault();
          close(entry);
        }
      };
      open(entry);
      if (time && time < 1) time = 1;
      if (!stay && time) entry.timer = delay(time, function () {
        return close(entry);
      });
      return makeHandle(entry);
    };
    var _force = function _force() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callbackArg = arguments.length > 1 ? arguments[1] : undefined;
      var _settings$type2 = settings.type,
        type = _settings$type2 === void 0 ? 5 : _settings$type2,
        text = settings.text,
        _settings$buttonText = settings.buttonText,
        buttonText = _settings$buttonText === void 0 ? "OK" : _settings$buttonText,
        callback = settings.callback,
        _settings$position2 = settings.position,
        position = _settings$position2 === void 0 ? options.positions.force : _settings$position2;
      var escape = shouldEscape(settings);
      _hideAlerts();
      var element = document.createElement("div");
      var entry = makeEntry(element, position, {
        modal: true,
        dismissible: false
      });
      var elementText = buildTextbox(text, escape);
      labelDialog(element, elementText);
      var elementButton = document.createElement("div");
      addClass(elementButton, typeToClass(type));
      makeButton(elementButton, buttonText, escape, function () {
        close(entry);
        if (callback) callback();else if (callbackArg) callbackArg();
      });
      element.appendChild(elementText);
      element.appendChild(elementButton);
      entry.listener = function (event) {
        if (isEnter(event)) {
          event.preventDefault();
          elementButton.click();
        }
      };
      open(entry);
      focusFirst(element);
      return makeHandle(entry);
    };
    var _confirm = function _confirm() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var submitCallbackArg = arguments.length > 1 ? arguments[1] : undefined;
      var cancelCallbackArg = arguments.length > 2 ? arguments[2] : undefined;
      var text = settings.text,
        _settings$submitText = settings.submitText,
        submitText = _settings$submitText === void 0 ? "Yes" : _settings$submitText,
        _settings$cancelText = settings.cancelText,
        cancelText = _settings$cancelText === void 0 ? "Cancel" : _settings$cancelText,
        submitCallback = settings.submitCallback,
        cancelCallback = settings.cancelCallback,
        _settings$position3 = settings.position,
        position = _settings$position3 === void 0 ? options.positions.confirm : _settings$position3;
      var escape = shouldEscape(settings);
      _hideAlerts();
      var element = document.createElement("div");
      var entry = makeEntry(element, position, {
        modal: true,
        dismissible: true
      });
      var elementText = buildTextbox(text, escape);
      labelDialog(element, elementText);
      var elementButtonLeft = document.createElement("div");
      addClass(elementButtonLeft, options.classes.elementHalf);
      addClass(elementButtonLeft, options.classes.backgroundSuccess);
      makeButton(elementButtonLeft, submitText, escape, function () {
        close(entry);
        if (submitCallback) submitCallback();else if (submitCallbackArg) submitCallbackArg();
      });
      var elementButtonRight = document.createElement("div");
      addClass(elementButtonRight, options.classes.elementHalf);
      addClass(elementButtonRight, options.classes.backgroundError);
      makeButton(elementButtonRight, cancelText, escape, function () {
        close(entry);
        if (cancelCallback) cancelCallback();else if (cancelCallbackArg) cancelCallbackArg();
      });
      entry.onDismiss = function () {
        return elementButtonRight.click();
      };
      element.appendChild(elementText);
      element.appendChild(elementButtonLeft);
      element.appendChild(elementButtonRight);
      entry.listener = function (event) {
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
    var OPTIONAL_INPUT_ATTRIBUTES = ["inputmode", "max", "maxlength", "min", "minlength", "pattern", "placeholder", "spellcheck"];
    var buildAllowedRegex = function buildAllowedRegex(allowed) {
      if (!allowed) return null;
      if (allowed instanceof RegExp) return allowed;
      if (Array.isArray(allowed)) {
        var regexString = "";
        for (var i = 0; i < allowed.length; i++) {
          if (allowed[i] === "an") regexString += "0-9a-zA-Z";else if (allowed[i] === "a") regexString += "a-zA-Z";else if (allowed[i] === "n") regexString += "0-9";
          if (allowed[i] === "s") regexString += " ";
        }
        if (!regexString) return null;
        return new RegExp("[^".concat(regexString, "]"), "g");
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
    var _input = function _input() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var submitCallbackArg = arguments.length > 1 ? arguments[1] : undefined;
      var cancelCallbackArg = arguments.length > 2 ? arguments[2] : undefined;
      var text = settings.text,
        _settings$submitText2 = settings.submitText,
        submitText = _settings$submitText2 === void 0 ? "Submit" : _settings$submitText2,
        _settings$cancelText2 = settings.cancelText,
        cancelText = _settings$cancelText2 === void 0 ? "Cancel" : _settings$cancelText2,
        submitCallback = settings.submitCallback,
        cancelCallback = settings.cancelCallback,
        _settings$position4 = settings.position,
        position = _settings$position4 === void 0 ? options.positions.input : _settings$position4;
      var escape = shouldEscape(settings);
      _hideAlerts();
      var element = document.createElement("div");
      var entry = makeEntry(element, position, {
        modal: true,
        dismissible: true
      });
      var elementText = buildTextbox(text, escape);
      labelDialog(element, elementText);
      var elementInput = document.createElement("input");
      addClass(elementInput, options.classes.inputField);
      for (var name in INPUT_ATTRIBUTE_DEFAULTS) {
        if (!hasOwn(INPUT_ATTRIBUTE_DEFAULTS, name)) continue;
        var value = settings[name] === void 0 || settings[name] === null ? INPUT_ATTRIBUTE_DEFAULTS[name] : settings[name];
        if (value !== "" && value !== false) elementInput.setAttribute(name, String(value));
      }
      for (var i = 0; i < OPTIONAL_INPUT_ATTRIBUTES.length; i++) {
        var _name = OPTIONAL_INPUT_ATTRIBUTES[i];
        var _value = settings[_name];
        if (_value === void 0 || _value === null || _value === "") continue;
        elementInput.setAttribute(_name, String(_value));
      }
      if (elementText.id) elementInput.setAttribute("aria-labelledby", elementText.id);
      elementInput.value = settings.value === void 0 || settings.value === null ? "" : String(settings.value);
      var allowedRegex = buildAllowedRegex(settings.allowed);
      if (allowedRegex) {
        elementInput.oninput = function () {
          var cleaned = elementInput.value.replace(allowedRegex, "");
          if (cleaned === elementInput.value) return;
          var caret = elementInput.selectionStart;
          var removed = elementInput.value.length - cleaned.length;
          elementInput.value = cleaned;
          if (typeof caret === "number" && elementInput.setSelectionRange) {
            var next = Math.max(0, caret - removed);
            try {
              elementInput.setSelectionRange(next, next);
            } catch (e) {}
          }
        };
      }
      var elementButtonLeft = document.createElement("div");
      addClass(elementButtonLeft, options.classes.elementHalf);
      addClass(elementButtonLeft, options.classes.backgroundSuccess);
      makeButton(elementButtonLeft, submitText, escape, function () {
        var value = elementInput.value;
        close(entry);
        if (submitCallback) submitCallback(value);else if (submitCallbackArg) submitCallbackArg(value);
      });
      var elementButtonRight = document.createElement("div");
      addClass(elementButtonRight, options.classes.elementHalf);
      addClass(elementButtonRight, options.classes.backgroundError);
      makeButton(elementButtonRight, cancelText, escape, function () {
        var value = elementInput.value;
        close(entry);
        if (cancelCallback) cancelCallback(value);else if (cancelCallbackArg) cancelCallbackArg(value);
      });
      entry.onDismiss = function () {
        return elementButtonRight.click();
      };
      element.appendChild(elementText);
      element.appendChild(elementInput);
      element.appendChild(elementButtonLeft);
      element.appendChild(elementButtonRight);
      entry.listener = function (event) {
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
    var _select = function _select() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var cancelCallbackArg = arguments.length > 1 ? arguments[1] : undefined;
      var text = settings.text,
        _settings$cancelText3 = settings.cancelText,
        cancelText = _settings$cancelText3 === void 0 ? "Cancel" : _settings$cancelText3,
        cancelCallback = settings.cancelCallback,
        _settings$choices = settings.choices,
        choices = _settings$choices === void 0 ? [] : _settings$choices,
        _settings$position5 = settings.position,
        position = _settings$position5 === void 0 ? options.positions.select : _settings$position5;
      var escape = shouldEscape(settings);
      _hideAlerts();
      var element = document.createElement("div");
      var entry = makeEntry(element, position, {
        modal: true,
        dismissible: true
      });
      var elementText = buildTextbox(text, escape);
      labelDialog(element, elementText);
      element.appendChild(elementText);
      var list = toArray(choices);
      var _loop = function _loop() {
        var choice = list[index] || {};
        var type = choice.type === void 0 || choice.type === null ? 1 : choice.type;
        var handler = choice.handler;
        var elementChoice = document.createElement("div");
        addClass(elementChoice, typeToClass(type));
        addClass(elementChoice, options.classes.selectChoice);
        var next = list[index + 1];
        if (next) {
          var nextType = next.type === void 0 || next.type === null ? 1 : next.type;
          if (String(nextType) === String(type)) {
            addClass(elementChoice, options.classes.selectChoiceRepeated);
          }
        }
        makeButton(elementChoice, choice.text, escape, function () {
          close(entry);
          if (typeof handler === "function") handler(choice);
        });
        element.appendChild(elementChoice);
      };
      for (var index = 0; index < list.length; index++) {
        _loop();
      }
      var elementCancel = document.createElement("div");
      addClass(elementCancel, options.classes.backgroundNeutral);
      makeButton(elementCancel, cancelText, escape, function () {
        close(entry);
        if (cancelCallback) cancelCallback();else if (cancelCallbackArg) cancelCallbackArg();
      });
      entry.onDismiss = function () {
        return elementCancel.click();
      };
      element.appendChild(elementCancel);
      entry.listener = function (event) {
        if (isEscape(event)) {
          event.preventDefault();
          elementCancel.click();
        }
      };
      open(entry);
      focusFirst(element);
      return makeHandle(entry);
    };
    var _date = function _date() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var submitCallbackArg = arguments.length > 1 ? arguments[1] : undefined;
      var cancelCallbackArg = arguments.length > 2 ? arguments[2] : undefined;
      var _settings$submitText3 = settings.submitText,
        submitText = _settings$submitText3 === void 0 ? "OK" : _settings$submitText3,
        _settings$cancelText4 = settings.cancelText,
        cancelText = _settings$cancelText4 === void 0 ? "Cancel" : _settings$cancelText4,
        submitCallback = settings.submitCallback,
        cancelCallback = settings.cancelCallback,
        _settings$position6 = settings.position,
        position = _settings$position6 === void 0 ? options.positions.date : _settings$position6;
      var escape = shouldEscape(settings);
      _hideAlerts();
      var provided = settings.value;
      var source = provided instanceof Date && !isNaN(provided.getTime()) ? provided : /* @__PURE__ */new Date();
      var value = new Date(source.getTime());
      var arrow = "&#9662;";
      var elementDateMonth = document.createElement("div");
      var elementDateDay = document.createElement("div");
      var elementDateYear = document.createElement("div");
      var setValueText = function setValueText() {
        elementDateMonth.textContent = options.dateMonths[value.getMonth()];
        elementDateDay.textContent = String(value.getDate());
        elementDateYear.textContent = String(value.getFullYear());
      };
      var setEditableText = function setEditableText(node, text) {
        if (node.textContent === text) return;
        node.textContent = text;
        if (!hasWindow || typeof window.getSelection !== "function") return;
        try {
          var range = document.createRange();
          range.selectNodeContents(node);
          range.collapse(false);
          var selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (e) {}
      };
      var handleDayInput = function handleDayInput(event) {
        var daysInMonth = new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate();
        var day = event.target.textContent.replace(/[^\d]/g, "").replace(/^0+/, "").slice(0, 2);
        if (Number(day) > daysInMonth) day = String(daysInMonth);
        setEditableText(event.target, day);
        if (!day) return;
        value.setDate(Number(day) < 1 ? 1 : Number(day));
      };
      var handleYearInput = function handleYearInput(event) {
        var year = event.target.textContent.replace(/[^\d]/g, "").replace(/^0+/, "").slice(0, 4);
        setEditableText(event.target, year);
        if (!year) return;
        value.setFullYear(Number(year));
      };
      var handleBlur = function handleBlur() {
        return setValueText();
      };
      var updateMonth = function updateMonth(amount) {
        var daysInNextMonth = new Date(value.getFullYear(), value.getMonth() + amount + 1, 0).getDate();
        if (value.getDate() > daysInNextMonth) value.setDate(daysInNextMonth);
        value.setMonth(value.getMonth() + amount);
        setValueText();
      };
      var updateDay = function updateDay(amount) {
        value.setDate(value.getDate() + amount);
        setValueText();
      };
      var updateYear = function updateYear(amount) {
        var nextYear = value.getFullYear() + amount;
        if (nextYear < 0) value.setFullYear(0);else value.setFullYear(nextYear);
        setValueText();
      };
      var element = document.createElement("div");
      var entry = makeEntry(element, position, {
        modal: true,
        dismissible: true
      });
      element.setAttribute("role", "dialog");
      element.setAttribute("aria-modal", "true");
      element.setAttribute("aria-label", "Choose a date");
      var elementDateSelector = document.createElement("div");
      addClass(elementDateSelector, options.classes.backgroundInfo);
      var elementDateSelectorInner = document.createElement("div");
      addClass(elementDateSelectorInner, options.classes.dateSelectorInner);
      var makeArrow = function makeArrow(up, label, onActivate) {
        var node = document.createElement("div");
        addClass(node, options.classes.elementThird);
        if (up) addClass(node, options.classes.dateSelectorUp);
        makeButton(node, arrow, false, onActivate);
        node.setAttribute("aria-label", label);
        return node;
      };
      var elementDateUpMonth = makeArrow(true, "Next month", function () {
        return updateMonth(1);
      });
      var elementDateUpDay = makeArrow(true, "Next day", function () {
        return updateDay(1);
      });
      var elementDateUpYear = makeArrow(true, "Next year", function () {
        return updateYear(1);
      });
      var elementDateDownMonth = makeArrow(false, "Previous month", function () {
        return updateMonth(-1);
      });
      var elementDateDownDay = makeArrow(false, "Previous day", function () {
        return updateDay(-1);
      });
      var elementDateDownYear = makeArrow(false, "Previous year", function () {
        return updateYear(-1);
      });
      addClass(elementDateMonth, options.classes.element);
      addClass(elementDateMonth, options.classes.elementThird);
      elementDateMonth.setAttribute("aria-live", "polite");
      var prepareEditable = function prepareEditable(node, label, onInput) {
        addClass(node, options.classes.element);
        addClass(node, options.classes.elementThird);
        node.setAttribute("contenteditable", "true");
        node.setAttribute("role", "textbox");
        node.setAttribute("inputmode", "numeric");
        node.setAttribute("aria-label", label);
        node.setAttribute("spellcheck", "false");
        node.addEventListener("input", onInput);
        node.addEventListener("blur", handleBlur);
        node.addEventListener("keydown", function (event) {
          if (isEnter(event)) event.preventDefault();
        });
      };
      prepareEditable(elementDateDay, "Day", handleDayInput);
      prepareEditable(elementDateYear, "Year", handleYearInput);
      setValueText();
      var elementButtonLeft = document.createElement("div");
      addClass(elementButtonLeft, options.classes.elementHalf);
      addClass(elementButtonLeft, options.classes.backgroundSuccess);
      makeButton(elementButtonLeft, submitText, escape, function () {
        var result = new Date(value.getTime());
        close(entry);
        if (submitCallback) submitCallback(result);else if (submitCallbackArg) submitCallbackArg(result);
      });
      var elementButtonRight = document.createElement("div");
      addClass(elementButtonRight, options.classes.elementHalf);
      addClass(elementButtonRight, options.classes.backgroundError);
      makeButton(elementButtonRight, cancelText, escape, function () {
        var result = new Date(value.getTime());
        close(entry);
        if (cancelCallback) cancelCallback(result);else if (cancelCallbackArg) cancelCallbackArg(result);
      });
      entry.onDismiss = function () {
        return elementButtonRight.click();
      };
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
      entry.listener = function (event) {
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
      alert: _alert,
      force: _force,
      confirm: _confirm,
      input: _input,
      select: _select,
      date: _date,
      setOptions: _setOptions,
      hideAlerts: _hideAlerts,
      hideAll: _hideAll
    };
    return __toCommonJS(notie_exports);
  }();
  return notie;
});
