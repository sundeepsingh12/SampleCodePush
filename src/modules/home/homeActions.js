'use strict'

const {
  UNSEEN
} = require('../../lib/constants').default
import CONFIG from '../../lib/config'
import {
  keyValueDBService
} from '../../services/classes/KeyValueDBService'
import {
  sync
} from '../../services/classes/Sync'
import {
  jobStatusService
} from '../../services/classes/JobStatus'
import {
  jobTransactionService
} from '../../services/classes/JobTransaction'
import {
  jobSummaryService
} from '../../services/classes/JobSummary'

import _ from 'underscore'

export function onResyncPress() {
  return async function (dispatch) {
    try {

      const pageNumber = 0,
        pageSize = 3
      let isLastPageReached = false,
        json
      while (!isLastPageReached) {
        console.log('inside while')
        const tdcResponse = await sync.downloadDataFromServer(pageNumber++, pageSize)
        console.log(tdcResponse)
        if (tdcResponse) {
          json = await tdcResponse.json
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
      console.log('successSyncIds')
       console.log(successSyncIds)
      const allJobTransactions = await jobTransactionService.getAllJobTransactions()
      const unseenStatusIds = await jobStatusService.getAllIdsForCode('UNSEEN')
      const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(allJobTransactions, unseenStatusIds)
      const unseenTransactionsMap = await jobTransactionService.prepareUnseenTransactionMap(unseenTransactions)
      const transactionIdDTOs = await sync.getTransactionIdDTOs(unseenTransactionsMap)
      const jobSummaries = await jobSummaryService.getSummaryForDeleteSyncApi(unseenTransactionsMap)
      const messageIdDTOs = []
      await sync.deleteDataFromServer(successSyncIds, messageIdDTOs, transactionIdDTOs, jobSummaries)

      await jobTransactionService.updateJobTransactionStatusId(unseenTransactionsMap)

      await jobSummaryService.updateJobSummary(jobSummaries)
    } catch (error) {
      console.log(error)
    }
  }
}
