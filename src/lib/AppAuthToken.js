/**
 * # AppAuthToken.js
 *
 * A thin wrapper over the react-native-simple-store
 *
 */
'use strict'
/**
 * ## Imports
 *
 * Redux  & the config file
 */
import store from 'react-native-simple-store'
import CONFIG from './config'
import CONSTANT from './constants'

export class AppAuthToken {
  /**
   * ## AppAuthToken
   *
   * set the key from the config
   */
  constructor () {
    this.SESSION_TOKEN_KEY = CONFIG.SESSION_TOKEN_KEY
    this.DEVICE_IMEI = CONSTANT.DEVICE_IMEI
    this.DEVICE_SIM = CONSTANT.DEVICE_SIM
  }

  /**
   * ### storeSessionToken
   * Store the session key
   */
  storeSessionToken (sessionToken) {
    return store.save(this.SESSION_TOKEN_KEY, {
      sessionToken: sessionToken
    })
  }

  /**
   * ### getSessionToken
   * @param {Object} sessionToken the currentUser object
   * Remember, the store is a promise so, have to be careful.
   */
  getSessionToken () {
    return store.get(this.SESSION_TOKEN_KEY)
  }
  
  /**
   * ### deleteSessionToken
   * Deleted during log out
   */
  deleteSessionToken () {
    return store.delete(this.SESSION_TOKEN_KEY)
  }

  storeDeviceIMEI(deviceIMEI) {
    return store.save(this.DEVICE_IMEI,{
      deviceIMEI: deviceIMEI
    })
  }

   getDeviceIMEI() {
    return store.get(this.DEVICE_IMEI)
  }

  deleteDeviceIMEI() {
    return store.delete(this.DEVICE_IMEI)
  }

  storeDeviceSIM(deviceSIM) {
    return store.save(this.DEVICE_SIM,{
      deviceSIM: deviceSIM
    })
  }

   getDeviceSIM() {
    return store.get(this.DEVICE_SIM)
  }

  deleteDeviceSIM() {
    return store.delete(this.DEVICE_SIM)
  }

}
// The singleton variable
export let appAuthToken = new AppAuthToken()
