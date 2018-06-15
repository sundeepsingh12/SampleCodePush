'use strict'
import * as realm from '../../repositories/realmdb'
import _ from 'lodash'
import {
    TABLE_MESSAGE_INTERACTION
} from '../../lib/constants'
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'
import {
    FIELDEXECUTIVE_INTERACTION
} from '../../lib/ContainerConstants'
import moment from 'moment'

class MessageService {

    getAllMessages() {
        let allMessages = realm.getRecordListOnQuery(TABLE_MESSAGE_INTERACTION)
        let messageList = []
        for (let index in allMessages) {
            let message = { ...allMessages[index] }
            messageList.push(message)
        }
        return messageList
    }


    async sendMessage(messageList, token) {
        let cloneMessageList = _.cloneDeep(messageList)
        let pendingMessagesList = []
        for (let message of cloneMessageList) {
            if (message.messageSendingStatus == 'Sending..') {
                pendingMessagesList.push(message)
            }
        }
        realm.saveList(TABLE_MESSAGE_INTERACTION, pendingMessagesList)
        let messageDataCenters = {
            messageDataCenters: pendingMessagesList
        }
        const response = await RestAPIFactory(token.value).serviceCall(JSON.stringify(messageDataCenters), CONFIG.API.SEND_MESSAGE, 'POST')
        for (let message of pendingMessagesList) {
            message.messageSendingStatus = 'Sent'
        }
        realm.saveList(TABLE_MESSAGE_INTERACTION, pendingMessagesList)

        return cloneMessageList
    }

    getMessagesForParticularTransaction(jobTransactionId) {
        let query = 'transactionId = ' + jobTransactionId
        let allMessages = realm.getRecordListOnQuery(TABLE_MESSAGE_INTERACTION, query, true, 'dateTimeOfSending')
        let messageList = []
        for (let index in allMessages) {
            let message = { ...allMessages[index] }
            messageList.push(message)
        }
        return messageList
    }

    setMessageDto(messageText, messageList, userId) {
        let messageInteraction = {}
        messageInteraction.id = messageList.length
        messageInteraction.type = FIELDEXECUTIVE_INTERACTION
        messageInteraction.messageBody = messageText
        messageInteraction.dateTimeOfSending = moment().format('YYYY-MM-DD HH:mm:ss')
        messageInteraction.messageSendingStatus = 'Sending..'
        messageInteraction.senderUserId = userId
        return messageInteraction
    }
}

export let messageService = new MessageService()