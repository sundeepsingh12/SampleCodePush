import * as realm from '../../repositories/realmdb'
const {
  TABLE_JOB_TRANSACTION,
  UNSEEN,
  PENDING
} = require('../../lib/constants').default
import _ from 'underscore'
import {
  jobStatusService
} from './JobStatus'
class JobTransaction {

  /**A Generic method for filtering out jobtransactions whose job status ids lie in 'statusids'  
   * 
   * @param {*} allJobTransactions 
   * @param {*} statusIds 
   */
  getJobTransactionsForStatusIds(allJobTransactions, statusIds) {
    const allJobTransactionsClone = { ...allJobTransactions }
    console.log('allJobTransactionsClone')
    console.log(allJobTransactionsClone)
    console.log('statusIds')
    console.log(statusIds)
    const transactionList = _.filter(allJobTransactionsClone, transaction => statusIds.includes(transaction.jobStatusId))
    console.log('transactionList')
    console.log(transactionList)
    return transactionList
  }

  /**Sample Return type
   * 
   * 
   * 930:{
   *    4814:{
    *  jobMasterId:930
      pendingStatusId:4813
      transactionId:2521299:123456
      unSeenStatusId:4814
    *  }     
    * }
   * 
   * @param {*} unseenTransactions 
   */
  async getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions) {
    if (_.isNull(unseenTransactions) || _.isEmpty(unseenTransactions)) {
      return {}
    }
    let jobMasterIdTransactionDtoMap = {}, // Map<JobMasterId, TransactionIdDTO>
      jobMasterIdJobStatusIdTransactionIdDtoMap = {} // Map<JobMasterId, Map<JobStausId, TransactionIdDTO>>
    const jobMasterIdList = await this.getUnseenTransactionsJobMasterIds(unseenTransactions)
    const jobMasterIdStatusIdMap = await jobStatusService.getjobMasterIdStatusIdMap(jobMasterIdList, PENDING)
    unseenTransactions.forEach(unseenTransactionObject => {
      let transactionIdDtoObject = {}
      if (!jobMasterIdTransactionDtoMap[unseenTransactionObject.jobMasterId]) {
        console.log('jobMasterId doesnt exist')
        transactionIdDtoObject = {
          "jobMasterId": unseenTransactionObject.jobMasterId,
          "pendingStatusId": jobMasterIdStatusIdMap[unseenTransactionObject.jobMasterId],
          "transactionId": '',
          "unSeenStatusId": unseenTransactionObject.jobStatusId
        }
      } else {
        console.log('jobMasterId  exist')
        transactionIdDtoObject = jobMasterIdTransactionDtoMap[unseenTransactionObject.jobMasterId]
      }
      if (transactionIdDtoObject.transactionId != "")
        transactionIdDtoObject.transactionId = transactionIdDtoObject.transactionId + ":"
      transactionIdDtoObject.transactionId = transactionIdDtoObject.transactionId + unseenTransactionObject.id
      jobMasterIdTransactionDtoMap[unseenTransactionObject.jobMasterId] = transactionIdDtoObject
      console.log('print 111')
      console.log(jobMasterIdTransactionDtoMap)
      if (jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId]) {
        console.log('outer key exists >>>')
        if (!jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId][unseenTransactionObject.jobStatusId]) {
          let jobStatusIdTransactionIdDtoMap = {}
          jobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobStatusId] = transactionIdDtoObject
          jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId] = jobStatusIdTransactionIdDtoMap
        }
      } else {
        let jobStatusIdTransactionIdDtoMap = {}
        jobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobStatusId] = transactionIdDtoObject
        jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId] = jobStatusIdTransactionIdDtoMap
      }
    });
    console.log('jobMasterIdTsransactionDtoMap')
    console.log(jobMasterIdTransactionDtoMap)
    console.log('jobMasterIdJobStatusIdTransactionIdDtoMap')
    console.log(jobMasterIdJobStatusIdTransactionIdDtoMap)
    return jobMasterIdJobStatusIdTransactionIdDtoMap
  }



  /**Returns JobMasterIds of unseen transactions
   * 
   * @param {*} unseenTransactions 
   */
  getUnseenTransactionsJobMasterIds(unseenTransactions) {
    console.log('unseenTransactions')
    console.log(unseenTransactions)
    const jobMasterIds = unseenTransactions.map(unseenTransactionObject => unseenTransactionObject.jobMasterId)
    console.log('jobMasterIds')
    console.log(jobMasterIds)
    return jobMasterIds
  }

  updateJobTransactionStatusId(jobMasterIdTransactionDtoMap) {
    console.log('jobMasterIdTransactionDtoMap')
    console.log(jobMasterIdTransactionDtoMap)
    for (let jobMasterIdTransactionObject in jobMasterIdTransactionDtoMap) {
      const transactionIdList = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].transactionId.split(":")
      console.log('transactionIdList')
      console.log(transactionIdList)
      let pendingStatusId = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].pendingStatusId
      realm.updateTableRecordOnProperty(TABLE_JOB_TRANSACTION, 'jobStatusId', transactionIdList, pendingStatusId)
    }
  }
}

export let jobTransactionService = new JobTransaction()
