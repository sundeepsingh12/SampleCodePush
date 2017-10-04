'use strict'

import * as realm from '../../repositories/realmdb'
import RestAPIFactory from '../../lib/RestAPIFactory'
const {
    TABLE_JOB_DATA
} = require('../../lib/constants').default

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

    approveTransactionUPI(customerName, customerContact, payerVPA, upiConfigJSON, token, deviceIMEI) {
        let approveTransactionURL = upiConfigJSON.approveTransactionURL
        console.log('approveTransactionURL', approveTransactionURL)
        let body = {
            deviceId : deviceIMEI.imeiNumber
        }
        const approveTransactionResponse = RestAPIFactory(token).serviceCall()
    }
}

export let upiPaymentService = new UPIPayment()