'use strict'

import CheckAssetInterface from '../interfaces/CheckAssetInterface'
import {appAuthToken} from '../../lib/AppAuthToken'

const BackendFactory = require('../../lib/BackendFactory').default

export default class CheckAsset extends CheckAssetInterface {

    checkAssetAPI(deviceIMEI,deviceSIM) {
        const postData = JSON.stringify({
            deviceIMEI,
            deviceSIM
        })

        return await BackendFactory()._fetch({
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            url:'/rest/device/check_asset',
            body: postData
        })
        .then((res) => {
            return res;
        })
        .catch((error) => {
            throw(error)
        })
    }

    saveDeviceIMEI(deviceIMEI) {
        appAuthToken.storeDeviceIMEI(deviceIMEI);
    }

    saveDeviceSIM(deviceSIM) {
        appAuthToken.storeDeviceSIM(deviceSIM);
    }

    getDeviceIMEI() {
       const deviceIMEI =  appAuthToken.getDeviceIMEI();
       return deviceIMEI;
    }

    getDeviceSIM() {
       const deviceSIM =  appAuthToken.getDeviceSIM();
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

