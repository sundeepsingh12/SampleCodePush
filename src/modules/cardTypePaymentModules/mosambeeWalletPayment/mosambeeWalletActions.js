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
            dispatch(setState(SET_MOSAMBEE_WALLET_PARAMETERS, {
                walletParameters,
                walletList,
                contactNumber,
                isModalVisible: 1
            }))
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
            let { formLayoutState, jobMasterId, jobTransaction } = navigationParams
            console.logs("jobTransaction",jobTransaction)

            let referenceNoActualAmountMap = jobTransaction.referenceNumber + ':' + actualAmount
            let requestBody = walletParameters.secretKey + contactNumber + Number(actualAmount).toFixed(2) + walletParameters.PayProMID +
                jobTransaction.id + referenceNoActualAmountMap + selectedWalletDetails.code
            let checkSum = jsSha512.update(requestBody + walletParameters.apiPassword)
            const requestJSON = "{\"apiPassword\":" + "\"" + walletParameters.secretKey + "\"" + ",\"customerMobileNo\":" + "\"" + contactNumber + "\"" + ",\"amount\":" + "\"" + Number(actualAmount).toFixed(2) + "\"" + ",\"PayProMID\":" + "\"" + walletParameters.PayProMID + "\""
                + ",\"transRefId\":" + "\"" + jobTransaction.id + "\"" + ",\"walletProvider\":" + "\"" + selectedWalletDetails.code + "\"" + ",\"comment\":" + "\"" + referenceNoActualAmountMap + "\"" + ",\"checksum\":" + "\"" + checkSum + "\"" + "}"
            let responseMessage = await MosambeeWalletPaymentServices.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.otpURL, requestJSON)
            // if (_.isEqual(responseMessage.message, 'One-time password (OTP) is sent')) {
                dispatch(setState(SET_MODAL_VIEW, 3))
                walletParameters.contactNo= contactNumber
                walletParameters.referenceNo = jobTransaction.referenceNumber
                walletParameters.actualAmount = actualAmount
                walletParameters.selectedWalletDetails = selectedWalletDetails
                formLayoutState.paymentAtEnd.parameters = walletParameters
                draftService.saveDraftInDb(formLayoutState, jobMasterId, null, jobTransaction)
            // }
            //  else {
                // throw new Error(responseMessage.message)
            // }
        } catch (error) {
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                errorMessage: error.message,
                isModalVisible: 3
            }))
        }
    }
}

export function hitPaymentUrlforPayment(contactNumber, walletParameters, selectedWalletDetails, actualAmount, jobTransaction, otpNumber, navigationParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_WALLET, 4))
            let { formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, pieChart, taskListScreenDetails } = navigationParams
            let referenceNoActualAmountMap = jobTransaction.referenceNumber + ':' + actualAmount
            let requestBody = walletParameters.secretKey + contactNumber + otpNumber + Number(actualAmount).toFixed(2) + walletParameters.PayProMID +
                jobTransaction.id + selectedWalletDetails.code
            let checkSum = jsSha512.update(requestBody + walletParameters.apiPassword)
            let requestJSON = "{\"apiPassword\":" + "\"" + walletParameters.secretKey + "\"" + ",\"customerMobileNo\":" + "\"" + contactNumber + "\"" + ",\"amount\":" + "\"" + Number(actualAmount).toFixed(2) + "\"" + ",\"PayProMID\":" + "\"" + walletParameters.PayProMID + "\""
                + ",\"transRefId\":" + "\"" + jobTransaction.id + "\"" + ",\"otp\":" + "\"" + otpNumber + "\"" + ",\"walletProvider\":" + "\"" + selectedWalletDetails.code + "\"" + ",\"checksum\":" + "\"" + checkSum + "\"" + "}";
            let responseMessage = await MosambeeWalletPaymentServices.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.paymentURL, requestJSON)
            // if (_.isEqual(responseMessage.status, 'FAILURE')) {
            //     throw new Error('Failed')
            // }
            // if (_.isEqual(responseMessage.message, 'Transaction Successfull')) {
                await paymentService.addPaymentObjectToDetailsArray(actualAmount, 14, responseMessage.transId, selectedWalletDetails.code, responseMessage, formLayoutState)
                // setTimeout(() => {
                //     dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET, {
                //         errorMessage: TRANSACTION_SUCCESSFUL,
                //         isModalVisible: 4
                //     }))
                // }, 2000);
                dispatch(saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, pieChart, taskListScreenDetails))
                dispatch(NavigationActions.back())
                // }

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

