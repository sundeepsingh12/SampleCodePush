'use strict'
//Class to combine all Schema and create realm object

import Realm from 'realm';
import JobTransaction from './schema/JobTransaction'
import Job from './schema/Job'
import JobData from './schema/JobData'
import FieldData from './schema/FieldData'
import Runsheet from './schema/Runsheet'


import _ from 'underscore'

const schemaVersion = 19;
const schema = [JobTransaction, Job, JobData, FieldData, Runsheet];
let realm = new Realm({
  schemaVersion,
  schema
});

const {
  TABLE_JOB_TRANSACTION,
  TABLE_FIELD_DATA,
  TABLE_JOB,
  TABLE_JOB_DATA,
  USER,
  TABLE_RUNSHEET
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
  console.log('performBatchSave called >>>>')
  return realm.write(() => {
    tableNamesVsDataList.forEach(record => {
      console.log('tableName')
      console.log(record.tableName)
      if (!_.isEmpty(record.value) && !_.isUndefined(record.value))
        record.value.forEach(data => realm.create(record.tableName, data, true))
    })
  });
}

export function deleteRecords() {
  return realm.write(() => {
    realm.deleteAll()
  });
}

/**
 * 
 * @param {*} tableNameVsDataList 
 */
export function deleteRecordsInBatch(...tableNameVsDataList) {
  return realm.write(() => {
    tableNameVsDataList.forEach(record => {
      if (!_.isUndefined(record.valueList) && !_.isEmpty(record.valueList)) {
        let filteredRecords = realm.objects(record.tableName).filtered(record.valueList.map(value => record.propertyName + ' = "' + value + '"').join(' OR '));
        realm.delete(filteredRecords)
      }
    })
  });
}

/**A generic method for updating a single column of a Table 
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

/**A generic method for filtering out records from a table 
 * based on a property and then deleting them
 * 
 * @param {*} tableName 
 * @param {*} valueList 
 * @param {*} property 
 */
export function deleteRecordList(tableName, valueList, property) {
  let filteredRecords = realm.objects(tableName).filtered(valueList.map(value => property + ' = "' + value + '"').join(' OR '));
  realm.write(() => {
    realm.delete(filteredRecords)
  });
}

/**
 * 
 * @param {*} tableName 
 */
export function getAll(tableName) {
  return realm.objects(tableName);
}
