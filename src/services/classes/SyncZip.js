import CONFIG from '../../lib/config'
import RNFS from 'react-native-fs';
import {
    zip,
    unzip
} from 'react-native-zip-archive'
import {
    keyValueDBService
} from './KeyValueDBService'
import {
    jobSummaryService
} from './JobSummary'
import * as realm from '../../repositories/realmdb'

import {
    TABLE_TRACK_LOGS,
    USER_SUMMARY,
    TABLE_FIELD_DATA,
    TABLE_JOB_TRANSACTION,
    TABLE_JOB,
    PENDING_SYNC_TRANSACTION_IDS,
    TABLE_SERVER_SMS_LOG,
    TABLE_RUNSHEET,

} from '../../lib/constants'


var PATH = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER;
//Location where zip contents are temporarily added and then removed
var PATH_TEMP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/TEMP';

export async function createZip(transactionIdToBeSynced) {

    //Create FarEye folder if doesn't exist
    RNFS.mkdir(PATH);
    RNFS.mkdir(PATH_TEMP);

    //Prepare the SYNC_RESULTS
    var SYNC_RESULTS = {};
    let realmDbData = _getSyncDataFromDb(transactionIdToBeSynced);

    SYNC_RESULTS.fieldData = realmDbData.fieldDataList;
    SYNC_RESULTS.job = realmDbData.jobList;
    SYNC_RESULTS.jobSummary = realmDbData.jobSummary;
    SYNC_RESULTS.jobTransaction = realmDbData.transactionList;
    SYNC_RESULTS.runSheetSummary = realmDbData.runSheetSummary;

    SYNC_RESULTS.scannedReferenceNumberLog = [];
    SYNC_RESULTS.serverSmsLog = realmDbData.serverSmsLogs;
    SYNC_RESULTS.trackLog = [];
    SYNC_RESULTS.transactionLog = [];
    SYNC_RESULTS.userCommunicationLog = [];
    SYNC_RESULTS.userEventsLog = [];
    SYNC_RESULTS.userExceptionLog = [];
    let jobSummary = await jobSummaryService.getJobSummaryDataOnLastSync()
    SYNC_RESULTS.jobSummary = jobSummary || {}
    const userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
    const userSummaryValue = userSummary.value
    SYNC_RESULTS.userSummary = userSummaryValue || {}
    console.log(JSON.stringify(SYNC_RESULTS));

    //Writing Object to File at TEMP location
    await RNFS.writeFile(PATH_TEMP + '/logs.json', JSON.stringify(SYNC_RESULTS), 'utf8');

    //Creating ZIP file
    const targetPath = PATH + '/sync.zip'
    const sourcePath = PATH_TEMP
    await zip(sourcePath, targetPath);
    await realm.deleteSpecificTableRecords(TABLE_SERVER_SMS_LOG)
    // await unzip(targetPath, PATH)
    // var content = await RNFS.readFile(PATH + '/logs.json', 'base64')
    // console.log('==image', content)
    // Size of ZIP file created
    // var stat = await RNFS.stat(PATH + '/sync.zip');
    // console.log('=====zip '+stat.size);
    //Deleting TEMP folder location
    await RNFS.unlink(PATH_TEMP);
    // console.log(PATH_TEMP+' removed');


}

/**
 * expects transactionIds whose data is to be synced
 * and returns the object containing data from realm
 * @param {*} transactionIds whose data is to be synced
 */
function _getSyncDataFromDb(transactionIdsObject) {

    let runSheetSummary = _getDataFromRealm([], null, TABLE_RUNSHEET)
    let transactionList = [],
        fieldDataList = [],
        jobList = [],
        serverSmsLogs = []
    if (!transactionIdsObject || !transactionIdsObject.value) {
        return {
            fieldDataList,
            transactionList,
            jobList,
            serverSmsLogs,
            runSheetSummary
        };
    }
    let transactionIds = transactionIdsObject.value;
    let fieldDataQuery = transactionIds.map(transactionId => 'jobTransactionId = ' + transactionId.id).join(' OR ')
    fieldDataList = _getDataFromRealm([], fieldDataQuery, TABLE_FIELD_DATA);
    let transactionListQuery = fieldDataQuery.replace(/jobTransactionId/g, 'id'); // regex expression to replace all jobTransactionId with id
    transactionList = _getDataFromRealm([], transactionListQuery, TABLE_JOB_TRANSACTION);
    let jobIdQuery = transactionList.map(jobTransaction => jobTransaction.jobId).map(jobId => 'id = ' + jobId).join(' OR '); // first find jobIds using map and then make a query for job table
    jobList = _getDataFromRealm([], jobIdQuery, TABLE_JOB);
    let smsLogsQuery = transactionIds.map(transactionId => 'jobTransactionId = ' + transactionId.id).join(' OR ')
    serverSmsLogs = _getDataFromRealm([], smsLogsQuery, TABLE_SERVER_SMS_LOG);

    return {
        fieldDataList,
        transactionList,
        jobList,
        serverSmsLogs,
        runSheetSummary,
    }

}

/**
 * Expects data and data type and 
 * returns new Object with the given data type and data
 * @param {*} dataType whether array or object, if array then pass [], if object then pass {}
 * @param {*} query whose query to fetch data from db
 * @param {*} table table name from which data is to be fetched
 * 
 */
function _getDataFromRealm(dataType, query, table) {
    if (!dataType || !table) {
        return dataType;
    }
    let data = realm.getRecordListOnQuery(table, query);
    if (!data) {
        return dataType;
    }
    if (!Array.isArray(dataType)) {
        return Object.assign(dataType, data);
    }
    if (table == TABLE_FIELD_DATA) {
        return data.map(x => Object.assign({}, x, {
            id: 0
        })) // send id as 0 in case of field data
    } else {
        return data.map(x => Object.assign({}, x))
    }

}