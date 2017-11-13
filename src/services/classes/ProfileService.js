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
import sha256 from 'sha256';
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'
import { Toast } from 'native-base';
class ProfileService {

    getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, userName) {

        if (sha256(currentPassword) != userPassword.value) {
            Toast.show({ text: CHECK_CURRENT_PASSWORD, position: 'bottom', buttonText: 'OK' })
            return 100
        }
        else if (newPassword != confirmNewPassword) {
            Toast.show({ text: MATCH_NEW_AND_CONFIRM_PASSWORD, position: 'bottom', buttonText: 'OK' })
            return 200
        }
        else if (newPassword == currentPassword) {
            Toast.show({ text: CURRENT_AND_NEW_PASSWORD_CHECK, position: 'bottom', buttonText: 'OK' })
            return 300
        }
        else if (!REGEX_TO_VALIDATE_PASSWORD.test(newPassword)) {
            Toast.show({ text: VALIDATE_PASSWORD, position: 'bottom', buttonText: 'OK' })
            return 400
        }
        else {
            //hit API
            const url = CONFIG.API.SERVICE_RESET_PASSWORD + LOGIN + encodeURIComponent(userName)
            const response = RestAPIFactory(token.value).serviceCall(sha256(newPassword), url, POST)
            return response
        }
    }

}

export let profileService = new ProfileService()