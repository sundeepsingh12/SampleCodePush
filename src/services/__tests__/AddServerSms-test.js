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

describe('Add server sms', () => {
    it('should not set sms if sms is not set at that status', () => {
        let smsJobStatuses = [
            {
                statusId: 1
            }
        ]
        let statusId = 2
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        addServerSmsService.addServerSms(statusId, 0, [], null).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(result).toEqual([])
        })

    })
})

describe('get Job Data', () => {
    it('should return empty list for no job data', () => {
        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([]);
        expect(addServerSmsService.getJobData(0, 0)).toEqual([])

    })
    it('should jobdata list for given job data', () => {
        let jobData = [{
            id: 1
        },
        {
            id: 2
        }]
        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue(jobData);
        expect(addServerSmsService.getJobData(0, 0)).toEqual(jobData)
    })
})
describe('get sms body job data', () => {
    it('should return message without change(no keys)', () => {
        let message = 'hello'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        addServerSmsService.setSmsBodyJobData(message, [], null).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(result).toEqual(message)
        })
    })
    it('should return message with change', () => {
        let message = 'hello {key}'
        let jobAttributes = {
            value: [{
                key: 'key',
                value: 'test',
                id: 1
            }]
        }
        let jobDataList = [{
            jobAttributeMasterId: 1,
            jobId: 2
        }]
        let jobTransaction = {
            jobId: 2
        }
        const newMessage = 'hello test'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(jobAttributes)
        addServerSmsService.setSmsBodyJobData(message, jobDataList, jobTransaction).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(result).toEqual(newMessage)
        })
    })
})

describe('set sms body field data', () => {
    it('should return message without change(no keys)', () => {
        let message = 'hello'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        addServerSmsService.setSMSBodyFieldData(message, [], null).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(result).toEqual(message)
        })
    })
    it('should return message with change(no keys)', () => {
        let message = 'hello {key2}'
        let jobAttributes = {
            value: [{
                key: 'key',
                value: 'test',
                id: 1
            }]
        }
        let jobDataList = [{
            jobAttributeMasterId: 1,
            jobId: 2
        }]
        let jobTransaction = {
            jobId: 2
        }
        const newMessage = 'hello test'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(jobAttributes)
        addServerSmsService.setSMSBodyFieldData(message, jobDataList, jobTransaction).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(result).toEqual(newMessage)
        })
    })
})

describe('set sms body fixed attributes', () => {
    it('should return message without change(no keys)', () => {
        let message = null
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('test')
        addServerSmsService.setSmsBodyFixedAttribute(message, null).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(message).toEqual(null)
        })
    })
    it('should return message with change(no keys)', () => {
        let message = 'hello <BIKER_NAME> <BIKER_MOBILE> <REF_NO> <ATTEMPT_NO> <RUNSHEET_NO> <CREATION_DATE> <TRANSACTION_DATE> <JOB_ETA>'
        let user = {
            value: [{
                firstName: 'shivani',
                lastName: 'monga',
                mobileNumber: 123
            }]
        }
        let jobDataList = [{
            jobAttributeMasterId: 1,
            jobId: 2
        }]
        let jobTransaction = {
            jobId: 2,
            referenceNumber: 'refno',
            attemptCount: 1,
            runsheetNo: 'runsheetNo',
        }
        const newMessage = 'hello shivani monga 123 refno 1 runsheetNo'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(user)
        addServerSmsService.setSmsBodyFixedAttribute(message, jobTransaction).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(message).toEqual(newMessage)
        })
    })
})

describe('save Server Sms Log', () => {
    it('should return empty list for no sms logs', () => {
        expect(addServerSmsService.saveServerSmsLog(null)).toEqual([])
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
        addServerSmsService.checkForRecursiveData(message, null).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(messageBody).toEqual(message)
        })
    })
})

describe('send field message', () => {
    it('should return message without change(no keys)', () => {
        let message = 'test'
        let smsTemplate = {
            body: message
        }
        addServerSmsService.sendFieldMessage(123, smsTemplate, null, [], []).then(() => {
            expect(this.setSmsBodyJobData).toHaveBeenCalledTimes(1)
            expect(this.setSMSBodyFieldData).toHaveBeenCalledTimes(1)
            expect(messageBody).toEqual(message)
        })
    })
})