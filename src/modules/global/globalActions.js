/**
 * # globalActions.js
 *
 * Actions that are global in nature
 */
'use strict'

const {
  SET_SESSION_TOKEN,
  SET_STORE,
  ON_GLOBAL_USERNAME_CHANGE,
  ON_GLOBAL_PASSWORD_CHANGE,
  SET_CREDENTIALS,
  LOGOUT_START,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  USER_SUMMARY,
  JOB_SUMMARY,
  IS_SHOW_MOBILE_NUMBER_SCREEN,
  IS_SHOW_OTP_SCREEN,
  IS_PRELOADER_COMPLETE,
  USER

} = require('../../lib/constants').default

import {
  keyValueDBService
} from '../../services/classes/KeyValueDBService'

import CONFIG from '../../lib/config'

import {
  onChangePassword,
  onChangeUsername
} from '../login/loginActions'

import {
  clearHomeState
} from '../home/homeActions'

import {
  onResyncPress
} from '../home/homeActions'

import {
  Client
} from 'react-native-paho-mqtt'


/**
 * ## set the store
 *
 * this is the Redux store
 *
 * this is here to support Hot Loading
 *
 */
export function setStore(store) {
  return {
    type: SET_STORE,
    payload: store
  }
}

//Deletes values from store
export function deleteSessionToken() {
  return async function (dispatch) {
    try {
      await keyValueDBService.deleteValueFromStore(JOB_SUMMARY)
      await keyValueDBService.deleteValueFromStore(USER_SUMMARY)
      await keyValueDBService.deleteValueFromStore(IS_SHOW_MOBILE_NUMBER_SCREEN)
      await keyValueDBService.deleteValueFromStore(IS_SHOW_OTP_SCREEN)
      await keyValueDBService.deleteValueFromStore(IS_PRELOADER_COMPLETE)
      await keyValueDBService.deleteValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      dispatch(onChangePassword(''))
      dispatch(onChangeUsername(''))
      dispatch(clearHomeState())
    } catch (error) {
      throw error
    }
  }

}

export function startMqttService() {
  return async function (dispatch) {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    console.log('token',token)
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
          delete storage[key];
        },
      };

      // Create a client instance 
      const client = new Client({
        uri,
        clientId,
        storage
      });

      // set event handlers 
      client.on('connectionLost', responseObject => {
        console.log('connectionLost', responseObject)
        if (responseObject.errorCode !== 0) {
          console.log(responseObject.errorMessage);
        }
      });
      client.on('messageReceived', message => {
        console.log('message.payloadString',message.payloadString);
        dispatch(onResyncPress())
      });

      // connect the client 
      client.connect()
        .then(() => {
          // Once a connection has been made, make a subscription 
          console.log('onConnect');
          return client.subscribe(`${clientId}/#`, CONFIG.FAREYE.PUSH_QOS);
        })
        .catch(responseObject => {
          console.log('catch', responseObject)
          if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:' + responseObject.errorMessage);
          }
        });

    }
  }
}