'use strict'
import { TABLE_DRAFT } from '../../lib/constants'
import Realm from 'realm';

export default class Draft extends Realm.Object { }

Draft.schema = {
    name: TABLE_DRAFT,
    primaryKey: 'jobTransactionId',
    properties: {
        jobTransactionId: 'int',
        statusId: 'int',
        formLayoutObject: 'string',
        jobMasterId: 'int',
        navigationFormLayoutStates: { type: 'string', default: '{}' },
        statusName: 'string',
        referenceNumber: 'string',
    }
}
