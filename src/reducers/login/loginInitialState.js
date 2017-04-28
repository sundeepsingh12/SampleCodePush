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
const {Record} = require('immutable')

/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
const Form = Record({
  loginButtonDisabled: false,
  // error: null,
  // isValid: false,
  authenticationService: '', //Possible values => Constants.SERVICE_PENDING/ RUNNING/ SUCCESS/ FAILED
  displayMessage: '',
  // fields: new (Record({
    // username: '',
    // usernameHasError: false,
    // usernameErrorMsg: '',
    // password: '',
    // passwordHasError: false,
    // passwordErrorMsg: '',
    // showPassword: false
  // }))
})

/**
 * ## InitialState
 * The form is set
 */
var InitialState = Record({
  form: new Form()
})
export default InitialState
