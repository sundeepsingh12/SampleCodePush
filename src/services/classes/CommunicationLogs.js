import {
    TABLE_JOB_DATA,
    TABLE_FIELD_DATA,
    TABLE_JOB_TRANSACTION,
    CUSTOMER_CARE,
    LAST_CALL_AND_SMS_TIME
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


    async getCallLogs(syncStoreDTO) {
        let lastSyncWithServerInMillis = moment(syncStoreDTO.lastSyncWithServer).format('x')
        let lastCallSmsTime = await keyValueDBService.getValueFromStore(LAST_CALL_AND_SMS_TIME)
        let lastCallTimeFromStore, lastSmsTimeFromStore
        if (lastCallSmsTime && lastCallSmsTime.value && lastCallSmsTime.value.lastCallTime) {
            lastCallTimeFromStore = lastCallSmsTime.value.lastCallTime
        }
        if (lastCallSmsTime && lastCallSmsTime.value && lastCallSmsTime.value.lastSmsTime) {
            lastSmsTimeFromStore = lastCallSmsTime.value.lastSmsTime
        }
        let callLogsFromPhone = await calls.getCallLogs(lastSyncWithServerInMillis, lastCallTimeFromStore)
        let smsLogsFromPhone = await calls.getSmsLogs(lastSyncWithServerInMillis, lastSmsTimeFromStore)
        let callLogsArray = JSON.parse(callLogsFromPhone);
        let smsLogsArray = JSON.parse(smsLogsFromPhone);
        if (_.isEmpty(callLogsArray) && _.isEmpty(smsLogsArray)) {
            return { communicationLogs: [] }
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
        let fieldDataQuery = 'attributeTypeId = ' + CONTACT_NUMBER
        let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery)
        let fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, fieldDataQuery)
        let customerCareList = await keyValueDBService.getValueFromStore(CUSTOMER_CARE)
        let callLogs = await this.setCommunicationLogsDto(callLogsArray, jobDataList, fieldDataList, syncStoreDTO, customerCareList, true)
        let smsLogs = await this.setCommunicationLogsDto(smsLogsArray, jobDataList, fieldDataList, syncStoreDTO, customerCareList)
        let communicationLogs = callLogs.concat(smsLogs)
        return { communicationLogs, lastCallTime, lastSmsTime }
    }

    async setCommunicationLogsDto(callLogsArray, jobDataList, fieldDataList, syncStoreDTO, customerCareList, isCall) {
        let communicationLogs = []
        let jobMasterIdToJobMasterMap = _.mapKeys(syncStoreDTO.jobMasterList, 'id')
        let statusIdToStatusMap = _.mapKeys(syncStoreDTO.statusList, 'id')
        for (let callLog of callLogsArray) {
            let communicationLog = {}
            communicationLog.id = 0
            communicationLog.contact = callLog.phoneNumber
            communicationLog.dateTime = moment(parseInt(callLog.callDate)).format('YYYY-MM-DD HH:mm:ss')
            communicationLog.imeiNumber = syncStoreDTO.imei.imeiNumber
            communicationLog.simNumber = syncStoreDTO.deviceSim.simNumber
            communicationLog.mobileNumber = syncStoreDTO.deviceSim.contactNumber
            if (isCall) {
                communicationLog.duration = callLog.callDuration
            } else {
                communicationLog.smsBody = callLog.smsBody
            }
            communicationLog.userId = syncStoreDTO.user.id
            communicationLog.cityId = syncStoreDTO.user.cityId
            communicationLog.hubId = syncStoreDTO.user.hubId
            communicationLog.companyId = syncStoreDTO.user.company.id
            communicationLog.transactionType = callLog.callType
            let jobTransactionArray = await this.checkNumberInDb(callLog.phoneNumber, jobDataList, fieldDataList)
            if (jobTransactionArray.length > 0) {
                for (let index in jobTransactionArray) {
                    let jobTransaction = { ...jobTransactionArray[index] }
                    let cloneCommunicationLog = JSON.parse(JSON.stringify(communicationLog))
                    cloneCommunicationLog.jobTransactionId = jobTransaction.id
                    cloneCommunicationLog.referenceNumber = jobTransaction.referenceNumber
                    cloneCommunicationLog.runsheetNumber = jobTransaction.runsheetNo
                    cloneCommunicationLog.communicationType = (isCall) ? CALL_OFFICIAL : SMS_OFFICIAL
                    cloneCommunicationLog.jobType = jobMasterIdToJobMasterMap[jobTransaction.jobMasterId].code
                    cloneCommunicationLog.jobStatus = statusIdToStatusMap[jobTransaction.jobStatusId].name
                    communicationLogs.push(cloneCommunicationLog)
                }
            } else {
                let isNumberCUG = await this.checkNumberIfCUG(callLog.phoneNumber, customerCareList)
                if (isNumberCUG) {
                    communicationLog.communicationType = (isCall) ? CALL_CUG : SMS_OFFICIAL
                } else {
                    communicationLog.communicationType = (isCall) ? CALL_PERSONAL : SMS_PERSONAL
                }
                communicationLogs.push(communicationLog)
            }
        }
        return communicationLogs
    }

    async checkNumberInDb(number, jobDataList, fieldDataList) {
        let jobIdsList = [], jobTransactionIdsList = []

        for (let jobData of jobDataList) {
            let isNumberSame = await calls.compareNumbers(number, jobData.value)
            if (isNumberSame) {
                jobIdsList.push(jobData.jobId)
            }
        }

        for (let fieldData of fieldDataList) {
            let isNumberSame = await calls.compareNumbers(number, fieldData.value)
            if (isNumberSame) {
                jobTransactionIdsList.push(fieldData.jobTransactionId)
            }
        }

        if (_.isEmpty(jobIdsList) && _.isEmpty(jobTransactionIdsList)) {
            return []
        } else {
            let transactionQuery = jobIdsList.map(job => 'jobId = ' + job).join(' OR ')
            transactionQuery += jobTransactionIdsList.map(jobTransaction => 'id = ' + jobTransaction).join(' OR ')
            let jobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, transactionQuery)
            return jobTransactionList
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

    async updateLastCallSmsTime(lastCallTime, lastSmsTime) {
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
    }
}

export let communicationLogsService = new CommunicationLogs()
