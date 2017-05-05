/**
 * # globalReducer.js
 *
 *
 */
'use strict'
/**
 * ## Imports
 * The InitialState for login
 * fieldValidation for validating the fields
 * formValidation for setting the form's valid flag
 */
const {
  SET_SESSION_TOKEN,

  GET_PROFILE_SUCCESS,
  SIGNUP_SUCCESS,
  LOGIN_SUCCESS,
  SESSION_TOKEN_SUCCESS,

  LOGOUT_START,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,

  GET_STATE,
  SET_STATE,
  SET_STORE,
  ON_GLOBAL_USERNAME_CHANGE,
  ON_GLOBAL_PASSWORD_CHANGE,
  INTERNET_CONNECTION_STATUS,
  SET_CREDENTIALS


} = require('../../lib/constants').default

import InitialState from './globalInitialState'

const initialState = new InitialState()
/**
 * ## globalReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function globalReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.merge(state)

  switch (action.type) {
    /**
     * ### Save the sessionToken
     */
    case SET_SESSION_TOKEN:
      return state.set('sessionToken', action.payload)

    /**
     * ### Save the payload in the store
     *
     * This payload is the ```currentUser``` object returned by
     * the server.  It contains the ```sessionToken``` and the user's
     * ```objectId``` which will be needed for some calls to the server
     */
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
    case GET_PROFILE_SUCCESS:
      return state.set('currentUser', action.payload)

    case SESSION_TOKEN_SUCCESS:
      return state.set('currentUser', action.payload.sessionToken)

    /**
     * ### Clear currentUser
     *
     *
     *
     *
     */
    case LOGOUT_SUCCESS:

      return state.set('currentUser', null)

    /**
     * ### sets the payload into the store
     *
     * *Note* this is for support of Hot Loading - the payload is the
     * ```store``` itself.
     *
     */
    case SET_STORE:
      return state.set('store', action.payload)

    /**
     * ### Get the current state from the store
     *
     * The Redux ```store``` provides the state object.
     * We convert each key to JSON and set it in the state
     *
     * *Note*: the global state removes the ```store```, otherwise,
     * when trying to convert to JSON, it will be recursive and fail
     */
    case GET_STATE:
      let _state = state.store.getState()

      if (action.payload) {
        let newState = {}
        newState['auth'] = _state.auth.toJS()
        newState['device'] = _state.device.toJS()
        newState['profile'] = _state.profile.toJS()

        // Make sure global doesn't have the previous currentState
        // let _noCurrentState =  _state.global.set('currentState',null);
        // let _noStore = _noCurrentState.set('store',null);

        newState['global'] = _state.global.set('currentState', null).set('store', null).toJS()

        return state.set('showState', action.payload)
          .set('currentState', newState)
      } else {
        return state.set('showState', action.payload)
      }

    /**
     * ### Set the state
     *
     * This is in support of Hot Loading
     *
     */
    case SET_STATE:
      var global = JSON.parse(action.payload).global
      var next = state.set('currentUser', global.currentUser)
        .set('showState', false)
        .set('currentState', null)
      return next

    case SET_CREDENTIALS:
      return state.set('username', action.payload.username
        .set('password', action.payload.password))

    case INTERNET_CONNECTION_STATUS:
      return state.set('')
    
    case LOGOUT_START:


  }

  return state
}
