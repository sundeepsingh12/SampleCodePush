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
  PIECHART
} from '../../lib/constants'
import {
  SERVICE_ALREADY_SCHEDULED,
  FAIL,
  SUCCESS,
} from '../../lib/AttributeConstants'

import { summaryAndPieChartService } from '../../services/classes/SummaryAndPieChart'
import CONFIG from '../../lib/config'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { sync } from '../../services/classes/Sync'
import BackgroundTimer from 'react-native-background-timer'
import { setState } from '../global/globalActions'
import { moduleCustomizationService } from '../../services/classes/ModuleCustomization'
import { Client } from 'react-native-paho-mqtt'
import { fetchJobs } from '../taskList/taskListActions'
import { NetInfo } from 'react-native'
import { jobStatusService } from '../../services/classes/JobStatus'

/**
 * This action enables modules for particular user
 */
export function fetchModulesList(modules, pieChart, menu) {
  return async function (dispatch) {
    try {
      dispatch(setState(HOME_LOADING, {
        loading: true
      }))
      const appModulesList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
      const user = await keyValueDBService.getValueFromStore(USER)
      const result = moduleCustomizationService.getActiveModules(appModulesList.value, user.value, modules, pieChart, menu)
      dispatch(setState(SET_MODULES, {
        loading: false,
        modules: result.modules,
        pieChart: result.pieChart,
        menu: result.menu
      }))
      if (result.pieChart[PIECHART].enabled) {
        dispatch(pieChartCount())
      }
    } catch (error) {
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
      const allStatusIds = await jobStatusService.getStatusIdsForAllStatusCategory()
      const {pendingStatusIds,failStatusIds,successStatusIds} = allStatusIds
      const count = summaryAndPieChartService.getAllStatusIdsCount(pendingStatusIds, successStatusIds, failStatusIds)
      dispatch(setState(CHART_LOADING, { loading: false, count }))
    } catch (error) {
      //Update UI here
      console.log(error)
    }
  }
}

export function performSyncService(pieChart, isCalledFromHome){
  return async function(dispatch){
    let transactionIdToBeSynced
    try{
       transactionIdToBeSynced = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
      dispatch(setState(SYNC_STATUS, {
        unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
        syncStatus: 'Uploading'
      }))
      const responseBody = await sync.createAndUploadZip(transactionIdToBeSynced)
      const syncCount = responseBody.split(",")[1]
      //Download jobs only if sync count returned from server > 0 or if sync was started from home or Push Notification
      if (isCalledFromHome || syncCount > 0) {
        dispatch(setState(SYNC_STATUS, {
          unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
          syncStatus: 'Downloading'
        }))
        const isJobsPresent = await sync.downloadAndDeleteDataFromServer()
        if (isJobsPresent) {
          if(pieChart[PIECHART].enabled){
            dispatch(pieChartCount())
          }
          dispatch(fetchJobs())
        }     
      }
      dispatch(setState(SYNC_STATUS, {
        unsyncedTransactionList: [],
        syncStatus: 'OK',
      }))
      //Now schedule sync service which will run regularly after 2 mins
      await dispatch(syncService(pieChart))
    } catch (error) {
      console.log(error)
      if (error.code == 500 || error.code == 502) {
        dispatch(setState(SYNC_STATUS, {
          unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
          syncStatus: 'INTERNALSERVERERROR'
        }))
      } else {
        let connectionInfo = await NetInfo.isConnected.fetch().then(isConnected => {
          return isConnected
        });

        console.log('connectionInfo isonline', connectionInfo)

        if (!connectionInfo) {
          dispatch(setState(SYNC_STATUS, {
            unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
            syncStatus: 'NOINTERNET'
          }))
        } else {
          dispatch(setState(SYNC_STATUS, {
            unsyncedTransactionList: transactionIdToBeSynced ? transactionIdToBeSynced.value : [],
            syncStatus: 'ERROR'
          }))
        }
      }
    }
  }
}

export function startMqttService(pieChart) {
  return async function (dispatch) {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    console.log('token', token)
    //Check if user session is alive
    if (token && token.value) {
      console.log('registerMqttClient')
      const uri = `ws://${CONFIG.API.PUSH_BROKER}:${CONFIG.FAREYE.port}/ws`
      console.log('uri', uri)
      const userObject = await keyValueDBService.getValueFromStore(USER)
      const clientId = `FE_${userObject.value.id}`
      console.log('clientId', clientId)
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
        dispatch(performSyncService(pieChart, true))
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