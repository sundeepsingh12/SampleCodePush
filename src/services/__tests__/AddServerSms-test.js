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
        let smsJobStatuses = [
            {
                statusId: 1
            }
        ]
        let statusId = 2

        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([]);
        addServerSmsService.getJobData(0, 0).then(() => {
            expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1)
            expect(result).toEqual([])
        })

    })
})