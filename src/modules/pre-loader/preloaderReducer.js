'use strict'
import InitialState from './preloaderInitialState'
const initialState = new InitialState()
import {
  MASTER_DOWNLOAD_START,
  MASTER_DOWNLOAD_SUCCESS,
  MASTER_DOWNLOAD_FAILURE,
  MASTER_SAVING_START,
  MASTER_SAVING_SUCCESS,
  MASTER_SAVING_FAILURE,
  CHECK_ASSET_START,
  CHECK_ASSET_FAILURE,
  OTP_GENERATION_START,
  OTP_GENERATION_FAILURE,
  OTP_VALIDATION_START,
  OTP_VALIDATION_FAILURE,
  SERVICE_PENDING,
  SERVICE_RUNNING,
  SERVICE_SUCCESS,
  SERVICE_FAILED,
  SHOW_MOBILE_NUMBER_SCREEN,
  SHOW_OTP_SCREEN,
  SET_MOBILE_NUMBER,
  ERROR_400_403_LOGOUT,
  PRE_LOGOUT_START,
  PRE_LOGOUT_SUCCESS,
  ON_MOBILE_NO_CHANGE,
  ON_OTP_CHANGE,
  PRELOADER_SUCCESS,
  OTP_SUCCESS,
  DOWNLOAD_LATEST_APP,
  SET_APP_UPDATE_BY_CODEPUSH,
  SET_APP_UPDATE_STATUS,
  RESET_STATE,
  SET_IOS_UPGRADE_SCREEN
} from '../../lib/constants'
import { TIMEMISMATCH } from '../../lib/ContainerConstants'
/**
 * ## preloaderReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function preloaderReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.merge(state)
  }
  switch (action.type) {
    case MASTER_DOWNLOAD_START:
      return state.set('configDownloadService', SERVICE_RUNNING)
        .set('error', '')
        .set('configSaveService', SERVICE_PENDING)
    case MASTER_DOWNLOAD_SUCCESS:
      return state.set('configDownloadService', SERVICE_SUCCESS)

    case MASTER_DOWNLOAD_FAILURE:
      return state.set('configDownloadService', SERVICE_FAILED)
        .set('error', action.payload)

    case MASTER_SAVING_START:
      return state.set('configSaveService', SERVICE_RUNNING)
        .set('error', '')

    case MASTER_SAVING_SUCCESS:
      return state.set('configSaveService', SERVICE_SUCCESS)

    case MASTER_SAVING_FAILURE:
      return state.set('configSaveService', SERVICE_FAILED)
        .set('error', action.payload)
        .set('isAppUpdatedThroughCodePush', false)

    case CHECK_ASSET_START:
      return state.set('deviceVerificationService', SERVICE_RUNNING)
        .set('error', '')

    case CHECK_ASSET_FAILURE:
      return state.set('deviceVerificationService', SERVICE_FAILED)
        .set('error', action.payload)

    case OTP_GENERATION_START:
    case OTP_GENERATION_FAILURE:
    case OTP_VALIDATION_START:
    case OTP_VALIDATION_FAILURE:
      return state.set('mobileOtpDisplayMessage', action.payload)

    case SHOW_MOBILE_NUMBER_SCREEN:
    case SHOW_OTP_SCREEN:
      return state.set('showMobileOtpNumberScreen', action.payload)
        .set('mobileOtpDisplayMessage', '')
        .set('otpNumber', '')

    case PRE_LOGOUT_START:
      return state.set('error', action.payload == TIMEMISMATCH ? 'mismatchLoading' : 'Logging out')
        .set('mobileOtpDisplayMessage', false)
    case PRE_LOGOUT_SUCCESS:
      return state.set('deviceVerificationService', SERVICE_PENDING)
        .set('configDownloadService', SERVICE_PENDING)
        .set('configSaveService', SERVICE_PENDING)
        .set('showMobileOtpNumberScreen', false)
        .set('mobileOtpDisplayMessage', '')
        .set('mobileNumber', '')
        .set('otpNumber', '')
        .set('error', '')
        .set('errorMessage_403_400_Logout', '')
        .set('isAppUpdatedThroughCodePush',false)
        .set('iosDownloadScreen',null)

    case ERROR_400_403_LOGOUT:
      return state.set('errorMessage_403_400_Logout', action.payload)

    case ON_MOBILE_NO_CHANGE:
      return state.set('mobileNumber', action.payload)
        .set('mobileOtpDisplayMessage', '')

    case ON_OTP_CHANGE:
      return state.set('otpNumber', action.payload)
        .set('mobileOtpDisplayMessage', '')

    case PRELOADER_SUCCESS:
      return state.set('deviceVerificationService', SERVICE_PENDING)
        .set('configDownloadService', SERVICE_PENDING)
        .set('configSaveService', SERVICE_PENDING)
        .set('showMobileOtpNumberScreen', false)
        .set('mobileOtpDisplayMessage', '')

    case OTP_SUCCESS:
      return state.set('showMobileOtpNumberScreen', false)

    case DOWNLOAD_LATEST_APP:
      return state.set('downloadLatestAppMessage', action.payload.displayMessage)
        .set('downloadUrl', action.payload.downloadUrl)

    case SET_APP_UPDATE_BY_CODEPUSH: {
      return state.set('isAppUpdatedThroughCodePush', action.payload.isCodePushUpdate)
    }

    case SET_APP_UPDATE_STATUS: {
      return state.set('codePushUpdateStatus', action.payload.codePushUpdateStatus)
    }

    case SET_IOS_UPGRADE_SCREEN: {
      return state.set('iosDownloadScreen', action.payload.iosDownloadScreen)
        .set('downloadUrl', action.payload.downloadUrl)
        .set('downloadLatestAppMessage', null)
    }

    case RESET_STATE: {
      return initialState
    }
  }
  return state
}
