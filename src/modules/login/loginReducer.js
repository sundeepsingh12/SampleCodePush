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
import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  FORGET_PASSWORD,
  ON_LONG_PRESS_ICON,
  ON_LOGIN_USERNAME_CHANGE,
  ON_LOGIN_PASSWORD_CHANGE,
  TOGGLE_CHECKBOX,
  REMEMBER_ME_SET_TRUE,
  RESET_STATE,
  SET_LOGIN_PARAMETERS
} from '../../lib/constants'

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
    case FORGET_PASSWORD:
    case LOGIN_START:
      return state.setIn(['form', 'authenticationService'], true)
        .setIn(['form', 'displayMessage'], '')
        .setIn(['form', 'isButtonDisabled'], true)
        .setIn(['form','isEditTextEnabled'],false)


    /**
     * ### Requests end, good or bad
     * Set the fetching flag so the forms will be enabled
     */
    case LOGIN_SUCCESS:

      return state.setIn(['form', 'authenticationService'], false)
        .setIn(['form', 'displayMessage'], '')
        .setIn(['form', 'isButtonDisabled'], false)
        .setIn(['form','isEditTextEnabled'],true)


    case ON_LONG_PRESS_ICON:

      return state.setIn(['form', 'isLongPress'], action.payload)


    case LOGIN_FAILURE:
      return state.setIn(['form', 'authenticationService'], false)
        .setIn(['form', 'displayMessage'], action.payload.error)
        .setIn(['form','password'],(action.payload.code == 401) ? '' : state.form.password)
        .setIn(['form','isEditTextEnabled'],true)
        .setIn(['form','isButtonDisabled'],(action.payload.code == 401) ? true : false)

    case ON_LOGIN_USERNAME_CHANGE:
      const username = action.payload
      const passwordState = state.form.password
      if (username && passwordState) {
        return state.setIn(['form', 'username'], username)
          .setIn(['form', 'isButtonDisabled'], false)
      } else {
        return state.setIn(['form', 'username'], username)
          .setIn(['form', 'isButtonDisabled'], true)
      }

    case ON_LOGIN_PASSWORD_CHANGE:
      const password = action.payload
      const usernameState = state.form.username
      if (usernameState && password) {
        return state.setIn(['form', 'password'], password)
          .setIn(['form', 'isButtonDisabled'], false)
      } else {
        return state.setIn(['form', 'password'], password)
          .setIn(['form', 'isButtonDisabled'], true)
      }

    case TOGGLE_CHECKBOX:
      return state.setIn(['form', 'rememberMe'], !state.form.rememberMe)

    case REMEMBER_ME_SET_TRUE:
      return state.setIn(['form', 'rememberMe'], true)

    case SET_LOGIN_PARAMETERS:
      let isButtonDisabled = action.payload.password && action.payload.username ? false : true;
      return state.setIn(['form', 'password'], action.payload.password)
        .setIn(['form', 'username'], action.payload.username)
        .setIn(['form', 'logo'], action.payload.logo)
        .setIn(['form', 'rememberMe'], action.payload.rememberMe)
        .setIn(['form', 'isButtonDisabled'], isButtonDisabled)

    case RESET_STATE:
      return initialState
  }
  return state
}
