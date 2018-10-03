'use strict'
import {
    setState,
    showToastAndAddUserExceptionLog
} from '../../global/globalActions'
import {
    SET_MOSAMBEE_PARAMETERS,
    SET_LOADER_FOR_MOSAMBEE,
    DEVICE_IMEI,
    SET_MESSAGE_FOR_MOSAMBEE
} from '../../../lib/constants'
import { Toast } from 'native-base'
import { MOSAMBEE_ID} from '../../../lib/AttributeConstants'
import { saveJobTransaction } from '../../form-layout/formLayoutActions'
import { MosambeeWalletPaymentServices } from '../../../services/payment/MosambeeWalletPayment'
import { paymentService } from '../../../services/payment/Payment'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { isEmpty } from 'lodash'
import { TRANSACTION_PENDING } from '../../../lib/ContainerConstants'
import { MOSAMBEE_UTILITY_ID } from '../../../lib/AttributeConstants' 

export function getParameterForMosambee(navigationParams, jobTransactionIdAmountMap, contactNumber){
    return async function(dispatch){
        try {
            dispatch(setState(SET_LOADER_FOR_MOSAMBEE, true))
            let { formLayoutState, jobMasterId, jobTransaction } = navigationParams
            let { walletParameters} = await MosambeeWalletPaymentServices.setWalletListAndWalletParameters(jobTransaction, jobTransactionIdAmountMap, MOSAMBEE_UTILITY_ID)
            walletParameters.contactNumber = contactNumber
            if(walletParameters && isEmpty(walletParameters.userId)){
                const deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI);
                walletParameters.userId = deviceIMEI.value.id
            }
            MosambeeWalletPaymentServices.updateDraftInMosambee(walletParameters, contactNumber, null, formLayoutState, jobMasterId, jobTransaction, 12, '1')
            dispatch(setState(SET_MOSAMBEE_PARAMETERS, walletParameters))
        } catch (error) {
            dispatch(setState(SET_MESSAGE_FOR_MOSAMBEE, error.message))
            showToastAndAddUserExceptionLog(3001, error.message, 'danger', 0)
        }
    }
}

export function saveTransactionAfterPayment(jsonData, navigationParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_MOSAMBEE, true))
            let { formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails } = navigationParams
            paymentService.addPaymentObjectToDetailsArray(jsonData.amount, 12, jsonData.transactionId, jsonData.receiptLink ? jsonData.receiptLink : 'N.A' , jsonData, formLayoutState)
            Toast.show({ text: 'payment successful', position: "bottom", buttonText: 'Ok', duration: 5000 }) 
            await MosambeeWalletPaymentServices.setSignatureDataForMosambee(formLayoutState.formElement, jsonData.signature ? jsonData.signature : 'N.A')
            dispatch(saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails))
        } catch (error) {
            showToastAndAddUserExceptionLog(3002, error.message, 'danger', 0)
            dispatch(setState(SET_MESSAGE_FOR_MOSAMBEE, error.message))
        }
    }
}

export function hitCheckTransactionApiForCheckingPaymentInMosambee(mosambeeConfigJson, navigationParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_MOSAMBEE, true))
            let { formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails } = navigationParams
            const responseMessage = await MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi(mosambeeConfigJson,'1')
            if (!isEmpty(responseMessage.transId)) {
                paymentService.addPaymentObjectToDetailsArray(mosambeeConfigJson.actualAmount, 12, responseMessage.transId, responseMessage.receiptLink ? responseMessage.receiptLink : 'N.A' , responseMessage, formLayoutState)
                Toast.show({ text: 'payment successful', position: "bottom", buttonText: 'Ok', duration: 5000 }) 
                dispatch(saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails))
            }else {
                dispatch(setState(SET_MESSAGE_FOR_MOSAMBEE, TRANSACTION_PENDING))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(3003, error.message, 'danger', 0)
            dispatch(setState(SET_MESSAGE_FOR_MOSAMBEE, TRANSACTION_PENDING))
        }
    }
}