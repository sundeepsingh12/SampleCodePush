'use strict'

import {keyValueDBService} from './KeyValueDBService'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'

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
    checkAssetAPI(deviceIMEI, deviceSIM,token) {
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
        console.log('request body')
        console.log(postData)
        let checkAssetResponse = RestAPIFactory().serviceCall(postData, CONFIG.API.CHECK_ASSET_API, 'POST')
        checkAssetResponse = RestAPIFactory()._pruneEmpty(checkAssetResponse)
        return checkAssetResponse
    }

    /**Checks if SIM verified already
     *
     * @param deviceIMEI
     * @param deviceSIM
     * @param user
     * @return {Promise.<boolean>}
     */

     async checkAsset(deviceIMEI, deviceSIM, user) {
        const companyId = (user) ? user.value.company.id : 0;
        const hubId = (user) ? user.value.hubId : 0;

        if (deviceIMEI && deviceSIM) {
            if (hubId !== deviceIMEI.value.hubId) {
                deviceIMEI.value.hubId = hubId;
                //update device Imei in store here
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

    /**This method gets imei no and sim no via bridge and saves them in store
     *
     * @param user
     * @return {Promise.<void>}
     */
     async populateDeviceImeiAndDeviceSim(user) {
        let imei =  require('../../wrapper/IMEI');
        try {
            const imeiNumber =  await imei.getIMEI()
            console.log(imeiNumber)
            const simNumber = await imei.getSim()
            console.log(simNumber)
           await this.populateDeviceImei(user, imeiNumber)
           await this.populateDeviceSim(user, simNumber)
        }catch(error){
            console.log(error)
        }
    }

    /**This saves device imei in store
     *
     * @param user
     * @param imeiNumber
     */
    populateDeviceImei(user,imeiNumber){
        const deviceImei = {
            hubId:user.value.hubId,
            cityId:user.value.cityId,
            companyId:user.value.company.id,
            userId:user.value.id,
            imeiNumber
        }
        console.log('populateDeviceImei')
        console.log(deviceImei)
        keyValueDBService.validateAndSaveData(DEVICE_IMEI,deviceImei)
    }

    /**This saves device sim in store
     *
     * @param user
     * @param simNumber
     */
    populateDeviceSim(user,simNumber){
        const deviceSim = {
            hubId:user.value.hubId,
            cityId:user.value.cityId,
            companyId:user.value.company.id,
            userId:user.value.id,
            simNumber,
            isVerified:false,
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
    generateOTP(deviceSIM,sessionToken) {
        console.log('generateOTP')
        console.log(JSON.stringify(deviceSIM))
        let generateOtpResponse =  RestAPIFactory().serviceCall(JSON.stringify(deviceSIM), CONFIG.API.GENERATE_OTP_API, 'POST')
        generateOtpResponse = RestAPIFactory()._pruneEmpty(generateOtpResponse)
        console.log(generateOtpResponse)
        return generateOtpResponse
    }

    /**
     *
     * @param deviceSIM
     * @return {*}
     */
    verifySim(deviceSIM,sessionToken){
        let simVerificationResponse =  RestAPIFactory().serviceCall(JSON.stringify(deviceSIM), CONFIG.API.SIM_VERIFICATION_API, 'POST')
        simVerificationResponse = RestAPIFactory()._pruneEmpty(simVerificationResponse)
        return simVerificationResponse

    }

    checkIfSimValidOnServer(deviceSim){
        console.log('checkIfSimValidOnServer')
        console.log(deviceSim)
        console.log(deviceSim.isVerified)
        if(deviceSim.isVerified){
            return true
        }
        return false
    }
}

export let deviceVerificationService = new DeviceVerification()

