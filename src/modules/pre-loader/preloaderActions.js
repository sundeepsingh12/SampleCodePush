'use strict'
const {
    SET_CREDENTIALS,

    MASTER_DOWNLOAD_START,
    MASTER_DOWNLOAD_SUCCESS,
    MASTER_DOWNLOAD_FAILURE,

    MASTER_SAVING_START,
    MASTER_SAVING_SUCCESS,
    MASTER_SAVING_FAILURE,
    MASTER_TIME_FAILURE,

    CHECK_ASSET_START,
    CHECK_ASSET_SUCCESS,
    CHECK_ASSET_FAILURE,

    SESSION_TOKEN_REQUEST,
    SESSION_TOKEN_SUCCESS,
    SESSION_TOKEN_FAILURE,

    SERVICE_PENDING,
    SERVICE_RUNNING,
    SERVICE_SUCCESS,
    SERVICE_FAILED,
    PRELOADER_SUCCESS,
    INVALID_IMEI_HUB,
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
    ON_OTP_CHANGE
} = require('../../lib/constants').default

import {Actions} from 'react-native-router-flux'
import {keyValueDB} from '../../repositories/keyValueDb'
import {jobMasterService} from '../../services/classes/JobMaster'
import {logoutService} from '../../services/classes/Logout'

import {deviceVerificationService} from '../../services/classes/DeviceVerification'
import {keyValueDBService} from '../../services/classes/KeyValueDBService'

import {deleteSessionToken} from '../global/globalActions'

export function jobMasterDownloadStart() {
    return {
        type: MASTER_DOWNLOAD_START
    }
}

export function jobMasterDownloadSuccess() {
    return {
        type: MASTER_DOWNLOAD_SUCCESS
    }
}

export function jobMasterDownloadFailure(error) {
    return {
        type: MASTER_DOWNLOAD_FAILURE,
        payload: error
    }
}

export function jobMasterSavingStart() {
    return {
        type: MASTER_SAVING_START
    }
}

export function jobMasterSavingSuccess() {
    return {
        type: MASTER_SAVING_SUCCESS
    }
}

export function jobMasterSavingFailure(error) {
    return {
        type: MASTER_SAVING_FAILURE,
        payload: error
    }
}

export function timeMismatch(error) {
    return {
        type: MASTER_TIME_FAILURE,
        payload: error
    }
}

export function checkAssetStart() {
    return {
        type: CHECK_ASSET_START
    }
}

export function checkAssetSuccess() {
    return {
        type: CHECK_ASSET_SUCCESS
    }
}

export function checkAssetFailure(error) {
    return {
        type: CHECK_ASSET_FAILURE,
        payload: error
    }
}

export function preloaderSuccess() {
    return {
        type: PRELOADER_SUCCESS
    }
}

export function invalidImeiHub(error) {
    return {
        type: INVALID_IMEI_HUB,
        payload: error
    }
}

export function showMobileNumber() {
    return {
        type: SHOW_MOBILE_NUMBER_SCREEN,
        payload: true
    }
}

export function showOtp() {
    return {
        type: SHOW_OTP_SCREEN,
        payload: true
    }
}

export function preLogoutRequest() {
    return {
        type: PRE_LOGOUT_START
    }
}

export function preLogoutSuccess() {
    return {
        type: PRE_LOGOUT_SUCCESS
    }
}
export function preLogoutFailure(error) {
    return {
        type: PRE_LOGOUT_FAILURE,
        payload: error
    }
}

export function onChangeMobileNumber(mobileNumber) {
    return {
        type: ON_MOBILE_NO_CHANGE,
        payload: mobileNumber
    }
}

export function onChangeOtp(otpNumber) {
    return {
        type: ON_OTP_CHANGE,
        payload: otpNumber
    }
}

async function downloadJobMaster(dispatch) {
    try {
        dispatch(jobMasterDownloadStart())
        const deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
        const deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
        let userObject = await keyValueDBService.getValueFromStore(USER)
        const jobMasters = await jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, userObject)
        const json = await jobMasters.json
        dispatch(jobMasterDownloadSuccess())
        saveJobMaster(json, dispatch)
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
            await logoutService.logout();
            dispatch(preLogoutSuccess())
            dispatch(deleteSessionToken())
            Actions.InitialLoginForm()
        } catch (error) {
            dispatch(preLogoutFailure(error.message))
        }
    }
}

export function saveSettingsAndValidateDevice(configDownloadService, configSaveService, deviceVerificationService) {
    return async function (dispatch) {
        if (configDownloadService === 'SERVICE_FAILED' || configDownloadService === 'SERVICE_PENDING' || configSaveService === 'SERVICE_FAILED') {
            downloadJobMaster(dispatch);
        }
        else if (deviceVerificationService === 'SERVICE_FAILED') {
            checkAsset(dispatch);
        }
    }
}


async function saveJobMaster(jobMasterResponse, dispatch) {
    try {
        if (jobMasterResponse.message) {
            const isImeiValid = await jobMasterService.checkIfHubAndImeiIsValid(jobMasterResponse.message)
            dispatch(invalidImeiHub(isImeiValid))
        }
        else {
            const isTimeValid = await jobMasterService.matchServerTimeWithMobileTime(jobMasterResponse.serverTime)
            if (isTimeValid) {
                dispatch(jobMasterSavingStart())
                await jobMasterService.saveJobMaster(jobMasterResponse)
                dispatch(jobMasterSavingSuccess())
                checkAsset(dispatch)
            } else {
                dispatch(timeMismatch())
            }
        }

    } catch (error) {
        dispatch(jobMasterSavingFailure(error.message))
    }
}


async function checkAsset(dispatch) {
    try {
        dispatch(checkAssetStart())
        let deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
        let deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
        const user = await keyValueDB.getValueFromStore(USER)

        const isVerified = await deviceVerificationService.checkAsset(deviceIMEI, deviceSIM, user)
        if (isVerified) {
            dispatch(checkAssetSuccess())
            dispatch(preloaderSuccess())
            keyValueDBService.validateAndSaveData(IS_PRELOADER_COMPLETE, 'true')
            Actions.Tabbar()
        } else {
            deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
            deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
            const response = await deviceVerificationService.checkAssetAPI(deviceIMEI, deviceSIM)
            const assetJSON = await response.json
            const responseDeviceIMEI = await assetJSON.deviceIMEI
            const responseDeviceSIM = await assetJSON.deviceSIM
            await keyValueDBService.validateAndSaveData(DEVICE_IMEI, responseDeviceIMEI)
            await keyValueDBService.validateAndSaveData(DEVICE_SIM, responseDeviceSIM)

            deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
            deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)

            const responseIsVerified = await deviceVerificationService.checkIfSimValidOnServer(responseDeviceSIM)
            console.log('response verified >>>>>>' + responseIsVerified);
            if (responseIsVerified) {
                dispatch(checkAssetSuccess())
                await keyValueDBService.validateAndSaveData(IS_PRELOADER_COMPLETE, 'true')
                dispatch(preloaderSuccess())
                Actions.Tabbar()
            } else {
                dispatch(showMobileNumber())
            }
        }
    } catch (error) {
        dispatch(checkAssetFailure(error.message))
    }
}

export function generateOtp(dispatch) {
    return async function (dispatch) {
        try {
            const deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
            console.log('generateOtp')
            console.log(deviceSIM)
            const generateOtpResponse = await deviceVerificationService.generateOTP(deviceSIM)
            console.log('generateOtpResponse>>>>>')
            console.log(generateOtpResponse)
            const json = await generateOtpResponse.json
            console.log('json otp >>>>>')
            console.log(json)
            const deviceSim = await json.deviceSIM
            console.log(deviceSim)
            await keyValueDBService.validateAndSaveData(DEVICE_SIM, deviceSim)

            dispatch(showOtp())

        } catch (error) {
            console.log(error)
        }
    }
}

export function validateOtp(otpNumber) {
        return async function (dispatch) {
            const deviceSIM = await keyValueDBService.getValueFromStore(DEVICE_SIM)
            const optNoFromStore = deviceSIM.value.otpNumber;
            if (otpNumber === optNoFromStore) {
                const simVerificationResponse = await deviceVerificationService.verifySim(deviceSIM)
                const json = simVerificationResponse.json
                console.log('json sim >>>>>')
                console.log(json)
                await keyValueDBService.validateAndSaveData(IS_PRELOADER_COMPLETE, 'true')
                dispatch(preloaderSuccess())
                Actions.Tabbar()
            }
        }

}

