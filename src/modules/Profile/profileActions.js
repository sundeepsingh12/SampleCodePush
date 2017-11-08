'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { fieldDataService } from '../../services/classes/FieldData'
const {
USER
} = require('../../lib/constants').default
import {

} from '../../lib/AttributeConstants'

import { setState } from '../global/globalActions'

export function fetchUserList() {
    return async function (dispatch) {
        try {
            const userList = await keyValueDBService.getValueFromStore(USER)
            console.log("USERuserList",userList)
        } catch (error) {
            console.log(error)
        }
    }
}