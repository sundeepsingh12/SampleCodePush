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
  LOGIN_CAMERA_SCANNER,

  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,

  ON_LOGIN_USERNAME_CHANGE,
  ON_LOGIN_PASSWORD_CHANGE,
  TOGGLE_CHECKBOX,
  
  USERNAME,
  PASSWORD,
  REMEMBER_ME,
  REMEMBER_ME_SET_TRUE,

  IS_PRELOADER_COMPLETE

} = require('../../lib/constants').default

import RestAPIFactory from '../../lib/RestAPIFactory'

import { Actions } from 'react-native-router-flux'
import { authenticationService } from '../../services/classes/Authentication'
import CONFIG from '../../lib/config'
import {keyValueDBService} from '../../services/classes/KeyValueDBService'

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

export function loginSuccess() {
  return {
    type: LOGIN_SUCCESS,
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

export function startScanner() {
  return{
    type: LOGIN_CAMERA_SCANNER,
    payload: true
  }
}

export function stopScanner() {
  return{
    type: LOGIN_CAMERA_SCANNER,
    payload: false    
  }
}

export function toggleCheckbox() {
  return {
    type: TOGGLE_CHECKBOX
  }
}

export function rememberMeSetTrue() {
  return {
    type: REMEMBER_ME_SET_TRUE
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

export function authenticateUser(username, password,rememberMe) {
  return async function (dispatch) {
    try {
      let j_sessionid = null , xsrfToken = null
      dispatch(loginRequest())
      const authenticationResponse = await authenticationService.login(username, password)
      let cookie = authenticationResponse.headers.map['set-cookie'][0]
      await keyValueDBService.validateAndSaveData(CONFIG.SESSION_TOKEN_KEY,cookie)
      await authenticationService.saveLoginCredentials(username,password,rememberMe)
      dispatch(loginSuccess())
      Actions.Preloader()
    }
    catch (error) {
      dispatch(loginFailure(error.message))
    }
  }
}

export function checkRememberMe() {
  return async function (dispatch) {
    try {
      let rememberMe = await keyValueDBService.getValueFromStore(REMEMBER_ME)
      if(rememberMe) {
        let username = await keyValueDBService.getValueFromStore(USERNAME)
        let password = await keyValueDBService.getValueFromStore(PASSWORD)
        dispatch(onChangeUsername(username.value))
        dispatch(onChangePassword(password.value))
        dispatch(rememberMeSetTrue())
      }
    } catch(error) {

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
      dispatch(sessionTokenRequest())
      const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      const isPreloaderComplete =  await keyValueDBService.getValueFromStore(IS_PRELOADER_COMPLETE)
      if (token && isPreloaderComplete && isPreloaderComplete.value) {
        Actions.Tabbar()
      } else if(token) {
          Actions.Preloader()
      }
      else {
          Actions.InitialLoginForm()
      }
    }
    catch (error) {
      dispatch(sessionTokenRequestFailure(error.message))
      dispatch(loginState())
      Actions.InitialLoginForm()
    }
  }
}

