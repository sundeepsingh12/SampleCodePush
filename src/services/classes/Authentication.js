/**
 * Created by udbhav on 12/4/17.
 */

import RestAPIFactory from '../../lib/RestAPIFactory'
import {keyValueDBService} from './KeyValueDBService'
const {
    USERNAME,
    PASSWORD,
    REMEMBER_ME,

} = require('../../lib/constants').default

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

        return RestAPIFactory()._fetch({
            method: 'POST',
            headers: {},
            url: '/authentication',
            body: data
        })
            .then((res) => {
            console.log(res.status)
                switch (res.status) {
                    case 200:
                        return (res.headers.map['set-cookie'][0]).split("; ")[0];
                    case 401:
                        throw ("Invalid User Credentials")
                    case 500:
                        throw ("Internal server error")
                    case 502:
                        throw ("Bad Gateway")
                    case 1201:
                        throw ("User already logged in ")
                    case 1203:
                        throw ("User locked.Try after 15 minutes")
                    default:
                        throw ("Error ")
                }
            })
    }

    /**
     * save login credentials if remember me true
     * @param {*} username 
     * @param {*} password 
     * @param {*} rememberMe 
     */
    saveLoginCredentials(username,password,rememberMe) {
        if(rememberMe) {
            console.log('rememberMe save')
            console.log(rememberMe)
            keyValueDBService.validateAndSaveData(USERNAME,username)
            keyValueDBService.validateAndSaveData(PASSWORD,password)
            keyValueDBService.validateAndSaveData(REMEMBER_ME,rememberMe)
        } else {
            console.log('rememberMe delete')
            console.log(rememberMe)
            keyValueDBService.deleteValueFromStore(USERNAME)
            keyValueDBService.deleteValueFromStore(PASSWORD)
            keyValueDBService.deleteValueFromStore(REMEMBER_ME)
        }
    }

}

export let authenticationService = new Authentication()