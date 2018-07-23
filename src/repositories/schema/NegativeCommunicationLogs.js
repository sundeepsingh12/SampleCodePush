'use strict'
import { TABLE_NEGATIVE_COMMUNICATION_LOG } from '../../lib/constants'
import Realm from 'realm';

export default class negativeCommunicationLog extends Realm.Object { }

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
negativeCommunicationLog.schema = {
    name: TABLE_NEGATIVE_COMMUNICATION_LOG,
    primaryKey: 'uniqueId',
    properties: {
        id: { type: 'int', default: 0 },
        userId: { type: 'int' },
        companyId: { type: 'int' },
        hubId: { type: 'int' },
        cityId: { type: 'int' },
        jobTransactionId: { type: 'int' },
        referenceNumber: { type: 'string' },
        runsheetNumber: { type: 'string', default: '' },
        contact: { type: 'string', default: '' },
        smsBody: { type: 'string', default: '' },
        dateTime: { type: 'string', default: '' },
        duration: { type: 'string', default: '' },
        transactionType: { type: 'string', default: '' },
        communicationType: { type: 'string', default: '' },
        serverResponse: { type: 'string', default: '' },
        simNumber: { type: 'string', default: '' },
        jobType: { type: 'string', default: '' },
        imeiNumber: { type: 'string', default: '' },
        mobileNumber: { type: 'string', default: '' },
        jobStatus: { type: 'string', default: '' },
        uniqueId: { type: 'int' },
    }
}