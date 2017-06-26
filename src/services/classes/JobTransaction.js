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
    const transactionList = _.filter(allJobTransactions, transaction => statusIds.includes(transaction.jobStatusId))
    return transactionList
  }

  /**Get all Job Transactions from Realm DB 
   * 
   */
  getAllJobTransactions() {
    const allJobTransactions = realm.getAll(TABLE_JOB_TRANSACTION)
    return allJobTransactions
  }

  /**Sample Return type
   * 
   * {
   *  jobMasterIdJobStatusIdTransactionIdDtoMap:{
   * 930:{
   *    4814:{
    *  jobMasterId:930
      pendingStatusId:4813
      transactionId:2521299
      unSeenStatusId:4814
    *  }     
    * }
    * },
        jobMasterIdTransactionDtoMap:{
          930:{
      jobMasterId:930
      pendingStatusId:4813
      transactionId:2521299
      unSeenStatusId:4814
          }
        }
   * }
   * 
   * @param {*} unseenTransactions 
   */
  async prepareUnseenTransactionMap(unseenTransactions) {
    jobMasterIdTransactionDtoMap = {}, // Map<JobMasterId, TransactionIdDTO>
      transactionIdDtoList = [], // ArrayList<TransactionIdDTO>
      jobStatusIdTransactionIdDtoMap = {}, // Map<JobStatusId, ArrayList<TransactionIdDTO>> 
      jobMasterIdJobStatusIdTransactionIdDtoMap = {} // Map<JobMasterId, Map<JobStausId, ArrayList<TransactionIdDTO>>>
    const jobMasterIdList = await this.getUnseenTransactionsJobMasterIds(unseenTransactions)
    const jobMasterIdStatusIdMap = await jobStatusService.getjobMasterIdStatusIdMap(jobMasterIdList, PENDING)
    unseenTransactions.forEach(async unseenTransactionObject => {
      let transactionIdDtoObject
      const jobMasterId = await unseenTransactionObject.jobMasterId
      const transactionId = await unseenTransactionObject.id
      const unSeenStatusId = await unseenTransactionObject.jobStatusId
      const pendingStatusId = jobMasterIdStatusIdMap[unseenTransactionObject.jobMasterId]
      if (!jobMasterIdTransactionDtoMap[jobMasterId]) {
        jobMasterIdTransactionDtoMap[jobMasterId] = {}
        transactionIdDtoObject = {
          jobMasterId,
          pendingStatusId,
          transactionId,
          unSeenStatusId
        }
        jobMasterIdTransactionDtoMap[jobMasterId] = transactionIdDtoObject
      } else {
        transactionIdDtoObject = jobMasterIdTransactionDtoMap[jobMasterId]
      }
      if (jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId]) {
        if (jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId][unSeenStatusId]) {
          let jobStatusIdTransactionIdDtoMap = jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId]
          let transactionIdDtoList = jobStatusIdTransactionIdDtoMap[unSeenStatusId]
          transactionIdDtoList.push(transactionIdDtoObject)
          jobStatusIdTransactionIdDtoMap[unSeenStatusId] = transactionIdDtoList
          jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId] = jobStatusIdTransactionIdDtoMap
        } else {
          let jobStatusIdTransactionIdDtoMap = {}
          let transactionIdDtoList = []
          transactionIdDtoList.push(transactionIdDtoObject)
          jobStatusIdTransactionIdDtoMap[unSeenStatusId] = transactionIdDtoList
          jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId] = jobStatusIdTransactionIdDtoMap
        }
      } else {
        let jobStatusIdTransactionIdDtoMap = {}
        let transactionIdDtoList = []
        transactionIdDtoList.push(transactionIdDtoObject)
        jobStatusIdTransactionIdDtoMap[unSeenStatusId] = transactionIdDtoList
        jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId] = jobStatusIdTransactionIdDtoMap
      }
    });
    const unseenTransactionsMap = {
      jobMasterIdTransactionDtoMap,
      jobMasterIdJobStatusIdTransactionIdDtoMap
    }
    return unseenTransactionsMap
  }

/**Returns JobMasterIds of unseen transactions
 * 
 * @param {*} unseenTransactions 
 */
  getUnseenTransactionsJobMasterIds(unseenTransactions) {
    const jobMasterIds = unseenTransactions.map(unseenTransactionObject => unseenTransactionObject.jobMasterId)
    return jobMasterIds
  }

  updateJobTransactionStatusId(unseenTransactionsMap){
    const jobMasterIdTransactionDtoMap = unseenTransactionsMap.jobMasterIdTransactionDtoMap
    for(let jobMasterIdTransactionObject in jobMasterIdTransactionDtoMap){
        let pendingStatusId = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].pendingStatusId
        realm.updateTableRecordOnProperty(TABLE_JOB_TRANSACTION,'jobStatusId',pendingStatusId)
    }
  }

}

export let jobTransactionService = new JobTransaction()
