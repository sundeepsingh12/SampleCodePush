'use strict'

const {
  JOB_FETCHING_START,
  JOB_FETCHING_END,
  SET_FETCHING_FALSE,
  SET_REFRESHING_TRUE,
  UNSEEN,
  TABLE_JOB_TRANSACTION,
  TAB,
  SET_TABS_LIST,
  TABLE_FIELD_DATA,
  TABLE_JOB,
  TABLE_JOB_DATA,
  USER,
  TABLE_RUNSHEET,
  TABLE_JOB_TRANSACTION_CUSTOMIZATION,
  CLEAR_HOME_STATE,
  SET_TABS_TRANSACTIONS
} = require('../../lib/constants').default

import CONFIG from '../../lib/config'
import {
  keyValueDBService
} from '../../services/classes/KeyValueDBService'
import {
  sync
} from '../../services/classes/Sync'

import {
  jobTransactionService
} from '../../services/classes/JobTransaction'

import {
  tabsService
} from '../../services/classes/Tabs'
import _ from 'underscore'
import {
  Platform
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';


export function jobFetchingEnd(pageData, tabId) {
  return {
    type: JOB_FETCHING_END,
    payload: {
      jobTransactionCustomizationList: pageData.pageJobTransactionCustomizationList,
      pageNumber: pageData.pageNumber,
      isLastPage: pageData.isLastPage,
      tabId,
    }
  }
}

export function jobFetchingStart(tabId, isRefresh) {
  return {
    type: JOB_FETCHING_START,
    payload: {
      tabId,
      isRefresh
    }
  }
}

export function setTabsList(tabsList) {
  return {
    type: SET_TABS_LIST,
    payload: tabsList
  }
}

export function setFetchingFalse(tabId, message) {
  return {
    type: SET_FETCHING_FALSE,
    payload: {
      tabId,
      message
    }
  }
}

export function clearHomeState() {
  return {
    type: CLEAR_HOME_STATE
  }
}

export function fetchTabs() {
  return async function (dispatch) {
    try {
      const tabs = await keyValueDBService.getValueFromStore(TAB)
      dispatch(setTabsList(tabs.value))
    } catch (error) {
      console.log(error)
    }
  }
}

export function setRefereshingTrue() {
  return {
    type: SET_REFRESHING_TRUE
  }
}

export function setTabIdsJobTransactions(tabIdJobs) {
  return {
    type: SET_TABS_TRANSACTIONS,
    payload: tabIdJobs
  }
}

export function fetchJobs(tabId, pageNumber) {
  return async function (dispatch) {
    try {
      dispatch(jobFetchingStart(tabId))
      var pageData = await jobTransactionService.getJobTransactions(tabId, pageNumber)
      if (pageData.pageJobTransactionCustomizationList && !_.isEmpty(pageData.pageJobTransactionCustomizationList)) {
        dispatch(jobFetchingEnd(pageData, tabId))
      } else {
        dispatch(setFetchingFalse(tabId, pageData.message))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export function onResyncPress() {
  return async function (dispatch) {
    try {
      await sync.createAndUploadZip();
      if (Platform.OS === 'android') {
        const intervalId = BackgroundTimer.setInterval(async () => {
          const isJobsPresent = await sync.downloadAndDeleteDataFromServer()
          if (isJobsPresent) {
            let tabIdJobs = await jobTransactionService.refreshJobs()
            dispatch(setTabIdsJobTransactions(tabIdJobs))
          }
        }, CONFIG.SYNC_SERVICE_DELAY);
      }
      else{
        //Write ios background service code here
      }
    } catch (error) {
      //Update UI here
      console.log(error)
    }
  }
}

export function downloadAndDeleteDataFromServer() {

}