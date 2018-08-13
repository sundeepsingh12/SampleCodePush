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
    SET_BACKUP_UPLOAD_VIEW,
    SET_BACKUP_TOAST,
    DOMAIN_URL,
    PRE_LOGOUT_START,
    PRE_LOGOUT_SUCCESS
} from '../../lib/constants'
import { setState, deleteSessionToken, showToastAndAddUserExceptionLog } from '../global/globalActions'
import { backupService } from '../../services/classes/BackupService'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import { NavigationActions } from 'react-navigation'
import { navDispatch } from '../navigators/NavigationService';
import { authenticationService } from '../../services/classes/Authentication'
import {
    USER_MISSING,
    TOKEN_MISSING,
    FILE_MISSING,
    TRY_AFTER_CLEARING_YOUR_STORAGE_DATA,
} from '../../lib/ContainerConstants'
import Mailer from 'react-native-mail';
import { Alert, Platform } from 'react-native'
import RNFS from 'react-native-fs'


/** This method creates backup manually when button is pressed.
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
            dispatch(setState(SET_BACKUP_TOAST, TRY_AFTER_CLEARING_YOUR_STORAGE_DATA))
            showToastAndAddUserExceptionLog(201, error.message, 'danger', 1)
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
            let domainUrl = await keyValueDBService.getValueFromStore(DOMAIN_URL)
            if (!user || !user.value || !domainUrl || !domainUrl.value) throw new Error(USER_MISSING)
            let backupFiles = await backupService.getBackupFilesList(user.value, domainUrl.value) // this method gets backup files list from service
            dispatch(setState(SET_BACKUP_FILES, backupFiles))
        } catch (error) {
            showToastAndAddUserExceptionLog(202, error.message, 'danger', 1)
            dispatch(setState(SET_LOADER_BACKUP, false))
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
            showToastAndAddUserExceptionLog(203, error.message, 'danger', 0)
            dispatch(setState(SET_BACKUP_VIEW, 3))
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
            let domainUrl = await keyValueDBService.getValueFromStore(DOMAIN_URL)
            if (!user || !user.value || !domainUrl && !domainUrl.value) throw new Error(USER_MISSING)
            await backupService.deleteBackupFile(index, filesMap) // this method in service will delete backup file.
            let backupFiles = await backupService.getBackupFilesList(user.value, domainUrl.value) // this method
            dispatch(setState(SET_BACKUP_FILES, backupFiles))
        } catch (error) {
            showToastAndAddUserExceptionLog(204, error.message, 'danger', 1)
            dispatch(setState(SET_LOADER_BACKUP, false))
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
            dispatch(setState(PRE_LOGOUT_START))
            let response = await authenticationService.logout(true, { value: true }) // hit logout api
            dispatch(setState(PRE_LOGOUT_SUCCESS))
            navDispatch(NavigationActions.navigate({ routeName: LoginScreen }))
            dispatch(deleteSessionToken())
        } catch (error) {
            showToastAndAddUserExceptionLog(205, error.message, 'danger', 1)
            dispatch(setState(SET_BACKUP_VIEW, 0))
        }
    }
}


export function mailBackupFile(index, filesMap) {
    return async function (dispatch) {
        try {
            if (!filesMap || !filesMap[index]) throw new Error(FILE_MISSING)
            let destPath
            if (Platform.OS == 'android') {
                destPath = RNFS.ExternalDirectoryPath + '/FareyeTemp'
                await RNFS.mkdir(destPath)
                await RNFS.copyFile(filesMap[index].path, destPath + '/' + filesMap[index].name)
            } else {
                destPath = RNFS.LibraryDirectoryPath + '/FareyeTemp'
                await RNFS.mkdir(destPath)
                let fileExists = await RNFS.exists(destPath + '/' + filesMap[index].name)
                if (!fileExists) {
                    await RNFS.copyFile(filesMap[index].path, destPath + '/' + filesMap[index].name)
                }
            }

            Mailer.mail({
                subject: 'backup file: ' + filesMap[index].name,
                recipients: ['udbhav@roboticwares.com'],
                ccRecipients: [],
                bccRecipients: [],
                body: '',
                isHTML: true,
                attachment: {
                    path: destPath + '/' + filesMap[index].name, // The absolute path of the file from which to read data.
                    type: 'zip',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
                    name: '',   // Optional: Custom filename for attachment
                }
            }, (error, event) => {
                Alert.alert(
                    error,
                    event,
                    [
                        { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
                        { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
                    ],
                    { cancelable: true }
                )
            });
        } catch (error) {
            showToastAndAddUserExceptionLog(205, error.message, 'danger', 1)
            dispatch(setState(SET_BACKUP_VIEW, 0))
        }
    }
}