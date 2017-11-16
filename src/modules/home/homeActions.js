'use strict'

import {
  CLEAR_HOME_STATE,
  CUSTOMER_CARE,
  CUSTOMIZATION_APP_MODULE,
  CUSTOMIZATION_LIST_MAP,
  Home,
  JOB_ATTRIBUTE,
  JOB_ATTRIBUTE_STATUS,
  JOB_DOWNLOADING_STATUS,
  JOB_FETCHING_END,
  JOB_FETCHING_START,
  JOB_LISTING_START,
  JOB_LISTING_END,
  JOB_STATUS,
  SET_FETCHING_FALSE,
  SET_REFRESHING_TRUE,
  SET_TABS_LIST,
  SET_TABS_TRANSACTIONS,
  SMS_TEMPLATE,
  TAB,
  TABLE_FIELD_DATA,
  TABLE_JOB,
  TABLE_JOB_DATA,
  TABLE_JOB_TRANSACTION,
  TABLE_JOB_TRANSACTION_CUSTOMIZATION,
  TABLE_RUNSHEET,
  UNSEEN,
  USER,
  JOB_MASTER
} from '../../lib/constants'

import CONFIG from '../../lib/config'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { sync } from '../../services/classes/Sync'
import { jobStatusService } from '../../services/classes/JobStatus'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { jobSummaryService } from '../../services/classes/JobSummary'
import { jobMasterService } from '../../services/classes/JobMaster'
import * as realm from '../../repositories/realmdb'
import _ from 'underscore'
import { Platform } from 'react-native';
import BackgroundTimer from 'react-native-background-timer'
import { NavigationActions } from 'react-navigation'
import { setState } from '../global/globalActions'
import { moduleCustomizationService } from '../../services/classes/ModuleCustomization'


export function jobFetchingEnd(jobTransactionCustomizationList) {
  return {
    type: JOB_LISTING_END,
    payload: {
      jobTransactionCustomizationList
    }
  }
}

export function jobDownloadingStatus(isDownloadingjobs) {
  return {
    type: JOB_DOWNLOADING_STATUS,
    payload: {
      isDownloadingjobs
    }
  }
}

export function jobFetchingStart() {
  return {
    type: JOB_LISTING_START
  }
}

export function setTabsList(tabsList, tabIdStatusIdMap) {
  return {
    type: SET_TABS_LIST,
    payload: {
      tabsList,
      tabIdStatusIdMap
    }
  }
}

export function clearHomeState() {
  return {
    type: CLEAR_HOME_STATE
  }
}

export function navigateToScene(sceneName, paramaters) {
  return async function (dispatch) {
    dispatch(NavigationActions.navigate({ routeName: sceneName, params: paramaters }))
  }
}

export function fetchModulesList() {
  return async function (dispatch) {
    try {
      console.log('custom', CUSTOMIZATION_APP_MODULE)
      const appModulesList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
      // let moduleCustomizationMap = moduleCustomizationService.getModuleCustomizationMapForAppModuleId(appModulesList.value)
      moduleCustomizationService.getActiveModules(appModulesList.value)
    } catch (error) {
      console.log(error)
    }
  }
}

export function fetchTabs() {
  return async function (dispatch) {
    try {
      const tabs = await keyValueDBService.getValueFromStore(TAB)
      const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
      const tabIdStatusIdMap = jobMasterService.prepareTabStatusIdMap(statusList.value)
      dispatch(setTabsList(tabs.value, tabIdStatusIdMap))
    } catch (error) {
      console.log(error)
    }
  }
}

export function fetchJobs() {
  return async function (dispatch) {
    try {
      dispatch(jobFetchingStart())
      const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
      const jobMasterIdCustomizationMap = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
      const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
      const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
      const customerCareList = await keyValueDBService.getValueFromStore(CUSTOMER_CARE)
      const smsTemplateList = await keyValueDBService.getValueFromStore(SMS_TEMPLATE)
      const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
      let jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobMasterIdCustomizationMap.value, jobAttributeMasterList.value, jobAttributeStatusList.value, customerCareList.value, smsTemplateList.value, statusList.value,jobMasterList.value)
      dispatch(jobFetchingEnd(jobTransactionCustomizationList))
    } catch (error) {
      console.log(error)
    }
  }
}

export function syncService() {
  return async (dispatch) => {
    try {
      CONFIG.intervalId = BackgroundTimer.setInterval(async () => {
        dispatch(onResyncPress())
      }, CONFIG.SYNC_SERVICE_DELAY);
    } catch (error) {
      //Update UI here
      console.log(error)
    }
  }
}

export function onResyncPress() {
  return async function (dispatch) {
    try {
      //Start resync loader here
      dispatch(jobDownloadingStatus(true))
      await sync.createAndUploadZip()
      const isJobsPresent = await sync.downloadAndDeleteDataFromServer()
      //Stop resync loader here
      dispatch(jobDownloadingStatus(false))
      if (isJobsPresent) {
        dispatch(fetchJobs())
      }
      dispatch(syncService())
    } catch (error) {
      //Update UI here
      dispatch(jobDownloadingStatus(false))
      console.log(error)
    }
  }
}