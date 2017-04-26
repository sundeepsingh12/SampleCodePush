'use strict'

import SimVerifyInterface from '../interfaces/SimVerifyInterface'
import CONFIG from '../../lib/config'

const BackendFactory = require('../../lib/BackendFactory').default

export default class SimVerify extends SimVerifyInterface {

    generateOTP (deviceSIM) {
        
        const postData = JSON.stringify({
            deviceSIM
        })

        try {
            return  BackendFactory().serviceCall(postData,CONFIG.API.SIM_VERIFY_API,'POST')
        } catch (error) {
            throw(error)
        }

    }

    verifySIM (deviceSIM) {
    }
}
