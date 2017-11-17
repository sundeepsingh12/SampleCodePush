'use strict'

import {
  CLEAR_HOME_STATE,
  CUSTOMER_CARE,
  CUSTOMIZATION_APP_MODULE,
  CUSTOMIZATION_LIST_MAP,
  Home,
  HOME_LOADING,
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

/**
 * This action enables modules for particular user
 */
export function fetchModulesList() {
  return async function (dispatch) {
    try {
      dispatch(setState(HOME_LOADING, { loading: true }))
      const appModulesList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
      const user = await keyValueDBService.getValueFromStore(USER)
      moduleCustomizationService.getActiveModules(appModulesList.value, user.value)
      dispatch(setState(HOME_LOADING, { loading: false }))
    } catch (error) {
      console.log(error)
    }
  }
}

export function syncService() {
  return async (dispatch) => {
    try {
      if(CONFIG.intervalId) {
        throw new Error('Service Already Scheduled')
      }
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
      dispatch(jobDownloadingStatus(true))
      await sync.createAndUploadZip()
      const isJobsPresent = await sync.downloadAndDeleteDataFromServer()
      dispatch(jobDownloadingStatus(false))
      if (isJobsPresent) {
        dispatch(fetchJobs())
      }
      dispatch(syncService())
    } catch (error) {
      //Update UI here
      dispatch(jobDownloadingStatus(false))
      dispatch(syncService())
      console.log(error)
    }
  }
}