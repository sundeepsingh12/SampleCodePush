import * as realm from '../../repositories/realmdb'
const {
  TABLE_JOB_TRANSACTION,
  UNSEEN,
  PENDING,
  CUSTOMIZATION_LIST_MAP,
  TABLE_JOB_TRANSACTION_CUSTOMIZATION,
  TABIDMAP,
  TABLE_JOB,
  TABLE_FIELD_DATA,
  TABLE_JOB_DATA
} = require('../../lib/constants').default
import _ from 'underscore'
import { jobStatusService } from './JobStatus'
import { keyValueDBService } from './KeyValueDBService'
import { jobService } from './Job'
import JobTransactionSchema from '../../repositories/schema/jobTransaction'
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
        transactionIdDtoObject = {
          "jobMasterId": unseenTransactionObject.jobMasterId,
          "pendingStatusId": jobMasterIdStatusIdMap[unseenTransactionObject.jobMasterId],
          "transactionId": '',
          "unSeenStatusId": unseenTransactionObject.jobStatusId
        }
      } else {
        transactionIdDtoObject = jobMasterIdTransactionDtoMap[unseenTransactionObject.jobMasterId]
      }
      if (transactionIdDtoObject.transactionId != "")
        transactionIdDtoObject.transactionId = transactionIdDtoObject.transactionId + ":"
      transactionIdDtoObject.transactionId = transactionIdDtoObject.transactionId + unseenTransactionObject.id
      jobMasterIdTransactionDtoMap[unseenTransactionObject.jobMasterId] = transactionIdDtoObject
      if (jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId]) {
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
    return jobMasterIdJobStatusIdTransactionIdDtoMap
  }



  /**Returns JobMasterIds of unseen transactions
   * 
   * @param {*} unseenTransactions 
   */
  getUnseenTransactionsJobMasterIds(unseenTransactions) {
    const jobMasterIds = unseenTransactions.map(unseenTransactionObject => unseenTransactionObject.jobMasterId)
    return jobMasterIds
  }

  /**
   * get different configurations for job listing
   * jobTransaction for status ids page wise
   * jobTransactionCustomizationList
   * @returns
   * pageData = {
   * pageJobTransactionCustomizationList
   * pageNumber
   * isLastPage
   * message
   * }
   */
  async getJobTransactions(tabId, pageNumber) {
    let pageJobTransactionMap = {}, jobIdList = [], pageJobMap = {}, pageJobTransactionCustomizationList = [], pageJobTransactionList = [], isLastPage = false
    const jobMasterIdCustomizationMap = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
    const tabIdStatusIdMap = await keyValueDBService.getValueFromStore(TABIDMAP)
    const statusIdList = tabIdStatusIdMap.value[tabId]
    const pageData = {
      pageJobTransactionCustomizationList: [],
      pageNumber: 0,
      isLastPage: false,
      message: '',
    }
    if (!statusIdList || _.isEmpty(statusIdList)) {
      pageData.isLastPage = true
      pageData.message = 'No Status Available'
      return pageData
    }
    let jobTransactionQuery = statusIdList.map((object) => 'jobStatusId = ' + object).join(' OR ')
    let filteredTransactions = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery, true, 'seqSelected')
    if (filteredTransactions.length == 0) {
      pageData.isLastPage = true
      pageData.message = 'No Records Found'
      return pageData
    }
    if (filteredTransactions.length > (pageNumber + 1) * 10) {
      pageJobTransactionList = filteredTransactions.slice(pageNumber * 10, (pageNumber + 1) * 10)
      pageData.pageNumber = pageNumber + 1
    } else {
      pageJobTransactionList = filteredTransactions.slice(pageNumber * 10, filteredTransactions.length)
      pageData.isLastPage = true
    }
    pageJobTransactionList.forEach(transaction => {
      pageJobTransactionMap[transaction.id] = transaction
    })
    let jobQuery = pageJobTransactionList.map((transaction) => 'id = ' + transaction.jobId).join(' OR ')
    let filteredJobs = realm.getRecordListOnQuery(TABLE_JOB, jobQuery, false)
    filteredJobs.forEach(job => {
      pageJobMap[job.id] = job
    })

    let jobTransactionCustomizationQuery = pageJobTransactionList.map((transaction) => 'id = ' + transaction.id).join(' OR ')
    let filteredJobTransactionCustomization = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION_CUSTOMIZATION, jobTransactionCustomizationQuery, false)

    filteredJobTransactionCustomization.forEach(jobTransactionCustomization => {
      let currentJobTransactionCustomization = { ...jobTransactionCustomization }
      currentJobTransaction = pageJobTransactionMap[currentJobTransactionCustomization.id]
      currentJob = pageJobMap[currentJobTransaction.jobId]
      if (jobMasterIdCustomizationMap.value[currentJobTransaction.jobMasterId]) {
        line1CustomizationObject = jobMasterIdCustomizationMap.value[currentJobTransaction.jobMasterId][1]
        line2CustomizationObject = jobMasterIdCustomizationMap.value[currentJobTransaction.jobMasterId][2]
        circleLine1CustomizationObject = jobMasterIdCustomizationMap.value[currentJobTransaction.jobMasterId][3]
        circleLine2CustomizationObject = jobMasterIdCustomizationMap.value[currentJobTransaction.jobMasterId][4]
        currentJobTransactionCustomization.line1 = this.setTransactionDynamicParameters(line1CustomizationObject, currentJobTransaction, currentJob, currentJobTransactionCustomization.line1)
        currentJobTransactionCustomization.line2 = this.setTransactionDynamicParameters(line2CustomizationObject, currentJobTransaction, currentJob, currentJobTransactionCustomization.line2)
        currentJobTransactionCustomization.circleLine1 = this.setTransactionDynamicParameters(circleLine1CustomizationObject, currentJobTransaction, currentJob, currentJobTransactionCustomization.circleLine1)
        currentJobTransactionCustomization.circleLine2 = this.setTransactionDynamicParameters(circleLine2CustomizationObject, currentJobTransaction, currentJob, currentJobTransactionCustomization.circleLine2)
      } else {
        currentJobTransactionCustomization.line1 = currentJobTransaction.referenceNumber
        currentJobTransactionCustomization.line2 = ''
        currentJobTransactionCustomization.circleLine1 = ''
        currentJobTransactionCustomization.circleLine2 = ''
      }
      pageJobTransactionCustomizationList.push(currentJobTransactionCustomization)
    })
    pageData.pageJobTransactionCustomizationList = pageJobTransactionCustomizationList
    return pageData
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

  updateJobTransactionStatusId(jobMasterIdTransactionDtoMap) {
    for (let jobMasterIdTransactionObject in jobMasterIdTransactionDtoMap) {
      const transactionIdList = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].transactionId.split(":")
      let pendingStatusId = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].pendingStatusId
      realm.updateTableRecordOnProperty(TABLE_JOB_TRANSACTION, 'jobStatusId', transactionIdList, pendingStatusId)
    }
  }

  /**
   * 
   * @param {*} contentQuery 
   */
  async prepareJobCustomizationList(contentQuery) {
    const jobDataMap = {}, fieldDataMap = {}
    let jobTransactionCustomizationList = []
    const allJobTransactions = contentQuery.jobTransactions
    const allJobs = contentQuery.job
    const allJobData = contentQuery.jobData
    const allFieldData = contentQuery.fieldData
    const jobMasterIdCustomizationMapFromStore = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
    const jobMasterIdCustomizationMap = jobMasterIdCustomizationMapFromStore.value
    allJobData.forEach(jobData => {
      if (!jobDataMap[jobData.jobId]) {
        jobDataMap[jobData.jobId] = {}
      }
      jobDataMap[jobData.jobId][jobData.jobAttributeMasterId] = jobData
    })
    allFieldData.forEach(fieldData => {
      if (!fieldDataMap[fieldData.jobTransactionId]) {
        fieldDataMap[fieldData.jobTransactionId] = {}
      }
      fieldDataMap[fieldData.jobTransactionId][fieldData.fieldAttributeMasterId] = fieldData
    })
    allJobTransactions.forEach(jobTransaction => {
      let jobTransactionCustomization = {}
      const jobMasterId = jobTransaction.jobMasterId
      if (!jobDataMap[jobTransaction.jobId]) {
        jobDataMap[jobTransaction.jobId] = {}
      }
      if (!fieldDataMap[jobTransaction.id]) {
        fieldDataMap[jobTransaction.id] = {}
      }
      if (jobMasterIdCustomizationMap[jobMasterId]) {
        const line1Map = jobMasterIdCustomizationMap[jobMasterId][1]
        const line2Map = jobMasterIdCustomizationMap[jobMasterId][2]
        const circleLine1Map = jobMasterIdCustomizationMap[jobMasterId][3]
        const circleLine2Map = jobMasterIdCustomizationMap[jobMasterId][4]
        jobTransactionCustomization.line1 = this.setTransactionJobAndFieldData(line1Map, jobTransaction, jobDataMap[jobTransaction.jobId], fieldDataMap[jobTransaction.id])
        jobTransactionCustomization.line2 = this.setTransactionJobAndFieldData(line2Map, jobTransaction, jobDataMap[jobTransaction.jobId], fieldDataMap[jobTransaction.id])
        jobTransactionCustomization.circleLine1 = this.setTransactionJobAndFieldData(circleLine1Map, jobTransaction, jobDataMap[jobTransaction.jobId], fieldDataMap[jobTransaction.id])
        jobTransactionCustomization.circleLine2 = this.setTransactionJobAndFieldData(circleLine2Map, jobTransaction, jobDataMap[jobTransaction.jobId], fieldDataMap[jobTransaction.id])
        jobTransactionCustomization.id = jobTransaction.id
      } else {
        jobTransactionCustomization.line1 = ''
        jobTransactionCustomization.line2 = ''
        jobTransactionCustomization.circleLine1 = ''
        jobTransactionCustomization.circleLine2 = ''
        jobTransactionCustomization.id = jobTransaction.id
      }
      jobTransactionCustomizationList.push(jobTransactionCustomization)
    })
    return jobTransactionCustomizationList
  }

  setTransactionJobAndFieldData(customizationObject, jobTransaction, jobDataForJobId, fieldDataForJobTransactionId) {
    if (!customizationObject) {
      return ''
    }
    let finalText = ''
    const jobMasterId = customizationObject.jobMasterId
    const jobAttributeMasterList = customizationObject.jobAttr
    jobAttributeMasterList.forEach(object => {
      jobData = jobDataForJobId[object.jobAttributeMasterId]
      if (jobData && !_.isUndefined(jobData.value) && !_.isNull(jobData.value)) {
        if (finalText == '') {
          finalText += jobData.value
        } else {
          finalText += customizationObject.separator + jobData.value
        }
      }
    })
    const fieldAttributeMasterList = customizationObject.fieldAttr
    fieldAttributeMasterList.forEach(object => {
      fieldData = fieldDataForJobTransactionId[object.fieldAttributeMasterId]
      if (fieldData && !_.isUndefined(fieldData.value) && !_.isNull(fieldData.value)) {
        if (finalText == '') {
          finalText += fieldData.value
        } else {
          finalText += customizationObject.separator + fieldData.value
        }
      }
    })
    return finalText
  }
}

export let jobTransactionService = new JobTransaction()
