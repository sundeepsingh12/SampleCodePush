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
  ON_GLOBAL_PASSWORD_CHANGE
} = require('../../lib/constants').default

/**
 * ## set the sessionToken
 *
 */
export function setSessionToken (sessionToken) {
  return {
    type: SET_SESSION_TOKEN,
    payload: sessionToken
  }
}

/**
 * ## set the username
 *
 */
export function onChangeUsername (value) {
  return {
    type: ON_GLOBAL_USERNAME_CHANGE,
    payload: value
  }
}

/**
 * ## set the password
 *
 */
export function onChangePassword (value) {
  return {
    type: ON_GLOBAL_PASSWORD_CHANGE,
    payload: value
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
export function setStore (store) {
  return {
    type: SET_STORE,
    payload: store
  }
}
