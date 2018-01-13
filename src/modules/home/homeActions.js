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
} from '../../lib/constants'
import {
  SERVICE_ALREADY_SCHEDULED,
  FAIL,
  SUCCESS,
  Piechart,
  SERVER_REACHABLE,
  SERVER_UNREACHABLE,
} from '../../lib/AttributeConstants'

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

import moment from 'moment'
import {
  invalidateUserSessionForAutoLogout
} from '../pre-loader/preloaderActions'
import {
  NavigationActions
} from 'react-navigation'
/**
 * This action enables modules for particular user
 */
export function fetchModulesList(modules, pieChart, menu) {
  return async function (dispatch) {
    try {
      dispatch(setState(HOME_LOADING, {
        moduleLoading: true
      }))
      const appModulesList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
      const user = await keyValueDBService.getValueFromStore(USER)
      const result = moduleCustomizationService.getActiveModules(appModulesList.value, user.value, modules, pieChart, menu)
      dispatch(setState(SET_MODULES, {
        moduleLoading: false,
        modules: result.modules,
        pieChart: result.pieChart,
        menu: result.menu
      }))
      if (result.pieChart[PIECHART].enabled) {
        dispatch(pieChartCount())
      }
    }catch (error) {
      console.log(error)
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
      const { pendingStatusIds, failStatusIds, successStatusIds, noNextStatusIds }  = await jobStatusService.getStatusIdsForAllStatusCategory()
      const count = await summaryAndPieChartService.getAllStatusIdsCount(pendingStatusIds, successStatusIds, failStatusIds, noNextStatusIds)
      dispatch(setState(CHART_LOADING, { loading: false, count }))
    } catch (error) {
      //Update UI here
      console.log(error)
      dispatch(setState(CHART_LOADING, { loading: false, count: null }))
    }
  }
}

export function performSyncService(pieChart, isCalledFromHome, isLiveJob) {
  return async function (dispatch) {
    let transactionIdToBeSynced
    try {
      const userData = await keyValueDBService.getValueFromStore(USER)      
      if(userData && userData.value && userData.value.company &&  userData.value.company.autoLogoutFromDevice && !moment(moment(userData.value.lastLoginTime).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))){      
        dispatch(NavigationActions.navigate({ routeName: AutoLogoutScreen}))
      }else{
      let saveStoreObject = {
        showLiveJobNotification: false
      }
      keyValueDBService.validateAndSaveData('LIVE_JOB', saveStoreObject)
      transactionIdToBeSynced = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
      dispatch(setState(SYNC_STATUS, {
        unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
        syncStatus: 'Uploading'
      }))
      const responseBody = await sync.createAndUploadZip(transactionIdToBeSynced)
      const syncCount = parseInt(responseBody.split(",")[1])
      //Download jobs only if sync count returned from server > 0 or if sync was started from home or Push Notification
      if (isCalledFromHome || syncCount > 0) {
        console.log(isCalledFromHome, syncCount)
        dispatch(setState(SYNC_STATUS, {
          unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
          syncStatus: 'Downloading'
        }))
        const isJobsPresent = await sync.downloadAndDeleteDataFromServer()
        const isLiveJobsPresent = await sync.downloadAndDeleteDataFromServer(true)
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
      dispatch(setState(SYNC_STATUS, {
        unsyncedTransactionList: [],
        syncStatus: 'OK',
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
      if (error.code == 500 || error.code == 502) {
        dispatch(setState(SYNC_STATUS, {
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
          dispatch(setState(SYNC_STATUS, {
            unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
            syncStatus: 'ERROR'
          }))
        } else {
          dispatch(setState(SYNC_STATUS, {
            unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
            syncStatus: 'NOINTERNET'
          }))
        }
      }
    } finally {
      const difference = await sync.calculateDifference()
      dispatch(setState(LAST_SYNC_TIME, difference))
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
          let saveStoreObject = {
            showLiveJobNotification: true
          }
          keyValueDBService.validateAndSaveData('LIVE_JOB', saveStoreObject)
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
