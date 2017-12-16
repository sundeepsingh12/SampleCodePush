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
    JOB_ETA
} from '../../lib/AttributeConstants'
import _ from 'lodash'
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
    async addServerSms(statusId, jobMasterId, fieldData, jobTransaction) {
        const smsJobStatuses = await keyValueDBService.getValueFromStore(SMS_JOB_STATUS);
        let smsForStatus = smsJobStatuses.value.filter(smsJobStatus => smsJobStatus.statusId == statusId)
        if (smsForStatus.length <= 0)
            return []
        let serverSmsLogs = []
        for (let smsJobStatus of smsForStatus) {
            let serverSmsLog = {
                userId: jobTransaction.userId,
                companyId: jobTransaction.companyId,
                hubId: jobTransaction.hubId,
                cityId: jobTransaction.cityId,
                jobTransactionId: jobTransaction.id,
                referenceNumber: jobTransaction.referenceNumber,
                runsheetNumber: jobTransaction.runsheetNo,
            }
            const jobData = this.getJobData(jobTransaction)
            const fieldDataList = [];
            if (fieldData) {
                fieldDataList = fieldData.value.filter(data => data.fieldAttributeMasterId == smsJobStatus.contactNoJobAttributeId && data.jobTransactionId == jobTransaction.id)
            }
            let jobDataWithContactAttribute = jobData.filter(data => data.jobAttributeMasterId == smsJobStatus.contactNoJobAttributeId && data.jobId == jobTransaction.jobId)
            if (jobDataWithContactAttribute && jobDataWithContactAttribute.length > 0) {
                serverSmsLog.contact = jobDataWithContactAttribute[0].value
            } else if (fieldDataList && fieldDataList.length > 0) {
                serverSmsLog.contact = fieldDataList[0].value
            }
            let jobAttributesList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE);
            let fieldAttributesList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE);
            let user = await keyValueDBService.getValueFromStore(USER);
            let fieldAndJobAttrMap = await this.getKeyToAttributeMap(jobAttributesList, fieldAttributesList)
            if (smsJobStatus.messageBody && smsJobStatus.messageBody.trim() != '') {
                let messageBody = await this.setSmsBodyJobData(smsJobStatus.messageBody, jobData, jobTransaction, fieldAndJobAttrMap.keyToJobAttributeMap)
                messageBody = await this.setSmsBodyFixedAttribute(messageBody, jobTransaction, user)
                if (fieldData && fieldData.value) {
                    messageBody = await this.setSMSBodyFieldData(messageBody, fieldData.value, jobTransaction, fieldAndJobAttrMap.keyToFieldAttributeMap)
                    messageBody = await this.checkForRecursiveData(messageBody, '', jobData, fieldData.value, jobTransaction, fieldAndJobAttrMap, user)
                }
                serverSmsLog.smsBody = messageBody
                serverSmsLog.dateTime = moment().format('YYYY-MM-DD HH:mm:ss') + ''
            }
            serverSmsLogs.push(serverSmsLog)
        }
        let serverSMSLogObject = this.saveServerSmsLog(serverSmsLogs)
        return serverSMSLogObject
    }
    getKeyToAttributeMap(jobAttributesList, fieldAttributesList) {
        let keyToJobAttributeMap = _.mapKeys(jobAttributesList.value, 'key')
        let keyToFieldAttributeMap = _.mapKeys(fieldAttributesList.value, 'key')
        return { keyToJobAttributeMap, keyToFieldAttributeMap }
    }
    /**
      * This function returns job data for given jobtransaction
      * @param {*} jobAttributeMasterId 
      * @param {*} jobTransaction
      * @returns
      * {
      *      serverSmsLogs,
      *      TABLE_NAME
      * }
      */
    getJobData(jobTransaction) {
        let jobDataQuery = `jobId = ${jobTransaction.jobId}`
        let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery, null, null)
        let jobData = []
        for (let index in jobDataList) {
            let data = { ...jobDataList[index] }
            if (!data) return jobData
            jobData.push(data)
        }
        return jobData
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
    setSmsBodyJobData(messageBody, jobDataList, jobTransaction, keyToJobAttributeMap) {
        let reqEx = /\{.*?\}/g
        let keys = messageBody.match(reqEx)
        if (!keys || !jobDataList) return messageBody
        for (let key of keys) {
            let keyForJob = key.slice(1, key.length - 1)
            let jobAttributeWithSameKey = keyToJobAttributeMap[keyForJob]
            if (jobAttributeWithSameKey) {
                let jobData = jobDataList.filter(data => data.jobAttributeMasterId == jobAttributeWithSameKey.id && data.jobId == jobTransaction.jobId)
                messageBody = (jobData[0] && jobData[0].value) ? messageBody.replace(key, jobData[0].value) : messageBody.replace(key, 'N.A.')
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
                    messageBody = (bikerNumber && bikerNumber.length > 0) ? messageBody.replace(key, bikerNumber) : messageBody.replace(key, 'N.A.')
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
                    let creationDate = moment(jobTransaction.jobCreatedAt).format('DD MMM')
                    messageBody = messageBody.replace(key, creationDate)
                    break
                case TRANSACTION_DATE:
                    let transactionDate = moment(jobTransaction.lastUpdatedAtServer).format('DD MMM')
                    messageBody = messageBody.replace(key, transactionDate)
                    break
                case JOB_ETA:
                    let jobEta = jobTransaction.jobEtaTime
                    messageBody = (jobEta && jobEta.length > 0) ? messageBody.replace(key, moment(jobEta).format('dd MMM')) : messageBody.replace(key, '')
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
        if (!keys || keys.length <= 0)
            return messageBody
        if (!previousMessage == messageBody) {
            messageBody = this.setSmsBodyJobData(messageBody, jobData, jobTransaction, fieldAndJobAttrMap.keyToJobAttributeMap)
            messageBody = this.setSMSBodyFieldData(messageBody, fieldData, jobTransaction, fieldAndJobAttrMap.keyToFieldAttributeMap)
            messageBody = this.setSmsBodyFixedAttribute(messageBody, jobTransaction, user)
            previousMessage = messageBody
            messageBody = this.checkForRecursiveData(messageBody, previousMessage, jobData, fieldData, jobTransaction, fieldAndJobAttrMap)
        }
        else {
            messageBody = this.setSmsBodyJobData(messageBody, jobData, jobTransaction, fieldAndJobAttrMap.keyToJobAttributeMap)
            messageBody = this.setSMSBodyFieldData(messageBody, fieldData, jobTransaction, fieldAndJobAttrMap.keyToFieldAttributeMap)
            messageBody = this.setSmsBodyFixedAttribute(messageBody, jobTransaction, user)
        }
        return messageBody
    }
    sendFieldMessage(contact, smsTemplate, jobTransaction, jobData, fieldData, jobAttributesList, fieldAttributesList, user) {
        if (smsTemplate.body && smsTemplate.body.trim() != '') {
            let fieldDataList, jobDataList;
            let messageBody = smsTemplate.body
            let fieldAndJobAttrMap = this.getKeyToAttributeMap(jobAttributesList, fieldAttributesList)

            if (jobData != null) {
                jobDataList = fieldData.map((dataList) => dataList.data)
                messageBody = this.setSmsBodyJobData(smsTemplate.body, jobDataList, jobTransaction, jobAttributesList)
            }
            if (fieldData != null) {
                fieldDataList = fieldData.map((dataList) => dataList.data)
                messageBody = this.setSMSBodyFieldData(messageBody, fieldDataList, jobTransaction, fieldAndJobAttrMap.keyToFieldAttributeMap)
            }
            messageBody = this.setSmsBodyFixedAttribute(messageBody, jobTransaction, user)
            if (messageBody && messageBody.length > 0 && contact && contact.length > 0) {
                Communications.text(contact, messageBody)
            }
        }
    }
    /**
    * This function checks if a sms is mapped to transaction's pending status and saves server sms log
    * @param {String} transactionIdDtos 
    */
    async setServerSmsMapForPendingStatus(transactionIdDtosMap) {
        if(!transactionIdDtosMap) {
            return
        }
        let pendingSyncTransactionIds = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
        let transactionsToSync = (!pendingSyncTransactionIds || !pendingSyncTransactionIds.value) ? [] : pendingSyncTransactionIds.value; // if there is no pending transactions then assign empty array else its existing values        
        let transactionIdDtos = _.values(transactionIdDtosMap)
        let jobTransactionQuery = transactionIdDtos.map(transactionIdDto => 'id = ' + transactionIdDto.transactionId).join(' OR ')
        let transactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery, null, null)
        let serverSmsLogs = []

        for (let index in transactionList) {
            let jobTransaction = { ...transactionList[index] }
            if (jobTransaction) {
                let serverSmsLog = await this.addServerSms(transactionIdDtosMap[jobTransaction.id].pendingStatusId, transactionIdDtosMap[jobTransaction.id].jobMasterId, null, jobTransaction)
                if (serverSmsLog.value != []) {
                    let pendingTransaction = {
                        id: jobTransaction.id, referenceNumber: jobTransaction.referenceNumber
                    }
                    serverSmsLogs = serverSmsLogs.concat(serverSmsLog.value)
                    transactionsToSync = transactionsToSync.concat(pendingTransaction)
                }
            }
        }
        let serverSmsLogList = this.saveServerSmsLog(serverSmsLogs)
        await keyValueDBService.validateAndSaveData(PENDING_SYNC_TRANSACTION_IDS, transactionsToSync);
        realm.performBatchSave(serverSmsLogList)
    }
}


export let addServerSmsService = new AddServerSms()

