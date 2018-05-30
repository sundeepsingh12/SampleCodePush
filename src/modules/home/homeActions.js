'use strict'
import {
  // ACTIONS
  PAGES_LOADING,
  SET_PAGES_UTILITY_N_PIESUMMARY,
  //SCHEMAS
  PAGES,
  PAGES_ADDITIONAL_UTILITY,
  //ROUTE NAME FOR NAVIGATION
  TabScreen,
  CUSTOMIZATION_APP_MODULE,
  HOME_LOADING,
  CHART_LOADING,
  JOB_DOWNLOADING_STATUS,
  PENDING_SYNC_TRANSACTION_IDS,
  USER,
  SET_MODULES,
  UNSEEN,
  JOB_SUMMARY,
  SYNC_ERROR,
  SYNC_STATUS,
  PENDING,
  PIECHART,
  LAST_SYNC_WITH_SERVER,
  LAST_SYNC_TIME,
  USERNAME,
  PASSWORD,
  LoginScreen,
  IS_SERVER_REACHABLE,
  AutoLogoutScreen,
  SET_BACKUP_UPLOAD_VIEW,
  SET_UPLOAD_FILE_COUNT,
  SET_FAIL_UPLOAD_COUNT,
  SET_BACKUP_FILES_LIST,
  BACKUP_UPLOAD_FAIL_COUNT,
  SET_ERP_PULL_ACTIVATED,
  ERP_SYNC_STATUS,
  SET_NEWJOB_DRAFT_INFO,
  JOB_MASTER,
  SAVE_ACTIVATED,
  POPULATE_DATA,
  NewJob,
  BulkListing,
  SET_TRANSACTION_SERVICE_STARTED,
  SYNC_RUNNING_AND_TRANSACTION_SAVING,
  PostAssignmentScanner,
  CustomApp,
  Sorting,
  Statistics,
  Backup,
  LiveJobs,
  OfflineDS,
  ProfileView,
  FCM_TOKEN,
  LOADER_FOR_SYNCING,
  MDM_POLICIES,
  APP_THEME
} from '../../lib/constants'

import {
  //PAGE SCREEN ID's
  PAGE_BACKUP,
  PAGE_BLUETOOTH_PAIRING,
  PAGE_BULK_UPDATE,
  PAGE_CUSTOM_WEB_PAGE,
  PAGE_EZETAP_INITIALIZE,
  PAGE_INLINE_UPDATE,
  PAGE_JOB_ASSIGNMENT,
  PAGE_LIVE_JOB,
  PAGE_MOSAMBEE_INITIALIZE,
  PAGE_MSWIPE_INITIALIZE,
  PAGE_NEW_JOB,
  PAGE_OFFLINE_DATASTORE,
  PAGE_OUTSCAN,
  PAGE_PAYNEAR_INITIALIZE,
  PAGE_PICKUP,
  PAGE_PROFILE,
  PAGE_SEQUENCING,
  PAGE_SORTING_PRINTING,
  PAGE_STATISTICS,
  PAGE_TABS,
  //PAGE UTILITY ID's
  PAGE_MESSAGING,
  PAGE_SUMMARY_PIECHART,
  //ERROR MESSAGES
  UNKNOWN_PAGE_TYPE,
  //Others
  SERVER_REACHABLE,
  SERVER_UNREACHABLE,
  Piechart,
  SERVICE_ALREADY_SCHEDULED
} from '../../lib/AttributeConstants'
import { Toast, ActionSheet, } from 'native-base'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { summaryAndPieChartService } from '../../services/classes/SummaryAndPieChart'
import { trackingService } from '../../services/classes/Tracking'
import { jobStatusService } from '../../services/classes/JobStatus'
import { userEventLogService } from '../../services/classes/UserEvent'
import { setState, navigateToScene, showToastAndAddUserExceptionLog } from '../global/globalActions'
import CONFIG from '../../lib/config'
import { sync } from '../../services/classes/Sync'
import { NetInfo, Alert, Platform } from 'react-native'
import moment from 'moment'
import BackgroundTimer from 'react-native-background-timer'
import { fetchJobs } from '../taskList/taskListActions'
import RestAPIFactory from '../../lib/RestAPIFactory'
import { logoutService } from '../../services/classes/Logout'
import { authenticationService } from '../../services/classes/Authentication'
import { backupService } from '../../services/classes/BackupService'
import { autoLogoutAfterUpload } from '../backup/backupActions'
import { utilitiesService } from '../../services/classes/Utilities'
import { transactionCustomizationService } from '../../services/classes/TransactionCustomization'
import { moduleCustomizationService } from '../../services/classes/ModuleCustomization'
import { getRunsheetsForSequence } from '../sequence/sequenceActions'
import { redirectToContainer, redirectToFormLayout } from '../newJob/newJobActions'
import { restoreDraftAndNavigateToFormLayout } from '../form-layout/formLayoutActions'
import FCM, { NotificationActionType, FCMEvent } from "react-native-fcm"
import feStyle from '../../themes/FeStyle'
import { jobMasterService } from '../../services/classes/JobMaster';
import { UNABLE_TO_SYNC_WITH_SERVER_PLEASE_CHECK_YOUR_INTERNET, FCM_REGISTRATION_ERROR, TOKEN_MISSING, APNS_TOKEN_ERROR } from '../../lib/ContainerConstants'
/**
 * Function which updates STATE when component is mounted
 * - List of pages for showing on Home Page
 * - List of additional utilities for activating on Home Page (Piechart and Messaging)
 * - Summary counts for rendring Pie-chart
*/
export function fetchPagesAndPiechart() {
  return async function (dispatch) {
    try {
      dispatch(setState(PAGES_LOADING, { pagesLoading: true }));
      const user = await keyValueDBService.getValueFromStore(USER);
      //Fetching list of Pages
      const pageList = await keyValueDBService.getValueFromStore(PAGES);
      let mainMenuAndSubMenuObject = moduleCustomizationService.getPagesMainMenuAndSubMenuObject(pageList ? pageList.value : null, user ? user.value : null);
      let sortedMainMenuAndSubMenuList = moduleCustomizationService.sortMenuAndSubMenuGroupList(mainMenuAndSubMenuObject.mainMenuObject, mainMenuAndSubMenuObject.subMenuObject);
      //Fetching list of Home screen Utilities 
      const utilityList = await keyValueDBService.getValueFromStore(PAGES_ADDITIONAL_UTILITY);
      //Looping over Utility list to check if Piechart and Messaging are enabled
      let utilities = {}
      _.each(utilityList.value, function (utility) {
        if (utility.utilityID == PAGE_SUMMARY_PIECHART) {
          Piechart.enabled = utilities.pieChartEnabled = utility.enabled
          Piechart.params = JSON.parse(utility.additionalParams).jobMasterIds
        };
        (utility.utilityID == PAGE_MESSAGING) ? utilities.messagingEnabled = utility.enabled : null;
      })

      //Fetching Summary count for Pie-chart
      const pieChartSummaryCount = (Piechart.enabled) ? await summaryAndPieChartService.getAllStatusIdsCount(Piechart.params) : null
      //Finally updating state
      dispatch(setState(SET_PAGES_UTILITY_N_PIESUMMARY, { sortedMainMenuAndSubMenuList, utilities, pieChartSummaryCount }));
    } catch (error) {
      //TODO : show proper error code message ERROR CODE 600
      //Save the error in exception logs
      showToastAndAddUserExceptionLog(2701, error.message, 'danger', 1)
    }
  }
}

/** 
 * Function to navigate to a new page
 * @Params : pageObject (sample below)
 * {
 * 	"id": 2,
 * 	"name": "Print Dispatch lables",
 * 	"groupName": "Group 1",
 * 	"icon": "ios-happy",
 * 	"userType": "field-executive",
 * 	"jobMasterIds": [65],
 * 	"manualSelection": true,
 * 	"menuLocation": "MAIN",
 * 	"screenTypeId": 1,
 * 	"sequenceNumber": 2,
 * 	"additionalParams": {
 *    "statusId": 245,
 * 	  "temp": "xyz",
 *  }
*/
//TODO Move this to Globalfunction if feasible
export function navigateToPage(pageObject) {
  return async function (dispatch) {
    try {
      switch (pageObject.screenTypeId) {
        case PAGE_BACKUP:
          dispatch(navigateToScene(Backup, { displayName: (pageObject.name) ? pageObject.name : 'BackUp' }));
          break;
        case PAGE_BLUETOOTH_PAIRING:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_BULK_UPDATE: {
          dispatch(startSyncAndNavigateToContainer(pageObject, true, LOADER_FOR_SYNCING))
          break;
        }
        case PAGE_CUSTOM_WEB_PAGE:
          let customRemarks = JSON.parse(pageObject.additionalParams).CustomAppArr
          !_.size(customRemarks) || customRemarks.length == 1 ? dispatch(navigateToScene(CustomApp, { customUrl: (customRemarks.length) ? customRemarks[0].customUrl : null })) : dispatch(customAppSelection(customRemarks))
          break
        case PAGE_EZETAP_INITIALIZE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_INLINE_UPDATE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_JOB_ASSIGNMENT:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_LIVE_JOB:
          dispatch(navigateToScene(LiveJobs, { pageObject }));
          break;
        case PAGE_MOSAMBEE_INITIALIZE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_MSWIPE_INITIALIZE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_NEW_JOB: {
          dispatch(startSyncAndNavigateToContainer(pageObject, false, LOADER_FOR_SYNCING))
          break;
        }
        case PAGE_OFFLINE_DATASTORE:
          dispatch(navigateToScene(OfflineDS, { displayName: (pageObject.name) ? pageObject.name : 'OfflineDataStore' }))
          break;
        case PAGE_OUTSCAN:
          dispatch(navigateToScene(PostAssignmentScanner, { pageObject }))
          break
        case PAGE_PAYNEAR_INITIALIZE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_PICKUP:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_PROFILE:
          dispatch(navigateToScene(ProfileView, { displayName: (pageObject.name) ? pageObject.name : 'Profile' }))
          break;
        case PAGE_SEQUENCING: {
          dispatch(getRunsheetsForSequence(pageObject));
          break;
        }
        case PAGE_SORTING_PRINTING:
          dispatch(navigateToScene(Sorting, { displayName: (pageObject.name) ? pageObject.name : 'Sorting' }))
          break;
        case PAGE_STATISTICS:
          dispatch(navigateToScene(Statistics, { displayName: (pageObject.name) ? pageObject.name : 'Statistics' }))
          break;
        case PAGE_TABS:
          dispatch(navigateToScene(TabScreen, { pageObject }));
          break;
        default:
          throw new Error("Unknown page type " + pageObject.screenTypeId + ". Contact support");
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(2702, error.message, 'danger', 1)
    }
  }
}

export function customAppSelection(appModule) {
  return async function (dispatch) {
    try {
      let BUTTONS = appModule.map(id => !(id.title) ? 'URL' : id.title)
      BUTTONS.push('Cancel')
      ActionSheet.show(
        {
          options: BUTTONS,
          title: '123',
          cancelButtonIndex: BUTTONS.length - 1,
          destructiveButtonIndex: BUTTONS.length - 1
        },
        buttonIndex => {
          (buttonIndex > -1 && buttonIndex < (BUTTONS.length - 1)) ? dispatch(navigateToScene(CustomApp, { customUrl: appModule[buttonIndex].customUrl })) : null
        }
      )
    } catch (error) {
      showToastAndAddUserExceptionLog(2703, error.message, 'danger', 1)
    }
  }
}

export function checkCustomErpPullActivated() {
  return async function (dispatch) {
    try {
      const user = await keyValueDBService.getValueFromStore(USER)
      const customErpPullActivated = user && user.value && user.value.company && user.value.company.customErpPullActivated ? 'activated' : 'notActivated'
      let appTheme = await keyValueDBService.getValueFromStore(APP_THEME);
      if (appTheme && appTheme.value) {
        feStyle.primaryColor = appTheme.value
        feStyle.bgPrimaryColor = appTheme.value
        feStyle.fontPrimaryColor = appTheme.value
        feStyle.shadeColor = appTheme.value + '98'
        feStyle.borderLeft4Color = appTheme.value
      }
      dispatch(setState(SET_ERP_PULL_ACTIVATED, { customErpPullActivated }))
    } catch (error) {
      showToastAndAddUserExceptionLog(2704, error.message, 'danger', 1)
    }
  }
}

export function startSyncAndNavigateToContainer(pageObject, isBulk, syncLoader) {
  return async function (dispatch) {
    try {
      if (await jobMasterService.checkForEnableLiveJobMaster(JSON.parse(pageObject.jobMasterIds)[0])) {
        dispatch(setState(syncLoader, true))
        let message = await dispatch(performSyncService())
        if (message === true) {
          dispatch(setState(syncLoader, false))
          if (!isBulk) {
            dispatch(redirectToContainer(pageObject))
          } else {
            dispatch(navigateToScene(BulkListing, { pageObject }))
          }
        } else {
          dispatch(setState(syncLoader, false))
          alert(UNABLE_TO_SYNC_WITH_SERVER_PLEASE_CHECK_YOUR_INTERNET)
        }
      }
      else {
        if (!isBulk) {
          dispatch(redirectToContainer(pageObject))
        } else {
          dispatch(navigateToScene(BulkListing, { pageObject }))
        }
      }
    } catch (error) {
      dispatch(setState(syncLoader, false))
      showToastAndAddUserExceptionLog(2714, error.message, 'danger', 1)
    }
  }
}

export function startTracking(trackingServiceStarted) {
  return async function (dispatch) {
    try {
      if (!trackingServiceStarted) {
        trackingService.init()
        dispatch(setState(SET_TRANSACTION_SERVICE_STARTED, true))// set trackingServiceStarted to true and it will get false on logout or when state is cleared
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(2705, error.message, 'danger', 1)
    }
  }
}

export function startFCM() {
  return async function (dispatch) {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    if (token && token.value) {
      const userObject = await keyValueDBService.getValueFromStore(USER)
      const topic = `FE_${userObject.value.id}`
      await FCM.requestPermissions()

      FCM.getFCMToken().then(async fcmToken => {
        await keyValueDBService.validateAndSaveData(FCM_TOKEN, fcmToken)
        await sync.sendRegistrationTokenToServer(token, fcmToken, topic)
      }, (error) => {
      }).catch(
        () => Toast.show({ text: FCM_REGISTRATION_ERROR, position: 'bottom', buttonText: OK, duration: 6000 }))

      if (Platform.OS === 'ios') {
        FCM.getAPNSToken().then(token => {
        }).catch(() => Toast.show({ text: APNS_TOKEN_ERROR, position: 'bottom', buttonText: OK, duration: 6000 }));
      }

      FCM.getInitialNotification().then(notif => {
      }, (err) => {
      })

      FCM.on(FCMEvent.Notification, notif => {

        if (notif.Notification == 'Android push notification') {
          dispatch(performSyncService(true))
        }
        else if (notif.Notification == 'Live Job Notification') {
          keyValueDBService.validateAndSaveData('LIVE_JOB', new Boolean(false))
          dispatch(performSyncService(true, true))
        }
        if (notif.local_notification) {
          return
        }
        if (notif.opened_from_tray) {
          return
        }

        if (Platform.OS === 'ios') {
          switch (notif._notificationType) {
            case NotificationType.Remote:
              notif.finish(RemoteNotificationResult.NewData) // other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
              break
            case NotificationType.NotificationResponse:
              notif.finish()
              break
            case NotificationType.WillPresent:
              notif.finish(WillPresentNotificationResult.All) // other types available: WillPresentNotificationResult.None
              break
          }
        }
      })

      FCM.on(FCMEvent.RefreshToken, async fcmToken => {
        await keyValueDBService.validateAndSaveData(FCM_TOKEN, fcmToken)
        await sync.sendRegistrationTokenToServer(token, fcmToken, topic)
      });

      FCM.subscribeToTopic(topic)
    }
    else {
      Toast.show({ text: TOKEN_MISSING, position: 'bottom', buttonText: OK, duration: 6000 })
    }
  }
}

export function performSyncService(isCalledFromHome, isLiveJob, erpPull, calledFromAutoLogout) {
  return async function (dispatch) {
    let syncStoreDTO
    try {
      const currenDate = moment().format('YYYY-MM-DD HH:mm:ss')
      let syncRunningAndTransactionSaving = await keyValueDBService.getValueFromStore(SYNC_RUNNING_AND_TRANSACTION_SAVING);
      if (!calledFromAutoLogout && syncRunningAndTransactionSaving && syncRunningAndTransactionSaving.value && (syncRunningAndTransactionSaving.value.syncRunning || syncRunningAndTransactionSaving.value.transactionSaving)) {
        return
      } else {
        await keyValueDBService.validateAndSaveData(SYNC_RUNNING_AND_TRANSACTION_SAVING, {
          syncRunning: true
        })
      }
      syncStoreDTO = await transactionCustomizationService.getSyncParamaters()
      const userData = syncStoreDTO.user
      const autoLogoutEnabled = userData ? userData.company ? userData.company.autoLogoutFromDevice : null : null
      const lastLoginTime = userData ? userData.lastLoginTime : null
      if (!calledFromAutoLogout && autoLogoutEnabled && !moment(moment(lastLoginTime).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))) {
        dispatch(navigateToScene(AutoLogoutScreen))
        return
      }
      let syncCount = 0
      if (!erpPull) {
        dispatch(setState(SYNC_STATUS, {
          unsyncedTransactionList: syncStoreDTO.transactionIdToBeSynced ? syncStoreDTO.transactionIdToBeSynced : [],
          syncStatus: 'Uploading'
        }))
        const responseBody = await sync.createAndUploadZip(syncStoreDTO, currenDate)
        syncCount = parseInt(responseBody.split(",")[1])
      }

      //Downloading starts here
      //Download jobs only if sync count returned from server > 0 or if sync was started from home or Push Notification
      if (isCalledFromHome || syncCount > 0) {
        dispatch(setState(erpPull ? ERP_SYNC_STATUS : SYNC_STATUS, {
          unsyncedTransactionList: syncStoreDTO.transactionIdToBeSynced ? syncStoreDTO.transactionIdToBeSynced : [],
          syncStatus: 'Downloading'
        }))
        const isJobsPresent = await sync.downloadAndDeleteDataFromServer(null, erpPull, syncStoreDTO);
        // check if live job module is present
        const isLiveJobModulePresent = syncStoreDTO.pageList ? syncStoreDTO.pageList.filter((module) => module.screenTypeId == PAGE_LIVE_JOB).length > 0 : false
        if(isLiveJobModulePresent) { 
          await sync.downloadAndDeleteDataFromServer(true, erpPull, syncStoreDTO)
        }
        if (isJobsPresent) {
          if (Piechart.enabled) {
            dispatch(pieChartCount())
          }
          dispatch(fetchJobs())
        }
        // if (isLiveJob) {
        //   dispatch(navigateToScene(LiveJobs, { callAlarm: true }))
        // }
      }
      dispatch(setState(erpPull ? ERP_SYNC_STATUS : SYNC_STATUS, {
        unsyncedTransactionList: [],
        syncStatus: 'OK',
        erpModalVisible: true,
        lastErpSyncTime: userData.lastERPSyncWithServer
      }))
      //Now schedule sync service which will run regularly after 2 mins
      await dispatch(syncService())
      let serverReachable = await keyValueDBService.getValueFromStore(IS_SERVER_REACHABLE)
      if (_.isNull(serverReachable) || serverReachable.value == 2) {
        await userEventLogService.addUserEventLog(SERVER_REACHABLE, "")
        await keyValueDBService.validateAndSaveData(IS_SERVER_REACHABLE, 1)
      }
      return true;
    } catch (error) {
      showToastAndAddUserExceptionLog(2706, error.message, 'danger', 0)
      let syncStatus = ''
      if (error.code == 500 || error.code == 502) {
        syncStatus = 'INTERNALSERVERERROR'
      } else if (error.code == 401) {
        dispatch(reAuthenticateUser(syncStoreDTO.transactionIdToBeSynced))
      }
      else {
        let connectionInfo = await utilitiesService.checkInternetConnection()
        syncStatus = (connectionInfo) ? 'ERROR' : 'NOINTERNET'
      }
      //Update Javadoc
      let serverReachable = await keyValueDBService.getValueFromStore(IS_SERVER_REACHABLE)
      if (_.isNull(serverReachable) || serverReachable.value == 1) {
        await userEventLogService.addUserEventLog(SERVER_UNREACHABLE, "")
        await keyValueDBService.validateAndSaveData(IS_SERVER_REACHABLE, 2)
      }
      dispatch(setState(erpPull ? ERP_SYNC_STATUS : SYNC_STATUS, {
        unsyncedTransactionList: syncStoreDTO.transactionIdToBeSynced ? syncStoreDTO.transactionIdToBeSynced : [],
        syncStatus
      }))
      return false;
    } finally {
      if (!erpPull) {
        const difference = await sync.calculateDifference()
        dispatch(setState(LAST_SYNC_TIME, difference))
      }
      await keyValueDBService.validateAndSaveData(SYNC_RUNNING_AND_TRANSACTION_SAVING, {
        syncRunning: false
      })
    }
  }
}

/**
 * This services schedules sync service at interval of 2 minutes
 */
export function syncService() {
  return async (dispatch) => {
    try {
      if (CONFIG.intervalId) {
        return
      }
      const mdmPolicies = await keyValueDBService.getValueFromStore(MDM_POLICIES)
      const timeInterval = (mdmPolicies && mdmPolicies.value && mdmPolicies.value.basicSetting && mdmPolicies.value.syncFrequency) ? mdmPolicies.value.syncFrequency : CONFIG.SYNC_SERVICE_DELAY
      CONFIG.intervalId = BackgroundTimer.setInterval(async () => {
        dispatch(performSyncService())
      }, timeInterval * 1000)
    } catch (error) {
      //Update UI here
      console.log(error)
    }
  }
}

export function pieChartCount() {
  return async (dispatch) => {
    try {
      dispatch(setState(CHART_LOADING, { loading: true }))
      const countForPieChart = await summaryAndPieChartService.getAllStatusIdsCount(Piechart.params)
      dispatch(setState(CHART_LOADING, { loading: false, count: countForPieChart }))
    } catch (error) {
      showToastAndAddUserExceptionLog(2707, error.message, 'danger', 1)
      dispatch(setState(CHART_LOADING, { loading: false, count: null }))
    }
  }
}

export function reAuthenticateUser(transactionIdToBeSynced) {
  return async function (dispatch) {
    try {
      dispatch(setState(SYNC_STATUS, {
        unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
        syncStatus: 'RE_AUTHENTICATING'
      }))
      let username = await keyValueDBService.getValueFromStore(USERNAME)
      let password = await keyValueDBService.getValueFromStore(PASSWORD)
      const authenticationResponse = await authenticationService.login(username.value, password.value)
      let cookie = authenticationResponse.headers.map['set-cookie'][0]
      await keyValueDBService.validateAndSaveData(CONFIG.SESSION_TOKEN_KEY, cookie)
      dispatch(performSyncService())
    } catch (error) {
      showToastAndAddUserExceptionLog(2708, error.message, 'danger', 1)
      if (error.code == 401) {
        dispatch(setState(SYNC_STATUS, {
          unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
          syncStatus: 'LOADING'
        }))
        await logoutService.deleteDataBase()
        dispatch(deleteSessionToken())
        dispatch(navigateToScene(LoginScreen))
      } else {
        dispatch(setState(SYNC_STATUS, {
          unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
          syncStatus: 'ERROR'
        }))
        let serverReachable = await keyValueDBService.getValueFromStore(IS_SERVER_REACHABLE)
        if (_.isNull(serverReachable) || serverReachable.value == 1) {
          await userEventLogService.addUserEventLog(SERVER_UNREACHABLE, "")
          await keyValueDBService.validateAndSaveData(IS_SERVER_REACHABLE, 2)
        }
      }
    }
  }
}

export function uploadUnsyncFiles(backupFilesList) {
  return async function (dispatch) {
    try {
      const failCount = 0, successCount = 0
      const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      if (!token) {
        throw new Error('Token Missing')
      }
      for (let backupFile of backupFilesList) {
        try {
          let responseBody = await RestAPIFactory(token.value).uploadZipFile(backupFile.path, backupFile.name)
          if (responseBody && responseBody.split(",")[0] == 'success') {
            await backupService.deleteBackupFile(null, null, backupFile.path)
            successCount++
            dispatch(setState(SET_UPLOAD_FILE_COUNT, successCount))
          } else {
            failCount++
          }
        } catch (error) {
          failCount++
        }
      }
      if (failCount > 0) {
        dispatch(setState(SET_FAIL_UPLOAD_COUNT, failCount))
        await keyValueDBService.validateAndSaveData(BACKUP_UPLOAD_FAIL_COUNT, failCount)
      } else {
        dispatch(setState(SET_BACKUP_UPLOAD_VIEW, 2))
        setTimeout(() => {
          dispatch(autoLogoutAfterUpload(true))
        }, 1000)
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(2709, error.message, 'danger', 1)
    }
  }
}

export function readAndUploadFiles() {
  return async function (dispatch) {
    try {
      dispatch(setState(SET_BACKUP_UPLOAD_VIEW, 0))
      dispatch(setState(SET_FAIL_UPLOAD_COUNT, 0))
      const user = await keyValueDBService.getValueFromStore(USER)
      let backupFilesList = await backupService.checkForUnsyncBackup(user)
      dispatch(setState(SET_BACKUP_FILES_LIST, backupFilesList))
      if (backupFilesList.length > 0) {
        dispatch(uploadUnsyncFiles(backupFilesList))
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(2710, error.message, 'danger', 1)
    }
  }
}
export function resetFailCountInStore() {
  return async function (dispatch) {
    try {
      await keyValueDBService.validateAndSaveData(BACKUP_UPLOAD_FAIL_COUNT, -1)
    } catch (error) {
      showToastAndAddUserExceptionLog(2711, error.message, 'danger', 1)
    }
  }
}


export function restoreNewJobDraft(draftStatusInfo, restoreDraft) {
  return async function (dispatch) {
    try {
      if (restoreDraft) {
        dispatch(restoreDraftAndNavigateToFormLayout(null, null, draftStatusInfo.draft))
      } else {
        dispatch(redirectToFormLayout(draftStatusInfo.nextStatus, -1, draftStatusInfo.draft.jobMasterId))
      }
      dispatch(setState(SET_NEWJOB_DRAFT_INFO, {}))
    } catch (error) {
      showToastAndAddUserExceptionLog(2712, error.message, 'danger', 1)
    }
  }
}
