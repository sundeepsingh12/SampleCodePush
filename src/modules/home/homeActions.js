'use strict'

import {
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
  SET_NEWJOB_DRAFT_INFO
} from '../../lib/constants'
import {
  SERVICE_ALREADY_SCHEDULED,
  FAIL,
  SUCCESS,
  Piechart,
  SERVER_REACHABLE,
  SERVER_UNREACHABLE,
  PAGE_NEW_JOB,
} from '../../lib/AttributeConstants'
import {
  NEW_JOB_CONFIGURATION_ERROR,
  OK
} from '../../lib/ContainerConstants'
import { summaryAndPieChartService } from '../../services/classes/SummaryAndPieChart'
import CONFIG from '../../lib/config'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { sync } from '../../services/classes/Sync'
import BackgroundTimer from 'react-native-background-timer'
import { setState, navigateToScene, deleteSessionToken } from '../global/globalActions'
import { moduleCustomizationService } from '../../services/classes/ModuleCustomization'
import { Client } from 'react-native-paho-mqtt'
import { fetchJobs } from '../taskList/taskListActions'
import { NetInfo } from 'react-native'
import { jobStatusService } from '../../services/classes/JobStatus'
import { trackingService } from '../../services/classes/Tracking'
import { authenticationService } from '../../services/classes/Authentication'
import { logoutService } from '../../services/classes/Logout'
import _ from 'lodash'
import { userEventLogService } from '../../services/classes/UserEvent'
import RestAPIFactory from '../../lib/RestAPIFactory'

import moment from 'moment'
import {
  invalidateUserSessionForAutoLogout
} from '../pre-loader/preloaderActions'
import {
  NavigationActions
} from 'react-navigation'
import { backupService } from '../../services/classes/BackupService';
import { autoLogoutAfterUpload } from '../backup/backupActions'
import {
  Toast
} from 'native-base'
import { redirectToContainer, redirectToFormLayout } from '../newJob/newJobActions';
import { restoreDraftAndNavigateToFormLayout } from '../form-layout/formLayoutActions';
/**
 * This action enables modules for particular user
 */
export function fetchModulesList(modules, pieChart, menu, newJobModules) {
  return async function (dispatch) {
    try {
      dispatch(setState(HOME_LOADING, {
        moduleLoading: true
      }))
      const appModulesList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
      const user = await keyValueDBService.getValueFromStore(USER)
      const result = moduleCustomizationService.getActiveModules(appModulesList.value, user.value, modules, pieChart, menu, newJobModules)
      const customErpPullActivated = user && user.value && user.value.company && user.value.company.customErpPullActivated ? true : false
      dispatch(setState(SET_MODULES, {
        moduleLoading: false,
        modules: result.modules,
        newJobModules: result.newJobModules,
        pieChart: result.pieChart,
        menu: result.menu,
      }))
      if (result.pieChart[PIECHART].enabled) {
        dispatch(pieChartCount())
      }
    } catch (error) {
      console.log(error)
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

export function performSyncService(pieChart, isCalledFromHome, isLiveJob, erpPull) {
  return async function (dispatch) {
    let transactionIdToBeSynced
    try {
      const userData = await keyValueDBService.getValueFromStore(USER)
      if (userData && userData.value && userData.value.company && userData.value.company.autoLogoutFromDevice && !moment(moment(userData.value.lastLoginTime).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))) {
        dispatch(NavigationActions.navigate({ routeName: AutoLogoutScreen }))
      } else {
        transactionIdToBeSynced = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
        const syncCount = 0
        if (!erpPull) {
          dispatch(setState(SYNC_STATUS, {
            unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
            syncStatus: 'Uploading'
          }))
          const responseBody = await sync.createAndUploadZip(transactionIdToBeSynced)
          syncCount = parseInt(responseBody.split(",")[1])
        }
        //Download jobs only if sync count returned from server > 0 or if sync was started from home or Push Notification
        if (isCalledFromHome || syncCount > 0) {
          console.log(isCalledFromHome, syncCount)
          dispatch(setState(erpPull ? ERP_SYNC_STATUS : SYNC_STATUS, {
            unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
            syncStatus: 'Downloading'
          }))
          const isJobsPresent = await sync.downloadAndDeleteDataFromServer(null, erpPull, userData.value)
          const isLiveJobsPresent = await sync.downloadAndDeleteDataFromServer(true, erpPull, userData.value)
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
          lastErpSyncTime: userData.value.lastERPSyncWithServer
        }))
        //Now schedule sync service which will run regularly after 2 mins
        await dispatch(syncService(pieChart))
        let serverReachable = await keyValueDBService.getValueFromStore(IS_SERVER_REACHABLE)
        if (_.isNull(serverReachable) || serverReachable.value == 2) {
          await userEventLogService.addUserEventLog(SERVER_REACHABLE, "")
          await keyValueDBService.validateAndSaveData(IS_SERVER_REACHABLE, 1)
        }
      }
    } catch (error) {
      console.log(error)
      if (error.code == 500 || error.code == 502) {
        dispatch(setState(erpPull ? ERP_SYNC_STATUS : SYNC_STATUS, {
          unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
          syncStatus: 'INTERNALSERVERERROR'
        }))
        let serverReachable = await keyValueDBService.getValueFromStore(IS_SERVER_REACHABLE)
        if (_.isNull(serverReachable) || serverReachable.value == 1) {
          await userEventLogService.addUserEventLog(SERVER_UNREACHABLE, "")
          await keyValueDBService.validateAndSaveData(IS_SERVER_REACHABLE, 2)
        }
      } else if (error.code == 401) {
        dispatch(reAuthenticateUser(transactionIdToBeSynced))
      } else {
        let connectionInfo = await NetInfo.getConnectionInfo().then(reachability => {
          if (reachability.type === 'unknown') {
            return new Promise(resolve => {
              const handleFirstConnectivityChangeIOS = isConnected => {
                NetInfo.isConnected.removeEventListener('connectionChange', handleFirstConnectivityChangeIOS);
                resolve(isConnected);
              };
              NetInfo.isConnected.addEventListener('connectionChange', handleFirstConnectivityChangeIOS);
            });
          }
          return (reachability.type !== 'none' && reachability.type !== 'unknown')
        });
        if (connectionInfo) {
          dispatch(setState(erpPull ? ERP_SYNC_STATUS : SYNC_STATUS, {
            unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
            syncStatus: 'ERROR'
          }))
        } else {
          dispatch(setState(erpPull ? ERP_SYNC_STATUS : SYNC_STATUS, {
            unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
            syncStatus: 'NOINTERNET'
          }))
        }
      }
    } finally {
      if (!erpPull) {
        const difference = await sync.calculateDifference()
        dispatch(setState(LAST_SYNC_TIME, difference))
      }
    }
  }
}

export function startMqttService(pieChart) {
  return async function (dispatch) {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    //Check if user session is alive
    if (token && token.value) {
      console.log('registerMqttClient')
      const uri = `ws://${CONFIG.API.PUSH_BROKER}:${CONFIG.FAREYE.port}/ws`
      console.log('uri', uri)
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
      client.on('connectionLost', responseObject => {
        console.log('connectionLost', responseObject)
        if (responseObject.errorCode !== 0) {
          console.log(responseObject.errorMessage);
        }
      })
      client.on('messageReceived', message => {
        console.log('message.payloadString', message.payloadString)
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
          console.log('onConnect')
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

export function startTracking() {
  return async function (dispatch) {
    trackingService.init()
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
          //let responseBody = 'Fail'
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
      console.log(error)
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
      console.log(error)
    }
  }
}
export function resetFailCountInStore() {
  return async function (dispatch) {
    try {
      await keyValueDBService.validateAndSaveData(BACKUP_UPLOAD_FAIL_COUNT, -1)
    } catch (error) {
      console.log(error)
    }
  }
}

export function navigateToPage(pageObject) {
  return async function (dispatch) {
    try {
      switch (pageObject.screenTypeId) {
        case PAGE_NEW_JOB:
          dispatch(redirectToContainer(pageObject))
          break
        default:
          throw new Error("Unknown page type " + pageObject.screenTypeId + ". Contact support")
      }
    } catch (error) {
      console.log(error)
      Toast.show({ text: error.message, position: "bottom" | "center", buttonText: 'Lets Code', type: 'danger', duration: 50000 })
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
      console.log(error)
    }
  }
}
