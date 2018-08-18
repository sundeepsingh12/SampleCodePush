/**
 * Created by udbhav on 12/4/17.
 */

import RestAPIFactory from '../../lib/RestAPIFactory'
import { keyValueDBService } from './KeyValueDBService'
import { trackingService } from './Tracking'
import CONFIG from '../../lib/config'
import {
    USERNAME,
    PASSWORD,
    REMEMBER_ME,
    USER,
    GEO_FENCING
} from '../../lib/constants'
import { backupService } from './BackupService'
import { sync } from './Sync'
import { logoutService } from './Logout'
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
        keyValueDBService.validateAndSaveData(USERNAME, username)
        keyValueDBService.validateAndSaveData(PASSWORD, password)
        if (!rememberMe) {
            keyValueDBService.deleteValueFromStore(REMEMBER_ME)
        }
        else {
            keyValueDBService.validateAndSaveData(REMEMBER_ME, rememberMe)
        }
    }


    async logout(calledFromAutoLogout, isPreLoaderComplete) {
        const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        if (!token || !token.value) {
            throw new Error('Token Missing')
        }
        if (isPreLoaderComplete && isPreLoaderComplete.value) {
            await backupService.createBackupOnLogout()
        }
        const userObject = await keyValueDBService.getValueFromStore(USER)
        await sync.deregisterFcmTokenFromServer(userObject, token)
        let logoutResponse = await RestAPIFactory(token.value).serviceCall(null, CONFIG.API.LOGOUT_API, 'GET')
        await logoutService.deleteDataBase()
        if (calledFromAutoLogout) {
            const fenceIdentifier = await keyValueDBService.getValueFromStore(GEO_FENCING)
            await trackingService.inValidateStoreVariables(fenceIdentifier)
        }
        return logoutResponse
    }

    validatePassword(password) {
        let regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        return regex.test(password)
    }
}

export let authenticationService = new Authentication()