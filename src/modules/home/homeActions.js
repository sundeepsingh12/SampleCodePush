'use strict'

import {
  CUSTOMIZATION_APP_MODULE,
  HOME_LOADING,
  JOB_DOWNLOADING_STATUS,
  USER,
} from '../../lib/constants'

import {
  SERVICE_ALREADY_SCHEDULED
} from '../../lib/AttributeConstants'

import CONFIG from '../../lib/config'
import {
  keyValueDBService
} from '../../services/classes/KeyValueDBService'
import {
  sync
} from '../../services/classes/Sync'
import BackgroundTimer from 'react-native-background-timer'
import {
  setState
} from '../global/globalActions'
import {
  moduleCustomizationService
} from '../../services/classes/ModuleCustomization'
import {
  Client
} from 'react-native-paho-mqtt'
import {fetchJobs} from '../taskList/taskListActions'


/**
 * This action enables modules for particular user
 */
export function fetchModulesList() {
  return async function (dispatch) {
    try {
      dispatch(setState(HOME_LOADING, {
        loading: true
      }))
      const appModulesList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
      const user = await keyValueDBService.getValueFromStore(USER)
      moduleCustomizationService.getActiveModules(appModulesList.value, user.value)
      dispatch(setState(HOME_LOADING, {
        loading: false
      }))
    } catch (error) {
      console.log(error)
    }
  }
}

/**
 * This services schedules sync service at interval of 2 minutes
 */
export function syncService() {
  return async(dispatch) => {
    try {
      if (CONFIG.intervalId) {
        throw new Error(SERVICE_ALREADY_SCHEDULED)
      }
      CONFIG.intervalId = BackgroundTimer.setInterval(async() => {
        dispatch(performSyncService())
      }, CONFIG.SYNC_SERVICE_DELAY)
    } catch (error) {
      //Update UI here
      console.log(error)
    }
  }
}

export function performSyncService(isCalledFromHome){
  return async function(dispatch){
    try{
      // this.props.actions.startMqttService()
      // await dispatch(startMqttService())
      const responseBody = await sync.createAndUploadZip()
      console.log('responseBody', responseBody)
      const syncCount = responseBody.split(",")[1]
      //Download jobs only if sync count returned from server > 0 or if sync was started from home or Push Notification
      if (isCalledFromHome || syncCount > 0) {
         const isJobsPresent =  await sync.downloadAndDeleteDataFromServer()
         if(isJobsPresent){
           dispatch(fetchJobs())
         }
      }
      //Now schedule sync service which will run regularly after 2 mins
      await dispatch(syncService())
    }catch(error){
      console.log(error)
    }
  }
}

export function startMqttService() {
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
        dispatch(performSyncService(true))
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
            dispatch(startMqttService())
          }
        })
    }
  }
}