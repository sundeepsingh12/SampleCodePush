'use strict'


var actions = require('../preloaderActions')
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

    SESSION_TOKEN_REQUEST,
    SESSION_TOKEN_SUCCESS,
    SESSION_TOKEN_FAILURE,

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
} = require('../../../lib/constants').default

describe('Preloader Actions', () => {

    it('should set jobMasterDownloadStart()', () => {
        expect(actions.jobMasterDownloadStart()).toEqual({ 
            type: MASTER_DOWNLOAD_START 
        })
    })

    it('should set jobMasterDownloadSuccess()', () => {
        expect(actions.jobMasterDownloadSuccess()).toEqual({ 
            type: MASTER_DOWNLOAD_SUCCESS 
        })
    })

    
    it('should set jobMasterDownloadFailure()', () => {
        const error = 'error'
        expect(actions.jobMasterDownloadFailure(error)).toEqual({ 
            type: MASTER_DOWNLOAD_FAILURE,
            payload: error
        })
    })

    it('should set jobMasterSavingStart()', () => {
        expect(actions.jobMasterSavingStart()).toEqual({ 
            type: MASTER_SAVING_START 
        })
    })

    it('should set jobMasterSavingSuccess()', () => {
        expect(actions.jobMasterSavingSuccess()).toEqual({ 
            type: MASTER_SAVING_SUCCESS 
        })
    })

    it('should set jobMasterSavingFailure()', () => {
        const error = 'error'
        expect(actions.jobMasterSavingFailure(error)).toEqual({ 
            type: MASTER_SAVING_FAILURE,
            payload: error
        })
    })

    it('should set checkAssetStart()', () => {
        expect(actions.checkAssetStart()).toEqual({ 
            type: CHECK_ASSET_START 
        })
    })

    it('should set preloaderSuccess()', () => {
        expect(actions.preloaderSuccess()).toEqual({ 
            type: PRELOADER_SUCCESS 
        })
    })

    it('should set checkAssetFailure()', () => {
        const error = 'error'
        expect(actions.checkAssetFailure(error)).toEqual({ 
            type: CHECK_ASSET_FAILURE,
            payload: error
        })
    })

    it('should set showMobileNumber()', () => {
        expect(actions.showMobileNumber()).toEqual({ 
            type: SHOW_MOBILE_NUMBER_SCREEN,
            payload: true
        })
    })

    it('should set showOtp()', () => {
        expect(actions.showOtp()).toEqual({ 
            type: SHOW_OTP_SCREEN,
            payload: true
        })
    })

    it('should set preLogoutRequest()', () => {
        expect(actions.preLogoutRequest()).toEqual({ 
            type: PRE_LOGOUT_START 
        })
    })

    it('should set preLogoutSuccess()', () => {
        expect(actions.preLogoutSuccess()).toEqual({ 
            type: PRE_LOGOUT_SUCCESS 
        })
    })

    it('should set preLogoutFailure()', () => {
        const error = 'error'
        expect(actions.preLogoutFailure(error)).toEqual({ 
            type: PRE_LOGOUT_FAILURE,
            payload: error
        })
    })

    it('should set onChangeMobileNumber()', () => {
        const mobileNumber = '98811'
        expect(actions.onChangeMobileNumber(mobileNumber)).toEqual({ 
            type: ON_MOBILE_NO_CHANGE,
            payload: mobileNumber
        })
    })

    it('should set onChangeOtp()', () => {
        const otpNumber = '98811'
        expect(actions.onChangeOtp(otpNumber)).toEqual({ 
            type: ON_OTP_CHANGE,
            payload: otpNumber
        })
    })

    it('should set otpGenerationStart()', () => {
        expect(actions.otpGenerationStart()).toEqual({ 
            type: OTP_GENERATION_START 
        })
    })

    it('should set otpGenerationFailure()', () => {
        const error = 'error'
        expect(actions.otpGenerationFailure(error)).toEqual({ 
            type: OTP_GENERATION_FAILURE,
            payload: error
        })
    })

    it('should set optValidationStart()', () => {
        expect(actions.optValidationStart()).toEqual({ 
            type: OTP_VALIDATION_START 
        })
    })

    it('should set otpValidationFailure()', () => {
        const error = 'error'
        expect(actions.otpValidationFailure(error)).toEqual({ 
            type: OTP_VALIDATION_FAILURE,
            payload: error
        })
    })

})



