import {
    TABLE_JOB_DATA,
    TABLE_FIELD_DATA,
    TABLE_JOB_TRANSACTION,
    CUSTOMER_CARE,
    LAST_CALL_AND_SMS_TIME,
    TABLE_JOB
} from '../../lib/constants'
import {
    CONTACT_NUMBER
} from '../../lib/AttributeConstants'
import {
    keyValueDBService
} from './KeyValueDBService'

import moment from 'moment'
import _ from 'lodash'
import * as realm from '../../repositories/realmdb'
import {
    CALL_OFFICIAL,
    CALL_CUG,
    CALL_PERSONAL,
    SMS_OFFICIAL,
    SMS_PERSONAL
} from '../../lib/ContainerConstants'
let calls = require('../../wrapper/CALLS')

class CommunicationLogs {


    async getCallLogs(syncStoreDTO, transactionList, jobList) {
        //syncStoreDTO.lastSyncWithServer = '2018-07-01 00:00:00'
        let lastSyncWithServerInMillis = moment(syncStoreDTO.lastSyncWithServer).format('x')
        let lastCallSmsTime = await keyValueDBService.getValueFromStore(LAST_CALL_AND_SMS_TIME)
        let lastCallTimeFromStore, lastSmsTimeFromStore
        if (lastCallSmsTime && lastCallSmsTime.value && lastCallSmsTime.value.lastCallTime) {
            lastCallTimeFromStore = lastCallSmsTime.value.lastCallTime
        }
        if (lastCallSmsTime && lastCallSmsTime.value && lastCallSmsTime.value.lastSmsTime) {
            lastSmsTimeFromStore = lastCallSmsTime.value.lastSmsTime
        }
        //lastCallTimeFromStore = lastSyncWithServerInMillis // remove only for testing
        //lastSmsTimeFromStore = lastSyncWithServerInMillis
        let callLogsFromPhone = await calls.getCallLogs(lastSyncWithServerInMillis, lastCallTimeFromStore)
        let smsLogsFromPhone = await calls.getSmsLogs(lastSyncWithServerInMillis, lastSmsTimeFromStore)
        let callLogsArray = JSON.parse(callLogsFromPhone);
        let smsLogsArray = JSON.parse(smsLogsFromPhone);
        if (_.isEmpty(callLogsArray) && _.isEmpty(smsLogsArray)) {
            return { communicationLogs: [], lastCallTime: null, lastSmsTime: null, transactionsToUpdate: transactionList, jobsToUpdate: jobList }
        }
        let lastCallTime, lastSmsTime
        if (_.size(callLogsArray) > 0) {
            lastCallTime = callLogsArray[0].callDate
        }
        if (_.size(smsLogsArray) > 0) {
            lastSmsTime = smsLogsArray[0].callDate
        }
        let jobAttributesWithContactType = syncStoreDTO.jobAttributesList.filter(jobAttribute => jobAttribute.attributeTypeId == CONTACT_NUMBER)
        let jobDataQuery = jobAttributesWithContactType.map(jobAttribute => 'jobAttributeMasterId = ' + jobAttribute.id).join(' OR ')
        let fieldAttributesWithContactType = syncStoreDTO.fieldAttributesList.filter(fieldAttribute => fieldAttribute.attributeTypeId == CONTACT_NUMBER)
        let fieldDataQuery = fieldAttributesWithContactType.map(fieldAttribute => 'fieldAttributeMasterId = ' + fieldAttribute.id).join(' OR ')
        let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery)
        let fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, fieldDataQuery)
        let customerCareList = await keyValueDBService.getValueFromStore(CUSTOMER_CARE)
        let jobMasterIdToJobMasterMap = _.mapKeys(syncStoreDTO.jobMasterList, 'id')
        let statusIdToStatusMap = _.mapKeys(syncStoreDTO.statusList, 'id')
        let { communicationLogs, transactionsToUpdate, jobsToUpdate } = await this.setCommunicationLogsDto(callLogsArray, smsLogsArray, jobDataList, fieldDataList, syncStoreDTO, customerCareList, jobMasterIdToJobMasterMap, statusIdToStatusMap, transactionList, jobList)
        return { communicationLogs, lastCallTime, lastSmsTime, transactionsToUpdate, jobsToUpdate }
    }

    async setCommunicationLogsDto(callLogsArray, smsLogsArray, jobDataList, fieldDataList, syncStoreDTO, customerCareList, jobMasterIdToJobMasterMap, statusIdToStatusMap, transactionList, jobList) {
        let communicationLogs = [], contactToCallLogMap = {}, jobIdToContactMap = {}, jobTransactionToContactMap = {}
        let callAndSmsLogs = callLogsArray.concat(smsLogsArray);

        for (let callLog of callAndSmsLogs) {
            let communicationLog = {}
            this.setCommunicationLogDefaultValues(communicationLog, syncStoreDTO, callLog)
            let isNumberOfficial = await this.checkNumberInDb(callLog, jobDataList, fieldDataList, jobIdToContactMap, jobTransactionToContactMap, communicationLog)
            if (isNumberOfficial) {
                if (contactToCallLogMap[callLog.phoneNumber]) {
                    contactToCallLogMap[callLog.phoneNumber] = contactToCallLogMap[callLog.phoneNumber].concat(communicationLog)
                } else {
                    contactToCallLogMap[callLog.phoneNumber] = [communicationLog]
                }
            } else {
                let isNumberCUG = await this.checkNumberIfCUG(callLog.phoneNumber, customerCareList)
                if (isNumberCUG) {
                    communicationLog.communicationType = (communicationLog.duration) ? CALL_CUG : SMS_OFFICIAL
                } else {
                    communicationLog.communicationType = (communicationLog.duration) ? CALL_PERSONAL : SMS_PERSONAL
                }
                communicationLogs.push(communicationLog)
            }
        }

        if (_.isEmpty(jobIdToContactMap) && _.isEmpty(jobTransactionToContactMap)) {
            return { communicationLogs, transactionsToUpdate: transactionList }
        }

        let pendingJobTransactionsMap = _.mapKeys(transactionList, 'id')
        let pendingJobIdsMap = _.mapKeys(jobList, 'id'), jobQuery = ''
        let jobTransactionArray = this.getJobTransactionFromDb(jobIdToContactMap, jobTransactionToContactMap)
        for (let index in jobTransactionArray) {
            let id = jobTransactionArray[index].id;
            let jobTransaction = {}
            if (pendingJobTransactionsMap[id]) {
                jobTransaction = pendingJobTransactionsMap[id]
            } else {
                jobTransaction = { ...jobTransactionArray[index] }
            }
            if (jobIdToContactMap[jobTransaction.jobId]) {
                let callLogs = this.getOfficialCommunicationLogs(jobIdToContactMap[jobTransaction.jobId].contactsList, jobTransaction, contactToCallLogMap, jobMasterIdToJobMasterMap, statusIdToStatusMap)
                communicationLogs = communicationLogs.concat(callLogs)
                jobTransaction.trackCallCount += jobIdToContactMap[jobTransaction.jobId].callCount
                jobTransaction.trackCallDuration += jobIdToContactMap[jobTransaction.jobId].callDuration
            }

            if (jobTransactionToContactMap[jobTransaction.id]) {
                let callLogs = this.getOfficialCommunicationLogs(jobTransactionToContactMap[jobTransaction.id].contactsList, jobTransaction, contactToCallLogMap, jobMasterIdToJobMasterMap, statusIdToStatusMap)
                communicationLogs = communicationLogs.concat(callLogs)
                jobTransaction.trackCallCount += jobTransactionToContactMap[jobTransaction.id].callCount
                jobTransaction.trackCallDuration += jobTransactionToContactMap[jobTransaction.id].callDuration
            }
            pendingJobTransactionsMap[id] = jobTransaction
            if (!pendingJobIdsMap[jobTransaction.jobId]) {
                if (jobQuery == '') {
                    jobQuery += 'id = ' + jobTransaction.jobId
                } else {
                    jobQuery += ' OR ' + 'id = ' + jobTransaction.jobId
                }
            }
        }
        let jobListFromDb
        if (jobQuery != '') {
            jobListFromDb = realm.getRecordListOnQuery(TABLE_JOB, jobQuery)
        }
        for (let index in jobListFromDb) {
            let job = { ...jobListFromDb[index] }
            pendingJobIdsMap[job.id] = job
        }

        let transactionsToUpdate = _.values(pendingJobTransactionsMap)
        let jobsToUpdate = _.values(pendingJobIdsMap)
        return { communicationLogs, transactionsToUpdate, jobsToUpdate }
    }

    setCommunicationLogDefaultValues(communicationLog, syncStoreDTO, callLog) {
        communicationLog.id = 0
        communicationLog.contact = callLog.phoneNumber
        communicationLog.dateTime = moment(parseInt(callLog.callDate)).format('YYYY-MM-DD HH:mm:ss')
        communicationLog.imeiNumber = syncStoreDTO.imei.imeiNumber
        communicationLog.simNumber = syncStoreDTO.deviceSim.simNumber
        communicationLog.mobileNumber = syncStoreDTO.deviceSim.contactNumber
        communicationLog.duration = callLog.callDuration
        communicationLog.smsBody = callLog.smsBody
        communicationLog.userId = syncStoreDTO.user.id
        communicationLog.cityId = syncStoreDTO.user.cityId
        communicationLog.hubId = syncStoreDTO.user.hubId
        communicationLog.companyId = syncStoreDTO.user.company.id
        communicationLog.transactionType = callLog.callType
    }

    getOfficialCommunicationLogs(contactsList, jobTransaction, contactToCallLogMap, jobMasterIdToJobMasterMap, statusIdToStatusMap) {
        let contactNumbersList = _.keys(contactsList), communicationLogs = []
        for (let contact of contactNumbersList) {
            if (contactToCallLogMap[contact]) {
                for (let communicationLog of contactToCallLogMap[contact]) {
                    let cloneCommunicationLog = JSON.parse(JSON.stringify(communicationLog))
                    cloneCommunicationLog.jobTransactionId = jobTransaction.id
                    cloneCommunicationLog.referenceNumber = jobTransaction.referenceNumber
                    cloneCommunicationLog.runsheetNumber = jobTransaction.runsheetNo
                    cloneCommunicationLog.communicationType = (cloneCommunicationLog.duration) ? CALL_OFFICIAL : SMS_OFFICIAL
                    cloneCommunicationLog.jobType = jobMasterIdToJobMasterMap[jobTransaction.jobMasterId].code
                    cloneCommunicationLog.jobStatus = statusIdToStatusMap[jobTransaction.jobStatusId].name
                    communicationLogs.push(cloneCommunicationLog)
                }
            }
        }
        return communicationLogs
    }

    async checkNumberInDb(callLog, jobDataList, fieldDataList, jobIdToContactMap, jobTransactionToContactMap, communicationLog) {
        let isNumberOfficial
        for (let jobData of jobDataList) {
            let isNumberSame = await calls.compareNumbers(callLog.phoneNumber, jobData.value)
            if (isNumberSame) {
                this.setIdToContactMap(jobIdToContactMap, jobData.jobId, callLog)
                isNumberOfficial = true
            }
        }

        for (let fieldData of fieldDataList) {
            let isNumberSame = await calls.compareNumbers(callLog.phoneNumber, fieldData.value)
            if (isNumberSame) {
                this.setIdToContactMap(jobTransactionToContactMap, fieldData.jobTransactionId, callLog)
                isNumberOfficial = true
            }
        }
        return isNumberOfficial
    }

    setIdToContactMap(jobOrJobTransactionMap, id, callLog) {
        if (jobOrJobTransactionMap[id]) {
            jobOrJobTransactionMap[id].contactsList[callLog.phoneNumber] = callLog.phoneNumber
            jobOrJobTransactionMap[id].callCount += 1
            jobOrJobTransactionMap[id].callDuration += parseInt(callLog.callDuration)
        } else {
            jobOrJobTransactionMap[id] = {}
            jobOrJobTransactionMap[id].contactsList = {}
            jobOrJobTransactionMap[id].contactsList[callLog.phoneNumber] = callLog.phoneNumber
            jobOrJobTransactionMap[id].callCount = 1
            jobOrJobTransactionMap[id].callDuration = parseInt(callLog.callDuration)
        }
    }

    async checkNumberIfCUG(phoneNumber, customerCareList) {
        if (!phoneNumber || !customerCareList || !customerCareList.value) {
            return
        }

        for (let customerCareNumber of customerCareList.value) {
            let isNumberSame = await calls.compareNumbers(phoneNumber, customerCareNumber.mobileNumber)
            if (isNumberSame) {
                return true
            }
        }
    }

    async updateLastCallSmsTimeAndTransactions(lastCallTime, lastSmsTime, transactionsToUpdate) {
        let lastCallSmsTime = await keyValueDBService.getValueFromStore(LAST_CALL_AND_SMS_TIME)
        if (lastCallSmsTime && lastCallSmsTime.value) {
            if (lastCallTime) {
                lastCallSmsTime.value.lastCallTime = lastCallTime
            }
            if (lastSmsTime) {
                lastCallSmsTime.value.lastSmsTime = lastSmsTime
            }
            await keyValueDBService.validateAndSaveData(LAST_CALL_AND_SMS_TIME, lastCallSmsTime.value)
        } else {
            let lastCallSmsTimeObject = {
                lastCallTime,
                lastSmsTime
            }
            await keyValueDBService.validateAndSaveData(LAST_CALL_AND_SMS_TIME, lastCallSmsTimeObject)
        }
        if (_.size(transactionsToUpdate) > 0) {
            realm.saveList(TABLE_JOB_TRANSACTION, transactionsToUpdate)
        }
    }

    getJobTransactionFromDb(jobIdToContactMap, jobTransactionToContactMap) {
        let jobIdsList = _.keys(jobIdToContactMap)
        let jobTransactionIdsList = _.keys(jobTransactionToContactMap)
        let transactionQuery = jobIdsList.map(job => 'jobId = ' + job).join(' OR ')
        if (jobTransactionIdsList.length > 0) {
            transactionQuery += ' OR ' + jobTransactionIdsList.map(jobTransaction => 'id = ' + jobTransaction).join(' OR ')
        }
        let jobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, transactionQuery)
        return jobTransactionList
    }
}

export let communicationLogsService = new CommunicationLogs()
