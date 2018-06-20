'use strict'
import { TABLE_MESSAGE_INTERACTION } from '../../lib/constants'
import Realm from 'realm';

export default class messageInteracion extends Realm.Object { }

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
messageInteracion.schema = {
    name: TABLE_MESSAGE_INTERACTION,
    primaryKey: 'id',
    properties: {
        id: { type: 'int', default: 0 },
        type: { type: 'string' },
        messageBody: { type: 'string' },
        messageBoxId: { type: 'int?' },
        senderUserId: { type: 'int' },
        referenceNumber: { type: 'string?', default: '' },
        dateTimeOfSending: { type: 'string', default: '' },
        transactionId: { type: 'int?', default: 0 },
        messageSendingStatus: { type: 'string?' }
    }
}