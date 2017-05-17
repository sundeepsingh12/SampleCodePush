'use strict'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { jobMasterService } from '../../../services/classes/JobMaster'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { authenticationService } from '../../../services/classes/Authentication'
import { deviceVerificationService } from '../../../services/classes/DeviceVerification'

var actions = require('../preloaderActions')
const {

    ON_LOGIN_PASSWORD_CHANGE,
    ON_LOGIN_USERNAME_CHANGE,

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

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

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


    it('should logout', () => {
        const expectedActions = [
            { type: PRE_LOGOUT_START },
            { type: PRE_LOGOUT_SUCCESS },
            {
                type: ON_LOGIN_PASSWORD_CHANGE,
                payload: ''
            },
            {
                type: ON_LOGIN_USERNAME_CHANGE,
                payload: ''
            }
        ]
        const store = mockStore({})
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({ value: 'testtoken' })
        authenticationService.logout = jest.fn()
        authenticationService.logout.mockReturnValue(true)
        keyValueDBService.deleteValueFromStore = jest.fn()
        keyValueDBService.deleteValueFromStore.mockReturnValue(null)
        return store.dispatch(actions.invalidateUserSession())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(authenticationService.logout).toHaveBeenCalled()
                expect(keyValueDBService.deleteValueFromStore).toHaveBeenCalledTimes(3)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    it('should not logout', () => {
        const error = 'error'
        const expectedActions = [
            { type: PRE_LOGOUT_START },
            { 
                type: PRE_LOGOUT_FAILURE,
                payload: error
             }
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({ value: 'testtoken' })
        authenticationService.logout =  jest.fn(() => {
            throw new Error(error)
        })
        keyValueDBService.deleteValueFromStore = jest.fn()
        keyValueDBService.deleteValueFromStore.mockReturnValue(null)
        const store = mockStore({})
        return store.dispatch(actions.invalidateUserSession())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(authenticationService.logout).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should dispatch otp screen', () => {
        const expectedActions = [
            {
                type: SHOW_OTP_SCREEN,
                payload: true
            }
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({ value: true })
            .mockReturnValueOnce(null)
        const store = mockStore({})
        return store.dispatch(actions.saveSettingsAndValidateDevice())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should dispatch mobile screen', () => {
        const expectedActions = [
            {
                type: SHOW_MOBILE_NUMBER_SCREEN,
                payload: true
            }
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
            .mockReturnValueOnce({ value: true })
        const store = mockStore({})
        return store.dispatch(actions.saveSettingsAndValidateDevice())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should dispatch download job master', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
            .mockReturnValueOnce(null)
        const store = mockStore({})
        return store.dispatch(actions.saveSettingsAndValidateDevice(SERVICE_PENDING, SERVICE_PENDING, SERVICE_PENDING))
            .then(() => {
                expect(actions.downloadJobMaster).toHaveBeenCalled
            })
    })

    it('should dispatch check asset', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
            .mockReturnValueOnce(null)
            .mockReturnValue(null)
        const store = mockStore({})
        return store.dispatch(actions.saveSettingsAndValidateDevice(SERVICE_SUCCESS, SERVICE_SUCCESS, SERVICE_FAILED))
            .then(() => {
                console.log('check asset')
                console.log(store.getActions())
                expect(actions.checkAsset).toHaveBeenCalled
            })
    })


    it('should download job master', () => {
        const expectedActions = [
            { type: MASTER_DOWNLOAD_START },
            { type: MASTER_DOWNLOAD_SUCCESS },
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        jobMasterService.downloadJobMaster = jest.fn()
        jobMasterService.downloadJobMaster.mockReturnValue({
                json : {
                    jobMaster : null
                }
            })
        const store = mockStore({})
        return store.dispatch(actions.downloadJobMaster())
            .then(() => {
                expect(jobMasterService.downloadJobMaster).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    it('should not download job master', () => {
        const error = 'test'
        const expectedActions = [
            { type: MASTER_DOWNLOAD_START },
            {
                type: MASTER_DOWNLOAD_FAILURE,
                payload: error
            },
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        jobMasterService.downloadJobMaster = jest.fn(() => {
            throw new Error(error)
        })
        const store = mockStore({})
        return store.dispatch(actions.downloadJobMaster())
            .then(() => {
                expect(jobMasterService.downloadJobMaster).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    //to test
    it('should not validate and save job master', () => {
        const error = 'test error'
        const response = {
            message : error
        }
        const expectedActions = [
            { 
                type: MASTER_SAVING_FAILURE,
                payload : error
             },
        ]
        const store = mockStore({})
        return store.dispatch(actions.validateAndSaveJobMaster(response))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should validate and save job master', () => {
        const response = {
            serverTime : null
        }
        const expectedActions = [
            { type: MASTER_SAVING_START },
            { type: MASTER_SAVING_SUCCESS }
        ]
        jobMasterService.matchServerTimeWithMobileTime = jest.fn()
        jobMasterService.matchServerTimeWithMobileTime.mockReturnValue(true)
        jobMasterService.saveJobMaster = jest.fn()
        jobMasterService.saveJobMaster.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.validateAndSaveJobMaster(response))
            .then(() => {
                expect(jobMasterService.matchServerTimeWithMobileTime).toHaveBeenCalled()
                expect(jobMasterService.saveJobMaster).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            }).then(() => {
                console.log(store.getActions())
            })
    })

    it('should not validate and save job master', () => {
        const error = 'test error'
        const response = {
            serverTime : null
        }
        const expectedActions = [
            { 
                type: MASTER_SAVING_FAILURE,
                payload : error
             },
        ]
        jobMasterService.matchServerTimeWithMobileTime = jest.fn(() => {
            throw new Error(error)
        })
        jobMasterService.saveJobMaster = jest.fn()
        jobMasterService.saveJobMaster.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.validateAndSaveJobMaster(response))
            .then(() => {
                expect(jobMasterService.matchServerTimeWithMobileTime).toHaveBeenCalled()
                expect(jobMasterService.saveJobMaster).not.toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

})

describe('test', () => {
    it('should check device locally', () => {
        const expectedActions = [
            { type: CHECK_ASSET_START },
            { type: PRELOADER_SUCCESS },
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        deviceVerificationService.checkAsset = jest.fn()
        deviceVerificationService.checkAsset.mockReturnValue(true)
        keyValueDBService.validateAndSaveData = jest.fn()
        keyValueDBService.validateAndSaveData.mockReturnValue(true)
        const store = mockStore({})
        console.log('check device local')
        return store.dispatch(actions.checkAsset())
            .then(() => {
                console.log('result device')
                console.log(store.getActions())
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(3)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })
})



