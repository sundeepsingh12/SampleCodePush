'use strict'

const InitialState = require('./saveActivatedInitialState').default

const initialState = new InitialState()

import {
    LOADER_ACTIVE,
    POPULATE_DATA,
    SAVE_ACTIVATED_INITIAL_STATE,
    DELETE_ITEM_SAVE_ACTIVATED,
    CONTACT_NUMBER_TO_SEND_SMS,
    SET_SAVE_ACTIVATED_TOAST_MESSAGE,
    EMAILID_VIEW_ARRAY,
    IS_COMPANY_CODE_DHL
} from '../../lib/constants'

export default function saveActivatedReducer(state = initialState, action) {
    switch (action.type) {
        case LOADER_ACTIVE:
            return state.set('loading', action.payload)
        case POPULATE_DATA:
            return state.set('commonData', action.payload.commonData)
                .set('headerTitle', action.payload.statusName)
                .set('recurringData', action.payload.differentData)
                .set('isSignOffVisible', action.payload.isSignOffVisible)
                .set('loading', false)

        case SAVE_ACTIVATED_INITIAL_STATE:
            return initialState

        case DELETE_ITEM_SAVE_ACTIVATED:
            return state.set('recurringData', action.payload)

        case CONTACT_NUMBER_TO_SEND_SMS:
            return state.set('inputTextToSendSms', action.payload)

        case SET_SAVE_ACTIVATED_TOAST_MESSAGE:
            return state.set('errorToastMessage', action.payload)
                .set('loading', false)
        case EMAILID_VIEW_ARRAY:
            return state.set('emailIdViewArray', action.payload.email)
                .set('inputTextEmailIds', action.payload.inputTextEmail)
        case IS_COMPANY_CODE_DHL:
            return state.set('companyCodeDhl', action.payload)
    }

    return state
}
