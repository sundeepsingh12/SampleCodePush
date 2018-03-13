'use strict'
import {
    SHIPMENT_NOT_FOUND,
    SHIPMENT_ALREADY_SCANNED,
    NOT_FOUND,
    FORCE_ASSIGNED,
    TOKEN_MISSING,
} from '../../lib/ContainerConstants'
import {
    PENDING,
    TABLE_JOB_TRANSACTION,
    USER,
    HUB,
    POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS,
} from '../../lib/constants'
import * as realm from '../../repositories/realmdb'
import { keyValueDBService } from './KeyValueDBService'
import { formLayoutEventsInterface } from '../classes/formLayout/FormLayoutEventInterface'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import _ from 'lodash'
import moment from 'moment'

class PostAssignment {

    /**
     * This function checks for reference number and takes action accordingly
     * @param {*} referenceNumber 
     * @param {*} jobTransactionMap 
     * @param {*} pendingStatus 
     * @param {*} jobMaster 
     * @param {*} isForceAssignmentAllowed 
     * @param {*} pendingCount 
     * @returns
     * {
     *      jobTransactionMap : {
     *                              jobTransaction
     *                              isScanned
     *                              status
     *                          }
     *      pendingCount : Integer,
     *      scanError : String
     * }
     */
    async checkScanResult(referenceNumber, jobTransactionMap, pendingStatus, jobMaster, isForceAssignmentAllowed, pendingCount) {
        if (jobTransactionMap[referenceNumber] && jobTransactionMap[referenceNumber].isScanned) {
            throw new Error(SHIPMENT_ALREADY_SCANNED)
        }

        if (jobTransactionMap[referenceNumber]) {
            await this.updateTransactionStatus(jobTransactionMap[referenceNumber], pendingStatus, jobMaster)
            jobTransactionMap[referenceNumber].isScanned = true
            return {
                jobTransactionMap,
                pendingCount: pendingCount - 1
            }
        }

        if (!isForceAssignmentAllowed) {
            throw new Error(SHIPMENT_NOT_FOUND)
        }

        let scanError = await this.checkPostJobOnServer(referenceNumber, jobMaster, jobTransactionMap)
        return {
            jobTransactionMap,
            pendingCount,
            scanError,
        }
    }

    /**
     * This function updates status from unseen to pending of existing job transaction,runsheet and job summary
     * @param {*} transaction 
     * @param {*} pendingStatus 
     * @param {*} jobMaster 
     */
    async updateTransactionStatus(transaction, pendingStatus, jobMaster) {
        let transactionDTOList = [], transactionList = []
        let jobTransaction = { ...transaction }
        let transactionDTO = {
            id: jobTransaction.id,
            referenceNumber: jobTransaction.referenceNumber
        }
        const runSheet = await formLayoutEventsInterface._updateRunsheetSummary(jobTransaction, pendingStatus.statusCategory)
        await formLayoutEventsInterface._updateJobSummary(jobTransaction, pendingStatus.id)
        let user = await keyValueDBService.getValueFromStore(USER)
        let hub = await keyValueDBService.getValueFromStore(HUB)
        jobTransaction.jobStatusId = pendingStatus.id
        jobTransaction.jobType = jobMaster.code
        jobTransaction.statusCode = PENDING
        jobTransaction.employeeCode = user.value.employeeCode
        jobTransaction.hubCode = hub.value.code
        jobTransaction.androidPushTime = moment().format('YYYY-MM-DD HH:mm:ss')
        transactionList.push(jobTransaction)
        transactionDTOList.push(transactionDTO)
        let jobTransactionTableDTO = {
            tableName: TABLE_JOB_TRANSACTION,
            value: transactionList
        }
        realm.performBatchSave(jobTransactionTableDTO, runSheet)
        await formLayoutEventsInterface.addTransactionsToSyncList(transactionDTOList)
    }

    /**
     * This function checks for reference number on server
     * @param {*} referenceNumber 
     * @param {*} jobMaster 
     * @param {*} jobTransactionMap 
     * @returns
     * scanError : string
     */
    async checkPostJobOnServer(referenceNumber, jobMaster, jobTransactionMap) {
        let referenceNumberList = [referenceNumber]
        let scanError = null
        let postData = JSON.stringify([{
            jobMasterId: jobMaster.id,
            referenceNumberList: [referenceNumber]
        }])
        const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        if (!token || !token.value) {
            throw new Error(TOKEN_MISSING)
        }
        let postJobResponse = await RestAPIFactory(token.value).serviceCall(postData, CONFIG.API.POST_ASSIGNMENT_FORCE_ASSIGN_API, 'POST')
        let notFoundList = postJobResponse.json[0].notFoundList
        let successList = postJobResponse.json[0].successList
        if (successList && successList.length > 0) {
            await this.savePostJobOrder(successList)
        }
        for (let index in notFoundList) {
            jobTransactionMap[notFoundList[index]] = {}
            jobTransactionMap[notFoundList[index]].referenceNumber = notFoundList[index]
            jobTransactionMap[notFoundList[index]].isScanned = true
            jobTransactionMap[notFoundList[index]].status = scanError = postJobResponse.json[0].message && postJobResponse.json[0].message.trim() !== '' ? postJobResponse.json[0].message : NOT_FOUND
        }

        for (let index in successList) {
            jobTransactionMap[successList[index]] = {}
            jobTransactionMap[successList[index]].referenceNumber = successList[index]
            jobTransactionMap[successList[index]].isScanned = true
            jobTransactionMap[successList[index]].status = FORCE_ASSIGNED
        }

        return scanError
    }

    /**
     * This function save force assigned jobs in store
     * @param {*} successList 
     */
    async savePostJobOrder(successList) {
        let postOrders = await keyValueDBService.getValueFromStore(POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS)
        let postOrderList = postOrders ? postOrders.value ? postOrders.value : [] : []
        postOrderList = postOrderList.concat(successList)
        await keyValueDBService.validateAndSaveData(POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS, postOrderList)
    }
}

export let postAssignmentService = new PostAssignment()