'use strict'
//Class to combine all Schema and create realm object

import Realm from 'realm';
import JobTransaction from './schema/jobTransaction'
import Job from './schema/Job'
import JobData from './schema/JobData'
import FieldData from './schema/FieldData'
import Runsheet from './schema/Runsheet'
import TrackLogs from './schema/trackLogs'
import ServerSmsLog from './schema/serverSmsLog'
import TransactionLogs from './schema/transactionLogs'

import _ from 'lodash'

const schemaVersion = 33;
const schema = [JobTransaction, Job, JobData, FieldData, Runsheet, TrackLogs, ServerSmsLog, TransactionLogs];

let realm = new Realm({
    schemaVersion,
    schema
});

import {
    TABLE_JOB_TRANSACTION,
    TABLE_FIELD_DATA,
    TABLE_JOB,
    TABLE_JOB_DATA,
    USER,
    TABLE_RUNSHEET,
    TABLE_JOB_TRANSACTION_CUSTOMIZATION,
    TABLE_TRACK_LOGS,
    TABLE_SERVER_SMS_LOG,
} from '../lib/constants'

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
            try {
                if (!_.isEmpty(record.value) && !_.isUndefined(record.value))
                    record.value.forEach(data => realm.create(record.tableName, data, true))
            } catch (error) {
                console.log(error)
            }
        })
    })
}

export function deleteRecords() {
    return realm.write(() => {
        realm.delete(realm.objects(TABLE_JOB_TRANSACTION))
        realm.delete(realm.objects(TABLE_JOB))
        realm.delete(realm.objects(TABLE_JOB_DATA))
        realm.delete(realm.objects(TABLE_FIELD_DATA))
        realm.delete(realm.objects(TABLE_RUNSHEET))
        realm.delete(realm.objects(TABLE_TRACK_LOGS))
        realm.delete(realm.objects(TABLE_SERVER_SMS_LOG))
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

/**A generic method for filtering out records which are in ValueList and then updating 'property'
 *  with 'newValue'
 * 
 * @param {*} tableName 
 * @param {*} property 
 * @param {*} value 
 */
export function updateTableRecordOnProperty(tableName, property, valueList, newValue) {
    let filteredRecords = realm.objects(tableName).filtered(valueList.map(value => 'id = "' + value + '"').join(' OR '));
    realm.write(() => {
        _.forEach(filteredRecords, record => record[property] = newValue)
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


export function updateRecordOnMultipleProperty(tableName, valueList,propertyList,count) {
    let filteredRecords = realm.objects(tableName).filtered(valueList.map(value => 'id = "' + value + '"').join(' OR '));
    console.log('123',filteredRecords,propertyList,count)    
    realm.write(() => {
        _.forEach(filteredRecords, record => record[propertyList[record.id]] += count[record.id])
    });
}

/**
 * 
 * @param {*} tableName 
 */
export function getAll(tableName) {
    return realm.objects(tableName);
}

// export function updateRecordOnTableListData(tableName,tableListData,valueList) {
//     let filteredRecords = realm.objects(tableName).filtered(valueList.map(value => 'id = "' + value + '"').join(' OR '));
//     realm.write(() => {
//         _.forEach(filteredRecords, record => record = tableListData[record.id])
//     });
// }

/**A generic method for getting value list based on particular property in Table
 * Eg - Returning all JobTransactionIds From Db
 * @param {*} tableName 
 * @param {*} property 
 */
export function getRecordListOnProperty(tableName, property) {
    let records = realm.objects(tableName).map(data => data[property])
    return records
}

export function filterRecordList(recordList, query) {
    let records = recordList.filtered(query)
    return records
}

export function getRecordListOnQuery(tableName, query, isSorted, sortProperty) {
    let records
    if (query) {
        records = realm.objects(tableName).filtered(query)
    } else {
        records = realm.objects(tableName)
    }
    if (isSorted && sortProperty) {
        records = records.sorted(`${sortProperty}`)
    }
    return records
}

export function updateRealmDb(tableName, transactionIdSequenceMap) {
    const filteredRecords = realm.objects(tableName).filtered(Object.keys(transactionIdSequenceMap).map(value => 'id = "' + value + '"').join(' OR '))
    realm.write(() => {
        filteredRecords.forEach(record => record.seqSelected = record.seqAssigned = transactionIdSequenceMap[record.id])
    })
}