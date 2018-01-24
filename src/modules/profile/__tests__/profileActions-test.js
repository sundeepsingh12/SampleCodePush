'use strict'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { profileService } from '../../../services/classes/ProfileService'
import * as actions from '../profileActions'
import { setState } from '../../global/globalActions'
import {
    CLEAR_PASSWORD_TEXTINPUT,
    FETCH_USER_DETAILS,
} from '../../../lib/constants'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
import { Toast } from 'native-base'

describe('profile Actions  fetch UserList', () => {

    it('should fetch UserList', () => {
        let type = FETCH_USER_DETAILS
        let userDetails = {
            nameOfUser: 'Mathew',
            contactOfUser: '9876543210',
            emailOfUser: 'abc@xyz.com'
        }
        let payload = userDetails
        expect(setState(type, payload)).toEqual({
            type: type,
            payload: userDetails
        })
    })

    it('should fetch UserList', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(
            {
                value: {
                    firstName: "Abhi",
                    lastName: "Shake",
                    mobileNumber: 9876565432,
                    email: "abishake@gmail.com",
                }
            }
        )
        const store = mockStore({})
        return store.dispatch(actions.fetchUserList())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            })
    })

    it('should fetch UserList', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        const store = mockStore({})
        return store.dispatch(actions.fetchUserList())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            })
    })
})

describe('cashtendering  check And Reset Password', () => {
    it('should check And Reset Password', () => {
        let type = CLEAR_PASSWORD_TEXTINPUT
        let allPasswords = {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
        let payload = {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
        expect(setState(type, payload)).toEqual({
            type: type,
            payload: allPasswords
        })
    })

    it('should check And Reset Password', () => {
        let currentPassword = "aSdv123@"
        let newPassword = "xcVb43%3"
        let confirmNewPassword = "xcVb43%3"
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        profileService.getResponse = jest.fn()
        profileService.getResponse.mockReturnValue({
            status: 2090
        })
        const store = mockStore({})
        return store.dispatch(actions.checkAndResetPassword(currentPassword, newPassword, confirmNewPassword))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(profileService.getResponse).toHaveBeenCalled()
            })
    })

    it('should check And Reset Password', () => {
        let currentPassword = "aSdv123@"
        let newPassword = "xcVb43%3"
        let confirmNewPassword = "xcVb43%3"
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        keyValueDBService.validateAndSaveData = jest.fn()
        keyValueDBService.validateAndSaveData.mockReturnValue({})
        profileService.getResponse = jest.fn()
        profileService.getResponse.mockReturnValue({
            status: 200
        })
        Toast.show = jest.fn()
        Toast.show.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.checkAndResetPassword(currentPassword, newPassword, confirmNewPassword))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(profileService.getResponse).toHaveBeenCalled()
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalled()
                expect(Toast.show).toHaveBeenCalled()
            })
    })

})