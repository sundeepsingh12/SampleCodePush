'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import {
    FETCH_USER_DETAILS,
    USER,
    PASSWORD,
    CLEAR_PASSWORD_TEXTINPUT,
    TRY_AGAIN,
} from '../../lib/constants'
import sha256 from 'sha256'
import CONFIG from '../../lib/config'
import { Toast } from 'native-base';
import {
    UNSAVED_PASSWORD,
    PASSWORD_RESET_SUCCESSFULLY,
} from '../../lib/AttributeConstants'
import { setState } from '../global/globalActions'

import { profileService } from '../../services/classes/ProfileService'


/**This action is used to fetch details of user like contact name and email.
 * 
 * @param {*} 
 *  
 */
export function fetchUserList() {
    return async function (dispatch) {
        try {

            const userList = await keyValueDBService.getValueFromStore(USER)
            let userDetails = {
                nameOfUser: userList.value.firstName + ' ' + userList.value.lastName,
                contactOfUser: userList.value.mobileNumber,
                emailOfUser: userList.value.email
            }
            dispatch(setState(FETCH_USER_DETAILS, userDetails))
        } catch (error) {
            console.log(error)
        }
    }
}

/**This action is used to check and reset profile password.
 * 
 * @param {*} currentPassword, 
 * @param {*} newPassword,
 * @param {*} confirmNewPassword
 *  
 */
export function checkAndResetPassword(currentPassword, newPassword, confirmNewPassword) {
    return async function (dispatch) {
        try {
            const userPassword = await keyValueDBService.getValueFromStore(PASSWORD)
            if (!userPassword) {
                throw new Error(UNSAVED_PASSWORD)
            }
            const userList = await keyValueDBService.getValueFromStore(USER)
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            const response = await profileService.getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, userList.value.username)
            console.log("response", response)

            if (response != null && response.status == 200) {
                await keyValueDBService.validateAndSaveData(PASSWORD, sha256(newPassword))
                let allPasswords = {
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                }
                Toast.show({ text: PASSWORD_RESET_SUCCESSFULLY, position: 'bottom', buttonText: 'OK' })

                dispatch(setState(CLEAR_PASSWORD_TEXTINPUT, allPasswords))
            }
            else if (response != 100) {
                Toast.show({ text: TRY_AGAIN, position: 'bottom', buttonText: 'OK' })
            }


        } catch (error) {
            console.log(error)
        }
    }
}