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
    PENDING_SYNC_TRANSACTION_IDS,
    TABLE_MESSAGE_INTERACTION
} from '../../lib/constants'

import { SKU_ARRAY, ADDRESS_LINE_1, ADDRESS_LINE_2, LANDMARK, PINCODE, SEQ_SELECTED, JOB_EXPIRY_TIME } from '../../lib/AttributeConstants'
import { ATTEMPT, SLOT, START, END, DISTANCE, HALT_DURATION, CALL_COUNT, CALL_DURATION, SMS, TIME_SPENT, SEQUENCE } from '../../lib/ContainerConstants'
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
import { formLayoutEventsInterface } from './formLayout/FormLayoutEventInterface'
import { runSheetService } from './RunSheet';
import { messageService } from '../../services/classes/MessageService'

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

    getJobTransactionsForDeleteSync(statusIds, postOrderList) {
        let query = statusIds ? statusIds.map(statusId => 'jobStatusId = ' + statusId).join(' OR ') : ''
        let postOrderQuery = postOrderList ? postOrderList.map(referenceNumber => `referenceNumber = "${referenceNumber}"`).join(' OR ') : ''
        query = query && query.trim() !== '' ? query + ' OR ' + postOrderQuery : postOrderQuery
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
    getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions, jobMasterIdJobStatusIdOfPendingCodeMap, jobStatusIdJobSummaryMap) {
        let updatedJobStatusIdJobStatusMap = {}, updatedTransactonsList = [], jobMasterIdTransactionDtoMap = {};
        for (let transaction in unseenTransactions) {
            let unseenTransactionObject = { ...unseenTransactions[transaction] };
            let transactionIdDtoObject = {
                "jobMasterId": unseenTransactionObject.jobMasterId,
                "pendingStatusId": jobMasterIdJobStatusIdOfPendingCodeMap[unseenTransactionObject.jobMasterId],
                "transactionId": '',
                "unSeenStatusId": unseenTransactionObject.jobStatusId
            };
            transactionIdDtoObject = jobMasterIdTransactionDtoMap[unseenTransactionObject.jobMasterId] ? jobMasterIdTransactionDtoMap[unseenTransactionObject.jobMasterId] : transactionIdDtoObject;
            transactionIdDtoObject.transactionId = transactionIdDtoObject.transactionId != '' ? transactionIdDtoObject.transactionId + ":" : transactionIdDtoObject.transactionId;
            transactionIdDtoObject.transactionId = transactionIdDtoObject.transactionId + unseenTransactionObject.id;
            jobMasterIdTransactionDtoMap[unseenTransactionObject.jobMasterId] = transactionIdDtoObject;
            unseenTransactionObject.jobStatusId = jobMasterIdJobStatusIdOfPendingCodeMap[unseenTransactionObject.jobMasterId];
            updatedTransactonsList.push(unseenTransactionObject);
            let updatedPendingJobSummary = updatedJobStatusIdJobStatusMap[transactionIdDtoObject.pendingStatusId] ? updatedJobStatusIdJobStatusMap[transactionIdDtoObject.pendingStatusId] : jobStatusIdJobSummaryMap[transactionIdDtoObject.pendingStatusId];
            let updatedUnseenJobSummary = jobStatusIdJobSummaryMap[transactionIdDtoObject.unSeenStatusId];
            updatedPendingJobSummary.count += 1;
            updatedUnseenJobSummary.count = 0;
            updatedJobStatusIdJobStatusMap[transactionIdDtoObject.pendingStatusId] = updatedPendingJobSummary;
            updatedJobStatusIdJobStatusMap[transactionIdDtoObject.unSeenStatusId] = updatedUnseenJobSummary;
        }
        return {
            transactionIdDtos: Object.values(jobMasterIdTransactionDtoMap),
            jobSummaries: Object.values(updatedJobStatusIdJobStatusMap),
            updatedTransactonsList
        }
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
     * FieldDataQuery
     */
    getJobTransactionMapAndQuery(jobTransactionList) {
        let jobQuery = '', jobTransactionQuery = '', fieldDataQuery = '', jobTransactionMap = {};
        for (let index in jobTransactionList) {
            const transaction = jobTransactionList[index];
            const { id, jobId, jobMasterId, jobStatusId, referenceNumber, runsheetNo, runsheetId, seqSelected, trackCallCount, trackCallDuration, trackHalt, trackKm, trackSmsCount, trackTransactionTimeSpent, seqAssigned, seqActual } = transaction;
            if (index == 0) {
                jobQuery += 'id = ' + jobId;
                jobTransactionQuery += 'id = ' + id;
                fieldDataQuery += 'jobTransactionId = ' + id;
            } else {
                jobQuery += ' OR id = ' + jobId;
                jobTransactionQuery += ' OR id = ' + id;
                fieldDataQuery += ' OR jobTransactionId = ' + id;
            }
            jobTransactionMap[id] = { id, jobId, jobMasterId, jobStatusId, referenceNumber, runsheetNo, runsheetId, seqSelected, trackCallCount, trackCallDuration, trackHalt, trackKm, trackSmsCount, trackTransactionTimeSpent, seqAssigned, seqActual };
        }
        return { jobTransactionMap, jobQuery, jobTransactionQuery, fieldDataQuery };
    }



    /**Returns JobMasterIds of unseen transactions
     * 
     * @param {*} unseenTransactions 
     */
    getUnseenTransactionsJobMasterIds(unseenTransactions) {
        const jobMasterIds = unseenTransactions.map(unseenTransactionObject => unseenTransactionObject.jobMasterId)
        return jobMasterIds
    }

    prepareMapsForTransactionCustomizationList(jobTransactionCustomizationListParametersDTO) {
        let jobAttributeMasterMap = _.mapKeys(jobTransactionCustomizationListParametersDTO.jobAttributeMasterList, 'id');
        let jobAttributeStatusMap = jobAttributeMasterService.getJobAttributeStatusMap(jobTransactionCustomizationListParametersDTO.jobAttributeStatusList)
        let jobStatusObject = jobStatusService.getJobMasterIdStatusIdMap(jobTransactionCustomizationListParametersDTO.statusList, jobAttributeStatusMap)
        let jobMasterIdJobAttributeStatusMap = jobStatusObject.jobMasterIdJobAttributeStatusMap
        let customerCareMap = customerCareService.getCustomerCareMap(jobTransactionCustomizationListParametersDTO.customerCareList)
        let smsTemplateMap = smsTemplateService.getSMSTemplateMap(jobTransactionCustomizationListParametersDTO.smsTemplateList)
        let jobMasterIdMap = _.mapKeys(jobTransactionCustomizationListParametersDTO.jobMasterList, 'id')
        return { jobAttributeMasterMap, jobAttributeStatusMap, jobStatusObject, jobMasterIdJobAttributeStatusMap, customerCareMap, smsTemplateMap, jobMasterIdMap }
    }

    /**
     * This function fetch records from db and  call services that prepares different maps required to prepare JobTransactionCustomizationList
     * @param {*} jobTransactionCustomizationListParametersDTO 
     * @param {*} queryDTO 
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
    getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, queryDTO) {
        let jobTransactionDTO = {};
        let jobTransactionCustomizationListParametersMaps = this.prepareMapsForTransactionCustomizationList(jobTransactionCustomizationListParametersDTO);
        let runsheetObject = runSheetService.prepareJobTransactionQueryOnBasisOfRunsheet(queryDTO ? null : jobTransactionCustomizationListParametersDTO.customNaming.enableFutureDateRunsheet);
        let jobTransactionQuery = runsheetObject.jobTransactionQuery;
        jobTransactionQuery = jobTransactionQuery && jobTransactionQuery.trim() !== '' ? `deleteFlag != 1 AND (${jobTransactionQuery})` : 'deleteFlag != 1';
        jobTransactionQuery = queryDTO && queryDTO.jobTransactionQuery && queryDTO.jobTransactionQuery.trim() !== '' ? `${jobTransactionQuery} AND ${queryDTO.jobTransactionQuery}` : jobTransactionQuery;
        let jobTransactionList = [], jobTransactionMap = {}, jobTransactionObject = {}, jobDataList = [], fieldDataList = [], fieldDataMap = {};
        jobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery);
        if (jobTransactionList.length == 0) {
            return [];
        }
        jobTransactionObject = this.getJobTransactionMapAndQuery(jobTransactionList);
        jobTransactionDTO.jobTransactionMap = jobTransactionObject.jobTransactionMap;
        jobTransactionObject.jobQuery = queryDTO && queryDTO.jobQuery ? `(${jobTransactionObject.jobQuery}) AND ${queryDTO.jobQuery}` : jobTransactionObject.jobQuery;
        let jobsList = realm.getRecordListOnQuery(TABLE_JOB, jobTransactionObject.jobQuery);
        let jobMapAndJobDataQuery = jobService.getJobMapAndJobDataQuery(jobsList);
        jobTransactionDTO.jobMap = jobMapAndJobDataQuery.jobMap;
        jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobMapAndJobDataQuery.jobDataQuery);
        jobTransactionDTO.jobDataDetailsForListing = jobDataService.getJobDataDetailsForListing(jobDataList, jobTransactionCustomizationListParametersMaps.jobAttributeMasterMap);
        fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, jobTransactionObject.fieldDataQuery);
        jobTransactionDTO.fieldDataMap = fieldDataService.getFieldDataMap(fieldDataList);
        let jobTransactionCustomizationList = this.prepareJobCustomizationList(jobTransactionDTO, jobTransactionCustomizationListParametersDTO.jobMasterIdCustomizationMap, jobTransactionCustomizationListParametersMaps, runsheetObject.runsheetMap);
        return jobTransactionCustomizationList;
    }

    /** @function getFirstTransactionWithEnableSequence(jobMasterIdList,statusMap)
    * function return jobTransaction with top most sequencea among all transaction
    *
    * @param {Array} jobMasterIdList //jobMasterId List with enable resequence restriction
    * 
    * @param {Array} statusMap //jobStatusId List with current tabId
    * 
    *@return {Object} {jobTransactionList[0]}
    */

    getFirstTransactionWithEnableSequence(jobMasterListWithEnableResequence, statusList) {
        let runsheetQuery = 'isClosed = false'
        const runsheetList = realm.getRecordListOnQuery(TABLE_RUNSHEET, runsheetQuery)
        if (_.isEmpty(jobMasterListWithEnableResequence) || _.isEmpty(runsheetList)) {
            return null
        }
        let jobTransactionQuery = runsheetList.map((runsheet) => `runsheetId = ${runsheet.id}`).join(' OR ')
        let jobMasterQuery = jobMasterListWithEnableResequence.map(jobMaster => 'jobMasterId = ' + jobMaster.id).join(' OR ')
        let jobStatusQuery = statusList.map(status => 'jobStatusId = ' + status.id).join(' OR ')
        jobTransactionQuery = jobTransactionQuery && jobTransactionQuery.trim() !== '' ? `deleteFlag != 1 AND (${jobTransactionQuery})` : 'deleteFlag != 1'
        jobTransactionQuery = `(${jobTransactionQuery}) AND (${jobMasterQuery}) AND (${jobStatusQuery})`
        let jobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery, true, SEQ_SELECTED)
        return jobTransactionList && jobTransactionList.length > 0 ? jobTransactionList[0] : null
    }

    updateJobTransactionStatusId(jobMasterIdTransactionDtoMap) {
        // db hit avoid
        for (let jobMasterIdTransactionObject in jobMasterIdTransactionDtoMap) {
            const transactionIdList = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].transactionId.split(":")
            let pendingStatusId = jobMasterIdTransactionDtoMap[jobMasterIdTransactionObject].pendingStatusId
            realm.updateTableRecordOnProperty(TABLE_JOB_TRANSACTION, 'jobStatusId', transactionIdList, pendingStatusId)
        }
    }

    /** @function getEnableMultiPartJobMaster(jobMasterList)
      * function return List of all jobMaster With enable multipart assignment 
      *
      *@param {Array} jobMasterList //all jobMasterList 
      * 
      *@return {Array} jobMasterListWithEnableMultiPart
      */

    getEnableMultiPartJobMaster(jobMasterList) {
        let jobMasterListWithEnableMultiPart = jobMasterList.filter(jobMaster => jobMaster.enableMultipartAssignment == true)
        return jobMasterListWithEnableMultiPart
    }

    /** @function getJobIdGroupIdMap(jobMasterListWithEnableMultiPart)
     * function return map of jobId verses groupId whose groupid is not null
     *
     * @param {Array} jobMasterListWithEnableMultiPart //jobMasterList with enable multipart assignment
     * 
     *@return {Object} {jobIdGroupIdMap}
     */

    getJobIdGroupIdMap(jobMastersList) {
        let jobMasterListWithEnableMultiPart = this.getEnableMultiPartJobMaster(jobMastersList)
        if (!jobMasterListWithEnableMultiPart || jobMasterListWithEnableMultiPart.length == 0) return {}
        let jobMasterQuery = jobMasterListWithEnableMultiPart.map(jobMaster => 'jobMasterId = ' + jobMaster.id).join(' OR ')
        let jobQuery = `groupId != null AND (${jobMasterQuery})`
        let jobList = realm.getRecordListOnQuery(TABLE_JOB, jobQuery)
        let jobIdGroupIdMap = {}
        jobList.forEach(job => { jobIdGroupIdMap[job.id] = job.groupId })
        return jobIdGroupIdMap
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
     *                                          seqActual
     *                                          seqAssigned
     *                                      }
     *                                   ]
     */
    prepareJobCustomizationList(jobTransactionDTO, jobMasterIdCustomizationMap, jobTransactionCustomizationListParametersMaps, runsheetMap) {
        let jobTransactionCustomizationList = [];
        for (var index in jobTransactionDTO.jobTransactionMap) {
            let jobTransaction = jobTransactionDTO.jobTransactionMap[index], jobId = jobTransaction.jobId, job = jobTransactionDTO.jobMap[jobId], jobMasterId = jobTransaction.jobMasterId, jobTransactionCustomization = {};
            if (!job) {
                continue
            }
            jobTransactionDTO.jobDataDetailsForListing.jobDataMap[jobId] = jobTransactionDTO.jobDataDetailsForListing.jobDataMap[jobId] ? jobTransactionDTO.jobDataDetailsForListing.jobDataMap[jobId] : {};
            jobTransactionDTO.fieldDataMap[jobTransaction.id] = jobTransactionDTO.fieldDataMap[jobTransaction.id] ? jobTransactionDTO.fieldDataMap[jobTransaction.id] : {};
            let singleTransactionDTO = { jobTransaction, job, jobData: jobTransactionDTO.jobDataDetailsForListing.jobDataMap[jobId], fieldData: jobTransactionDTO.fieldDataMap[jobTransaction.id] };
            if (jobMasterIdCustomizationMap[jobMasterId]) {
                jobTransactionCustomization.line1 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][1], singleTransactionDTO);
                jobTransactionCustomization.line2 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][2], singleTransactionDTO);
                jobTransactionCustomization.circleLine1 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][3], singleTransactionDTO);
                jobTransactionCustomization.circleLine2 = this.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobMasterId][4], singleTransactionDTO);
            } else {
                jobTransactionCustomization.line1 = jobTransactionCustomization.line2 = jobTransactionCustomization.circleLine1 = jobTransactionCustomization.circleLine2 = '';
            }
            let jobSwipableDetails = this.setJobSwipableDetails(jobTransactionDTO.jobDataDetailsForListing, jobTransactionCustomizationListParametersMaps, jobTransaction, job);
            jobTransactionCustomization.id = jobTransaction.id;
            jobTransactionCustomization.runsheetId = jobTransaction.runsheetId;
            jobTransactionCustomization.jobMasterId = jobMasterId;
            jobTransactionCustomization.jobSwipableDetails = jobSwipableDetails;
            jobTransactionCustomization.seqSelected = jobTransaction.seqSelected;
            jobTransactionCustomization.statusId = jobTransaction.jobStatusId;
            jobTransactionCustomization.jobMasterIdentifier = jobTransactionCustomizationListParametersMaps.jobMasterIdMap[jobMasterId].identifier;
            jobTransactionCustomization.jobLatitude = job.latitude;
            jobTransactionCustomization.jobLongitude = job.longitude;
            jobTransactionCustomization.jobId = jobTransaction.jobId;
            jobTransactionCustomization.identifierColor = jobTransactionCustomizationListParametersMaps.jobMasterIdMap[jobMasterId].identifierColor;
            jobTransactionCustomization.seqActual = jobTransaction.seqActual;
            jobTransactionCustomization.seqAssigned = jobTransaction.seqAssigned;
            jobTransactionCustomization.runsheetNo = jobTransaction.runsheetNo;
            jobTransactionCustomization.referenceNumber = job.referenceNo;
            jobTransactionCustomization.groupId = jobTransactionCustomizationListParametersMaps.jobMasterIdMap[jobMasterId].enableMultipartAssignment ? job.groupId : null;
            jobTransactionCustomization.runsheetDate = runsheetMap[jobTransaction.runsheetId] ? runsheetMap[jobTransaction.runsheetId].startDate : null;
            jobTransactionCustomization.jobStartTime = job.jobStartTime;
            jobTransactionCustomization.jobEndTime = job.jobEndTime;
            jobTransactionCustomization.isNextStatusPresent = jobTransaction.jobStatusId ? jobTransactionCustomizationListParametersMaps.jobStatusObject.statusIdStatusMap[jobTransaction.jobStatusId].nextStatusList && jobTransactionCustomizationListParametersMaps.jobStatusObject.statusIdStatusMap[jobTransaction.jobStatusId].nextStatusList.length > 0 : null;
            jobTransactionCustomization.jobPriority = jobTransactionCustomizationListParametersMaps.jobMasterIdMap[jobMasterId].enableJobPriority ? job.jobPriority : 0;
            jobTransactionCustomizationList.push(jobTransactionCustomization);
        }
        return jobTransactionCustomizationList;
    }

    /**
     * /** This function prepares string for line1, line2, circleLine1, circleLine2
     * @param {*} customizationObject 
     * @param {*} jobTransactionDTO : {
     *                                      jobTransaction
     *                                      job
     *                                      jobData
     *                                      fieldData
     *                                }
     * @returns
     * finalText : String
     */
    setTransactionDisplayDetails(customizationObject, jobTransactionDTO) {
        if (!customizationObject) {
            return ''
        }
        let finalText = ''
        finalText = this.setTransactionCustomizationDynamicParameters(customizationObject, jobTransactionDTO.jobTransaction, jobTransactionDTO.job, finalText)
        finalText = this.setTransactionCustomizationJobAttributes(customizationObject, jobTransactionDTO.jobData, finalText)
        finalText = this.setTransactionCustomizationFieldAttributes(customizationObject, jobTransactionDTO.fieldData, finalText)
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
        finalText += this.appendText(customizationObject.referenceNo, job.referenceNo, '', customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.runsheetNo, jobTransaction.runsheetNo, '', customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.noOfAttempts, job.attemptCount, ATTEMPT, customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.slot, job.slot, SLOT, customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.startTime, job.jobStartTime, START, customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.endTime, job.jobEndTime, END, customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.trackKm, jobTransaction.trackKm, DISTANCE, customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.trackHalt, jobTransaction.trackHalt, HALT_DURATION, customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.trackCallCount, jobTransaction.trackCallCount, CALL_COUNT, customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.trackCallDuration, jobTransaction.trackCallDuration, CALL_DURATION, customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.trackSmsCount, jobTransaction.trackSmsCount, SMS, customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.trackTransactionTimeSpent, jobTransaction.trackTransactionTimeSpent, TIME_SPENT, customizationObject.separator, finalText);
        finalText += this.appendText(customizationObject.routingSequenceNumber, jobTransaction.seqSelected, SEQUENCE, customizationObject.separator, finalText);
        return finalText;
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

    async checkIdToBeSync(jobTransactionId) {
        let pendingSyncTransactionIds = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS)
        let checkId = false
        if (pendingSyncTransactionIds && pendingSyncTransactionIds.value.length > 0) {
            for (let item of pendingSyncTransactionIds.value) {
                if (item.id == jobTransactionId) {
                    checkId = true
                    break
                }
            }
        }
        return checkId
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
    setJobSwipableDetails(jobDataDetailsForListing, jobTransactionCustomizationListParametersMaps, jobTransaction, job) {
        let jobAttributeMap = jobTransactionCustomizationListParametersMaps.jobMasterIdJobAttributeStatusMap[jobTransaction.jobMasterId] ? jobTransactionCustomizationListParametersMaps.jobMasterIdJobAttributeStatusMap[jobTransaction.jobMasterId][jobTransaction.jobStatusId] : jobTransactionCustomizationListParametersMaps.jobAttributeMasterMap
        let contactData = this.setContactDetails(jobDataDetailsForListing, jobAttributeMap, job)
        let addressData = this.setAddressDetails(jobDataDetailsForListing, jobTransactionCustomizationListParametersMaps.jobAttributeMasterMap, jobAttributeMap, job)
        let customerCareData = this.setCustomerCareDetails(jobTransactionCustomizationListParametersMaps.customerCareMap, job)
        let smsTemplateData = this.setSMSDetails(jobTransactionCustomizationListParametersMaps.smsTemplateMap, job, contactData)
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
     * addressDataForJob 
     */
    setAddressDetails(jobDataDetailsForListing, jobAttributeMasterMap, jobAttributeMap, job) {
        let addressDataForJob = {},
            combinedAddressList = []
        jobAttributeMap = jobAttributeMap ? jobAttributeMap : {}
        let tempAddressDataForJob = jobDataDetailsForListing.addressMap[job.id] ? jobDataDetailsForListing.addressMap[job.id] : []
        tempAddressDataForJob.forEach(address => {
            if (!jobAttributeMap[address.jobAttributeMasterId]) {
                return
            }
            addressDataForJob[jobAttributeMap[address.jobAttributeMasterId].sequence] = addressDataForJob[jobAttributeMap[address.jobAttributeMasterId].sequence] ? addressDataForJob[jobAttributeMap[address.jobAttributeMasterId].sequence] : {}
            addressDataForJob[jobAttributeMap[address.jobAttributeMasterId].sequence][jobAttributeMasterMap[address.jobAttributeMasterId].attributeTypeId] = address.value
        })
        return addressDataForJob
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
    async prepareParticularStatusTransactionDetails(jobTransactionId, jobAttributeMasterList, jobAttributeStatusList, fieldAttributeMasterList, fieldAttributeStatusList, customerCareList, smsTemplateList, statusList, callingActivity) {
        let jobTransactionQuery = 'id = ' + jobTransactionId
        const jobTransaction = (callingActivity != 'LiveJob') ? realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery) : realm.getRecordListOnQuery(TABLE_JOB, jobTransactionQuery)
        let { jobStatusId, jobId, jobMasterId, referenceNumber, seqSelected, attemptCount, runsheetNo, jobCreatedAt, lastUpdatedAtServer, jobEtaTime, runsheetId, hubId, cityId, companyId, actualAmount, moneyTransactionType, startTime, endTime } = (callingActivity != 'LiveJob') ? jobTransaction[0] : {}
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
        const checkForSeenStatus = (callingActivity != 'LiveJob') ? jobStatusService.isSeenStatusCode(jobStatusId, statusIdStatusMap) : false
        if (checkForSeenStatus) {
            jobStatusId = checkForSeenStatus
            lastUpdatedAtServer = moment().format('YYYY-MM-DD HH:mm:ss')
            let jobTransactionList = await formLayoutEventsInterface.saveData([], jobTransactionId, checkForSeenStatus, jobMasterId)
            await formLayoutEventsInterface.addTransactionsToSyncList(jobTransactionList)
        }
        // if (callingActivity == 'LiveJob') {
        //     jobMasterId = jobTransaction[0].jobMasterId
        //     jobStatusId = jobTransaction[0].status
        //     jobId = jobTransaction[0].id
        //     referenceNumber = jobTransaction[0].referenceNo
        // }
        const fieldAttributeMasterMap = fieldAttributeMasterService.getFieldAttributeMasterMap(fieldAttributeMasterList)
        const fieldAttributeStatusMap = fieldAttributeMasterService.getFieldAttributeStatusMap(fieldAttributeStatusList)
        let jobAttributeMap = jobMasterIdJobAttributeStatusMap[jobMasterId] ? jobMasterIdJobAttributeStatusMap[jobMasterId][jobStatusId] ? jobMasterIdJobAttributeStatusMap[jobMasterId][jobStatusId] : {} : jobAttributeMasterMap
        let fieldAttributeMap = fieldAttributeMasterMap[jobMasterId] ? fieldAttributeMasterMap[jobMasterId] : {}
        let jobDataObject = jobDataService.prepareJobDataForTransactionParticularStatus(jobId, jobAttributeMasterMap, jobAttributeMap)
        let fieldDataObject = (callingActivity != 'LiveJob') ? fieldDataService.prepareFieldDataForTransactionParticularStatus(jobTransactionId, fieldAttributeMap, fieldAttributeStatusMap) : {}
        let jobTime
        if (callingActivity != 'LiveJob') {
            let skuMap = fieldDataObject.dataMap[SKU_ARRAY]
            jobTime = jobDataObject.dataMap[JOB_EXPIRY_TIME]
            for (let index in skuMap) {
                let fieldAttributeMaster = fieldAttributeMap[index]
                if (jobDataObject.dataList[fieldAttributeMaster.jobAttributeMasterId]) {
                    delete jobDataObject.dataList[fieldAttributeMaster.jobAttributeMasterId]
                }
            }
        }
        let currentStatus = statusIdStatusMap[jobStatusId]
        jobDataObject.dataList = Object.values(jobDataObject.dataList).sort((x, y) => x.sequence - y.sequence)
        let messageList = messageService.getMessagesForParticularTransaction(jobTransactionId)
        if (callingActivity != 'LiveJob') {
            fieldDataObject.dataList = Object.values(fieldDataObject.dataList).sort((x, y) => x.sequence - y.sequence)
            const jobTransactionDisplay = {
                id: jobTransactionId,
                jobId,
                jobMasterId,
                jobStatusId,
                referenceNumber,
                attemptCount,
                runsheetNo,
                jobCreatedAt,
                lastUpdatedAtServer,
                jobEtaTime,
                runsheetId,
                companyId,
                cityId,
                hubId,
                actualAmount,
                moneyTransactionType,
                startTime,
                endTime,
            }
            return {
                currentStatus,
                fieldDataObject,
                jobDataObject,
                jobTransactionDisplay,
                seqSelected,
                jobTime,
                checkForSeenStatus,
                messageList
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

    /**
     * This function fetch unseen job transactions which are assigned to the user
     * @param {*} jobMaster 
     * @returns
     * {
     *      jobTransactionMap : {
     *                              referenceNumber : jobTransaction
     *                          }
     *      pendingCount : integer
     * }
     */
    async getUnseenJobTransaction(jobMasterId) {
        let unseenStatusId = await jobStatusService.getStatusIdForJobMasterIdAndCode(jobMasterId, UNSEEN)
        let runsheetQuery = 'isClosed = true'
        const runsheetList = realm.getRecordListOnQuery(TABLE_RUNSHEET, runsheetQuery)
        let jobTransactionQuery = runsheetList.map((runsheet) => `runsheetId != ${runsheet.id}`).join(' AND ')
        jobTransactionQuery = jobTransactionQuery && jobTransactionQuery.trim() !== '' ? `jobMasterId = ${jobMasterId} AND jobStatusId = ${unseenStatusId} AND deleteFlag != 1  AND (${jobTransactionQuery})` : `jobMasterId = ${jobMasterId} AND jobStatusId = ${unseenStatusId} AND deleteFlag != 1`
        let unseenJobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery)
        let jobTransactionMap = {}
        for (let index in unseenJobTransactionList) {
            let jobTransaction = { ...unseenJobTransactionList[index] }
            jobTransactionMap[jobTransaction.referenceNumber] = jobTransaction
        }
        return {
            jobTransactionMap,
            pendingCount: unseenJobTransactionList.length
        }
    }

    /**
       * This function checks for future runsheet enabled and returns selected date if multipart is not selected
       * @param {*}  customNaming
       * @param {*}  jobIdGroupIdMap
       * @param {*}  date
       * @returns
       * {
       *     enableFutureDateRunsheet: boolean,
       *     selectedDate:date
       * }
       */
    getFutureRunsheetEnabled(customNaming) {
        return (customNaming && customNaming.value && customNaming.value.enableFutureDateRunsheet ? customNaming.value.enableFutureDateRunsheet : false);
    }
}

export let jobTransactionService = new JobTransaction()