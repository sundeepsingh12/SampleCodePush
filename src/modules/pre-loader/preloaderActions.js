'use strict'
const {

    MASTER_DOWNLOAD_START,
    MASTER_DOWNLOAD_SUCCESS,
    MASTER_DOWNLOAD_FAILURE,

    MASTER_SAVING_START,
    MASTER_SAVING_SUCCESS,
    MASTER_SAVING_FAILURE,

    CHECK_ASSET_START,
    CHECK_ASSET_FAILURE,

    OTP_GENERATION_START,
    OTP_GENERATION_SUCCESS,
    OTP_GENERATION_FAILURE,

    OTP_VALIDATION_START,
    OTP_VALIDATION_SUCCESS,
    OTP_VALIDATION_FAILURE,

    SERVICE_PENDING,
    SERVICE_RUNNING,
    SERVICE_SUCCESS,
    SERVICE_FAILED,

    SHOW_OTP_SCREEN,
    SHOW_MOBILE_NUMBER_SCREEN,

    DEVICE_IMEI,
    DEVICE_SIM,
    USER,
    IS_PRELOADER_COMPLETE,

    PRE_LOGOUT_START,
    PRE_LOGOUT_SUCCESS,
    PRE_LOGOUT_FAILURE,

    ON_MOBILE_NO_CHANGE,
    ON_OTP_CHANGE,
    PRELOADER_SUCCESS,
    IS_SHOW_MOBILE_NUMBER_SCREEN,
    IS_SHOW_OTP_SCREEN
} = require('../../lib/constants').default

import { Actions } from 'react-native-router-flux'
import { keyValueDB } from '../../repositories/keyValueDb'
import { jobMasterService } from '../../services/classes/JobMaster'
import { authenticationService } from '../../services/classes/Authentication'

import { deviceVerificationService } from '../../services/classes/DeviceVerification'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'

import { deleteSessionToken } from '../global/globalActions'

import {onChangePassword,onChangeUsername} from '../login/loginActions'

import CONFIG from '../../lib/config'

//Action dispatched when job master downloading starts
export function jobMasterDownloadStart() {
    return {
        type: MASTER_DOWNLOAD_START
    }
}

//Action dispatched when job master is downloaded successfully
export function jobMasterDownloadSuccess() {
    return {
        type: MASTER_DOWNLOAD_SUCCESS
    }
}

//Action dispatched when failure in downloading job master
export function jobMasterDownloadFailure(error) {
    return {
        type: MASTER_DOWNLOAD_FAILURE,
        payload: error
    }
}

//Action dispatched when job master saving starts
export function jobMasterSavingStart() {
    return {
        type: MASTER_SAVING_START
    }
}

//Action dispatched when job master is saved successfully
export function jobMasterSavingSuccess() {
    return {
        type: MASTER_SAVING_SUCCESS
    }
}

//Action dispatched when saving job master fails
export function jobMasterSavingFailure(error) {
    return {
        type: MASTER_SAVING_FAILURE,
        payload: error
    }
}

export function checkAssetStart() {
    return {
        type: CHECK_ASSET_START
    }
}

//This action is dispatched when all the steps in preloader screen have been successfuly completed
export function preloaderSuccess() {
    return {
        type: PRELOADER_SUCCESS
    }
}

export function checkAssetFailure(error) {
    return {
        type: CHECK_ASSET_FAILURE,
        payload: error
    }
}

//Action dispatched when imei/sim is not verified
export function showMobileNumber() {
    return {
        type: SHOW_MOBILE_NUMBER_SCREEN,
        payload: true
    }
}

//This is just dispatched just after showMobileNumber action 
export function showOtp() {
    return {
        type: SHOW_OTP_SCREEN,
        payload: true
    }
}

//Action dispatched when cancel button in preloader screen is pressed
export function preLogoutRequest() {
    return {
        type: PRE_LOGOUT_START
    }
}

//Action dispatched when logout is successful from preloader container
export function preLogoutSuccess() {
    return {
        type: PRE_LOGOUT_SUCCESS
    }
}

//Action dispatched when logout is failed from preloader container
export function preLogoutFailure(error) {
    return {
        type: PRE_LOGOUT_FAILURE,
        payload: error
    }
}

//Action dispatched when user enters mobile no in enter mobile no screen
export function onChangeMobileNumber(mobileNumber) {
    return {
        type: ON_MOBILE_NO_CHANGE,
        payload: mobileNumber
    }
}

//Action dispatched when user enters otp in enter mobile no screen
export function onChangeOtp(otpNumber) {
    return {
        type: ON_OTP_CHANGE,
        payload: otpNumber
    }
}

//This action is dispatched as soon as we click on Send OTP button in enter mobile no screen
export function otpGenerationStart() {
    return {
        type: OTP_GENERATION_START
    }
}

//This action is dispatched if otp generation API wasn't successful
export function otpGenerationFailure(error) {
    return {
        type: OTP_GENERATION_FAILURE,
        payload: error

    }
}

//This action is dispatched as soon as we click on Verify button in enter otp screen
export function optValidationStart() {
    return {
        type: OTP_VALIDATION_START
    }
}

//This action is dispatched if sim verification api wasn't successful
export function otpValidationFailure(error) {
    return {
        type: OTP_VALIDATION_FAILURE,
        payload: error

    }
}

//This hits JOB Master Api and gets the response 
export async function downloadJobMaster(dispatch) {
    try {
        dispatch(jobMasterDownloadStart())
        const deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
        const deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
        const userObject = await keyValueDBService.getValueFromStore(USER)
        const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        const jobMasters = await jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, userObject,token)
        const json = await jobMasters.json
        dispatch(jobMasterDownloadSuccess())
        validateAndSaveJobMaster(json, dispatch)
      
    } catch (error) {
        dispatch(jobMasterDownloadFailure(error.message))
    }
}

/**This method logs out the user and deletes session token from store
 *
 * @return {Function}
 */
export function invalidateUserSession() {
    return async function (dispatch) {
        try {
            dispatch(preLogoutRequest())
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            await authenticationService.logout(token)
            dispatch(preLogoutSuccess())
            dispatch(deleteSessionToken())
            await keyValueDBService.deleteValueFromStore(IS_SHOW_MOBILE_NUMBER_SCREEN)
            await keyValueDBService.deleteValueFromStore(IS_SHOW_OTP_SCREEN)
            await keyValueDBService.deleteValueFromStore(IS_PRELOADER_COMPLETE)
            dispatch(onChangePassword(''))
            dispatch(onChangeUsername(''))
            Actions.InitialLoginForm()
        } catch (error) {
            dispatch(preLogoutFailure(error.message))
        }
    }
}

/**Called when preloader container is mounted or when user clicks on Retry button
 * 
 * @param {*} configDownloadService 
 * @param {*} configSaveService 
 * @param {*} deviceVerificationService 
 */
export function saveSettingsAndValidateDevice(configDownloadService, configSaveService, deviceVerificationService) {
    return async function (dispatch) {
        const otpScreen = await keyValueDBService.getValueFromStore(IS_SHOW_OTP_SCREEN)
        const mobileScreen = await keyValueDBService.getValueFromStore(IS_SHOW_MOBILE_NUMBER_SCREEN)
        if (otpScreen && otpScreen.value) {
            dispatch(showOtp())
            return
        }
        if (mobileScreen && mobileScreen.value) {
            dispatch(showMobileNumber())
            return
        }
        if (configDownloadService === SERVICE_FAILED || configDownloadService === SERVICE_PENDING || configSaveService === SERVICE_FAILED) {
            downloadJobMaster(dispatch)
        }
        else if (deviceVerificationService === SERVICE_FAILED) {
            checkAsset(dispatch)
        }
    }
}

/**This method validates job master response from server and if found valid then saves it,
 * otherwise job master failure action is dispatched
 *
 * @param jobMasterResponse
 * @param dispatch
 * @return {Promise.<void>}
 */
export async function validateAndSaveJobMaster(jobMasterResponse, dispatch) {
    try {
        if (jobMasterResponse.message) {
            throw new Error(jobMasterResponse.message)
        }
        await jobMasterService.matchServerTimeWithMobileTime(jobMasterResponse.serverTime)
        dispatch(jobMasterSavingStart())
        await jobMasterService.saveJobMaster(jobMasterResponse)
        dispatch(jobMasterSavingSuccess())
        checkAsset(dispatch)
    } catch (error) {
        dispatch(jobMasterSavingFailure(error.message))
    }
}

/**Checks if sim is locally verified or not,if not then check if it's valid on server or not
 *
 * @param dispatch
 * @return {Promise.<void>}
 */
export async function checkAsset(dispatch) {
    try {
        dispatch(checkAssetStart())
        const deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
        const deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
        const user = await keyValueDB.getValueFromStore(USER)
        const isVerified = await deviceVerificationService.checkAsset(deviceIMEI, deviceSIM, user)
        if (isVerified) {
            dispatch(preloaderSuccess())
            keyValueDBService.validateAndSaveData(IS_PRELOADER_COMPLETE, true)
            Actions.Tabbar()
        } else {
            checkIfSimValidOnServer(dispatch)
        }
    } catch (error) {
        dispatch(checkAssetFailure(error.message))
    }
}

/**Checks if sim is valid on server,called only if sim is not valid locally
 *
 * @return {Promise.<void>}
 */


export async function checkIfSimValidOnServer(dispatch){
    try {
    let deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
    let deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    const response = await deviceVerificationService.checkAssetAPI(deviceIMEI.value, deviceSIM.value, token)
    const assetJSON = await response.json
    const responseDeviceIMEI = await assetJSON.deviceIMEI
    const responseDeviceSIM = await assetJSON.deviceSIM
    await keyValueDBService.validateAndSaveData(DEVICE_IMEI, responseDeviceIMEI)
    await keyValueDBService.validateAndSaveData(DEVICE_SIM, responseDeviceSIM)
    deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
    deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
    const responseIsVerified = await deviceVerificationService.checkIfSimValidOnServer(responseDeviceSIM)
    if (isVerified) {
        await keyValueDBService.validateAndSaveData(IS_PRELOADER_COMPLETE, true)
        dispatch(preloaderSuccess())
        Actions.Tabbar()
    } else {
        await keyValueDBService.validateAndSaveData(IS_SHOW_MOBILE_NUMBER_SCREEN, true)
        dispatch(showMobileNumber())
    }
} catch(error) {
        dispatch(checkAssetFailure(error.message))
    }
}

/**Called when user clicks on Send OTP in mobile no screen
 *
 * @param mobileNumber
 * @return {Function}
 */
export function generateOtp(mobileNumber) {
    return async function (dispatch) {
        try {
            dispatch(otpGenerationStart())
            await keyValueDBService.deleteValueFromStore(IS_SHOW_MOBILE_NUMBER_SCREEN)
            const deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            deviceSIM.value.contactNumber = mobileNumber
            const generateOtpResponse = await deviceVerificationService.generateOTP(deviceSIM.value, token)
            const json = await generateOtpResponse.json
            await keyValueDBService.validateAndSaveData(DEVICE_SIM, json)
            await keyValueDBService.validateAndSaveData(IS_SHOW_OTP_SCREEN, true)
            dispatch(showOtp())
        } catch (error) {
            dispatch(otpGenerationFailure(error.message))
        }
    }
}

/**Called when user clicks on verify button in otp screen
 *
 * @param otpNumber
 * @return {Function}
 */
export function validateOtp(otpNumber) {
    return async function (dispatch) {
        try {
            dispatch(optValidationStart())
            const deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
            const otpNoFromStore = deviceSIM.value.otpNumber;
            if (otpNumber != otpNoFromStore) {
                throw new Error('Please enter valid OTP')
            }
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            const simVerificationResponse = await deviceVerificationService.verifySim(deviceSIM.value, token)
            await keyValueDBService.validateAndSaveData(IS_PRELOADER_COMPLETE, true)
            await keyValueDBService.deleteValueFromStore(IS_SHOW_OTP_SCREEN)
            Actions.Tabbar()
        } catch (error) {
            dispatch(otpValidationFailure(error.message))
        }
    }

}

