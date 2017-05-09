'use strict'


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
  
  USERNAME,
  PASSWORD,
  REMEMBER_ME,

  TABLE_USER_SUMMARY,
} = require('../../../lib/constants').default


describe('loginActions',() => {

    it('should set logoutState()',() => {
        expect(actions.logoutState()).toEqual({type: LOGOUT})
    })

    it('should set loginState()',() => {
        expect(actions.loginState()).toEqual({type: LOGIN})
    })

    it('should set loginRequest()',() => {
        expect(actions.loginRequest()).toEqual({type: LOGIN_START})
    })

    it('should set loginSuccess()',() => {
        const j_sessionid="test_session_id";
        expect(actions.loginSuccess(j_sessionid)).toEqual({
            type: LOGIN_SUCCESS,
            payload: j_sessionid
        })
    })

    it('should set loginFailure()',() => {
        const error = "This is error object"
        expect(actions.loginFailure(error)).toEqual({
            type: LOGIN_FAILURE,
            payload: error
        })
    })

    it('should set session token request ',() => {
        expect(actions.sessionTokenRequest()).toEqual({type: SESSION_TOKEN_REQUEST})
    })

    it('should set session token request success',() => {
        const token = "test-token"
        expect(actions.sessionTokenRequestSuccess(token)).toEqual({
            type: SESSION_TOKEN_SUCCESS,
            payload : token
        })
    })

    it('should set session token request failure',() => {
        const error = undefined
        expect(actions.sessionTokenRequestFailure(error)).toEqual({
            type: SESSION_TOKEN_FAILURE,
            payload : null
        })
    })

    it('should set session token request failure',() => {
        const error = "error"
        expect(actions.sessionTokenRequestFailure(error)).toEqual({
            type: SESSION_TOKEN_FAILURE,
            payload : error
        })
    })

    it('should set username',() => {
        const username = 'testuser'
        expect(actions.onChangeUsername(username)).toEqual({
            type: ON_LOGIN_USERNAME_CHANGE,
            payload: username
        })
    })

    it('should set username',() => {
        const username = undefined
        expect(actions.onChangeUsername(username)).toEqual({
            type: ON_LOGIN_USERNAME_CHANGE,
            payload: username
        })
    })

    it('should set password',() => {
        const password = 'testuser'
        expect(actions.onChangePassword(password)).toEqual({
            type: ON_LOGIN_PASSWORD_CHANGE,
            payload: password
        })
    })

    it('should set password',() => {
        const password = undefined
        expect(actions.onChangePassword(password)).toEqual({
            type: ON_LOGIN_PASSWORD_CHANGE,
            payload: password
        })
    })

    it('should start scanner',() => {
        expect(actions.startScanner()).toEqual({
            type: LOGIN_CAMERA_SCANNER,
            payload: true
        })
    })

    it('should stop scanner',() => {
        expect(actions.stopScanner()).toEqual({
            type: LOGIN_CAMERA_SCANNER,
            payload: false
        })
    })

    it('should stop toggle checkbox',() => {
        expect(actions.toggleCheckbox()).toEqual({
            type: TOGGLE_CHECKBOX
        })
    })


})
