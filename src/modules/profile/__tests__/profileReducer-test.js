'use strict'

import InitialState from '../profileInitialState'

import {
    FETCH_USER_DETAILS,
    CHECK_CURRENT_PASSWORD,
    SET_NEW_PASSWORD,
    SET_CONFIRM_NEW_PASSWORD,
    CLEAR_PASSWORD_TEXTINPUT,
    TOGGLE_SAVE_RESET_BUTTON,
    RESET_STATE,
} from '../../../lib/constants'
import profileReducer from '../profileReducer'

const initialState = new InitialState()

describe('Profile  Reducer', () => {

    it('it starts fetching user details ', () => {
        let userDetails = {
            nameOfUser: 'Mathew',
            contactOfUser: '9876543210',
            emailOfUser: 'abc@xyz.com'
        }
        let action = {
            type: FETCH_USER_DETAILS,
            payload: userDetails
        }
        let nextState = profileReducer(undefined, action)
        expect(nextState.nameOfUser).toBe(initialState.nameOfUser)
        expect(nextState.contactOfUser).toBe(initialState.contactOfUser)
        expect(nextState.emailOfUser).toBe(initialState.emailOfUser)
    })

    it('it clears current and new password entered by user', () => {
        let allPasswords = {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
        let action = {
            type: CLEAR_PASSWORD_TEXTINPUT,
            payload: allPasswords
        }
        let nextState = profileReducer(undefined, action)
        expect(nextState.currentPassword).toBe(initialState.currentPassword)
        expect(nextState.newPassword).toBe(initialState.newPassword)
        expect(nextState.confirmNewPassword).toBe(initialState.confirmNewPassword)
    })

    it('it checks current password ', () => {
        let currentPassword = 'Adf324##9'
        let action = {
            type: CHECK_CURRENT_PASSWORD,
            payload: currentPassword
        }
        let nextState = profileReducer(undefined, action)
        expect(nextState.currentPassword).toBe(currentPassword)
    })

    it('it sets new password ', () => {
        let newPassword = 'Adf324##9'
        let action = {
            type: SET_NEW_PASSWORD,
            payload: newPassword
        }
        let nextState = profileReducer(undefined, action)
        expect(nextState.newPassword).toBe(newPassword)
    })

    it('it sets confirm new password ', () => {
        let confirmNewPassword = 'Adf324##9'
        let action = {
            type: SET_CONFIRM_NEW_PASSWORD,
            payload: confirmNewPassword
        }
        let nextState = profileReducer(undefined, action)
        expect(nextState.confirmNewPassword).toBe(confirmNewPassword)
    })

    it('it toggles save reset button ', () => {
        let payload = false
        let action = {
            type: TOGGLE_SAVE_RESET_BUTTON,
            payload: payload
        }
        let nextState = profileReducer(undefined, action)
        expect(nextState.isSaveResetButtonDisabled).toBe(payload)
    })

    it('it Reset state ', () => {
        let payload = false
        let action = {
            type: RESET_STATE,
            payload: payload
        }
        let nextState = profileReducer(undefined, action)
        expect(initialState).toBe(initialState)
    })

    it('it sets initial state ', () => {
        let payload = false
        let action = {
            type: "ABCD_LKJH",
            payload: payload
        }
        let nextState = profileReducer(undefined, action)
        expect(initialState).toBe(initialState)
    })
})