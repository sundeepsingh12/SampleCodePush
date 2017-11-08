'use strict'

import * as realm from '../../repositories/realmdb'
import RestAPIFactory from '../../lib/RestAPIFactory'
import {
    TABLE_JOB_DATA
} from '../../lib/constants'

class UPIPayment {

    /**
     * 
     * @param {*} jobMasterId 
     * @param {*} jobId 
     * @param {*} upiConfigJson 
     */
    getInitialUPIParameters(jobMasterId, jobId, upiConfigJson) {
        //TODO : set value for contact number attribute (to be discussed)
        if (!upiConfigJson) {
            return null
        }
        let jobObject = upiConfigJson.jobMasterConfigurationList.filter(jobMasterConfiguration => jobMasterConfiguration.jobMasterId == jobMasterId)[0]
        if (!jobObject) {
            return null
        }
        let jobDataQuery = `jobId = ${jobId} AND jobAttributeMasterId = ${jobObject.jobAttributeId}`
        const jobData = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery)
        return jobData[0].value
    }

    approveTransactionUPI(amount, customerName, customerContact, deviceIMEI, payerVPA, referenceNumber, upiConfigJSON, token) {
        let referenceList = []
        referenceList.push({
            awbNumber: referenceNumber,
            amount
        })
        let body = {
            deviceId: deviceIMEI.imeiNumber,
            customerName,
            customerContact,
            totalAmount: amount,
            payerAddress: payerVPA,
            referenceList,
        }
        const approveTransactionResponse = RestAPIFactory(token).serviceCall(body, upiConfigJSON.approveTransactionURL, 'POST')
        return approveTransactionResponse
    }

    queryTransactionUPI(token, transactionId, upiConfigJson) {
        let body = {
            txnID: transactionId,
            entity: ''
        }
        const queryTransactionResponse = RestAPIFactory(token).serviceCall(body, upiConfigJSON.transactionQueryURL, 'POST')
        return queryTransactionResponse
    }
}

export let upiPaymentService = new UPIPayment()