/**
 * # globalActions.js
 *
 * Actions that are global in nature
 */
'use strict'

import {
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
  IS_PRELOADER_COMPLETE,
  USER,
  RESET_STATE,
  SAVE_ACTIVATED,
  LIVE_JOB,
  USER_EVENT_LOG,
  PENDING_SYNC_TRANSACTION_IDS,
  BACKUP_ALREADY_EXIST,
  USER_EXCEPTION_LOGS,
  SYNC_RUNNING_AND_TRANSACTION_SAVING,
  DOWNLOAD_LATEST_APP,
  LoginScreen,
  IS_SHOW_MOBILE_OTP_SCREEN
} from '../../lib/constants'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import CONFIG from '../../lib/config'
import { onResyncPress } from '../home/homeActions'
import BackgroundTimer from 'react-native-background-timer'
import { NavigationActions } from 'react-navigation'
import { trackingService } from '../../services/classes/Tracking'
import { Toast } from 'native-base'
import { userExceptionLogsService } from '../../services/classes/UserException'
import { OK } from '../../lib/ContainerConstants'
import { logoutService } from '../../services/classes/Logout'
import package_json from '../../../package.json'

export function setState(type, payload) {
  return {
    type,
    payload
  }
}

//Use to navigate to other scene
export function navigateToScene(routeName, params) {
  return async function (dispatch) {
    dispatch(NavigationActions.navigate({ routeName, params }))
  }
}

//Deletes values from store
export function deleteSessionToken() {
  return async function (dispatch) {
    try {
      await keyValueDBService.deleteValueFromStore(USER_SUMMARY)
      await keyValueDBService.deleteValueFromStore(IS_PRELOADER_COMPLETE)
      await keyValueDBService.deleteValueFromStore(IS_SHOW_MOBILE_OTP_SCREEN)
      await keyValueDBService.deleteValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      await keyValueDBService.deleteValueFromStore(SAVE_ACTIVATED)
      await keyValueDBService.deleteValueFromStore(LIVE_JOB)
      await keyValueDBService.deleteValueFromStore(PENDING_SYNC_TRANSACTION_IDS)
      await keyValueDBService.deleteValueFromStore(USER_EVENT_LOG)
      await keyValueDBService.deleteValueFromStore(JOB_SUMMARY)
      await keyValueDBService.deleteValueFromStore(BACKUP_ALREADY_EXIST)
      await keyValueDBService.deleteValueFromStore(USER_EXCEPTION_LOGS)
      await keyValueDBService.deleteValueFromStore(SYNC_RUNNING_AND_TRANSACTION_SAVING)
      await trackingService.destroy()
      BackgroundTimer.clearInterval(CONFIG.intervalId);
      CONFIG.intervalId = 0
      dispatch(setState(RESET_STATE))
    } catch (error) {
      console.log(error)
    }
  }
}

/**
 * 
 * @param {Number} errorCode error code of particular class and action.
 * @param {String} errorMessage error message to display
 * @param {String} type type of Toast for example danger, warning, success
 * @param {Integer} isToastShow integer whether to show toast or not.
 */
export function showToastAndAddUserExceptionLog(errorCode, errorMessage, type, isToastShow) {
  if (isToastShow == 1) {
    Toast.show({ text: "ErrorCode: " + errorCode + "\n" + errorMessage, type: type, position: 'bottom', buttonText: OK, duration: 10000 })
  }
  userExceptionLogsService.addUserExceptionLogs(errorMessage, errorCode)
}
//Use to reset navigation state
export function resetNavigationState(index, actions) {
  return async function (dispatch) {
    dispatch(NavigationActions.reset({
      index: 0,
      actions
    }))
  }
}


export function resetApp() {
  return async function (dispatch) {
    try {
      await logoutService.deleteDataBase()
      const allSchemaInstance = await keyValueDBService.getAllKeysFromStore()
      await keyValueDBService.deleteValueFromStore(allSchemaInstance)
      dispatch(NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: LoginScreen })] }))
      dispatch(setState(RESET_STATE))
      // dispatch(setState(DOWNLOAD_LATEST_APP, {displayMessage:null}))
    } catch (error) {
      console.log('error1', error)
    }
  }
}

