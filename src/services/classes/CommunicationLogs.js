import {
    TABLE_JOB_DATA,
    TABLE_FIELD_DATA,
    TABLE_JOB_TRANSACTION,
    CUSTOMER_CARE,
    LAST_CALL_AND_SMS_TIME,
    LONG_CODE_SIM_VERIFICATION,
    TABLE_NEGATIVE_COMMUNICATION_LOG
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
import {
    jobDataService
} from './JobData'
class CommunicationLogs {


    async getCallLogs(syncStoreDTO, userSummary) {
        let lastCallTime, lastSmsTime
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
            return { communicationLogs: [], lastCallTime: null, lastSmsTime: null }
        }
        if (_.size(callLogsArray) > 0) {
            lastCallTime = callLogsArray[0].callDate
        }
        if (_.size(smsLogsArray) > 0) {
            lastSmsTime = smsLogsArray[0].callDate
        }
        let { jobDataQuery, fieldDataQuery } = this.getJobAndFieldDataQuery(syncStoreDTO.jobAttributesList, syncStoreDTO.fieldAttributesList)
        let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery)
        let fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, fieldDataQuery)
        let customerCareList = await keyValueDBService.getValueFromStore(CUSTOMER_CARE)
        let longCodeVerification = await keyValueDBService.getValueFromStore(LONG_CODE_SIM_VERIFICATION)
        let jobMasterIdToJobMasterMap = _.mapKeys(syncStoreDTO.jobMasterList, 'id')
        let statusIdToStatusMap = _.mapKeys(syncStoreDTO.statusList, 'id')
        let { communicationLogs, negativeCommunicationLogs, previousNegativeCommunicationLogsTransactionIds } = await this.setCommunicationLogsDto(callLogsArray, smsLogsArray, jobDataList, fieldDataList, syncStoreDTO, customerCareList, jobMasterIdToJobMasterMap, statusIdToStatusMap, userSummary, longCodeVerification)
        return { communicationLogs, lastCallTime, lastSmsTime, negativeCommunicationLogs, previousNegativeCommunicationLogsTransactionIds }
    }

    getJobAndFieldDataQuery(jobAttributesList, fieldAttributesList) {
        let jobAttributesWithContactType = jobAttributesList.filter(jobAttribute => jobAttribute.attributeTypeId == CONTACT_NUMBER)
        let jobDataQuery = jobAttributesWithContactType.map(jobAttribute => 'jobAttributeMasterId = ' + jobAttribute.id).join(' OR ')
        let fieldAttributesWithContactType = fieldAttributesList.filter(fieldAttribute => fieldAttribute.attributeTypeId == CONTACT_NUMBER)
        let fieldDataQuery = fieldAttributesWithContactType.map(fieldAttribute => 'fieldAttributeMasterId = ' + fieldAttribute.id).join(' OR ')
        return { jobDataQuery, fieldDataQuery }
    }


    async setCommunicationLogsDto(callLogsArray, smsLogsArray, jobDataList, fieldDataList, syncStoreDTO, customerCareList, jobMasterIdToJobMasterMap, statusIdToStatusMap, userSummary, longCodeVerification) {
        let communicationLogs = [], contactToCallLogMap = {}, jobIdToContactMap = {}, jobTransactionToContactMap = {}, negativeCommunicationLogs = [], previousNegativeCommunicationLogsTransactionIds = []
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
                this.incrementCountInUserSummary(communicationLog.transactionType, 'OFFICIAL', communicationLog.duration, userSummary)
            } else {
                let isNumberCUG = await this.checkNumberIfCUG(callLog, customerCareList, longCodeVerification)
                if (isNumberCUG) {
                    communicationLog.communicationType = (communicationLog.duration) ? CALL_CUG : SMS_OFFICIAL
                    this.incrementCountInUserSummary(communicationLog.transactionType, 'CUG', communicationLog.duration, userSummary)
                } else {
                    communicationLog.communicationType = (communicationLog.duration) ? CALL_PERSONAL : SMS_PERSONAL
                    this.incrementCountInUserSummary(communicationLog.transactionType, 'PERSONAL', communicationLog.duration, userSummary)
                }
                communicationLogs.push(communicationLog)
            }
        }

        let previousNegativeCommunicationLogs = this.getPreviousNegativeCommunicationLogs(previousNegativeCommunicationLogsTransactionIds)
        if (previousNegativeCommunicationLogs.length > 0) {
            communicationLogs = communicationLogs.concat(previousNegativeCommunicationLogs)
        }

        if (_.isEmpty(jobIdToContactMap) && _.isEmpty(jobTransactionToContactMap)) {
            return { communicationLogs, negativeCommunicationLogs, previousNegativeCommunicationLogsTransactionIds }
        }

        let jobTransactionArray = this.getJobTransactionFromDb(jobIdToContactMap, jobTransactionToContactMap)
        for (let index in jobTransactionArray) {
            let jobTransaction = { ...jobTransactionArray[index] }

            if (jobIdToContactMap[jobTransaction.jobId]) {
                let callLogs = this.getOfficialCommunicationLogs(jobIdToContactMap[jobTransaction.jobId].contactsList, jobTransaction, contactToCallLogMap, jobMasterIdToJobMasterMap, statusIdToStatusMap)
                communicationLogs = communicationLogs.concat(callLogs)
            }

            if (jobTransactionToContactMap[jobTransaction.id]) {
                let callLogs = this.getOfficialCommunicationLogs(jobTransactionToContactMap[jobTransaction.id].contactsList, jobTransaction, contactToCallLogMap, jobMasterIdToJobMasterMap, statusIdToStatusMap)
                if (jobTransaction.id < 0) {
                    negativeCommunicationLogs = negativeCommunicationLogs.concat(callLogs)
                } else {
                    communicationLogs = communicationLogs.concat(callLogs)
                }
            }
        }
        return { communicationLogs, negativeCommunicationLogs, previousNegativeCommunicationLogsTransactionIds }
    }
    getPreviousNegativeCommunicationLogs(previousNegativeCommunicationLogsTransactionIds) {
        let previousNegativeCommunicationLogs = []
        let query = 'jobTransactionId > 0'
        let negativeCommunicationLogsFromDb = realm.getRecordListOnQuery(TABLE_NEGATIVE_COMMUNICATION_LOG, query)
        for (let index in negativeCommunicationLogsFromDb) {
            let negativeCommunicationLog = { ...negativeCommunicationLogsFromDb[index] }
            negativeCommunicationLog = _.omit(negativeCommunicationLog, ['uniqueId'])
            previousNegativeCommunicationLogs.push(negativeCommunicationLog)
            previousNegativeCommunicationLogsTransactionIds.push(negativeCommunicationLog.jobTransactionId)
        }
        return previousNegativeCommunicationLogs
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
            // jobOrJobTransactionMap[id].callCount += 1
            // jobOrJobTransactionMap[id].callDuration += parseInt(callLog.callDuration)
        } else {
            jobOrJobTransactionMap[id] = {}
            jobOrJobTransactionMap[id].contactsList = {}
            jobOrJobTransactionMap[id].contactsList[callLog.phoneNumber] = callLog.phoneNumber
            // jobOrJobTransactionMap[id].callCount = 1
            // jobOrJobTransactionMap[id].callDuration = parseInt(callLog.callDuration)
        }
    }

    async checkNumberIfCUG(callLog, customerCareList, longCodeConfiguration) {
        if (!callLog || !customerCareList || !customerCareList.value) {
            return
        }
        if (!callLog.duration && longCodeConfiguration && longCodeConfiguration.value && longCodeConfiguration.value.longCodeNumber) {
            customerCareList.value.push({ mobileNumber: longCodeConfiguration.value.longCodeNumber })
        }

        for (let customerCareNumber of customerCareList.value) {
            let isNumberSame = await calls.compareNumbers(callLog.phoneNumber, customerCareNumber.mobileNumber)
            if (isNumberSame) {
                return true
            }
        }
    }

    async updateLastCallSmsTimeAndNegativeCommunicationLogsDb(lastCallTime, lastSmsTime, negativeCommunicationLogs, previousNegativeCommunicationLogsTransactionIds) {
        if (!lastCallTime && !lastSmsTime) {
            return
        }
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
        if (!negativeCommunicationLogs || !previousNegativeCommunicationLogsTransactionIds) {
            return
        }
        if (negativeCommunicationLogs.length > 0) {
            let lastUniqueId = realm.getRecordListOnQuery(TABLE_NEGATIVE_COMMUNICATION_LOG).length
            for (let negativeCommunicationLog of negativeCommunicationLogs) {
                negativeCommunicationLog.uniqueId = ++lastUniqueId
            }
            realm.saveList(TABLE_NEGATIVE_COMMUNICATION_LOG, negativeCommunicationLogs)
        }
        if (previousNegativeCommunicationLogsTransactionIds.length > 0) {
            realm.deleteRecordList(TABLE_NEGATIVE_COMMUNICATION_LOG, previousNegativeCommunicationLogsTransactionIds, 'jobTransactionId')
        }
    }

    getJobTransactionFromDb(jobIdToContactMap, jobTransactionToContactMap) {
        let jobIdsList = _.keys(jobIdToContactMap)
        let jobTransactionIdsList = _.keys(jobTransactionToContactMap)
        let transactionQuery = jobIdsList.map(job => 'jobId = ' + job).join(' OR ')
        if (jobTransactionIdsList.length > 0) {
            if (transactionQuery != '') {
                transactionQuery += ' OR '
            }
            transactionQuery += jobTransactionIdsList.map(jobTransaction => 'id = ' + jobTransaction).join(' OR ')
        }
        let jobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, transactionQuery)
        return jobTransactionList
    }

    async getCallLogsAndJobDataList(jobTransactionList, jobAndFieldAttributesList, jobMasterId) {
        let jobQuery = '', todayDate = moment().format('YYYY-MM-DD') + ' 00:00:00', jobAttributesQuery = ''
        let todayDateInMilliSecond = moment(todayDate).format('x')
        let callLogsFromPhone = await calls.getCallLogs(todayDateInMilliSecond, null)
        let smsLogsFromPhone = await calls.getSmsLogs(todayDateInMilliSecond, null)
        let callLogsArray = JSON.parse(callLogsFromPhone);
        let smsLogsArray = JSON.parse(smsLogsFromPhone);
        if (_.isEmpty(callLogsArray) && _.isEmpty(smsLogsArray)) {
            return {}
        }
        if (jobTransactionList.length) {
            jobQuery += jobTransactionList.map(jobTransaction => 'jobId = ' + jobTransaction.jobId).join(' OR ')
        } else {
            jobQuery += 'jobId = ' + jobTransactionList.jobId
        }
        let { jobDataQuery, fieldDataQuery } = this.getJobAndFieldDataQuery(jobAndFieldAttributesList.jobAttributes, jobAndFieldAttributesList.fieldAttributes)
        if (jobDataQuery == '') {
            return {}
        }
        let finalJobDataQuery = `(${jobQuery}) AND (${jobDataQuery})`
        let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, finalJobDataQuery)
        let callAndSmsLogs = callLogsArray.concat(smsLogsArray)
        return { callAndSmsLogs, jobDataList }
    }

    async getTrackCallCount(callAndSmsLogs, jobDataList, fieldDataList, jobIdToJobTransactionMap) {

        let jobTransactionIdToCallCountMap = {}
        if (!callAndSmsLogs) {
            return jobTransactionIdToCallCountMap
        }
        for (let callLog of callAndSmsLogs) {
            let tempMapForJobIdsMatchingWithLogs = {}
            for (let fieldData of fieldDataList) {
                let isNumberSame = await calls.compareNumbers(callLog.phoneNumber, fieldData.value)
                if (isNumberSame) {
                    for (let index in jobIdToJobTransactionMap) {
                        tempMapForJobIdsMatchingWithLogs[index] = index
                        this.setCallCountInMap(jobTransactionIdToCallCountMap, jobIdToJobTransactionMap[index].id, callLog)
                    }
                    break
                }
            }
            for (let jobData of jobDataList) {
                let isNumberSame = await calls.compareNumbers(callLog.phoneNumber, jobData.value)
                if (isNumberSame && !tempMapForJobIdsMatchingWithLogs[jobData.jobId]) {
                    tempMapForJobIdsMatchingWithLogs[jobData.jobId] = jobData.jobId
                    this.setCallCountInMap(jobTransactionIdToCallCountMap, jobIdToJobTransactionMap[jobData.jobId].id, callLog)
                }
            }
        }
        return jobTransactionIdToCallCountMap
    }

    setCallCountInMap(idMap, id, callLog) {
        if (!idMap[id]) {
            idMap[id] = {}
        }
        if (callLog.callDuration) {
            idMap[id].callCount = (idMap[id].callCount) ? idMap[id].callCount + 1 : 1
            idMap[id].callDuration = (idMap[id].callDuration) ? idMap[id].callDuration + parseInt(callLog.callDuration) : parseInt(callLog.callDuration)
        }
        if (callLog.smsBody) {
            idMap[id].smsCount = (idMap[id].smsCount) ? idMap[id].smsCount + 1 : 1
        }
    }
    incrementCountInUserSummary(transactionType, communicationType, duration, userSummary) {
        if (duration) { //CALL CASES
            switch (communicationType) {
                case 'CUG': {
                    if (transactionType == 'INCOMING') {
                        userSummary.cugCallIncomingCount += 1
                        userSummary.cugCallIncomingDuration += parseInt(duration)
                    } else if (transactionType == 'OUTGOING') {
                        userSummary.cugCallOutgoingCount += 1
                        userSummary.cugCallOutgoingDuration += parseInt(duration)
                    }
                    break;
                }
                case 'OFFICIAL': {
                    if (transactionType == 'INCOMING') {
                        userSummary.officialCallIncomingCount += 1
                        userSummary.officialCallIncomingDuration += parseInt(duration)
                    } else if (transactionType == 'OUTGOING') {
                        userSummary.officialCallOutgoingCount += 1
                        userSummary.officialCallOutgoingDuration += parseInt(duration)
                    }
                    break;
                }
                case 'PERSONAL': {
                    if (transactionType == 'INCOMING') {
                        userSummary.personalCallIncomingCount += 1
                        userSummary.personalCallIncomingDuration += parseInt(duration)
                    } else if (transactionType == 'OUTGOING') {
                        userSummary.personalCallOutgoingCount += 1
                        userSummary.personalCallOutgoingDuration += parseInt(duration)
                    }
                    break;
                }
            }
        } else {  //SMS CASES
            switch (communicationType) {
                case 'CUG':
                case 'OFFICIAL':
                    userSummary.officialSmsSentCount += 1
                    break
                case 'PERSONAL':
                    userSummary.personalSmsSentCount += 1
                    break
            }
        }
    }

    updateNegativeCommunicationLogs(negativeJobTransactions) {
        if (!negativeJobTransactions || negativeJobTransactions.length == 0) {
            return
        }
        let negativeJobTransactionIdToJobTransactionMap = _.mapKeys(negativeJobTransactions, 'negativeJobTransactionId')
        let updateCommunicationLogs = []
        let negativeCallLogsQuery = negativeJobTransactions.map(negativeJobTransaction => 'jobTransactionId = ' + negativeJobTransaction.negativeJobTransactionId).join(' OR ')
        let negativeCommunicationLogs = realm.getRecordListOnQuery(TABLE_NEGATIVE_COMMUNICATION_LOG, negativeCallLogsQuery)
        if (!negativeCommunicationLogs || negativeCommunicationLogs.length == 0) {
            return
        }
        //if (negativeCommunicationLogs.length > 0) {
        for (let index in negativeCommunicationLogs) {
            let negativeCommunicationLog = { ...negativeCommunicationLogs[index] }
            let communicationLog = JSON.parse(JSON.stringify(negativeCommunicationLog))
            communicationLog.jobTransactionId = negativeJobTransactionIdToJobTransactionMap[negativeCommunicationLog.jobTransactionId].id
            communicationLog.referenceNumber = negativeJobTransactionIdToJobTransactionMap[negativeCommunicationLog.jobTransactionId].referenceNumber
            communicationLog.runsheetNumber = negativeJobTransactionIdToJobTransactionMap[negativeCommunicationLog.jobTransactionId].runsheetNo
            updateCommunicationLogs.push(communicationLog)
        }
        realm.saveList(TABLE_NEGATIVE_COMMUNICATION_LOG, updateCommunicationLogs)
        //}
    }
}

export let communicationLogsService = new CommunicationLogs()
