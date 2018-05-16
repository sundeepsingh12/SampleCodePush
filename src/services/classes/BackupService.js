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
    BACKUP_ALREADY_EXIST,
    DOMAIN_URL,
    JOB_SUMMARY
} from '../../lib/constants'
import { userEventLogService } from './UserEvent'
import { jobSummaryService } from './JobSummary'
import { keyValueDBService } from './KeyValueDBService'
import CONFIG from '../../lib/config'
import RNFS from 'react-native-fs'
import moment from 'moment'
import {
    zip,
} from 'react-native-zip-archive'
import _ from 'lodash'
import { syncZipService } from './SyncZip'
import {
    USER_MISSING,
    BACKUP_CREATED_SUCCESS_TOAST,
    BACKUP_ALREADY_EXISTS,
    TRANSACTIONLIST_IS_MISSING
} from '../../lib/ContainerConstants'
var PATH = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER;
var PATH_TEMP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/TEMP';
var PATH_BACKUP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/BACKUP';
var PATH_BACKUP_TEMP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/BACKUPTEMP';

class Backup {
    /**
     * This method creates backup on logout.
     */
    async createBackupOnLogout() {
        let user = await keyValueDBService.getValueFromStore(USER)
        let domainUrl = await keyValueDBService.getValueFromStore(DOMAIN_URL)
        if (!user || !user.value || !domainUrl || !domainUrl.value) throw new Error(USER_MISSING)
        await this.createSyncedBackup(user, domainUrl.value) // it creates backup of synced files.
        await this.createUnsyncBackupIfNeeded(user, domainUrl.value) // it creates backup of unsynced files if required.
        await this.deleteOldBackup() // it will delete backup older than 15 days.
        await keyValueDBService.validateAndSaveData(BACKUP_ALREADY_EXIST, new Boolean(true))
    }
    async createUnsyncBackupIfNeeded(user, url) {
        let pendingSyncTransactionIds = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
        let isUnsyncTransactionPresent = await logoutService.checkForUnsyncTransactions(pendingSyncTransactionIds)
        if (isUnsyncTransactionPresent) {
            let backupFileName = this.getBackupFileName(user.value, true, url)
            let syncFilePath = PATH + '/sync.zip'
            RNFS.mkdir(PATH);
            RNFS.mkdir(PATH_BACKUP);
            let fileExits = await RNFS.exists(syncFilePath)
            if (fileExits) {
                await RNFS.copyFile(syncFilePath, PATH_BACKUP + '/' + backupFileName)
            }
        }
    }
    /**
     * 
     * @param {*} user 
     */
    async createSyncedBackup(user, url) {
        RNFS.mkdir(PATH);
        RNFS.mkdir(PATH_BACKUP);
        RNFS.mkdir(PATH_BACKUP_TEMP);
        let json = await this.getJsonData(user.value.lastLoginTime) // This will fetch jsondata after the lastLoginTime.
        if (!json) return
        //Writing Object to File at TEMP location
        await RNFS.writeFile(PATH_BACKUP_TEMP + '/logs.json', json, 'utf8');
        const backupFileName = this.getBackupFileName(user.value, false, url) // this will get the backup file name.
        //Creating ZIP file
        const targetPath = PATH_BACKUP + '/' + backupFileName
        const sourcePath = PATH_BACKUP_TEMP
        await zip(sourcePath, targetPath);
        await RNFS.unlink(PATH_BACKUP_TEMP)
        return backupFileName
    }
    /**
     * 
     * @param {*} user user details
     * @param {*} syncedBackupFiles lists of synced files
     */
    async createManualBackup(user, syncedBackupFiles) {
        let shouldCreateBackup = await keyValueDBService.getValueFromStore(BACKUP_ALREADY_EXIST) // if BACKUP_ALREADY_EXIST is true it means that backup already exists and no other backup will be created.
        if (shouldCreateBackup && shouldCreateBackup.value) {
            return { syncedBackupFiles, toastMessage: BACKUP_ALREADY_EXISTS }
        }
        let domainUrl = await keyValueDBService.getValueFromStore(DOMAIN_URL)
        if (!user || !user.value || !domainUrl || !domainUrl.value) throw new Error(USER_MISSING)
        let backupFileName = await this.createSyncedBackup(user, domainUrl.value) // will create backup of synced files.
        if (syncedBackupFiles) {
            var stat = await RNFS.stat(PATH_BACKUP + '/' + backupFileName);
            let fileNameArray = backupFileName.split('_')
            let id = _.size(syncedBackupFiles) + 1
            let syncedBackupFile = this.setBackupFileDto(backupFileName, fileNameArray[1], stat.size, stat.path, user.value.employeeCode, id, true) //This method make a dto of backup files.
            syncedBackupFiles[id] = syncedBackupFile
            await keyValueDBService.validateAndSaveData(BACKUP_ALREADY_EXIST, new Boolean(true))
            return { syncedBackupFiles, toastMessage: BACKUP_CREATED_SUCCESS_TOAST }
        }
    }

    /**Function to set the backup file name using employee code and current date time
     * 
     * @param {*} user 
     * @param {*} isUnsyncBackup 
     */
    getBackupFileName(user, isUnsyncBackup, url) {
        const domain = url.split('//')[1].split('.')[0]
        const dateTimeForBackup = moment().format('YYYY-MM-DD HH-mm-ss')
        let backupFileName = (!isUnsyncBackup) ? domain + '-backup_' + dateTimeForBackup + '_' + user.employeeCode + '.zip' : domain + '-UnSyncbackup_' + dateTimeForBackup + '_' + user.employeeCode + '.zip' // Backup file particular format
        return backupFileName
    }

    /**Function to get json to be saved in backup
     * 
     * @param {*} dateTime 
     */
    async getJsonData(dateTime) {
        let statusIdForDeliveredCode = await jobStatusService.getNonDeliveredStatusIds() // get all job status for code DELIVERED.
        if (!statusIdForDeliveredCode) return
        let transactionQuery = statusIdForDeliveredCode.map(statusId => 'jobStatusId = ' + statusId).join(' OR ')
        let transactionList = syncZipService.getDataFromRealmDB(transactionQuery, TABLE_JOB_TRANSACTION);
        let json = await this._getSyncDataFromDb(transactionList, dateTime)
        return json
    }
    /** This will get sync data from DB.
     * 
     * @param {*} transactionList 
     * @param {*} dateTime 
     */
    async  _getSyncDataFromDb(transactionList, dateTime) {
        if (!transactionList) throw new Error(TRANSACTIONLIST_IS_MISSING)
        var BACKUP_JSON = {};
        let fieldDataList = [],
            jobList = [],
            serverSmsLogs = [],
            transactionLogs = [],
            trackLogs = []
        let fieldDataQuery = transactionList.map(transaction => 'jobTransactionId = ' + transaction.id).join(' OR ')
        fieldDataList = syncZipService.getDataFromRealmDB(fieldDataQuery, TABLE_FIELD_DATA);
        let jobIdQuery = transactionList.map(jobTransaction => jobTransaction.jobId).map(jobId => 'id = ' + jobId).join(' OR '); // first find jobIds using map and then make a query for job table
        jobList = syncZipService.getDataFromRealmDB(jobIdQuery, TABLE_JOB);
        serverSmsLogs = syncZipService.getDataFromRealmDB(null, TABLE_SERVER_SMS_LOG);
        let transactionLogsQuery = transactionList.map(jobTransaction => 'transactionId = ' + jobTransaction.id).join(' OR ')
        transactionLogs = syncZipService.getDataFromRealmDB(transactionLogsQuery, TABLE_TRANSACTION_LOGS);
        trackLogs = syncZipService.getDataFromRealmDB(null, TABLE_TRACK_LOGS);
        await syncZipService.moveImageFilesToSync(fieldDataList, PATH_BACKUP_TEMP)
        BACKUP_JSON.fieldData = fieldDataList
        BACKUP_JSON.job = jobList
        BACKUP_JSON.jobTransaction = transactionList
        const alljobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
        const jobSummaryListValue = alljobSummaryList ? alljobSummaryList.value : null
        let jobSummary = jobSummaryService.getJobSummaryListForSync(jobSummaryListValue, dateTime)
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
    /** This method fetches backup files list
     * 
     * @param {*} user 
     */
    async getBackupFilesList(user, url) {
        let syncedBackupFiles = {}
        let unsyncedBackupFiles = {}
        let syncedIndex = 1, unSyncedIndex = -1
        RNFS.mkdir(PATH_BACKUP);
        let backUpFilesInfo = await RNFS.readDir(PATH_BACKUP)
        for (let backUpFile in backUpFilesInfo) {
            let fileName = backUpFilesInfo[backUpFile].name
            const domain = url.split('//')[1].split('.')[0]
            let fileNameArray = fileName.split('_')
            let fileDomainInfo = fileNameArray[0]
            let employeeCode = fileName.substring(fileName.indexOf(fileNameArray[2]), _.size(fileName) - 4)
            if (fileDomainInfo.split('-')[0] == domain && employeeCode.split('_')[1] == user.company.code) {
                if (fileDomainInfo.split('-')[1] == 'backup') {
                    let syncedBackupFile = this.setBackupFileDto(fileName, fileNameArray[1], backUpFilesInfo[backUpFile].size, backUpFilesInfo[backUpFile].path, employeeCode, syncedIndex, false) //This method make a dto of backup files.
                    syncedBackupFiles[syncedIndex] = syncedBackupFile
                    syncedIndex++
                } else if (fileDomainInfo.split('-')[1] == 'UnSyncbackup') {
                    let syncedBackupFile = this.setBackupFileDto(fileName, fileNameArray[1], backUpFilesInfo[backUpFile].size, backUpFilesInfo[backUpFile].path, employeeCode, unSyncedIndex, false) //This method make a dto of backup files.
                    unsyncedBackupFiles[unSyncedIndex] = syncedBackupFile
                    unSyncedIndex--
                }
            }
        }
        return { unsyncedBackupFiles, syncedBackupFiles }
    }
    /** This method make a dto of backup files.
     * 
     * @param {*} fileName 
     * @param {*} creationDate 
     * @param {*} size 
     * @param {*} path 
     * @param {*} employeeCode 
     * @param {*} id 
     * @param {*} isNew if the backup is new or not.
     */
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
    /** this method will delete backup file.
     * 
     * @param {*} index 
     * @param {*} filesMap 
     * @param {*} path 
     */
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
    /**
     * this will delete old backup.
     */
    async deleteOldBackup() {
        let backupFilesList = await RNFS.readDir(PATH_BACKUP)
        for (let backUpFile in backupFilesList) {
            let backupDate = backupFilesList[backUpFile].name.split('_')[1].split(' ')[0]
            let currentDate = moment().format('YYYY-MM-DD')
            if (moment(currentDate).diff(backupDate, 'days') >= 15) {
                await RNFS.unlink(backupFilesList[backUpFile].path)
            }
        }
    }
    /** This method will check for unsync Backup.
     * 
     * @param {*} user 
     */
    async checkForUnsyncBackup(user) {
        let unsyncBackupFilesList = []
        let domainUrl = await keyValueDBService.getValueFromStore(DOMAIN_URL)
        if (!user || !user.value || !domainUrl || !domainUrl.value) return unsyncBackupFilesList
        RNFS.mkdir(PATH_BACKUP);
        let backUpFilesInfo = await RNFS.readDir(PATH_BACKUP)
        for (let backUpFile in backUpFilesInfo) {
            let fileName = backUpFilesInfo[backUpFile].name
            const domain = domainUrl.value.split('//')[1].split('.')[0]
            let fileNameArray = fileName.split('_')
            let fileDomainInfo = fileNameArray[0]
            let employeeCode = fileName.substring(fileName.indexOf(fileNameArray[2]), _.size(fileName) - 4)
            if (fileDomainInfo.split('-')[0] == domain && employeeCode.split('_')[1] == user.value.company.code) {
                if (fileDomainInfo.split('-')[1] == 'UnSyncbackup') {
                    unsyncBackupFilesList.push(backUpFilesInfo[backUpFile])
                }
            }
        }
        return unsyncBackupFilesList
    }
}

export let backupService = new Backup()