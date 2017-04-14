/**
 * Created by udbhav on 12/4/17.
 */

import AuthenticationInterface from '../interfaces/AuthenticationInterface'
import RestAPI from '../../lib/RestAPI'

class Authentication extends AuthenticationInterface {

    login(j_username, j_password) {
        var data = new FormData()
        data.append('j_username', username)
        data.append('j_password', password)
        data.append('_spring_security_remember_me', false)
        data.append('submit', 'Login')

        return this._fetch({
            method: 'POST',
            headers: {},
            url: '/authentication',
            body: data
        })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    //Extracting j_sessionid from Header
                    return (res.headers.map['set-cookie'][0]).split("; ")[0];
                } else {
                    throw ("Invalid username/password")
                }
            })
            .catch((error) => {
                throw (error)
            })
    }

}