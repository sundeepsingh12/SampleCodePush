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
  IS_SHOW_MOBILE_NUMBER_SCREEN,
  IS_SHOW_OTP_SCREEN,
  IS_PRELOADER_COMPLETE,
  USER,
  RESET_STATE,
  SAVE_ACTIVATED,
  LIVE_JOB,
  USER_EVENT_LOG,
  PENDING_SYNC_TRANSACTION_IDS
} from '../../lib/constants'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'

import CONFIG from '../../lib/config'

import {
  onChangePassword,
  onChangeUsername
} from '../login/loginActions'

import { onResyncPress } from '../home/homeActions'

import BackgroundTimer from 'react-native-background-timer'
import { NavigationActions } from 'react-navigation'
import { trackingService } from '../../services/classes/Tracking'


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

export async function getJobListingParameters() {
  const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
  const jobMasterIdCustomizationMap = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
  const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
  const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
  const customerCareList = await keyValueDBService.getValueFromStore(CUSTOMER_CARE)
  const smsTemplateList = await keyValueDBService.getValueFromStore(SMS_TEMPLATE)
  const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
  return {
    customerCareList: customerCareList.value,
    jobAttributeMasterList: jobAttributeMasterList.value,
    jobAttributeStatusList: jobAttributeStatusList.value,
    jobMasterList: jobMasterList.value,
    jobMasterIdCustomizationMap: jobMasterIdCustomizationMap.value,
    smsTemplateList: smsTemplateList.value,
    statusList: statusList.value
  }
}

//Deletes values from store
export function deleteSessionToken() {
  return async function (dispatch) {
    try {
      await keyValueDBService.deleteValueFromStore(USER_SUMMARY)
      await keyValueDBService.deleteValueFromStore(IS_SHOW_MOBILE_NUMBER_SCREEN)
      await keyValueDBService.deleteValueFromStore(IS_SHOW_OTP_SCREEN)
      await keyValueDBService.deleteValueFromStore(IS_PRELOADER_COMPLETE)
      await keyValueDBService.deleteValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      await keyValueDBService.deleteValueFromStore(SAVE_ACTIVATED)
      await keyValueDBService.deleteValueFromStore(LIVE_JOB)
      await keyValueDBService.deleteValueFromStore(PENDING_SYNC_TRANSACTION_IDS)
      await keyValueDBService.deleteValueFromStore(USER_EVENT_LOG)            
      await keyValueDBService.deleteValueFromStore(JOB_SUMMARY)
      await trackingService.destroy()
      BackgroundTimer.clearInterval(CONFIG.intervalId);
      CONFIG.intervalId = 0
      dispatch(setState(RESET_STATE))
    } catch (error) {
      throw error
    }
  }
}

