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
import { StackActions } from 'react-navigation'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { isEmpty } from 'lodash'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import { saveJobTransaction } from '../form-layout/formLayoutActions';
import { paymentService } from '../../services/payment/Payment';
import { navDispatch } from '../navigators/NavigationService'

export function getPaytmParameters(contactNumber, jobTransaction, jobTransactionIdAmountMap) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_PAYTM_LOADER, true))
            const utilities = await keyValueDBService.getValueFromStore(PAGES_ADDITIONAL_UTILITY)
            let { paytmConfigObject, actualAmount } = PaytmPaymentService.getPaytmParameters(PAGE_PAYTM, utilities, jobTransaction, jobTransactionIdAmountMap)
            if (paytmConfigObject.isQrCodeTypePaytmPayment) {
                dispatch(initiatePaytmPayment(paytmConfigObject, actualAmount))
            } else {
                dispatch(setState(SET_PAYTM_CONFIG_OBJECT, { paytmConfigObject, contactNumber, actualAmount }))
            }
        } catch (error) {
            dispatch(setState(SET_PAYTM_LOADER, false))
            showToastAndAddUserExceptionLog(3001, error.message, 'danger', 0)
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
            // if (jobTransaction.id < 0) {
            //     navDispatch(StackActions.pop())
            // }
            dispatch(saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails))
        } catch (error) {
            showToastAndAddUserExceptionLog(3002, error.message, 'danger', 1)
            dispatch(setState(SET_PAYTM_LOADER, false))
        }
    }
}

export function initiatePaytmPayment(paytmConfigObject, actualAmount, contactNumber, otp) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_PAYTM_LOADER, true))
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            const user = await keyValueDBService.getValueFromStore(USER)
            const hub = await keyValueDBService.getValueFromStore(HUB)
            let paytmRequestDto = PaytmPaymentService.getPaytmRequestDto(paytmConfigObject, actualAmount, hub.value)
            let response = await RestAPIFactory(token.value).serviceCall(JSON.stringify(paytmRequestDto), paytmConfigObject.withdrawUrl, 'PAYTM', { otp, contactNumber, companyId: user.value.company.id, hubCode: hub.value.code })
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


export function checkPaytmTransaction(paytmConfigObject, navigationParams, actualAmount) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_PAYTM_LOADER, true))
            let checkTransactionDto = PaytmPaymentService.getCheckTransactionDto(paytmConfigObject)
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            const user = await keyValueDBService.getValueFromStore(USER)
            const hub = await keyValueDBService.getValueFromStore(HUB)
            let response = await RestAPIFactory(token.value).serviceCall(JSON.stringify(checkTransactionDto), paytmConfigObject.checkTransactionStatusUrl, 'PAYTM', { companyId: user.value.company.id, hubCode: hub.value.code })
            console.log(response)
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
            console.log(error.message)
        }
    }
}