'use strict'

import {
    SEARCH_VALUE,
    LOGIN,
    POST,
    REGEX_TO_VALIDATE_PASSWORD,
    CHECK_IF_PASSWORD_ENTERED,
    CHECK_CURRENT_PASSWORD,
    MATCH_NEW_AND_CONFIRM_PASSWORD,
    CURRENT_AND_NEW_PASSWORD_CHECK,
    VALIDATE_PASSWORD,
} from '../../lib/AttributeConstants'
import sha256 from 'sha256'
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'
import { Toast } from 'native-base'
class ProfileService {

    getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, userObject) {
        if (!userObject || !userObject.value || !userObject.value.username) {
            throw new Error('username is missing')
        }
        if (!userPassword) {
            throw new Error(UNSAVED_PASSWORD)
        }
        if (sha256(currentPassword) != userPassword.value) {
            Toast.show({ text: CHECK_CURRENT_PASSWORD, position: 'bottom', buttonText: 'OK', duration: 5000 })
        }
        else if (newPassword != confirmNewPassword) {
            Toast.show({ text: MATCH_NEW_AND_CONFIRM_PASSWORD, position: 'bottom', buttonText: 'OK', duration: 5000 })
        }
        else if (newPassword == currentPassword) {
            Toast.show({ text: CURRENT_AND_NEW_PASSWORD_CHECK, position: 'bottom', buttonText: 'OK', duration: 5000 })
        }
        else if (!REGEX_TO_VALIDATE_PASSWORD.test(newPassword)) {
            Toast.show({ text: VALIDATE_PASSWORD, position: 'bottom', buttonText: 'OK', duration: 6000 })
        }
        else {
            //hit API
            const url = CONFIG.API.SERVICE_RESET_PASSWORD + LOGIN + encodeURIComponent(userObject.value.username)
            const response = RestAPIFactory(token.value).serviceCall(sha256(newPassword), url, POST)
            return response
        }
    }
}

export let profileService = new ProfileService()