'use strict'
import {
  MASTER_DOWNLOAD_START,
  MASTER_DOWNLOAD_SUCCESS,
  MASTER_DOWNLOAD_FAILURE,
  MASTER_SAVING_START,
  MASTER_SAVING_SUCCESS,
  MASTER_SAVING_FAILURE,
  CHECK_ASSET_START,
  CHECK_ASSET_FAILURE,
  OTP_GENERATION_START,
  OTP_GENERATION_FAILURE,
  OTP_VALIDATION_START,
  OTP_VALIDATION_FAILURE,
  SERVICE_PENDING,
  SERVICE_SUCCESS,
  SERVICE_FAILED,
  SHOW_OTP_SCREEN,
  SHOW_MOBILE_NUMBER_SCREEN,
  DEVICE_IMEI,
  DEVICE_SIM,
  USER,
  IS_PRELOADER_COMPLETE,
  PRE_LOGOUT_START,
  PRE_LOGOUT_SUCCESS,
  ERROR_400_403_LOGOUT,
  PRELOADER_SUCCESS,
  AutoLogoutScreen,
  JOB_MASTER,
  JOB_ATTRIBUTE,
  JOB_ATTRIBUTE_VALUE,
  FIELD_ATTRIBUTE,
  FIELD_ATTRIBUTE_VALUE,
  JOB_STATUS,
  TAB,
  CUSTOMER_CARE,
  SMS_TEMPLATE,
  USER_SUMMARY,
  JOB_SUMMARY,
  SMS_JOB_STATUS,
  JOB_MASTER_MONEY_TRANSACTION_MODE,
  FIELD_ATTRIBUTE_STATUS,
  FIELD_ATTRIBUTE_VALIDATION,
  FIELD_ATTRIBUTE_VALIDATION_CONDITION,
  JOB_LIST_CUSTOMIZATION,
  CUSTOMIZATION_APP_MODULE,
  CUSTOMIZATION_LIST_MAP,
  TABIDMAP,
  JOB_ATTRIBUTE_STATUS,
  HomeTabNavigatorScreen,
  LoginScreen,
  OTP_SUCCESS,
  PENDING_SYNC_TRANSACTION_IDS,
  SET_UNSYNC_TRANSACTION_PRESENT,
  UnsyncBackupUpload,
  PAGES,
  PAGES_ADDITIONAL_UTILITY,
  DOWNLOAD_LATEST_APP,
  MDM_POLICIES,
  APP_THEME,
  SET_APP_UPDATE_BY_CODEPUSH,
  SET_APP_UPDATE_STATUS,
  IS_SHOW_MOBILE_OTP_SCREEN,
  IS_LOGGING_OUT
} from '../../lib/constants'
import { MAJOR_VERSION_OUTDATED, MINOR_PATCH_OUTDATED } from '../../lib/AttributeConstants'
import { jobMasterService } from '../../services/classes/JobMaster'
import { authenticationService } from '../../services/classes/Authentication'
import { deviceVerificationService } from '../../services/classes/DeviceVerification'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { deleteSessionToken, setState, showToastAndAddUserExceptionLog, resetNavigationState, resetApp } from '../global/globalActions'
import CONFIG from '../../lib/config'
import { logoutService } from '../../services/classes/Logout'
import { NavigationActions } from 'react-navigation'
import { backupService } from '../../services/classes/BackupService'
import BackgroundTimer from 'react-native-background-timer'
import moment from 'moment'
import { SHOW_MOBILE_SCREEN, SHOW_OTP, CODEPUSH_CHECKING_FOR_UPDATE, CODEPUSH_DOWNLOADING_PACKAGE, CODEPUSH_INSTALLING_UPDATE, CODEPUSH_SOMETHING_WENT_WRONG } from '../../lib/ContainerConstants'
import codePush from "react-native-code-push"
import { Platform } from 'react-native'
import { performSyncService } from '../home/homeActions';

//This hits JOB Master Api and gets the response 
export function downloadJobMaster(deviceIMEI, deviceSIM, userObject, token) {
  return async function (dispatch) {
    try {
      dispatch(setState(MASTER_DOWNLOAD_START))
      const jobMasters = await jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, userObject, token)
      if (!jobMasters || !jobMasters.json)
        throw new Error('No response returned from server')
      dispatch(setState(MASTER_DOWNLOAD_SUCCESS))
      dispatch(validateAndSaveJobMaster(deviceIMEI, deviceSIM, token, jobMasters.json))
    } catch (error) {
      showToastAndAddUserExceptionLog(1801, error.message, 'danger', 0)
      if (error.code == 403 || error.code == 400) { // clear user session WITHOUT Logout API call
        dispatch(setState(ERROR_400_403_LOGOUT, error.message))  // Logout API will return 500 as the session is pre-cleared on Server
      } else {
        dispatch(setState(MASTER_DOWNLOAD_FAILURE, error.message))
      }
    }
  }
}

/**This method logs out the user and deletes session token from store
 * @param {*} createBackup if it is called from backup class 
 * @return {Function}
 */

export function invalidateUserSession(isPreLoader, calledFromAutoLogout) {
  return async function (dispatch) { // await userEventLogService.addUserEventLog(LOGOUT_SUCCESSFUL, "") /* uncomment this code when run sync in logout */
   try {
      dispatch(setState(PRE_LOGOUT_START))
      const isPreLoaderComplete = await keyValueDBService.getValueFromStore(IS_PRELOADER_COMPLETE)
      let response = await authenticationService.logout(calledFromAutoLogout, isPreLoaderComplete) // create backup, hit logout api and delete dataBase
      dispatch(setState(PRE_LOGOUT_SUCCESS))
      dispatch(resetNavigationState(0,[NavigationActions.navigate({routeName: LoginScreen})]))
      dispatch(deleteSessionToken())
    } catch (error) {
      showToastAndAddUserExceptionLog(1803, error.message, 'danger', 1)
      if (isPreLoader) {
        dispatch(setState(ERROR_400_403_LOGOUT, error.message))
      } else if (calledFromAutoLogout) {
        dispatch(startLoginScreenWithoutLogout())
      } else {
        dispatch(setState(IS_LOGGING_OUT, false))
      }
    }
  }
}

/**This method Schedule BackGround Timer for autoLogout app at midNight('00:00:00') 
 * It is run in Background mode also. This method is call only one time .
 * 
 * @function autoLogout(userData)
 * 
 */

export function autoLogout(userData) {
  return async (dispatch) => {
    try {
      if (userData && userData.value && userData.value.company && userData.value.company.autoLogoutFromDevice) {
        let timeLimit = moment('23:59:59', "HH:mm:ss").diff(moment(new Date(), "HH:mm:ss"), 'seconds') + 5
        const timeOutId = BackgroundTimer.setTimeout(async () => {
          if (!moment(moment(userData.value.lastLoginTime).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))) {
            dispatch(NavigationActions.navigate({ routeName: AutoLogoutScreen }))
            BackgroundTimer.clearTimeout(timeOutId);
          }
        }, timeLimit * 1000)
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(1804, error.message, 'danger', 1)
    }
  }
}
/**
 * This methods logs out the user without calling the Logout API as the session is already invalidated on Server
 */
export function startLoginScreenWithoutLogout() {
  return async function (dispatch) {
    try {
      dispatch(setState(PRE_LOGOUT_SUCCESS))
      await logoutService.deleteDataBase()
      dispatch(deleteSessionToken())
      dispatch(resetNavigationState(0,[NavigationActions.navigate({routeName: LoginScreen})]))
    } catch (error) {
      showToastAndAddUserExceptionLog(1805, error.message, 'danger', 1)
    }
  }
}

export function checkForUnsyncBackupFilesAndNavigate(user) {
  return async function (dispatch) {
    try {
      let unsyncBackupFilesList = await backupService.checkForUnsyncBackup(user)
      if (unsyncBackupFilesList.length > 0) {
        dispatch(resetNavigationState(0, [NavigationActions.navigate({ routeName: UnsyncBackupUpload })]))
        
      } else {
        dispatch(resetNavigationState(0, [NavigationActions.navigate({ routeName: HomeTabNavigatorScreen })]))
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(1814, error.message, 'danger', 1)
    }
  }
}


/**Called when preloader container is mounted or when user clicks on Retry button
 * 
 * @param {*} configDownloadService 
 * @param {*} configSaveService 
 * @param {*} deviceVerificationService 
 */
export function saveSettingsAndValidateDevice(configDownloadService, configSaveService, deviceVerificationService) {
  return async function (dispatch) {
    try {
      const mobileOtpScreen = await keyValueDBService.getValueFromStore(IS_SHOW_MOBILE_OTP_SCREEN)
      if (mobileOtpScreen && mobileOtpScreen.value) {
        dispatch(setState(SHOW_MOBILE_NUMBER_SCREEN, SHOW_MOBILE_SCREEN))
      } else {
        const deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
        const deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
        const userObject = await keyValueDBService.getValueFromStore(USER)
        const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        if (configDownloadService === SERVICE_SUCCESS && configSaveService === SERVICE_SUCCESS && (deviceVerificationService === SERVICE_PENDING || deviceVerificationService == SERVICE_FAILED)) {
          dispatch(checkAsset(deviceIMEI, deviceSIM, userObject, token))
        } else {
          dispatch(downloadJobMaster(deviceIMEI, deviceSIM, userObject, token))
        }
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(1806, error.message, 'danger', 1)
    }
  }
}

/**This method validates job master response from server and if found valid then saves it,
 * otherwise job master failure action is dispatched
 *
 * @param jobMasterResponse
 * @param dispatch
 * @return {Promise.<void>}
 */
export function validateAndSaveJobMaster(deviceIMEI, deviceSIM, token, jobMasterResponse) {
  return async function (dispatch) {
    try {
      await jobMasterService.matchServerTimeWithMobileTime(jobMasterResponse.serverTime)
      dispatch(setState(MASTER_SAVING_START))
      await jobMasterService.saveJobMaster(jobMasterResponse)
      dispatch(setState(MASTER_SAVING_SUCCESS))
      const userObject = await keyValueDBService.getValueFromStore(USER)
      dispatch(checkAsset(deviceIMEI, deviceSIM, userObject, token))
    } catch (error) {
      dispatch(checkIfAppIsOutdated(error))
    }
  }
}

export function patchUpdateViaCodePush(error) {
  return async function (dispatch) {
    dispatch(setState(SET_APP_UPDATE_BY_CODEPUSH, { isCodePushUpdate: true }))
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
      deploymentKey: (Platform.OS === 'ios') ? error.iosDeploymentKey : error.androidDeploymentKey,
    }, (status) => {
      switch (status) {
        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
          dispatch(setState(SET_APP_UPDATE_STATUS, { codePushUpdateStatus: CODEPUSH_CHECKING_FOR_UPDATE }))
          break;
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
          dispatch(setState(SET_APP_UPDATE_STATUS, { codePushUpdateStatus: CODEPUSH_DOWNLOADING_PACKAGE }))
          break;
        case codePush.SyncStatus.INSTALLING_UPDATE:
          dispatch(setState(SET_APP_UPDATE_STATUS, { codePushUpdateStatus: CODEPUSH_INSTALLING_UPDATE }))
          break;
        case codePush.SyncStatus.UP_TO_DATE:
          dispatch(resetApp());
          break;
        case codePush.SyncStatus.UPDATE_INSTALLED:
          dispatch(setState(SET_APP_UPDATE_BY_CODEPUSH, { isCodePushUpdate: false }))
          break;
        case codePush.SyncStatus.AWAITING_USER_ACTION:
          break;
        case codePush.SyncStatus.SYNC_IN_PROGRESS:
          break;
        default:
          dispatch(setState(MASTER_SAVING_FAILURE, CODEPUSH_SOMETHING_WENT_WRONG))
      }
    })
  }
}

export function checkIfAppIsOutdated(error) {
  return async function (dispatch) {
    if (error.errorCode == MAJOR_VERSION_OUTDATED) {
      dispatch(setState(DOWNLOAD_LATEST_APP, { displayMessage: error.errorCode, downloadUrl: error.downloadUrl }))
    }
    else if (error.errorCode == MINOR_PATCH_OUTDATED) {
      dispatch(patchUpdateViaCodePush(error))
    }
    else {
      showToastAndAddUserExceptionLog(1807, error.message, 'danger', 0)
      const keys = [
        JOB_MASTER,
        JOB_ATTRIBUTE,
        JOB_ATTRIBUTE_VALUE,
        FIELD_ATTRIBUTE,
        FIELD_ATTRIBUTE_VALUE,
        JOB_STATUS,
        TAB,
        CUSTOMER_CARE,
        SMS_TEMPLATE,
        USER_SUMMARY,
        JOB_SUMMARY,
        SMS_JOB_STATUS,
        JOB_MASTER_MONEY_TRANSACTION_MODE,
        FIELD_ATTRIBUTE_STATUS,
        FIELD_ATTRIBUTE_VALIDATION,
        FIELD_ATTRIBUTE_VALIDATION_CONDITION,
        JOB_LIST_CUSTOMIZATION,
        CUSTOMIZATION_APP_MODULE,
        USER,
        CUSTOMIZATION_LIST_MAP,
        TABIDMAP,
        JOB_ATTRIBUTE_STATUS,
        PAGES,
        PAGES_ADDITIONAL_UTILITY,
        MDM_POLICIES,
        APP_THEME
      ]
      await keyValueDBService.deleteValueFromStore(keys)
      dispatch(setState(MASTER_SAVING_FAILURE, error.message))
    }
  }
}

/**Checks if sim is locally verified or not,if not then check if it's valid on server or not
 *
 * @param dispatch
 * @return {Promise.<void>}
 */
export function checkAsset(deviceIMEI, deviceSIM, user, token) {
  return async function (dispatch) {
    try {
      dispatch(setState(CHECK_ASSET_START))
      const isVerified = await deviceVerificationService.checkAssetLocal(deviceIMEI, deviceSIM, user)
      if (isVerified) {
        dispatch(setState(PRELOADER_SUCCESS))
        dispatch(checkForUnsyncBackupFilesAndNavigate(user))
      } else {
        dispatch(checkIfSimValidOnServer(user, token));
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(1808, error.message, 'danger', 0)
      dispatch(setState(CHECK_ASSET_FAILURE, error.message))
    }
  }
}

/**Checks if sim is valid on server,called only if sim is not valid locally
 *
 * @return {Promise.<void>}
 */


export function checkIfSimValidOnServer(user, token) {
  return async function (dispatch) {
    try {
      const responseIsVerified = await deviceVerificationService.checkAssetApiAndSimVerificationOnServer(token)
      if (responseIsVerified) {
        dispatch(setState(PRELOADER_SUCCESS))
        dispatch(checkForUnsyncBackupFilesAndNavigate(user))
      } else {
        dispatch(setState(SHOW_MOBILE_NUMBER_SCREEN, SHOW_MOBILE_SCREEN))
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(1809, error.message, 'danger', 0)
      if (error.code == 403 || error.code == 400) { // clear user session without Logout API call
        dispatch(setState(ERROR_400_403_LOGOUT, error.message)) // Logout API will return 500 as the session is pre-cleared on Server
      } else {
        dispatch(setState(CHECK_ASSET_FAILURE, error.message))
      }
    }
  }
}

/**Called when user clicks on Send OTP in mobile no screen
 *
 * @param mobileNumber
 * @return {Function}
 */
export function generateOtp(mobileNumber) {
  return async function (dispatch) {
    try {
      dispatch(setState(OTP_GENERATION_START, false))
      await deviceVerificationService.generateOTP(mobileNumber)
      dispatch(setState(SHOW_OTP_SCREEN, SHOW_OTP))
    } catch (error) {
      showToastAndAddUserExceptionLog(1810, error.message, 'danger', 0)
      dispatch(setState(OTP_GENERATION_FAILURE, error.message))
    }
  }
}

/**Called when user clicks on verify button in otp screen
 *
 * @param otpNumber
 * @return {Function}
 */
export function validateOtp(otpNumber) {
  return async function (dispatch) {
    try {
      dispatch(setState(OTP_VALIDATION_START, false))
      await deviceVerificationService.verifySim(otpNumber)
      dispatch(setState(OTP_SUCCESS))
      const user = await keyValueDBService.getValueFromStore(USER)
      dispatch(checkForUnsyncBackupFilesAndNavigate(user))
    } catch (error) {
      showToastAndAddUserExceptionLog(1811, error.message, 'danger', 0)
      dispatch(setState(OTP_VALIDATION_FAILURE, error.message))
    }
  }

}

export function checkForUnsyncTransactionAndLogout(calledFromAutoLogout) {
  return async function (dispatch) {
    try {
      dispatch(setState(IS_LOGGING_OUT, true))
      let message = await dispatch(performSyncService(true, null,null, calledFromAutoLogout))
      let pendingSyncTransactionIds = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
      let isUnsyncTransactionsPresent = logoutService.checkForUnsyncTransactions(pendingSyncTransactionIds)
      if (isUnsyncTransactionsPresent && !calledFromAutoLogout) {
        dispatch(setState(SET_UNSYNC_TRANSACTION_PRESENT, {isUnsyncTransactionOnLogout : true, isLoggingOut : false}))
      } else {
        dispatch(invalidateUserSession(false, calledFromAutoLogout))
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(1812, error.message, 'danger', 0)
      dispatch(setState(ERROR_400_403_LOGOUT, error.message))
    }
  }
}




