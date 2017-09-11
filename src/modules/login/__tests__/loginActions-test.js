'use strict'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { jobMasterService } from '../../../services/classes/JobMaster'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { authenticationService } from '../../../services/classes/Authentication'
import { deviceVerificationService } from '../../../services/classes/DeviceVerification'

var actions = require('../loginActions')
const {

    LOGOUT,
    LOGIN,

    LOGOUT_START,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,

    LOGIN_START,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,

    SESSION_TOKEN_REQUEST,
    SESSION_TOKEN_SUCCESS,
    SESSION_TOKEN_FAILURE,

    ON_LOGIN_USERNAME_CHANGE,
    ON_LOGIN_PASSWORD_CHANGE,
    TOGGLE_CHECKBOX,
    LOGIN_CAMERA_SCANNER,
    REMEMBER_ME_SET_TRUE,

    USERNAME,
    PASSWORD,
    REMEMBER_ME,

    TABLE_USER_SUMMARY,
} = require('../../../lib/constants').default


import { NavigationActions,StackNavigator } from 'react-navigation'

 const Application = () => {}
 const Login = () =>{}
 const Preloader = () => {}
 const Main = () => {}

 const NavigationContainer = StackNavigator(
   {
     application: {
       screen: Application,
     },
     login: {
       screen: Login,
     },
    preloader: {
      screen: Preloader,
     },
     main: {
       screen: Main,
     }
   }
 );

jest.mock('react-navigation')
const middlewares = [thunk]
const mockStore = configureStore(middlewares)


describe('loginActions', () => {

    it('should set logoutState()', () => {
        expect(actions.logoutState()).toEqual({ type: LOGOUT })
    })

    it('should set loginState()', () => {
        expect(actions.loginState()).toEqual({ type: LOGIN })
    })

    it('should set loginRequest()', () => {
        expect(actions.loginRequest()).toEqual({ type: LOGIN_START })
    })

    it('should set loginSuccess()', () => {
        expect(actions.loginSuccess()).toEqual({
            type: LOGIN_SUCCESS,
        })
    })

    it('should set loginFailure()', () => {
        const error = "This is error object"
        expect(actions.loginFailure(error)).toEqual({
            type: LOGIN_FAILURE,
            payload: error
        })
    })

    it('should set session token request ', () => {
        expect(actions.sessionTokenRequest()).toEqual({ type: SESSION_TOKEN_REQUEST })
    })

    it('should set session token request success', () => {
        const token = "test-token"
        expect(actions.sessionTokenRequestSuccess(token)).toEqual({
            type: SESSION_TOKEN_SUCCESS,
            payload: token
        })
    })

    it('should set session token request failure', () => {
        const error = undefined
        expect(actions.sessionTokenRequestFailure(error)).toEqual({
            type: SESSION_TOKEN_FAILURE,
            payload: null
        })
    })

    it('should set session token request failure', () => {
        const error = "error"
        expect(actions.sessionTokenRequestFailure(error)).toEqual({
            type: SESSION_TOKEN_FAILURE,
            payload: error
        })
    })

    it('should set username', () => {
        const username = 'testuser'
        expect(actions.onChangeUsername(username)).toEqual({
            type: ON_LOGIN_USERNAME_CHANGE,
            payload: username
        })
    })

    it('should set username', () => {
        const username = undefined
        expect(actions.onChangeUsername(username)).toEqual({
            type: ON_LOGIN_USERNAME_CHANGE,
            payload: username
        })
    })

    it('should set password', () => {
        const password = 'testuser'
        expect(actions.onChangePassword(password)).toEqual({
            type: ON_LOGIN_PASSWORD_CHANGE,
            payload: password
        })
    })

    it('should set password', () => {
        const password = undefined
        expect(actions.onChangePassword(password)).toEqual({
            type: ON_LOGIN_PASSWORD_CHANGE,
            payload: password
        })
    })

    it('should start scanner', () => {
        expect(actions.startScanner()).toEqual({
            type: LOGIN_CAMERA_SCANNER,
            payload: true
        })
    })

    it('should stop scanner', () => {
        expect(actions.stopScanner()).toEqual({
            type: LOGIN_CAMERA_SCANNER,
            payload: false
        })
    })

    it('should stop toggle checkbox', () => {
        expect(actions.toggleCheckbox()).toEqual({
            type: TOGGLE_CHECKBOX
        })
    })

    it('should set remember me true', () => {
        expect(actions.rememberMeSetTrue()).toEqual({
            type: REMEMBER_ME_SET_TRUE
        })
    })

    it('should authenticate user success', () => {
        const expectedActions = [
            { type: LOGIN_START },
            { type: LOGIN_SUCCESS }
        ]

        const store = mockStore({})
        const username = 'test'
        const password = 'test'
        const rememberMe = false
        authenticationService.login = jest.fn()
        authenticationService.login.mockReturnValue({
            headers: {
                map: {
                    'set-cookie': [
                        'JSESSIONID=92e55d39-ee63-429f-9192-2ce0f7db1a34; Path=/; Secure; HttpOnly'
                    ]
                }

            }
        })
        keyValueDBService.validateAndSaveData = jest.fn()
        authenticationService.saveLoginCredentials = jest.fn()
        return store.dispatch(actions.authenticateUser(username, password, rememberMe))
            .then(() => {
                expect(authenticationService.login).toHaveBeenCalled()
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalled()
                expect(authenticationService.saveLoginCredentials).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    it('should authenticate user fail', () => {
        const error = 'test error'
        const expectedActions = [
            { type: LOGIN_START },
            {
                type: LOGIN_FAILURE,
                payload: error
            }
        ]

        const store = mockStore({})
        const username = 'test'
        const password = 'test'
        const rememberMe = false
        authenticationService.login = jest.fn(() => {
            throw new Error(error)
        })
        keyValueDBService.validateAndSaveData = jest.fn()
        authenticationService.saveLoginCredentials = jest.fn()
        return store.dispatch(actions.authenticateUser(username, password, rememberMe))
            .then(() => {
                expect(authenticationService.login).toHaveBeenCalled()
                expect(keyValueDBService.validateAndSaveData).not.toHaveBeenCalled()
                expect(authenticationService.saveLoginCredentials).not.toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })

    it('should check remember me', () => {
        const username = 'test'
        const password = 'test'
        const expectedActions = [
            {
                type: ON_LOGIN_USERNAME_CHANGE,
                payload: username
            },
            {
                type: ON_LOGIN_PASSWORD_CHANGE,
                payload: password
            },
            {
                type: REMEMBER_ME_SET_TRUE
            }
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(true)
            .mockReturnValueOnce({
                value: username
            })
            .mockReturnValueOnce({
                value: password
            })
        const store = mockStore({})
        return store.dispatch(actions.checkRememberMe())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(3)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[2].type).toEqual(expectedActions[2].type)
            })
    })

    it('should not check remember me', () => {
        const username = 'test'
        const password = 'test'
        const expectedActions = [
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(false)
            .mockReturnValueOnce({
                value: username
            })
            .mockReturnValueOnce({
                value: password
            })
        const store = mockStore({})
        return store.dispatch(actions.checkRememberMe())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            })
    })

    it('should open tabbar', () => {
        const username = 'test'
        const password = 'test'
        const expectedActions = [
            { type: SESSION_TOKEN_REQUEST },
           
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: 'xyz'
        })
            .mockReturnValueOnce({
                value: true
            })
        const store = mockStore({})
         const navigationContainer = renderer.create(<NavigationContainer />).getInstance();
        return store.dispatch(actions.getSessionToken())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(navigationContainer.dispatch(NavigationActions.navigate({ routeName: 'main' }))).toEqual(true);
            })
    })

    it('should open preloader', () => {
        const username = 'test'
        const password = 'test'
        const expectedActions = [
            { type: SESSION_TOKEN_REQUEST },
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: 'xyz'
        })
            .mockReturnValueOnce({
                value: false
            })
        const store = mockStore({})
        return store.dispatch(actions.getSessionToken())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
            })
    })

    it('should open login', () => {
        const username = 'test'
        const password = 'test'
        const expectedActions = [
            { type: SESSION_TOKEN_REQUEST },
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
            .mockReturnValueOnce({
                value: false
            })
        const store = mockStore({})
        return store.dispatch(actions.getSessionToken())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
            })
    })

    it('should open login from catch', () => {
        const error = 'test error'
        const username = 'test'
        const password = 'test'
        const expectedActions = [
            { type: SESSION_TOKEN_REQUEST },
            {
                type: SESSION_TOKEN_FAILURE,
                payload: error
            }
        ]
        keyValueDBService.getValueFromStore = jest.fn(() => {
            throw new Error(error)
        })
        const store = mockStore({})
        return store.dispatch(actions.getSessionToken())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

})
