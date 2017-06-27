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
import { jobService } from './Job'
import { jobDataService } from './JobData'
class JobTransaction {

  /**A Generic method for filtering out jobtransactions whose job status ids lie in 'statusids'  
   * 
   * @param {*} allJobTransactions 
   * @param {*} statusIds 
   */
  getJobTransactionsForStatusIds(allJobTransactions, statusIds) {
    const transactionList = _.filter(allJobTransactions, transaction => statusIds.includes(transaction.jobStatusId))
    console.log('transactionList')
    console.log(transactionList)
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
    let jobMasterIdTransactionDtoMap = {}, // Map<JobMasterId, TransactionIdDTO>
      jobMasterIdJobStatusIdTransactionIdDtoMap = {} // Map<JobMasterId, Map<JobStausId, ArrayList<TransactionIdDTO>>>
    const jobMasterIdList = await this.getUnseenTransactionsJobMasterIds(unseenTransactions)
    const jobMasterIdStatusIdMap = await jobStatusService.getjobMasterIdStatusIdMap(jobMasterIdList, PENDING)
    unseenTransactions.forEach(unseenTransactionObject => {
      let transactionIdDtoObject = {}
      if (!jobMasterIdTransactionDtoMap[unseenTransactionObject.jobMasterId]) {
        console.log('jobMasterId doesnt exist')
        transactionIdDtoObject = {
          "jobMasterId": unseenTransactionObject.jobMasterId,
          "pendingStatusId": jobMasterIdStatusIdMap[unseenTransactionObject.jobMasterId],
          "transactionId":'',
          "unSeenStatusId": unseenTransactionObject.jobStatusId
        }
      } else {
        console.log('jobMasterId  exist')
        transactionIdDtoObject = jobMasterIdTransactionDtoMap[unseenTransactionObject.jobMasterId]
      }
      if (transactionIdDtoObject.transactionId != "")
        transactionIdDtoObject.transactionId = transactionIdDtoObject.transactionId+ ":"
      transactionIdDtoObject.transactionId = transactionIdDtoObject.transactionId + unseenTransactionObject.id
      jobMasterIdTransactionDtoMap[unseenTransactionObject.jobMasterId] = transactionIdDtoObject
      console.log('print 111')
      console.log(jobMasterIdTransactionDtoMap)
      if (jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId]) {
        console.log('outer key exists >>>')
        if (jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId][unseenTransactionObject.jobStatusId]) {
          console.log('inner key exists >>>')
          let jobStatusIdTransactionIdDtoMap = jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId]
          let transactionIdDtoList = jobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobStatusId]
          console.log('transactionIdDtoList')
          console.log(transactionIdDtoList)
          transactionIdDtoList.push(transactionIdDtoObject)
          console.log('transactionIdDtoList 111')
          console.log(transactionIdDtoList)
          jobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobStatusId] = transactionIdDtoList
          jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId] = jobStatusIdTransactionIdDtoMap
        } else {
          console.log('inner key doesnt exists >>>')
          let jobStatusIdTransactionIdDtoMap = {}
          let transactionIdDtoList = []
          transactionIdDtoList.push(transactionIdDtoObject)
          jobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobStatusId] = transactionIdDtoList
          jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId] = jobStatusIdTransactionIdDtoMap
        }
      } else {
        console.log('outer keys doesnt exists >>>')
        let jobStatusIdTransactionIdDtoMap = {}
        let transactionIdDtoList = []
        transactionIdDtoList.push(transactionIdDtoObject)
        jobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobStatusId] = transactionIdDtoList
        jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId] = jobStatusIdTransactionIdDtoMap
      }
    });
    console.log('jobMasterIdTransactionDtoMap')
    console.log(jobMasterIdTransactionDtoMap)
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
    console.log('jobMasterIds')
    console.log(jobMasterIds)
    return jobMasterIds
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
    
    console.log('firsttransaction')
    console.log(pageTransactions)
    return pageTransactions
  }

  setTransactionText(customizationObject, jobTransaction, job) {
    if (!customizationObject) {
      return ''
    }
    let finalText = ''
    const jobMasterId = customizationObject.jobMasterId
    const jobAttributeMasterList = customizationObject.jobAttr
    console.log('jobAttributeMasterList 111')
     console.log(jobAttributeMasterList)
    const fieldAttributeMasterList = customizationObject.fieldAttr
    if (customizationObject.referenceNo) {
      finalText += jobTransaction.referenceNumber
    }

    if (customizationObject.runsheetNo) {
      finalText += jobTransaction.runsheetNo
    }

    if (customizationObject.noOfAttempts) {
      finalText += "Attempt: " + job.attemptCount
    }

    if (customizationObject.slot) {
      finalText += "Slot: " + job.slot
    }

    if (customizationObject.startTime) {
      finalText += "Start: " + job.jobStartTime
    }

    if (customizationObject.endTime) {
      finalText += "End: " + job.jobEndTime
    }

    if (customizationObject.trackKm) {
      finalText += "Distance: " + jobTransaction.trackKm
    }

    if (customizationObject.trackHalt) {
      finalText += "Halt Duration: " + jobTransaction.trackHalt
    }

    if (customizationObject.trackCallCount) {
      finalText += "Call Count: " + jobTransaction.trackCallCount
    }

    if (customizationObject.trackCallDuration) {
      finalText += "Call Duration: " + jobTransaction.trackCallDuration
    }

    if (customizationObject.trackSmsCount) {
      finalText += "Sms: " + jobTransaction.trackSmsCount
    }

    if (customizationObject.trackTransactionTimeSpent) {
      finalText += "Time Spent: " + jobTransaction.trackTransactionTimeSpent
    }

    filteredResults = jobDataService.getJobDataForJobId(job.id,jobAttributeMasterList)

  }

  appendText() {

  }

  updateJobTransactionStatusId(unseenTransactionsMap) {
    const jobMasterIdTransactionDtoMap = unseenTransactionsMap.jobMasterIdTransactionDtoMap
    console.log('updateJobTransactionStatusId called >>>')
     console.log('jobMasterIdTransactionDtoMap called >>>')
      console.log(jobMasterIdTransactionDtoMap)
    for (let jobMasterIdTransactionObject in jobMasterIdTransactionDtoMap) {
     const transactionIdList = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].transactionId.split(":")
       console.log('transactionIdList')
     console.log(transactionIdList)
      let pendingStatusId = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].pendingStatusId
      realm.updateTableRecordOnProperty(TABLE_JOB_TRANSACTION, 'jobStatusId', transactionIdList,pendingStatusId)
    }
  }
}

export let jobTransactionService = new JobTransaction()
