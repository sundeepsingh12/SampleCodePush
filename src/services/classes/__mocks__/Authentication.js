'use strict'

require('regenerator-runtime/runtime')

class Authentication {

    login(username,password) {
        return {
            headers : {
                map : {
                    'set-cookie' :[
                        'JSESSIONID=92e55d39-ee63-429f-9192-2ce0f7db1a34; Path=/; Secure; HttpOnly'
                    ]
                }
                
            }
        }
    }

    saveLoginCredentials(username ,password, rememberMe) {
        return username
    }

    logout(token) {
    }
}

export let authenticationService = new Authentication()