/**
 * # authReducer.js
 *
 * The reducer for all the actions from the various log states
 */
'use strict'
/**
 * ## Imports
 * The InitialState for login
 * fieldValidation for validating the fields
 * formValidation for setting the form's valid flag
 */
const InitialState = require('./loginInitialState').default

/**
 * ## Auth actions
 */
const {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_CAMERA_SCANNER,

  SET_STATE,
  ON_LOGIN_USERNAME_CHANGE,
  ON_LOGIN_PASSWORD_CHANGE,
  TOGGLE_CHECKBOX,
} = require('../../lib/constants').default

const initialState = new InitialState()
/**
 * ## authReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function authReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch (action.type) {


    /**
     * ### Requests start
     * Set the fetching flag so the forms will be disabled
     */
    case LOGIN_START:
      return state.setIn(['form', 'authenticationService'], 'true')
        .setIn(['form', 'displayMessage'], 'Login request initiated')
        .setIn(['form', 'isButtonDisabled'], true)
        .setIn(['form','isEditTextDisabled'],true)


    /**
     * ### Requests end, good or bad
     * Set the fetching flag so the forms will be enabled
     */
    case LOGIN_SUCCESS:

      return state.setIn(['form', 'authenticationService'], false)
        .setIn(['form', 'displayMessage'], 'Login success')
        .setIn(['form', 'isButtonDisabled'], false)
        .setIn(['form','isEditTextDisabled'],false)


    case LOGIN_FAILURE:
      return state.setIn(['form', 'authenticationService'], false)
        .setIn(['form', 'displayMessage'], action.payload)
        .setIn(['form','password'],'')
        .setIn(['form','isEditTextDisabled'],false)

    /**
     * ### Hot Loading support
     *
     * Set all the field values from the payload
     */
    case SET_STATE:
      var form = JSON.parse(action.payload).auth.form

      var next = state.setIn(['form', 'state'], form.state)
        .setIn(['form', 'displayMessage'], form.displayMessage)
        .setIn(['form', 'authenticationService'], form.authenticationService)

      return next

    case ON_LOGIN_USERNAME_CHANGE:
      const username = action.payload
      console.log(state.form.password)
      const passwordState = state.form.password
      if (username  && passwordState ) {
        var next = state.setIn(['form', 'username'], username)
          .setIn(['form', 'isButtonDisabled'], false)
      } else {
        var next = state.setIn(['form', 'username'], username)
          .setIn(['form', 'isButtonDisabled'], true)
      }
      return next

    case ON_LOGIN_PASSWORD_CHANGE:
      const password = action.payload
      const usernameState = state.form.username
      if (usernameState && password) {
        var next = state.setIn(['form', 'password'], password)
          .setIn(['form', 'isButtonDisabled'], false)
      } else {
        var next = state.setIn(['form', 'password'], password)
          .setIn(['form', 'isButtonDisabled'], true)
      }
      return next

      case LOGIN_CAMERA_SCANNER:
        var next = state.setIn(['form', 'isCameraScannerActive'], action.payload)
        return next
      
      case TOGGLE_CHECKBOX:
       return state.setIn(['form','rememberMe'],!state.form.rememberMe)
  }
  /**
   * ## Default
   */
  return state
}
