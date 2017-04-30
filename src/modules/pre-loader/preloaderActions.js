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

} = require('../../lib/constants').default

const BackendFactory = require('../../lib/BackendFactory').default

import { Actions } from 'react-native-router-flux'
import { storeConfig } from '../../repositories/KeyValueDb'
import { authenticationService } from '../../services/classes/Authentication'
import { jobMasterService } from '../../services/classes/JobMaster'
import { checkAssetService } from '../../services/classes/CheckAsset'


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


export function downloadJobMaster() {
  return async function (dispatch) {
    try {
      console.log("downloadJobMaster")
      dispatch(jobMasterDownloadStart())
      const deviceIMEI = await checkAssetService.getDeviceIMEI()
      const deviceSIM = await checkAssetService.getDeviceSIM()
      let user = await jobMasterService.getUser()
      const currentJobMasterVersion = (user != null || user != undefined) ? user.currentJobMasterVersion : 0;
      const companyId = (user != null || user != undefined) ? user.currentJobMasterVersion : 0;
      const jobMasters = await jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, currentJobMasterVersion, companyId)
      const json = await jobMasters.json
      dispatch(jobMasterDownloadSuccess())
      console.log("downloadJobMaste Success")
    } catch (error) {
        console.log("downloadJobMaste Failure")
      dispatch(jobMasterDownloadFailure(error))
    }
  }
}


export function saveJobMaster(jobMasterResponse) {
  return async function (dispatch) {
    try {
      if (jobMasterService.matchServerTimeWithMobileTime(json.serverTime)) {
        dispatch(jobMasterSavingStart())
        jobMasterService.saveJobMaster(jobMasterResponse)
        dispatch(jobMasterDownloadSuccess())
      } else {
        dispatch(timeMismatch())
      }
    } catch (error) {
      dispatch(saveJobMasterFailure(error))
    }
  }
}


export function checkAsset() {
  return async function (dispatch) {
    const deviceIMEI = await checkAssetService.getDeviceIMEI()
    const deviceSIM = await checkAssetService.getDeviceSIM()
    dispatch(checkAssetStart())
  }
}