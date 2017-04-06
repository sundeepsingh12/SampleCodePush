'use strict'


var actions = require('../authActions')
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

  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,

  DELETE_TOKEN_REQUEST,
  DELETE_TOKEN_SUCCESS,

  ON_AUTH_FORM_FIELD_CHANGE,

  TABLE_USER_SUMMARY,
} = require('../../../lib/constants').default


describe('authActions',()=>{
    it('should set logoutState()',()=>{
        expect(actions.logoutState()).toEqual({type: LOGOUT})
    })
    it('should set loginState()',()=>{
        expect(actions.loginState()).toEqual({type: LOGIN})
    })
    it('should set loginRequest()',()=>{
        expect(actions.loginRequest()).toEqual({type: LOGIN_START})
    })
    it('should set loginSuccess()',()=>{
        const j_sessionid="test_session_id";
        expect(actions.loginSuccess(j_sessionid)).toEqual({
            type: LOGIN_SUCCESS,
            payload: j_sessionid
        })
    })
    it('should set loginFailure()',()=>{
        const error = "This is error object"
        expect(actions.loginFailure(error)).toEqual({
            type: LOGIN_FAILURE,
            payload: error
        })
    })
})
