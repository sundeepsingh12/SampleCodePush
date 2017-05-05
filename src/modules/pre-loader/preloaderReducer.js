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

    PRE_LOGOUT_START,
    PRE_LOGOUT_SUCCESS,
    PRE_LOGOUT_FAILURE

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
        case MASTER_TIME_FAILURE :
        case INVALID_IMEI_HUB:
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
        case PRELOADER_SUCCESS :
            return state.set('isComplete', true)
        case PRE_LOGOUT_START :
            return state.set('error','Logging out ')
        case PRE_LOGOUT_SUCCESS :
            return state.set('error','Log out success')
        case PRE_LOGOUT_FAILURE :
            return state.set('isError',true)
                        .set('error',action.payload)
    }
    return state
}
