'use strict'

require('regenerator/runtime')

export default class SimVerifyInterface {

    /**
     * # Save Phone Number of User
     * @param {*} mobileNumber 
     * @returns 
     * boolean (always true)
     */
    saveMobileNumber(mobileNumber) {

    }

    /**
     * OTP Generation API (Post)
     * @param {*} deviceSIM 
     * ## Expected response
     * JSON body
     * deviceSIM
     */
    generateOTP(deviceSIM) {

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
     * Verify SIM API(Post)
     * @param {*} deviceSIM
     * @returns 
     * ## Expected response
     * JSON body
     * deviceSIM
     */

    verifySIM(deviceSIM) {

    }
}