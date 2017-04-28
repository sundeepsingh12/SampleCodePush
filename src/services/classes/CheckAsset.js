'use strict'

import {storeConfig} from '../../lib/StoreConfig'
const BackendFactory = require('../../lib/BackendFactory').default
import CONFIG from '../../lib/config'

class CheckAsset {


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

    /**
     * # Save Device IMEI
     * @param {*} deviceIMEI
     * @returns
     * boolean (true|false)
     */
    saveDeviceIMEI(deviceIMEI) {
        storeConfig.storeDeviceIMEI(deviceIMEI);
    }


    /**
     * # Save Device SIM
     * @param {*} deviceSIM
     * @returns
     * boolean (always true)
     */
    saveDeviceSIM(deviceSIM) {
        storeConfig.storeDeviceSIM(deviceSIM);
    }

    /**
     * # Get Device IMEI
     * @returns
     * deviceIMEI
     */
    getDeviceIMEI() {
       const deviceIMEI =  storeConfig.getDeviceIMEI();
       return deviceIMEI;
    }

    /**
     * # Get Device SIM
     * @returns
     * deviceSIM
     */
    getDeviceSIM() {
       const deviceSIM =  storeConfig.getDeviceSIM();
       return deviceSIM;
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

