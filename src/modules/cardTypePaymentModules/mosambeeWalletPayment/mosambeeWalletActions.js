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
    SET_LOADER_FOR_WALLET
} from '../../../lib/constants'
import { MOSAMBEE_WALLET_ID } from '../../../lib/AttributeConstants'

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
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET,{
                errorMessage: error.message,
                isModalVisible: 0
            }))        }

    }
}

export function hitOtpUrlToGetOtp(contactNumber, walletParameters, selectedWalletDetails, actualAmount, jobTransaction) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_WALLET, 3))
            let referenceNoActualAmountMap = jobTransaction.referenceNumber + ':' + actualAmount
            let requestBody = walletParameters.secretKey + contactNumber + Number(actualAmount).toFixed(2) + walletParameters.PayProMID +
                              jobTransaction.id + referenceNoActualAmountMap + selectedWalletDetails.code
            let checkSum = jsSha512.update(requestBody + walletParameters.apiPassword)
            const requestJSON = "{\"apiPassword\":" + "\"" + walletParameters.secretKey + "\"" + ",\"customerMobileNo\":" + "\"" + contactNumber + "\"" + ",\"amount\":" + "\"" +Number(actualAmount).toFixed(2) + "\"" + ",\"PayProMID\":" + "\"" + walletParameters.PayProMID + "\""
            + ",\"transRefId\":" + "\"" + jobTransaction.id + "\"" + ",\"walletProvider\":" + "\"" + selectedWalletDetails.code  + "\"" + ",\"comment\":" + "\"" + referenceNoActualAmountMap + "\"" + ",\"checksum\":" + "\"" + checkSum + "\"" + "}"
            let responseMessage = await MosambeeWalletPaymentServices.fetchDatafromWalletApi(walletParameters.partnerId,walletParameters.otpURL, requestJSON)
            if(_.isEqual(responseMessage.status,'FAILURE') ) throw new Error(responseMessage.message)
            if(_.isEqual(responseMessage.message,'One-time password (OTP) is sent') )  dispatch(setState(SET_MODAL_VIEW, 3))
        } catch (error) {
            dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET,{
                errorMessage: error.message,
                isModalVisible: 2
            }))
        }
    }
}

export function hitPaymentUrlforPayment(contactNumber, walletParameters, selectedWalletDetails, actualAmount, jobTransaction, otpNumber) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_LOADER_FOR_WALLET, 4))
            let referenceNoActualAmountMap = jobTransaction.referenceNumber + ':' + actualAmount
            let requestBody = walletParameters.secretKey + contactNumber + otpNumber + Number(actualAmount).toFixed(2) + walletParameters.PayProMID +
                              jobTransaction.id + selectedWalletDetails.code
            let checkSum = jsSha512.update(requestBody + walletParameters.apiPassword)
            let requestJSON = "{\"apiPassword\":" + "\"" + walletParameters.secretKey + "\"" + ",\"customerMobileNo\":" + "\"" + contactNumber + "\"" + ",\"amount\":" + "\"" + Number(actualAmount).toFixed(2) + "\"" + ",\"PayProMID\":" + "\"" + walletParameters.PayProMID + "\""
                        + ",\"transRefId\":" + "\"" + jobTransaction.id + "\"" + ",\"otp\":" + "\"" + otpNumber + "\"" + ",\"walletProvider\":" + "\"" + selectedWalletDetails.code + "\"" + ",\"checksum\":" + "\"" + checkSum + "\"" + "}";
            let responseMessage = await MosambeeWalletPaymentServices.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.paymentURL, requestJSON)
            if(_.isEqual(responseMessage.status,'FAILURE') ) throw new Error('Failed')
            if(_.isEqual(responseMessage.message,'Transaction Successfull')) throw new Error('Transaction Successfull') 
        } catch (error) {
           dispatch(setState(SET_ERROR_MESSAGE_FOR_WALLET,{
                errorMessage: error.message,
                isModalVisible: 3
            }))
        }
    }
}

