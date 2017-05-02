/**
 * Created by udbhav on 2/5/17.
 */

import BackendFactory from '../../lib/BackendFactory'
import CONFIG from '../../lib/config'

class Logout{
    logout(){
        try {
            let logoutResponse = BackendFactory().serviceCall(null,CONFIG.API.LOGOUT_API,'GET')
            return logoutResponse
        } catch (error) {
            throw(error)
        }
    }
}

export let logoutService = new Logout()