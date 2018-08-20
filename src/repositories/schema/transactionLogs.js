'use strict'
import { TABLE_TRANSACTION_LOGS } from '../../lib/constants'
import Realm from 'realm';

export default class transactionLogs extends Realm.Object { }

transactionLogs.schema = {
    name: TABLE_TRANSACTION_LOGS,
    properties: {
        id: { type: 'int', default: 0 },
        userId: 'int',
        transactionId: 'int',
        jobMasterId: 'int',
        toJobStatusId: 'int',
        fromJobStatusId: 'int',
        latitude: 'double?',
        longitude: 'double?',
        transactionTime: 'string?',
        updatedAt: 'string?',
        hubId: 'int',
        cityId: 'int',
        companyId: 'int',
    }
}