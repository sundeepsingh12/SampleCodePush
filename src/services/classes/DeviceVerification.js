'use strict'

import {keyValueDBService} from './KeyValueDBService'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'

import {NativeModules} from 'react-native';


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

        console.log(postData)

        let checkAssetResponse = RestAPIFactory().serviceCall(postData, CONFIG.API.CHECK_ASSET_API, 'POST')
        checkAssetResponse = RestAPIFactory()._pruneEmpty(checkAssetResponse)
        return checkAssetResponse
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

    checkAsset(deviceIMEI, deviceSIM, user) {
        console.log(deviceIMEI)
        console.log(deviceSIM)
        const companyId = (user) ? user.value.company.id : 0;
        const hubId = (user) ? user.value.hubId : 0;

        if (deviceIMEI && deviceSIM) {
            if (hubId !== deviceIMEI.value.hubId) {
                deviceIMEI.value.hubId = hubId;
                //update device Imei in store here
            }
            if (!deviceSIM.value.isVerified) {
                this.populateDeviceImeiAndDeviceSim(user)
                return false;
            } else if (deviceSIM.value.isVerified && deviceSIM.value.companyId == companyId) {
                return true;
            } else {
                this.populateDeviceImeiAndDeviceSim(user)
                return false;
            }
        } else {
            this.populateDeviceImeiAndDeviceSim(user)
            return false;
        }
    }

     populateDeviceImeiAndDeviceSim(user) {
        try {
            let imeiNumber, simNumber;
            NativeModules.IMEI.getIMEI().then(result => {
                if (result && result.length > 0) {
                    imeiNumber = result;
                    console.log('deviceImei >>>> ' + deviceIMEI)
                }
            });
            console.log(imeiNumber)
            NativeModules.IMEI.getSim().then(result => {
                if (result && result.length > 0) {
                    simNumber = result;
                }
            });
            console.log(simNumber)
            this.populateDeviceImei(user, imeiNumber)
            this.populateDeviceSim(user, simNumber)
        }catch(error){
            console.log(error)
        }
    }

    getDeviceImei() {

    }

    getSimNo(){

    }
    populateDeviceImei(user,imeiNumber){
        const deviceImei = {
            "hubId":user.value.hubId,
            "cityId":user.value.cityId,
            "companyId":user.value.company.id,
            "userId":user.id,
            imeiNumber
        }
        console.log('populateDeviceImei')
        console.log(deviceImei)
        keyValueDBService.validateAndSaveData(DEVICE_IMEI,deviceImei)
    }

    populateDeviceSim(user,simNumber){
        const deviceSim = {
            "hubId":user.value.hubId,
            "cityId":user.value.cityId,
            "companyId":user.value.company.id,
            "userId":user.id,
            simNumber,
            "isVerified":false
        };
        console.log('populateDeviceSim')
        console.log(deviceSim)

        keyValueDBService.validateAndSaveData(DEVICE_SIM,deviceSim)
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
        });
        let generateOtpResponse =  RestAPIFactory().serviceCall(postData, CONFIG.API.GENERATE_OTP_API, 'POST')
        generateOtpResponse = RestAPIFactory()._pruneEmpty(generateOtpResponse)
        if(generateOtpResponse){
            const deviceSim =  generateOtpResponse.deviceSim()
        }
    }


    verifySim(deviceSIM){
        const postData = JSON.stringify({
            deviceSIM
        })
        let simVerificationResponse =  RestAPIFactory().serviceCall(postData, CONFIG.API.SIM_VERIFICATION_API, 'POST')

    }
}

export let deviceVerificationService = new DeviceVerification()

