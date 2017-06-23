'use strict'

const {
  JOB_FETCHING_START,
  JOB_FETCHING_WAIT,
  UNSEEN
} = require('../../lib/constants').default

import CONFIG from '../../lib/config'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { sync } from '../../services/classes/Sync'
import { jobStatusService } from '../../services/classes/JobStatus'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { jobSummaryService } from '../../services/classes/JobSummary'


export function jobDownload(jobTransactions) {
  return {
    type: JOB_FETCHING_START,
    payload: jobTransactions
  }
}

export function isFetchingFalse() {
  return {
    type: JOB_FETCHING_WAIT,
    payload: true
  }
}

export function fetchJobs(pageNumber) {
  return async function (dispatch) {
    try {
      dispatch(isFetchingFalse())
      console.log('pageNumber')
      console.log(pageNumber)
      console.log('fetchJobs action')
      var data = await jobTransactionService.getJobTransactions(pageNumber)
      console.log('data fetchJobs')
      console.log(data)
      dispatch(jobDownload(data))
    } catch (error) {
      console.log(error)
    }
  }
}

export function onResyncPress() {
  return async function (dispatch) {
    try {
      const pageNumber = 0,
        pageSize = 3
      let isLastPageReached = false, json
      while (!isLastPageReached) {
        console.log('inside while')
        const tdcResponse = await sync.downloadDataFromServer(pageNumber++, pageSize)
        if (tdcResponse) {
          json = await tdcResponse.json
          console.log(json)
          isLastPageReached = json.last
          await sync.processTdcResponse(json.content)
        } else {
          isLastPageReached = true
        }
      }
      dispatch(deleteDataFromServer(json))

    } catch (error) {
      console.log(error)
    }
  }
}

/**
 * 
 * @param {*} json 
 */
function deleteDataFromServer(json) {
  return async function (dispatch) {
    try {
      const successSyncIds = await sync.getSyncIdFromResponse(json.content)
      console.log('successSyncIds')
      console.log(successSyncIds)
      const allJobTransactions = await jobTransactionService.getAllJobTransactions()
      const unseenStatusIds = await jobStatusService.getAllIdsForCode('UNSEEN')
      const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(allJobTransactions, unseenStatusIds)
      const unseenTransactionsMap = await jobTransactionService.prepareUnseenTransactionMap(unseenTransactions)
      console.log('unseenTransactionsMap')
      console.log(unseenTransactionsMap)
      const transactionIdDTOs = await sync.getTransactionIdDTOs(unseenTransactionsMap)
      const jobSummaries = await jobSummaryService.getSummaryForDeleteSyncApi(unseenTransactionsMap)
      console.log('jobSummaries')
      console.log(jobSummaries)
      const messageIdDTOs = []
      const deleteApiResponse = await sync.deleteDataFromServer(successSyncIds, messageIdDTOs, transactionIdDTOs, jobSummaries)
      deleteApiResponse = 'Success'
      if (deleteApiResponse == 'Success') {
        await jobTransactionService.updateJobTransactionStatusId(unseenTransactionsMap)
        dispatch(fetchJobs(0))
      }
    } catch (error) {
      dispatch(fetchJobs(0))
      console.log(error)
    }
  }
}
