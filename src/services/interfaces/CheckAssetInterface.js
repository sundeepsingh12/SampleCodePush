'use strict'

require('regenerator/runtime')

export default class CheckAssetInterface {
    
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

    }

    /**
     * # Save Device IMEI
     * @param {*} deviceIMEI
     * @returns
     * boolean (always true)
     */
    saveDeviceIMEI(deviceIMEI) {

    }

    /**
     * # Save Device SIM
     * @param {*} deviceSIM 
     * @returns
     * boolean (always true)
     */
    saveDeviceSIM(deviceSIM) {

    }

    /**
     * # Get Device IMEI
     * @returns
     * deviceIMEI
     */
    getDeviceIMEI() {

    }

    /**
     * # Get Device SIM
     * @returns
     * deviceSIM
     */
    getDeviceSIM() {

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

    }
}