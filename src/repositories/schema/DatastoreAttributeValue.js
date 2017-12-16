'use strict'
import { Datastore_AttributeValue_DB } from '../../lib/constants'
import Realm from 'realm';

export default class DatastoreAttributeValue extends Realm.Object { }

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
DatastoreAttributeValue.schema = {
    name: Datastore_AttributeValue_DB,
    primaryKey: 'id',
    properties: {
        id: { type: 'int', default: 0 },
        key: 'string',
        value: 'string',
        serverUniqueKey: 'string'
    }
}