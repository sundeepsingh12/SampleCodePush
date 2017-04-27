'use strict'
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

  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,

  DELETE_TOKEN_REQUEST,
  DELETE_TOKEN_SUCCESS,

  ON_AUTH_FORM_FIELD_CHANGE,

  TABLE_USER_SUMMARY,
} = require('../../lib/constants').default

const BackendFactory = require('../../lib/BackendFactory').default

import {Actions} from 'react-native-router-flux'
import {storeConfig} from '../../lib/StoreConfig'
import {authenticationService} from '../../services/classes/Authentication'
import {jobMasterService} from '../../services/classes/JobMaster'
import {checkAssetService} from '../../services/classes/CheckAsset'

/**
 * ## State actions
 * controls which form is displayed to the user
 * as in login, register, logout or reset password
 */

export function logoutState () {
  return {
    type: LOGOUT
  }
}

export function loginState () {
  return {
    type: LOGIN
  }
}

/**
 * ## Login actions
 */
export function loginRequest () {
  return {
    type: LOGIN_START
  }
}

export function loginSuccess (j_sessionid) {
  return {
    type: LOGIN_SUCCESS,
    payload: j_sessionid
  }
}

export function loginFailure (error) {
  return {
    type: LOGIN_FAILURE,
    payload: error
  }
}

export function jobMasterDownloadStart() {
  return {
    type: MASTER_DOWNLOAD_START
  }
}

export function jobMasterDownloadSuccess() {
  return {
    type: MASTER_DOWNLOAD_SUCCESS
  }
}

export function checkAssetStart() {
  return {
    type : CHECK_ASSET_START
  }
}

export function checkAssetSuccess() {
  return {
    type : CHECK_ASSET_SUCCESS
  }
}

/**
 * ## SessionToken actions
 */
export function sessionTokenRequest () {
  return {
    type: SESSION_TOKEN_REQUEST
  }
}
export function sessionTokenRequestSuccess (token) {
  return {
    type: SESSION_TOKEN_SUCCESS,
    payload: token
  }
}
export function sessionTokenRequestFailure (error) {
  return {
    type: SESSION_TOKEN_FAILURE,
    payload: error === undefined ? null : error
  }
}

/**
 * ## DeleteToken actions
 */
export function deleteTokenRequest () {
  return {
    type: DELETE_TOKEN_REQUEST
  }
}
export function deleteTokenRequestSuccess () {
  return {
    type: DELETE_TOKEN_SUCCESS
  }
}


/**
 * ## saveSessionToken
 * @param {Object} response - to return to keep the promise chain
 * @param {Object} json - object with sessionToken
 */
export function saveSessionToken (j_sessionid) {
  return storeConfig.storeSessionToken(j_sessionid)
}

/**
 * ## onAuthFormFieldChange
 * Set the payload so the reducer can work on it
 */
export function onAuthFormFieldChange (field, value) {
  return {
    type: ON_AUTH_FORM_FIELD_CHANGE,
    payload: {field: field, value: value}
  }
}

/**
 * ## Logout actions
 */
export function logoutRequest () {
  return {
    type: LOGOUT_START
  }
}

export function logoutSuccess () {
  return {
    type: LOGOUT_SUCCESS
  }
}
export function logoutFailure (error) {
  return {
    type: LOGOUT_FAILURE,
    payload: error
  }
}


/**
 * ## Delete session token
 *
 * Call the AppAuthToken deleteSessionToken
 */
export function deleteSessionToken () {
  return async function(dispatch)  {
    dispatch(deleteTokenRequest())
    await storeConfig.deleteSessionToken()
    dispatch(deleteTokenRequestSuccess())
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

export function login (username, password) {
  return async function(dispatch)  {
    try {
      dispatch(loginRequest())
      const j_sessionid = await authenticationService.login(username,password)
      dispatch(loginSuccess(j_sessionid))
      dispatch(jobMasterDownloadStart())
        const deviceIMEI = await checkAssetService.getDeviceIMEI()
        const deviceSIM = await checkAssetService.getDeviceSIM()
        let user = await jobMasterService.getUser()
        const currentJobMasterVersion = (user!=null || user!=undefined)?user.currentJobMasterVersion:0;
        const companyId = (user!=null|| user!=undefined)?user.currentJobMasterVersion:0;
        const jobMasters = await jobMasterService.downloadJobMaster(deviceIMEI,deviceSIM,currentJobMasterVersion,companyId)
      const json = await jobMasters.json
      if(jobMasterService.matchServerTimeWithMobileTime(json.serverTime)) {
        jobMasterService.saveJSONResponse(json)
        user = json.user
        dispatch(checkAssetStart())
        if(checkAssetService.checkAsset(deviceIMEI,deviceSIM,user.hubId,user.company.id)) {
          await saveSessionToken(j_sessionid)
          Actions.Tabbar()
        } else {
            const checkAssetResponse = await checkAssetService.checkAssetAPI(deviceIMEI,deviceSIM)
            const checkAssetJson = await checkAssetResponse.json
          checkAssetService.saveDeviceIMEI(checkAssetJson.deviceIMEI)
          checkAssetService.saveDeviceSIM(checkAssetJson.deviceSIM)
          await saveSessionToken(j_sessionid)
          Actions.Tabbar()
        }
         dispatch(checkAssetSuccess())
         dispatch(logoutState())
      } else {
          //write code for updating UI here
      }
    }
    catch(error) {
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
export function getSessionToken () {
  return async function(dispatch)  {
    try{
      dispatch(sessionTokenRequest())
      const token = await storeConfig.getSessionToken()
      if (token) {
        dispatch(sessionTokenRequestSuccess(token))
        Actions.Tabbar()
      } else {
        dispatch(sessionTokenRequestFailure())
        Actions.InitialLoginForm()
      }
    }
    catch(error) {
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
export function logout () {
  return async function(dispatch)  {
    try {
      dispatch(logoutRequest())
      const token = await storeConfig.getSessionToken()
      await BackendFactory(token).logout()
      dispatch(logoutSuccess())
      dispatch(deleteSessionToken())
      Actions.InitialLoginForm()
    }
    catch(error){
      dispatch(logoutFailure(error))
    }
  }
}
