'use strict'
import { TABLE_SERVER_SMS_LOG } from '../../lib/constants'
import Realm from 'realm';

export default class serverSmsLog extends Realm.Object { }

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
serverSmsLog.schema = {
    name: TABLE_SERVER_SMS_LOG,
    primaryKey: 'id',
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
        duration: { type: 'int', default: 0 },
        transactionType: { type: 'string', default: '' },
        communicationType: { type: 'string', default: '' },
        serverResponse: { type: 'string', default: '' },
    }
}