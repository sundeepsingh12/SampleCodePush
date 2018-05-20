'use strict'

const InitialState = require('./mosambeeWalletIntialState').default
import {
    SET_MOSAMBEE_WALLET_PARAMETERS,
    SET_ERROR_MESSAGE_FOR_WALLET,
    SET_MODAL_VIEW,
    SET_OTP_MODAL_VIEW,
    CHANGE_WALLET_MOBILE_NO,
    SET_OTP_FOR_WALLET,
    CHANGE_OTP_NUMBER,
    SET_LOADER_FOR_WALLET,
    RESET_STATE_FOR_WALLET,
    SET_ERROR_FOR_OTP
} from '../../../lib/constants'

const initialState = new InitialState()

export default function mosambeeWalletPaymentReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case SET_MOSAMBEE_WALLET_PARAMETERS:
            return state.set('walletParameters', action.payload.walletParameters)
                        .set('walletList', action.payload.walletList)
                        .set('isModalVisible', action.payload.isModalVisible)
                        .set('contactNumber', action.payload.contactNumber)
                        .set('isLoaderRunning', false)
        case SET_ERROR_MESSAGE_FOR_WALLET:
            return state.set('errorMessage', action.payload.errorMessage)
                        .set('isModalVisible', action.payload.isModalVisible)
                        .set('isLoaderRunning', false)
                        .set('otpNumber', null)
        case SET_ERROR_FOR_OTP:
            return state.set('errorMessage', action.payload)
        case SET_MODAL_VIEW:
            return state.set('isModalVisible', action.payload)
                        .set('isLoaderRunning', false)
                        .set('errorMessage', null)
                        .set('otpNumber', null)
        case SET_OTP_MODAL_VIEW:
            return state.set('isModalVisible', action.payload.isModalVisible)
                        .set('selectedWalletDetails', action.payload.selectedWalletDetails)
        case CHANGE_WALLET_MOBILE_NO:
            return state.set('contactNumber', action.payload)
                        .set('errorMessage', null)
        case CHANGE_OTP_NUMBER:
            return state.set('otpNumber', action.payload)
                        .set('errorMessage', null)
        case SET_LOADER_FOR_WALLET:
            return state.set('isLoaderRunning', true)
                        .set('isModalVisible', action.payload)
        case RESET_STATE_FOR_WALLET:
            return initialState
    }

    return state
}