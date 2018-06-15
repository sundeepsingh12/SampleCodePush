'use strict'
import {
    SET_MESSAGE_LIST,
    SET_MESSAGE_LOADER,
    USER
} from '../../lib/constants'
import { setState } from '../global/globalActions'
import _ from 'lodash'
import { messageService } from '../../services/classes/MessageService'
import {
    FIELDEXECUTIVE_INTERACTION
} from '../../lib/ContainerConstants'
import moment from 'moment'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import CONFIG from '../../lib/config'
import { fetchJobs } from '../taskList/taskListActions'
import RestAPIFactory from '../../lib/RestAPIFactory'
export function getAllMessages() {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_MESSAGE_LOADER, true))
            dispatch(fetchJobs())
            let messageList = messageService.getAllMessages()
            dispatch(setState(SET_MESSAGE_LIST, messageList))
            // let user = await keyValueDBService.getValueFromStore(USER)
            // const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            // let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
            // console.log(currentTime)
            // let x = {
            //     id: null,
            //     lastUpdatedTime: currentTime,
            //     userId: user.value.id
            // }
            //let postJson = "{\"id\":" + null + ", \"lastUpdatedTime\":" + currentTime + ", \"userId\":" + user.value.id + "}";
            //let postJson = JSON.stringify(x)
            //console.log(postJson)
            //const response = await RestAPIFactory(token.value).serviceCall(postJson, CONFIG.API.UPDATE_LAST_SEEN, 'POST')
        } catch (error) {
            //TODO
            dispatch(setState(SET_MESSAGE_LOADER, false))
            console.log(error)
        }
    }
}

export function sendMessage(messageText, messageList) {
    return async function (dispatch) {
        try {
            if (_.isEmpty(_.trim(messageText))) {
                return
            }
            let user = await keyValueDBService.getValueFromStore(USER)
            let messageInteraction = messageService.setMessageDto(messageText, messageList, user.value.id)
            let cloneMessageList = _.cloneDeep(messageList)
            cloneMessageList.push(messageInteraction)
            dispatch(setState(SET_MESSAGE_LIST, cloneMessageList))
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            let finalMessageList = await messageService.sendMessage(cloneMessageList, token)
            dispatch(setState(SET_MESSAGE_LIST, finalMessageList))

        } catch (error) {
            //TODO
            console.log(error)
        }
    }
}
