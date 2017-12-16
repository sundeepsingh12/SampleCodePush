import * as realm from '../../repositories/realmdb'
import {
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
    TABLE_RUNSHEET,
} from '../../lib/constants'

import { SKU_ARRAY, ADDRESS_LINE_1, ADDRESS_LINE_2, LANDMARK, PINCODE, SEQ_SELECTED, JOB_EXPIRY_TIME } from '../../lib/AttributeConstants'
import { jobStatusService } from './JobStatus'
import { keyValueDBService } from './KeyValueDBService'
import { jobService } from './Job'
import { jobDataService } from './JobData'
import { fieldDataService } from './FieldData'
import { jobAttributeMasterService } from './JobAttributeMaster'
import { customerCareService } from './CustomerCare'
import { smsTemplateService } from './SMSTemplate'
import { fieldAttributeMasterService } from './FieldAttributeMaster'
import { jobMasterService } from './JobMaster'
import _ from 'lodash'
import moment from 'moment'

class JobTransaction {

    /**A Generic method for filtering out jobtransactions whose job status ids lie in 'statusids'  
     * 
     * @param {*} allJobTransactions 
     * @param {*} statusIds 
     */
    getJobTransactionsForStatusIds(statusIds) {
        let query = statusIds.map(statusId => 'jobStatusId = ' + statusId).join(' OR ')
        const transactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, query)
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
            if (!jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId] || !jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId][unseenTransactionObject.jobStatusId]) {
                let jobStatusIdTransactionIdDtoMap = {}
                jobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobStatusId] = transactionIdDtoObject
                jobMasterIdJobStatusIdTransactionIdDtoMap[unseenTransactionObject.jobMasterId] = jobStatusIdTransactionIdDtoMap
            }
        })
        return jobMasterIdJobStatusIdTransactionIdDtoMap
    }

    /**
     * 
     * @param {*} jobTransactionList 
     * @returns
     * JobTransactionMap : {
     *                        JobTransactionId :   JobTransaction
     *                     }
     * JobQuery
     * JobTransactionQuery
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
            const {
                id,
                jobId,
                jobMasterId,
                jobStatusId,
                referenceNumber,
                runsheetNo,
                runsheetId,
                seqSelected,
                trackCallCount,
                trackCallDuration,
                trackHalt,
                trackKm,
                trackSmsCount,
                trackTransactionTimeSpent
            } = transaction
            if (index == 0) {
                jobQuery += 'id = ' + jobId
                jobTransactionQuery += 'id = ' + id
                jobDataQuery += 'jobId = ' + jobId
                fieldDataQuery += 'jobTransactionId = ' + id
            } else {
                jobQuery += ' OR id = ' + jobId
                jobTransactionQuery += ' OR id = ' + id
                jobDataQuery += ' OR jobId = ' + jobId
                fieldDataQuery += ' OR jobTransactionId = ' + id
            }
            jobTransactionMap[id] = {
                id,
                jobId,
                jobMasterId,
                jobStatusId,
                referenceNumber,
                runsheetNo,
                runsheetId,
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
            fieldDataQuery,
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

    /**
     * This function fetch records from db and  call services that prepares different maps required to prepare JobTransactionCustomizationList
     * @param {*} jobMasterIdCustomizationMap 
     * @param {*} jobAttributeMasterList 
     * @param {*} jobAttributeStatusList 
     * @param {*} customerCareList 
     * @param {*} smsTemplateList 
     * @param {*} statusList 
     * @returns 
     * JobTransactionCustomizationList : [
     *                                      {
     *                                          circleLine1
     *                                          circleLine2
     *                                          id
     *                                          jobMasterId
     *                                          jobSwipableDetails : {
     *                                                                  addressData : []
     *                                                                  contactData : []
     *                                                                  customerCareData : []
     *                                                                  smsTemplateData : []
     *                                                               }
     *                                          jobStatusId
     *                                          line1
     *                                          line2
     *                                          seqSelected
     *                                      }
     *                                  ]
     */
    getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, callingActivity, callingActivityData, selectedDate) {
        let jobAttributeMasterMap = jobAttributeMasterService.getJobAttributeMasterMap(jobTransactionCustomizationListParametersDTO.jobAttributeMasterList)
        let jobAttributeStatusMap = jobAttributeMasterService.getJobAttributeStatusMap(jobTransactionCustomizationListParametersDTO.jobAttributeStatusList)
        const jobStatusObject = jobStatusService.getJobMasterIdStatusIdMap(jobTransactionCustomizationListParametersDTO.statusList, jobAttributeStatusMap)
        const jobMasterIdJobAttributeStatusMap = jobStatusObject.jobMasterIdJobAttributeStatusMap
        let customerCareMap = customerCareService.getCustomerCareMap(jobTransactionCustomizationListParametersDTO.customerCareList)
        let smsTemplateMap = smsTemplateService.getSMSTemplateMap(jobTransactionCustomizationListParametersDTO.smsTemplateList)
        let runsheetQuery
        if (selectedDate && selectedDate != "All") {
            runsheetQuery = `startDate BEGINSWITH '${selectedDate}' AND isClosed = false`
        } else if (selectedDate && selectedDate == "All") {
            runsheetQuery = 'isClosed = false'
        } else {
            runsheetQuery = 'isClosed = true'
        }
        const runsheetList = realm.getRecordListOnQuery(TABLE_RUNSHEET, runsheetQuery)
        let runsheetIdToStartDateMap = {}
        if (selectedDate && selectedDate == "All") {
            runsheetList.forEach(runsheetListObject => { runsheetIdToStartDateMap[runsheetListObject.id] = moment(runsheetListObject.startDate).format('YYYY-MM-DD') })
        }
        let jobTransactionQuery = selectedDate ? runsheetList.map((runsheet) => `runsheetId = ${runsheet.id}`).join(' OR ') : runsheetList.map((runsheet) => `runsheetId != ${runsheet.id}`).join(' AND ')
        if (selectedDate && (!jobTransactionQuery || jobTransactionQuery.trim() == '')) {
            return []
        }
        jobTransactionQuery = jobTransactionQuery && jobTransactionQuery.trim() !== '' ? `deleteFlag != 1 AND (${jobTransactionQuery})` : 'deleteFlag != 1'
        if (callingActivity == 'Bulk') {
            jobTransactionQuery = `${jobTransactionQuery} AND jobMasterId = ${callingActivityData.jobMasterId} AND jobStatusId = ${callingActivityData.statusId}`
        }
        else if (callingActivity == 'Sequence') {
            let statusQuery = callingActivityData.map(statusId => 'jobStatusId = ' + statusId).join(' OR ')
            //Fetch only pending status category job transactions for sequence listing
            jobTransactionQuery = statusQuery && statusQuery.trim() !== '' ? `${jobTransactionQuery} AND (${statusQuery})` : `${jobTransactionQuery}`
        }
        let jobTransactionList = [], jobTransactionMap = {}, jobTransactionObject = {}, jobDataList = [],
            fieldDataList = [], fieldDataMap = {}

        if (callingActivity == 'LiveJob') {
            jobTransactionObject.jobQuery = 'status = 6'
        }
        else {
            jobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery)
            if (jobTransactionList.length == 0) {
                return []
            }
            jobTransactionObject = this.getJobTransactionMapAndQuery(jobTransactionList)
            jobTransactionMap = jobTransactionObject.jobTransactionMap
        }

        let jobsList = realm.getRecordListOnQuery(TABLE_JOB, jobTransactionObject.jobQuery, false)
        let jobMapAndJobDataQuery = jobService.getJobMapAndJobDataQuery(jobsList)
        if (callingActivity == 'LiveJob') {
            jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobMapAndJobDataQuery.jobDataQuery, false)
        } else {
            jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobTransactionObject.jobDataQuery, false)
        }
        let jobDataDetailsForListing = jobDataService.getJobDataDetailsForListing(jobDataList, jobAttributeMasterMap)
        if (callingActivity != 'LiveJob') {
            fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, jobTransactionObject.fieldDataQuery, false)
            fieldDataMap = fieldDataService.getFieldDataMap(fieldDataList)
        }
        let idJobMasterMap = _.mapKeys(jobTransactionCustomizationListParametersDTO.jobMasterList, 'id')
        let jobTransactionCustomizationList = this.prepareJobCustomizationList(jobTransactionMap, jobMapAndJobDataQuery.jobMap, jobDataDetailsForListing, fieldDataMap, jobTransactionCustomizationListParametersDTO.jobMasterIdCustomizationMap, jobAttributeMasterMap, jobMasterIdJobAttributeStatusMap, customerCareMap, smsTemplateMap, idJobMasterMap, callingActivity, runsheetIdToStartDateMap)
        return jobTransactionCustomizationList

    }
    getFirstTransactionWithEnableSequence(jobMasterIdList, statusMap) {
        let jobMasterQuery = jobMasterIdList.map(jobMasterId => 'jobMasterId = ' + jobMasterId).join(' OR ')
        let jobStatusQuery = statusMap.map(statusId => 'jobStatusId = ' + statusId).join(' OR ')
        const jobTransactionQuery = `${jobMasterQuery} AND (${jobStatusQuery})`
        let jobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery, true, SEQ_SELECTED)
        return jobTransactionList[0].seqSelected
    }

    updateJobTransactionStatusId(jobMasterIdTransactionDtoMap) {
        for (let jobMasterIdTransactionObject in jobMasterIdTransactionDtoMap) {
            const transactionIdList = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].transactionId.split(":")
            let pendingStatusId = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].pendingStatusId
            realm.updateTableRecordOnProperty(TABLE_JOB_TRANSACTION, 'jobStatusId', transactionIdList, pendingStatusId)
        }
    }

    /**
     * This function prepares jobTransactionCustomizationList for list of job transactions
     * @param {*} jobTransactionMap 
     * @param {*} jobMap 
     * @param {*} jobDataDetailsForListing 
     * @param {*} fieldDataMap 
     * @param {*} jobMasterIdCustomizationMap 
     * @param {*} jobAttributeMasterMap 
     * @param {*} jobAttributeStatusMap 
     * @param {*} customerCareMap 
     * @param {*} smsTemplateMap 
     * @returns
     * JobTransactionCustomizationList : [
     *                                      {
     *                                          circleLine1
     *                                          circleLine2
     *                                          id
     *                                          jobMasterId
     *                                          jobSwipableDetails : {
     *                                                                  addressData : []
     *                                                                  contactData : []
     *                                                                  customerCareData : []
     *                                                                  smsTemplateData : []
     *                                                               }
     *                                          jobStatusId
     *                                          line1
     *                                          line2
     *                                          seqSelected
     *                                      }
     *                                   ]
     */
    prepareJobCustomizationList(jobTransactionMap, jobMap, jobDataDetailsForListing, fieldDataMap, jobMasterIdCustomizationMap, jobAttributeMasterMap, jobMasterIdJobAttributeStatusMap, customerCareMap, smsTemplateMap, idJobMasterMap, callingActivity, runsheetIdToStartDateMap) {
        let jobTransactionCustomizationList = []
        let jobTransactionDateTOJobTransactionsMap = {}        
        if (callingActivity == 'LiveJob') {
            jobTransactionMap = jobMap
        }
        for (var index in jobTransactionMap) {
            let jobTransaction = jobTransactionMap[index]
            let jobId = callingActivity == 'LiveJob' ? jobTransaction.id : jobTransaction.jobId
            let job = jobMap[jobId]
            const jobMasterId = jobTransaction.jobMasterId
            let jobTransactionCustomization = {}
            jobDataDetailsForListing.jobDataMap[jobId] = jobDataDetailsForListing.jobDataMap[jobId] ? jobDataDetailsForListing.jobDataMap[jobId] : {}
            fieldDataMap[jobTransaction.id] = fieldDataMap[jobTransaction.id] ? fieldDataMap[jobTransaction.id] : {}
            if (jobMasterIdCustomizationMap[jobMasterId]) {
                jobTransactionCustomization.line1 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][1], jobTransaction, job, jobDataDetailsForListing.jobDataMap[jobId], fieldDataMap[jobTransaction.id])
                jobTransactionCustomization.line2 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][2], jobTransaction, job, jobDataDetailsForListing.jobDataMap[jobId], fieldDataMap[jobTransaction.id])
                jobTransactionCustomization.circleLine1 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][3], jobTransaction, job, jobDataDetailsForListing.jobDataMap[jobId], fieldDataMap[jobTransaction.id])
                jobTransactionCustomization.circleLine2 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][4], jobTransaction, job, jobDataDetailsForListing.jobDataMap[jobId], fieldDataMap[jobTransaction.id])
            } else {
                jobTransactionCustomization.line1 = jobTransactionCustomization.line2 = jobTransactionCustomization.circleLine1 = jobTransactionCustomization.circleLine2 = ''
            }
            let jobSwipableDetails = this.setJobSwipableDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobMasterIdJobAttributeStatusMap, jobTransaction, job, customerCareMap, smsTemplateMap)
            jobTransactionCustomization.id = jobTransaction.id
            jobTransactionCustomization.runsheetId = jobTransaction.runsheetId
            jobTransactionCustomization.jobMasterId = jobMasterId
            jobTransactionCustomization.jobSwipableDetails = jobSwipableDetails
            jobTransactionCustomization.seqSelected = jobTransaction.seqSelected
            jobTransactionCustomization.statusId = jobTransaction.jobStatusId
            jobTransactionCustomization.jobMasterIdentifier = idJobMasterMap[jobMasterId].identifier
            jobTransactionCustomization.jobLatitude = job.latitude
            jobTransactionCustomization.jobLongitude = job.longitude
            jobTransactionCustomization.jobId = jobTransaction.jobId
            if (callingActivity == 'LiveJob') {
                jobTransaction.jobTransactionCustomization = jobTransactionCustomization
            }
            jobTransactionCustomization.runsheetNo = jobTransaction.runsheetNo
            jobTransactionCustomization.referenceNumber = jobTransaction.referenceNumber
            if (!_.isEmpty(runsheetIdToStartDateMap)) {
                let jobTransactionsArray = (jobTransactionDateTOJobTransactionsMap[runsheetIdToStartDateMap[jobTransaction.runsheetId]]) ? jobTransactionDateTOJobTransactionsMap[runsheetIdToStartDateMap[jobTransaction.runsheetId]] : []
                jobTransactionsArray.push(jobTransactionCustomization)
                jobTransactionDateTOJobTransactionsMap[runsheetIdToStartDateMap[jobTransaction.runsheetId]] = jobTransactionsArray
            } else {
                jobTransactionCustomizationList.push(jobTransactionCustomization)
            }
        }
        if (callingActivity == 'LiveJob') {
            return jobTransactionMap
        } else {
            return (!_.isEmpty(runsheetIdToStartDateMap)) ? jobTransactionDateTOJobTransactionsMap : jobTransactionCustomizationList
        }
    }

    /** This function prepares string for line1, line2, circleLine1, circleLine2
     * @param {*} customizationObject 
     * @param {*} jobTransaction 
     * @param {*} job 
     * @param {*} jobDataForJobId 
     * @param {*} fieldDataForJobTransactionId
     * @returns
     * finalText : String
     */
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

    /**
     * This function prepares string on basis of job attributes
     * @param {*} customizationObject 
     * @param {*} jobDataForJobId 
     * @param {*} finalText
     * @returns 
     * finalText : String made by job attributes list in customization object
     */
    setTransactionCustomizationJobAttributes(customizationObject, jobDataForJobId, finalText) {
        let jobAttributeMasterList = customizationObject.jobAttr
        customizationObject.separator = customizationObject.separator ? customizationObject.separator : ''
        jobAttributeMasterList = jobAttributeMasterList ? jobAttributeMasterList : []
        jobAttributeMasterList.forEach(object => {
            jobData = jobDataForJobId[object.jobAttributeMasterId]
            if (!jobData || jobData.value == undefined || jobData.value == null) {
                return
            }
            finalText += finalText == '' ? jobData.value : customizationObject.separator + jobData.value
        })
        return finalText
    }

    /**
     * This function prepares string on basis of field attributes
     * @param {*} customizationObject 
     * @param {*} fieldDataForJobTransactionId 
     * @param {*} finalText 
     * @returns
     * finalText : String made by field attributes list in customization object
     */
    setTransactionCustomizationFieldAttributes(customizationObject, fieldDataForJobTransactionId, finalText) {
        let fieldAttributeMasterList = customizationObject.fieldAttr
        customizationObject.separator = customizationObject.separator ? customizationObject.separator : ''
        fieldAttributeMasterList = fieldAttributeMasterList ? fieldAttributeMasterList : []
        fieldAttributeMasterList.forEach(object => {
            fieldData = fieldDataForJobTransactionId[object.fieldAttributeMasterId]
            if (!fieldData || fieldData.value == undefined || fieldData.value == null) {
                return
            }
            finalText += finalText == '' ? fieldData.value : customizationObject.separator + fieldData.value
        })
        return finalText
    }

    /** This function prepares string on basis of fixed attributes
     * @param {*} customizationObject 
     * @param {*} jobTransaction 
     * @param {*} job 
     * @param {*} finalText 
     * @returns 
     * finalText : String made by fixed attributes in customization object
     */
    setTransactionCustomizationDynamicParameters(customizationObject, jobTransaction, job, finalText) {
        finalText += (jobTransaction.referenceNumber) ? this.appendText(customizationObject.referenceNo, jobTransaction.referenceNumber, '', customizationObject.separator, finalText) : this.appendText(customizationObject.referenceNo, job.referenceNo, '', customizationObject.separator, finalText)
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

    /**
     * This function prepares a string to be appended to a text based on conditions
     * @param {*} condition 
     * @param {*} property 
     * @param {*} extraString 
     * @param {*} seperator 
     * @param {*} finalText 
     * @returns
     * text : String to be appended
     */
    appendText(condition, property, extraString, seperator, finalText) {
        let text = ''
        if (condition && property !== undefined && property !== null) {
            if (seperator && finalText !== undefined && finalText !== null && finalText !== '') {
                text = seperator + extraString + property
            } else {
                text = extraString + property
            }
        }
        return text
    }

    /**
     * This function prepares swipable details of job transaction
     * @param {*} jobDataDetailsForListing 
     * @param {*} jobAttributeMasterMap 
     * @param {*} jobMasterIdJobAttributeStatusMap 
     * @param {*} jobTransaction 
     * @param {*} job 
     * @param {*} customerCareMap 
     * @param {*} smsTemplateMap 
     * @returns 
     * jobSwipableDetails : {
     *                          addressData : []
     *                          contactData : []
     *                          customerCareData : []
     *                          smsTemplateData : []
     *                      }
     */
    setJobSwipableDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobMasterIdJobAttributeStatusMap, jobTransaction, job, customerCareMap, smsTemplateMap) {
        let jobAttributeMap = jobMasterIdJobAttributeStatusMap[jobTransaction.jobMasterId] ? jobMasterIdJobAttributeStatusMap[jobTransaction.jobMasterId][jobTransaction.jobStatusId] : jobAttributeMasterMap
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

    /**
     * This function prepares contact details list for job transaction
     * @param {*} jobDataDetailsForListing 
     * @param {*} jobAttributeMap 
     * @param {*} job 
     * @returns
     * ContactDataForJob : [String(number)]
     */
    setContactDetails(jobDataDetailsForListing, jobAttributeMap, job) {
        let contactDataForJob = []
        jobAttributeMap = jobAttributeMap ? jobAttributeMap : {}
        let tempContactDataForJob = jobDataDetailsForListing.contactMap[job.id] ? jobDataDetailsForListing.contactMap[job.id] : []
        tempContactDataForJob.forEach(contact => {
            if (jobAttributeMap[contact.jobAttributeMasterId]) {
                contactDataForJob.push(contact.value)
            }
        })
        return contactDataForJob
    }

    /**
     * This function prepares address details list for job transaction
     * @param {*} jobDataDetailsForListing 
     * @param {*} jobAttributeMasterMap 
     * @param {*} jobAttributeMap 
     * @param {*} job 
     * @returns
     * CombinedAddressList : [String(complete address ie combination of address line 1 , address line 2, landmark, pincode))]
     */
    setAddressDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobAttributeMap, job) {
        let addressDataForJob = {},
            combinedAddressList = []
        jobAttributeMap = jobAttributeMap ? jobAttributeMap : {}
        let tempAddressDataForJob = jobDataDetailsForListing.addressMap[job.id] ? jobDataDetailsForListing.addressMap[job.id] : []
        if (job.latitude !== undefined && job.longitude !== undefined && job.latitude !== null && job.longitude !== null && (job.latitude != 0.0 || job.longitude != 0.0)) {
            combinedAddressList.push(job.latitude + ',' + job.longitude)
        }
        tempAddressDataForJob.forEach(address => {
            if (!jobAttributeMap[address.jobAttributeMasterId]) {
                return
            }
            addressDataForJob[jobAttributeMap[address.jobAttributeMasterId].sequence] = addressDataForJob[jobAttributeMap[address.jobAttributeMasterId].sequence] ? addressDataForJob[jobAttributeMap[address.jobAttributeMasterId].sequence] : {}
            addressDataForJob[jobAttributeMap[address.jobAttributeMasterId].sequence][jobAttributeMasterMap[address.jobAttributeMasterId].attributeTypeId] = address.value
        })
        return addressDataForJob
        // for (let index in addressDataForJob) {
        //     let combinedAddress = ''
        //     combinedAddress += this.appendText(true, addressDataForJob[index][ADDRESS_LINE_1], '', null, null)
        //     combinedAddress += this.appendText(true, addressDataForJob[index][ADDRESS_LINE_2], '', ',', combinedAddress)
        //     combinedAddress += this.appendText(true, addressDataForJob[index][LANDMARK], '', ',', combinedAddress)
        //     combinedAddress += this.appendText(true, addressDataForJob[index][PINCODE], '', ',', combinedAddress)
        //     combinedAddressList.push(combinedAddress)
        // }
    }

    /**
     * This function prepares customer care list for job transaction
     * @param {*} customerCareMap 
     * @param {*} job 
     * @returns
     * CustomerCareListForJob : [CustomerCare]
     */
    setCustomerCareDetails(customerCareMap, job) {
        let customerCareListForJob = customerCareMap[job.jobMasterId]
        // To do
        // customer care url case to be handled
        return customerCareListForJob
    }

    /**
     * This function prepares sms template list for job transaction
     * @param {*} smsTemplateMap 
     * @param {*} job 
     * @param {*} contactData 
     * @returns
     * SmsTemplateListForJob : [SmsTemplate]
     */
    setSMSDetails(smsTemplateMap, job, contactData) {
        if (_.isEmpty(contactData)) {
            return []
        }
        let smsTemplateListForJob = smsTemplateMap[job.jobMasterId]

        // To do 
        // prepare message body to send
        return smsTemplateListForJob
    }

    /**
     * This function prepares transaction details for a particular transaction
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
     *      currentStatus : {
     *                          statusSchema
     *                      }
     *      jobDataObject
     *      fieldDataObject
     *      jobTransactionDisplay : {
     *                                  id: jobTransactionId,
     *                                  jobId,
     *                                  jobMasterId,
     *                                  jobStatusId,
     *                                  referenceNumber,
     *                              }
     * } 
     */
    prepareParticularStatusTransactionDetails(jobTransactionId, jobAttributeMasterList, jobAttributeStatusList, fieldAttributeMasterList, fieldAttributeStatusList, customerCareList, smsTemplateList, statusList, callingActivity) {
        let jobTransactionQuery = 'id = ' + jobTransactionId
        const jobTransaction = (callingActivity != 'LiveJob') ? realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery) : realm.getRecordListOnQuery(TABLE_JOB, jobTransactionQuery)
        let { jobStatusId, jobId, jobMasterId, referenceNumber, seqSelected } = (callingActivity != 'LiveJob') ? jobTransaction[0] : {}
        if (callingActivity == 'LiveJob') {
            jobMasterId = jobTransaction[0].jobMasterId
            jobStatusId = jobTransaction[0].status
            jobId = jobTransaction[0].id
            referenceNumber = jobTransaction[0].referenceNo
        }
        const jobMasterJobAttributeMasterMap = jobAttributeMasterService.getJobMasterJobAttributeMasterMap(jobAttributeMasterList)
        const jobAttributeMasterMap = jobMasterJobAttributeMasterMap[jobMasterId] ? jobMasterJobAttributeMasterMap[jobMasterId] : {}
        const jobAttributeStatusMap = jobAttributeMasterService.getJobAttributeStatusMap(jobAttributeStatusList)
        const jobStatusObject = jobStatusService.getJobMasterIdStatusIdMap(statusList, jobAttributeStatusMap)
        const jobMasterIdJobAttributeStatusMap = jobStatusObject.jobMasterIdJobAttributeStatusMap
        const statusIdStatusMap = jobStatusObject.statusIdStatusMap
        const fieldAttributeMasterMap = fieldAttributeMasterService.getFieldAttributeMasterMap(fieldAttributeMasterList)
        const fieldAttributeStatusMap = fieldAttributeMasterService.getFieldAttributeStatusMap(fieldAttributeStatusList)
        let jobAttributeMap = jobMasterIdJobAttributeStatusMap[jobMasterId] ? jobMasterIdJobAttributeStatusMap[jobMasterId][jobStatusId] ? jobMasterIdJobAttributeStatusMap[jobMasterId][jobStatusId] : {} : jobAttributeMasterMap
        let fieldAttributeMap = fieldAttributeMasterMap[jobMasterId] ? fieldAttributeMasterMap[jobMasterId] : {}
        let jobDataObject = jobDataService.prepareJobDataForTransactionParticularStatus(jobId, jobAttributeMasterMap, jobAttributeMap)
        let fieldDataObject = (callingActivity != 'LiveJob') ? fieldDataService.prepareFieldDataForTransactionParticularStatus(jobTransactionId, fieldAttributeMap, fieldAttributeStatusMap) : {}
        if (callingActivity != 'LiveJob') {
            let skuMap = fieldDataObject.dataMap[SKU_ARRAY]
            let jobTime = jobDataObject.dataMap[JOB_EXPIRY_TIME]
            for (let index in skuMap) {
                let fieldAttributeMaster = fieldAttributeMap[index]
                if (jobDataObject.dataList[fieldAttributeMaster.jobAttributeMasterId]) {
                    delete jobDataObject.dataList[fieldAttributeMaster.jobAttributeMasterId]
                }
            }
        }
        let currentStatus = statusIdStatusMap[jobStatusId]
        jobDataObject.dataList = Object.values(jobDataObject.dataList).sort((x, y) => x.sequence - y.sequence)
        if (callingActivity != 'LiveJob') {
            fieldDataObject.dataList = Object.values(fieldDataObject.dataList).sort((x, y) => x.sequence - y.sequence)
        }
        if (callingActivity != 'LiveJob') {
            const jobTransactionDisplay = {
                id: jobTransactionId,
                jobId,
                jobMasterId,
                jobStatusId,
                referenceNumber,
            }
            return {
                currentStatus,
                fieldDataObject,
                jobDataObject,
                jobTransactionDisplay,
                seqSelected,
            }
        }
        else {
            const jobTransactionDisplay = {
                id: jobId,
                jobId,
                jobMasterId,
                jobStatusId,
                referenceNumber,
            }
            return {
                currentStatus,
                jobDataObject,
                jobTransactionDisplay,
            }
        }
    }

}

export let jobTransactionService = new JobTransaction()