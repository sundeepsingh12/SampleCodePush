import * as realm from '../../repositories/realmdb'
const {
  TABLE_JOB_TRANSACTION,
  UNSEEN,
  PENDING,
  CUSTOMIZATION_LIST_MAP,
  TABLE_JOB_TRANSACTION_CUSTOMIZATION
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
    console.log('allJobTransactions')
    console.log(_.isEmpty(allJobTransactions))
    console.log('statusIds')
    console.log(statusIds)
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

  getAllJobTransactionsCustomization() {
    const allJobTransactionCustomization = realm.getAll(TABLE_JOB_TRANSACTION_CUSTOMIZATION)
    return allJobTransactionCustomization
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
    if (_.isUndefined(unseenTransactions) || _.isNull(unseenTransactions) || _.isEmpty(unseenTransactions)) {
      return []
    }
    let jobMasterIdTransactionDtoMap = {}, // Map<JobMasterId, TransactionIdDTO>
      jobMasterIdJobStatusIdTransactionIdDtoMap = {} // Map<JobMasterId, Map<JobStausId, ArrayList<TransactionIdDTO>>>
    const jobMasterIdList = await this.getUnseenTransactionsJobMasterIds(unseenTransactions)
    console.log('unseenTransactions')
    console.log(unseenTransactions)
    console.log('jobMasterIdList')
    console.log(jobMasterIdList)
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
    let pageJobTransactionMap = {}, jobIdList = [], pageJobMap = {}, jobTransactionCustomizationList = []
    const jobMasterIdCustomizationMapFromStore = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
    const jobMasterIdCustomizationMap = jobMasterIdCustomizationMapFromStore.value
    let allJobTransactionCustomization = this.getAllJobTransactionsCustomization()
    let pageTransactions  
    pageTransactions = allJobTransactions.slice(pageNumber * 10, (pageNumber + 1) * 10)
    pageTransactions.forEach(transaction => {
      pageJobTransactionMap[transaction.id] = transaction
      jobIdList.push(transaction.jobId)
    })
    console.log(pageJobTransactionMap)
    let allJobs = jobService.getAllJobs()
    allJobs.forEach(job => {
      if (jobIdList.includes(job.id)) {
        pageJobMap[job.id] = job
      }
    })
    console.log(pageJobMap)

    allJobTransactionCustomization.forEach(jobTransactionCustomization => {
      console.log(jobTransactionCustomization)
      if (pageJobTransactionMap[jobTransactionCustomization.id]) {
        let currentJobTransactionCustomization = { ...jobTransactionCustomization }
        currentJobTransaction = pageJobTransactionMap[jobTransactionCustomization.id]
        currentJob = pageJobMap[currentJobTransaction.jobId]
        line1CustomizationObject = jobMasterIdCustomizationMap[currentJobTransaction.jobMasterId][1]
        line2CustomizationObject = jobMasterIdCustomizationMap[currentJobTransaction.jobMasterId][2]
        circleLine1CustomizationObject = jobMasterIdCustomizationMap[currentJobTransaction.jobMasterId][3]
        circleLine2CustomizationObject = jobMasterIdCustomizationMap[currentJobTransaction.jobMasterId][4]
        currentJobTransactionCustomization.line1 += this.setTransactionDynamicParameters(line1CustomizationObject, currentJobTransaction, currentJob, currentJobTransactionCustomization.line1)
        currentJobTransactionCustomization.line2 += this.setTransactionDynamicParameters(line2CustomizationObject, currentJobTransaction, currentJob, currentJobTransactionCustomization.line2)
        currentJobTransactionCustomization.circleLine1 += this.setTransactionDynamicParameters(circleLine1CustomizationObject, currentJobTransaction, currentJob, currentJobTransactionCustomization.circleLine1)
        currentJobTransactionCustomization.circleLine2 += this.setTransactionDynamicParameters(circleLine2CustomizationObject, currentJobTransaction, currentJob, currentJobTransactionCustomization.circleLine2)
        jobTransactionCustomizationList.push(currentJobTransactionCustomization)
      }
    })
    console.log('firsttransaction')
    console.log(pageTransactions)
    return pageTransactions
  }

  setTransactionDynamicParameters(customizationObject, jobTransaction, job, finalText) {
    if (!customizationObject) {
      return ''
    }
    finalText += this.appendText(customizationObject.referenceNo, jobTransaction.referenceNumber, '', customizationObject.separator, finalText)
    finalText += this.appendText(customizationObject.runsheetNo, jobTransaction.runsheetNo, '', customizationObject.separator, finalText)
    finalText += this.appendText(customizationObject.noOfAttempts, job.attemptCount, "Attempt: ", customizationObject.separator, finalText)
    finalText += this.appendText(customizationObject.slot, job.slot, "Slot: ", customizationObject.separator, finalText)
    finalText += this.appendText(customizationObject.startTime, job.jobStartTime, "Start: ", customizationObject.separator, finalText)
    finalText += this.appendText(customizationObject.endTime, job.jobEndTime, "End: ", customizationObject.separator, finalText)
    finalText += this.appendText(customizationObject.trackKm, jobTransaction.trackKm, "Distance: ", customizationObject.separator, finalText)
    finalText += this.appendText(customizationObject.trackHalt, jobTransaction.trackHalt, "Halt Duration: ", customizationObject.separator, finalText)
    finalText += this.appendText(customizationObject.trackCallCount, jobTransaction.trackCallCount, "Call Count: ", customizationObject.separator, finalText)
    finalText += this.appendText(customizationObject.trackCallDuration, jobTransaction.trackCallDuration, "Call Duration: ", customizationObject.separator, finalText)
    finalText += this.appendText(customizationObject.trackSmsCount, jobTransaction.trackSmsCount, "Sms: ", customizationObject.separator, finalText)
    finalText += this.appendText(customizationObject.trackTransactionTimeSpent, jobTransaction.trackTransactionTimeSpent, "Time Spent: ", customizationObject.separator, finalText)
    return finalText
  }

  appendText(condition, property, extraString, seperator, finalText) {
    let text = ''
    if (condition) {
      if (seperator && _.isUndefined(finalText) && _.isNull(finalText) && finalText !== '') {
        text = seperator + extraString + property
      } else {
        text = extraString + property
      }
    }
    return text
  }

  updateJobTransactionStatusId(unseenTransactionsMap) {
    if (_.isUndefined(unseenTransactionsMap) || _.isNull(unseenTransactionsMap) || _.isEmpty(unseenTransactionsMap)) {
      return
    }
    const jobMasterIdTransactionDtoMap = unseenTransactionsMap.jobMasterIdTransactionDtoMap
    console.log('updateJobTransactionStatusId called >>>')
    console.log('jobMasterIdTransactionDtoMap called >>>')
    console.log(jobMasterIdTransactionDtoMap)
    for (let jobMasterIdTransactionObject in jobMasterIdTransactionDtoMap) {
      const transactionIdList = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].transactionId.split(":")
      console.log('transactionIdList')
      console.log(transactionIdList)
      let pendingStatusId = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].pendingStatusId
      realm.updateTableRecordOnProperty(TABLE_JOB_TRANSACTION, 'jobStatusId', transactionIdList, pendingStatusId)
    }
  }

  async prepareJobCustomizationList(contentQuery) {
    let jobTransactionCustomizationList = []
    const allJobTransactions = contentQuery.jobTransactions
    const allJobs = contentQuery.job
    const allJobData = contentQuery.jobData
    const allFieldData = contentQuery.fieldData
    const jobMasterIdCustomizationMapFromStore = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
    const jobMasterIdCustomizationMap = jobMasterIdCustomizationMapFromStore.value
    console.log(jobMasterIdCustomizationMap)
    allJobTransactions.forEach(jobTransaction => {
      let jobTransactionCustomization = {}
      console.log('jobTransaction')
      console.log(jobTransaction)
      let job = allJobs.filter(job => job.id == jobTransaction.jobId)
      console.log(job)
      let jobDataForJobId = {}
      allJobData.forEach(jobData => {
        if (jobData.jobId == jobTransaction.jobId) {
          jobDataForJobId[jobData.jobAttributeMasterId] = jobData
        }
      })
      console.log('jobData')
      console.log(jobDataForJobId)
      let fieldDataForJobTransactionId = {}
      allFieldData.forEach(fieldData => {
        if (fieldData.jobTransactionId == jobTransaction.id) {
          fieldDataForJobTransactionId[fieldData.fieldAttributeMasterId] = fieldData
        }
      })
      console.log('fieldDataForJobTransactionId')
      console.log(fieldDataForJobTransactionId)
      const jobMasterId = jobTransaction.jobMasterId
      const line1Map = jobMasterIdCustomizationMap[jobMasterId][1]
      const line2Map = jobMasterIdCustomizationMap[jobMasterId][2]
      const circleLine1Map = jobMasterIdCustomizationMap[jobMasterId][3]
      const circleLine2Map = jobMasterIdCustomizationMap[jobMasterId][4]
      console.log('line1Map')
      console.log(line1Map)
      console.log('line2Map')
      console.log(line2Map)
      console.log('circleLine1Map')
      console.log(circleLine1Map)
      console.log('circleLine2Map')
      console.log(circleLine2Map)
      jobTransactionCustomization.line1 = this.setTransactionJobAndFieldData(line1Map, jobTransaction, job, jobDataForJobId, fieldDataForJobTransactionId)
      jobTransactionCustomization.line2 = this.setTransactionJobAndFieldData(line2Map, jobTransaction, job, jobDataForJobId, fieldDataForJobTransactionId)
      jobTransactionCustomization.circleLine1 = this.setTransactionJobAndFieldData(circleLine1Map, jobTransaction, job, jobDataForJobId, fieldDataForJobTransactionId)
      jobTransactionCustomization.circleLine2 = this.setTransactionJobAndFieldData(circleLine2Map, jobTransaction, job, jobDataForJobId, fieldDataForJobTransactionId)
      jobTransactionCustomization.id = jobTransaction.id
      jobTransactionCustomizationList.push(jobTransactionCustomization)
    })
    return jobTransactionCustomizationList
  }

  setTransactionJobAndFieldData(customizationObject, jobTransaction, job, jobDataForJobId, fieldDataForJobTransactionId) {
    if (!customizationObject) {
      return ''
    }
    let finalText = ''
    const jobMasterId = customizationObject.jobMasterId
    const jobAttributeMasterList = customizationObject.jobAttr
    console.log('jobAttributeMasterList 111')
    console.log(jobAttributeMasterList)
    jobAttributeMasterList.forEach(object => {
      console.log(object.jobAttributeMasterId)
      jobData = jobDataForJobId[object.jobAttributeMasterId]
      console.log('jobData')
      console.log(jobData)
      if (jobData && !_.isUndefined(jobData.value) && !_.isNull(jobData.value)) {
        if (finalText == '') {
          finalText += jobData.value
        } else {
          finalText += customizationObject.separator + jobData.value
        }
      }
    })
    console.log(finalText)
    const fieldAttributeMasterList = customizationObject.fieldAttr
    console.log('fieldAttributeMasterList 111')
    console.log(fieldAttributeMasterList)
    fieldAttributeMasterList.forEach(object => {
      console.log(object.fieldAttributeMasterList)
      fieldData = fieldDataForJobTransactionId[object.fieldAttributeMasterId]
      if (fieldData && !_.isUndefined(fieldData.value) && !_.isNull(fieldData.value)) {
        if (finalText == '') {
          finalText += fieldData.value
        } else {
          finalText += customizationObject.separator + fieldData.value
        }
      }
      console.log('fieldData')
      console.log(fieldData)
    })
    console.log('finalText')
    console.log(finalText)
    return finalText
  }
}

export let jobTransactionService = new JobTransaction()
