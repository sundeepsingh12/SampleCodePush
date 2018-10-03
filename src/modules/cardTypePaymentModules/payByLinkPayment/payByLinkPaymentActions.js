'use strict'

import { setState, showToastAndAddUserExceptionLog } from '../../global/globalActions'
import { payByLinkPaymentService } from '../../../services/payment/PayByLinkPayment'
import {
    SET_PAY_BY_LINK_PARAMETERS,
    SET_LOADER_FOR_PAYBYLINK,
    SET_PAY_BY_LINK_MESSAGE
} from '../../../lib/constants'
import { MosambeeWalletPaymentServices } from '../../../services/payment/MosambeeWalletPayment'
import {
    NET_BANKING_UTILITY_ID
} from '../../../lib/AttributeConstants'
import { TRANSACTION_SUCCESSFUL, TRANSACTION_PENDING } from '../../../lib/ContainerConstants'
import { saveJobTransaction } from '../../form-layout/formLayoutActions';
import { paymentService } from '../../../services/payment/Payment';
import _ from 'lodash'
import { StackActions} from 'react-navigation'
import { navDispatch } from '../../navigators/NavigationService'

export function getPayByLinkPaymentParameters(customerContact, jobTransaction, jobTransactionIdAmountMap) {
    return async function (dispatch) {
        try { 
            dispatch(setState(SET_LOADER_FOR_PAYBYLINK, true))
            const { walletParameters} = await MosambeeWalletPaymentServices.setWalletListAndWalletParameters(jobTransaction, jobTransactionIdAmountMap, NET_BANKING_UTILITY_ID)
            let apiPassword = walletParameters.apiPassword 
            walletParameters.apiPassword = walletParameters.secretKey
            walletParameters.secretKey = apiPassword
            dispatch(setState(SET_PAY_BY_LINK_PARAMETERS, { payByLinkConfigJSON: walletParameters, customerContact }))
        } catch (error) {
            showToastAndAddUserExceptionLog(3101, error.message, 'danger', 0)
            dispatch(setState(SET_PAY_BY_LINK_MESSAGE, error.message))
        }
    }
}

export function hitPayByLinkApiForPayment(customerContact, payByLinkConfigJSON, payByLinkId, navigationParams) {
    return async function (dispatch) {
        try { 
            dispatch(setState(SET_LOADER_FOR_PAYBYLINK, true))
            const data = await payByLinkPaymentService.prepareJsonAndHitPayByLinkUrl(payByLinkConfigJSON, customerContact, payByLinkId)
            let { formLayoutState, jobMasterId, jobTransaction } = navigationParams
            MosambeeWalletPaymentServices.updateDraftInMosambee(payByLinkConfigJSON, customerContact, null, formLayoutState, jobMasterId, jobTransaction, 16, '1')
            dispatch(setState(SET_PAY_BY_LINK_MESSAGE, data.message))
        } catch (error) {
            showToastAndAddUserExceptionLog(3102, error.message, 'danger', 0)
            dispatch(setState(SET_PAY_BY_LINK_MESSAGE, error.message))
        }
    }
}

export function hitCheckTransactionApiForCheckingPayment(payByLinkConfigJSON, navigationParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_PAYBYLINK, true))
            let { formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails } = navigationParams
            const responseMessage = await MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi(payByLinkConfigJSON,'1')
            if (!_.isEmpty(responseMessage.transId)) {
                paymentService.addPaymentObjectToDetailsArray(payByLinkConfigJSON.actualAmount, 16, responseMessage.transId, 'N.A', responseMessage, formLayoutState)
                setTimeout(() => { dispatch(setState(SET_PAY_BY_LINK_MESSAGE, TRANSACTION_SUCCESSFUL)) }, 1000);
                dispatch(saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails))
            }else{
                dispatch(setState(SET_PAY_BY_LINK_MESSAGE, TRANSACTION_PENDING))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(3103, error.message, 'danger', 0)
            dispatch(setState(SET_PAY_BY_LINK_MESSAGE, TRANSACTION_PENDING))
        }
    }
}