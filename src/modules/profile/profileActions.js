'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import {
    FETCH_USER_DETAILS,
    USER,
    PASSWORD,
    CLEAR_PASSWORD_TEXTINPUT,
    IS_PROFILE_LOADING,
} from '../../lib/constants'
import sha256 from 'sha256'
import CONFIG from '../../lib/config'
import { Toast } from 'native-base'
import {
    PASSWORD_RESET_SUCCESSFULLY,
    OK,
} from '../../lib/ContainerConstants'
import { setState } from '../global/globalActions'
import { profileService } from '../../services/classes/ProfileService'
import { NavigationActions } from 'react-navigation'

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

/**
 * 
 * @param {*} currentPassword // sets confirm currentPassword
 * @param {*} newPassword // sets new password
 * @param {*} confirmNewPassword // sets confirm new password
 */
export function checkAndResetPassword(currentPassword, newPassword, confirmNewPassword) {
    return async function (dispatch) {
        try {
            dispatch(setState(IS_PROFILE_LOADING, true))
            const userPassword = await keyValueDBService.getValueFromStore(PASSWORD) // gets the user password
            const userObject = await keyValueDBService.getValueFromStore(USER) // gets the user details
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY) // gets the user session token key
            const response = await profileService.getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, userObject) // this function validates all parameters and then hit api to change password and returns the response.

            await keyValueDBService.validateAndSaveData(PASSWORD, sha256(newPassword)) // new password gets saved after the response status is checked
            let allPasswords = { currentPassword: '', newPassword: '', confirmNewPassword: '' } // resets data in all password fields
            Toast.show({ text: PASSWORD_RESET_SUCCESSFULLY, position: 'bottom', buttonText: OK, duration: 6000 })
            dispatch(setState(CLEAR_PASSWORD_TEXTINPUT))
            dispatch(NavigationActions.back())  // automatically goes on the previous screen.
        } catch (error) {
            Toast.show({ text: error.message, position: 'bottom', buttonText: OK, duration: 6000 })
            console.log(error.message) // to do update later
        } finally {
            dispatch(setState(IS_PROFILE_LOADING, false))
        }
    }
}