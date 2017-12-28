'use strict'
import { Datastore_Master_DB } from '../../lib/constants'
import Realm from 'realm';

export default class DatastoreMaster extends Realm.Object { }

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
DatastoreMaster.schema = {
  name: Datastore_Master_DB,
  primaryKey: 'id',
  properties: {
    attributeTypeId: { type: 'int' }, 
    datastoreMasterId: { type: 'int' },
    id: { type: 'int', default: 0 },
    key: { type: 'string' },
    label: { type: 'string' },
    lastSyncTime: { type: 'string' },
    searchIndex: { type: 'bool' },
    uniqueIndex: { type: 'bool' },
  }
}