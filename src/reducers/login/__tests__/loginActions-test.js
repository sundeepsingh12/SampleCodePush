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

  MASTER_DOWNLOAD_START,
  MASTER_DOWNLOAD_SUCCESS,

  CHECK_ASSET_START,
  CHECK_ASSET_SUCCESS,

  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,

  DELETE_TOKEN_REQUEST,
  DELETE_TOKEN_SUCCESS,

  ON_AUTH_FORM_FIELD_CHANGE,

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

    it('should set job master download start ',() => {
        expect(actions.jobMasterDownloadStart()).toEqual({type: MASTER_DOWNLOAD_START})
    }) 

    it('should set job master download success ',() => {
        expect(actions.jobMasterDownloadSuccess()).toEqual({type: MASTER_DOWNLOAD_SUCCESS})
    }) 

    it('should set check asset start ',() => {
        expect(actions.checkAssetStart()).toEqual({type: CHECK_ASSET_START})
    }) 

    it('should set check asset success ',() => {
        expect(actions.checkAssetSuccess()).toEqual({type: CHECK_ASSET_SUCCESS})
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

    it('should set delete token request ',() => {
        expect(actions.deleteTokenRequest()).toEqual({type: DELETE_TOKEN_REQUEST})
    })
})
