'use strict'

import { setState, showToastAndAddUserExceptionLog } from '../../global/globalActions'
import { MosambeeWalletPaymentServices } from '../../../services/payment/MosambeeWalletPayment'
import {
    SET_MOSAMBEE_WALLET_PARAMETERS,
    SET_ERROR_MESSAGE_FOR_WALLET,
    SET_MODAL_VIEW,
    SET_LOADER_FOR_WALLET,
} from '../../../lib/constants'
import { TRANSACTION_SUCCESSFUL } from '../../../lib/ContainerConstants'
import { saveJobTransaction } from '../../form-layout/formLayoutActions';
import { paymentService } from '../../../services/payment/Payment';
import { StackActions} from 'react-navigation'
import { navDispatch } from '../../navigators/NavigationService'


export function setWalletParametersAndGetWalletList(contactNumber, jobTransaction, jobTransactionIdAmountMap) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_WALLET, 1))
            const { walletParameters, walletList} = await MosambeeWalletPaymentServices.setWalletListAndWalletParameters(jobTransaction, jobTransactionIdAmountMap)
            dispatch(setState(SET_MOSAMBEE_WALLET_PARAMETERS, { walletParameters, walletList, contactNumber, isModalVisible: 1 }))
        } catch (error) {
            showToastAndAddUserExceptionLog(2901, error.message, 'danger', 0)
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                errorMessage: error.message,
                isModalVisible: 1
            }))
        }
    }
}

export function hitOtpUrlToGetOtp(contactNumber, walletParameters, selectedWalletDetails, navigationParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_WALLET, 3))
            let { formLayoutState, jobMasterId, jobTransaction, contactData } = navigationParams
            const responseMessage = await MosambeeWalletPaymentServices.prepareJsonAndGenerateOtp(jobTransaction, walletParameters, contactNumber, selectedWalletDetails.code)
            if (_.isEqual(responseMessage.status, 'SUCCESS') && _.isEqual(responseMessage.message, 'One-time password (OTP) is sent')) {
                dispatch(setState(SET_MODAL_VIEW, 3))
                MosambeeWalletPaymentServices.updateDraftInMosambee(walletParameters, contactData, selectedWalletDetails, formLayoutState, jobMasterId, jobTransaction)
            }else {
                throw new Error(responseMessage.message)
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(2902, error.message, 'danger', 0)
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                errorMessage: error.message,
                isModalVisible: 3
            }))
        }
    }
}

export function hitPaymentUrlforPayment(contactNumber, walletParameters, selectedWalletDetails, otpNumber, navigationParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_WALLET, 4))
            let { formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, pieChart, taskListScreenDetails } = navigationParams
            const responseMessage = await MosambeeWalletPaymentServices.prepareJsonAndHitPaymentUrl(walletParameters, contactNumber, otpNumber, jobTransaction, selectedWalletDetails.code)
            if (_.isEqual(responseMessage.status, 'SUCCESS') &&  _.isEqual(responseMessage.message, 'Transaction Successfull')) {
                paymentService.addPaymentObjectToDetailsArray(walletParameters.actualAmount, 14, responseMessage.transId, selectedWalletDetails.code, responseMessage, formLayoutState)
                setTimeout(() => { dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, { errorMessage: TRANSACTION_SUCCESSFUL, isModalVisible: 4 })) }, 1000);
                if(jobTransaction.id < 0) {
                    navDispatch(StackActions.pop())
                }
                dispatch(saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails))
            }else{
                throw new Error('Failed')
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(2903, error.message, 'danger', 0)
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                errorMessage: error.message,
                isModalVisible: 4
            }))
        }
    }
}

export function hitCheckTransactionStatusApi(transactionType, walletParameters) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_WALLET, 5))
            let responseMessage = await MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi(walletParameters, transactionType)
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                errorMessage: responseMessage.message ,
                isModalVisible:  5 
            }))        
        } catch (error) {
            showToastAndAddUserExceptionLog(2904, error.message, 'danger', 0)
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                errorMessage: error.message ,
                isModalVisible:  6 
            }))  
        }
    }
}

