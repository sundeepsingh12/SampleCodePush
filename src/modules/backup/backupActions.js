'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import {
    USER,
    SET_LOADER_BACKUP,
    SET_BACKUP_FILES,
    SET_BACKUP_VIEW,
    SET_UPLOADING_FILE,
    SET_SYNCED_FILES
} from '../../lib/constants'
import { } from '../../lib/AttributeConstants'
import _ from 'lodash'
import { setState } from '../global/globalActions'
import { backupService } from '../../services/classes/BackupService'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'

export function createManualBackup(syncedBackupFiles) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_BACKUP, true))
            const user = await keyValueDBService.getValueFromStore(USER)
            if (!user || !user.value) throw new Error('User Missing')
            let backupFiles = JSON.parse(JSON.stringify(syncedBackupFiles))
            let backupFilesAndToastMessage = await backupService.createManualBackup(user, backupFiles)
            if (backupFilesAndToastMessage) {
                dispatch(setState(SET_SYNCED_FILES, backupFilesAndToastMessage))
            }
            //dispatch(setState(SET_LOADER_BACKUP, false))
        } catch (error) {
            dispatch(setState(SET_LOADER_BACKUP, false))
        }
    }
}

export function getBackupList() {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_BACKUP, true))
            const user = await keyValueDBService.getValueFromStore(USER)
            if (!user || !user.value) throw new Error('User Missing')
            let backupFiles = await backupService.getBackupFilesList(user.value)
            dispatch(setState(SET_BACKUP_FILES, backupFiles))
        } catch (error) {
            dispatch(setState(SET_LOADER_BACKUP, false))
        }
    }
}
export function uploadBackupFile(index, filesMap) {
    return async function (dispatch) {
        try {
            if (!filesMap[index]) throw new Error('File Missing')
            dispatch(setState(SET_UPLOADING_FILE, filesMap[index]))
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            if (!token) {
                throw new Error('Token Missing')
            }
            let responseBody = await RestAPIFactory(token.value).uploadZipFile(filesMap[index].path, filesMap[index].name)
            //console.log('tset', responseBody)
            if (responseBody && responseBody.split(",")[0] == 'success') {
                dispatch(setState(SET_BACKUP_VIEW, 2))
                if (index < 0) {
                    dispatch(deleteBackupFile(index, filesMap))
                }
            } else {
                dispatch(setState(SET_BACKUP_VIEW, 3))
            }
        } catch (error) {
            console.log(error)
            dispatch(setState(SET_BACKUP_VIEW, 3))
        }
    }
}
export function deleteBackupFile(index, filesMap) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_BACKUP, true))
            if (!filesMap[index]) throw new Error('File Missing')
            const user = await keyValueDBService.getValueFromStore(USER)
            if (!user || !user.value) throw new Error('User Missing')
            await backupService.deleteBackupFile(index, filesMap)
            let backupFiles = await backupService.getBackupFilesList(user.value)
            dispatch(setState(SET_BACKUP_FILES, backupFiles))
        } catch (error) {
            dispatch(setState(SET_LOADER_BACKUP, false))
        }
    }
}