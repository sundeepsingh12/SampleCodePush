'use strict'

import {
    LOGIN,
    POST,
    REGEX_TO_VALIDATE_PASSWORD,
} from '../../lib/AttributeConstants'
import sha256 from 'sha256'
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'

import {
    CHECK_CURRENT_PASSWORD,
    MATCH_NEW_AND_CONFIRM_PASSWORD,
    VALIDATE_PASSWORD,
    CURRENT_AND_NEW_PASSWORD_CHECK,
    UNSAVED_PASSWORD,
    USERNAME_IS_MISSING
} from '../../lib/ContainerConstants'

class ProfileService {
    /**
     * 
     * @param {*} currentPassword 
     * @param {*} newPassword 
     * @param {*} confirmNewPassword 
     * @param {*} userPassword 
     * @param {*} token // session token of a user
     * @param {*} userObject // user details
     */
    getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, userObject) {
        if (!userObject || !userObject.value || !userObject.value.username) { // validates user details
            throw new Error(USERNAME_IS_MISSING)
        }
        if (!userPassword) { // validates if value of userpassword is not empty.
            throw new Error(UNSAVED_PASSWORD)
        }
        if (sha256(currentPassword) != userPassword.value) {
            throw new Error(CHECK_CURRENT_PASSWORD)
        }
        else if (newPassword != confirmNewPassword) {
            throw new Error(MATCH_NEW_AND_CONFIRM_PASSWORD)
        }
        else if (newPassword == currentPassword) {
            throw new Error(CURRENT_AND_NEW_PASSWORD_CHECK)
        }
        else if (!REGEX_TO_VALIDATE_PASSWORD.test(newPassword)) {
            throw new Error(VALIDATE_PASSWORD)
        }
        else {
            //hit API
            const url = CONFIG.API.SERVICE_RESET_PASSWORD + LOGIN + encodeURIComponent(userObject.value.username) + '&passwordLength=' + newPassword.length
            const response = RestAPIFactory(token.value).serviceCall(sha256(newPassword), url, POST) // hits api to reset password. 
            return response
        }
    }
}

export let profileService = new ProfileService()