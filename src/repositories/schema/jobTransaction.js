'use strict'
const { TABLE_JOB_TRANSACTION } = require('../../lib/constants').default
import Realm from 'realm';

export default class JobTransaction extends Realm.Object { }

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
JobTransaction.schema = {
    name: TABLE_JOB_TRANSACTION,
    primaryKey: 'id',
    properties: {
        runsheetNo: { type: 'string', default: '' },
        syncErp: { type: 'bool', default: false },
        jobCreatedAt: { type: 'string', default: '' },
        erpSyncTime: { type: 'string',optional:true },
        androidPushTime: { type: 'string' },
        lastUpdatedAtServer: { type: 'string' },
        lastTransactionTimeOnMobile: { type: 'string' },
        jobEtaTime: { type: 'string' },
        seqSelected: { type: 'int' },
        seqActual: { type: 'int' },
        seqAssigned: { type: 'int' },
        companyId: { type: 'int' },
        jobId: { type: 'int', default: 0 },
        jobMasterId: { type: 'int' },
        userId: { type: 'int' },
        jobStatusId: { type: 'int', default: 0 },
        actualAmount: { type: 'double', default: 0.0 },
        originalAmount: { type: 'double', default: 0.0 },
        moneyTransactionType: { type: 'string' },
        referenceNumber: { type: 'string' },
        runsheetId: { type: 'int' },
        hubId: { type: 'int' },
        cityId: { type: 'int' },
        trackKm: { type: 'double' },
        trackHalt: { type: 'double' },
        trackCallCount: { type: 'int', default: 0 },
        trackCallDuration: { type: 'int', default: 0 },
        trackSmsCount: { type: 'int', default: 0 },
        trackTransactionTimeSpent: { type: 'double' },
        latitude: { type: 'double' },
        longitude: { type: 'double' },
        trackBattery: { type: 'int' },
        deleteFlag: { type: 'int' },
        attemptCount: { type: 'int', default: 1 },
        startTime: { type: 'string' },
        endTime: { type: 'string' },
        merchantCode: { type: 'string' },
        imeiNumber: { type: 'string' },
        npsFeedBack: { type: 'string' },
        id: { type: 'int' }
    }
}