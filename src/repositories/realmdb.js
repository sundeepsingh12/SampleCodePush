'use strict'
//Class to combine all Schema and create realm object

import Realm from 'realm';
import JobTransaction from './schema/JobTransaction'
import Job from './schema/Job'
import JobData from './schema/JobData'
import FieldData from './schema/FieldData'
import _ from 'underscore'

const schemaVersion = 4;
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
    tableNamesVsDataList.forEach(record => {
      if(!_.isEmpty(record.value) && !_.isUndefined(record.value))
        record.value.forEach(data => realm.create(record.tableName, data))
    })
  });
}

export function deleteRecords() {
  return realm.write(() => {
    realm.deleteAll()
  });
}

export function deleteRecordsInBatch(...tableNameVsDataList) {
  return realm.write(() => {
    tableNameVsDataList.forEach(record => {
      record.value.forEach(value => {
        console.log('value')
         console.log(value)
        console.log('value[id]')
         console.log(value.id)
        let modelObject = realm.objects(record.tableName).filtered('id == $0', value.id)
        console.log('modelObject')
          console.log(modelObject)
        realm.delete(modelObject)
      })
    })
  });
}

export function updateRecords(...tableNameVsDataList) {
  return realm.write(() => {
    tableNamesVsDataList.forEach(record => {
      if (record.value)
        record.value.forEach(data => realm.create(record.tableName, data))
    })
  });
}

/**A generic method for updating a single property of a Table 
 * 
 * @param {*} tableName 
 * @param {*} property 
 * @param {*} value 
 */
export function updateTableRecordOnProperty(tableName, property, value) {
  realm.write(() => {
    let modelObject = realm.objects(tableName).filtered(property + ' == $0', value);
    modelObject[property] = value
  });
}

export function getAll(tableName) {
  return realm.objects(tableName);
}
