/**
 * Created by udbhav on 12/4/17.
 */

import BackendFactory from '../../lib/BackendFactory'

class Authentication extends AuthenticationInterface {

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
     * status: 200 | 403
     * JSESSIONID: "r:Kt9wXIBWD0dNijNIq2u5rRllW"

     */
    login(username, password) {

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
                        break;
                    case 401:
                        throw ("Invalid User Credentials")
                        break;
                    case 502:
                        throw ("Bad Gateway")
                        break;
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