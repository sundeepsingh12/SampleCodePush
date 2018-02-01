'use strict'
import { jobStatusService } from '../../services/classes/JobStatus'
import { logoutService } from '../../services/classes/Logout'
import * as realm from '../../repositories/realmdb'
import {
    TABLE_TRACK_LOGS,
    USER_SUMMARY,
    TABLE_FIELD_DATA,
    TABLE_JOB_TRANSACTION,
    TABLE_JOB,
    TABLE_SERVER_SMS_LOG,
    TABLE_RUNSHEET,
    TABLE_TRANSACTION_LOGS,
    FIELD_ATTRIBUTE,
    USER,
    PENDING_SYNC_TRANSACTION_IDS,
    SHOULD_CREATE_BACKUP
} from '../../lib/constants'
import { userEventLogService } from './UserEvent'
import { jobSummaryService } from './JobSummary'
import { keyValueDBService } from './KeyValueDBService'
import CONFIG from '../../lib/config'
import RNFS from 'react-native-fs'
import moment from 'moment'
import {
    zip,
    unzip
} from 'react-native-zip-archive'
import _ from 'lodash'
import { moveImageFilesToSync, _getDataFromRealm } from './SyncZip'
import {
    USER_MISSING,
    BACKUP_CREATED_SUCCESS_TOAST,
    BACKUP_ALREADY_EXISTS
} from '../../lib/ContainerConstants'
var PATH = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER;
var PATH_TEMP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/TEMP';
var PATH_BACKUP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/BACKUP';
var PATH_BACKUP_TEMP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/BACKUPTEMP';

class Backup {
    async createBackupOnLogout() {
        let user = await keyValueDBService.getValueFromStore(USER)
        await this.createSyncedBackup(user)
        await this.createUnsyncBackupIfNeeded(user)
        await this.deleteOldBackup()
        await keyValueDBService.validateAndSaveData(SHOULD_CREATE_BACKUP, new Boolean(true))
    }
    async createUnsyncBackupIfNeeded(user) {
        if (!user || !user.value) throw new Error(USER_MISSING)
        let pendingSyncTransactionIds = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
        let isUnsyncTransactionPresent = await logoutService.checkForUnsyncTransactions(pendingSyncTransactionIds)
        if (isUnsyncTransactionPresent) {
            let backupFileName = this.getBackupFileName(user.value, true)
            let syncFilePath = PATH + '/sync.zip'
            RNFS.mkdir(PATH);
            RNFS.mkdir(PATH_BACKUP);
            RNFS.mkdir(PATH_BACKUP_TEMP);
            await unzip(syncFilePath, PATH_BACKUP_TEMP)
            const targetPath = PATH_BACKUP + '/' + backupFileName
            const sourcePath = PATH_BACKUP_TEMP
            await zip(sourcePath, targetPath);
            await RNFS.unlink(PATH_BACKUP_TEMP)
        }
    }
    async createSyncedBackup(user) {
        if (!user || !user.value) throw new Error(USER_MISSING)
        RNFS.mkdir(PATH);
        RNFS.mkdir(PATH_BACKUP);
        RNFS.mkdir(PATH_BACKUP_TEMP);
        let json = await this.getJsonData(user.value.lastLoginTime)
        if (!json) return
        //Writing Object to File at TEMP location
        await RNFS.writeFile(PATH_BACKUP_TEMP + '/logs.json', json, 'utf8');
        const backupFileName = this.getBackupFileName(user.value)
        //Creating ZIP file
        const targetPath = PATH_BACKUP + '/' + backupFileName
        const sourcePath = PATH_BACKUP_TEMP
        await zip(sourcePath, targetPath);
        await RNFS.unlink(PATH_BACKUP_TEMP)
        return backupFileName
    }
    async createManualBackup(user, syncedBackupFiles) {
        let shouldCreateBackup = await keyValueDBService.getValueFromStore(SHOULD_CREATE_BACKUP)
        if (shouldCreateBackup && shouldCreateBackup.value) {
            return { syncedBackupFiles, toastMessage: BACKUP_ALREADY_EXISTS }
        }
        let backupFileName = await this.createSyncedBackup(user)
        if (syncedBackupFiles) {
            var stat = await RNFS.stat(PATH_BACKUP + '/' + backupFileName);
            let fileNameArray = backupFileName.split('_')
            let id = _.size(syncedBackupFiles) + 1
            let syncedBackupFile = this.setBackupFileDto(backupFileName, fileNameArray[1], stat.size, stat.path, user.value.employeeCode, id, true)
            syncedBackupFiles[id] = syncedBackupFile
            await keyValueDBService.validateAndSaveData(SHOULD_CREATE_BACKUP, new Boolean(true))
            return { syncedBackupFiles, toastMessage: BACKUP_CREATED_SUCCESS_TOAST }
        }
    }
    getBackupFileName(user, isUnsyncBackup) {
        const domain = CONFIG.FAREYE.staging.url.split('//')[1].split('.')[0]
        const dateTimeForBackup = moment().format('YYYY-MM-DD HH-mm-ss')
        let backupFileName = (!isUnsyncBackup) ? domain + '-backup_' + dateTimeForBackup + '_' + user.employeeCode + '.zip' : domain + '-UnSyncbackup_' + dateTimeForBackup + '_' + user.employeeCode + '.zip'
        return backupFileName
    }
    async getJsonData(dateTime) {
        let statusIdForDeliveredCode = await jobStatusService.getNonDeliveredStatusIds()
        let transactionQuery = statusIdForDeliveredCode.map(statusId => 'jobStatusId = ' + statusId).join(' OR ')
        let transactionList = _getDataFromRealm([], transactionQuery, TABLE_JOB_TRANSACTION);
        let json = await this._getSyncDataFromDb(transactionList, dateTime)
        return json
    }
    async  _getSyncDataFromDb(transactionList, dateTime) {
        var BACKUP_JSON = {};
        let fieldDataList = [],
            jobList = [],
            serverSmsLogs = [],
            transactionLogs = [],
            trackLogs = []
        let fieldDataQuery = transactionList.map(transaction => 'jobTransactionId = ' + transaction.id).join(' OR ')
        fieldDataList = _getDataFromRealm([], fieldDataQuery, TABLE_FIELD_DATA);
        let jobIdQuery = transactionList.map(jobTransaction => jobTransaction.jobId).map(jobId => 'id = ' + jobId).join(' OR '); // first find jobIds using map and then make a query for job table
        jobList = _getDataFromRealm([], jobIdQuery, TABLE_JOB);
        serverSmsLogs = _getDataFromRealm([], null, TABLE_SERVER_SMS_LOG);
        let transactionLogsQuery = transactionList.map(jobTransaction => 'transactionId = ' + jobTransaction.id).join(' OR ')
        transactionLogs = _getDataFromRealm([], transactionLogsQuery, TABLE_TRANSACTION_LOGS);
        trackLogs = _getDataFromRealm([], null, TABLE_TRACK_LOGS);
        await moveImageFilesToSync(fieldDataList, PATH_BACKUP_TEMP)
        BACKUP_JSON.fieldData = fieldDataList
        BACKUP_JSON.job = jobList
        BACKUP_JSON.jobTransaction = transactionList
        let jobSummary = await jobSummaryService.getJobSummaryDataOnLastSync(dateTime)
        BACKUP_JSON.jobSummary = jobSummary || {}
        BACKUP_JSON.trackLog = trackLogs
        BACKUP_JSON.userCommunicationLog = [];
        BACKUP_JSON.userEventsLog = await userEventLogService.getUserEventLog(dateTime)
        BACKUP_JSON.userExceptionLog = [];
        BACKUP_JSON.transactionLog = transactionLogs;
        let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
        BACKUP_JSON.userSummary = (userSummary && userSummary.value) ? userSummary.value : {}
        BACKUP_JSON.serverSmsLog = serverSmsLogs
        return JSON.stringify(BACKUP_JSON)
    }
    async getBackupFilesList(user) {
        let syncedBackupFiles = {}
        let unsyncedBackupFiles = {}
        let syncedIndex = 1, unSyncedIndex = -1
        RNFS.mkdir(PATH_BACKUP);
        let backUpFilesInfo = await RNFS.readDir(PATH_BACKUP)
        for (let backUpFile of backUpFilesInfo) {
            let fileName = backUpFile.name
            const domain = CONFIG.FAREYE.staging.url.split('//')[1].split('.')[0]
            let fileNameArray = fileName.split('_')
            let fileDomainInfo = fileNameArray[0]
            let employeeCode = fileName.substring(fileName.indexOf(fileNameArray[2]), _.size(fileName) - 4)
            if (fileDomainInfo.split('-')[0] == domain && employeeCode.split('_')[1] == user.company.code) {
                if (fileDomainInfo.split('-')[1] == 'backup') {
                    let syncedBackupFile = this.setBackupFileDto(fileName, fileNameArray[1], backUpFile.size, backUpFile.path, employeeCode, syncedIndex, false)
                    syncedBackupFiles[syncedIndex] = syncedBackupFile
                    syncedIndex++
                } else if (fileDomainInfo.split('-')[1] == 'UnSyncbackup') {
                    let syncedBackupFile = this.setBackupFileDto(fileName, fileNameArray[1], backUpFile.size, backUpFile.path, employeeCode, unSyncedIndex, false)
                    unsyncedBackupFiles[unSyncedIndex] = syncedBackupFile
                    unSyncedIndex--
                }
            }
        }
        return { unsyncedBackupFiles, syncedBackupFiles }
    }
    setBackupFileDto(fileName, creationDate, size, path, employeeCode, id, isNew) {
        let syncedBackupFile = {}
        syncedBackupFile.name = fileName
        syncedBackupFile.creationDate = creationDate
        syncedBackupFile.size = +(Math.round(size / 1024 + "e+2") + "e-2")
        syncedBackupFile.path = path
        syncedBackupFile.employeeCode = employeeCode
        syncedBackupFile.id = id
        syncedBackupFile.isNew = isNew
        return syncedBackupFile
    }
    async deleteBackupFile(index, filesMap, path) {
        try {
            if (filesMap && filesMap[index]) {
                await RNFS.unlink(filesMap[index].path)
            } else if (path) {
                await RNFS.unlink(path)
            }
        } catch (error) {
            console.log(error)
        }
    }
    async deleteOldBackup() {
        let backupFilesList = await RNFS.readDir(PATH_BACKUP)
        for (let backUpFile of backupFilesList) {
            let backupDate = backUpFile.name.split('_')[1].split(' ')[0]
            let currentDate = moment().format('YYYY-MM-DD')
            if (moment(currentDate).diff(backupDate, 'days') >= 15) {
                await RNFS.unlink(backUpFile.path)
            }
        }
    }
    async checkForUnsyncBackup(user) {
        let unsyncBackupFilesList = []
        if (!user || !user.value) return unsyncBackupFilesList
        RNFS.mkdir(PATH_BACKUP);
        let backUpFilesInfo = await RNFS.readDir(PATH_BACKUP)
        for (let backUpFile of backUpFilesInfo) {
            let fileName = backUpFile.name
            const domain = CONFIG.FAREYE.staging.url.split('//')[1].split('.')[0]
            let fileNameArray = fileName.split('_')
            let fileDomainInfo = fileNameArray[0]
            let employeeCode = fileName.substring(fileName.indexOf(fileNameArray[2]), _.size(fileName) - 4)
            if (fileDomainInfo.split('-')[0] == domain && employeeCode.split('_')[1] == user.value.company.code) {
                if (fileDomainInfo.split('-')[1] == 'UnSyncbackup') {
                    unsyncBackupFilesList.push(backUpFile)
                }
            }
        }
        return unsyncBackupFilesList
    }
}

export let backupService = new Backup()