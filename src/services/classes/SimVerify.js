'use strict'

import SimVerifyInterface from '../interfaces/SimVerifyInterface'

const BackendFactory = require('../../lib/BackendFactory').default

export default class SimVerify extends SimVerifyInterface {

    generateOTP (deviceSIM) {
        
        const postData = JSON.stringify({
            deviceSIM
        })

        const apiUrl = '/rest/device/generate_otp';

        try {
            return await BackendFactory().serviceCall(postData,apiUrl)
        } catch (error) {
            throw(error)
        }

    }

    verifySIM (deviceSIM) {

    }
}
