'use strict'
//Class to combine all Schema and create realm object

import Realm from 'realm';
import JobTransaction from './schema/JobTransaction'
import Job from './schema/Job'
import JobData from './schema/JobData'
import FieldData from './schema/FieldData'

const schemaVersion = 5;
const schema = [JobTransaction, Job, JobData, FieldData];
let realm = new Realm({
  schemaVersion,
  schema
});

const {
  TABLE_JOB_TRANSACTION,
  TABLE_FIELD_DATA,
  TABLE_JOB,
  TABLE_JOB_DATA,
  USER
} = require('../lib/constants').default


export function save(tableName, object) {
  return realm.write(() => {
    //removing existing entry from Table
    realm.delete(realm.objects(tableName));
    //writing new record
    realm.create(tableName, object);
  });
}

export function saveList(tableName, array) {
  return realm.write(() => {
    //writing new record
    array.forEach(data => realm.create(tableName, data));
  });
}

/**Generic method for batch insertions in Realm
 * 
 * @param {*} tableNamesVsDataList 
 */
export function performBatchSave(...tableNamesVsDataList) {
  return realm.write(() => {
    realm.deleteAll()
    tableNamesVsDataList.forEach(record => {
      if (record.value)
        record.value.forEach(data => realm.create(record.tableName, data))
    })
  });
}


export function getAll(tableName) {
  return realm.objects(tableName);
}
