import * as realm from '../../repositories/realmdb'
const {
  TABLE_JOB_TRANSACTION,
  UNSEEN,
  PENDING,
  CUSTOMIZATION_LIST_MAP
} = require('../../lib/constants').default
import _ from 'underscore'
import { jobStatusService } from './JobStatus'
import { keyValueDBService } from './KeyValueDBService'

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
    jobMasterIdTransactionDtoMap = {} // Map<JobMasterId, TransactionIdDTO>
    transactionIdDtoList = [] // ArrayList<TransactionIdDTO>
    jobStatusIdTransactionIdDtoMap = {} // Map<JobStatusId, ArrayList<TransactionIdDTO>> 
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
          let jobStatusIdTransactionIdDtoMap = unseenTransCount[jobMasterId]
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

  updateJobTransactionStatusId(unseenTransactionsMap) {
    const jobMasterIdTransactionDtoMap = unseenTransactionsMap.jobMasterIdTransactionDtoMap
    for (let jobMasterIdTransactionObject in jobMasterIdTransactionDtoMap) {
      let pendingStatusId = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].pendingStatusId
      realm.updateTableRecordOnProperty(TABLE_JOB_TRANSACTION, jobStatusId, pendingStatusId)
    }
  }

  /**
   * get different configurations for job listing
   * tabs
   * jobstatus
   * jobTransaction for status ids
   * holderListCustomizationMap
   * jobMaster
   */
  async getJobTransactions(pageNumber) {
    console.log('pageNumber')
    console.log(pageNumber)
    let allJobTransactions = this.getAllJobTransactions()
    let pageTransactions
    if (pageNumber > 0) {
      pageTransactions = allJobTransactions.slice(0, (pageNumber + 1) * 10)
    } else {
      pageTransactions = allJobTransactions.slice(0, 10)
    }
    jobMasterIdCustomizationMapFromStore = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
    jobMasterIdCustomizationMap = jobMasterIdCustomizationMapFromStore.value
    console.log(jobMasterIdCustomizationMap)
    pageTransactions.forEach(transaction => {
      console.log('transaction')
      console.log(transaction)
      const jobMasterId = transaction.jobMasterId
      const line1Map = jobMasterIdCustomizationMap[jobMasterId][1]
      const line2Map = jobMasterIdCustomizationMap[jobMasterId][2]
      const circleLine1Map = jobMasterIdCustomizationMap[jobMasterId][3]
      const circleLine2Map = jobMasterIdCustomizationMap[jobMasterId][4]
      transaction.line1 = setTransactionText(line1Map)
      transaction.line2 = setTransactionText(line2Map)
      transaction.circleLine1 = setTransactionText(circleLine1Map)
      transaction.circleLine2 = setTransactionText(circleLine2Map)
      console.log('line1Map')
      console.log(line1Map)
      console.log('line2Map')
      console.log(line2Map)
      console.log('circleLine1Map')
      console.log(circleLine1Map)
      console.log('circleLine2Map')
      console.log(circleLine2Map)
    })
    console.log('firsttransaction')
    console.log(firsttransaction)
    return firsttransaction
  }

  setTransactionText(customizationObject) {
    if(!customizationObject) {
      return ''
    }

  }

}

export let jobTransactionService = new JobTransaction()
