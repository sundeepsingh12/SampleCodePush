'use strict'

import RestAPIFactory from '../../lib/RestAPIFactory'
import { keyValueDBService } from '../classes/KeyValueDBService'
import {

} from '../../lib/constants'
import CONFIG from '../../lib/config'
import { draftService } from '../classes/DraftService'
import { moduleCustomizationService } from '../classes/ModuleCustomization'
import moment from 'moment'

class PaytmPayment {

    getPaytmParameters(paytmUtilityId, utilitiesList, jobTransactionList, jobTransactionIdAmountMap) {
        let paytmConfigObject = {}, actualAmount = 0, paymentOrderId = '', referenceNoActualAmountMap = ''
        let paytmUtility = (paytmUtilityId && utilitiesList && utilitiesList.value) ? utilitiesList.value.filter(utility => utility.utilityID == paytmUtilityId)[0] : null
        if (!paytmUtility || !paytmUtility.additionalParams) {
            throw new Error('Invalid parameters.Please contact Admin or Manager.')
        }
        let paytmAdditionalParams = JSON.parse(paytmUtility.additionalParams)
        if (!paytmAdditionalParams || !paytmAdditionalParams.withdrawUrl || !paytmAdditionalParams.checkTransactionStatusUrl) {
            throw new Error('Invalid parameters.Please contact Admin or Manager.')
        }
        if (paytmAdditionalParams.withdrawUrl && paytmAdditionalParams.withdrawUrl.includes('/create_qr_code')) {
            paytmConfigObject.isQrCodeTypePaytmPayment = true;
        }
        paytmConfigObject.withdrawUrl = paytmAdditionalParams.withdrawUrl
        paytmConfigObject.merchantGuid = paytmAdditionalParams.merchantGuid
        paytmConfigObject.checkTransactionStatusUrl = paytmAdditionalParams.checkTransactionStatusUrl

        if (jobTransactionList.length) {
            for (let transaction in jobTransactionList) {
                let transactionActualAmount = (jobTransactionIdAmountMap[jobTransactionList[transaction].jobTransactionId]) ? jobTransactionIdAmountMap[jobTransactionList[transaction].jobTransactionId].actualAmount : 0
                actualAmount = actualAmount + transactionActualAmount
                paymentOrderId = (paymentOrderId == '') ? jobTransactionList[transaction].referenceNumber : paymentOrderId + ',' + jobTransactionList[transaction].referenceNumber
                referenceNoActualAmountMap = referenceNoActualAmountMap + '' + jobTransactionList[transaction].referenceNumber + ':' + String(transactionActualAmount)
            }
        } else {
            actualAmount = jobTransactionIdAmountMap.actualAmount
            paymentOrderId = jobTransactionList.referenceNumber
            referenceNoActualAmountMap = jobTransactionList.referenceNumber + ':' + actualAmount
        }
        paytmConfigObject.paymentOrderId = paymentOrderId
        paytmConfigObject.referenceNoActualAmountMap = referenceNoActualAmountMap
        return { paytmConfigObject, actualAmount }
    }
    getPaytmRequestDto(paytmConfigObject, actualAmount, hub) {
        let paytmRequestDto = {}
        if (paytmConfigObject.isQrCodeTypePaytmPayment) {
            let request = {}
            paytmRequestDto.ipAddress = ''
            paytmRequestDto.operationType = 'QR_CODE'
            paytmRequestDto.platformName = 'PayTM'
            request.amount = actualAmount
            request.industryType = 'RETAIL'
            request.orderDetails = paytmConfigObject.referenceNoActualAmountMap
            request.orderId = paytmConfigObject.paymentOrderId + '<&&>1'
            request.posId = hub.code
            request.requestType = 'QR_ORDER'
            request.merchantGuid = ''
            request.mid = ''
            paytmRequestDto['request'] = request
        } else {
            let request = {}
            request.totalAmount = actualAmount
            request.currencyCode = 'INR'
            request.merchantGuid = ''
            request.merchantOrderId = paytmConfigObject.paymentOrderId + '<&&>1'
            request.industryType = 'Retail'
            paytmRequestDto['request'] = request
            paytmRequestDto.platformName = 'PayTM'
            paytmRequestDto.ipAddress = ''
            paytmRequestDto.operationType = 'WITHDRAW_MONEY'
            paytmRequestDto.channel = 'POS'
            paytmRequestDto.version = '1.0'
        }
        return paytmRequestDto
    }
    getCheckTransactionDto(paytmConfigObject) {
        let paytmRequestDto = {}
        let request = {}
        paytmRequestDto.operationType = 'CHECK_TXN_STATUS'
        paytmRequestDto.platformName = 'PayTM'
        request.merchantGuid = ''
        request.requestType = 'merchanttxnid'
        request.txnId = paytmConfigObject.paymentOrderId + '<&&>1'
        request.txnType = 'withdraw'
        paytmRequestDto['request'] = request
        return paytmRequestDto
    }
}

export let PaytmPaymentService = new PaytmPayment()