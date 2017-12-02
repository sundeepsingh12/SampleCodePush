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
jest.mock('react-native-router-flux')
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

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

})