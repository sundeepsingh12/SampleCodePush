import * as realm from '../../repositories/realmdb'
const {
    TABLE_JOB_TRANSACTION,
    UNSEEN,
    PENDING,
    CUSTOMIZATION_LIST_MAP,
    TABIDMAP,
    TABLE_JOB,
    TABLE_FIELD_DATA,
    TABLE_JOB_DATA,
    TAB,
    JOB_ATTRIBUTE,
    TABLE_RUNSHEET
} = require('../../lib/constants').default
import _ from 'underscore'
import { jobStatusService } from './JobStatus'
import { keyValueDBService } from './KeyValueDBService'
import { jobService } from './Job'
import { jobDataService } from './JobData'
import { fieldDataService } from './FieldData'
import { jobAttributeMasterService } from './JobAttributeMaster'
import { customerCareService } from './CustomerCare'
import { smsTemplateService } from './SMSTemplate'
import { fieldAttributeMasterService } from './FieldAttributeMaster'

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

    /**
     * 
     * @param {*} jobTransactionList 
     * @returns
     * Map<JobTransactionId,JobTransaction>
     * JobQuery
     * JobDataQuery
     * FieldDataQuery
     */
    getJobTransactionMapAndQuery(jobTransactionList) {
        let jobQuery = '',
            jobTransactionQuery = '',
            jobDataQuery = '',
            fieldDataQuery = '',
            jobTransactionMap = {}
        for (let index in jobTransactionList) {
            const transaction = jobTransactionList[index]
            const jobTransactionId = transaction.id
            const jobId = transaction.jobId
            const referenceNumber = transaction.referenceNumber
            const runsheetNo = transaction.runsheetNo
            const trackKm = transaction.trackKm
            const trackHalt = transaction.trackHalt
            const trackCallCount = transaction.trackCallCount
            const trackCallDuration = transaction.trackCallDuration
            const trackSmsCount = transaction.trackSmsCount
            const trackTransactionTimeSpent = transaction.trackTransactionTimeSpent
            const jobMasterId = transaction.jobMasterId
            const seqSelected = transaction.seqSelected
            const jobStatusId = transaction.jobStatusId
            if (index == 0) {
                jobQuery += 'id = ' + jobId
                jobTransactionQuery += 'id = ' + jobTransactionId
                jobDataQuery += 'jobId = ' + jobId
                fieldDataQuery += 'jobTransactionId = ' + jobTransactionId
            } else {
                jobQuery += ' OR id = ' + jobId
                jobTransactionQuery += ' OR id = ' + jobTransactionId
                jobDataQuery += ' OR jobId = ' + jobId
                fieldDataQuery += ' OR jobTransactionId = ' + jobTransactionId
            }
            jobTransactionMap[jobTransactionId] = {
                id: jobTransactionId,
                jobId,
                jobMasterId,
                jobStatusId,
                referenceNumber,
                runsheetNo,
                seqSelected,
                trackCallCount,
                trackCallDuration,
                trackHalt,
                trackKm,
                trackSmsCount,
                trackTransactionTimeSpent
            }
        }
        return {
            jobTransactionMap,
            jobQuery,
            jobTransactionQuery,
            jobDataQuery,
            fieldDataQuery
        }
    }



    /**Returns JobMasterIds of unseen transactions
     * 
     * @param {*} unseenTransactions 
     */
    getUnseenTransactionsJobMasterIds(unseenTransactions) {
        const jobMasterIds = unseenTransactions.map(unseenTransactionObject => unseenTransactionObject.jobMasterId)
        return jobMasterIds
    }

    getAllJobTransactionsCustomizationList(jobMasterIdCustomizationMap, jobAttributeMasterList, jobAttributeStatusList, customerCareList, smsTemplateList, statusList) {
        let jobAttributeMasterMap = jobAttributeMasterService.getJobAttributeMasterMap(jobAttributeMasterList)
        let jobAttributeStatusMap = jobAttributeMasterService.getJobAttributeStatusMap(jobAttributeStatusList)
        if (_.isEmpty(jobAttributeStatusMap)) {
            jobAttributeStatusMap = jobAttributeMasterService.getAllJobAttributeStatusMap(statusList, jobAttributeMasterMap)
        }
        let customerCareMap = customerCareService.getCustomerCareMap(customerCareList)
        let smsTemplateMap = smsTemplateService.getSMSTemplateMap(smsTemplateList)
        let runsheetQuery = 'isClosed = false'
        const runsheetList = realm.getRecordListOnQuery(TABLE_RUNSHEET, runsheetQuery)
        let jobTransactionQuery = runsheetList.map((runsheet) => "runsheetId = " + runsheet.id).join('OR')
        jobTransactionQuery = 'deleteFlag != 1 AND (' + jobTransactionQuery + ')'
        let jobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery)
        if (jobTransactionList.length == 0) {
            return []
        }
        let jobTransactionObject = this.getJobTransactionMapAndQuery(jobTransactionList)
        let jobTransactionMap = jobTransactionObject.jobTransactionMap
        let jobsList = realm.getRecordListOnQuery(TABLE_JOB, jobTransactionObject.jobQuery, false)
        let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobTransactionObject.jobDataQuery, false)
        let fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, jobTransactionObject.fieldDataQuery, false)
        let jobMap = jobService.getJobMap(jobsList)
        let jobDataDetailsForListing = jobDataService.getJobDataDetailsForListing(jobDataList, jobAttributeMasterMap)
        let fieldDataMap = fieldDataService.getFieldDataMap(fieldDataList)
        let jobTransactionCustomizationList = this.prepareJobCustomizationList(jobTransactionMap, jobMap, jobDataDetailsForListing, fieldDataMap, jobMasterIdCustomizationMap, jobAttributeMasterMap, jobAttributeStatusMap, customerCareMap, smsTemplateMap)
        return jobTransactionCustomizationList
    }

    updateJobTransactionStatusId(jobMasterIdTransactionDtoMap) {
        for (let jobMasterIdTransactionObject in jobMasterIdTransactionDtoMap) {
            const transactionIdList = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].transactionId.split(":")
            let pendingStatusId = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].pendingStatusId
            realm.updateTableRecordOnProperty(TABLE_JOB_TRANSACTION, 'jobStatusId', transactionIdList, pendingStatusId)
        }
    }

    prepareJobCustomizationList(jobTransactionMap, jobMap, jobDataDetailsForListing, fieldDataMap, jobMasterIdCustomizationMap, jobAttributeMasterMap, jobAttributeStatusMap, customerCareMap, smsTemplateMap) {
        let jobTransactionCustomizationList = []
        for (var index in jobTransactionMap) {
            let jobTransaction = jobTransactionMap[index]
            let jobId = jobTransaction.jobId
            let job = jobMap[jobId]
            const jobMasterId = jobTransaction.jobMasterId
            let jobTransactionCustomization = {}

            if (!jobDataDetailsForListing.jobDataMap[jobId]) {
                jobDataDetailsForListing.jobDataMap[jobId] = {}
            }
            if (!fieldDataMap[jobTransaction.id]) {
                fieldDataMap[jobTransaction.id] = {}
            }

            if (jobMasterIdCustomizationMap[jobMasterId]) {
                jobTransactionCustomization.line1 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][1], jobTransaction, job, jobDataDetailsForListing.jobDataMap[jobId], fieldDataMap[jobTransaction.id])
                jobTransactionCustomization.line2 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][2], jobTransaction, job, jobDataDetailsForListing.jobDataMap[jobId], fieldDataMap[jobTransaction.id])
                jobTransactionCustomization.circleLine1 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][3], jobTransaction, job, jobDataDetailsForListing.jobDataMap[jobId], fieldDataMap[jobTransaction.id])
                jobTransactionCustomization.circleLine2 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][4], jobTransaction, job, jobDataDetailsForListing.jobDataMap[jobId], fieldDataMap[jobTransaction.id])
                jobTransactionCustomization.id = jobTransaction.id
                jobTransactionCustomization.jobMasterId = jobMasterId
            } else {
                jobTransactionCustomization.line1 = jobTransaction.referenceNumber
                jobTransactionCustomization.line2 = ''
                jobTransactionCustomization.circleLine1 = ''
                jobTransactionCustomization.circleLine2 = ''
                jobTransactionCustomization.id = jobTransaction.id
                jobTransactionCustomization.jobMasterId = jobMasterId
            }
            let jobSwipableDetails = this.setJobSwipableDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobAttributeStatusMap, jobTransaction, job, customerCareMap, smsTemplateMap)
            jobTransactionCustomization.jobSwipableDetails = jobSwipableDetails
            jobTransactionCustomization.seqSelected = jobTransaction.seqSelected
            jobTransactionCustomization.statusId = jobTransaction.jobStatusId
            jobTransactionCustomizationList.push(jobTransactionCustomization)
        }
        return jobTransactionCustomizationList
    }

    setTransactionDisplayDetails(customizationObject, jobTransaction, job, jobDataForJobId, fieldDataForJobTransactionId) {
        if (!customizationObject) {
            return ''
        }
        let finalText = ''
        finalText = this.setTransactionCustomizationDynamicParameters(customizationObject, jobTransaction, job, finalText)
        finalText = this.setTransactionCustomizationJobAttributes(customizationObject, jobDataForJobId, finalText)
        finalText = this.setTransactionCustomizationFieldAttributes(customizationObject, fieldDataForJobTransactionId, finalText)
        return finalText
    }

    setTransactionCustomizationJobAttributes(customizationObject, jobDataForJobId, finalText) {
        let jobAttributeMasterList = customizationObject.jobAttr
        if (!customizationObject.separator) {
            customizationObject.separator = ''
        }
        if (!jobAttributeMasterList) {
            jobAttributeMasterList = []
        }
        jobAttributeMasterList.forEach(object => {
            jobData = jobDataForJobId[object.jobAttributeMasterId]
            if (!jobData || _.isUndefined(jobData.value) || _.isNull(jobData.value)) {
                return
            }

            if (finalText == '') {
                finalText += jobData.value
            } else {
                finalText += customizationObject.separator + jobData.value
            }
        })
        return finalText
    }

    setTransactionCustomizationFieldAttributes(customizationObject, fieldDataForJobTransactionId, finalText) {
        let fieldAttributeMasterList = customizationObject.fieldAttr
        if (!customizationObject.separator) {
            customizationObject.separator = ''
        }
        if (!fieldAttributeMasterList) {
            fieldAttributeMasterList = []
        }
        fieldAttributeMasterList.forEach(object => {
            fieldData = fieldDataForJobTransactionId[object.fieldAttributeMasterId]
            if (!fieldData || _.isUndefined(fieldData.value) || _.isNull(fieldData.value)) {
                return
            }

            if (finalText == '') {
                finalText += fieldData.value
            } else {
                finalText += customizationObject.separator + fieldData.value
            }
        })

        return finalText
    }

    setTransactionCustomizationDynamicParameters(customizationObject, jobTransaction, job, finalText) {
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
        if (condition && !_.isUndefined(property) && !_.isNull(property)) {
            if (seperator && !_.isUndefined(finalText) && !_.isNull(finalText) && finalText !== '') {
                text = seperator + extraString + property
            } else {
                text = extraString + property
            }
        }
        return text
    }

    setJobSwipableDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobAttributeStatusMap, jobTransaction, job, customerCareMap, smsTemplateMap) {
        let jobAttributeMap = jobAttributeStatusMap[jobTransaction.jobStatusId]
        let contactData = this.setContactDetails(jobDataDetailsForListing, jobAttributeMap, job)
        let addressData = this.setAddressDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobAttributeMap, job)
        let customerCareData = this.setCustomerCareDetails(customerCareMap, job)
        let smsTemplateData = this.setSMSDetails(smsTemplateMap, job, contactData)
        return {
            contactData,
            addressData,
            customerCareData,
            smsTemplateData
        }
    }

    setContactDetails(jobDataDetailsForListing, jobAttributeMap, job) {
        let tempContactDataForJob = [],
            contactDataForJob = []
        if (!jobAttributeMap) {
            jobAttributeMap = {}
        }
        if (jobDataDetailsForListing.contactMap[job.id]) {
            tempContactDataForJob = jobDataDetailsForListing.contactMap[job.id]
        }

        tempContactDataForJob.forEach(contact => {
            if (jobAttributeMap[contact.jobAttributeMasterId]) {
                contactDataForJob.push(contact.value)
            }
        })

        return contactDataForJob
    }

    setAddressDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobAttributeMap, job) {
        let tempAddressDataForJob = [],
            addressDataForJob = {},
            combinedAddressList = []

        if (!jobAttributeMap) {
            jobAttributeMap = {}
        }

        if (jobDataDetailsForListing.addressMap[job.id]) {
            tempAddressDataForJob = jobDataDetailsForListing.addressMap[job.id]
        }

        if (!_.isUndefined(job.latitude) && !_.isUndefined(job.longitude) && !_.isNull(job.latitude) && !_.isNull(job.longitude) && (job.latitude != 0.0 || job.longitude != 0.0)) {
            combinedAddressList.push(job.latitude + ',' + job.longitude)
        }

        tempAddressDataForJob.forEach(address => {
            if (!jobAttributeMap[address.jobAttributeMasterId]) {
                return
            }
            if (!addressDataForJob[jobAttributeMap[address.jobAttributeMasterId].sequence]) {
                addressDataForJob[jobAttributeMap[address.jobAttributeMasterId].sequence] = {}
            }
            addressDataForJob[jobAttributeMap[address.jobAttributeMasterId].sequence][jobAttributeMasterMap[address.jobAttributeMasterId].attributeTypeId] = address.value
        })

        for (let index in addressDataForJob) {
            let combinedAddress = ''
            combinedAddress += this.appendText(addressDataForJob[index][28], addressDataForJob[index][28], '', null, null)
            combinedAddress += this.appendText(addressDataForJob[index][29], addressDataForJob[index][29], '', ',', combinedAddress)
            combinedAddress += this.appendText(addressDataForJob[index][30], addressDataForJob[index][30], '', ',', combinedAddress)
            combinedAddress += this.appendText(addressDataForJob[index][31], addressDataForJob[index][31], '', ',', combinedAddress)
            combinedAddressList.push(combinedAddress)
        }

        return combinedAddressList
    }

    setCustomerCareDetails(customerCareMap, job) {
        let customerCareListForJob = customerCareMap[job.jobMasterId]
        return customerCareListForJob
    }

    setSMSDetails(smsTemplateMap, job, contactData) {
        if (_.isEmpty(contactData)) {
            return []
        }

        let smsTemplateListForJob = smsTemplateMap[job.jobMasterId]
        return smsTemplateListForJob
    }

    /**
     * 
     * @param {*} jobTransactionId 
     * @param {*} jobAttributeMasterList 
     * @param {*} jobAttributeStatusList 
     * @param {*} fieldAttributeMasterList 
     * @param {*} fieldAttributeStatusList 
     * @param {*} customerCareList 
     * @param {*} smsTemplateList 
     * @param {*} statusList
     * @returns 
     * {
     *      jobDataObject
     *      fieldDataObject
     *      nextStatusList
     * } 
     */
    prepareParticularStatusTransactionDetails(jobTransactionId, jobAttributeMasterList, jobAttributeStatusList, fieldAttributeMasterList, fieldAttributeStatusList, customerCareList, smsTemplateList, statusList) {
        let jobTransactionQuery = 'id = ' + jobTransactionId
        const jobTransaction = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery)
        const statusId = jobTransaction[0].jobStatusId
        const jobId = jobTransaction[0].jobId
        const jobMasterId = jobTransaction[0].jobMasterId
        const jobAttributeMasterMap = jobAttributeMasterService.getJobAttributeMasterMap(jobAttributeMasterList)
        const jobAttributeStatusMap = jobAttributeMasterService.getJobAttributeStatusMap(jobAttributeStatusList)
        const jobStatusObject = jobStatusService.getJobMasterIdStatusIdMap(statusList, jobAttributeStatusMap)
        const jobMasterIdJobAttributeStatusMap = jobStatusObject.jobMasterIdJobAttributeStatusMap
        const statusIdNextStatusMap = jobStatusObject.statusIdNextStatusMap
        const fieldAttributeMasterMap = fieldAttributeMasterService.getFieldAttributeMasterMap(fieldAttributeMasterList)
        const fieldAttributeStatusMap = fieldAttributeMasterService.getFieldAttributeStatusMap(fieldAttributeStatusList)
        let jobAttributeMap = jobMasterIdJobAttributeStatusMap[jobMasterId] ? jobMasterIdJobAttributeStatusMap[jobMasterId][statusId] : jobAttributeMasterMap
        let fieldAttributeMap = fieldAttributeMasterMap[jobMasterId]
        jobAttributeMap = jobAttributeMap ? jobAttributeMap : {}
        fieldAttributeMap = fieldAttributeMap ? fieldAttributeMap : {}
        let jobDataObject = jobDataService.prepareJobDataForTransactionParticularStatus(jobId, jobAttributeMasterMap, jobAttributeMap)
        let fieldDataObject = fieldDataService.prepareFieldDataForTransactionParticularStatus(jobTransactionId, fieldAttributeMap, fieldAttributeStatusMap)
        let skuMap = fieldDataObject.dataMap[17]
        for (let index in skuMap) {
            let fieldAttributeMaster = fieldAttributeMap[index]
            if (!jobDataObject.dataList[fieldAttributeMaster.jobAttributeMasterId]) {
                continue
            }
            delete jobDataObject.dataList[fieldAttributeMaster.jobAttributeMasterId]
        }
        let nextStatusList = statusIdNextStatusMap[statusId]
        jobDataObject.dataList = Object.values(jobDataObject.dataList).sort((x, y) => x.sequence - y.sequence)
        fieldDataObject.dataList = Object.values(fieldDataObject.dataList).sort((x, y) => x.sequence - y.sequence)
        return {
            jobDataObject,
            fieldDataObject,
            nextStatusList
        }
    }

}

export let jobTransactionService = new JobTransaction()