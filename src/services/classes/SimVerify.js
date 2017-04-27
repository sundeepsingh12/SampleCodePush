'use strict'

import CONFIG from '../../lib/config'

const BackendFactory = require('../../lib/BackendFactory').default

export default class SimVerify extends SimVerifyInterface {

    /**
     * OTP Generation API (Post)
     * @param {*} deviceSIM
     * ## Expected response
     * JSON body
     * deviceSIM
     */
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


    /**
     * Verify SIM API(Post)
     * @param {*} deviceSIM
     * @returns
     * ## Expected response
     * JSON body
     * deviceSIM
     */
    verifySIM (deviceSIM) {
    }

    /**
     * # Read SMS
     * @param {*} otpGenerationTime
     * @returns
     * verification code
     */

    readSMS(otpGenerationTime) {

    }

    /**
     * # Save Phone Number of User
     * @param {*} mobileNumber
     * @returns
     * boolean (always true)
     */
    saveMobileNumber(mobileNumber) {

    }
}
