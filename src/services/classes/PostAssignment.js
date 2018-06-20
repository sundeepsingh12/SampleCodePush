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
    USER_SUMMARY,
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
        let jobTransactionDTOMap = {}, transactionList = []
        let jobTransaction = { ...transaction }
        let transactionDTO = {
            id: jobTransaction.id,
            referenceNumber: jobTransaction.referenceNumber,
            jobId: jobTransaction.jobId
        }
        const runSheet = await formLayoutEventsInterface._updateRunsheetSummary(jobTransaction.jobStatusId, pendingStatus.statusCategory, [jobTransaction])
        await formLayoutEventsInterface._updateJobSummary(jobTransaction, pendingStatus.id)
        let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
        await formLayoutEventsInterface._updateUserSummary(jobTransaction.jobStatusId, pendingStatus.statusCategory, [jobTransaction], userSummary.value, pendingStatus.id)
        let user = await keyValueDBService.getValueFromStore(USER)
        let hub = await keyValueDBService.getValueFromStore(HUB)
        jobTransaction.jobStatusId = pendingStatus.id
        jobTransaction.jobType = jobMaster.code
        jobTransaction.statusCode = PENDING
        jobTransaction.employeeCode = user.value.employeeCode
        jobTransaction.hubCode = hub.value.code
        jobTransaction.androidPushTime = moment().format('YYYY-MM-DD HH:mm:ss')
        transactionList.push(jobTransaction)
        jobTransactionDTOMap[jobTransaction.id] = transactionDTO
        let jobTransactionTableDTO = {
            tableName: TABLE_JOB_TRANSACTION,
            value: transactionList,
            syncTime: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        realm.performBatchSave(jobTransactionTableDTO, runSheet)
        await formLayoutEventsInterface.addTransactionsToSyncList(jobTransactionDTOMap)
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
        let scanError = null, successListDTO = {}
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
        scanError = this.setJobTransactionDTO(notFoundList, jobTransactionMap, postJobResponse, false);
        successListDTO = this.setJobTransactionDTO(successList, jobTransactionMap, postJobResponse, true);
        if (successList && successList.length > 0) {
            await this.savePostJobOrder(successListDTO)
        }
        return scanError
    }

    /**
     * This function set job transaction dto to be stored in stored for force assignment jobs that has to be synced in delete sync api
     * @param {*} referenceNumberList 
     * @param {*} jobTransactionMap 
     * @param {*} postJobResponse 
     * @param {*} isSuccess 
     * @returns 
     * SuccessListDTO (when given success list) : {
     *                                                  referenceNumber
     *                                                  syncTime
     *                                            }
     * scanError (when given not found list) 
     */
    setJobTransactionDTO(referenceNumberList, jobTransactionMap, postJobResponse, isSuccess) {
        let scanError, successListDTO = {};
        for (let index in referenceNumberList) {
            jobTransactionMap[referenceNumberList[index]] = {}
            jobTransactionMap[referenceNumberList[index]].referenceNumber = referenceNumberList[index]
            jobTransactionMap[referenceNumberList[index]].isScanned = true
            scanError = jobTransactionMap[referenceNumberList[index]].status = isSuccess ? FORCE_ASSIGNED : postJobResponse.json[0].message && postJobResponse.json[0].message.trim() !== '' ? postJobResponse.json[0].message : NOT_FOUND
            successListDTO[referenceNumberList[index]] = {
                referenceNumber: referenceNumberList[index],
                syncTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }
        return (isSuccess ? successListDTO : scanError);
    }

    /**
     * This function save force assigned jobs in store
     * @param {*} successListDTO 
     */
    async savePostJobOrder(successListDTO) {
        let postOrders = await keyValueDBService.getValueFromStore(POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS);
        let postOrderList = postOrders ? postOrders.value ? postOrders.value : {} : {};
        postOrderList = { ...postOrderList, ...successListDTO };
        await keyValueDBService.validateAndSaveData(POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS, postOrderList);
    }
}

export let postAssignmentService = new PostAssignment()