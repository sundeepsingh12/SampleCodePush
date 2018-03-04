'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import {
    FETCH_USER_DETAILS,
    USER,
    PASSWORD,
    CLEAR_PASSWORD_TEXTINPUT,
    TOGGLE_SAVE_RESET_BUTTON,
    IS_PROFILE_LOADING,
} from '../../lib/constants'
import sha256 from 'sha256'
import CONFIG from '../../lib/config'
import { Toast } from 'native-base'
import {
    PASSWORD_RESET_SUCCESSFULLY,
} from '../../lib/ContainerConstants'
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
            if (!userList || !userList.value) {
                throw new Error('userList not present')
            }
            let userDetails = {
                nameOfUser: userList.value.firstName + ' ' + userList.value.lastName,
                contactOfUser: userList.value.mobileNumber,
                emailOfUser: userList.value.email
            }
            dispatch(setState(FETCH_USER_DETAILS, userDetails))
        } catch (error) {
            console.log(error.message)
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
export function checkAndResetPassword(currentPassword, newPassword, confirmNewPassword, onPressGoBack) {
    return async function (dispatch) {
        try {
            dispatch(setState(IS_PROFILE_LOADING, true))
            const userPassword = await keyValueDBService.getValueFromStore(PASSWORD)
            const userObject = await keyValueDBService.getValueFromStore(USER)
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            const response = await profileService.getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, userObject)

            if (response != null && response.status == 200) {
                await keyValueDBService.validateAndSaveData(PASSWORD, sha256(newPassword))
                let allPasswords = {
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                }
                Toast.show({ text: PASSWORD_RESET_SUCCESSFULLY, position: 'bottom', buttonText: 'OK' })
                dispatch(setState(CLEAR_PASSWORD_TEXTINPUT, allPasswords))
                dispatch(setState(TOGGLE_SAVE_RESET_BUTTON, true))
                onPressGoBack.goBack(null)
            }
            dispatch(setState(IS_PROFILE_LOADING, false))            
        } catch (error) {
            console.log(error.message)
        }
    }
}