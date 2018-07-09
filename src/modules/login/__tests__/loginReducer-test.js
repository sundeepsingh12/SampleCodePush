'use strict'


import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_CAMERA_SCANNER,

  SET_STATE,
  ON_LOGIN_USERNAME_CHANGE,
  ON_LOGIN_PASSWORD_CHANGE,
  TOGGLE_CHECKBOX,
  REMEMBER_ME_SET_TRUE,
  ON_LONG_PRESS_ICON
} from '../../../lib/constants'

import authReducer from '../loginReducer'

describe('login reducer without initial state',() => {

    it('should set login start()',() => {
        const action = {
            type : LOGIN_START
        }
        let nextState = authReducer(undefined,action)
        expect(nextState.form.authenticationService).toBe(true)
        expect(nextState.form.displayMessage).toBe('')
        expect(nextState.form.isButtonDisabled).toBe(true)
        expect(nextState.form.isEditTextEnabled).toBe(true)
    })

    it('should set login success',() => {
        const action = {
            type : LOGIN_SUCCESS
        }
        let nextState = authReducer(undefined,action)
        expect(nextState.form.authenticationService).toBe(false)
        expect(nextState.form.displayMessage).toBe('')
        expect(nextState.form.isButtonDisabled).toBe(false)
        expect(nextState.form.isEditTextEnabled).toBe(false)
    })
    it('should set reset setting on long press',() => {
        const action = {
            type : ON_LONG_PRESS_ICON,
            payload: true
        }
        let nextState = authReducer(undefined,action)
        expect(nextState.form.isLongPress).toBe(true)
    })

    it('should set login failure',() => {
        const error = 'test error'
        const action = {
            type : LOGIN_FAILURE,
            payload : error
        }
        let nextState = authReducer(undefined,action)
        expect(nextState.form.authenticationService).toBe(false)
        expect(nextState.form.displayMessage).toBe('test error')
        expect(nextState.form.isButtonDisabled).toBe(true)
        expect(nextState.form.isEditTextEnabled).toBe(false)
        expect(nextState.form.password).toBe('')
    })

    it('should set change username',() => {
        const username = 'test'
        const action = {
            type : ON_LOGIN_USERNAME_CHANGE,
            payload : username
        }
        let nextState = authReducer(undefined,action)
        expect(nextState.form.isButtonDisabled).toBe(true)
        expect(nextState.form.username).toBe('test')
    })

    it('should set change password',() => {
        const password = 'test'
        const action = {
            type : ON_LOGIN_PASSWORD_CHANGE,
            payload : password
        }
        let nextState = authReducer(undefined,action)
        expect(nextState.form.isButtonDisabled).toBe(true)
        expect(nextState.form.password).toBe('test')
    })

    it('should set scanner',() => {
        const action = {
            type : LOGIN_CAMERA_SCANNER,
            payload : true
        }
        let nextState = authReducer(undefined,action)
        expect(nextState.form.isCameraScannerActive).toBe(true)
    })

    it('should toggle checkbox',() => {
        const action = {
            type : TOGGLE_CHECKBOX,
        }
        let nextState = authReducer(undefined,action)
        expect(nextState.form.rememberMe).toBe(true)
    })

    it('should set remember me true',() => {
        const action = {
            type : REMEMBER_ME_SET_TRUE,
        }
        let nextState = authReducer(undefined,action)
        expect(nextState.form.rememberMe).toBe(true)
    })

})