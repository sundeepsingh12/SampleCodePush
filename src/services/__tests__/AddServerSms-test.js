'use strict'

import {
    keyValueDBService
} from '../classes/KeyValueDBService'
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
import { addServerSmsService } from '../classes/AddServerSms'
import serverSmsLog from '../../repositories/schema/serverSmsLog';
import Communications from 'react-native-communications';
import { jobDataService } from '../classes/JobData'

describe('Add server sms', () => {
    it('should return empty array if no sms status is present', () => {
        let smsJobStatuses = [
            {
                statusId: 1
            }
        ]
        let statusId = 2
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        // addServerSmsService.prepareServerSmsMap = jest.fn()
        addServerSmsService.addServerSms(statusId, 0, [], []).then((result) => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(addServerSmsService.prepareServerSmsMap).toHaveBeenCalledTimes(1)
            expect(addServerSmsService.getJobFieldAttributeForJobmaster).toHaveBeenCalledTimes(1)
            expect(addServerSmsService.setSmsBody).toHaveBeenCalledTimes(1)
            expect(addServerSmsService.saveServerSmsLog).toHaveBeenCalledTimes(1)
            expect(result).toEqual([])
        })

    })
})
// describe('get Job Data', () => {
//     const jobTransaction = {
//         id: 2,
//         jobId: 3,
//         jobMasterId: 3,
//         seqSelected: 12,
//         jobStatusId: 11,
//         referenceNumber: 'refno',
//         userId: 1,
//         companyId: 2,
//         runsheetNo: 'runsheetno',
//         cityId: 8,
//         hubId: 7
//     }
//     it('should return empty list for no job data', () => {
//         realm.getRecordListOnQuery = jest.fn();
//         realm.getRecordListOnQuery.mockReturnValue([]);
//         expect(addServerSmsService.getJobData(jobTransaction)).toEqual([])

//     })
//     it('should jobdata list for given job data', () => {
//         const jobData = [{
//             id: 1
//         },
//         {
//             id: 2
//         }]
//         realm.getRecordListOnQuery = jest.fn();
//         realm.getRecordListOnQuery.mockReturnValue(jobData);
//         expect(addServerSmsService.getJobData(jobTransaction)).toEqual(jobData)
//     })
// })
describe('test for setSmsBody', () => {
    it('should return sms body', () => {
        const statusId = 1
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7
        }
        const jobAttributesList = []
        const fieldAttributesList = []
        const user = { value: {} }
        const smsForStatus = [
            {
                id: 1,
                companyId: 2,
                jobMasterId: 3,
                statusId: 1,
                messageBody: 'hello',
                contactNoJobAttributeId: 9654
            }
        ]
        const serverSmsLog = [{
            cityId: 8,
            hubId: 7,
            companyId: 2,
            jobTransactionId: 2,
            referenceNumber: 'refno',
            runsheetNumber: 'runsheetno',
            smsBody: 'hello',
            dateTime: moment().format('YYYY-MM-DD HH:mm:ss') + '',
            userId: 1
        }]
        const jobData = {
            100: {
                jobId: 3,
                jobAttributeMasterId: 100,
                value: '{key2}'
            }
        }
        const fieldData = {
            value: [{
                jobTransactionId: 2,
                fieldAttributeMasterId: 101,
                value: 'test fielddata value'
            }]
        }
        expect(addServerSmsService.setSmsBody(statusId, null, jobTransaction, jobAttributesList, fieldAttributesList, user, smsForStatus, jobData)).toEqual(serverSmsLog)
    })
    it('should return sms body with key matching job data', () => {
        const statusId = 1
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7
        }
        const jobAttributesList = [
            {
                id: 100,
                key: 'key'
            }
        ]
        const fieldAttributesList = []
        const user = { value: {} }
        const smsForStatus = [
            {
                id: 1,
                companyId: 2,
                jobMasterId: 3,
                statusId: 1,
                messageBody: 'hello {key}',
                contactNoJobAttributeId: 9654
            }
        ]
        const serverSmsLog = [{
            cityId: 8,
            hubId: 7,
            companyId: 2,
            jobTransactionId: 2,
            referenceNumber: 'refno',
            runsheetNumber: 'runsheetno',
            smsBody: 'hello test message',
            dateTime: moment().format('YYYY-MM-DD HH:mm:ss') + '',
            userId: 1
        }]
        const jobData = {
            100: {
                jobId: 3,
                jobAttributeMasterId: 100,
                value: 'test message'
            }
        }
        expect(addServerSmsService.setSmsBody(statusId, null, jobTransaction, jobAttributesList, fieldAttributesList, user, smsForStatus, jobData)).toEqual(serverSmsLog)
    })
    it('should return sms body with key matching job data and field data', () => {
        const statusId = 1
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7
        }
        const jobAttributesList = [
            {
                id: 100,
                key: 'key'
            }
        ]
        const fieldAttributesList = [
            {
                id: 101,
                key: 'key2'
            }
        ]
        const user = { value: {} }
        const smsForStatus = [
            {
                id: 1,
                companyId: 2,
                jobMasterId: 3,
                statusId: 1,
                messageBody: 'hello {key} {key2}',
                contactNoJobAttributeId: 9654
            }
        ]
        const serverSmsLog = [{
            cityId: 8,
            hubId: 7,
            companyId: 2,
            jobTransactionId: 2,
            referenceNumber: 'refno',
            runsheetNumber: 'runsheetno',
            smsBody: 'hello test message test fielddata value',
            dateTime: moment().format('YYYY-MM-DD HH:mm:ss') + '',
            userId: 1
        }]
        const jobData = {
            100: {
                jobId: 3,
                jobAttributeMasterId: 100,
                value: 'test message'
            }
        }
        const fieldData = {
            value: [{
                jobTransactionId: 2,
                fieldAttributeMasterId: 101,
                value: 'test fielddata value'
            }]
        }
        expect(addServerSmsService.setSmsBody(statusId, fieldData, jobTransaction, jobAttributesList, fieldAttributesList, user, smsForStatus, jobData)).toEqual(serverSmsLog)
    })
    it('should return sms body with key matching recursive data', () => {
        const statusId = 1
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7
        }
        const jobAttributesList = [
            {
                id: 100,
                key: 'key'
            }
        ]
        const fieldAttributesList = [
            {
                id: 101,
                key: 'key2'
            }
        ]
        const user = { value: {} }
        const smsForStatus = [
            {
                id: 1,
                companyId: 2,
                jobMasterId: 3,
                statusId: 1,
                messageBody: '{key} <REF_NO>',
                contactNoJobAttributeId: 9654
            }
        ]
        const serverSmsLog = [{
            cityId: 8,
            hubId: 7,
            companyId: 2,
            jobTransactionId: 2,
            referenceNumber: 'refno',
            runsheetNumber: 'runsheetno',
            smsBody: 'test fielddata value refno',
            dateTime: moment().format('YYYY-MM-DD HH:mm:ss') + '',
            userId: 1
        }]
        const jobData = {
            100: {
                jobId: 3,
                jobAttributeMasterId: 100,
                value: '{key2}'
            }
        }
        const fieldData = {
            value: [{
                jobTransactionId: 2,
                fieldAttributeMasterId: 101,
                value: 'test fielddata value'
            }]
        }
        expect(addServerSmsService.setSmsBody(statusId, fieldData, jobTransaction, jobAttributesList, fieldAttributesList, user, smsForStatus, jobData)).toEqual(serverSmsLog)
    })
})
describe('test for getKeyToAttributeMap', () => {
    it('should return sms body with key matching recursive data', () => {
        const jobAttributesList = [
            {
                id: 100,
                key: 'key'
            }
        ]
        const fieldAttributesList = [
            {
                id: 101,
                key: 'key2'
            }
        ]
        const keyToAttributeMap = {
            keyToJobAttributeMap: {
                'key': {
                    id: 100,
                    key: 'key'
                }
            }
            , keyToFieldAttributeMap: {
                'key2': {
                    id: 101,
                    key: 'key2'
                }
            }
        }
        expect(addServerSmsService.getKeyToAttributeMap(jobAttributesList, fieldAttributesList)).toEqual(keyToAttributeMap)
    })
})

describe('test for setSmsBodyJobData', () => {
    it('should return message without change(no keys)', () => {
        let message = 'hello'
        const keyToJobAttributeMap = {
            'key2': {
                id: 101,
                key: 'key2'
            }
        }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        expect(addServerSmsService.setSmsBodyJobData(message, null, null, keyToJobAttributeMap)).toEqual(message)
    })
    it('should return message with value matching key', () => {
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7
        }
        const jobData = {
            100: {
                jobId: 3,
                jobAttributeMasterId: 100,
                value: 'hey'
            }
        }
        let message = 'hello {key2}'
        const keyToJobAttributeMap = {
            'key2': {
                id: 100,
                key: 'key2'
            }
        }
        const returnmessage = 'hello hey'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        expect(addServerSmsService.setSmsBodyJobData(message, jobData, jobTransaction, keyToJobAttributeMap)).toEqual(returnmessage)
    })
    it('should return message with N.A. for null value', () => {
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7
        }
        const jobData = {
            100: {
                jobId: 3,
                jobAttributeMasterId: 100,
                value: null
            }
        }
        let message = 'hello {key2}'
        const keyToJobAttributeMap = {
            'key2': {
                id: 100,
                key: 'key2'
            }
        }
        const returnmessage = 'hello N.A.'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        expect(addServerSmsService.setSmsBodyJobData(message, jobData, jobTransaction, keyToJobAttributeMap)).toEqual(returnmessage)
    })
    it('should return message with value matching key', () => {
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7
        }
        const jobData = [{
            jobId: 3,
            jobAttributeMasterId: 100,
            value: 'hey'
        }
        ]
        let message = 'hello {key2}'
        const keyToJobAttributeMap = {
            'key2': {
                id: 100,
                key: 'key2'
            }
        }
        const returnmessage = 'hello hey'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        expect(addServerSmsService.setSmsBodyJobData(message, null, jobTransaction, keyToJobAttributeMap, jobData)).toEqual(returnmessage)
    })
    it('should return message with N.A. for null value', () => {
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7
        }
        const jobData = [{
            jobId: 3,
            jobAttributeMasterId: 100,
            value: null
        }
        ]
        let message = 'hello {key2}'
        const keyToJobAttributeMap = {
            'key2': {
                id: 100,
                key: 'key2'
            }
        }
        const returnmessage = 'hello N.A.'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        expect(addServerSmsService.setSmsBodyJobData(message, null, jobTransaction, keyToJobAttributeMap, jobData)).toEqual(returnmessage)
    })
})
describe('test for setSMSBodyFieldData', () => {
    it('should return message without change(no keys)', () => {
        let message = 'hello'
        const keyToJobAttributeMap = {
            'key2': {
                id: 101,
                key: 'key2'
            }
        }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        expect(addServerSmsService.setSMSBodyFieldData(message, [], null, keyToJobAttributeMap)).toEqual(message)
    })
    it('should return message with value matching key', () => {
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7
        }
        const fieldData = [{
            jobTransactionId: 2,
            fieldAttributeMasterId: 100,
            value: 'test fielddata value'
        }]
        let message = 'hello {key2}'
        const keyToJobAttributeMap = {
            'key2': {
                id: 100,
                key: 'key2'
            }
        }
        const returnmessage = 'hello test fielddata value'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        expect(addServerSmsService.setSMSBodyFieldData(message, fieldData, jobTransaction, keyToJobAttributeMap)).toEqual(returnmessage)
    })
    it('should return message with N.A. for null value', () => {
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7
        }
        const fieldData = [{
            jobTransactionId: 2,
            fieldAttributeMasterId: 101,
            value: 'test fielddata value'
        }]
        let message = 'hello {key2}'
        const keyToJobAttributeMap = {
            'key2': {
                id: 100,
                key: 'key2'
            }
        }
        const returnmessage = 'hello N.A.'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        expect(addServerSmsService.setSMSBodyFieldData(message, fieldData, jobTransaction, keyToJobAttributeMap)).toEqual(returnmessage)
    })
})

describe('set sms body fixed attributes', () => {
    it('should return message without change(no keys)', () => {
        let message = 'test'
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7
        }
        expect(addServerSmsService.setSmsBodyFixedAttribute(message, jobTransaction, null)).toEqual(message)
    })
    it('should return message with change(no keys)', () => {
        let message = '<BIKER_NAME> <REF_NO> <ATTEMPT_NO> <RUNSHEET_NO> <BIKER_MOBILE> <CREATION_DATE> <TRANSACTION_DATE> <JOB_ETA>'
        const jobTransaction = {
            id: 2,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7,
            attemptCount: 1,
            jobEtaTime: '2018-12-10 12:12:12',
            jobCreatedAt: '2018-12-10 12:12:12',
            lastUpdatedAtServer: '2018-12-10 12:12:12',
        }
        const user = {
            value: {
                firstName: 'shivani',
                lastName: 'monga',
                mobileNumber: 123
            }
        }
        const returnmessage = 'shivani monga refno 1 runsheetno 123 10 Dec 10 Dec 10 Dec'
        expect(addServerSmsService.setSmsBodyFixedAttribute(message, jobTransaction, user)).toEqual(returnmessage)
    })
})

describe('save Server Sms Log', () => {
    it('should return empty list for no sms logs', () => {
        expect(addServerSmsService.saveServerSmsLog([])).toEqual({
            tableName: TABLE_SERVER_SMS_LOG,
            value: []
        })
    })
    it('should return serversmsDTO for given server sms logs', () => {
        let serverSmsLogs = [{
            test: 'test'
        }]
        let serverSmsLog = {
            tableName: TABLE_SERVER_SMS_LOG,
            value: serverSmsLogs
        }
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(0)
        expect(addServerSmsService.saveServerSmsLog(serverSmsLogs)).toEqual(serverSmsLog)
    })
})
describe('check For Recursive Data', () => {
    it('should return message without change(no keys)', () => {
        let message = 'test'
        expect(addServerSmsService.checkForRecursiveData(message, null)).toEqual(message)
    })
})

describe('send field message', () => {
    it('should return message without change(no keys)', () => {
        let message = 'test'
        let smsTemplate = {
            body: message
        }
        const keyToAttributeMap = {
            keyToJobAttributeMap: {
                'key': {
                    id: 100,
                    key: 'key'
                }
            }
            , keyToFieldAttributeMap: {
                'key2': {
                    id: 101,
                    key: 'key2'
                }
            }
        }
        Communications.text = jest.fn()
        addServerSmsService.getKeyToAttributeMap = jest.fn()
        addServerSmsService.getKeyToAttributeMap.mockReturnValue(keyToAttributeMap)
        addServerSmsService.sendFieldMessage(123, smsTemplate, null, [], [], { value: [] }, { value: [] }, { value: [] })
        expect(addServerSmsService.getKeyToAttributeMap).toHaveBeenCalledTimes(1)
    })
})

describe('test for prepareServerSmsMap', () => {
    it('should return empty serverSmsMap', () => {
        let smsJobStatuses = {
            value:
                {
                    statusId: 1
                }
        }
        let statusId = 2
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(smsJobStatuses)
        addServerSmsService.prepareServerSmsMap().then((serverSmsMap) => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(serverSmsMap).toEqual([])
        })

    })
    it('should return serverSmsMap', () => {
        let smsJobStatuses = {
            value:
                [
                    { statusId: 1 },
                    { statusId: 2 },
                ]

        }
        const serverSms = {
            1: [{ statusId: 1 }],
            2: [{ statusId: 2 }]
        }
        let statusId = 2
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(smsJobStatuses)
        return addServerSmsService.prepareServerSmsMap().then((serverSmsMap) => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(serverSmsMap).toEqual(serverSms)
        })

    })
})
describe('test for getJobFieldAttributeForJobmaster', () => {
    it('should return job attributes n field attributes', () => {
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: [{
                jobMasterId: 1,
                employeeCode: 'xyz'
            }]
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: [{
                jobMasterId: 1,
                code: 'abc'
            }]
        })
        const resultObj = {
            jobAttributes: [{
                jobMasterId: 1,
                employeeCode: 'xyz'
            }],
            fieldAttributes: [{
                jobMasterId: 1,
                code: 'abc'
            }]
        }
        return addServerSmsService.getJobFieldAttributeForJobmaster(1)
            .then((result) => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(3)
                expect(result).toEqual(resultObj)
            })
    })
})

describe('test for getServerSmsLogs', () => {
    it('should return empty array', () => {
        const lastSyncTime = { value: '2018-01-01 12:12:12' }
        expect(addServerSmsService.getServerSmsLogs([], lastSyncTime)).toEqual([])
    })
    it('should return all sms logs', () => {
        const lastSyncTime = { value: '2018-01-01 12:12:12' }
        const serverSmsLogs = [{
            dateTime: '2018-01-01 13:12:12'
        }]
        expect(addServerSmsService.getServerSmsLogs(serverSmsLogs, lastSyncTime)).toEqual(serverSmsLogs)
    })
    it('should return all sms logs with datetime after last sync time', () => {
        const lastSyncTime = { value: '2018-01-01 12:12:12' }
        const serverSmsLogs = [{
            dateTime: '2018-01-01 13:12:12'
        },
        {
            dateTime: '2017-01-01 13:12:12'
        }
        ]
        const serverSmsLogsToBySynced = [{

            dateTime: '2018-01-01 13:12:12'

        }]
        expect(addServerSmsService.getServerSmsLogs(serverSmsLogs, lastSyncTime)).toEqual(serverSmsLogsToBySynced)
    })

})

describe('test for setServerSmsMapForPendingStatus', () => {
    it('should return undefined for empty transactionIdDtosMap', () => {
        return addServerSmsService.setServerSmsMapForPendingStatus({})
            .then((result) => {
                expect(result).toEqual(undefined)
            })
    })
    it('should return undefined for empty server sms map', () => {
        const transactionIdDtosMap = {
            930: {
                4814: {
                    jobMasterId: 930,
                    pendingStatusId: 4813,
                    transactionId: '2521299:123456',
                    unSeenStatusId: 4814,
                }
            }
        }

        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                employeeCode: 'xyz'
            }
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                code: 'abc'
            }
        })
        addServerSmsService.prepareServerSmsMap = jest.fn()
        addServerSmsService.prepareServerSmsMap.mockReturnValue({})
        return addServerSmsService.setServerSmsMapForPendingStatus(transactionIdDtosMap)
            .then((result) => {
                expect(addServerSmsService.prepareServerSmsMap).toHaveBeenCalledTimes(1)
                expect(result).toEqual(undefined)
            })
    })

    it('should save sms map', () => {
        const transactionIdDtosMap = {
            930: {
                4814: {
                    jobMasterId: 930,
                    pendingStatusId: 4813,
                    transactionId: '2521299',
                    unSeenStatusId: 4814,
                }
            }
        }

        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: [{
                employeeCode: 'xyz'
            }]
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                code: 'abc'
            }
        })
        const serverSmsMap = {
            4813: [{
                statusId: 4813,
                messageBody: 'hello',
                contactNoJobAttributeId: 100
            }]
        }
        const jobAndFieldAttributes = {
            jobAttributes: {},
            fieldAttributes: {}
        }
        const jobTransactionList = [{
            id: 2521299,
            jobId: 3,
            jobMasterId: 3,
            seqSelected: 12,
            jobStatusId: 11,
            referenceNumber: 'refno',
            userId: 1,
            companyId: 2,
            runsheetNo: 'runsheetno',
            cityId: 8,
            hubId: 7,
            attemptCount: 1,
            jobEtaTime: '2018-12-10 12:12:12',
            jobCreatedAt: '2018-12-10 12:12:12',
            lastUpdatedAtServer: '2018-12-10 12:12:12',
        }]
        const jobDataMap = {
            3: {

            }
        }
        addServerSmsService.prepareServerSmsMap = jest.fn()
        addServerSmsService.prepareServerSmsMap.mockReturnValue(serverSmsMap)
        addServerSmsService.getJobFieldAttributeForJobmaster = jest.fn()
        addServerSmsService.getJobFieldAttributeForJobmaster.mockReturnValue(jobAndFieldAttributes)
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValueOnce(jobTransactionList)
        realm.getRecordListOnQuery.mockReturnValueOnce([1])
        jobDataService.getJobData = jest.fn()
        jobDataService.getJobData.mockReturnValue(jobDataMap)
        realm.performBatchSave = jest.fn()
        return addServerSmsService.setServerSmsMapForPendingStatus(transactionIdDtosMap)
            .then(() => {
                expect(addServerSmsService.prepareServerSmsMap).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(addServerSmsService.getJobFieldAttributeForJobmaster).toHaveBeenCalledTimes(1)
                expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(2)
                expect(jobDataService.getJobData).toHaveBeenCalledTimes(1)
                expect(realm.performBatchSave).toHaveBeenCalledTimes(1)
            })
    })
})
