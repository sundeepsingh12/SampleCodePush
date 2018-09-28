'use strict'
import {
    setState,
    showToastAndAddUserExceptionLog
} from '../global/globalActions'
import {
    SET_PAYTM_LOADER,
    SET_PAYTM_CONFIG_OBJECT,
    PAGES_ADDITIONAL_UTILITY,
    USER,
    HUB,
    SET_CHECK_TRANSACTION_VIEW
} from '../../lib/constants'
import { Toast } from 'native-base'
import { PAGE_PAYTM } from '../../lib/AttributeConstants'
import { PaytmPaymentService } from '../../services/payment/PaytmPaymentService'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import { saveJobTransaction } from '../form-layout/formLayoutActions';
import { paymentService } from '../../services/payment/Payment';

export function getPaytmParameters(contactNumber, jobTransaction, jobTransactionIdAmountMap, jobAndFieldAttributesList) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_PAYTM_LOADER, true))
            const utilities = await keyValueDBService.getValueFromStore(PAGES_ADDITIONAL_UTILITY)
            let { paytmConfigObject, actualAmount } = PaytmPaymentService.getPaytmParameters(PAGE_PAYTM, utilities, jobTransaction, jobTransactionIdAmountMap)
            if (paytmConfigObject.isQrCodeTypePaytmPayment) {
                dispatch(initiatePaytmPayment(paytmConfigObject, actualAmount, null, null, jobAndFieldAttributesList))
            } else {
                dispatch(setState(SET_PAYTM_CONFIG_OBJECT, { paytmConfigObject, contactNumber, actualAmount }))
            }
        } catch (error) {
            dispatch(setState(SET_PAYTM_CONFIG_OBJECT, { paytmConfigObject: null, contactNumber, actualAmount: 0 }))
            showToastAndAddUserExceptionLog(3001, error.message, 'danger', 1)
        }
    }
}

export function saveTransactionAfterPayment(paytmConfigObject, actualAmount, navigationParams, responseMessage) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_PAYTM_LOADER, true))
            let { formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails } = navigationParams
            paymentService.addPaymentObjectToDetailsArray(actualAmount, 19, paytmConfigObject.paymentOrderId + '<&&>1', 'N.A', responseMessage, formLayoutState)
            Toast.show({ text: 'payment successful', position: "bottom", buttonText: 'Ok', duration: 5000 })
            dispatch(saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails))
        } catch (error) {
            showToastAndAddUserExceptionLog(3002, error.message, 'danger', 1)
            dispatch(setState(SET_PAYTM_LOADER, false))
        }
    }
}

export function initiatePaytmPayment(paytmConfigObject, actualAmount, contactNumber, otp, jobAndFieldAttributesList) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_PAYTM_LOADER, true))
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            let paytmRequestDto = PaytmPaymentService.getPaytmRequestDto(paytmConfigObject, actualAmount, jobAndFieldAttributesList.hub)
            let response = await RestAPIFactory(token.value).serviceCall(JSON.stringify(paytmRequestDto), paytmConfigObject.withdrawUrl, 'PAYTM', { otp, contactNumber, companyId: jobAndFieldAttributesList.user.company.id, hubCode: jobAndFieldAttributesList.hub.code })
            let responseMessage = response.json
            if (responseMessage.status == 'SUCCESS') {
                if (paytmConfigObject.isQrCodeTypePaytmPayment) {
                    let path = responseMessage.response.path
                    paytmConfigObject.qrCodeData = path
                    dispatch(setState(SET_PAYTM_CONFIG_OBJECT, { paytmConfigObject, contactNumber, actualAmount }))
                } else {
                    // save job transaction
                }
            }
            else {
                throw new Error('Failure')
            }
        } catch (error) {
            dispatch(setState(SET_PAYTM_LOADER, false))
            if (paytmConfigObject.isQrCodeTypePaytmPayment) {
                dispatch(setState(SET_PAYTM_CONFIG_OBJECT, { paytmConfigObject, contactNumber, actualAmount }))
            } else {
                showToastAndAddUserExceptionLog(3003, error.message, 'danger', 1)
            }
        }
    }
}


export function checkPaytmTransaction(paytmConfigObject, navigationParams, actualAmount, jobAndFieldAttributesList) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_PAYTM_LOADER, true))
            let checkTransactionDto = PaytmPaymentService.getCheckTransactionDto(paytmConfigObject)
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            let response = await RestAPIFactory(token.value).serviceCall(JSON.stringify(checkTransactionDto), paytmConfigObject.checkTransactionStatusUrl, 'PAYTM', { companyId: jobAndFieldAttributesList.user.company.id, hubCode: jobAndFieldAttributesList.hub.code })
            if (response == 'ERROR!') {
                throw new Error('Failure')
            }
            let responseMessage = response.json
            if (responseMessage.status == 'SUCCESS') {
                dispatch(saveTransactionAfterPayment(paytmConfigObject, actualAmount, navigationParams, responseMessage))
            }
            else {
                throw new Error('Failure')
            }
        } catch (error) {
            dispatch(setState(SET_CHECK_TRANSACTION_VIEW, true))
        }
    }
}