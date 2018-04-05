'use strict'

import { keyValueDBService } from './KeyValueDBService'
import {
    SMS_JOB_STATUS,
    TABLE_JOB_DATA,
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    USER,
    TABLE_SERVER_SMS_LOG,
    TABLE_JOB_TRANSACTION,
    PENDING_SYNC_TRANSACTION_IDS
} from '../../lib/constants'
import * as realm from '../../repositories/realmdb'
import moment from 'moment';
import Communications from 'react-native-communications';
import {
    BIKER_NAME,
    BIKER_MOBILE,
    REF_NO,
    ATTEMPT_NO,
    RUNSHEET_NO,
    CREATION_DATE,
    TRANSACTION_DATE,
    JOB_ETA,
    TRANSACTION_COMPLETED_DATE
} from '../../lib/AttributeConstants'
import _ from 'lodash'
import { jobDataService } from './JobData'
class AddServerSms {

    /**
   * This function sets message body and returns server sms logs
   * @param {*} statusId 
   * @param {*} jobMasterId 
   * @param {*} fieldData
   * @param {*} jobTransaction
   * @returns
   * {
   *      serverSmsLogs,
   *      TABLE_NAME
   * }
   */
    async addServerSms(statusId, jobMasterId, fieldData, jobTransactionList) {
        if (_.isEmpty(jobTransactionList)) return []
        let serverSmsMap = await this.prepareServerSmsMap()
        if (_.isEmpty(serverSmsMap)) return []
        let smsMapForStatus = serverSmsMap[statusId]
        if (!smsMapForStatus) return []
        let serverSmsLogs = []
        let jobAndFieldAttributes = await this.getJobFieldAttributeForJobmaster(jobMasterId)
        let user = await keyValueDBService.getValueFromStore(USER);
        let jobIdToJobDataMap = jobDataService.getJobData(jobTransactionList)
        for (let jobTransaction of jobTransactionList) {
            let serverSmsLog = this.setSmsBody(statusId, fieldData, jobTransaction, jobAndFieldAttributes.jobAttributes, jobAndFieldAttributes.fieldAttributes, user, smsMapForStatus, jobIdToJobDataMap[jobTransaction.jobId])
            if (serverSmsLog && serverSmsLog.length > 0) {
                serverSmsLogs = serverSmsLogs.concat(serverSmsLog)
            }
        }
        let serverSMSLogObject = this.saveServerSmsLog(serverSmsLogs)
        return serverSMSLogObject
    }

    setSmsBody(statusId, fieldData, jobTransaction, jobAttributesList, fieldAttributesList, user, smsForStatus, jobData) {
        let serverSmsLogs = []
        let fieldDataList = [];

        for (let smsJobStatus of smsForStatus) {
            if (!jobData || jobData.length < 1) break
            let serverSmsLog = {
                userId: jobTransaction.userId,
                companyId: jobTransaction.companyId,
                hubId: jobTransaction.hubId,
                cityId: jobTransaction.cityId,
                jobTransactionId: jobTransaction.id,
                referenceNumber: jobTransaction.referenceNumber,
                runsheetNumber: jobTransaction.runsheetNo,
            }
            if (fieldData && fieldData.value) {
                fieldDataList = fieldData.value.filter(data => data.fieldAttributeMasterId == smsJobStatus.contactNoJobAttributeId && data.jobTransactionId == jobTransaction.id)
            }
            let jobDataWithContactAttribute = jobData[smsJobStatus.contactNoJobAttributeId]
            if (jobDataWithContactAttribute && jobDataWithContactAttribute.value) {
                serverSmsLog.contact = jobDataWithContactAttribute.value
            } else if (fieldDataList && fieldDataList.length > 0) {
                serverSmsLog.contact = fieldDataList[0].value
            }

            let fieldAndJobAttrMap = this.getKeyToAttributeMap(jobAttributesList, fieldAttributesList)
            if (smsJobStatus.messageBody && smsJobStatus.messageBody.trim() != '') {
                let messageBody = this.setSmsBodyJobData(smsJobStatus.messageBody, jobData, jobTransaction, fieldAndJobAttrMap.keyToJobAttributeMap)
                messageBody = this.setSmsBodyFixedAttribute(messageBody, jobTransaction, user)
                if (fieldData && fieldData.value) {
                    messageBody = this.setSMSBodyFieldData(messageBody, fieldData.value, jobTransaction, fieldAndJobAttrMap.keyToFieldAttributeMap)
                    messageBody = this.checkForRecursiveData(messageBody, '', jobData, fieldData.value, jobTransaction, fieldAndJobAttrMap, user)
                } else {
                    messageBody = this.checkForRecursiveData(messageBody, '', jobData, null, jobTransaction, fieldAndJobAttrMap, user)
                }
                serverSmsLog.smsBody = messageBody
                serverSmsLog.dateTime = moment().format('YYYY-MM-DD HH:mm:ss') + ''
            }
            serverSmsLogs.push(serverSmsLog)
        }
        return serverSmsLogs
    }
    getKeyToAttributeMap(jobAttributesList, fieldAttributesList) {
        let keyToJobAttributeMap = (jobAttributesList && jobAttributesList.length > 0) ? _.mapKeys(jobAttributesList, 'key') : {}
        let keyToFieldAttributeMap = (fieldAttributesList && fieldAttributesList.length > 0) ? _.mapKeys(fieldAttributesList, 'key') : {}
        return { keyToJobAttributeMap, keyToFieldAttributeMap }
    }


    /**
     * This function sets message body with job data values
     * @param {String} messageBody 
     * @param {*} jobDataList
     * @param {*} jobTransaction
     * @param {*} jobAttributesList
     * @returns
     * messageBody: string
     */
    setSmsBodyJobData(messageBody, jobDataMap, jobTransaction, keyToJobAttributeMap, jobDataList) {
        let reqEx = /\{.*?\}/g
        let keys = messageBody.match(reqEx)
        if (!keys) return messageBody
        for (let key of keys) {
            let keyForJob = key.slice(1, key.length - 1)
            let jobAttributeWithSameKey = keyToJobAttributeMap[keyForJob]
            if (jobAttributeWithSameKey) {
                if (jobDataMap) {
                    let jobData = jobDataMap[jobAttributeWithSameKey.id]
                    messageBody = (jobData && jobData.value) ? messageBody.replace(key, jobData.value) : messageBody.replace(key, 'N.A.')
                } else if (jobDataList) {
                    let jobData = jobDataList.filter(data => data.jobAttributeMasterId == jobAttributeWithSameKey.id && data.jobId == jobTransaction.jobId)
                    messageBody = (jobData[0] && jobData[0].value) ? messageBody.replace(key, jobData[0].value) : messageBody.replace(key, 'N.A.')
                }
            }
        }
        return messageBody
    }
    /**
    * This function sets message body with field data values
    * @param {String} messageBody 
    * @param {*} fieldDataList
    * @param {*} jobTransaction
    * @param {*} fieldAttributesList
    * @returns
    * messageBody: string
    */
    setSMSBodyFieldData(messageBody, fieldDataList, jobTransaction, keyToFieldAttributeMap) {
        let reqEx = /\{.*?\}/g
        let keys = messageBody.match(reqEx)
        if (!keys || !fieldDataList || fieldDataList.length <= 0) return messageBody
        for (let key of keys) {
            let keyForJob = key.slice(1, key.length - 1)
            let fieldAttributesWithSameKey = keyToFieldAttributeMap[keyForJob]
            if (fieldAttributesWithSameKey) {
                let fieldData = fieldDataList.filter(data => data.fieldAttributeMasterId == fieldAttributesWithSameKey.id && data.jobTransactionId == jobTransaction.id)
                messageBody = (fieldData[0] && fieldData[0].value) ? messageBody.replace(key, fieldData[0].value) : messageBody.replace(key, 'N.A.')
            }
        }
        return messageBody
    }
    /**
    * This function sets message body with fixed attributes enclosed by <>
    * @param {String} messageBody 
    * @param {*} jobTransaction
    * @param {*} user
    * @returns
    * messageBody: string
    */
    setSmsBodyFixedAttribute(messageBody, jobTransaction, user) {
        let reqEx = /\<.*?\>/g
        let keys = messageBody.match(reqEx)
        if (!keys) return messageBody
        for (let key of keys) {
            let keyForJob = key.slice(1, key.length - 1)
            switch (keyForJob) {
                case BIKER_NAME:
                    let bikerName = user.value.firstName + ' ' + user.value.lastName
                    messageBody = bikerName ? messageBody.replace(key, bikerName) : messageBody.replace(key, 'N.A.')
                    break
                case BIKER_MOBILE:
                    let bikerNumber = user.value.mobileNumber
                    messageBody = (bikerNumber) ? messageBody.replace(key, bikerNumber) : messageBody.replace(key, 'N.A.')
                    break
                case REF_NO:
                    messageBody = messageBody.replace(key, jobTransaction.referenceNumber)
                    break
                case ATTEMPT_NO:
                    messageBody = messageBody.replace(key, jobTransaction.attemptCount + '')
                    break
                case RUNSHEET_NO:
                    messageBody = messageBody.replace(key, jobTransaction.runsheetNo)
                    break
                case CREATION_DATE:
                    let creationDate = (jobTransaction.jobCreatedAt) ? moment(jobTransaction.jobCreatedAt).format('DD MMM') : 'N.A.'
                    messageBody = messageBody.replace(key, creationDate)
                    break
                case TRANSACTION_DATE:
                    let transactionDate = (jobTransaction.lastUpdatedAtServer) ? moment(jobTransaction.lastUpdatedAtServer).format('DD MMM') : 'N.A.'
                    messageBody = messageBody.replace(key, transactionDate)
                    break
                case JOB_ETA://check this
                    let jobEta = jobTransaction.jobEtaTime
                    messageBody = (jobEta && jobEta.length > 0) ? messageBody.replace(key, moment(jobEta).format('DD MMM')) : messageBody.replace(key, '')
                    break
                case TRANSACTION_COMPLETED_DATE:
                    let lastTransactionTimeOnMobile = jobTransaction.lastTransactionTimeOnMobile
                    messageBody = (lastTransactionTimeOnMobile && lastTransactionTimeOnMobile.length > 0) ? messageBody.replace(key, moment(lastTransactionTimeOnMobile).format('DD MMM')) : messageBody.replace(key, '')
                    break
            }
        }
        return messageBody
    }
    saveServerSmsLog(serverSmsLogs) {
        let currentFieldDataObject = {}; // used object to set currentFieldDataId as call-by-reference whereas if we take integer then it is by call-by-value and hence value of id is not updated in that scenario.
        currentFieldDataObject.currentFieldDataId = realm.getRecordListOnQuery(TABLE_SERVER_SMS_LOG, null, true, 'id').length;
        for (let serverSms of serverSmsLogs) {
            serverSms.id = currentFieldDataObject.currentFieldDataId
            currentFieldDataObject.currentFieldDataId++
        }
        return {
            tableName: TABLE_SERVER_SMS_LOG,
            value: serverSmsLogs
        };
    }
    /**
    * This function recursively checks for keys and replaces with job or field data values
    * @param {String} messageBody 
    * @param {String} previousMessage 
    * @param {*} jobData
    * @param {*} fieldData
    * @param {*} jobTransaction
    * @param {*} jobAttributesList
    * @param {*} fieldAttributesList
    * @param {*} user
    * @returns
    * messageBody: string
    */
    checkForRecursiveData(messageBody, previousMessage, jobData, fieldData, jobTransaction, fieldAndJobAttrMap, user) {
        let reqEx = /\{.*?\}/g
        let keys = messageBody.match(reqEx)
        if (!keys || keys.length <= 0 || !fieldData)
            return messageBody
        if (!previousMessage == messageBody) {
            messageBody = this.setSmsBodyJobData(messageBody, jobData, jobTransaction, fieldAndJobAttrMap.keyToJobAttributeMap)
            messageBody = (fieldData) ? this.setSMSBodyFieldData(messageBody, fieldData, jobTransaction, fieldAndJobAttrMap.keyToFieldAttributeMap) : messageBody
            messageBody = this.setSmsBodyFixedAttribute(messageBody, jobTransaction, user)
            previousMessage = messageBody
            messageBody = this.checkForRecursiveData(messageBody, previousMessage, jobData, fieldData, jobTransaction, fieldAndJobAttrMap)
        }
        else {
            messageBody = this.setSmsBodyJobData(messageBody, jobData, jobTransaction, fieldAndJobAttrMap.keyToJobAttributeMap)
            messageBody = (fieldData) ? this.setSMSBodyFieldData(messageBody, fieldData, jobTransaction, fieldAndJobAttrMap.keyToFieldAttributeMap) : messageBody
            messageBody = this.setSmsBodyFixedAttribute(messageBody, jobTransaction, user)
        }
        return messageBody
    }
    sendFieldMessage(contact, smsTemplate, jobTransaction, jobData, fieldData, jobAttributesList, fieldAttributesList, user) {
        if (smsTemplate.body && smsTemplate.body.trim() != '') {
            let fieldDataList, jobDataList;
            let messageBody = smsTemplate.body
            let fieldAndJobAttrMap = this.getKeyToAttributeMap(jobAttributesList.value, fieldAttributesList.value)

            if (jobData) {
                jobDataList = jobData.map((dataList) => dataList.data)
                messageBody = this.setSmsBodyJobData(smsTemplate.body, null, jobTransaction, fieldAndJobAttrMap.keyToJobAttributeMap, jobDataList)
            }
            if (fieldData) {
                fieldDataList = fieldData.map((dataList) => dataList.data)
                messageBody = this.setSMSBodyFieldData(messageBody, fieldDataList, jobTransaction, fieldAndJobAttrMap.keyToFieldAttributeMap)
            }
            messageBody = this.setSmsBodyFixedAttribute(messageBody, jobTransaction, user)
            if (messageBody && messageBody.length > 0 && contact && contact.length > 0) {
                Communications.text(contact, messageBody)
            }
        }
    }

    async getJobFieldAttributeForJobmaster(jobMasterId) {
        let jobAttributesList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE);
        let fieldAttributesList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE);
        if (jobAttributesList && jobAttributesList.value && fieldAttributesList && fieldAttributesList.value) {
            let jobAttributes = jobAttributesList.value.filter(jobAttribute => jobAttribute.jobMasterId == jobMasterId)
            let fieldAttributes = fieldAttributesList.value.filter(fieldAttribute => fieldAttribute.jobMasterId == jobMasterId)
            return { jobAttributes, fieldAttributes }
        } else {
            return { jobAttributes: [], fieldAttributes: [] }
        }
    }
    /**
    * This function checks if a sms is mapped to transaction's pending status and saves server sms log
    * @param {String} transactionIdDtos 
    */
    async setServerSmsMapForPendingStatus(transactionIdDtosMap) {
        if (_.isEmpty(transactionIdDtosMap)) {
            return
        }
        let serverSmsMap = await this.prepareServerSmsMap()
        if (_.isEmpty(serverSmsMap)) {
            return
        }
        let user = await keyValueDBService.getValueFromStore(USER);
        let serverSmsLogs = []
        for (let jobMasterId in transactionIdDtosMap) {
            let statusIdTransactionIdMap = _.values(transactionIdDtosMap[jobMasterId])
            if (statusIdTransactionIdMap && statusIdTransactionIdMap[0] && serverSmsMap[statusIdTransactionIdMap[0].pendingStatusId]) {
                let jobAndFieldAttributes = await this.getJobFieldAttributeForJobmaster(jobMasterId)
                let transactionIdList = statusIdTransactionIdMap[0].transactionId.split(':')
                let jobTransactionQuery = transactionIdList.map(transactionId => 'id = ' + transactionId).join(' OR ')
                let transactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery, null, null)
                let jobIdToJobDataMap = jobDataService.getJobData(transactionList)
                for (let index in transactionList) {
                    let jobTransaction = { ...transactionList[index] }
                    let serverSmsLog = await this.setSmsBody(statusIdTransactionIdMap[0].pendingStatusId, null, jobTransaction, jobAndFieldAttributes.jobAttributes, jobAndFieldAttributes.fieldAttributes, user, serverSmsMap[statusIdTransactionIdMap[0].pendingStatusId], jobIdToJobDataMap[jobTransaction.jobId])
                    if (serverSmsLog.length > 0) {
                        serverSmsLogs = serverSmsLogs.concat(serverSmsLog)
                    }
                }
            } else {
                return
            }
        }

        let serverSmsLogList
        if (serverSmsLogs && serverSmsLogs.length > 0) {
            serverSmsLogList = this.saveServerSmsLog(serverSmsLogs)
            realm.performBatchSave(serverSmsLogList)
        }
    }

    getServerSmsLogs(serverSmsLogs, lastSyncTime) {
        let serverSmsLogsToBySynced = []
        serverSmsLogs.forEach(serverSmsLog => {
            if (moment(serverSmsLog.dateTime).isAfter(lastSyncTime)) {
                serverSmsLogsToBySynced.push(serverSmsLog)
            }
        })
        return serverSmsLogsToBySynced
    }
    async prepareServerSmsMap() {
        const smsJobStatuses = await keyValueDBService.getValueFromStore(SMS_JOB_STATUS);
        let serverSmsMap = {}
        if (!smsJobStatuses || !smsJobStatuses.value) return {}
        for (let smsJobStatus of smsJobStatuses.value) {
            serverSmsMap[smsJobStatus.statusId] = (!serverSmsMap[smsJobStatus.statusId]) ? [smsJobStatus] : serverSmsMap[smsJobStatus.statusId].concat(smsJobStatus)
        }
        return serverSmsMap
    }
}



export let addServerSmsService = new AddServerSms()

