# notie

[![npm](https://img.shields.io/npm/v/notie.svg)](https://www.npmjs.com/package/notie)
[![cdnjs](https://img.shields.io/cdnjs/v/notie.svg)](https://cdnjs.com/libraries/notie)

> notie is a clean and simple notification, input, and selection suite for javascript, with no dependencies

Live demo: [https://jaredreich.com/notie](https://jaredreich.com/notie)

#### With notie you can:
* Alert users
* Confirm user choices
* Allow users to input information
* Allow users to select choices
* Allow users to select dates

![Alt text](/demo.gif?raw=true "Demo")

## Features

* Pure JavaScript, no dependencies and no polyfills required, written in ES6
* Easily customizable
* Change colors to match your style/brand
* Modify styling with the sass file (notie.scss) or overwrite the CSS
* Font size auto-adjusts based on screen size
* Accessible: dialogs are exposed as `role="dialog"`, alerts as `role="alert"`,
  buttons are keyboard operable and focus is trapped and restored
* Honours `prefers-reduced-motion`
* Ships TypeScript definitions

## Browser Support

The UMD bundles (`dist/notie.js`, `dist/notie.min.js`) are compiled to ES5 and
use no ES6 runtime APIs, so no polyfill is needed:

* IE 10+
* Chrome 11+
* Firefox 4+
* Safari 5.1+
* Opera 11.5+

`dist/notie.esm.js` targets ES2017 and is what bundlers pick up via the
`module` / `exports` fields.

Progressive enhancements degrade quietly on older engines: `prefers-reduced-motion`,
`:focus-visible` focus rings and `crypto.randomUUID` are all feature-detected.

## Installation

#### HTML:
```html
<head>
  ...
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/notie/dist/notie.min.css">
  <style>
    /* override styles here */
    .notie-container {
      box-shadow: none;
    }
  </style>
</head>
<body>
  ...
  <!-- Bottom of body -->
  <script src="https://unpkg.com/notie"></script>
</body>
```

#### npm:
```bash
npm install notie
```


## Usage

#### ES6:
```js
import notie from 'notie'
// or
import { alert, force, confirm, input, select, date, setOptions, hideAlerts, hideAll } from 'notie'
```

#### Browser:
```js
notie
// or
window.notie
```

## Security

By default `text` and every button label are inserted as **HTML**, which is what
makes `notie.alert({ text: 'Warning<br><b>with</b> HTML' })` work. That also
means any untrusted value you interpolate into those strings is an XSS sink:

```js
// DANGEROUS if `comment` came from a user
notie.alert({ text: 'New comment: ' + comment })
```

Turn on `escapeHtml` to render strings as inert text instead. It can be set
globally or per call:

```js
// globally - recommended for apps that show user-generated content
notie.setOptions({ escapeHtml: true })

// or per call
notie.alert({ text: untrustedValue, escapeHtml: true })
```

The default stays `false` for backwards compatibility. If you only need markup
in a few places, switch escaping on globally and pass `escapeHtml: false` for
the specific calls that need HTML.

#### Available methods:

Every method returns a handle so you can dismiss an element yourself:

```js
const handle = notie.alert({ text: 'Saving...', stay: true })
handle.id       // the generated DOM id
handle.element  // the container element
handle.isOpen() // => true
handle.hide()   // dismiss without firing any callback
```

```js
notie.alert({
  type: Number|String, // optional, default = 4, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
  text: String,
  stay: Boolean, // optional, default = false
  time: Number, // optional, default = 3, minimum = 1,
  position: String // optional, default = 'top', enum: ['top', 'bottom']
})

notie.force({
  type: Number|String, // optional, default = 5, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
  text: String,
  buttonText: String, // optional, default = 'OK'
  position: String, // optional, default = 'top', enum: ['top', 'bottom']
  callback: Function // optional
}, callbackOptional())

notie.confirm({
  text: String,
  submitText: String, // optional, default = 'Yes'
  cancelText: String, // optional, default = 'Cancel'
  position: String, // optional, default = 'top', enum: ['top', 'bottom']
  submitCallback: Function, // optional
  cancelCallback: Function // optional
}, submitCallbackOptional(), cancelCallbackOptional())

notie.input({
  text: String,
  submitText: String, // optional, default = 'Submit'
  cancelText: String, // optional, default = 'Cancel'
  position: String, // optional, default = 'top', enum: ['top', 'bottom']
  submitCallback: Function(value), // optional
  cancelCallback: Function(value), // optional
  autocapitalize: 'words', // default: 'none'
  autocomplete: 'on', // default: 'off'
  autocorrect: 'off', // default: 'off'
  autofocus: false, // default: true - set false to leave the field unfocused
  inputmode: 'numeric', // optional, omitted unless provided
  max: '10000', // optional, omitted unless provided
  maxlength: '10', // optional, omitted unless provided
  min: '5', // optional, omitted unless provided
  minlength: '1', // optional, omitted unless provided
  pattern: '[0-9]*', // optional, omitted unless provided
  placeholder: 'Jane Smith', // optional, omitted unless provided
  value: String, // default: ''
  spellcheck: 'false', // optional, omitted unless provided
  step: '5', // default: 'any'
  type: 'text', // default: 'text'
  allowed: ['an', 's'] // Default: null, 'an' = alphanumeric, 'a' = alpha, 'n' = numeric, 's' = spaces allowed. Can be custom RegExp, ex. allowed: new RegExp('[^0-9]', 'g')
}, submitCallbackOptional(value), cancelCallbackOptional(value))

notie.select({
  text: String,
  cancelText: String, // optional, default = 'Cancel'
  position: String, // optional, default = 'bottom', enum: ['top', 'bottom']
  choices: [
    {
      type: Number|String, // optional, default = 1
      text: String,
      handler: Function
    }
    ...
  ],
  cancelCallback: Function // optional
}, cancelCallbackOptional())

notie.date({
  value: Date,
  submitText: String, // optional, default = 'OK'
  cancelText: String, // optional, default = 'Cancel'
  position: String, // optional, default = 'top', enum: ['top', 'bottom']
  submitCallback: Function(date), // optional
  cancelCallback: Function(date) // optional
}, submitCallbackOptional(date), cancelCallbackOptional(date))
```

#### For example:
```js
notie.alert({ text: 'Info!' })
notie.alert({ type: 1, text: 'Success!', stay: true }) // Never hides unless clicked, or escape or enter is pressed
notie.alert({ type: 'success', text: 'Success!', time: 2 }) // Hides after 2 seconds
notie.alert({ type: 2, text: 'Warning<br><b>with</b><br><i>HTML</i><br><u>included.</u>' })
notie.alert({ type: 'warning', text: 'Watch it...' })
notie.alert({ type: 3, text: 'Error.', position: 'bottom' })
notie.alert({ type: 'error', text: 'Oops!' })
notie.alert({ type: 4, text: 'Information.' })
notie.alert({ type: 'info', text: 'FYI, blah blah blah.' })

notie.force({
  type: 3,
  text: 'You cannot do that, sending you back.',
  buttonText: 'OK',
  callback: function () {
    notie.alert({ type: 3, text: 'Maybe when you\'re older...' })
  }
})

notie.confirm({
  text: 'Are you sure you want to do that?<br><b>That\'s a bold move...</b>',
  cancelCallback: function () {
    notie.alert({ type: 3, text: 'Aw, why not? :(', time: 2 })
  },
  submitCallback: function () {
    notie.alert({ type: 1, text: 'Good choice! :D', time: 2 })
  }
})
notie.confirm({ text: 'Are you sure?' }, function() {
  notie.confirm({ text: 'Are you <b>really</b> sure?' }, function() {
    notie.confirm({ text: 'Are you <b>really</b> <i>really</i> sure?' }, function() {
      notie.alert({ text: 'Okay, jeez...' })
    })
  })
})

notie.input({
  text: 'Please enter your email:',
  submitText: 'Submit',
  cancelText: 'Cancel',
  cancelCallback: function (value) {
    notie.alert({ type: 3, text: 'You cancelled with this value: ' + value })
  },
  submitCallback: function (value) {
    notie.alert({ type: 1, text: 'You entered: ' + value })
  },
  value: 'jane@doe.com',
  type: 'email',
  placeholder: 'name@example.com'
})

notie.input({
  text: 'Please enter your name:',
  type: 'text',
  placeholder: 'Jane Doe',
  allowed: ['a', 's']
}, function(value) {
  notie.alert({ type: 1, text: 'You entered: ' + value })
}, function(value) {
  notie.alert({ type: 3, text: 'You cancelled with this value: ' + value })
})

notie.input({
  text: 'Please enter the price:',
  cancelCallback: function (value) {
    notie.alert({ type: 3, text: 'You cancelled with this value: ' + value })
  },
  submitCallback: function (value) {
    notie.alert({ type: 1, text: 'You entered: ' + value })
  },
  type: 'text',
  placeholder: '500',
  allowed: new RegExp('[^0-9]', 'g')
})

notie.select({
  text: 'Demo item #1, owner is Jane Smith',
  cancelText: 'Close',
  cancelCallback: function () {
    notie.alert({ type: 5, text: 'Cancel!' })
  },
  choices: [
    {
      text: 'Share',
      handler: function () {
        notie.alert({ type: 1, text: 'Share item!' })
      }
    },
    {
      text: 'Open',
      handler: function () {
        notie.alert({ type: 1, text: 'Open item!' })
      }
    },
    {
      type: 2,
      text: 'Edit',
      handler: function () {
        notie.alert({ type: 2, text: 'Edit item!' })
      }
    },
    {
      type: 3,
      text: 'Delete',
      handler: function () {
        notie.alert({ type: 3, text: 'Delete item!' })
      }
    }
  ]
})

function date() {
  notie.date({
    value: new Date(2015, 8, 27),
    cancelCallback: function (date) {
      notie.alert({ type: 3, text: 'You cancelled: ' + date.toISOString() })
    },
    submitCallback: function (date) {
      notie.alert({ type: 1, text: 'You selected: ' + date.toISOString() })
    }
  })
}
```

#### Use ES6 for nicer code and to inherit `this`:
``` javascript
notie.confirm({
  text: 'Leave the page?',
  submitCallback: () => this.location.href = 'https://google.com'
})

notie.confirm({
  text: 'Is ES6 great?',
  cancelCallback: () => notie.alert({ type: 3, text: 'Why not?' }),
  submitCallback: () => notie.alert({ type: 1, text: 'I Agree' })
})

notie.force({
  type: 3,
  text: 'You cannot do that, sending you back.',
  buttonText: 'OK',
  callback: () => notie.alert({ type: 3, text: 'Maybe when you\'re older...' })
})
```

## Custom Styles

#### SASS:
```scss
// Before notie is imported:
$notie-color-success: #57BF57;
$notie-color-warning: #D6A14D;
$notie-color-error: #E1715B;
$notie-color-info: #4D82D6;
$notie-color-neutral: #A0A0A0;
// See all overwriteable variables in src/notie.scss

// Then import notie:
@import '../../node_modules/notie/src/notie';
```

#### CSS:
```css
/* After notie styles are applied to DOM: */
.notie-container {
  box-shadow: none;
}
```

## Options & Methods

```js
// Showing all available options with defaults
notie.setOptions({
  alertTime: 3,
  dateMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  overlayClickDismiss: true,
  overlayOpacity: 0.75,
  transitionCurve: 'ease',
  transitionDuration: 0.3,
  transitionSelector: 'all',
  escapeHtml: false, // render text/labels as plain text - see Security above
  respectReducedMotion: true, // skip transitions when the OS asks for reduced motion
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
    alert: 'top',
    force: 'top',
    confirm: 'top',
    input: 'top',
    select: 'bottom',
    date: 'top'
  }
})
```

```js
// programmatically hide all alerts with an optional callback function
notie.hideAlerts(callbackOptional)

// programmatically hide everything notie has on screen, dialogs included
notie.hideAll(callbackOptional)
```

## Accessibility

* `force`, `confirm`, `input`, `select` and `date` render as `role="dialog"`
  with `aria-modal="true"`, labelled by their own text element.
* `alert` renders as `role="alert"`, with `aria-live="assertive"` for errors
  and `"polite"` otherwise.
* Buttons are `role="button"` with `tabindex="0"` and respond to Enter and
  Space. They remain `<div>` elements, so existing CSS selectors keep working.
* Focus moves into a dialog when it opens, is trapped with Tab/Shift+Tab while
  it is open, and is returned to the previously focused element on close.
* Keyboard handling uses `event.key` (with `keyCode` as a fallback) and is
  routed only to the top-most element, so one Enter press cannot trigger two
  dialogs.

## Development

```bash
npm install
npm run build   # writes dist/
npm run dev     # rebuild on change
```

The build is `esbuild` (bundling + minification), `babel` (ES5 downlevel) and
`dart-sass`, driven by [build.mjs](build.mjs). It produces:

| File | Format | Target |
| --- | --- | --- |
| `dist/notie.js` | UMD | ES5 |
| `dist/notie.min.js` | UMD, minified | ES5 |
| `dist/notie.esm.js` | ES module | ES2017 |
| `dist/notie.css` / `dist/notie.min.css` | CSS | - |
| `dist/notie.d.ts` | TypeScript definitions | - |

A browser regression suite lives in [test/index.html](test/index.html):

```bash
node scripts/serve.mjs   # then open http://localhost:8731/test/
```

## License
MIT
