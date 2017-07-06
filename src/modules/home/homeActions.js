'use strict'

const {
  UNSEEN,
  TABLE_JOB_TRANSACTION
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

import * as realm from '../../repositories/realmdb'
import _ from 'underscore'

export function onResyncPress() {
  return async function (dispatch) {
    try {

      const pageNumber = 0,
        pageSize = 3
      let isLastPageReached = false,
        json
      console.log('start time >>>')
      console.log(new Date())
      const unseenStatusIds = await jobStatusService.getAllIdsForCode(UNSEEN)
      while (!isLastPageReached) {
        console.log('inside while')
        const tdcResponse = await sync.downloadDataFromServer(pageNumber, pageSize)
        if (tdcResponse) {
          json = await tdcResponse.json
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

      console.log('end time >>>')
      console.log(new Date())

    } catch (error) {
      console.log(error)
    }
  }
}

/**
 * 
 * @param {*} json 
 */
// function deleteDataFromServer(successSyncIds) {
//   return async function (dispatch) {
//     console.log('deleteDataFromServer >>>s')
//     try {
//       const allJobTransactions = await realm.getAll(TABLE_JOB_TRANSACTION)
//       const unseenStatusIds = await jobStatusService.getAllIdsForCode(UNSEEN)
//       const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(allJobTransactions, unseenStatusIds)
//       const jobMasterIdJobStatusIdTransactionIdDtoMap = await jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions)
//       const dataList = await sync.getSummaryAndTransactionIdDTO(jobMasterIdJobStatusIdTransactionIdDtoMap)
//       const messageIdDTOs = []
//       await sync.deleteDataFromServer(successSyncIds, messageIdDTOs, dataList.transactionIdDtos, dataList.jobSummaries)
//       await jobTransactionService.updateJobTransactionStatusId(dataList.transactionIdDtos)
//       jobSummaryService.updateJobSummary(dataList.jobSummaries)
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }
