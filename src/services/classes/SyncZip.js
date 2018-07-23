import RNFS from 'react-native-fs'
import { zip } from 'react-native-zip-archive'
import { keyValueDBService } from './KeyValueDBService'
import { jobTransactionService } from './JobTransaction'
import { jobSummaryService } from './JobSummary'
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
    JOB_STATUS,
    UNSEEN,
    USER_EXCEPTION_LOGS
} from '../../lib/constants'
import moment from 'moment'
import { trackingService } from './Tracking'
import { userEventLogService } from './UserEvent'
import { addServerSmsService } from './AddServerSms'
import { SIGNATURE, CAMERA, CAMERA_HIGH, CAMERA_MEDIUM, PENDING, PATH, PATH_TEMP } from '../../lib/AttributeConstants'
import { userExceptionLogsService } from './UserException'
import { communicationLogsService } from './CommunicationLogs'
import { omit } from 'lodash'
import { Platform } from 'react-native'

class SyncZip {

    async createZip(syncStoreDTO) {
        //Create FarEye folder if doesn't exist
        RNFS.mkdir(PATH);
        RNFS.mkdir(PATH_TEMP);
        //Prepare the SYNC_RESULTS
        var SYNC_RESULTS = {};
        let lastSyncTime = syncStoreDTO.lastSyncWithServer
        let realmDbData = this.getDataToBeSyncedFromDB(syncStoreDTO.transactionIdToBeSynced, lastSyncTime);
        SYNC_RESULTS.fieldData = realmDbData.fieldDataList;
        SYNC_RESULTS.job = realmDbData.jobList;
        SYNC_RESULTS.jobTransaction = realmDbData.transactionList;
        SYNC_RESULTS.runSheetSummary = realmDbData.runSheetSummary;
        SYNC_RESULTS.scannedReferenceNumberLog = [];
        SYNC_RESULTS.serverSmsLog = addServerSmsService.getServerSmsLogs(realmDbData.serverSmsLogs, syncStoreDTO.lastSyncWithServer);
        SYNC_RESULTS.trackLog = trackingService.getTrackLogs(realmDbData.trackLogs, syncStoreDTO.lastSyncWithServer)
        SYNC_RESULTS.transactionLog = realmDbData.transactionLogs;
        const userSummary = this.updateUserSummaryNextJobTransactionId(syncStoreDTO.statusList, syncStoreDTO.jobMasterList, syncStoreDTO.userSummary)
        let { communicationLogs, lastCallTime, lastSmsTime, negativeCommunicationLogs, previousNegativeCommunicationLogsTransactionIds } = (Platform.OS !== 'ios') ? await communicationLogsService.getCallLogs(syncStoreDTO, userSummary) : { communicationLogs: [], lastCallTime: null, lastSmsTime: null }
        SYNC_RESULTS.userCommunicationLog = communicationLogs ? communicationLogs : []
        SYNC_RESULTS.userEventsLog = userEventLogService.getUserEventLogsList(syncStoreDTO.userEventsLogsList, syncStoreDTO.lastSyncWithServer)
        SYNC_RESULTS.userExceptionLog = userExceptionLogsService.getUserExceptionLog(realmDbData.userExceptionLog, lastSyncTime)
        let jobSummary = jobSummaryService.getJobSummaryListForSync(syncStoreDTO.jobSummaryList, syncStoreDTO.lastSyncWithServer)
        SYNC_RESULTS.jobSummary = jobSummary
        SYNC_RESULTS.userSummary = userSummary ? userSummary : {};
        await this.moveImageFilesToSync(realmDbData.fieldDataList, PATH_TEMP, syncStoreDTO.fieldAttributesList)
        //Writing Object to File at TEMP location
        await RNFS.writeFile(PATH_TEMP + '/logs.json', JSON.stringify(SYNC_RESULTS), 'utf8');
        //Creating ZIP file
        const targetPath = PATH + '/sync.zip'
        const sourcePath = PATH_TEMP
        await zip(sourcePath, targetPath);
        return { lastCallTime, lastSmsTime, userSummary, negativeCommunicationLogs, previousNegativeCommunicationLogsTransactionIds }
        //Deleting TEMP folder location
        // RNFS.unlink(PATH_TEMP).then(() => { }).catch((error) => { })
    }

    updateUserSummaryNextJobTransactionId(statusList, jobMasterList, userSummary) {
        if (!userSummary) {
            throw new Error('User Summary missing in store');
        }
        const pendingStatusList = statusList ? statusList.filter(jobStatus => jobStatus.statusCategory == PENDING && jobStatus.code != UNSEEN) : null;
        const jobMasterListWithEnableResequence = jobMasterList ? jobMasterList.filter(jobMaster => jobMaster.enableResequenceRestriction == true) : null;
        const firstEnableSequenceTransaction = (jobMasterListWithEnableResequence && pendingStatusList) ? jobTransactionService.getFirstTransactionWithEnableSequence(jobMasterListWithEnableResequence, pendingStatusList) : null;
        userSummary.nextJobTransactionId = firstEnableSequenceTransaction ? firstEnableSequenceTransaction.id : null;
        return userSummary;
    }


    _getSyncDataFromDb(transactionIdsObject) {
        let userExceptionLog = this._getDataFromRealm([], null, USER_EXCEPTION_LOGS)
        let runSheetSummary = this._getDataFromRealm([], null, TABLE_RUNSHEET)
        let trackLogs = this._getDataFromRealm([], null, TABLE_TRACK_LOGS)
        let transactionList = [],
            fieldDataList = [],
            jobList = [],
            serverSmsLogs = [],
            transactionLogs = []
        if (!transactionIdsObject || !transactionIdsObject.value) {
            serverSmsLogs = this._getDataFromRealm([], null, TABLE_SERVER_SMS_LOG)
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
        fieldDataList = this._getDataFromRealm([], fieldDataQuery, TABLE_FIELD_DATA);
        let transactionListQuery = fieldDataQuery.replace(/jobTransactionId/g, 'id'); // regex expression to replace all jobTransactionId with id
        transactionList = this._getDataFromRealm([], transactionListQuery, TABLE_JOB_TRANSACTION);
        let jobIdQuery = transactionList.map(jobTransaction => jobTransaction.jobId).map(jobId => 'id = ' + jobId).join(' OR '); // first find jobIds using map and then make a query for job table
        jobList = this._getDataFromRealm([], jobIdQuery, TABLE_JOB)
        let smsLogsQuery = transactionIds.map(transactionId => 'jobTransactionId = ' + transactionId.id).join(' OR ')
        serverSmsLogs = this._getDataFromRealm([], smsLogsQuery, TABLE_SERVER_SMS_LOG);
        let transactionLogQuery = transactionIds.map(transactionId => 'transactionId = ' + transactionId.id).join(' OR ')
        transactionLogs = this._getDataFromRealm([], transactionLogQuery, TABLE_TRANSACTION_LOGS);
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
     * This function gets data from db that is to be synced.It returns js object not db object
     * @param {*} transactionIdList 
     * @returns
     * {
     *      fieldDataList,
            transactionList,
            jobList,
            serverSmsLogs,
            runSheetSummary,
            transactionLogs,
            trackLogs
     * }
     */
    getDataToBeSyncedFromDB(transactionIdList, lastSyncTime) {
        let userExceptionLog = this.getDataFromRealmDB(null, USER_EXCEPTION_LOGS)
        let runSheetSummary = this.getDataFromRealmDB(null, TABLE_RUNSHEET);
        let trackLogs = this.getDataFromRealmDB(null, TABLE_TRACK_LOGS);
        let transactionList = [], fieldDataList = [], jobList = [], serverSmsLogs = [], transactionLogs = [];
        if (!transactionIdList) {
            serverSmsLogs = this.getDataFromRealmDB(null, TABLE_SERVER_SMS_LOG);
            return { fieldDataList, transactionList, jobList, serverSmsLogs, runSheetSummary, transactionLogs, trackLogs, userExceptionLog };
        }
        let fieldDataQuery, jobTransactionQuery, jobQuery, transactionLogQuery
        let firstIndex = Object.keys(transactionIdList)[0];
        for (let index in transactionIdList) {
            if (index == firstIndex) {
                fieldDataQuery = `jobTransactionId = ${transactionIdList[index].id}`;
                jobTransactionQuery = `id = ${transactionIdList[index].id}`;
                jobQuery = `id = ${transactionIdList[index].jobId}`;
                transactionLogQuery = `transactionId = ${transactionIdList[index].id}`;
            } else {
                fieldDataQuery += ` OR jobTransactionId = ${transactionIdList[index].id}`;
                jobTransactionQuery += ` OR id = ${transactionIdList[index].id}`;
                jobQuery += ` OR id = ${transactionIdList[index].jobId}`;
                transactionLogQuery += ` OR transactionId = ${transactionIdList[index].id}`;
            }
        }
        fieldDataList = this.getDataFromRealmDB(fieldDataQuery, TABLE_FIELD_DATA, lastSyncTime);
        transactionList = this.getDataFromRealmDB(jobTransactionQuery, TABLE_JOB_TRANSACTION);
        jobList = this.getDataFromRealmDB(jobQuery, TABLE_JOB);
        serverSmsLogs = this.getDataFromRealmDB(fieldDataQuery, TABLE_SERVER_SMS_LOG);
        transactionLogs = this.getDataFromRealmDB(transactionLogQuery, TABLE_TRANSACTION_LOGS);
        return { fieldDataList, transactionList, jobList, serverSmsLogs, runSheetSummary, transactionLogs, trackLogs, userExceptionLog }
    }

    /**
    * Expects data and data type and 
    * returns new Object with the given data type and data
    * @param {*} dataType whether array or object, if array then pass [], if object then pass {}
    * @param {*} query whose query to fetch data from db
    * @param {*} table table name from which data is to be fetched
    * 
    */
    _getDataFromRealm(dataType, query, table) {
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

    getDataFromRealmDB(query, table, lastSyncTime) {
        let data = realm.getRecordListOnQuery(table, query);
        // send id as 0 in case of field data
        if (table == TABLE_FIELD_DATA) {
            let fieldDataList = []
            for (let index in data) {
                let fieldData = { ...data[index] }
                if (moment(fieldData.dateTime).isAfter(lastSyncTime)) {
                    fieldData.id = 0
                    fieldDataList.push(omit(fieldData, ['dateTime']))
                }
            }
            return fieldDataList
        } else {
            return data.map(x => Object.assign({}, x));
        }
    }

    async moveImageFilesToSync(fieldDataList, path, fieldAttributesList) {
        if (!fieldAttributesList || !fieldDataList || fieldDataList.length < 1) {
            return
        }

        let masterIdToAttributeMap = {}
        for (let fieldAttribute of fieldAttributesList) {
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

        if (imageFileNamesArray.length < 1) {
            return
        }

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

}

export let syncZipService = new SyncZip()
