'use strict'

import * as realm from '../../repositories/realmdb'
import RestAPIFactory from '../../lib/RestAPIFactory'
import { keyValueDBService } from '../classes/KeyValueDBService'
import {
    TABLE_JOB_DATA
} from '../../lib/constants'
import CONFIG from '../../lib/config'
import jsSha512 from 'js-sha512'
import { draftService } from '../classes/DraftService'
class MosambeeWalletPayment {

    async hitWalletUrlToGetWalletList(walletParameters) {
        const jsonArray = await this.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.walletURL, null, walletParameters.secretKey)
        let walletList = []
        for (let id in jsonArray) {
            if (_.isEqual(_.toLower(jsonArray[id].status), 'y')) {
                walletList.push({ code: jsonArray[id].code, name: jsonArray[id].name })
            }
        }
        return walletList
    }

    async fetchDatafromWalletApi(partnerId, url, requestData, secretKey, userName, transactionType) {
        const requestJson = (!requestData) ? JSON.stringify({ apiPassword: secretKey }) : requestData
        const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        let data = []
        if (userName && transactionType) {
            data.push(encodeURIComponent('userName') + '=' + encodeURIComponent(userName));
            data.push(encodeURIComponent('requestMessage') + '=' + encodeURIComponent(requestJson));
            data.push(encodeURIComponent('transactionType') + '=' + encodeURIComponent(transactionType));
        } else {
            data.push(encodeURIComponent('request') + '=' + encodeURIComponent(requestJson));
        }
        data.push(encodeURIComponent('partnerId') + '=' + encodeURIComponent(partnerId));
        data = data.join("&");
        let walletListResponse = await RestAPIFactory(token.value).serviceCall(data, url, 'WALLET')
        const jsonArray = (walletListResponse) ? walletListResponse.json : null
        return jsonArray
    }

    updateDraftInMosambee(walletParameters, contactData, actualAmount, selectedWalletDetails, formLayoutState, jobMasterId, jobTransaction) {
        walletParameters.contactData = contactData
        walletParameters.actualAmount = actualAmount
        walletParameters.selectedWalletDetails = selectedWalletDetails
        formLayoutState.paymentAtEnd.parameters = walletParameters
        draftService.saveDraftInDb(formLayoutState, jobMasterId, null, jobTransaction)
    }

    async prepareJsonAndHitPaymentUrl(walletParameters, contactNumber, otpNumber, actualAmount, jobTransaction, code) {
        const requestBody = walletParameters.secretKey + contactNumber + otpNumber + Number(actualAmount).toFixed(2) + walletParameters.PayProMID +
            jobTransaction.id + code
        const checkSum = jsSha512.update(requestBody + walletParameters.apiPassword)
        const requestJSON = "{\"apiPassword\":" + "\"" + walletParameters.secretKey + "\"" + ",\"customerMobileNo\":" + "\"" + contactNumber + "\"" + ",\"amount\":" + "\"" + Number(actualAmount).toFixed(2) + "\"" + ",\"PayProMID\":" + "\"" + walletParameters.PayProMID + "\""
            + ",\"transRefId\":" + "\"" + jobTransaction.id + "\"" + ",\"otp\":" + "\"" + otpNumber + "\"" + ",\"walletProvider\":" + "\"" + code + "\"" + ",\"checksum\":" + "\"" + checkSum + "\"" + "}";
        const responseMessage = await this.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.paymentURL, requestJSON)
        return responseMessage
    }


    async prepareJsonAndGenerateOtp(jobTransaction, actualAmount, walletParameters, contactNumber, code) {
        const referenceNoActualAmountMap = jobTransaction.referenceNumber + ':' + actualAmount
        const requestBody = walletParameters.secretKey + contactNumber + Number(actualAmount).toFixed(2) + walletParameters.PayProMID +
            jobTransaction.id + referenceNoActualAmountMap + code
        const checkSum = jsSha512.update(requestBody + walletParameters.apiPassword)
        const requestJSON = "{\"apiPassword\":" + "\"" + walletParameters.secretKey + "\"" + ",\"customerMobileNo\":" + "\"" + contactNumber + "\"" + ",\"amount\":" + "\"" + Number(actualAmount).toFixed(2) + "\"" + ",\"PayProMID\":" + "\"" + walletParameters.PayProMID + "\""
            + ",\"transRefId\":" + "\"" + jobTransaction.id + "\"" + ",\"walletProvider\":" + "\"" + code + "\"" + ",\"comment\":" + "\"" + referenceNoActualAmountMap + "\"" + ",\"checksum\":" + "\"" + checkSum + "\"" + "}"
        const responseMessage = await this.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.otpURL, requestJSON)
        return responseMessage
    }

    async prepareJsonAndHitCheckTransactionApi(walletParameters, actualAmount, referenceNumber, transactionType) {
        const referenceNoActualAmountMap = referenceNumber + ':' + actualAmount
        const requestBody = walletParameters.secretKey + walletParameters.PayProMID + referenceNoActualAmountMap
        const checkSum = jsSha512.update(requestBody + walletParameters.apiPassword)
        const requestJSON = "{\"apiPassword\":" + "\"" + walletParameters.secretKey + "\"" + ",\"PayProMID\":" + "\"" + walletParameters.PayProMID + "\"" +
            ",\"comment\":" + "\"" + referenceNoActualAmountMap + "\"" + ",\"checksum\":" + "\"" + checkSum + "\"" + "}";
        const responseMessage = await this.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.checkTransactionStatusURL, requestJSON, null, walletParameters.mosambeeUsername, transactionType)
        return responseMessage
    }
}

export let MosambeeWalletPaymentServices = new MosambeeWalletPayment()