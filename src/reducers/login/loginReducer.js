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
const fieldValidation = require('../../lib/fieldValidation').default
const formValidation = require('./loginFormValidation').default

/**
 * ## Auth actions
 */
const {
  LOGOUT,
  LOGIN,

  LOGOUT_START,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,

  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  MASTER_DOWNLOAD_START,
  MASTER_DOWNLOAD_SUCCESS,

  CHECK_ASSET_START,
  CHECK_ASSET_SUCCESS,
  
  SET_STATE,
  ON_AUTH_FORM_FIELD_CHANGE,
} = require('../../lib/constants').default

const initialState = new InitialState()
/**
 * ## authReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function authReducer (state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch (action.type) {
    /**
     * ### Requests start
     * set the form to fetching and clear any errors
     */



    // case SESSION_TOKEN_REQUEST:
    // case SIGNUP_REQUEST:
    // case LOGOUT_REQUEST:
    // case LOGIN_REQUEST:
    // case RESET_PASSWORD_REQUEST:
    //   let nextState = state.setIn(['form', 'isFetching'], true)
    //   .setIn(['form', 'error'], null)
    //   return nextState



    /**
     * ### Logout state
     * The logged in user logs out
     * Clear the form's error and all the fields
     */


    // case LOGOUT:
    //   return formValidation(
    //   state.setIn(['form', 'state'], action.type)
    //     .setIn(['form', 'error'], null)
    //     .setIn(['form', 'fields', 'username'], '')
    //     .setIn(['form', 'fields', 'email'], '')
    //     .setIn(['form', 'fields', 'password'], '')
    //     .setIn(['form', 'fields', 'passwordAgain'], '')
    // )

    /**
     * ### Loggin in state
     * The user isn't logged in, and needs to
     * login, register or reset password
     *
     * Set the form state and clear any errors
     */


    // case LOGIN:
    //   return formValidation(
    //   state.setIn(['form', 'state'], action.type)
    //     .setIn(['form', 'error'], null)
    // )

    /**
     * ### Auth form field change
     *
     * Set the form's field with the value
     * Clear the forms error
     * Pass the fieldValidation results to the
     * the formValidation
     */

      case SET_CREDENTIALS:


    case ON_AUTH_FORM_FIELD_CHANGE: {
      const {field, value} = action.payload
      let nextState = state.setIn(['form', 'fields', field], value)
          .setIn(['form', 'error'], null)

      return formValidation(
      fieldValidation(nextState, action)
      , action)
    }

    /**
     * ### Requests start
     * Set the fetching flag so the forms will be disabled
     */
    case LOGIN_START:
      return state.setIn(['form', 'isFetching'], true)
                  .setIn(['form','currentStep'],'Login request initiated')


    /**
     * ### Requests end, good or bad
     * Set the fetching flag so the forms will be enabled
     */
    // case SESSION_TOKEN_SUCCESS:
    // case SESSION_TOKEN_FAILURE:
    // case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
    case LOGOUT_SUCCESS:
    // case RESET_PASSWORD_SUCCESS:
      return state.setIn(['form', 'isFetching'], false)
                  .setIn(['form','currentStep'],'Login success')

    /**
     *
     * The fetching is done, but save the error
     * for display to the user
     */
    // case SIGNUP_FAILURE:
    case LOGOUT_FAILURE:
    case LOGIN_FAILURE:
    // case RESET_PASSWORD_FAILURE:
      return state.setIn(['form', 'isFetching'], false)
      .setIn(['form', 'error'], action.payload)
          .setIn(['form','currentStep'],'Login failed')


    case MASTER_DOWNLOAD_START:
      return state.setIn(['form','currentStep'],'Job Master download initiated')

    case CHECK_ASSET_START:
      return state.setIn(['form','currentStep'],'Checking Assets')
    
    case CHECK_ASSET_SUCCESS:
      return state.setIn(['form','currentStep'],'Assets Verified')
    /**
     * ### Hot Loading support
     *
     * Set all the field values from the payload
     */
    case SET_STATE:
      var form = JSON.parse(action.payload).auth.form

      var next = state.setIn(['form', 'state'], form.state)
          .setIn(['form', 'disabled'], form.disabled)
          .setIn(['form', 'error'], form.error)
          .setIn(['form', 'isValid'], form.isValid)
          .setIn(['form', 'isFetching'], form.isFetching)
          .setIn(['form', 'fields', 'username'], form.fields.username)
          .setIn(['form', 'fields', 'usernameHasError'], form.fields.usernameHasError)
          .setIn(['form', 'fields', 'password'], form.fields.password)
          .setIn(['form', 'fields', 'passwordHasError'], form.fields.passwordHasError)

      return next

    // case DELETE_TOKEN_REQUEST:
    // case DELETE_TOKEN_SUCCESS:
        /**
         * no state change, just an ability to track action requests...
         */
      return state

  }
  /**
   * ## Default
   */
  return state
}
