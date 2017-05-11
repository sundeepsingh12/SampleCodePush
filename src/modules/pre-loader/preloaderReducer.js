/**
 * # preloaderReducer.js
 *
 *
 */
'use strict'
/**
 * ## Imports
 * The InitialState for Preloader
 */
import InitialState from './preloaderInitialState'

const initialState = new InitialState()
const {

    MASTER_DOWNLOAD_START,
    MASTER_DOWNLOAD_SUCCESS,
    MASTER_DOWNLOAD_FAILURE,

    MASTER_SAVING_START,
    MASTER_SAVING_SUCCESS,
    MASTER_SAVING_FAILURE,

    CHECK_ASSET_START,
    CHECK_ASSET_SUCCESS,
    CHECK_ASSET_FAILURE,

    OTP_GENERATION_START,
    OTP_GENERATION_SUCCESS,
    OTP_GENERATION_FAILURE,

    OTP_VALIDATION_START,
    OTP_VALIDATION_SUCCESS,
    OTP_VALIDATION_FAILURE,

    SESSION_TOKEN_REQUEST,
    SESSION_TOKEN_SUCCESS,
    SESSION_TOKEN_FAILURE,

    SERVICE_PENDING,
    SERVICE_RUNNING,
    SERVICE_SUCCESS,
    SERVICE_FAILED,

    SHOW_MOBILE_NUMBER_SCREEN,
    SHOW_OTP_SCREEN,
    SET_MOBILE_NUMBER,

    PRE_LOGOUT_START,
    PRE_LOGOUT_SUCCESS,
    PRE_LOGOUT_FAILURE,

    ON_MOBILE_NO_CHANGE,
    ON_OTP_CHANGE

} = require('../../lib/constants').default

/**
 * ## preloaderReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function preloaderReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.merge(state)
    switch (action.type) {
        case MASTER_DOWNLOAD_START :
            return state.set('configDownloadService', SERVICE_RUNNING)
        case MASTER_DOWNLOAD_SUCCESS :
            return state.set('configDownloadService', SERVICE_SUCCESS)
        case MASTER_DOWNLOAD_FAILURE :
            return state.set('configDownloadService', SERVICE_FAILED)
                .set('isError', true)
                .set('error', action.payload)

        case MASTER_SAVING_START :
            return state.set('configSaveService', SERVICE_RUNNING)
        case MASTER_SAVING_SUCCESS :
            return state.set('configSaveService', SERVICE_SUCCESS)
        case MASTER_SAVING_FAILURE :
            return state.set('configSaveService', SERVICE_FAILED)
                .set('isError', true)
                .set('error', action.payload)

        case CHECK_ASSET_START :
            return state.set('deviceVerificationService', SERVICE_RUNNING)
        case CHECK_ASSET_SUCCESS :
            return state.set('deviceVerificationService', SERVICE_SUCCESS)
        case CHECK_ASSET_FAILURE :
            return state.set('deviceVerificationService', SERVICE_FAILED)
                .set('isError', true)
                .set('error', action.payload)

        case OTP_GENERATION_START:
            return state.set('mobileDisplayMessage','Sending OTP')
                .set('isGenerateOtpButtonDisabled',true)
        case OTP_GENERATION_FAILURE:
            return state.set('mobileDisplayMessage',action.payload)

        case OTP_VALIDATION_START:
            return state.set('otpDisplayMessage','Validating OTP')
                .set('isOtpVerificationButtonDisabled',true)
        case OTP_VALIDATION_FAILURE:
            return state.set('otpDisplayMessage',action.payload)

        case SHOW_MOBILE_NUMBER_SCREEN:
            return state.set('showMobileNumberScreen',action.payload)
        case SHOW_OTP_SCREEN:
            return state.set('showOtpScreen',action.payload)
        case PRE_LOGOUT_START :
            return state.set('error','Logging out')
        case PRE_LOGOUT_SUCCESS :
            return state.set('error','Log out success')
        case PRE_LOGOUT_FAILURE :
            return state.set('isError',true)
                        .set('error',action.payload)

        case ON_MOBILE_NO_CHANGE :
            let mobileNo = action.payload;
            if(mobileNo){
                return state.set('isGenerateOtpButtonDisabled',false)
                    .set('mobileNumber',mobileNo)
                    .set('mobileDisplayMessage','')
            }
            else{
                return state.set('isGenerateOtpButtonDisabled',true)
                    .set('mobileNumber',mobileNo)
                    .set('mobileDisplayMessage','')
            }

        case ON_OTP_CHANGE :
            let otpNumber = action.payload
            if(otpNumber){
                return state.set('isOtpVerificationButtonDisabled',false)
                    .set('otpNumber',otpNumber)
                    .set('otpDisplayMessage','')
            }else{
                return state.set('isOtpVerificationButtonDisabled',true)
                    .set('otpNumber',otpNumber)
                    .set('otpDisplayMessage','')
            }
    }
    return state
}
