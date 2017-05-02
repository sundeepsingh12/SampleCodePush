/**
 * Created by udbhav on 12/4/17.
 */

import BackendFactory from '../../lib/BackendFactory'

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
        console.log("authentication service login called")
        let data = new FormData()
        data.append('j_username', username)
        data.append('j_password', password)
        data.append('_spring_security_remember_me', false)
        data.append('submit', 'Login')

        return BackendFactory()._fetch({
            method: 'POST',
            headers: {},
            url: '/authentication',
            body: data
        })
            .then((res) => {
                switch(res.status){
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
            .catch((error) => {

                throw (error)
            })
    }

    /**
     * ### storeSessionToken
     * Store the session key
     */
    storeSessionToken(sessionToken) {
        
    }

    getJSessionId(){}
}

export let authenticationService = new Authentication()