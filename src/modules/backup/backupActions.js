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
    SOME_PROCESS_ARE_STILL_WORKING,
    PLEASE_RE_TRY_AFTER_FEW_MINUTES,
    LOGOUT_UNSUCCESSFUL,
    OK,
} from '../../lib/ContainerConstants'
import { Toast } from 'native-base'
import moment from 'moment'

/** This methodd creates backup manually when button is pressed.
 * 
 * @param {*} syncedBackupFiles // list of synced files.
 */
export function createManualBackup(syncedBackupFiles) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_BACKUP, true))
            const user = await keyValueDBService.getValueFromStore(USER)
            if (!user || !user.value) throw new Error(USER_MISSING)
            let backupFiles = JSON.parse(JSON.stringify(syncedBackupFiles))
            let backupFilesAndToastMessage = await backupService.createManualBackup(user, backupFiles) // This service will create backup manually.
            if (backupFilesAndToastMessage) {
                dispatch(setState(SET_SYNCED_FILES, backupFilesAndToastMessage))
            }
        } catch (error) {
            dispatch(setState(SET_LOADER_BACKUP, false)) // to do add exception logs
        }
    }
}

/**
 * this method fetches list of backup.
 */
export function getBackupList() {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_BACKUP, true))
            const user = await keyValueDBService.getValueFromStore(USER)
            if (!user || !user.value) throw new Error(USER_MISSING)
            let backupFiles = await backupService.getBackupFilesList(user.value) // this method gets backup files list from service
            dispatch(setState(SET_BACKUP_FILES, backupFiles))
        } catch (error) {
            dispatch(setState(SET_LOADER_BACKUP, false))// to do add exception logs
        }
    }
}
/** this method will upload backup file
 * 
 * @param {*} index index of file to be uploaded.
 * @param {*} filesMap Object of backup files
 */
export function uploadBackupFile(index, filesMap) {
    return async function (dispatch) {
        try {
            if (!filesMap || !filesMap[index]) throw new Error(FILE_MISSING)
            dispatch(setState(SET_UPLOADING_FILE, filesMap[index]))
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY) // get session token for authentication while hitting api
            if (!token) {
                throw new Error(TOKEN_MISSING)
            }
            let responseBody = await RestAPIFactory(token.value).uploadZipFile(filesMap[index].path, filesMap[index].name) // Method to upload zip file.
            if (responseBody && responseBody.split(",")[0] == 'success') {
                dispatch(setState(SET_BACKUP_VIEW, 2))
                if (index < 0) {
                    dispatch(deleteBackupFile(index, filesMap)) // negative index means unsynced backup file so it will be deleted after uploading
                }
                setTimeout(() => {
                    dispatch(autoLogoutAfterUpload()) // after uploading successfully the user will automatically logged out.
                }, 1000)
            } else {
                dispatch(setState(SET_BACKUP_VIEW, 3))
            }
        } catch (error) {
            console.log(error)
            dispatch(setState(SET_BACKUP_VIEW, 3))// to do add exception logs
        }
    }
}
/** this method will delete backup file.
 * 
 * @param {*} index index of file to be uploaded.
 * @param {*} filesMap Object of backup files
 */
export function deleteBackupFile(index, filesMap) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_BACKUP, true))
            if (!filesMap || !filesMap[index]) throw new Error(FILE_MISSING)
            const user = await keyValueDBService.getValueFromStore(USER)
            if (!user || !user.value) throw new Error(USER_MISSING)
            await backupService.deleteBackupFile(index, filesMap) // this method in service will delete backup file.
            let backupFiles = await backupService.getBackupFilesList(user.value) // this method
            dispatch(setState(SET_BACKUP_FILES, backupFiles))
        } catch (error) {
            dispatch(setState(SET_LOADER_BACKUP, false)) // to do add exception logs
        }
    }
}
/** this method is for logging out after backup is successfully uploaded.
 * 
 * @param {*} calledFromHome // this boolean parameter checks if the method is called from Home class or any orher class.
 */
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
            await backupService.createBackupOnLogout() // creates backup on logout
            let response = await authenticationService.logout(token) // hit logout api
            const userData = await keyValueDBService.getValueFromStore(USER)
            if ((response && response.status == 200) || (userData && userData.value && userData.value.company && userData.value.company.autoLogoutFromDevice && !moment(moment(userData.value.lastLoginTime).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD')))) {
                await logoutService.deleteDataBase() //delete database.
                dispatch(preLogoutSuccess())
                dispatch(NavigationActions.navigate({ routeName: LoginScreen }))
                dispatch(deleteSessionToken())
            } else {
            Toast.show({ text: LOGOUT_UNSUCCESSFUL, position: 'bottom', buttonText: OK, duration: 5000 })
            }
        } catch (error) {
            console.log(error)// to do add exception logs
            Toast.show({ text: LOGOUT_UNSUCCESSFUL, position: 'bottom', buttonText: OK, duration: 5000 })
            dispatch(setState(SET_BACKUP_VIEW, 0))
        }
    }
}