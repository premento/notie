// Type definitions for notie
// Project: https://github.com/jaredreich/notie

export type NotiePosition = 'top' | 'bottom'

export type NotieType = 1 | 2 | 3 | 4 | 5 |
  'success' | 'warning' | 'error' | 'info' | 'neutral'

export interface NotieClasses {
  container?: string
  textbox?: string
  textboxInner?: string
  button?: string
  element?: string
  elementHalf?: string
  elementThird?: string
  overlay?: string
  backgroundSuccess?: string
  backgroundWarning?: string
  backgroundError?: string
  backgroundInfo?: string
  backgroundNeutral?: string
  backgroundOverlay?: string
  alert?: string
  inputField?: string
  selectChoice?: string
  selectChoiceRepeated?: string
  dateSelectorInner?: string
  dateSelectorUp?: string
}

export interface NotieOptions {
  alertTime?: number
  dateMonths?: string[]
  overlayClickDismiss?: boolean
  overlayOpacity?: number
  transitionCurve?: string
  transitionDuration?: number
  transitionSelector?: string
  /**
   * Render `text` and button labels as plain text instead of HTML.
   * Defaults to `false` for backwards compatibility. Turn this on whenever
   * any part of a string can come from user input.
   */
  escapeHtml?: boolean
  /** Skip transitions when the OS requests reduced motion. Default `true`. */
  respectReducedMotion?: boolean
  classes?: NotieClasses
  ids?: { overlay?: string }
  positions?: {
    alert?: NotiePosition
    force?: NotiePosition
    confirm?: NotiePosition
    input?: NotiePosition
    select?: NotiePosition
    date?: NotiePosition
  }
}

/** Handle returned by every notie method. */
export interface NotieHandle {
  readonly id: string
  readonly element: HTMLDivElement
  /** Dismiss this element immediately, without firing its callbacks. */
  hide (): void
  isOpen (): boolean
}

interface NotieCommon {
  position?: NotiePosition
  /** Per-call override of the global `escapeHtml` option. */
  escapeHtml?: boolean
}

export interface NotieAlertOptions extends NotieCommon {
  type?: NotieType
  text: string
  stay?: boolean
  time?: number
}

export interface NotieForceOptions extends NotieCommon {
  type?: NotieType
  text: string
  buttonText?: string
  callback?: () => void
}

export interface NotieConfirmOptions extends NotieCommon {
  text: string
  submitText?: string
  cancelText?: string
  submitCallback?: () => void
  cancelCallback?: () => void
}

export interface NotieInputOptions extends NotieCommon {
  text: string
  submitText?: string
  cancelText?: string
  submitCallback?: (value: string) => void
  cancelCallback?: (value: string) => void
  autocapitalize?: string
  autocomplete?: string
  autocorrect?: string
  autofocus?: boolean | string
  inputmode?: string
  max?: string | number
  maxlength?: string | number
  min?: string | number
  minlength?: string | number
  pattern?: string
  placeholder?: string
  spellcheck?: string | boolean
  step?: string | number
  type?: string
  value?: string
  /**
   * As-you-type restriction. An array of 'an' | 'a' | 'n' | 's' shorthands,
   * or a RegExp matching the characters to strip.
   */
  allowed?: Array<'an' | 'a' | 'n' | 's'> | RegExp | string
}

export interface NotieChoice {
  type?: NotieType
  text: string
  handler: (choice: NotieChoice) => void
}

export interface NotieSelectOptions extends NotieCommon {
  text: string
  cancelText?: string
  cancelCallback?: () => void
  choices: NotieChoice[]
}

export interface NotieDateOptions extends NotieCommon {
  value?: Date
  submitText?: string
  cancelText?: string
  submitCallback?: (date: Date) => void
  cancelCallback?: (date: Date) => void
}

export function alert (options: NotieAlertOptions): NotieHandle
export function force (
  options: NotieForceOptions,
  callback?: () => void
): NotieHandle
export function confirm (
  options: NotieConfirmOptions,
  submitCallback?: () => void,
  cancelCallback?: () => void
): NotieHandle
export function input (
  options: NotieInputOptions,
  submitCallback?: (value: string) => void,
  cancelCallback?: (value: string) => void
): NotieHandle
export function select (
  options: NotieSelectOptions,
  cancelCallback?: () => void
): NotieHandle
export function date (
  options: NotieDateOptions,
  submitCallback?: (date: Date) => void,
  cancelCallback?: (date: Date) => void
): NotieHandle

export function setOptions (options: NotieOptions): NotieOptions
export function hideAlerts (callback?: () => void): void
/** Dismiss everything notie currently has on screen, dialogs included. */
export function hideAll (callback?: () => void): void

declare const notie: {
  alert: typeof alert
  force: typeof force
  confirm: typeof confirm
  input: typeof input
  select: typeof select
  date: typeof date
  setOptions: typeof setOptions
  hideAlerts: typeof hideAlerts
  hideAll: typeof hideAll
}

export default notie
