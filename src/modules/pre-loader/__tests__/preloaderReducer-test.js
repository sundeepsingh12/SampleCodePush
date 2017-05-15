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
  ON_OTP_CHANGE,
  PRELOADER_SUCCESS

} = require('../../../lib/constants').default

import preloaderReducer from '../preloaderReducer'

describe('preloader reducer ',() => {

    it('it should set master download start',() => {
        const action = {
            type : MASTER_DOWNLOAD_START
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.configDownloadService).toBe(SERVICE_RUNNING)
        expect(nextState.error).toBe('')
        expect(nextState.configSaveService).toBe(SERVICE_PENDING)
    })

    it('it should set master download success',() => {
        const action = {
            type : MASTER_DOWNLOAD_SUCCESS
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.configDownloadService).toBe(SERVICE_SUCCESS)
    })

    it('it should set master download failure',() => {
        const error = 'test'
        const action = {
            type : MASTER_DOWNLOAD_FAILURE,
            payload : error
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.configDownloadService).toBe(SERVICE_FAILED)
        expect(nextState.error).toBe(error)
        expect(nextState.isError).toBe(true)
    })

    it('it should set master saving start',() => {
        const action = {
            type : MASTER_SAVING_START,
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.configSaveService).toBe(SERVICE_RUNNING)
        expect(nextState.error).toBe('')
    })

    it('it should set master saving success',() => {
        const action = {
            type : MASTER_SAVING_SUCCESS,
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.configSaveService).toBe(SERVICE_SUCCESS)
    })

    it('it should set master download failure',() => {
        const error = 'test'
        const action = {
            type : MASTER_SAVING_FAILURE,
            payload : error
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.configSaveService).toBe(SERVICE_FAILED)
        expect(nextState.error).toBe(error)
        expect(nextState.isError).toBe(true)
    })

    it('it should set check asset start',() => {
        const action = {
            type : CHECK_ASSET_START,
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.deviceVerificationService).toBe(SERVICE_RUNNING)
        expect(nextState.error).toBe('')
    })

    it('it should set check asset failure',() => {
        const error = 'test'
        const action = {
            type : CHECK_ASSET_FAILURE,
            payload : error
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.deviceVerificationService).toBe(SERVICE_FAILED)
        expect(nextState.error).toBe(error)
        expect(nextState.isError).toBe(true)
    })

    it('it should set otp generation start',() => {
        const action = {
            type : OTP_GENERATION_START,
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.isGenerateOtpButtonDisabled).toBe(true)
        expect(nextState.mobileDisplayMessage).toBe('Sending OTP')
    })

    it('it should set otp generation failure',() => {
        const error = 'test'
        const action = {
            type : OTP_GENERATION_FAILURE,
            payload : error
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.mobileDisplayMessage).toBe(error)
    })

    it('it should set otp validation start',() => {
        const action = {
            type : OTP_VALIDATION_START,
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.isOtpVerificationButtonDisabled).toBe(true)
        expect(nextState.otpDisplayMessage).toBe('Validating OTP')
    })

    it('it should set otp validation failure',() => {
        const error = 'test'
        const action = {
            type : OTP_VALIDATION_FAILURE,
            payload : error
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.otpDisplayMessage).toBe(error)
    })

    it('it should set show mobile number screen',() => {
        const action = {
            type : SHOW_MOBILE_NUMBER_SCREEN,
            payload : true
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.showMobileNumberScreen).toBe(true)
    })

    it('it should set show mobile number screen',() => {
        const action = {
            type : SHOW_MOBILE_NUMBER_SCREEN,
            payload : false
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.showMobileNumberScreen).toBe(false)
    })

    it('it should set show otp screen',() => {
        const action = {
            type : SHOW_OTP_SCREEN,
            payload : true
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.showOtpScreen).toBe(true)
    })

    it('it should set show otp screen',() => {
        const action = {
            type : SHOW_OTP_SCREEN,
            payload : false
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.showOtpScreen).toBe(false)
    })

    it('it should set pre logout start',() => {
        const action = {
            type : PRE_LOGOUT_START,
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.otpDisplayMessage).toBe('Logging out')
        expect(nextState.error).toBe('Logging out')
        expect(nextState.mobileDisplayMessage).toBe('Logging out')
    })

    it('it should set pre logout success',() => {
        const action = {
            type : PRE_LOGOUT_SUCCESS,
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.deviceVerificationService).toBe(SERVICE_PENDING)
        expect(nextState.configDownloadService).toBe(SERVICE_PENDING)
        expect(nextState.configSaveService).toBe(SERVICE_PENDING)
        expect(nextState.showMobileNumberScreen).toBe(false)
        expect(nextState.showOtpScreen).toBe(false)
        expect(nextState.otpDisplayMessage).toBe('')
        expect(nextState.mobileDisplayMessage).toBe('')
        expect(nextState.mobileNumber).toBe('')
        expect(nextState.otpNumber).toBe('')
        expect(nextState.error).toBe('')
    })

    it('it should set pre logout failure',() => {
        const error = 'test'
        const action = {
            type : PRE_LOGOUT_FAILURE,
            payload : error
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.isError).toBe(true)
        expect(nextState.error).toBe(error)
    })

    it('should change mobile number',() => {
        const mobileNumber = '9817'
        const action = {
            type : ON_MOBILE_NO_CHANGE,
            payload : mobileNumber
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.isGenerateOtpButtonDisabled).toBe(false)
        expect(nextState.mobileNumber).toBe(mobileNumber)
        expect(nextState.mobileDisplayMessage).toBe('')
    })

    it('should not change mobile number',() => {
        const mobileNumber = null
        const action = {
            type : ON_MOBILE_NO_CHANGE,
            payload : mobileNumber
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.isGenerateOtpButtonDisabled).toBe(true)
        expect(nextState.mobileNumber).toBe(mobileNumber)
        expect(nextState.mobileDisplayMessage).toBe('')
    })

    it('should change otp number',() => {
        const otpNumber = '9817'
        const action = {
            type : ON_OTP_CHANGE,
            payload : otpNumber
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.isOtpVerificationButtonDisabled).toBe(false)
        expect(nextState.otpNumber).toBe(otpNumber)
        expect(nextState.otpDisplayMessage).toBe('')
    })

    it('should not change otp number',() => {
        const otpNumber = null
        const action = {
            type : ON_OTP_CHANGE,
            payload : otpNumber
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.isOtpVerificationButtonDisabled).toBe(true)
        expect(nextState.otpNumber).toBe(otpNumber)
        expect(nextState.otpDisplayMessage).toBe('')
    })

    it('it should set pre logout success',() => {
        const action = {
            type : PRELOADER_SUCCESS,
        }
        let nextState = preloaderReducer(undefined,action)
        expect(nextState.deviceVerificationService).toBe(SERVICE_PENDING)
        expect(nextState.configDownloadService).toBe(SERVICE_PENDING)
        expect(nextState.configSaveService).toBe(SERVICE_PENDING)
        expect(nextState.showMobileNumberScreen).toBe(false)
        expect(nextState.showOtpScreen).toBe(false)
        expect(nextState.otpDisplayMessage).toBe('')
        expect(nextState.mobileDisplayMessage).toBe('')
    })

})
