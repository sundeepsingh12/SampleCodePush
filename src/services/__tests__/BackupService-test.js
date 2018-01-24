'use strict'
import { keyValueDBService } from "../classes/KeyValueDBService";
import { backupService } from "../classes/BackupService";
//import { restAPI } from "../../lib/RestAPI";
import * as realm from '../../repositories/realmdb'
import { error } from "util";
import CONFIG from '../../lib/config'
import RNFS from 'react-native-fs'
import moment from 'moment'
import {
    zip,
    unzip
} from 'react-native-zip-archive'
var PATH = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER;
var PATH_TEMP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/TEMP';
var PATH_BACKUP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/BACKUP';
var PATH_BACKUP_TEMP = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/BACKUPTEMP';
import {
    SIGNATURE,
    CAMERA,
    CAMERA_HIGH,
    CAMERA_MEDIUM,
    SIGNATURE_AND_FEEDBACK
} from '../../lib/AttributeConstants'
import { jobStatusService } from '../../services/classes/JobStatus'
import { logoutService } from '../../services/classes/Logout'
import _ from 'lodash'
import { userEventLogService } from '../../services/classes/UserEvent'
import { jobSummaryService } from '../../services/classes/JobSummary'

describe('test cases for _getSyncDataFromDb', () => {
    it('returns data from db', () => {
        const transactionList = [{
            id: 1,
            statusId: 2
        }]
        const json = {
            fieldData: [],
            job: [],
            jobTransaction: [{
                id: 1,
                statusId: 2
            }],
            jobSummary: [],
            trackLog: [],
            userCommunicationLog: [],
            userEventsLog: [],
            userExceptionLog: [],
            transactionLog: [],
            userSummary: {},
            serverSmsLog: []
        }
        jobSummaryService.getJobSummaryDataOnLastSync = jest.fn()
        jobSummaryService.getJobSummaryDataOnLastSync.mockReturnValue([])
        backupService._getDataFromRealm = jest.fn()
        backupService._getDataFromRealm.mockReturnValue([])
        return backupService._getSyncDataFromDb(transactionList).then((result) => {
            expect(backupService._getDataFromRealm).toHaveBeenCalledTimes(5)
            expect(jobSummaryService.getJobSummaryDataOnLastSync).toHaveBeenCalledTimes(1)
            expect(result).toEqual(JSON.stringify(json))
        })
    })
})
describe('test cases for deleteOldBackup', () => {
    it('does not delete backup for empty list', () => {
        RNFS.readDir = jest.fn()
        RNFS.unlink = jest.fn()
        RNFS.readDir.mockReturnValue([])
        return backupService.deleteOldBackup().then(() => {
            expect(RNFS.unlink).toHaveBeenCalledTimes(0)
        })
    })
    it('deletes backup with date older than 15 days', () => {
        RNFS.unlink = jest.fn()
        RNFS.readDir = jest.fn()
        const dateTimeForBackup = '2018-01-09'
        const backupFilesFromDirectory = [
            {
                name: 'staging-backup_' + dateTimeForBackup + '_div_abc' + '.zip',
                size: 1,
                path: 'xyz'
            }
        ]
        RNFS.readDir.mockReturnValue(backupFilesFromDirectory)

        return backupService.deleteOldBackup().then(() => {
            expect(RNFS.unlink).toHaveBeenCalledTimes(1)
        })
    })
    it('does not delete backup', () => {
        RNFS.unlink = jest.fn()
        RNFS.readDir = jest.fn()
        const dateTimeForBackup = '2018-01-10'
        const backupFilesFromDirectory = [
            {
                name: 'staging-backup_' + dateTimeForBackup + '_div_abc' + '.zip',
                size: 1,
                path: 'xyz'
            }
        ]
        RNFS.readDir.mockReturnValue(backupFilesFromDirectory)

        return backupService.deleteOldBackup().then(() => {
            expect(RNFS.unlink).toHaveBeenCalledTimes(0)
        })
    })
})
describe('test cases for getJsonData', () => {
    it('returns json', () => {
        jobStatusService.getNonDeliveredStatusIds = jest.fn()
        jobStatusService.getNonDeliveredStatusIds.mockReturnValue([1])
        backupService._getDataFromRealm = jest.fn()
        backupService._getSyncDataFromDb = jest.fn()
        return backupService.getJsonData().then(() => {
            expect(jobStatusService.getNonDeliveredStatusIds).toHaveBeenCalledTimes(1)
            expect(backupService._getDataFromRealm).toHaveBeenCalledTimes(1)
            expect(backupService._getSyncDataFromDb).toHaveBeenCalledTimes(1)

        })
    })
})


describe('test cases for createUnsyncBackupIfNeeded', () => {
    it('returns null for empty user', () => {
        return backupService.createUnsyncBackupIfNeeded().then(() => {
        }).catch((error) => {
            expect(error.message).toEqual('user missing')
        })
    })
    it('does not create backup', () => {
        const user = { value: {} }
        const pendingSyncTransactionIds = {}
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(pendingSyncTransactionIds)
        RNFS.mkdir = jest.fn()
        return backupService.createUnsyncBackupIfNeeded(user).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(RNFS.mkdir).toHaveBeenCalledTimes(0)
        })
    })
    it('creates unsync backup on logout', () => {
        const user = { value: {} }
        const pendingSyncTransactionIds = { value: [1, 2] }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(pendingSyncTransactionIds)
        RNFS.mkdir = jest.fn()
        RNFS.unlink = jest.fn()
        backupService.getBackupFileName = jest.fn()
        backupService.getBackupFileName.mockReturnValue('abc')
        return backupService.createUnsyncBackupIfNeeded(user).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(RNFS.mkdir).toHaveBeenCalledTimes(3)
            expect(RNFS.unlink).toHaveBeenCalledTimes(1)
        })
    })
})
describe('test cases for createManualBackup', () => {
    it('returns null for empty user', () => {
        return backupService.createManualBackup().then(() => {
        }).catch((error) => {
            expect(error.message).toEqual('user missing')
        })
    })
    it('creates backup on logout', () => {
        const user = { value: {} }
        RNFS.mkdir = jest.fn()
        backupService.getJsonData = jest.fn()
        backupService.getJsonData.mockReturnValue('test')
        RNFS.writeFile = jest.fn()
        return backupService.createManualBackup(user).then(() => {
            expect(RNFS.mkdir).toHaveBeenCalledTimes(3)
            expect(backupService.getJsonData).toHaveBeenCalledTimes(1)
            expect(RNFS.writeFile).toHaveBeenCalledTimes(1)
        })
    })
    it('creates backup on create manual button press', () => {
        let syncedBackupFiles = {}
        const user = { value: {} }
        RNFS.mkdir = jest.fn()
        RNFS.stat = jest.fn()
        RNFS.stat.mockReturnValue({
            size: 1,
            path: 'test'
        })
        backupService.getJsonData = jest.fn()
        backupService.getJsonData.mockReturnValue('test')
        RNFS.writeFile = jest.fn()
        return backupService.createManualBackup(user, syncedBackupFiles).then(() => {
            expect(RNFS.mkdir).toHaveBeenCalledTimes(3)
            expect(backupService.getJsonData).toHaveBeenCalledTimes(1)
            expect(RNFS.writeFile).toHaveBeenCalledTimes(1)
            expect(RNFS.stat).toHaveBeenCalledTimes(1)
        })
    })
})
describe('test cases for createBackupOnLogout', () => {

    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        backupService.createManualBackup = jest.fn()
        backupService.createUnsyncBackupIfNeeded = jest.fn()
        backupService.deleteOldBackup = jest.fn()
    })

    it('throws error for empty user', () => {
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        return backupService.createBackupOnLogout().then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
        }).catch((error) => {
            expect(error.message).toEqual('user missing')
        })
    })
    it('creates backup on logout', () => {
        const user = { value: {} }
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        return backupService.createBackupOnLogout().then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(backupService.createManualBackup).toHaveBeenCalledTimes(1)
            expect(backupService.createUnsyncBackupIfNeeded).toHaveBeenCalledTimes(1)
            expect(backupService.deleteOldBackup).toHaveBeenCalledTimes(1)

        })
    })
})

describe('test cases for getBackupFilesList', () => {
    it('returns empty files list', () => {
        RNFS.mkdir = jest.fn()
        RNFS.readDir = jest.fn()
        RNFS.readDir.mockReturnValue([])
        const backupFiles = {
            unsyncedBackupFiles: {},
            syncedBackupFiles: {}
        }
        return backupService.getBackupFilesList().then((result) => {
            expect(RNFS.mkdir).toHaveBeenCalledTimes(1)
            expect(RNFS.readDir).toHaveBeenCalledTimes(1)
            expect(result).toEqual(backupFiles)
        })
    })
    it('returns unsynced backup file', () => {
        RNFS.mkdir = jest.fn()
        RNFS.readDir = jest.fn()
        const dateTimeForBackup = '2018-01-02'
        const user = {
            company: {
                code: 'abc'
            }
        }
        const backupFilesFromDirectory = [
            {
                name: 'staging-UnSyncbackup_' + dateTimeForBackup + '_div_abc' + '.zip',
                size: 1,
                path: 'xyz'
            }
        ]
        RNFS.readDir.mockReturnValue(backupFilesFromDirectory)
        const unsyncedBackupFiles = {}
        unsyncedBackupFiles[-1] = {
            id: -1,
            isNew: false,
            name: 'staging-UnSyncbackup_' + dateTimeForBackup + '_div_abc' + '.zip',
            size: 0,
            path: 'xyz',
            creationDate: '2018-01-02',
            employeeCode: 'div_abc'

        }
        const backupFiles = {
            unsyncedBackupFiles,
            syncedBackupFiles: {}
        }
        return backupService.getBackupFilesList(user).then((result) => {
            expect(RNFS.mkdir).toHaveBeenCalledTimes(1)
            expect(RNFS.readDir).toHaveBeenCalledTimes(1)
            expect(result).toEqual(backupFiles)
        })
    })
    it('returns synced backup file', () => {
        RNFS.mkdir = jest.fn()
        RNFS.readDir = jest.fn()
        const dateTimeForBackup = '2018-01-02'
        const user = {
            company: {
                code: 'abc'
            }
        }
        const backupFilesFromDirectory = [
            {
                name: 'staging-backup_' + dateTimeForBackup + '_div_abc' + '.zip',
                size: 1,
                path: 'xyz'
            }
        ]
        RNFS.readDir.mockReturnValue(backupFilesFromDirectory)
        const syncedBackupFiles = {}
        syncedBackupFiles[1] = {
            id: 1,
            isNew: false,
            name: 'staging-backup_' + dateTimeForBackup + '_div_abc' + '.zip',
            size: 0,
            path: 'xyz',
            creationDate: '2018-01-02',
            employeeCode: 'div_abc'

        }
        const backupFiles = {
            unsyncedBackupFiles: {},
            syncedBackupFiles
        }
        return backupService.getBackupFilesList(user).then((result) => {
            expect(RNFS.mkdir).toHaveBeenCalledTimes(1)
            expect(RNFS.readDir).toHaveBeenCalledTimes(1)
            expect(result).toEqual(backupFiles)
        })
    })

})

describe('test cases for setBackupFileDto', () => {
    const fileName = 'abc.zip'
    const creationDate = '2017', size = 1, path = 'data/data', employeeCode = 123, id = 1, isNew = true
    const syncedBackupFile = {
        name: fileName,
        creationDate,
        size: +(Math.round(size / 1024 + "e+2") + "e-2"),
        path,
        employeeCode,
        id,
        isNew,
    }
    it('should return backup file dto', () => {
        expect(backupService.setBackupFileDto(fileName, creationDate, size, path, employeeCode, id, isNew)).toEqual(syncedBackupFile)
    })
})

describe('test cases for _getDataFromRealm', () => {
    beforeEach(() => {
        realm.getRecordListOnQuery = jest.fn()
    })
    it('should return data type for null data type', () => {
        expect(backupService._getDataFromRealm(null, 'abc', null)).toEqual(undefined)
    })
    // it('should return object for object data type', () => {
    //     const data = {
    //         id: 1
    //     }
    //     realm.getRecordListOnQuery.mockReturnValue(data)
    //     expect(backupService._getDataFromRealm({}, 'abc', 'table')).toEqual([])
    // })
})

describe('test cases for deleteBackupFile', () => {
    const index = 1
    const files = {
        1: {
            path: 'xyz'
        }
    }
    it('does not delete backup for empty map', () => {
        RNFS.unlink = jest.fn()

        return backupService.deleteBackupFile(null, files).then(() => {
            expect(RNFS.unlink).toHaveBeenCalledTimes(0)
        })
    })
    it('deletes backup', () => {
        RNFS.unlink = jest.fn()

        return backupService.deleteBackupFile(index, files).then(() => {
            expect(RNFS.unlink).toHaveBeenCalledTimes(1)
        })
    })
    it('throws error', () => {
        RNFS.unlink = jest.fn()

        return backupService.deleteBackupFile().then(() => {
            expect(RNFS.unlink).toHaveBeenCalledTimes(0)
        })
    })
})



describe('test cases for moveImageFilesToBackup', () => {
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
    })
    it('returns null for null field attributes from store', () => {
        keyValueDBService.getValueFromStore.mockReturnValue(null)

        return backupService.moveImageFilesToBackup().then((result) => {
            expect(result).toEqual(undefined)
        })
    })
    it('does not move image present in field data when file doen not exist', () => {
        const fieldAtrributes = {
            value: [
                {
                    id: 1,
                    attributeTypeId: 42
                }
            ]
        }
        keyValueDBService.getValueFromStore.mockReturnValue(fieldAtrributes)
        const fieldData = [{
            fieldAttributeMasterId: 1,
            value: 'xyz.zip'
        }]
        RNFS.exists = jest.fn()
        RNFS.exists.mockReturnValue(false)
        return backupService.moveImageFilesToBackup(fieldData).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(RNFS.exists).toHaveBeenCalledTimes(1)
        })
    })
    it('moves image present in field data', () => {
        const fieldAtrributes = {
            value: [
                {
                    id: 1,
                    attributeTypeId: 42
                }
            ]
        }
        keyValueDBService.getValueFromStore.mockReturnValue(fieldAtrributes)
        const fieldData = [{
            fieldAttributeMasterId: 1,
            value: 'xyz.zip'
        }]
        RNFS.exists = jest.fn()
        RNFS.exists.mockReturnValue(true)
        RNFS.copyFile = jest.fn()

        return backupService.moveImageFilesToBackup(fieldData).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(RNFS.exists).toHaveBeenCalledTimes(1)
            expect(RNFS.copyFile).toHaveBeenCalledTimes(1)
        })
    })
})