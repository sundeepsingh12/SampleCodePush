'use strict'
import {
    setState,
    showToastAndAddUserExceptionLog
} from '../../global/globalActions'
import {
    SET_MOSAMBEE_PARAMETERS,
    SET_LOADER_FOR_MOSAMBEE,
    DEVICE_IMEI
} from '../../../lib/constants'
import { Toast } from 'native-base'
import { MOSAMBEE_ID} from '../../../lib/AttributeConstants'
import { saveJobTransaction } from '../../form-layout/formLayoutActions'
import { MosambeeWalletPaymentServices } from '../../../services/payment/MosambeeWalletPayment'
import { paymentService } from '../../../services/payment/Payment'
import { navDispatch } from '../../navigators/NavigationService'
import { StackActions } from 'react-navigation'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { isEmpty } from 'lodash'

export function getParameterForMosambee(jobTransaction, jobTransactionIdAmountMap, contactNumber){
    return async function(dispatch){
        try {
            dispatch(setState(SET_LOADER_FOR_MOSAMBEE, true))
            const { walletParameters} = await MosambeeWalletPaymentServices.setWalletListAndWalletParameters(jobTransaction, jobTransactionIdAmountMap, MOSAMBEE_ID)
            walletParameters.contactNumber = contactNumber
            if(walletParameters && isEmpty(walletParameters.userId)){
                const deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI);
                walletParameters.userId = deviceIMEI.value.id
            }
            dispatch(setState(SET_MOSAMBEE_PARAMETERS, walletParameters))
        } catch (error) {
            dispatch(setState(SET_LOADER_FOR_MOSAMBEE, false))
            showToastAndAddUserExceptionLog(3001, error.message, 'danger', 0)
        }
    }
}

export function saveTransactionAfterPayment(jsonData, navigationParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_MOSAMBEE, true))
            let { formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails } = navigationParams
            paymentService.addPaymentObjectToDetailsArray(jsonData.amount, 12, jsonData.transactionId, jsonData.receiptLink, jsonData, formLayoutState)
            Toast.show({ text: 'payment successful', position: "bottom", buttonText: 'Ok', duration: 5000 }) 
            if(jobTransaction.id < 0) {
                navDispatch(StackActions.pop())
            }
            await MosambeeWalletPaymentServices.setSignatureDataForMosambee(formLayoutState.formElement, jsonData.signature)
            dispatch(saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails))
        } catch (error) {
            showToastAndAddUserExceptionLog(3002, error.message, 'danger', 0)
            dispatch(setState(SET_LOADER_FOR_MOSAMBEE, false))
        }
    }
}