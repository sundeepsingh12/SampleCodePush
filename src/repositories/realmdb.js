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
import DatastoreMaster from './schema/DatastoreMaster'
import DatastoreSchema from './schema/DatastoreSchema'
import TransactionLogs from './schema/transactionLogs'
import _ from 'lodash'
import Draft from './schema/Draft'
import DeviceInfo from 'react-native-device-info'
import AesCtr from '../services/classes/AesCtr'
import userExceptionLogs from './schema/userExceptionLogsDB'

const schemaVersion = 45;
const schema = [JobTransaction, Job, JobData, FieldData, Runsheet, TrackLogs, ServerSmsLog, TransactionLogs, DatastoreMaster, DatastoreSchema, Draft, userExceptionLogs];

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
    TABLE_TRANSACTION_LOGS,
    DataStore_DB,
    Datastore_Master_DB,
    TABLE_DRAFT,
    DEVICE_IMEI,
    USER_EXCEPTION_LOGS,
} from '../lib/constants'

export function save(tableName, object) {
    return realm.write(() => {
        //removing existing entry from Table
        // realm.delete(realm.objects(tableName));
        //writing new record
        realm.create(tableName, object, true);
    });
}

export function saveList(tableName, array) {
    return realm.write(() => {
        //writing new record
        array.forEach(data => realm.create(tableName, data, true));
    });
}

/**Generic method for batch insertions in Realm
 * 
 * @param {*} tableNamesVsDataList 
 */
export function performBatchSave(...tableNamesVsDataList) {
    return realm.write(() => {
        let imeiNumber = DeviceInfo.getUniqueID()
        tableNamesVsDataList.forEach(record => {
            try {
                if (!_.isEmpty(record.value) && !_.isUndefined(record.value)) {
                    if (record.tableName == TABLE_JOB_DATA || record.tableName == TABLE_FIELD_DATA) {
                        // Create counter block from imei number used for encryption
                        let counterBlock = Array.from(imeiNumber).slice(0, 8)
                        for (let data in record.value) {
                            record.value[data].value = _encryptData(record.value[data].value, imeiNumber, counterBlock)
                            realm.create(record.tableName, record.value[data], true)
                        }
                    } else {
                        record.value.forEach(data => realm.create(record.tableName, data, true))
                    }
                }
            } catch (error) {
                console.log(error)
            }
        })
    })
}
/**
 * 
 * @param {*} dataToEncrypt value to be decrypted
 * @param {*} encryptionKey key used to encrypt
 * @param {Array} counterBlock counter block used by aes to encrypt(recommended parameter in case of encryption in loop)
 *  counterBlock: [1,2,3,4,5,6,7,8] array of 8 characters
 */
export function _encryptData(dataToEncrypt, encryptionKey, counterBlock) {
    if (!dataToEncrypt) return
    if (!encryptionKey) encryptionKey = DeviceInfo.getUniqueID()
    if (!counterBlock) counterBlock = Array.from(encryptionKey).slice(0, 8)
    return AesCtr.encrypt(dataToEncrypt, encryptionKey, 256, counterBlock)
}

export function _decryptData(dataToDecrypt, decryptionKey) {
    return AesCtr.decrypt(dataToDecrypt, decryptionKey, 256)
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
        realm.delete(realm.objects(TABLE_TRANSACTION_LOGS))
        realm.delete(realm.objects(TABLE_DRAFT))
        realm.delete(realm.objects(USER_EXCEPTION_LOGS))
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
    if (tableName == TABLE_FIELD_DATA || tableName == TABLE_JOB_DATA) {
        let imeiNumber = DeviceInfo.getUniqueID()
        let recordList = []
        for (let index in records) {
            let recordData = { ...records[index] }
            recordData.value = _decryptData(recordData.value, imeiNumber)
            recordList.push(recordData)
        }
        return recordList
    }
    return records
}

export function updateRealmDb(tableName, transactionIdSequenceMap) {
    const filteredRecords = realm.objects(tableName).filtered(Object.keys(transactionIdSequenceMap).map(value => 'id = "' + value + '"').join(' OR '))
    realm.write(() => {
        filteredRecords.forEach(record => record.seqSelected = record.seqAssigned = transactionIdSequenceMap[record.id])
    })
}

export function deleteSpecificTableRecords(tableName) {
    return realm.write(() => {
        //removing existing entry from Table
        realm.delete(realm.objects(tableName))
    });
}

/**A generic method for filtering out a single record from a table
 * based on a property and then deleting them
 *
 * @param {*} tableName
 * @param {*} value
 * @param {*} property
 */
export function deleteSingleRecord(tableName, value, property) {
    let filteredRecords = realm.objects(tableName).filtered(property + ' = "' + value + '"');
    realm.write(() => {
        realm.delete(filteredRecords)
    });
}

export function getMaxValueOfProperty(tableName, query, property) {
    let filteredRecords = realm.objects(tableName).filtered(query).max(property)
    return filteredRecords
}
