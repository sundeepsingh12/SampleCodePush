'use strict'

var actions = require('../globalActions')
import {
    SET_SESSION_TOKEN,
    SET_STORE,
    ON_GLOBAL_USERNAME_CHANGE,
    ON_GLOBAL_PASSWORD_CHANGE,
    SET_CREDENTIALS,
    LOGOUT_START,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    USER_SUMMARY,
    JOB_SUMMARY,
    IS_PRELOADER_COMPLETE
} from '../../../lib/constants'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { keyValueDBService } from '../../../services/classes/KeyValueDBService'

import CONFIG from '../../../lib/config'

import { onChangePassword, onChangeUsername } from '../../login/loginActions'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('global actions', () => {

    it('should delete session token', () => {
        const expectedActions = [
            {
                type: 'ON_LOGIN_PASSWORD_CHANGE',
                payload: ''
            },
            {
                type: 'ON_LOGIN_USERNAME_CHANGE',
                payload: ''
            }
        ]
        keyValueDBService.deleteValueFromStore = jest.fn()
        const store = mockStore({})
        return store.dispatch(actions.deleteSessionToken())
            .then(() => {
                expect(keyValueDBService.deleteValueFromStore).toHaveBeenCalledTimes(6)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should not delete session token', () => {
        keyValueDBService.deleteValueFromStore = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        try {
            actions.deleteSessionToken()
        } catch(error) {
            expect(error.message).toEqual(message)
        }
    })

})