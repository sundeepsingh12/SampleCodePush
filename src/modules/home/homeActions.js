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
  LiveJobs,
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
  JOB_MASTER,
  SAVE_ACTIVATED,
  NewJobStatus,
  NEW_JOB_STATUS,
  NEW_JOB_MASTER,
  POPULATE_DATA,
  NewJob,
  BulkListing
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
import { Toast } from 'native-base'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { summaryAndPieChartService } from '../../services/classes/SummaryAndPieChart'
import { trackingService } from '../../services/classes/Tracking'
import { jobStatusService } from '../../services/classes/JobStatus'
import { userEventLogService } from '../../services/classes/UserEvent'
import { setState, navigateToScene } from '../global/globalActions'
import CONFIG from '../../lib/config'
import { Client } from 'react-native-paho-mqtt'
import { sync } from '../../services/classes/Sync'
import { NetInfo } from 'react-native'
import moment from 'moment'
import BackgroundTimer from 'react-native-background-timer'
import { fetchJobs } from '../taskList/taskListActions'
import { utilitiesService } from '../../services/classes/Utilities'
import { transactionCustomizationService } from '../../services/classes/TransactionCustomization';

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
      //Fetching list of Pages
      const pageList = await keyValueDBService.getValueFromStore(PAGES);
      //TODO : Reduce the list to only show MAIN_MENU items, Group by "Group name" and Sort by sequence

      //Fetching list of Home screen Utilities 
      const utilityList = await keyValueDBService.getValueFromStore(PAGES_ADDITIONAL_UTILITY);
      //Looping over Utility list to check if Piechart and Messaging are enabled
      let pieChartEnabled = false;
      let messagingEnabled = false;
      _.each(utilityList.value, function (utility) {
        (utility.utilityID == PAGE_SUMMARY_PIECHART) ? pieChartEnabled = utility.enabled : null;
        (utility.utilityID == PAGE_MESSAGING) ? messagingEnabled = utility.enabled : null;
      })

      //Fetching Summary count for Pie-chart
      const { pendingStatusIds, failStatusIds, successStatusIds, noNextStatusIds } = await jobStatusService.getStatusIdsForAllStatusCategory()
      const pieChartSummaryCount = await summaryAndPieChartService.getAllStatusIdsCount(pendingStatusIds, successStatusIds, failStatusIds, noNextStatusIds)

      //Finally updating state
      dispatch(setState(SET_PAGES_UTILITY_N_PIESUMMARY, { pageList, pieChartEnabled, messagingEnabled, pieChartSummaryCount }));
    } catch (error) {
      //TODO : show proper error code message ERROR CODE 600
      //Save the error in exception logs
      Toast.show({ text: error.message, position: "bottom" | "center", buttonText: 'OKAY', type: 'danger', duration: 50000 })
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
          throw new Error("CODE it, if you want to use it !");
        case PAGE_BLUETOOTH_PAIRING:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_BULK_UPDATE: {
          dispatch(navigateToScene(BulkListing, { pageObject }));
          break;
        }
        case PAGE_CUSTOM_WEB_PAGE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_EZETAP_INITIALIZE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_INLINE_UPDATE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_JOB_ASSIGNMENT:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_LIVE_JOB:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_MOSAMBEE_INITIALIZE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_MSWIPE_INITIALIZE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_NEW_JOB:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_OFFLINE_DATASTORE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_OUTSCAN:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_PAYNEAR_INITIALIZE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_PICKUP:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_PROFILE:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_SEQUENCING:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_SORTING_PRINTING:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_STATISTICS:
          throw new Error("CODE it, if you want to use it !");
        case PAGE_TABS:
          dispatch(navigateToScene(TabScreen, pageObject));
          break;
        default:
          throw new Error("Unknown page type " + pageObject.screenTypeId + ". Contact support");
      }
    } catch (error) {
      //TODO : show proper error code message ERROR CODE 600
      //Save the error in exception logs
      console.log(error)
      Toast.show({ text: error.message, position: "bottom" | "center", buttonText: 'Lets Code', type: 'danger', duration: 50000 })
    }
  }
}

export function checkCustomErpPullActivated() {
  return async function (dispatch) {
    try {
      const user = await keyValueDBService.getValueFromStore(USER)
      const customErpPullActivated = user && user.value && user.value.company && user.value.company.customErpPullActivated ? 'activated' : 'notActivated'
      dispatch(setState(SET_ERP_PULL_ACTIVATED, { customErpPullActivated }))
    } catch (error) {
      console.log(error)
    }
  }
}

export function startTracking() {
  return async function (dispatch) {
    trackingService.init()
  }
}

export function startMqttService(pieChart) {
  return async function (dispatch) {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    //Check if user session is alive
    if (token && token.value) {
      const uri = `ws://${CONFIG.API.PUSH_BROKER}:${CONFIG.FAREYE.port}/ws`
      const userObject = await keyValueDBService.getValueFromStore(USER)
      const clientId = `FE_${userObject.value.id}`
      const storage = {
        setItem: (key, item) => {
          storage[key] = item;
        },
        getItem: (key) => storage[key],
        removeItem: (key) => {
          delete storage[key]
        },
      };

      // Create a client instance 
      const client = new Client({
        uri,
        clientId,
        storage
      })

      // set event handlers 
      //TODO connection re-establishment on connection lost
      client.on('connectionLost', responseObject => {
      })
      client.on('messageReceived', message => {
        if (message.payloadString == 'Live Job Notification') {
          keyValueDBService.validateAndSaveData('LIVE_JOB', new Boolean(false))
          dispatch(performSyncService(pieChart, true, true))
        } else {
          dispatch(performSyncService(pieChart, true))
        }
      })

      // connect the client 
      client.connect()
        .then(() => {
          // Once a connection has been made, make a subscription 
          return client.subscribe(`${clientId}/#`, CONFIG.FAREYE.PUSH_QOS);
        })
        .catch(responseObject => {
          console.log('catch', responseObject)
          if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:' + responseObject.errorMessage);
            // dispatch(startMqttService())
          }
        })
    }
  }
}

export function performSyncService(pieChart, isCalledFromHome, isLiveJob, erpPull) {
  return async function (dispatch) {
    let syncStoreDTO
    try {
      syncStoreDTO = await transactionCustomizationService.getSyncParamaters()
      const userData = syncStoreDTO.user
      const autoLogoutEnabled = userData ? userData.company ? userData.company.autoLogoutFromDevice : null : null
      const lastLoginTime = userData ? userData.lastLoginTime : null
      if (autoLogoutEnabled && !moment(moment(lastLoginTime).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))) {
        dispatch(navigateToScene(AutoLogoutScreen));
        return
      }
      const syncCount = 0
      if (!erpPull) {
        dispatch(setState(SYNC_STATUS, {
          unsyncedTransactionList: syncStoreDTO.transactionIdToBeSynced ? syncStoreDTO.transactionIdToBeSynced : [],
          syncStatus: 'Uploading'
        }))
        const responseBody = await sync.createAndUploadZip(syncStoreDTO)
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
        const isLiveJobsPresent = await sync.downloadAndDeleteDataFromServer(true, erpPull, syncStoreDTO);
        if (isJobsPresent) {
          if (Piechart.enabled) {
            dispatch(pieChartCount())
          }
          dispatch(fetchJobs())
        }
        if (isLiveJob) {
          dispatch(navigateToScene(LiveJobs, { callAlarm: true }))
        }
      }
      dispatch(setState(erpPull ? ERP_SYNC_STATUS : SYNC_STATUS, {
        unsyncedTransactionList: [],
        syncStatus: 'OK',
        erpModalVisible: true,
        lastErpSyncTime: userData.lastERPSyncWithServer
      }))
      //Now schedule sync service which will run regularly after 2 mins
      await dispatch(syncService(pieChart))
      let serverReachable = await keyValueDBService.getValueFromStore(IS_SERVER_REACHABLE)
      if (_.isNull(serverReachable) || serverReachable.value == 2) {
        await userEventLogService.addUserEventLog(SERVER_REACHABLE, "")
        await keyValueDBService.validateAndSaveData(IS_SERVER_REACHABLE, 1)
      }
    } catch (error) {
      console.log(error)
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
    } finally {
      if (!erpPull) {
        const difference = await sync.calculateDifference()
        dispatch(setState(LAST_SYNC_TIME, difference))
      }
    }
  }
}

/**
 * This services schedules sync service at interval of 2 minutes
 */
export function syncService(pieChart) {
  return async (dispatch) => {
    try {
      if (CONFIG.intervalId) {
        throw new Error(SERVICE_ALREADY_SCHEDULED)
      }
      CONFIG.intervalId = BackgroundTimer.setInterval(async () => {
        dispatch(performSyncService(pieChart))
      }, CONFIG.SYNC_SERVICE_DELAY)
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
      const { pendingStatusIds, failStatusIds, successStatusIds, noNextStatusIds } = await jobStatusService.getStatusIdsForAllStatusCategory()
      const count = await summaryAndPieChartService.getAllStatusIdsCount(pendingStatusIds, successStatusIds, failStatusIds, noNextStatusIds)
      dispatch(setState(CHART_LOADING, { loading: false, count }))
    } catch (error) {
      //Update UI here
      console.log(error)
      dispatch(setState(CHART_LOADING, { loading: false, count: null }))
    }
  }
}