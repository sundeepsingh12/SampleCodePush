/**
 * # globalActions.js
 *
 * Actions that are global in nature
 */
'use strict'

/**
 * ## Imports
 *
 * The actions supported
 */
const {
  SET_SESSION_TOKEN,
  SET_STORE,
  ON_GLOBAL_USERNAME_CHANGE,
  ON_GLOBAL_PASSWORD_CHANGE,
  SET_CREDENTIALS
} = require('../../lib/constants').default

/**
 * ## set the sessionToken
 *
 */
export function setSessionToken(sessionToken) {
  return {
    type: SET_SESSION_TOKEN,
    payload: sessionToken
  }
}

/**
 * ## set the store
 *
 * this is the Redux store
 *
 * this is here to support Hot Loading
 *
 */
export function setStore(store) {
  return {
    type: SET_STORE,
    payload: store
  }
}

/**Saves username and password in global state
 *
 * @param credentials
 * @return {{type: *, payload: *}}
 */
export function setCredentials(credentials) {
  return {
    type: SET_CREDENTIALS,
    payload: credentials
  }
}

export function checkConnection() {
  return {
    type: INTERNET_CONNECTION_STATUS
  }
}
