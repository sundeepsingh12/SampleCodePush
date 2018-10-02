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
  CHART_LOADING,
  USER,
  SYNC_STATUS,
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
  APP_THEME,
  JOB_ATTRIBUTE,
  SET_CALLER_ID_POPUP,
  BluetoothListing,
  JobDetailsV2,
  SET_UPDATED_TRANSACTION_LIST_IDS,
  UPDATE_JOBMASTERID_JOBID_MAP,
  RUN_SYNC
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
  //Others
  SERVER_REACHABLE,
  SERVER_UNREACHABLE,
  Piechart,
  PATH_COMPANY_LOGO_IMAGE,
} from '../../lib/AttributeConstants'
import { Toast, ActionSheet, } from 'native-base'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { summaryAndPieChartService } from '../../services/classes/SummaryAndPieChart'
import { trackingService } from '../../services/classes/Tracking'
import { userEventLogService } from '../../services/classes/UserEvent'
import { setState, showToastAndAddUserExceptionLog, deleteSessionToken } from '../global/globalActions'
import CONFIG from '../../lib/config'
import { sync } from '../../services/classes/Sync'
import { Platform } from 'react-native'
import moment from 'moment'
import BackgroundTimer from 'react-native-background-timer'
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
import FCM, { FCMEvent, NotificationType, RemoteNotificationResult, WillPresentNotificationResult } from "react-native-fcm"
import feStyle from '../../themes/FeStyle'
import { jobMasterService } from '../../services/classes/JobMaster'
import { NavigationActions } from 'react-navigation'
import { FCM_REGISTRATION_ERROR, TOKEN_MISSING, APNS_TOKEN_ERROR, FCM_PERMISSION_DENIED, OK, ERROR, MESSAGE_MODULE_NAME } from '../../lib/ContainerConstants'
import RNFS from 'react-native-fs'
import { navDispatch, navigate, popToTop } from '../navigators/NavigationService';
import CallDetectorManager from 'react-native-call-detection'
import { jobAttributeMasterService } from '../../services/classes/JobAttributeMaster'
import { jobDataService } from '../../services/classes/JobData'
import { jobService } from '../../services/classes/Job'
import { each, size, isNull, isEmpty } from 'lodash'
import { AppState, Linking } from 'react-native'
import { fetchJobs } from '../taskList/taskListActions';
import { countDownTimerService } from '../../services/classes/CountDownTimerService'
import { navigateToLiveJob } from '../liveJob/liveJobActions'

/**
 * Function which updates STATE when component is mounted
 * - List of pages for showing on Home Page
 * - List of additional utilities for activating on Home Page (Piechart and Messaging)
 * - Summary counts for rendring Pie-chart
*/
export function fetchPagesAndPiechart() {
  return async function (dispatch) {
    try {
      dispatch(setState(PAGES_LOADING, true));
      let user = await keyValueDBService.getValueFromStore(USER);
      //Fetching list of Pages
      let pageList = await keyValueDBService.getValueFromStore(PAGES);
      let file;
      let fileExits = await RNFS.exists(PATH_COMPANY_LOGO_IMAGE);
      if (fileExits) {
        file = await RNFS.readFile(PATH_COMPANY_LOGO_IMAGE, 'base64')
      }
      let mainMenuAndSubMenuObject = moduleCustomizationService.getPagesMainMenuAndSubMenuObject(pageList ? pageList.value : null, user ? user.value : null);
      let sortedMainMenuAndSubMenuList = moduleCustomizationService.sortMenuAndSubMenuGroupList(mainMenuAndSubMenuObject.mainMenuObject, mainMenuAndSubMenuObject.subMenuObject);
      //Fetching list of Home screen Utilities 
      const utilityList = await keyValueDBService.getValueFromStore(PAGES_ADDITIONAL_UTILITY);
      //Looping over Utility list to check if Piechart and Messaging are enabled
      let utilities = {}
      each(utilityList.value, function (utility) {
        if (utility.utilityID == PAGE_SUMMARY_PIECHART) {
          Piechart.enabled = utilities.pieChartEnabled = utility.enabled
          Piechart.params = JSON.parse(utility.additionalParams).jobMasterIds
        };
        utilities.messagingEnabled = null
        if (utility.utilityID == PAGE_MESSAGING) {
          utilities.messagingEnabled = utility.enabled
          isEmpty(utility.name) ? utilities.messageModuleName = MESSAGE_MODULE_NAME : utilities.messageModuleName = utility.name
        };
      })

      //Fetching Summary count for Pie-chart
      const pieChartSummaryCount = (Piechart.enabled) ? await summaryAndPieChartService.getAllStatusIdsCount(Piechart.params) : null
      //Finally updating state
      dispatch(setState(SET_PAGES_UTILITY_N_PIESUMMARY, { sortedMainMenuAndSubMenuList, utilities, pieChartSummaryCount, logo: file }));
    } catch (error) {
      //TODO : show proper error code message ERROR CODE 600
      //Save the error in exception logs
      showToastAndAddUserExceptionLog(2701, error.message, 'danger', 1)
      dispatch(setState(PAGES_LOADING, false));
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
export function navigateToPage(pageObject, navigationProps) {
  return async function (dispatch) {
    try {
      switch (pageObject.screenTypeId) {
        case PAGE_BACKUP:
          navigate(Backup, { displayName: (pageObject.name) ? pageObject.name : 'BackUp' })
          break;
        case PAGE_BLUETOOTH_PAIRING:
          navigate(BluetoothListing, { pageObject })
          break;
        case PAGE_BULK_UPDATE: {
          let updatedJobTransactionList = await keyValueDBService.getValueFromStore(UPDATE_JOBMASTERID_JOBID_MAP)
          if (updatedJobTransactionList && !isEmpty(updatedJobTransactionList.value)) {
            dispatch(setState(SET_UPDATED_TRANSACTION_LIST_IDS, updatedJobTransactionList.value))
          }
          dispatch(startSyncAndNavigateToContainer(pageObject, true, LOADER_FOR_SYNCING))
          break;
        }
        case PAGE_CUSTOM_WEB_PAGE:
          let customRemarks = JSON.parse(pageObject.additionalParams).CustomAppArr
          !size(customRemarks) || customRemarks.length == 1 ? navigate(CustomApp, { customUrl: (size(customRemarks)) ? customRemarks[0].customUrl : null }) : dispatch(customAppSelection(customRemarks, navigationProps))
          break
        case PAGE_EZETAP_INITIALIZE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_INLINE_UPDATE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_JOB_ASSIGNMENT:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_LIVE_JOB:
          navigate(LiveJobs, { pageObject })
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
          navigate(OfflineDS, { displayName: (pageObject.name) ? pageObject.name : 'OfflineDataStore' })
          break;
        case PAGE_OUTSCAN:
          navigate(PostAssignmentScanner, { pageObject })

          break
        case PAGE_PAYNEAR_INITIALIZE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_PICKUP:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_PROFILE:
          navigate(ProfileView, { displayName: (pageObject.name) ? pageObject.name : 'Profile' })
          break;
        case PAGE_SEQUENCING: {
          dispatch(getRunsheetsForSequence(pageObject, navigationProps));
          break;
        }
        case PAGE_SORTING_PRINTING:
          navigate(Sorting, { displayName: (pageObject.name) ? pageObject.name : 'Sorting' })
          break;
        case PAGE_STATISTICS:
          navigate(Statistics, { displayName: (pageObject.name) ? pageObject.name : 'Statistics' })
          break;
        case PAGE_TABS:
          let updatedJobTransactionList = await keyValueDBService.getValueFromStore(UPDATE_JOBMASTERID_JOBID_MAP)
          if (updatedJobTransactionList && !isEmpty(updatedJobTransactionList.value)) {
            dispatch(setState(SET_UPDATED_TRANSACTION_LIST_IDS, updatedJobTransactionList.value))
          }
          navigate(TabScreen, { pageObject })
          break;
        default:
          throw new Error("Unknown page type " + pageObject.screenTypeId + ". Contact support");
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(2702, error.message, 'danger', 1)
    }
  }
}

export function customAppSelection(appModule, navigationProps) {
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
          (buttonIndex > -1 && buttonIndex < (BUTTONS.length - 1)) ? navigate(CustomApp, { customUrl: appModule[buttonIndex].customUrl }, navigationProps) : null
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
            navigate(BulkListing, { pageObject })
          }
        } else {
          dispatch(setState(syncLoader, 'error'))
        }
      }
      else {
        if (!isBulk) {
          dispatch(redirectToContainer(pageObject))
        } else {
          navigate(BulkListing, { pageObject })
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
      const mdmSettings = await keyValueDBService.getValueFromStore(MDM_POLICIES);
      if (mdmSettings && mdmSettings.value && mdmSettings.value.basicSetting && !mdmSettings.value.gpsTracking) {
        return;
      }
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
    try {
      const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      if (token && token.value) {

        //these callback will be triggered only when app is foreground or background
        FCM.on(FCMEvent.Notification, notif => {
          if (notif.Notification == 'Android push notification') {
            dispatch(performSyncService(true))
          }
          else if (notif.Notification == 'Live Job Notification') {
            keyValueDBService.validateAndSaveData('LIVE_JOB', new Boolean(false))
            dispatch(performSyncService(null, null, null, true))
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

        FCM.enableDirectChannel();
        FCM.on(FCMEvent.DirectChannelConnectionChanged, (data) => {
        });
        setTimeout(function () {
          FCM.isDirectChannelEstablished().then(d => { });
        }, 1000);

        FCM.getInitialNotification().then(notif => {
        });
        try {
          let result = await FCM.requestPermissions({
            badge: false,
            sound: true,
            alert: true
          });
        } catch (e) {
          showToastAndAddUserExceptionLog(2717, FCM_PERMISSION_DENIED + '\n' + e.message, 'danger', 1)
        }
        const userObject = await keyValueDBService.getValueFromStore(USER)
        const topic = `FE_${userObject.value.id}`

        FCM.getFCMToken().then(async fcmToken => {
          await keyValueDBService.validateAndSaveData(FCM_TOKEN, fcmToken)
          await sync.sendRegistrationTokenToServer(token, fcmToken, topic)

        }, (error) => {
        }).catch((error) => showToastAndAddUserExceptionLog(2716, FCM_REGISTRATION_ERROR + '\n' + error.message, 'danger', 1))

        if (Platform.OS === 'ios') {
          FCM.getAPNSToken().then(token => {
          }).catch(() => showToastAndAddUserExceptionLog(2718, APNS_TOKEN_ERROR, 'danger', 1))
        }

        // fcm token may not be available on first load, catch it here
        FCM.on(FCMEvent.RefreshToken, async fcmToken => {
          await keyValueDBService.validateAndSaveData(FCM_TOKEN, fcmToken)
          await sync.sendRegistrationTokenToServer(token, fcmToken, topic)
        });

      }
      else {
        Toast.show({ text: TOKEN_MISSING, position: 'bottom', buttonText: OK, duration: 6000 })
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(2715, error.message, 'danger', 1)
    }
  }
}

export function performSyncService(isCalledFromHome, erpPull, calledFromAutoLogout, isLiveJob,isCalledFromLogout) {
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

      //Case of Sync Started from Logout
      let syncRunningAllowed = await keyValueDBService.getValueFromStore(RUN_SYNC)
      if(syncRunningAllowed && !syncRunningAllowed.value){
          return
      }
      syncStoreDTO = await transactionCustomizationService.getSyncParamaters()
      const userData = syncStoreDTO.user
      const autoLogoutEnabled = userData ? userData.company ? userData.company.autoLogoutFromDevice : null : null
      const lastLoginTime = userData ? userData.lastLoginTime : null
      if (!calledFromAutoLogout && autoLogoutEnabled && !moment(moment(lastLoginTime).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))) {
        navDispatch(NavigationActions.navigate({ routeName: AutoLogoutScreen }))
        return
      }
      let syncCount = 0
      if (!erpPull) {
        dispatch(setState(SYNC_STATUS, {
          unsyncedTransactionList: syncStoreDTO.transactionIdToBeSynced ? syncStoreDTO.transactionIdToBeSynced : [],
          syncStatus: 'Uploading'
        }))
        const responseBody = await sync.createAndUploadZip(syncStoreDTO, currenDate,isCalledFromLogout)
        syncCount = parseInt(responseBody.split(",")[1])
      }
      isCalledFromHome = userData && userData.company && userData.company.customErpPullActivated ? false : isCalledFromHome
      //Downloading starts here
      //Download jobs only if sync count returned from server > 0 or if sync was started from home or Push Notification
      let isJobsPresent
      if (isCalledFromHome || syncCount > 0) {
        dispatch(setState(erpPull ? ERP_SYNC_STATUS : SYNC_STATUS, {
          unsyncedTransactionList: syncStoreDTO.transactionIdToBeSynced ? syncStoreDTO.transactionIdToBeSynced : [],
          syncStatus: 'Downloading'
        }))
        isJobsPresent = await sync.downloadAndDeleteDataFromServer(null, erpPull, syncStoreDTO);
      }
      if (isCalledFromHome || isLiveJob || syncCount > 0) {
        // check if live job module is present
        let liveJobPage = syncStoreDTO.pageList ? syncStoreDTO.pageList.filter((module) => module.screenTypeId == PAGE_LIVE_JOB) : null
        if (liveJobPage && liveJobPage.length > 0) {
          await sync.downloadAndDeleteDataFromServer(true, erpPull, syncStoreDTO)
          let showLiveJobNotification = await keyValueDBService.getValueFromStore('LIVE_JOB');
          if (showLiveJobNotification && showLiveJobNotification.value) {
            if (AppState.currentState == 'background' && Platform.OS !== 'ios') {
              Linking.canOpenURL('fareyeapp://fareye/liveJob').then(supported => {
                if (supported) {
                  return Linking.openURL('fareyeapp://fareye/liveJob');
                }
              });
            } else if (AppState.currentState == 'active') {
              popToTop()
              navigate(LiveJobs, { pageObject: liveJobPage[0], ringAlarm: true })
            }
            await keyValueDBService.validateAndSaveData('LIVE_JOB', new Boolean(false))
          }
        }
      }
      if (isJobsPresent) {
        dispatch(pieChartCount())
        let updatedJobTransactionList = await keyValueDBService.getValueFromStore(UPDATE_JOBMASTERID_JOBID_MAP)
        if(updatedJobTransactionList && !isEmpty(updatedJobTransactionList.value)){
          if(updatedJobTransactionList.value.runsheetClosed){
            dispatch(fetchJobs())
          }else{
            dispatch(setState(SET_UPDATED_TRANSACTION_LIST_IDS,updatedJobTransactionList.value))
          }
        }     
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
      if (isNull(serverReachable) || serverReachable.value == 2) {
        await userEventLogService.addUserEventLog(SERVER_REACHABLE, "")
        await keyValueDBService.validateAndSaveData(IS_SERVER_REACHABLE, 1)
      }
      return true;
    } catch (error) {
      showToastAndAddUserExceptionLog(2706, JSON.stringify(error), 'danger', 0)
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
      if (isNull(serverReachable) || serverReachable.value == 1) {
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
        dispatch(syncTimer())
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
    }
  }
}

export function syncTimer() {
  return async (dispatch) => {
    try {
      const difference = await sync.calculateDifference()
      dispatch(setState(LAST_SYNC_TIME, difference))
    } catch (error) {
      //Update UI here
    }
  }
}
export function pieChartCount() {
  return async (dispatch) => {
    try {
      if (Piechart.enabled) {
        dispatch(setState(CHART_LOADING, { loading: true }))
        const countForPieChart = await summaryAndPieChartService.getAllStatusIdsCount(Piechart.params)
        dispatch(setState(CHART_LOADING, { loading: false, count: countForPieChart }))
      }
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
        navDispatch(NavigationActions.navigate({ routeName: LoginScreen }));
      } else {
        dispatch(setState(SYNC_STATUS, {
          unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
          syncStatus: 'ERROR'
        }))
        let serverReachable = await keyValueDBService.getValueFromStore(IS_SERVER_REACHABLE)
        if (isNull(serverReachable) || serverReachable.value == 1) {
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
      let failCount = 0, successCount = 0
      const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      if (!token) {
        throw new Error('Token Missing')
      }
      for (let backupFile of backupFilesList) {
        try {
          let responseBody = await RestAPIFactory(token.value).uploadZipFile(backupFile.path, backupFile.name, null, true)
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
      let backupFilesList = await backupService.checkForUnsyncBackup(user.value)
      dispatch(setState(SET_BACKUP_FILES_LIST, backupFilesList))
      if (backupFilesList.length > 0) {
        dispatch(uploadUnsyncFiles(backupFilesList))
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(2710, error.message, 'danger', 1)
      dispatch(setState(SET_FAIL_UPLOAD_COUNT, 1))
      await keyValueDBService.validateAndSaveData(BACKUP_UPLOAD_FAIL_COUNT, 1)
    }
  }
}
export function resetFailCountInStore(isNavigateTrue) {
  return async function (dispatch) {
    try {
      await keyValueDBService.validateAndSaveData(BACKUP_UPLOAD_FAIL_COUNT, -1)
      if (isNavigateTrue) {
        const { value: { company: { customErpPullActivated: ErpCheck } } } = await keyValueDBService.getValueFromStore(USER)
        if (ErpCheck) {
          keyValueDBService.validateAndSaveData('LOGGED_IN_ROUTE', 'LoggedInERP')
          navDispatch(NavigationActions.navigate({ routeName: 'LoggedInERP' }));
        }
        else {
          keyValueDBService.validateAndSaveData('LOGGED_IN_ROUTE', 'LoggedIn')
          navDispatch(NavigationActions.navigate({ routeName: 'LoggedIn' }));
        }
      }
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

export function registerCallReceiver() {
  return async function (dispatch) {
    try {

      const mdmSettings = await keyValueDBService.getValueFromStore(MDM_POLICIES);
      if (!mdmSettings || !mdmSettings.value || !mdmSettings.value.basicSetting || !mdmSettings.value.enableCallerIdentity || !mdmSettings.value.callerIdentityDisplayList) {
        return
      }

      new CallDetectorManager(async (event, number) => {
        let dataObject = {}
        if (event === 'Incoming') {
          const callerIdentityDisplayList = JSON.parse(mdmSettings.value.callerIdentityDisplayList)
          let callerJobMasterIdList = [],
            callerJobAttributeIdList = []
          callerIdentityDisplayList.forEach(callerIdentityObject => {
            callerJobMasterIdList.push(callerIdentityObject.jobMasterId)
            callerJobAttributeIdList.push(...callerIdentityObject.jobAttributeIdList)
          })

          const allJobAttributes = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
          const callerJobAttributeData = jobAttributeMasterService.getCallerIdJobAttributeMapAndQuery(allJobAttributes, callerJobMasterIdList, callerJobAttributeIdList)
          dataObject = await jobDataService.getCallerIdListAndJobId(number, callerJobAttributeData.idJobAttributeMap, callerJobAttributeData.query, callerJobMasterIdList)
          if (dataObject && dataObject.isNumberPresentInJobData) {
            const job = jobService.getJobForJobId(dataObject.jobId)
            dispatch(setState(SET_CALLER_ID_POPUP, {
              callerIdDisplayList: dataObject.callerIdDisplayList,
              incomingNumber: number,
              referenceNumber: job[0].referenceNo,
              showCallerIdPopup: true,
            }))
          } else if (dataObject && dataObject.customerCareTitle) {
            dispatch(setState(SET_CALLER_ID_POPUP, {
              callerIdDisplayList: [],
              incomingNumber: number,
              referenceNumber: dataObject.customerCareTitle,
              showCallerIdPopup: true,
            }))
          }
        }
        else if (event === 'Missed') {
          dispatch(setState(SET_CALLER_ID_POPUP, {
            showCallerIdPopup: false,
          }))
        }
      },
        true, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
        () => { }, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
        {
          title: 'Phone State Permission',
          message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
        } // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
      )
    } catch (error) {
      console.log('error>>>', error)
    }
  }

}
export function handleCountDownTimerEvent(intentData) {
  return async function (dispatch) {
    try {
      if (AppState.currentState == 'active') {
        let jobTransaction = await countDownTimerService.navigateToJobDetailsAndScheduleAlarm(intentData)
        navigate(JobDetailsV2, { jobTransaction, jobSwipableDetails: {}, calledFromAlarm: true })
      } else if (AppState.currentState == 'background' && Platform.OS !== 'ios') {
        let intentDataString = JSON.stringify(intentData)
        Linking.canOpenURL('fareyeapp://fareye' + '/' + intentDataString).then(supported => {
          if (supported) {
            return Linking.openURL('fareyeapp://fareye' + '/' + intentDataString);
          } else {
            return
          }
        });
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(2713, error.message, 'danger', 1)
    }
  }
}
export function navigateToLiveJobOrJobDetails(url) {
  return async function (dispatch) {
    try {
      const route = url.replace(/.*?:\/\//g, '');
      const id = route.match(/\/([^\/]+)\/?$/)[1];
      if (id == 'liveJob') {
        dispatch(navigateToLiveJob())
      } else {
        let intentData = JSON.parse(id)
        dispatch(handleCountDownTimerEvent(intentData))
      }
    } catch (error) {
      showToastAndAddUserExceptionLog(2714, error.message, 'danger', 1)
    }
  }
}