'use strict'

import { setState } from '../../global/globalActions'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { moduleCustomizationService } from '../../../services/classes/ModuleCustomization'
import { MosambeeWalletPaymentServices } from '../../../services/payment/MosambeeWalletPayment'
import jsSha512 from 'js-sha512'
import {
    CUSTOMIZATION_APP_MODULE,
    SET_MOSAMBEE_WALLET_PARAMETERS,
    SET_ERROR_MESSAGE_FOR_WALLET,
    SET_MODAL_VIEW,
    SET_OTP_FOR_WALLET,
    SET_LOADER_FOR_WALLET,
    MOSAMBEE_RESET_STATE,
    RESET_STATE_FOR_WALLET
} from '../../../lib/constants'
import { TRANSACTION_SUCCESSFUL } from '../../../lib/ContainerConstants'
import { MOSAMBEE_WALLET_ID } from '../../../lib/AttributeConstants'
import { saveJobTransaction } from '../../form-layout/formLayoutActions';
import { paymentService } from '../../../services/payment/Payment';
import { Toast } from 'native-base'
import { draftService } from '../../../services/classes/DraftService'
import { NavigationActions } from 'react-navigation'


export function setWalletParametersAndGetWalletList(contactNumber) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_WALLET, 1))
            const modulesCustomization = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
            const walletModule = moduleCustomizationService.getModuleCustomizationForAppModuleId(modulesCustomization.value, MOSAMBEE_WALLET_ID)[0]
            const walletParameters = walletModule && walletModule.remark ? JSON.parse(walletModule.remark) : null
            const walletList = (walletParameters && walletParameters.partnerId && walletParameters.secretKey && walletParameters.apiPassword && walletParameters.PayProMID) ? await MosambeeWalletPaymentServices.hitWalletUrlToGetWalletList(walletParameters) : null
            dispatch(setState(SET_MOSAMBEE_WALLET_PARAMETERS, { walletParameters, walletList, contactNumber, isModalVisible: 1 }))
        } catch (error) {
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                errorMessage: error.message,
                isModalVisible: 1
            }))
        }
    }
}

export function hitOtpUrlToGetOtp(contactNumber, walletParameters, selectedWalletDetails, actualAmount, navigationParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_WALLET, 3))
            let { formLayoutState, jobMasterId, jobTransaction, contactData } = navigationParams
            const responseMessage = await MosambeeWalletPaymentServices.prepareJsonAndGenerateOtp(jobTransaction, actualAmount, walletParameters, contactNumber, selectedWalletDetails.code)
            if (_.isEqual(responseMessage.message, 'One-time password (OTP) is sent') && _.isEqual(responseMessage.status, 'SUCCESS')) {
                dispatch(setState(SET_MODAL_VIEW, 3))
                MosambeeWalletPaymentServices.updateDraftInMosambee(walletParameters, contactData, actualAmount, selectedWalletDetails, formLayoutState, jobMasterId, jobTransaction)
            }else {
                throw new Error(responseMessage.message)
            }
        } catch (error) {
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                errorMessage: error.message,
                isModalVisible: 3
            }))
        }
    }
}

export function hitPaymentUrlforPayment(contactNumber, walletParameters, selectedWalletDetails, actualAmount, otpNumber, navigationParams, navigate, goBack, key) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_WALLET, 4))
            let { formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, pieChart, taskListScreenDetails } = navigationParams
            const responseMessage = await MosambeeWalletPaymentServices.prepareJsonAndHitPaymentUrl(walletParameters, contactNumber, otpNumber, actualAmount, jobTransaction, selectedWalletDetails.code)
            if (_.isEqual(responseMessage.message, 'Transaction Successfull') && _.isEqual(responseMessage.status, 'SUCCESS')) {
                paymentService.addPaymentObjectToDetailsArray(actualAmount, 14, responseMessage.transId, selectedWalletDetails.code, responseMessage, formLayoutState)
                setTimeout(() => { dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, { errorMessage: TRANSACTION_SUCCESSFUL, isModalVisible: 4 })) }, 1000);
                dispatch(saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, pieChart, taskListScreenDetails, navigate, goBack, key))
            }else{
                throw new Error('Failed')
            }
        } catch (error) {
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                errorMessage: error.message,
                isModalVisible: 4
            }))
        }
    }
}

export function hitCheckTransactionStatusApi(transactionType, walletParameters, jobTransaction, actualAmount) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_WALLET, 5))
            let responseMessage = await MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi(walletParameters, actualAmount, jobTransaction.referenceNumber, transactionType)
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                errorMessage: responseMessage.message ,
                isModalVisible:  5 
            }))        
        } catch (error) {
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                errorMessage: error.message ,
                isModalVisible:  6 
            }))  
        }
    }
}

