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

    deviceImei,
    deviceSim,
    user
} = require('../../lib/constants').default

const BackendFactory = require('../../lib/BackendFactory').default

import {Actions} from 'react-native-router-flux'
import {keyValueDB} from '../../repositories/keyValueDb'
import {jobMasterService} from '../../services/classes/JobMaster'
import {checkAssetService} from '../../services/classes/CheckAsset'
import {logoutService} from '../../services/classes/Logout'

import CONFIG from '../../lib/config'

import {logoutRequest,logoutSuccess,deleteSessionToken,logoutFailure} from '../global/globalActions'

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

export function jobMasterDownloadFailure() {
    return {
        type: MASTER_DOWNLOAD_FAILURE
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

export function jobMasterSavingFailure() {
    return {
        type: MASTER_SAVING_FAILURE
    }
}

export function timeMismatch() {
    return {
        type: MASTER_TIME_FAILURE
    }
}

export function checkAssetStart() {
    return {
        type:CHECK_ASSET_START
    }
}

export function checkAssetFailure() {
    return {
        type:CHECK_ASSET_FAILURE
    }
}

export function preloaderSuccess() {
    return {
        type:PRELOADER_SUCCESS
    }
}

export async function downloadJobMaster() {
        try {
            dispatch(jobMasterDownloadStart())
            const deviceIMEI = await checkAssetService.getValueFromStore(deviceImei)
            const deviceSIM = await checkAssetService.getValueFromStore(deviceSim)
            let userObject = await jobMasterService.getValueFromStore(user)
            const currentJobMasterVersion = (userObject) ? user.currentJobMasterVersion : 0;
            const companyId = (userObject) ? userObject.currentJobMasterVersion : 0;
            const jobMasters = await jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, currentJobMasterVersion, companyId)
            const json = await jobMasters.json
                dispatch(jobMasterDownloadSuccess())
                saveJobMaster(json,dispatch)
        } catch (error) {
            console.log(error)
            dispatch(jobMasterDownloadFailure(error))
        }
}

export function invalidateUserSession(){
    return async function(dispatch){
        try{
            dispatch(logoutRequest())
            const token = await keyValueDB.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
             await logoutService.logout();
            dispatch(logoutSuccess())
            dispatch(deleteSessionToken())
            Actions.InitialLoginForm()
        }catch(error){
            console.log(error)
            dispatch(logoutFailure(error))
        }
    }
}

export function retryPreloader(configDownloadService,configSaveService,deviceVerificationService){
    return async function (dispatch) {
        if(configDownloadService==='SERVICE_FAILED' || configDownloadService==='SERVICE_PENDING' || configSaveService==='SERVICE_FAILED'){
            downloadJobMaster();}
      else if(deviceVerificationService==='SERVICE_FAILED'){
            checkAsset();
        }
    }
}


 async function saveJobMaster(jobMasterResponse,dispatch) {
    // return async function (dispatch) {
        try {
            const isTimeValid = await jobMasterService.matchServerTimeWithMobileTime(jobMasterResponse.serverTime)
            if (isTimeValid) {
                //write code for access denied/verify imei etc cases also inside if condition
                dispatch(jobMasterSavingStart())
                jobMasterService.saveJobMaster(jobMasterResponse)
                dispatch(jobMasterSavingSuccess())
                // checkAsset()
                //Uncomment above code
            } else {
                dispatch(timeMismatch())
            }
        } catch (error) {
            console.log(error)
            dispatch(jobMasterSavingFailure(error))
        }
    // }
}


async function checkAsset() {
    // return async function (dispatch) {
        try {
            dispatch(checkAssetStart())
            const deviceIMEI = await checkAssetService.getValueFromStore(deviceImei)
            const deviceSIM = await checkAssetService.getValueFromStore(deviceSim)
             checkAssetService.checkAsset(deviceIMEI, deviceSIM)
            // }
            //write code for saving 'isComplete' inside store
        }catch(error){
            dispatch(checkAssetFailure(error))
        }

}