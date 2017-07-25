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
  onResyncPress
} from '../home/homeActions'

import {
  clearHomeState
} from '../home/homeActions'

var mqtt = require('react-native-mqtt');


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
    //Check if user session is alive
    if (token) { 
      console.log('registerMqttClient')
      const uri = `mqtt://${CONFIG.API.PUSH_BROKER}:${CONFIG.FAREYE.port}`
      console.log('uri', uri)
      const userObject = await keyValueDBService.getValueFromStore(USER)
      const clientId = `FE_${userObject.value.id}`
      console.log('clientId', clientId)
      console.log('mqtt', mqtt)
      mqtt.createClient({
        uri,
        clientId
      }).then(client => {

        client.on('closed', () => {
          console.log('mqtt.event.closed');
        });

        client.on('error', msg => {
          console.log('mqtt.event.error', msg);

        });

        client.on('message', msg => {
          console.log('mqtt.event.message', msg);
          dispatch(onResyncPress())
        });

        client.on('connect', () => {
          console.log('connected');
          const test = `${clientId}/#`
          console.log('test', test)
          client.subscribe(`${clientId}/#`, CONFIG.FAREYE.PUSH_QOS);
        });

        client.connect();
      }).catch(err => {
        console.log('inside catch')
        console.log(err);
      });
    }
  }
}

export function stopMqttService() {
  return async function (dispatch) {
    const client = mqtt.clients[0];
    client.disconnect()
  }
}
