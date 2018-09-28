import RNFS from 'react-native-fs'
import { zip } from 'react-native-zip-archive'
import { jobTransactionService } from './JobTransaction'
import { jobSummaryService } from './JobSummary'
import { keyValueDBService } from './KeyValueDBService'
import * as realm from '../../repositories/realmdb'
import {
    TABLE_TRACK_LOGS,
    TABLE_FIELD_DATA,
    TABLE_JOB_TRANSACTION,
    TABLE_JOB,
    TABLE_SERVER_SMS_LOG,
    TABLE_RUNSHEET,
    TABLE_TRANSACTION_LOGS,
    UNSEEN,
    USER_EXCEPTION_LOGS,
    ENCRYPTION_KEY
} from '../../lib/constants'
import moment from 'moment'
import { trackingService } from './Tracking'
import { userEventLogService } from './UserEvent'
import { addServerSmsService } from './AddServerSms'
import { SIGNATURE, CAMERA, CAMERA_HIGH, CAMERA_MEDIUM, PENDING, PATH, PATH_TEMP, APP_VERSION_NUMBER, QC_IMAGE, SKU_PHOTO } from '../../lib/AttributeConstants'
import { userExceptionLogsService } from './UserException'
import { communicationLogsService } from './CommunicationLogs'
import _ from 'lodash'

import { Platform } from 'react-native'
var CryptoJS = require("crypto-js");

class SyncZip {

    async createZip(syncStoreDTO, isCalledFromLogout) {
        //Create FarEye folder if doesn't exist
        RNFS.mkdir(PATH);
        RNFS.mkdir(PATH_TEMP);
        //Prepare the SYNC_RESULTS
        var SYNC_RESULTS = {};
        let lastSyncTime = syncStoreDTO.lastSyncWithServer

        let realmDbData = this.getDataToBeSyncedFromDB(syncStoreDTO.transactionIdToBeSynced, isCalledFromLogout);
        const syncDataDTO = realmDbData.syncDataDTO
        SYNC_RESULTS.fieldData = realmDbData.fieldDataList;
        SYNC_RESULTS.job = realmDbData.jobList;
        SYNC_RESULTS.jobTransaction = realmDbData.transactionList;
        SYNC_RESULTS.runSheetSummary = realmDbData.runSheetSummary;
        SYNC_RESULTS.scannedReferenceNumberLog = [];
        SYNC_RESULTS.serverSmsLog = addServerSmsService.getServerSmsLogs(realmDbData.serverSmsLogs, syncStoreDTO.lastSyncWithServer);
        SYNC_RESULTS.trackLog = trackingService.getTrackLogs(realmDbData.trackLogs, syncStoreDTO.lastSyncWithServer)
        SYNC_RESULTS.transactionLog = realmDbData.transactionLogs;
        const userSummary = this.updateUserSummary(syncStoreDTO)
        let { communicationLogs, lastCallTime, lastSmsTime, negativeCommunicationLogs, previousNegativeCommunicationLogsTransactionIds } = (Platform.OS !== 'ios') ? await communicationLogsService.getCallLogs(syncStoreDTO, userSummary) : { communicationLogs: [], lastCallTime: null, lastSmsTime: null }
        SYNC_RESULTS.userCommunicationLog = communicationLogs ? communicationLogs : []
        SYNC_RESULTS.userEventsLog = userEventLogService.getUserEventLogsList(syncStoreDTO.userEventsLogsList, syncStoreDTO.lastSyncWithServer)
        SYNC_RESULTS.userExceptionLog = userExceptionLogsService.getUserExceptionLog(realmDbData.userExceptionLog, lastSyncTime)
        let jobSummary = jobSummaryService.getJobSummaryListForSync(syncStoreDTO.jobSummaryList, syncStoreDTO.lastSyncWithServer)
        SYNC_RESULTS.jobSummary = jobSummary
        SYNC_RESULTS.userSummary = userSummary ? userSummary : {};
        await this.moveImageFilesToSync(realmDbData.fieldDataList, PATH_TEMP, syncStoreDTO.fieldAttributesList)
        let isEncryptionSuccessful = true, syncData
        try {
            syncData = JSON.stringify(SYNC_RESULTS)
            const encryptionKey = await keyValueDBService.getValueFromStore(ENCRYPTION_KEY)
            const keyInside = CryptoJS.enc.Base64.parse(encryptionKey.value);
            const encryptedResult = CryptoJS.AES.encrypt(syncData, keyInside, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
            //Writing Object to File at TEMP location
            await RNFS.writeFile(PATH_TEMP + '/logs.json', encryptedResult.toString(), 'utf8');
        } catch (error) {
            isEncryptionSuccessful = false
        }
        //Send data in plain text format to server,sync shouldn't be stopped if encryption failed
        if (!isEncryptionSuccessful) {
            await RNFS.writeFile(PATH_TEMP + '/logs.json', syncData, 'utf8');
        }
        //Creating ZIP file
        const targetPath = PATH + '/sync.zip'
        const sourcePath = PATH_TEMP
        await zip(sourcePath, targetPath);
        return { lastCallTime, lastSmsTime, userSummary, negativeCommunicationLogs, previousNegativeCommunicationLogsTransactionIds, isEncryptionSuccessful, syncDataDTO }

    }

    updateUserSummary(syncStoreDTO) {
        const {statusList, jobMasterList, userSummary, user, lastSyncWithServer} = syncStoreDTO
        if (!userSummary) {
            throw new Error('User Summary missing in store');
        }
        const pendingStatusList = statusList ? statusList.filter(jobStatus => jobStatus.statusCategory == PENDING && jobStatus.code != UNSEEN) : null;
        const jobMasterListWithEnableResequence = jobMasterList ? jobMasterList.filter(jobMaster => jobMaster.enableResequenceRestriction == true) : null;
        const firstEnableSequenceTransaction = (jobMasterListWithEnableResequence && pendingStatusList) ? jobTransactionService.getFirstTransactionWithEnableSequence(jobMasterListWithEnableResequence, pendingStatusList) : null;
        userSummary.nextJobTransactionId = firstEnableSequenceTransaction ? firstEnableSequenceTransaction.id : null;
        userSummary.appVersion = APP_VERSION_NUMBER
        userSummary.lastLocationDatetime = moment().format('YYYY-MM-DD HH:mm:ss')
        const activeTime = userSummary.activeTimeInMillis
        let currentTimeInMili = moment().format('x')
        if(_.isEmpty(activeTime) || activeTime == 0) {
            userSummary.activeTimeInMillis = this.calculateActiveTime(moment(user.lastLoginTime).format('x'), currentTimeInMili)
        } else {
            userSummary.activeTimeInMillis = activeTime + this.calculateActiveTime(moment(lastSyncWithServer).format('x'), currentTimeInMili);
        }
        console.log('activeTimeInMillisLOL', userSummary.activeTimeInMillis);
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
    getDataToBeSyncedFromDB(transactionIdList, isCalledFromLogout = false) {
        let userExceptionLog = this.getDataFromRealmDB(null, USER_EXCEPTION_LOGS)
        let runSheetSummary = this.getDataFromRealmDB(null, TABLE_RUNSHEET);
        let trackLogs = this.getDataFromRealmDB(null, TABLE_TRACK_LOGS);
        let transactionList = [], fieldDataList = [], jobList = [], serverSmsLogs = [], transactionLogs = [], syncDataDTO;
        if (!transactionIdList) {
            serverSmsLogs = this.getDataFromRealmDB(null, TABLE_SERVER_SMS_LOG);
            return { fieldDataList, transactionList, jobList, serverSmsLogs, runSheetSummary, transactionLogs, trackLogs, userExceptionLog, syncDataDTO };
        }
        let fieldDataQuery, jobTransactionQuery, jobQuery, transactionLogQuery, allowedTransactionIdList = {}, counter = 0
        for (let index in transactionIdList) {
            if (counter == 0) {
                fieldDataQuery = `jobTransactionId = ${transactionIdList[index].id}`;
                jobTransactionQuery = `id = ${transactionIdList[index].id}`;
                jobQuery = `id = ${transactionIdList[index].jobId}`;
                transactionLogQuery = `transactionId = ${transactionIdList[index].id}`;
            }
            //Prepare logs.json for 100 job transactions at a time,in case of sync called from logout,prepare json for all the transactions
            else if (!isCalledFromLogout && counter == 100) {
                break
            }
            else {
                fieldDataQuery += ` OR jobTransactionId = ${transactionIdList[index].id}`;
                jobTransactionQuery += ` OR id = ${transactionIdList[index].id}`;
                jobQuery += ` OR id = ${transactionIdList[index].jobId}`;
                transactionLogQuery += ` OR transactionId = ${transactionIdList[index].id}`;
            }
            allowedTransactionIdList[index] = transactionIdList[index].id
            counter++
        }
        fieldDataList = this.getDataFromRealmDB(fieldDataQuery, TABLE_FIELD_DATA);
        transactionList = this.getDataFromRealmDB(jobTransactionQuery, TABLE_JOB_TRANSACTION);
        jobList = this.getDataFromRealmDB(jobQuery, TABLE_JOB);
        serverSmsLogs = this.getDataFromRealmDB(fieldDataQuery, TABLE_SERVER_SMS_LOG);
        transactionLogs = this.getDataFromRealmDB(transactionLogQuery, TABLE_TRANSACTION_LOGS);
        syncDataDTO = {
            allowedTransactionIdList
        }
        return { fieldDataList, transactionList, jobList, serverSmsLogs, runSheetSummary, transactionLogs, trackLogs, userExceptionLog, syncDataDTO }
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

    getDataFromRealmDB(query, table, calledFromBackup) {
        let data = realm.getRecordListOnQuery(table, query);
        // send id as 0 in case of field data
        if (table == TABLE_FIELD_DATA) {
            let fieldDataList = []
            for (let index in data) {
                let fieldData = { ...data[index] }
                if (fieldData.syncFlag == 1 || calledFromBackup) {
                    fieldData.id = 0
                    fieldDataList.push(_.omit(fieldData, ['syncFlag']))

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
            if (fieldAttribute.attributeTypeId == SIGNATURE || fieldAttribute.attributeTypeId == CAMERA || fieldAttribute.attributeTypeId == CAMERA_HIGH || fieldAttribute.attributeTypeId == CAMERA_MEDIUM || fieldAttribute.attributeTypeId == QC_IMAGE || fieldAttribute.attributeTypeId == SKU_PHOTO) {
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

    calculateActiveTime(previousActiveTime, currentTimeInMili) {
        return (currentTimeInMili - previousActiveTime)
    }

}

export let syncZipService = new SyncZip()
