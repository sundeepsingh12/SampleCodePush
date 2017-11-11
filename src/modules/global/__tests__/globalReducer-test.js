'use strict'


import {
  SET_SESSION_TOKEN,

  GET_PROFILE_SUCCESS,
  SIGNUP_SUCCESS,
  LOGIN_SUCCESS,
  SESSION_TOKEN_SUCCESS,

  LOGOUT_SUCCESS,

  GET_STATE,
  SET_STATE,
  SET_STORE,
  ON_GLOBAL_USERNAME_CHANGE,
  ON_GLOBAL_PASSWORD_CHANGE,
  SET_CREDENTIALS
} from '../../../lib/constants'

import globalReducer from '../globalReducer'

describe('global reducer without initial state',() => {
    
    it('should set store',() => {
        const store = 'test'
        const action = {
            type : SET_STORE,
            payload : store
        }
        let nextState = globalReducer(undefined,action)
        expect(nextState.store).toBe(store)
    })
})