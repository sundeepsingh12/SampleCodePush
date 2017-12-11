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
  LOGIN_CAMERA_SCANNER,

  SET_STATE,
  ON_LOGIN_USERNAME_CHANGE,
  ON_LOGIN_PASSWORD_CHANGE,
  TOGGLE_CHECKBOX,
  REMEMBER_ME_SET_TRUE,
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
    case LOGIN_START:
      return state.setIn(['form', 'authenticationService'], true)
        .setIn(['form', 'displayMessage'], '')
        .setIn(['form', 'isButtonDisabled'], true)
        .setIn(['form','isEditTextDisabled'],true)


    /**
     * ### Requests end, good or bad
     * Set the fetching flag so the forms will be enabled
     */
    case LOGIN_SUCCESS:

      return state.setIn(['form', 'authenticationService'], false)
        .setIn(['form', 'displayMessage'], '')
        .setIn(['form', 'isButtonDisabled'], false)
        .setIn(['form','isEditTextDisabled'],false)


    case LOGIN_FAILURE:
      return state.setIn(['form', 'authenticationService'], false)
        .setIn(['form', 'displayMessage'], action.payload)
        .setIn(['form','password'],'')
        .setIn(['form','isEditTextDisabled'],false)
        .setIn(['form','isButtonDisabled'],true)

    case ON_LOGIN_USERNAME_CHANGE:
      const username = action.payload
      const passwordState = state.form.password
      if (username  && passwordState ) {
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
       return state.setIn(['form','rememberMe'],!state.form.rememberMe)

      case REMEMBER_ME_SET_TRUE:
        return state.setIn(['form','rememberMe'],true)
  }
  return state
}
