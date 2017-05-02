'use strict'
const {
  SET_CREDENTIALS,

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

  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,

  DELETE_TOKEN_REQUEST,
  DELETE_TOKEN_SUCCESS,

  ON_LOGIN_USERNAME_CHANGE,
  ON_LOGIN_PASSWORD_CHANGE,

  IS_PRELOADER_COMPLETE

} = require('../../lib/constants').default

const BackendFactory = require('../../lib/BackendFactory').default

import { Actions } from 'react-native-router-flux'
import { keyValueDB } from '../../repositories/keyValueDb'
import { authenticationService } from '../../services/classes/Authentication'
import CONFIG from '../../lib/config'

/**
 * ## State actions
 * controls which form is displayed to the user
 * as in login, register, logout or reset password
 */

export function logoutState() {
  return {
    type: LOGOUT
  }
}

export function loginState() {
  return {
    type: LOGIN
  }
}

/**
 * ## Login actions
 */
export function loginRequest() {
  return {
    type: LOGIN_START
  }
}

export function loginSuccess(j_sessionid) {
  return {
    type: LOGIN_SUCCESS,
    payload: j_sessionid
  }
}

export function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    payload: error
  }
}

/**
 * ## SessionToken actions
 */
export function sessionTokenRequest() {
  return {
    type: SESSION_TOKEN_REQUEST
  }
}
export function sessionTokenRequestSuccess(token) {
  return {
    type: SESSION_TOKEN_SUCCESS,
    payload: token
  }
}
export function sessionTokenRequestFailure(error) {
  return {
    type: SESSION_TOKEN_FAILURE,
    payload: error === undefined ? null : error
  }
}

/**
 * ## onAuthFormFieldChange
 * Set the payload so the reducer can work on it
 */
export function onAuthFormFieldChange(field, value) {
  return {
    type: ON_AUTH_FORM_FIELD_CHANGE,
    payload: { field: field, value: value }
  }
}


/**
 * ## set the username
 *
 */
export function onChangeUsername(value) {
  return {
    type: ON_LOGIN_USERNAME_CHANGE,
    payload: value
  }
}

/**
 * ## set the password
 *
 */
export function onChangePassword(value) {
  return {
    type: ON_LOGIN_PASSWORD_CHANGE,
    payload: value
  }
}

/**
 * ## Login
 * @param {string} username - user's name
 * @param {string} password - user's password
 *
 * After calling Backend, if response is good, save the json
 * which is the currentUser which contains the sessionToken
 *
 * If successful, set the state to logout
 * otherwise, dispatch a failure
 */

export function authenticateUser(username, password) {
  return async function (dispatch) {
    try {
      console.log("authenticateUser called")
      dispatch(loginRequest())
      const j_sessionid = await authenticationService.login(username, password)
      await authenticationService.storeSessionToken(j_sessionid)
      dispatch(loginSuccess(j_sessionid))
      Actions.Preloader()
    }
    catch (error) {
      dispatch(loginFailure(error))
    }
  }
}

/**
 * ## Token
 * If AppAuthToken has the sessionToken, the user is logged in
 * so set the state to logout.
 * Otherwise, the user will default to the login in screen.
 */
export function getSessionToken() {
  return async function (dispatch) {
    try {
      console.log("getSessionToken")
      dispatch(sessionTokenRequest())
      const token = await keyValueDB.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      const isPreloaderComplete =  await keyValueDB.getValueFromStore(IS_PRELOADER_COMPLETE)
      if (token && isPreloaderComplete) {
        dispatch(sessionTokenRequestSuccess(token))
        Actions.Tabbar()
      } else if(token){
          dispatch(sessionTokenRequestFailure())
          Actions.Preloader()
      }
      else{
          dispatch(sessionTokenRequestSuccess(token))
          Actions.InitialLoginForm()
      }
    }
    catch (error) {
      dispatch(sessionTokenRequestFailure(error))
      dispatch(loginState())
      Actions.InitialLoginForm()
    }
  }
}

/**
 * ## Logout
 * After dispatching the logoutRequest, get the sessionToken
 *
 *
 * When the response is received and it's valid
 * change the state to register and finish the logout
 *
 * But if the call fails, like expired token or
 * no network connection, just send the failure
 *
 * And if you fail due to an invalid sessionToken, be sure
 * to delete it so the user can log in.
 *
 * How could there be an invalid sessionToken?  Maybe they
 * haven't used the app for a long time.  Or they used another
 * device and logged out there.
 */
export function logout() {
  return async function (dispatch) {
    try {
      dispatch(logoutRequest())
      const token = await keyValueDB.getValueFromStore()
      await BackendFactory(token).logout()
      dispatch(logoutSuccess())
      dispatch(deleteSessionToken())
      Actions.InitialLoginForm()
    }
    catch (error) {
      dispatch(logoutFailure(error))
    }
  }
}
