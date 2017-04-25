'use strict'

import CheckAssetInterface from '../interfaces/CheckAssetInterface'
import {storeConfig} from '../../lib/StoreConfig'
const BackendFactory = require('../../lib/BackendFactory').default
import CONFIG from '../../lib/config'

class CheckAsset extends CheckAssetInterface {

    checkAssetAPI(deviceIMEI,deviceSIM) {
        if(deviceIMEI===null || deviceIMEI===undefined){
            deviceIMEI = {}
        }
        if(deviceSIM===null || deviceSIM ===undefined){
            deviceSIM = {}
        }
        const postData = JSON.stringify({
            deviceIMEI,
            deviceSIM
        })
        try {
            return BackendFactory().serviceCall(postData,CONFIG.API.CHECK_ASSET_API,'POST')
        } catch (error) {
            throw(error)
        }
    }

    saveDeviceIMEI(deviceIMEI) {
        storeConfig.storeDeviceIMEI(deviceIMEI);
    }

    saveDeviceSIM(deviceSIM) {
        storeConfig.storeDeviceSIM(deviceSIM);
    }

    getDeviceIMEI() {
       const deviceIMEI =  storeConfig.getDeviceIMEI();
       return deviceIMEI;
    }

    getDeviceSIM() {
       const deviceSIM =  storeConfig.getDeviceSIM();
       return deviceSIM;
    }

    checkAsset(deviceIMEI,deviceSIM,companyID,hubID,simNumber) {

       if(deviceIMEI != null && deviceSIM != null) {
           if( hubID !== deviceIMEI.hubID ) {
               deviceIMEI.hubID = hubID;
           } 
       } else {
           return false;
       }

       if(deviceSIM.isVerified == null) {
           return false;
       } else if ( simNumber ==  deviceSIM.simNumber && deviceSIM.companyID == companyID ) {
           return true;
       } else {
           return false;
       }
    }
}

export let checkAssetService = new CheckAsset()

