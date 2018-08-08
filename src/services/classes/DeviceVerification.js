'use strict'

import { keyValueDBService } from './KeyValueDBService'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import DeviceInfo from 'react-native-device-info'
import { Platform } from 'react-native'
import _ from 'lodash'
let imei = require('../../wrapper/IMEI')
import {
  DEVICE_IMEI,
  DEVICE_SIM,
  IS_PRELOADER_COMPLETE,
  IS_SHOW_MOBILE_OTP_SCREEN,
} from '../../lib/constants'
import { SHOW_MOBILE_SCREEN } from '../../lib/ContainerConstants'

class DeviceVerification {

  /**POST API
   * Request body
   * {
      "deviceIMEI": {
         
      },
      "deviceSIM": {
        
      }
  }
   * 
   * @param {*} deviceIMEI 
   * @param {*} deviceSIM 
   * @param {*} token 
   * 
   * Expected JSON response body
   * {
      "deviceIMEI": {
         
      },
      "deviceSIM": {
        
      }
  }
   * 
   */
  checkAssetAPI(deviceIMEI, deviceSIM, token) {
    if (!deviceIMEI || !deviceSIM) {
      deviceIMEI = {}
      deviceSIM = {}
    }
    const postData = JSON.stringify({
      deviceIMEI,
      deviceSIM
    })
    let checkAssetResponse = RestAPIFactory(token.value).serviceCall(postData, CONFIG.API.CHECK_ASSET_API, 'POST')
    return checkAssetResponse
  }

  /**Check if sim/imei is locally verified or not
   * 
   * @param {*} deviceIMEI 
   * @param {*} deviceSIM 
   * @param {*} user 
   */

  async checkAssetLocal(deviceIMEI, deviceSIM, user) {
    if (!user) {
      throw new Error('Value of user missing')
    }
    const companyId = (user.company) ? user.company.id : 0;
    if (!deviceIMEI || !deviceSIM || !deviceSIM.value.isVerified || deviceSIM.value.companyId != companyId) {
      await this.populateDeviceImeiAndDeviceSim(user)
      return false
    } else {
      await keyValueDBService.validateAndSaveData(IS_PRELOADER_COMPLETE, true)
      if (user.hubId != deviceIMEI.value.hubId) {
        deviceIMEI.value.hubId = user.hubId;
        await keyValueDBService.validateAndSaveData(DEVICE_IMEI, deviceIMEI.value)
      }
    }
    return true
  }

  /**populates device sim and device imei in store
   * 
   * @param {*} user 
   */
  async populateDeviceImeiAndDeviceSim(user) {
    let imeiNumber, simNumber
    if (Platform.OS === 'ios') {
      imeiNumber = DeviceInfo.getUniqueID()
      simNumber = imeiNumber
    } else {
      imeiNumber = await imei.getIMEI()
      simNumber = await imei.getSim()
    }
    await this.populateDeviceImei(user, imeiNumber)
    await this.populateDeviceSim(user, simNumber)
  }

  /**Saves deviceIMEI in store
   * 
   * @param {*} user 
   * @param {*} imeiNumber 
   */
  async populateDeviceImei(user, imeiNumber) {
    const deviceImei = {
      hubId: user.hubId,
      cityId: user.cityId,
      companyId: user.company.id,
      userId: user.id,
      imeiNumber
    }
    await keyValueDBService.validateAndSaveData(DEVICE_IMEI, deviceImei)
  }

  /**This saves device sim in store
   *
   * @param user
   * @param simNumber
   */
  async populateDeviceSim(user, simNumber) {
    const deviceSim = {
      hubId: user.hubId,
      cityId: user.cityId,
      companyId: user.company.id,
      userId: user.id,
      simNumber,
      isVerified: false,
    }
    await keyValueDBService.validateAndSaveData(DEVICE_SIM, deviceSim)
  }

  /**POST API
   * 
   * @param {*} mobileNumber 
   * 
   *  Request body
   * mobileNumber
   * 
   * Expected Response Body
   * {
    "id": 3014,
    "hubId": 2757,
    "cityId": 744,
    "companyId": 295,
    "userId": 4954,
    "lastUsed": "2017-05-12 14:39:22",
    "simNumber": "8991000900205994810",
    "contactNumber": "9717827785",
    "otpNumber": 156967,
    "isVerified": true,
    "otpExpiryTime": "2016-01-06 18:59:36",
    "deviceIMEI": {
        "id": 2765,
        "hubId": 2757,
        "cityId": 744,
        "companyId": 295,
        "userId": 4954,
        "imeiNumber": "353490069328223",
        "lastUsed": "2017-05-12 14:39:22",
        "isAuthorized": false,
        "mdmStatus": 0,
        "dataConsumptionByFarEye": "3.3699934E7",
        "overallDataConsumptionViaWifi": "2.3466468041E10",
        "overallDataConsumptionViaNetwork": "1.248407761E9"
    }
}
   */

  async generateOTP(mobileNumber) {
    let reg = new RegExp('^[0-9]+$')
    if (!reg.test(_.trim(mobileNumber))) {
      throw new Error('Mobile number not valid')
    }
    let deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    if (!token || !token.value) {
      throw new Error('Token Missing')
    }
    if (!deviceSIM || !deviceSIM.value) {
      throw new Error('Value of sim missing')
    }
    deviceSIM.value.contactNumber = mobileNumber
    let generateOtpResponse = await RestAPIFactory(token.value).serviceCall(JSON.stringify(deviceSIM.value), CONFIG.API.GENERATE_OTP_API, 'POST')
    await keyValueDBService.validateAndSaveData(DEVICE_SIM, generateOtpResponse.json)
  }

  /**POST API
   * 
   * @param {*} otpNumber 
   * 
   * Request body
   * deviceSIM
   * 
   * Expected Response body
   * 
   */
  async verifySim(otpNumber) {
    let reg = new RegExp('^[0-9]+$')
    if (!reg.test(_.trim(otpNumber))) {
      throw new Error('OTP number not valid')
    }
    const deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
    if (deviceSIM && deviceSIM.value && otpNumber != deviceSIM.value.otpNumber) {
      throw new Error('Password did not match, Please try again')
    }
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    if (!token || !token.value) {
      throw new Error('Token Missing')
    }
    let simVerificationResponse = await RestAPIFactory(token.value).serviceCall(JSON.stringify(deviceSIM.value), CONFIG.API.SIM_VERIFICATION_API, 'POST')
    await keyValueDBService.validateAndSaveData(IS_PRELOADER_COMPLETE, true)
    await keyValueDBService.deleteValueFromStore(IS_SHOW_MOBILE_OTP_SCREEN)
  }


  async checkAssetApiAndSimVerificationOnServer(token, deviceObject) {
    if (!token || !token.value) {
      throw new Error('Token Missing')
    }
    const deviceIMEI = deviceObject.deviceIMEI
    const deviceSIM = deviceObject.deviceSIM
    const response = await this.checkAssetAPI(deviceIMEI.value, deviceSIM.value, token)
    if (!response || !response.json) {
      throw new Error('No response returned from server')
    }
    await keyValueDBService.validateAndSaveData(DEVICE_IMEI, response.json.deviceIMEI)
    await keyValueDBService.validateAndSaveData(DEVICE_SIM, response.json.deviceSIM)
    if (response.json.deviceSIM && response.json.deviceSIM.isVerified) {
      await keyValueDBService.validateAndSaveData(IS_PRELOADER_COMPLETE, true)
    } else {
      await keyValueDBService.validateAndSaveData(IS_SHOW_MOBILE_OTP_SCREEN, SHOW_MOBILE_SCREEN)
    }
    return response.json.deviceSIM ? response.json.deviceSIM.isVerified : false
  }

  sendLongSms(user, deviceObject, domainUrl) {
    let domain = domainUrl && domainUrl.value ? domainUrl.value.split('//')[1].split('.')[0] : '';
    let longCodePreAppendText = deviceObject.longCodeConfiguration && deviceObject.longCodeConfiguration.value && deviceObject.longCodeConfiguration.value.longCodePreAppendText ? deviceObject.longCodeConfiguration.value.longCodePreAppendText : '';
    let simNumber = deviceObject.deviceSIM && deviceObject.deviceSIM.value && deviceObject.deviceSIM.value.simNumber ? deviceObject.deviceSIM.value.simNumber : '';
    let imeiId = deviceObject.deviceSIM && deviceObject.deviceSIM.value && deviceObject.deviceSIM.value.deviceIMEI && deviceObject.deviceSIM.value.deviceIMEI.id ? deviceObject.deviceSIM.value.deviceIMEI.id : '';
    let companyCode = user && user.company && user.company.code ? user.company.code : '';
    let employeeCode = user && user.employeeCode ? user.employeeCode : '';
    let messageBody = longCodePreAppendText + '$' + simNumber + '$' + imeiId + '$' + companyCode + '$' + domain + '$' + employeeCode;
    let recipientPhoneNumber = deviceObject.longCodeConfiguration && deviceObject.longCodeConfiguration.value && deviceObject.longCodeConfiguration.value.longCodeNumber ? deviceObject.longCodeConfiguration.value.longCodeNumber : '';
    return { messageBody, recipientPhoneNumber };
  }
}

export let deviceVerificationService = new DeviceVerification()
