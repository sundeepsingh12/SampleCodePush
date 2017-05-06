/**
 * Created by udbhav on 2/5/17.
 */

import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import {keyValueDBService} from './KeyValueDBService'

class Logout {
    logout() {
        try {
            let token = keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            console.log('token logout')
            console.log(token)
            let logoutResponse = RestAPIFactory().serviceCall(null,CONFIG.API.LOGOUT_API,'GET')
            return logoutResponse
        } catch (error) {
            throw(error)
        }
    }
}

export let logoutService = new Logout()