'use strict'

import { keyValueDBService } from './KeyValueDBService'
import {
    SMS_JOB_STATUS,
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    USER,
    TABLE_SERVER_SMS_LOG,
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
import { fieldDataService } from './FieldData'
class AddServerSms {

    /**
   * This function sets message body and returns server sms logs
   * @param {*} statusId 
   * @param {*} jobMasterId 
   * @param {*} fieldData
   * @param {*} jobTransactionList
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
        let { keyToJobAttributeMap, keyToFieldAttributeMap } = await this.getJobFieldAttributeForJobmaster()
        let user = await keyValueDBService.getValueFromStore(USER);
        let jobIdToJobDataMap = jobDataService.getJobData(jobTransactionList)
        let transactionIdToFieldDataMap = (fieldData && fieldData.value) ? fieldDataService.getFieldDataMap(fieldData.value, false) : {}
        for (let jobTransaction of jobTransactionList) {
            let serverSmsLog = this.setSmsBody( transactionIdToFieldDataMap[jobTransaction.id], jobTransaction, keyToFieldAttributeMap[jobMasterId], keyToJobAttributeMap[jobMasterId], user, smsMapForStatus, jobIdToJobDataMap[jobTransaction.jobId])
            if (serverSmsLog && serverSmsLog.length > 0) {
                serverSmsLogs = serverSmsLogs.concat(serverSmsLog)
            }
        }
        let serverSMSLogObject = this.saveServerSmsLog(serverSmsLogs)
        console.logs("serverSMSLogObject",serverSMSLogObject)
        return serverSMSLogObject
    }

    setSmsBody( fieldDataMap, jobTransaction, fieldAttrMap, jobAttrMap,  user, smsForStatus, jobDataMap) {
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
            if(jobDataMap[smsJobStatus.contactNoJobAttributeId] || fieldDataMap[smsJobStatus.contactNoJobAttributeId]) {
                serverSmsLog.contact = (jobDataMap[smsJobStatus.contactNoJobAttributeId]) ? jobDataMap[smsJobStatus.contactNoJobAttributeId].value : fieldDataMap[smsJobStatus.contactNoJobAttributeId].value
            } 
            if (smsJobStatus.messageBody && smsJobStatus.messageBody.trim() != '') {
                serverSmsLog.smsBody = this.checkForRecursiveData(smsJobStatus.messageBody, '', jobDataMap, fieldDataMap, jobTransaction, fieldAttrMap, jobAttrMap, user)
                serverSmsLog.dateTime = moment().format('YYYY-MM-DD HH:mm:ss') + ''
            }
            serverSmsLogs.push(serverSmsLog)
        }
        return serverSmsLogs
    }

    /**
    * This function sets message body with fixed attributes enclosed by <>
    * @param {String} messageBody 
    * @param {*} jobTransaction
    * @param {*} user
    * @returns
    * messageBody: string
    */
    setSmsBodyFixedAttribute(messageBody, jobTransaction, user, fieldAttrMap, jobAttrMap, fieldDataMap, jobDataMap) {
        let reqEx = /\{.*?\}|\<.*?\>/g
        let keys = messageBody.match(reqEx)
        if (!keys) return messageBody
        for (let key of keys) {
            let keyForJob = key.slice(1, key.length - 1)
            switch (keyForJob) {
                case BIKER_NAME:
                    let bikerName = user.value.firstName + ' ' + user.value.lastName
                    messageBody = bikerName ? messageBody.replace(key, bikerName) : messageBody
                    break
                case BIKER_MOBILE:
                    let bikerNumber = user.value.mobileNumber
                    messageBody = (bikerNumber) ? messageBody.replace(key, bikerNumber) : messageBody
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
                    messageBody = (jobEta && jobEta.length > 0) ? messageBody.replace(key, moment(jobEta).format('DD MMM HH:mm')) : messageBody.replace(key, 'N.A.')
                    break
                case TRANSACTION_COMPLETED_DATE:
                    let lastTransactionTimeOnMobile = jobTransaction.lastTransactionTimeOnMobile
                    messageBody = (lastTransactionTimeOnMobile && lastTransactionTimeOnMobile.length > 0) ? messageBody.replace(key, moment(lastTransactionTimeOnMobile).format('DD MMM')) : messageBody.replace(key, '')
                    break
                default:
                let valueFound = false
                let jobAttributeWithSameKey = (jobAttrMap) ? jobAttrMap[keyForJob] : null
                let fieldAttributesWithSameKey = (fieldAttrMap) ? fieldAttrMap[keyForJob] : null
                if(jobDataMap && jobAttributeWithSameKey && jobDataMap[jobAttributeWithSameKey.id] && jobDataMap[jobAttributeWithSameKey.id].value){
                    messageBody = messageBody.replace(key, jobDataMap[jobAttributeWithSameKey.id].value)
                    valueFound = true
                }
                if(fieldDataMap && fieldAttributesWithSameKey && fieldDataMap[fieldAttributesWithSameKey.id] && fieldDataMap[fieldAttributesWithSameKey.id].value){
                    messageBody = messageBody.replace(key, fieldDataMap[fieldAttributesWithSameKey.id].value)
                    valueFound = true
                }
                if (!valueFound) {
                    messageBody = messageBody.replace(key, 'N.A.')
                }
                break;
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
    * @param {*} jobDataMap
    * @param {*} fieldDataMap
    * @param {*} jobTransaction
    * @param {*} fieldAttrMap
    * @param {*} jobAttrMap
    * @param {*} user
    * @returns
    * messageBody: string
    */
    checkForRecursiveData(messageBody, previousMessage, jobDataMap, fieldDataMap, jobTransaction, fieldAttrMap, jobAttrMap, user) {
        let reqEx = /\{.*?\}|\<.*?\>/g
        let keys = messageBody.match(reqEx)
        if (!keys || keys.length == 0)
            return messageBody
        if (previousMessage != messageBody) {
            previousMessage = messageBody
            messageBody = this.setSmsBodyFixedAttribute( messageBody, jobTransaction, user, fieldAttrMap, jobAttrMap, fieldDataMap, jobDataMap)
            messageBody = this.checkForRecursiveData(messageBody, previousMessage, jobDataMap, fieldDataMap, jobTransaction, fieldAttrMap, jobAttrMap, user)
        }
        else {
            messageBody = this.setSmsBodyFixedAttribute(messageBody, jobTransaction, user, fieldAttrMap, jobAttrMap, fieldDataMap, jobDataMap)
        }
        return messageBody
    }

   async sendFieldMessage(contact, smsTemplate, jobTransaction, user, fieldDataMap, jobDataMap) {
        if (smsTemplate.body && smsTemplate.body.trim() != '') {
            let {keyToJobAttributeMap, keyToFieldAttributeMap} = await this.getJobFieldAttributeForJobmaster()
            let messageBody = this.setSmsBodyFixedAttribute(smsTemplate.body, jobTransaction, user, keyToFieldAttributeMap[jobTransaction.jobMasterId], keyToJobAttributeMap[jobTransaction.jobMasterId], fieldDataMap, jobDataMap)
            if (messageBody && messageBody.length > 0 && contact && contact.length > 0) {
                Communications.text(contact, messageBody)
            }
        }
    }

    async getJobFieldAttributeForJobmaster() {
        let jobAttributesList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE);
        let fieldAttributesList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE);
        let keyToJobAttributeMap = {}, keyToFieldAttributeMap ={}
        if (jobAttributesList && jobAttributesList.value && fieldAttributesList && fieldAttributesList.value) {
            jobAttributesList.value.forEach(jobAttribute => {
                keyToJobAttributeMap[jobAttribute.jobMasterId] = (keyToJobAttributeMap[jobAttribute.jobMasterId]) ? keyToJobAttributeMap[jobAttribute.jobMasterId] : {}
                keyToJobAttributeMap[jobAttribute.jobMasterId][jobAttribute.key] = jobAttribute
            })
            fieldAttributesList.value.forEach(fieldAttribute => {
                keyToFieldAttributeMap[fieldAttribute.jobMasterId] = (keyToFieldAttributeMap[fieldAttribute.jobMasterId]) ? keyToFieldAttributeMap[fieldAttribute.jobMasterId] : {}
                keyToFieldAttributeMap[fieldAttribute.jobMasterId][fieldAttribute.key] = fieldAttribute
            })
        }
        return { keyToJobAttributeMap, keyToFieldAttributeMap }
    }
   
    async setServerSmsMapForPendingStatus(updatedTransactionList) {
        if (_.isEmpty(updatedTransactionList)) {
            return
        }
        let serverSmsMap = await this.prepareServerSmsMap()
        if (_.isEmpty(serverSmsMap)) {
            return
        }
        let user = await keyValueDBService.getValueFromStore(USER);
        let serverSmsLogs = []
        let transactionListMappedWithSms = updatedTransactionList.filter(jobTransaction => serverSmsMap[jobTransaction.jobStatusId])
        if (_.isEmpty(transactionListMappedWithSms)) {
            return
        }
        let {keyToJobAttributeMap} = await this.getJobFieldAttributeForJobmaster()
        let jobIdToJobDataMap = jobDataService.getJobData(transactionListMappedWithSms)
        for (let transaction of transactionListMappedWithSms) {
            let serverSmsLog = await this.setSmsBody(null, transaction, null, keyToJobAttributeMap[transaction.jobMasterId], user, serverSmsMap[transaction.jobStatusId], jobIdToJobDataMap[transaction.jobId])
            serverSmsLogs = serverSmsLogs.concat(serverSmsLog)
        }
        if (serverSmsLogs && serverSmsLogs.length > 0) {
            let serverSmsLogList = this.saveServerSmsLog(serverSmsLogs)
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

