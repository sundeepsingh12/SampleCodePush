/**
 * Created by udbhav on 12/4/17.
 */

import RestAPIFactory from '../../lib/RestAPIFactory'
import { keyValueDBService } from './KeyValueDBService'
import CONFIG from '../../lib/config'
const {
    USERNAME,
    PASSWORD,
    REMEMBER_ME,

} = require('../../lib/constants').default

import * as realm from '../../repositories/realmdb'

class Authentication {

    /**
     * ### login
     *
     * @param
     * * * * *  FORM DATA * * * * * * *
     *  j_username : 597ede
     *  j_password : 5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5
     *
     *
     *  * @returns
     * * * * *  HEADERS  * * * * * * *
     * status: 200 : successful login,JSESSIONID: "r:Kt9wXIBWD0dNijNIq2u5rRllW"
     * 401 : invalid username | password
     * 502 : bad gateway
     *1201 : user already logged in (single login functionality)
     *1203 : user locked
     * 500 : internal server error
     *

     */
    login(username, password) {
        let data = new FormData()
        data.append('j_username', username)
        data.append('j_password', password)
        data.append('_spring_security_remember_me', false)
        data.append('submit', 'Login')
        let authenticationResponse = RestAPIFactory().serviceCall(data, CONFIG.API.AUTHENTICATION_API, 'LOGIN')
        return authenticationResponse
    }

    /**
     * save login credentials if remember me true
     * @param {*} username 
     * @param {*} password 
     * @param {*} rememberMe 
     */
    saveLoginCredentials(username, password, rememberMe) {
        if (rememberMe) {
            keyValueDBService.validateAndSaveData(USERNAME, username)
            keyValueDBService.validateAndSaveData(PASSWORD, password)
            keyValueDBService.validateAndSaveData(REMEMBER_ME, rememberMe)
        } else {
            keyValueDBService.deleteValueFromStore(USERNAME)
            keyValueDBService.deleteValueFromStore(PASSWORD)
            keyValueDBService.deleteValueFromStore(REMEMBER_ME)
        }
    }

    /**
     * LOGOUT API (GET)
     * @param {*} token 
     */
    logout(token) {
        if(!token) {
            throw new Error('Token Missing')
        }
        let logoutResponse = RestAPIFactory(token.value).serviceCall(null, CONFIG.API.LOGOUT_API, 'GET')
        return logoutResponse
    }

}

export let authenticationService = new Authentication()