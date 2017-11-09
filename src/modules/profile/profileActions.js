'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
// import {
//     FETCH_USER_DETAILS,
//     USER,
// } from '../../lib/constants'

const {
     FETCH_USER_DETAILS,
    USER,
} = require('../../lib/constants').default

import { setState } from '../global/globalActions'

/**This action is used to fetch details of user like contact name and email.
 * 
 * @param {*} 
 *  
 */
export function fetchUserList() {
    return async function (dispatch) {
        try {

            const userList = await keyValueDBService.getValueFromStore(USER)
            console.log("nameOfUser",userList)
            
            userDetails = {
                nameOfUser: userList.value.firstName + '  ' + userList.value.lastName,
                contactOfUser: userList.value.mobileNumber,
                emailOfUser: userList.value.email
            }
            console.log("nameOfUser")
            console.log(userDetails.nameOfUser)

            console.log(userDetails.contactOfUser)
            console.log(userDetails.emailOfUser)

            dispatch(setState(FETCH_USER_DETAILS, userDetails))
        } catch (error) {
            console.log(error)
        }
    }
}