'use strict'

import { keyValueDB } from '../../repositories/keyValueDb'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import {keyValueDBService} from './KeyValueDBService'

const {
   DEVICE_IMEI,
    DEVICE_SIM
} = require('../../lib/constants').default

class DeviceVerification {

    /**
     * # Check Asset API(Post)
     *
     * @param {*} deviceIMEI
     * @param {*} deviceSIM
     * ## Expected response
     *  @returns
     * JSON body
     * deviceIMEI
     * deviceSIM
     */
    checkAssetAPI(deviceIMEI, deviceSIM) {
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

        let token = keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        let checkAssetResponse = RestAPIFactory(token.value).serviceCall(postData, CONFIG.API.CHECK_ASSET_API, 'POST')
        checkAssetResponse = RestAPIFactory()._pruneEmpty(checkAssetResponse)
        return checkAssetResponse
    }


    validateAndSaveData(schemaName, data) {
        const storeValue = keyValueDB.validateAndSaveData(schemaName, data);
        return storeValue;
    }

    getValueFromStore(schemaName) {
        const storeValue = keyValueDB.getValueFromStore(schemaName);
        return storeValue;
    }

    /**
     * # Check whether sim verified already
     * @param {*} deviceIMEI
     * @param {*} deviceSIM
     * @param {*} companyID
     * @param {*} hubID
     * @param {*} simNumber
     * @returns
     * boolean
     */

    checkAsset(deviceIMEI, deviceSIM, companyID, hubID) {

        if (deviceIMEI && deviceSIM) {
            if (hubID !== deviceIMEI.hubID) {
                deviceIMEI.hubID = hubID;
            }
        } else {
            return false;
        }

        if (deviceSIM.isVerified == null) {
            return false;
        } else if (deviceSIM.isVerified) {
            return true;
        } else if (deviceSIM.companyID == companyID) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * OTP Generation API (Post)
     * @param {*} deviceSIM
     * ## Expected response
     * JSON body
     * deviceSIM
     */
    generateOTP(deviceSIM) {

        const postData = JSON.stringify({
            deviceSIM
        })

        return BackendFactory().serviceCall(postData, CONFIG.API.SIM_VERIFY_API, 'POST')

    }
}

export let deviceVerificationService = new DeviceVerification()

