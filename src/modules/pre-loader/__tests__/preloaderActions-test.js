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
            type: MASTER_SAVING_FAILURE 
        })
    })

})



