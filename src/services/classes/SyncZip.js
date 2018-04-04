import CONFIG from '../../lib/config'
import RNFS from 'react-native-fs'
import {
    zip,
    unzip
} from 'react-native-zip-archive'
import {
    keyValueDBService
} from './KeyValueDBService'
import { jobTransactionService } from './JobTransaction'
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
    TABLE_TRANSACTION_LOGS,
    LAST_SYNC_WITH_SERVER,
    FIELD_ATTRIBUTE,
    JOB_STATUS,
    JOB_MASTER,
    UNSEEN,
    USER_EXCEPTION_LOGS
} from '../../lib/constants'
import moment from 'moment'
import { trackingService } from './Tracking'
import { userEventLogService } from './UserEvent'
import { addServerSmsService } from './AddServerSms'
import {
    SIGNATURE,
    CAMERA,
    CAMERA_HIGH,
    CAMERA_MEDIUM,
    SIGNATURE_AND_FEEDBACK,
    PENDING
} from '../../lib/AttributeConstants'
import { jobStatusService } from './JobStatus'
import { jobMasterService } from './JobMaster'
var PATH = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER;
//Location where zip contents are temporarily added and then removed
var PATH_TEMP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/TEMP';
import { userExceptionLogsService } from './UserException'

export async function createZip(transactionIdToBeSynced) {

    //Create FarEye folder if doesn't exist
    RNFS.mkdir(PATH);
    RNFS.mkdir(PATH_TEMP);

    //Prepare the SYNC_RESULTS
    var SYNC_RESULTS = {};
    let lastSyncTime = await keyValueDBService.getValueFromStore(LAST_SYNC_WITH_SERVER)
    let realmDbData = _getSyncDataFromDb(transactionIdToBeSynced);
    SYNC_RESULTS.fieldData = realmDbData.fieldDataList;
    SYNC_RESULTS.job = realmDbData.jobList;
    SYNC_RESULTS.jobTransaction = realmDbData.transactionList;
    SYNC_RESULTS.runSheetSummary = realmDbData.runSheetSummary;

    SYNC_RESULTS.scannedReferenceNumberLog = [];
    SYNC_RESULTS.serverSmsLog = addServerSmsService.getServerSmsLogs(realmDbData.serverSmsLogs, lastSyncTime);

    SYNC_RESULTS.trackLog = await trackingService.getTrackLogs(realmDbData.trackLogs, lastSyncTime)
    SYNC_RESULTS.transactionLog = realmDbData.transactionLogs;
    SYNC_RESULTS.userCommunicationLog = [];
    SYNC_RESULTS.userEventsLog = await userEventLogService.getUserEventLog(lastSyncTime)
    SYNC_RESULTS.userExceptionLog = await userExceptionLogsService.getUserExceptionLog(realmDbData.userExceptionLog,lastSyncTime)

    let jobSummary = await jobSummaryService.getJobSummaryDataOnLastSync(lastSyncTime)
    SYNC_RESULTS.jobSummary = jobSummary || {}

    const userSummary = await updateUserSummaryNextJobTransactionId()
    SYNC_RESULTS.userSummary = (userSummary && userSummary.value) ? userSummary.value : {}
    await moveImageFilesToSync(realmDbData.fieldDataList, PATH_TEMP)
    //Writing Object to File at TEMP location
    await RNFS.writeFile(PATH_TEMP + '/logs.json', JSON.stringify(SYNC_RESULTS), 'utf8');

    //Creating ZIP file
    const targetPath = PATH + '/sync.zip'
    const sourcePath = PATH_TEMP
    await zip(sourcePath, targetPath);
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

async function updateUserSummaryNextJobTransactionId() {
    const statusMap = await jobStatusService.getNonUnseenStatusIdsForStatusCategory(PENDING)
    const jobMasterIdWithEnableResequence = await jobMasterService.getJobMasterWithEnableResequence()
    const firstEnableSequenceTransaction = (jobMasterIdWithEnableResequence && statusMap) ? jobTransactionService.getFirstTransactionWithEnableSequence(jobMasterIdWithEnableResequence, statusMap) : null
    let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
    if (!userSummary || !userSummary.value) {
        throw new Error('Job status missing in store')
    }
    userSummary.value.nextJobTransactionId = firstEnableSequenceTransaction ? firstEnableSequenceTransaction.id : null
    await keyValueDBService.validateAndSaveData(USER_SUMMARY, userSummary.value)
    return userSummary
}

/**
 * expects transactionIds whose data is to be synced
 * and returns the object containing data from realm
 * @param {*} transactionIds whose data is to be synced
 */
function _getSyncDataFromDb(transactionIdsObject) {
    let userExceptionLog = _getDataFromRealm([], null, USER_EXCEPTION_LOGS)
    let runSheetSummary = _getDataFromRealm([], null, TABLE_RUNSHEET)
    // console.log('lastSyncTime',lastSyncTime.value)
    // const formattedTime = moment(lastSyncTime.value).format('YYYY-MM-DD HH:mm:ss')
    // console.log('moment',formattedTime)
    // let trackLogQuery = `Date(trackTime) > ${formattedTime}`
    let trackLogs = _getDataFromRealm([], null, TABLE_TRACK_LOGS)
    let transactionList = [],
        fieldDataList = [],
        jobList = [],
        serverSmsLogs = [],
        transactionLogs = []
    if (!transactionIdsObject || !transactionIdsObject.value) {
        serverSmsLogs = _getDataFromRealm([], null, TABLE_SERVER_SMS_LOG)
        return {
            fieldDataList,
            transactionList,
            jobList,
            serverSmsLogs,
            runSheetSummary,
            transactionLogs,
            trackLogs,
            userExceptionLog
        };
    }
    let transactionIds = transactionIdsObject.value;
    let fieldDataQuery = transactionIds.map(transactionId => 'jobTransactionId = ' + transactionId.id).join(' OR ')
    fieldDataList = _getDataFromRealm([], fieldDataQuery, TABLE_FIELD_DATA);
    let transactionListQuery = fieldDataQuery.replace(/jobTransactionId/g, 'id'); // regex expression to replace all jobTransactionId with id
    transactionList = _getDataFromRealm([], transactionListQuery, TABLE_JOB_TRANSACTION);
    let jobIdQuery = transactionList.map(jobTransaction => jobTransaction.jobId).map(jobId => 'id = ' + jobId).join(' OR '); // first find jobIds using map and then make a query for job table
    jobList = _getDataFromRealm([], jobIdQuery, TABLE_JOB)
    let smsLogsQuery = transactionIds.map(transactionId => 'jobTransactionId = ' + transactionId.id).join(' OR ')
    serverSmsLogs = _getDataFromRealm([], smsLogsQuery, TABLE_SERVER_SMS_LOG);
    let transactionLogQuery = transactionIds.map(transactionId => 'transactionId = ' + transactionId.id).join(' OR ')
    transactionLogs = _getDataFromRealm([], transactionLogQuery, TABLE_TRANSACTION_LOGS);
    return {
        fieldDataList,
        transactionList,
        jobList,
        serverSmsLogs,
        runSheetSummary,
        transactionLogs,
        trackLogs,
        userExceptionLog
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
export function _getDataFromRealm(dataType, query, table) {
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
export async function moveImageFilesToSync(fieldDataList, path) {
    let fieldAttributes = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
    if (!fieldAttributes || !fieldAttributes.value) return
    if (!fieldDataList || fieldDataList.length < 1) return
    let masterIdToAttributeMap = {}
    for (let fieldAttribute of fieldAttributes.value) {
        if (fieldAttribute.attributeTypeId == SIGNATURE || fieldAttribute.attributeTypeId == CAMERA || fieldAttribute.attributeTypeId == CAMERA_HIGH || fieldAttribute.attributeTypeId == CAMERA_MEDIUM) {
            masterIdToAttributeMap[fieldAttribute.id] = fieldAttribute
        }
    }
    let imageFileNamesArray = []
    for (let fieldData of fieldDataList) {
        if (masterIdToAttributeMap[fieldData.fieldAttributeMasterId] && fieldData.value && fieldData.value != '') {
            imageFileNamesArray.push(fieldData.value)
        }
    }
    if (imageFileNamesArray.length < 1) return
    for (let imageName of imageFileNamesArray) {
        let name = imageName.split('/')
        let fileExits = await RNFS.exists(PATH + '/CustomerImages/' + name[name.length - 1])
        if (fileExits) {
            let fileAlreadyExists = await RNFS.exists(path + '/' + name[name.length - 1])
            if (!fileAlreadyExists) {
                await RNFS.copyFile(PATH + '/CustomerImages/' + name[name.length - 1], path + '/' + name[name.length - 1])
            }
        }
    }
}