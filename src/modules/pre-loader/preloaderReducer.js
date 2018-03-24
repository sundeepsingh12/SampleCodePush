
'use strict'
/**
 * ## Imports
 * The InitialState for Preloader
 */
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
  OTP_GENERATION_SUCCESS,
  OTP_GENERATION_FAILURE,

  OTP_VALIDATION_START,
  OTP_VALIDATION_SUCCESS,
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
  PRE_LOGOUT_FAILURE,

  ON_MOBILE_NO_CHANGE,
  ON_OTP_CHANGE,
  PRELOADER_SUCCESS,
  OTP_SUCCESS,
  ERROR_400_403_LOGOUT_FAILURE,
} from '../../lib/constants'

/**
 * ## preloaderReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function preloaderReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.merge(state)
  switch (action.type) {
    case MASTER_DOWNLOAD_START:
      return state.set('configDownloadService', SERVICE_RUNNING)
        .set('error', '')
        .set('configSaveService', SERVICE_PENDING)
        .set('isError',false)
    case MASTER_DOWNLOAD_SUCCESS:
      return state.set('configDownloadService', SERVICE_SUCCESS)
    case MASTER_DOWNLOAD_FAILURE:
      return state.set('configDownloadService', SERVICE_FAILED)
        .set('isError', true)
        .set('error', action.payload)

    case MASTER_SAVING_START:
      return state.set('configSaveService', SERVICE_RUNNING)
        .set('error', '')
    case MASTER_SAVING_SUCCESS:
      return state.set('configSaveService', SERVICE_SUCCESS)
    case MASTER_SAVING_FAILURE:
      return state.set('configSaveService', SERVICE_FAILED)
        .set('isError', true)
        .set('error', action.payload)

    case CHECK_ASSET_START:
      return state.set('deviceVerificationService', SERVICE_RUNNING)
        .set('error', '')

    case CHECK_ASSET_FAILURE:
      return state.set('deviceVerificationService', SERVICE_FAILED)
        .set('isError', true)
        .set('error', action.payload)

    case OTP_GENERATION_START:
      return state.set('mobileDisplayMessage', 'Sending OTP')
        .set('isGenerateOtpButtonDisabled', true)
    case OTP_GENERATION_FAILURE:
      return state.set('mobileDisplayMessage', action.payload)
        .set('isGenerateOtpButtonDisabled', false)

    case OTP_VALIDATION_START:
      return state.set('otpDisplayMessage', 'Validating OTP')
        .set('isOtpVerificationButtonDisabled', true)
    case OTP_VALIDATION_FAILURE:
      return state.set('otpDisplayMessage', action.payload)
        .set('isOtpVerificationButtonDisabled', false)

    case SHOW_MOBILE_NUMBER_SCREEN:
      return state.set('showMobileNumberScreen', action.payload)
    case SHOW_OTP_SCREEN:
      return state.set('showMobileNumberScreen', !action.payload)
        .set('showOtpScreen', action.payload)
    case PRE_LOGOUT_START:
      return state.set('error', 'Logging out')
        .set('otpDisplayMessage', 'Logging out')
        .set('mobileDisplayMessage', 'Logging out')
        .set('isOtpScreenLogoutDisabled', true)
        .set('isMobileScreenLogoutDisabled', true)
        .set('isPreloaderLogoutDisabled', true)
    case PRE_LOGOUT_SUCCESS:
      return state.set('deviceVerificationService', SERVICE_PENDING)
        .set('configDownloadService', SERVICE_PENDING)
        .set('configSaveService', SERVICE_PENDING)
        .set('showMobileNumberScreen', false)
        .set('showOtpScreen', false)
        .set('otpDisplayMessage', '')
        .set('mobileDisplayMessage', '')
        .set('mobileNumber', '')
        .set('otpNumber', '')
        .set('error', '')
        .set('isOtpScreenLogoutDisabled', false)
        .set('isMobileScreenLogoutDisabled', false)
        .set('isPreloaderLogoutDisabled', false)
        .set('isError', false)
        .set('isErrorType_403_400_Logout', false)
        .set('errorMessage_403_400_Logout', '')

    case PRE_LOGOUT_FAILURE:
      return state.set('isError', true)
        .set('error', action.payload)
        .set('isOtpScreenLogoutDisabled', false)
        .set('isMobileScreenLogoutDisabled', false)
        .set('isPreloaderLogoutDisabled', false)

    case ERROR_400_403_LOGOUT:
      return state.set('isErrorType_403_400_Logout', true)
        .set('errorMessage_403_400_Logout', action.payload)

    case ON_MOBILE_NO_CHANGE:
      let mobileNo = action.payload;
      if (mobileNo) {
        return state.set('isGenerateOtpButtonDisabled', false)
          .set('mobileNumber', mobileNo)
          .set('mobileDisplayMessage', '')
      } else {
        return state.set('isGenerateOtpButtonDisabled', true)
          .set('mobileNumber', mobileNo)
          .set('mobileDisplayMessage', '')
      }

    case ON_OTP_CHANGE:
      let otpNumber = action.payload
      if (otpNumber) {
        return state.set('isOtpVerificationButtonDisabled', false)
          .set('otpNumber', otpNumber)
          .set('otpDisplayMessage', '')
      } else {
        return state.set('isOtpVerificationButtonDisabled', true)
          .set('otpNumber', otpNumber)
          .set('otpDisplayMessage', '')
      }
    case PRELOADER_SUCCESS:
      return state.set('deviceVerificationService', SERVICE_PENDING)
        .set('configDownloadService', SERVICE_PENDING)
        .set('configSaveService', SERVICE_PENDING)
        .set('showMobileNumberScreen', false)
        .set('showOtpScreen', false)
        .set('otpDisplayMessage', '')
        .set('mobileDisplayMessage', '')

    case ERROR_400_403_LOGOUT_FAILURE:
      return state.set('isErrorType_403_400_Logout', false)
        .set('errorMessage_403_400_Logout', action.payload)

    case OTP_SUCCESS: 
      return state.set('showOtpScreen',false)
  }
  return state
}
