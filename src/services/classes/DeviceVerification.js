'use strict'

import {
  keyValueDBService
} from './KeyValueDBService'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import DeviceInfo from 'react-native-device-info'
import {
  Platform
} from 'react-native'

const {
  DEVICE_IMEI,
  DEVICE_SIM
} = require('../../lib/constants').default

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
    if (!deviceIMEI) {
      deviceIMEI = {}
    }
    if (!deviceSIM) {
      deviceSIM = {}
    }
    const postData = JSON.stringify({
      deviceIMEI,
      deviceSIM
    })
    let checkAssetResponse = RestAPIFactory(token.value).serviceCall(postData, CONFIG.API.CHECK_ASSET_API, 'POST')
    checkAssetResponse = RestAPIFactory()._pruneEmpty(checkAssetResponse)
    return checkAssetResponse
  }

  /**
   * 
   * @param {*} deviceIMEI 
   * @param {*} deviceSIM 
   * @param {*} user 
   */

  async checkAsset(deviceIMEI, deviceSIM, user) {
    const companyId = (user) ? user.value.company.id : 0;
    const hubId = (user) ? user.value.hubId : 0;

    if (deviceIMEI && deviceSIM) {
      if (hubId !== deviceIMEI.value.hubId) {
        deviceIMEI.value.hubId = hubId;
        keyValueDBService.validateAndSaveData(DEVICE_IMEI, deviceIMEI)
      }
      if (!deviceSIM.value.isVerified) {
        await this.populateDeviceImeiAndDeviceSim(user)
        return false;
      } else if (deviceSIM.value.isVerified && deviceSIM.value.companyId === companyId) {
        return true;
      } else {
        await this.populateDeviceImeiAndDeviceSim(user)
        return false;
      }
    } else {
      await this.populateDeviceImeiAndDeviceSim(user)
      return false;
    }
  }

  /**populates device sim and device imei in store
   * 
   * @param {*} user 
   */
  async populateDeviceImeiAndDeviceSim(user) {
    let imei = require('../../wrapper/IMEI');
    try {
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
    } catch (error) {
    }
  }

  /**Saves deviceIMEI in store
   * 
   * @param {*} user 
   * @param {*} imeiNumber 
   */
  populateDeviceImei(user, imeiNumber) {
    const deviceImei = {
      hubId: user.value.hubId,
      cityId: user.value.cityId,
      companyId: user.value.company.id,
      userId: user.value.id,
      imeiNumber
    }
    keyValueDBService.validateAndSaveData(DEVICE_IMEI, deviceImei)
  }

  /**This saves device sim in store
   *
   * @param user
   * @param simNumber
   */
  populateDeviceSim(user, simNumber) {
    const deviceSim = {
      hubId: user.value.hubId,
      cityId: user.value.cityId,
      companyId: user.value.company.id,
      userId: user.value.id,
      simNumber,
      isVerified: false,
    };

    keyValueDBService.validateAndSaveData(DEVICE_SIM, deviceSim)
  }

  /**POST API
   * 
   * @param {*} deviceSIM 
   * @param {*} token  
   * 
   *  Request body
   * deviceSIM
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

  generateOTP(deviceSIM, token) {
    let generateOtpResponse = RestAPIFactory(token.value).serviceCall(JSON.stringify(deviceSIM), CONFIG.API.GENERATE_OTP_API, 'POST')
    generateOtpResponse = RestAPIFactory()._pruneEmpty(generateOtpResponse)
    return generateOtpResponse
  }

  /**POST API
   * 
   * @param {*} deviceSIM 
   * @param {*} token 
   * 
   * Request body
   * deviceSIM
   * 
   * Expected Response body
   * 
   */
  verifySim(deviceSIM, token) {
    let simVerificationResponse = RestAPIFactory(token.value).serviceCall(JSON.stringify(deviceSIM), CONFIG.API.SIM_VERIFICATION_API, 'POST')
    simVerificationResponse = RestAPIFactory()._pruneEmpty(simVerificationResponse)
    return simVerificationResponse

  }

  /**Checks if isVerified of device sim response is true or not
   * 
   * @param {*} deviceSim 
   */
  checkIfSimValidOnServer(deviceSim) {
    if (deviceSim.isVerified) {
      return true
    }
    return false
  }
}

export let deviceVerificationService = new DeviceVerification()
