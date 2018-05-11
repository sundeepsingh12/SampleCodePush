
'use strict'

import InitialState from './profileInitialState'
import {
    FETCH_USER_DETAILS,
    CHECK_CURRENT_PASSWORD,
    SET_NEW_PASSWORD,
    SET_CONFIRM_NEW_PASSWORD,
    CLEAR_PASSWORD_TEXTINPUT,
    TOGGLE_SAVE_RESET_BUTTON,
    IS_PROFILE_LOADING,
    RESET_STATE
} from '../../lib/constants'

const initialState = new InitialState()

export default function profileReducer(state = initialState, action) {
    switch (action.type) {

        case FETCH_USER_DETAILS:
            return state.set('name', action.payload.nameOfUser)
                .set('contactNumber', action.payload.contactOfUser)
                .set('email', action.payload.emailOfUser)

        case CLEAR_PASSWORD_TEXTINPUT:
            return state.set('currentPassword', '')
                .set('newPassword', '')
                .set('confirmNewPassword', '')
                .set('isSaveResetButtonDisabled', true)

        case CHECK_CURRENT_PASSWORD:
            return state.set('currentPassword', action.payload)

        case SET_NEW_PASSWORD:
            return state.set('newPassword', action.payload)

        case SET_CONFIRM_NEW_PASSWORD:
            return state.set('confirmNewPassword', action.payload)

        case TOGGLE_SAVE_RESET_BUTTON:
            return state.set('isSaveResetButtonDisabled', action.payload)

        case IS_PROFILE_LOADING:
            return state.set('isLoaderInProfile', action.payload)

        case RESET_STATE:
            return initialState
    }
    return state
}