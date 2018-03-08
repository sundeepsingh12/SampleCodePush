'use strict'

import {
    SEARCH_VALUE,
    LOGIN,
    POST,
    REGEX_TO_VALIDATE_PASSWORD,
} from '../../lib/AttributeConstants'
import sha256 from 'sha256'
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'
import { Toast } from 'native-base'

import {
    CHECK_IF_PASSWORD_ENTERED,
    CHECK_CURRENT_PASSWORD,
    MATCH_NEW_AND_CONFIRM_PASSWORD,
    VALIDATE_PASSWORD,
    CURRENT_AND_NEW_PASSWORD_CHECK,
    UNSAVED_PASSWORD,
    OK
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
            Toast.show({ text: CHECK_CURRENT_PASSWORD, position: 'bottom', buttonText: OK, duration: 5000 })
        }
        else if (newPassword != confirmNewPassword) {
            Toast.show({ text: MATCH_NEW_AND_CONFIRM_PASSWORD, position: 'bottom', buttonText: OK, duration: 5000 })
        }
        else if (newPassword == currentPassword) {
            Toast.show({ text: CURRENT_AND_NEW_PASSWORD_CHECK, position: 'bottom', buttonText: OK, duration: 5000 })
        }
        else if (!REGEX_TO_VALIDATE_PASSWORD.test(newPassword)) {
            Toast.show({ text: VALIDATE_PASSWORD, position: 'bottom', buttonText: OK, duration: 6000 })
        }
        else {
            //hit API
            const url = CONFIG.API.SERVICE_RESET_PASSWORD + LOGIN + encodeURIComponent(userObject.value.username)
            const response = RestAPIFactory(token.value).serviceCall(sha256(newPassword), url, POST) // hits api to reset password. 
            return response
        }
    }
}

export let profileService = new ProfileService()