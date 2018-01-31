'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import {
    USER,
    SET_LOADER_BACKUP,
    SET_BACKUP_FILES,
    SET_BACKUP_VIEW,
    SET_UPLOADING_FILE,
    SET_SYNCED_FILES,
    LoginScreen,
    SET_BACKUP_UPLOAD_VIEW
} from '../../lib/constants'
import { } from '../../lib/AttributeConstants'
import _ from 'lodash'
import { setState, deleteSessionToken } from '../global/globalActions'
import { backupService } from '../../services/classes/BackupService'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import { logoutService } from '../../services/classes/Logout'
import { preLogoutRequest, preLogoutSuccess, } from '../pre-loader/preloaderActions'
import { NavigationActions } from 'react-navigation'
import { authenticationService } from '../../services/classes/Authentication'
import {
    USER_MISSING,
    TOKEN_MISSING,
    FILE_MISSING,
} from '../../lib/ContainerConstants'
export function createManualBackup(syncedBackupFiles) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_BACKUP, true))
            const user = await keyValueDBService.getValueFromStore(USER)
            if (!user || !user.value) throw new Error(USER_MISSING)
            let backupFiles = JSON.parse(JSON.stringify(syncedBackupFiles))
            let backupFilesAndToastMessage = await backupService.createManualBackup(user, backupFiles)
            if (backupFilesAndToastMessage) {
                dispatch(setState(SET_SYNCED_FILES, backupFilesAndToastMessage))
            }
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
            if (!user || !user.value) throw new Error(USER_MISSING)
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
            if (!filesMap[index]) throw new Error(FILE_MISSING)
            dispatch(setState(SET_UPLOADING_FILE, filesMap[index]))
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            if (!token) {
                throw new Error(TOKEN_MISSING)
            }
            let responseBody = await RestAPIFactory(token.value).uploadZipFile(filesMap[index].path, filesMap[index].name)
            if (responseBody && responseBody.split(",")[0] == 'success') {
                dispatch(setState(SET_BACKUP_VIEW, 2))
                if (index < 0) {
                    dispatch(deleteBackupFile(index, filesMap))
                }
                setTimeout(() => {
                    dispatch(autoLogoutAfterUpload())
                }, 1000)
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
            if (!filesMap[index]) throw new Error(FILE_MISSING)
            const user = await keyValueDBService.getValueFromStore(USER)
            if (!user || !user.value) throw new Error(USER_MISSING)
            await backupService.deleteBackupFile(index, filesMap)
            let backupFiles = await backupService.getBackupFilesList(user.value)
            dispatch(setState(SET_BACKUP_FILES, backupFiles))
        } catch (error) {
            dispatch(setState(SET_LOADER_BACKUP, false))
        }
    }
}

export function autoLogoutAfterUpload(calledFromHome) {
    return async function (dispatch) {
        try {
            if (!calledFromHome) {
                dispatch(setState(SET_BACKUP_VIEW, 4))
            } else {
                dispatch(setState(SET_BACKUP_UPLOAD_VIEW, 3))
            }
            dispatch(preLogoutRequest())
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            await backupService.createBackupOnLogout()
            await authenticationService.logout(token)
            await logoutService.deleteDataBase()
            dispatch(preLogoutSuccess())
            dispatch(NavigationActions.navigate({ routeName: LoginScreen }))
            dispatch(deleteSessionToken())
        } catch (error) {
            console.log(error)
            dispatch(setState(SET_BACKUP_VIEW, 0))
        }
    }
}