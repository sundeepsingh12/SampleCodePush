/**
 * # globalActions.js
 *
 * Actions that are global in nature
 */
'use strict'

const {
  SET_SESSION_TOKEN,
    SET_STORE,
    ON_GLOBAL_USERNAME_CHANGE,
    ON_GLOBAL_PASSWORD_CHANGE,
    SET_CREDENTIALS,
    LOGOUT_START,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
} = require('../../lib/constants').default

import {keyValueDB} from '../../repositories/keyValueDb'

import CONFIG from '../../lib/config'
/**
 * ## set the sessionToken
 *
 */
export function setSessionToken(sessionToken) {
  return {
    type: SET_SESSION_TOKEN,
    payload: sessionToken
  }
}

/**
 * ## set the store
 *
 * this is the Redux store
 *
 * this is here to support Hot Loading
 *
 */
export function setStore(store) {
  return {
    type: SET_STORE,
    payload: store
  }
}

/**Saves username and password in global state
 *
 * @param credentials
 * @return {{type: *, payload: *}}
 */
export function setCredentials(credentials) {
  return {
    type: SET_CREDENTIALS,
    payload: credentials
  }
}

export function checkConnection() {
  return {
    type: INTERNET_CONNECTION_STATUS
  }
}


/**
 * ## Logout actions
 */
export function logoutRequest() {
    return {
        type: LOGOUT_START
    }
}

export function logoutSuccess() {
    return {
        type: LOGOUT_SUCCESS
    }
}
export function logoutFailure(error) {
    return {
        type: LOGOUT_FAILURE,
        payload: error
    }
}


/**
 * ## DeleteToken actions
 */
// export function deleteTokenRequest() {
//     return {
//         type: DELETE_TOKEN_REQUEST
//     }
// }
// export function deleteTokenRequestSuccess() {
//     return {
//         type: DELETE_TOKEN_SUCCESS
//     }
// }


export function deleteSessionToken() {
    return async function (dispatch) {
        try {
            console.log('deleteSessionToken')
            const response = await keyValueDB.deleteValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            console.log('deleteSessionToken success')
        }catch(error){

        }
    }

}
