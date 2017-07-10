'use strict'

const {
  JOB_FETCHING_START,
  JOB_FETCHING_END,
  SET_FETCHING_FALSE,
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
  CLEAR_HOME_STATE
} = require('../../lib/constants').default

import CONFIG from '../../lib/config'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { sync } from '../../services/classes/Sync'
import { jobStatusService } from '../../services/classes/JobStatus'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { jobSummaryService } from '../../services/classes/JobSummary'
import { tabsService } from '../../services/classes/Tabs'
import * as realm from '../../repositories/realmdb'
import _ from 'underscore'

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

export function setFetchingFalse(tabId) {
  return {
    type: SET_FETCHING_FALSE,
    payload: {
      tabId
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

export function fetchJobs(tabId, pageNumber) {
  return async function (dispatch) {
    try {
      dispatch(jobFetchingStart(tabId))
      var pageData = await jobTransactionService.getJobTransactions(tabId, pageNumber)
      if (pageData.pageJobTransactionCustomizationList && !_.isEmpty(pageData.pageJobTransactionCustomizationList)) {
        dispatch(jobFetchingEnd(pageData, tabId))
      } else {
        dispatch(setFetchingFalse(tabId))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export function onResyncPress() {
  return async function (dispatch) {
    try {
      const pageNumber = 0, pageSize = 3
      let isLastPageReached = false, json, isJobsPresent = false
      const unseenStatusIds = await jobStatusService.getAllIdsForCode(UNSEEN)
      while (!isLastPageReached) {
        const tdcResponse = await sync.downloadDataFromServer(pageNumber, pageSize)
        if (tdcResponse) {
          json = await tdcResponse.json
          isLastPageReached = json.last
          if (!_.isNull(json.content) && !_.isUndefined(json.content) && !_.isEmpty(json.content)) {
            await sync.processTdcResponse(json.content)
          } else {
            isLastPageReached = true
          }
          const successSyncIds = await sync.getSyncIdFromResponse(json.content)
          //Dont hit delete sync API if successSyncIds empty
          if (!_.isNull(successSyncIds) && !_.isUndefined(successSyncIds) && !_.isEmpty(successSyncIds)) {
            isJobsPresent = true
            const allJobTransactions = await realm.getAll(TABLE_JOB_TRANSACTION)
            const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(allJobTransactions, unseenStatusIds)
            const jobMasterIdJobStatusIdTransactionIdDtoMap = await jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions)
            const dataList = await sync.getSummaryAndTransactionIdDTO(jobMasterIdJobStatusIdTransactionIdDtoMap)
            const messageIdDTOs = []
            await sync.deleteDataFromServer(successSyncIds, messageIdDTOs, dataList.transactionIdDtos, dataList.jobSummaries)
            await jobTransactionService.updateJobTransactionStatusId(dataList.transactionIdDtos)
            jobSummaryService.updateJobSummary(dataList.jobSummaries)
          }
        } else {
          isLastPageReached = true
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}
