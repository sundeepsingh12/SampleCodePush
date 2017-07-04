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
          const successSyncIds = await sync.getSyncIdFromResponse(json.content)
          console.log('successSyncIds')
          console.log(successSyncIds)
          //Dont hit delete sync API if successSyncIds empty
          if (!_.isNull(successSyncIds) && !_.isUndefined(successSyncIds) && !_.isEmpty(successSyncIds)) {
            dispatch(deleteDataFromServer(successSyncIds))
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

/**
 * 
 * @param {*} json 
 */
function deleteDataFromServer(successSyncIds) {
  return async function (dispatch) {
     console.log('deleteDataFromServer >>>s')
    try {
      const allJobTransactions = await realm.getAll(TABLE_JOB_TRANSACTION)
      console.log('allJobTransactions >>>s')
      console.log(allJobTransactions)
      const unseenStatusIds = await jobStatusService.getAllIdsForCode(UNSEEN)
       console.log('unseenStatusIds >>>')
      console.log(unseenStatusIds)
      const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(allJobTransactions, unseenStatusIds)
      console.log('unseenTransactions')
      console.log(unseenTransactions)
      const jobMasterIdJobStatusIdTransactionIdDtoMap = await jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions)
      console.log('jobMasterIdJobStatusIdTransactionIdDtoMap')
      console.log(jobMasterIdJobStatusIdTransactionIdDtoMap)
      const dataList = await sync.getSummaryAndTransactionIdDTO(jobMasterIdJobStatusIdTransactionIdDtoMap)
      console.log('dataList')
      console.log(dataList)
      const messageIdDTOs = []
      await sync.deleteDataFromServer(successSyncIds, messageIdDTOs, dataList.transactionIdDtos, dataList.jobSummaries)
      await jobTransactionService.updateJobTransactionStatusId(dataList.transactionIdDtos)
      jobSummaryService.updateJobSummary(dataList.jobSummaries)
    } catch (error) {
      console.log(error)
    }
  }
}
