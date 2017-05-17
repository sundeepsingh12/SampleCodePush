/**
 * # globalActions.js
 *
 * Actions that are global in nature
 */
'use strict'

const {
  SET_SESSION_TOKEN,
  SET_STORE,
  ON_GLOBAL_USERNAME_CHANGE,
  ON_GLOBAL_PASSWORD_CHANGE,
  SET_CREDENTIALS,
  LOGOUT_START,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  USER_SUMMARY,
  JOB_SUMMARY,
  IS_SHOW_MOBILE_NUMBER_SCREEN,
  IS_SHOW_OTP_SCREEN,
  IS_PRELOADER_COMPLETE

} = require('../../lib/constants').default

import {
  keyValueDBService
} from '../../services/classes/KeyValueDBService'

import CONFIG from '../../lib/config'

import {
  onChangePassword,
  onChangeUsername
} from '../login/loginActions'

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

/**
 * ## Logout actions
 */
export function logoutRequest() {
  return {
    type: LOGOUT_START
  }
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  }
}
export function logoutFailure(error) {
  return {
    type: LOGOUT_FAILURE,
    payload: error
  }
}

//Deletes values from store
export function deleteSessionToken() {
  return async function (dispatch) {
    try {
      await keyValueDBService.deleteValueFromStore(JOB_SUMMARY)
      await keyValueDBService.deleteValueFromStore(USER_SUMMARY)
      await keyValueDBService.deleteValueFromStore(IS_SHOW_MOBILE_NUMBER_SCREEN)
      await keyValueDBService.deleteValueFromStore(IS_SHOW_OTP_SCREEN)
      await keyValueDBService.deleteValueFromStore(IS_PRELOADER_COMPLETE)
       await keyValueDBService.deleteValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      dispatch(onChangePassword(''))
      dispatch(onChangeUsername(''))
    } catch (error) {
      throw error
    }
  }

}
