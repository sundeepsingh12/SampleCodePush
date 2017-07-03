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
import * as realm from '../../repositories/realmdb'
import _ from 'underscore'

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
      const pageNumber = 0, pageSize = 3
      let isLastPageReached = false, json
      while (!isLastPageReached) {
        console.log('inside while')
        const tdcResponse = await sync.downloadDataFromServer(pageNumber++, pageSize)
        console.log(tdcResponse)
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
        } else {
          isLastPageReached = true
        }
      }
      console.log('after while')
      console.log(json.content)
      const successSyncIds = await sync.getSyncIdFromResponse(json.content)
      //Dont hit delete sync API if successSyncIds empty
      if (!_.isNull(successSyncIds) && !_.isUndefined(successSyncIds) && !_.isEmpty(successSyncIds)) {
        dispatch(deleteDataFromServer(successSyncIds))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

/**
 * 
 * @param {*} json 
 */
function deleteDataFromServer(successSyncIds) {
  return async function (dispatch) {
    try {
      const allJobTransactions = await jobTransactionService.getAllJobTransactions()
      console.log('is empty before call ')
      console.log(_.isEmpty(allJobTransactions))
      const unseenStatusIds = await jobStatusService.getAllIdsForCode(UNSEEN)
      const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(allJobTransactions, unseenStatusIds)
      const unseenTransactionsMap = await jobTransactionService.prepareUnseenTransactionMap(unseenTransactions)
      const transactionIdDTOs = await sync.getTransactionIdDTOs(unseenTransactionsMap)
      const jobSummaries = await jobSummaryService.getSummaryForDeleteSyncApi(unseenTransactionsMap)
      const messageIdDTOs = []
      await sync.deleteDataFromServer(successSyncIds, messageIdDTOs, transactionIdDTOs, jobSummaries)
      await jobTransactionService.updateJobTransactionStatusId(unseenTransactionsMap)
      await jobSummaryService.updateJobSummary(jobSummaries)
      dispatch(fetchJobs(0))
    } catch (error) {
      console.log('inside catch')
      console.log(error)
    }
  }
}
