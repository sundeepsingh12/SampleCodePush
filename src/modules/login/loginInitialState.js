/**
 * # authInitialState.js
 *
 * This class is a Immutable object
 * Working *successfully* with Redux, requires
 * state that is immutable.
 * In my opinion, that can not be by convention
 * By using Immutable, it's enforced.  Just saying....
 *
 */
'use strict'
/**
 * ## Import
 */
const { Record } = require('immutable')

/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
const Form = Record({
  authenticationService: '', //Possible values => Constants.SERVICE_PENDING/ RUNNING/ SUCCESS/ FAILED
  displayMessage: '',
  isButtonDisabled: true,
  startLogin: false,
  username: '',
  password: '',
  isCameraScannerActive: false,
  isEditTextDisabled: false,
  rememberMe: false,
})

/**
 * ## InitialState
 * The form is set
 */
var InitialState = Record({
  form: new Form()
})
export default InitialState
