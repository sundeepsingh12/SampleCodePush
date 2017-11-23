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

class AddServerSms {
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
            const jobData = this.getJobData(smsJobStatus.contactNoJobAttributeId, jobTransaction)
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
            if (smsJobStatus.messageBody && smsJobStatus.messageBody.trim() != '') {
                let messageBody = await this.setSmsBodyJobData(smsJobStatus.messageBody, jobData, jobTransaction)
                messageBody = await this.setSmsBodyFixedAttribute(messageBody, jobTransaction)
                if (fieldData && fieldData.value) {
                    messageBody = await this.setSMSBodyFieldData(messageBody, fieldData.value, jobTransaction)
                    messageBody = await this.checkForRecursiveData(messageBody, '', jobData, fieldData.value, jobTransaction)
                }
                serverSmsLog.smsBody = messageBody
                serverSmsLog.dateTime = moment().format('YYYY-MM-DD HH:mm:ss') + ''
            }
            serverSmsLogs.push(serverSmsLog)
        }
        let serverSMSLogObject = this.saveServerSmsLog(serverSmsLogs)
        return serverSMSLogObject
    }

    getJobData(jobAttributeMasterId, jobTransaction) {
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

    async setSmsBodyJobData(messageBody, jobDataList, jobTransaction) {
        let reqEx = /\{.*?\}/g
        let keys = messageBody.match(reqEx)
        let jobAttributesList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE);
        if (!keys || !jobDataList) return messageBody
        for (let key of keys) {
            let keyForJob = key.slice(1, key.length - 1)
            let jobAttributesWithSameKey = jobAttributesList.value.filter(jobAttribute => jobAttribute.key == keyForJob)
            if (jobAttributesWithSameKey[0]) {
                let jobData = jobDataList.filter(data => data.jobAttributeMasterId == jobAttributesWithSameKey[0].id && data.jobId == jobTransaction.jobId)
                if (jobData[0] && jobData[0].value)
                    messageBody = messageBody.replace(key, jobData[0].value)
            }

        }
        return messageBody
    }
    async setSMSBodyFieldData(messageBody, fieldDataList, jobTransaction) {
        let reqEx = /\{.*?\}/g
        let keys = messageBody.match(reqEx)
        let fieldAttributesList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE);
        if (!keys || !fieldDataList || fieldDataList.length <= 0) return messageBody
        for (let key of keys) {
            let keyForJob = key.slice(1, key.length - 1)
            let fieldAttributesWithSameKey = fieldAttributesList.value.filter(fieldAttribute => fieldAttribute.key == keyForJob)
            if (fieldAttributesWithSameKey[0]) {
                let fieldData = fieldDataList.filter(data => data.fieldAttributeMasterId == fieldAttributesWithSameKey[0].id && data.jobTransactionId == jobTransaction.id)
                if (fieldData[0] && fieldData[0].value)
                    messageBody = messageBody.replace(key, fieldData[0].value)
            }
        }
        return messageBody
    }
    async setSmsBodyFixedAttribute(messageBody, jobTransaction) {
        let reqEx = /\<.*?\>/g
        let keys = messageBody.match(reqEx)
        if (!keys) return messageBody
        let user = await keyValueDBService.getValueFromStore(USER);
        for (let key of keys) {
            let keyForJob = key.slice(1, key.length - 1)
            switch (keyForJob) {
                case 'BIKER_NAME':
                    let bikerName = user.value.firstName + ' ' + user.value.lastName
                    messageBody = bikerName ? messageBody.replace(key, bikerName) : messageBody.replace(key, 'N.A.')
                    break
                case 'BIKER_MOBILE':
                    let bikerNumber = user.value.mobileNumber
                    messageBody = (bikerNumber && bikerNumber.length > 0) ? messageBody.replace(key, bikerNumber) : messageBody.replace(key, 'N.A.')
                    break
                case 'REF_NO':
                    messageBody = messageBody.replace(key, jobTransaction.referenceNumber)
                    break
                case 'ATTEMPT_NO':
                    messageBody = messageBody.replace(key, jobTransaction.attemptCount + '')
                    break
                case 'RUNSHEET_NO':
                    messageBody = messageBody.replace(key, jobTransaction.runsheetNo)
                    break
                case 'CREATION_DATE':
                    let creationDate = moment(jobTransaction.jobCreatedAt).format('DD MMM')
                    messageBody = messageBody.replace(key, creationDate)
                    break
                case 'TRANSACTION_DATE':
                    let transactionDate = moment(jobTransaction.lastUpdatedAtServer).format('DD MMM')
                    messageBody = messageBody.replace(key, transactionDate)
                    break
                case 'JOB_ETA':
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
    async checkForRecursiveData(messageBody, previousMessage, jobData, fieldData, jobTransaction) {
        let reqEx = /\{.*?\}/g
        let keys = messageBody.match(reqEx)
        if (!keys || keys.length <= 0)
            return messageBody
        if (!previousMessage == messageBody) {
            messageBody = await this.setSmsBodyJobData(messageBody, jobData, jobTransaction)
            messageBody = await this.setSMSBodyFieldData(messageBody, fieldData, jobTransaction)
            messageBody = await this.setSmsBodyFixedAttribute(messageBody, jobTransaction)
            previousMessage = messageBody
            messageBody = await this.checkForRecursiveData(messageBody, previousMessage, jobData, fieldData, jobTransaction)
        }
        else {
            messageBody = await this.setSmsBodyJobData(messageBody, jobData, jobTransaction)
            messageBody = await this.setSMSBodyFieldData(messageBody, fieldData, jobTransaction)
            messageBody = await this.setSmsBodyFixedAttribute(messageBody, jobTransaction)
        }
        return messageBody
    }
    async sendFieldMessage(contact, smsTemplate, jobTransaction, jobData, fieldData) {
        if (smsTemplate.body && smsTemplate.body.trim() != '') {
            let fieldDataList;
            let messageBody = smsTemplate.body
            if (jobData != null) {
                messageBody = await this.setSmsBodyJobData(smsTemplate.body, jobData, jobTransaction)
            }
            if (fieldData != null) {
                fieldDataList = fieldData.map((dataList) => dataList.data)
                messageBody = await this.setSMSBodyFieldData(messageBody, fieldDataList, jobTransaction)
            }
            messageBody = await this.setSmsBodyFixedAttribute(messageBody, jobTransaction)
            if (messageBody && messageBody.length > 0 && contact && contact.length > 0) {
                Communications.text(contact, messageBody)
            }
        }
    }
    async setServerSmsMapForPendingStatus(transactionIdDtos) {
        const smsJobStatuses = await keyValueDBService.getValueFromStore(SMS_JOB_STATUS);
        for (let transactionIdDto of transactionIdDtos) {
            let smsForStatus = smsJobStatuses.value.filter(smsJobStatus => smsJobStatus.statusId == transactionIdDto.pendingStatusId)
            if (!smsForStatus || smsForStatus.length <= 0)
                continue

            let transactionQuery = `id =  ${transactionIdDto.transactionId}`
            let transactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, transactionQuery, null, null)
            for (let index in transactionList) {
                let jobTransaction = { ...transactionList[index] }
                if (jobTransaction) {
                    let serverSmsLog = await this.addServerSms(transactionIdDto.pendingStatusId, transactionIdDto.jobMasterId, null, jobTransaction)
                    if (serverSmsLog) {
                        realm.performBatchSave(serverSmsLog)
                        let pendingSyncTransactionIds = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
                        let transactionsToSync = (!pendingSyncTransactionIds || !pendingSyncTransactionIds.value) ? [] : pendingSyncTransactionIds.value; // if there is no pending transactions then assign empty array else its existing values
                        if (!transactionsToSync.includes(transactionIdDto.transactionId))
                            transactionsToSync.push(transactionIdDto.transactionId);
                        await keyValueDBService.validateAndSaveData(PENDING_SYNC_TRANSACTION_IDS, transactionsToSync);
                    }
                }
            }
        }
    }
}

export let addServerSmsService = new AddServerSms()

