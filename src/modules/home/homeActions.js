'use strict'

const {
  JOB_FETCHING_START,
  JOB_FETCHING_END,
  UNSEEN,
  TABLE_JOB_TRANSACTION,
  TAB,
  SET_TABS_LIST
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

export function jobFetchingEnd(jobTransactions,tabId,pageNumber) {
  return {
    type: JOB_FETCHING_END,
    payload: {
      jobTransactions,
      tabId,
      pageNumber
    }
  }
}

export function jobFetchingStart(tabId) {
  return {
    type: JOB_FETCHING_START,
    payload: {
      tabId
    }
  }
}

export function jobRefreshingStart() {
  return {
    type: JOB_REFRESHING_START,
    payload: true
  }
}

export function setTabsList(tabsList) {
  return {
    type : SET_TABS_LIST,
    payload : tabsList
  }
}

export function fetchTabs() {
  return async function (dispatch) {
    try {
      console.log('fetchtabs')
      const tabs = await keyValueDBService.getValueFromStore(TAB)
      console.log(tabs)
      console.log(tabs.value)
      dispatch(setTabsList(tabs.value))
    } catch (error) {
      console.log(error)
    }
  }
}

export function fetchJobs(tabId,pageNumber) {
  return async function (dispatch) {
    try {
      dispatch(jobFetchingStart(tabId))
      console.log('pageNumber')
      console.log(pageNumber)
      console.log('tabId')
      console.log(tabId)
      console.log('fetchJobs action')
      var data = await jobTransactionService.getJobTransactions(tabId,pageNumber)
      console.log('data fetchJobs')
      console.log(data)
      dispatch(jobFetchingEnd(data,tabId,pageNumber))
    } catch (error) {
      console.log(error)
    }
  }
}

export function onResyncPress() {
  return async function (dispatch) {
    try {
      const pageNumber = 0, pageSize = 3
      let isLastPageReached = false, json
       const unseenStatusIds = await jobStatusService.getAllIdsForCode(UNSEEN)
       console.log('time start >>>>')
         console.log(new Date())
      while (!isLastPageReached) {
        console.log('inside while')
        const tdcResponse = await sync.downloadDataFromServer(pageNumber, pageSize)
        if (tdcResponse) {
          json = await tdcResponse.json
          console.log('json')
          console.log(json)
          isLastPageReached = json.last
          if (!_.isNull(json.content) && !_.isUndefined(json.content) && !_.isEmpty(json.content)) {
            await sync.processTdcResponse(json.content)
          } else {
            isLastPageReached = true
          }
          const successSyncIds = await sync.getSyncIdFromResponse(json.content)
          //Dont hit delete sync API if successSyncIds empty
          if (!_.isNull(successSyncIds) && !_.isUndefined(successSyncIds) && !_.isEmpty(successSyncIds)) {
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
       console.log('time end >>>>')
         console.log(new Date())

    } catch (error) {
      console.log(error)
    }
  }
}
