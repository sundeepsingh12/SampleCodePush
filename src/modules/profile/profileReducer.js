
'use strict'

import InitialState from './profileInitialState'
import {
    FETCH_USER_DETAILS,
    CHECK_CURRENT_PASSWORD,
    SET_NEW_PASSWORD,
    SET_CONFIRM_NEW_PASSWORD,
    CLEAR_PASSWORD_TEXTINPUT,
    TOGGLE_SAVE_RESET_BUTTON,
} from '../../lib/constants'

const initialState = new InitialState()

export default function profileReducer(state = initialState, action) {
    switch (action.type) {

        case FETCH_USER_DETAILS:
            return state.set('name', action.payload.nameOfUser)
                .set('contactNumber', action.payload.contactOfUser)
                .set('email', action.payload.emailOfUser)

        case CLEAR_PASSWORD_TEXTINPUT:
            return state.set('currentPassword', action.payload.currentPassword)
                .set('newPassword', action.payload.newPassword)
                .set('confirmNewPassword', action.payload.confirmNewPassword)

        case CHECK_CURRENT_PASSWORD:
            return state.set('currentPassword', action.payload)

        case SET_NEW_PASSWORD:
            return state.set('newPassword', action.payload)

        case SET_CONFIRM_NEW_PASSWORD:
            return state.set('confirmNewPassword', action.payload)

        case TOGGLE_SAVE_RESET_BUTTON:
            return state.set('isSaveResetButtonDisabled', action.payload)
    }
    return state
}