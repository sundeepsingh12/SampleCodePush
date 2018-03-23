'use strict'
import {
  HomeScreen,
  HomeTabNavigatorScreen,
  IS_PRELOADER_COMPLETE,
  LoginScreen,
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGOUT_FAILURE,
  LOGOUT_START,
  FORGET_PASSWORD,
  LOGOUT_SUCCESS,
  ON_LOGIN_USERNAME_CHANGE,
  ON_LOGIN_PASSWORD_CHANGE,
  PASSWORD,
  PreloaderScreen,
  REMEMBER_ME,
  REMEMBER_ME_SET_TRUE,
  SET_CREDENTIALS,
  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,
  TOGGLE_CHECKBOX,
  USERNAME,
  AutoLogoutScreen,
  SET_LOADER_IN_AUTOLOGOUT,
  USER,
  ON_LONG_PRESS_ICON,
  RESET_STATE,
  BACKUP_UPLOAD_FAIL_COUNT,
  UnsyncBackupUpload
} from '../../lib/constants'

import RestAPIFactory from '../../lib/RestAPIFactory'
import moment from 'moment'
import { logoutService } from '../../services/classes/Logout'


import {
  authenticationService
} from '../../services/classes/Authentication'
import {
  invalidateUserSessionForAutoLogout
} from '../pre-loader/preloaderActions'
import CONFIG from '../../lib/config'
import {
  keyValueDBService
} from '../../services/classes/KeyValueDBService'
import {
  NavigationActions
} from 'react-navigation'

import { setState, resetNavigationState } from '../global/globalActions'

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

function forgetPassword() {
  return {
    type: FORGET_PASSWORD
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


export function onLongPressIcon(value) {
  return {
    type: ON_LONG_PRESS_ICON,
    payload: value
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

export function authenticateUser(username, password, rememberMe) {
  return async function (dispatch) {
    try {
      let j_sessionid = null,
        xsrfToken = null
      dispatch(loginRequest())
      const authenticationResponse = await authenticationService.login(username, password)
      let cookie = authenticationResponse.headers.map['set-cookie'][0]
      await keyValueDBService.validateAndSaveData(CONFIG.SESSION_TOKEN_KEY, cookie)
      await authenticationService.saveLoginCredentials(username, password, rememberMe)
      dispatch(loginSuccess())
      dispatch(NavigationActions.navigate({
        routeName: PreloaderScreen
      }))
    } catch (error) {
      dispatch(loginFailure(error.message.replace(/<\/?[^>]+(>|$)/g, "")))
    }
  }
}

/**@function onLongPressResetSettings()
    
    * function reset all data on long press of icon
    *
    * @description -> all state, all realm data and all simple store data will be deleted
    */

export function onLongPressResetSettings() {
  return async function (dispatch) {
    try {
      dispatch(onLongPressIcon(true))
      await logoutService.deleteDataBase()
      let allSchemaInstance = await keyValueDBService.getAllKeysFromStore()
      await keyValueDBService.deleteValueFromStore(allSchemaInstance)
      dispatch(setState(RESET_STATE))
      dispatch(onLongPressIcon(false))
    } catch (error) {
      dispatch(onLongPressIcon(false))
      console.log(erroe)
    }
  }
}

export function forgetPasswordRequest(username) {
  return async function (dispatch) {
    try {
      if (!username) {
        throw new Error('Please enter a valid username')
      }
      let data = new FormData()
      data.append('usernameToResetPass', username)
      dispatch(forgetPassword())
      const response = await RestAPIFactory().serviceCall(data, CONFIG.API.FORGET_PASSWORD, 'LOGIN')
      dispatch(loginFailure(response.json.message.replace(/<\/?[^>]+(>|$)/g, "")))
    } catch (error) {
      dispatch(loginFailure(error.message.replace(/<\/?[^>]+(>|$)/g, "")))
    }
  }
}

export function checkRememberMe() {
  return async function (dispatch) {
    try {
      let rememberMe = await keyValueDBService.getValueFromStore(REMEMBER_ME)
      if (rememberMe) {
        let username = await keyValueDBService.getValueFromStore(USERNAME)
        let password = await keyValueDBService.getValueFromStore(PASSWORD)
        dispatch(onChangeUsername(username.value))
        dispatch(onChangePassword(password.value))
        dispatch(rememberMeSetTrue())
      }
    } catch (error) {

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
      const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      const isPreloaderComplete = await keyValueDBService.getValueFromStore(IS_PRELOADER_COMPLETE)
      const userData = await keyValueDBService.getValueFromStore(USER)
      const backupUploadFailCount = await keyValueDBService.getValueFromStore(BACKUP_UPLOAD_FAIL_COUNT)
      if (userData && userData.value && userData.value.company && userData.value.company.autoLogoutFromDevice && !moment(moment(userData.value.lastLoginTime).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD')) && isPreloaderComplete) {
        dispatch(NavigationActions.navigate({ routeName: AutoLogoutScreen }))
      } else {
        if (token && isPreloaderComplete && isPreloaderComplete.value && backupUploadFailCount && backupUploadFailCount.value > 0) {
          dispatch(NavigationActions.navigate({
            routeName: UnsyncBackupUpload,
            params: backupUploadFailCount.value
          }))
        }
        else if (token && isPreloaderComplete && isPreloaderComplete.value) {
          dispatch(resetNavigationState(0, [NavigationActions.navigate({ routeName: HomeTabNavigatorScreen })]))
        }
        else if (token) {
          dispatch(NavigationActions.navigate({
            routeName: PreloaderScreen
          }))
        } else {
          dispatch(NavigationActions.navigate({
            routeName: LoginScreen
          }))
        }
      }
    } catch (error) {
      dispatch(sessionTokenRequestFailure(error.message))
      dispatch(loginState())
      dispatch(NavigationActions.navigate({
        routeName: LoginScreen
      }))
    }
  }
}