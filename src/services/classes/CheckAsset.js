'use strict'

import {keyValueDB} from '../../repositories/keyValueDb'
const BackendFactory = require('../../lib/BackendFactory').default
import CONFIG from '../../lib/config'

const {
   deviceImei,
   deviceSim

} = require('../../lib/constants').default

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
        if(!deviceIMEI){
            deviceIMEI = {}
        }
        if(!deviceSIM){
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


    validateAndSaveData(schemaName,data){
        const storeValue = keyValueDB.validateAndSaveData(schemaName,data);
        return storeValue;
    }

    getValueFromStore(schemaName){
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

    checkAsset(deviceIMEI,deviceSIM,companyID,hubID,simNumber) {

       if(deviceIMEI  && deviceSIM ) {
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

