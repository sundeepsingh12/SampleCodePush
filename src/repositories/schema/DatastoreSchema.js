'use strict'
import { DataStore_DB, Datastore_AttributeValue_DB } from '../../lib/constants'
import Realm from 'realm';

export default class DatastoreSchema extends Realm.Object { }

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
DatastoreSchema.schema = {
  name: DataStore_DB,
  primaryKey: 'id',
  properties: {
    datastoreAttributeValueMap: { type: 'list', objectType: Datastore_AttributeValue_DB },
    datastoreMasterId: 'int',
    id: { type: 'int', default: 0 },
  }
}