'use strict'

import RestAPIFactory from '../../lib/RestAPIFactory'
import { keyValueDBService } from '../classes/KeyValueDBService'
import {
    CUSTOMIZATION_APP_MODULE,
    DEVICE_IMEI
} from '../../lib/constants'
import {MOSAMBEE_ID} from '../../lib/AttributeConstants'
import CONFIG from '../../lib/config'
import jsSha512 from 'js-sha512'
import { draftService } from '../classes/DraftService'
import { moduleCustomizationService } from '../classes/ModuleCustomization'
import {isArray, isEqual, isEmpty, toLower} from 'lodash'
import { signatureService } from '../classes/SignatureRemarks'
import { SIGNATURE } from '../../lib/AttributeConstants'
import moment from 'moment'

class MosambeeWalletPayment {

    async hitWalletUrlToGetWalletList(walletParameters) {
        const jsonArray = await this.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.walletURL, null, walletParameters.secretKey)
        let walletList = []
        for (let id in jsonArray) {
            if (isEqual(toLower(jsonArray[id].status), 'y')) {
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
        console.logs("data",data)
        data = data.join("&");
        let walletListResponse = await RestAPIFactory(token.value).serviceCall(data, url, 'WALLET')
        const jsonArray = (walletListResponse) ? walletListResponse.json : null
        return jsonArray
    }

    async setWalletListAndWalletParameters(jobTransactionList, jobTransactionIdAmountMap, id){
        const modulesCustomization = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
        const walletModule = moduleCustomizationService.getModuleCustomizationForAppModuleId(modulesCustomization.value, id)[0]
        let walletParameters = walletModule && walletModule.remark ? JSON.parse(walletModule.remark) : null
        let actualAmount = 0.00, referenceNoActualAmountMap = '', transactionActualAmount, separator = ''
        const walletList = (walletParameters && walletParameters.walletURL && walletParameters.partnerId && walletParameters.secretKey && walletParameters.apiPassword && walletParameters.PayProMID) ? await this.hitWalletUrlToGetWalletList(walletParameters) : null
        let conversionAmountMultiple = id == MOSAMBEE_ID ? 1 : 100 // In case of mosambee payment only actualAmount be in rupees
        if(isArray(jobTransactionList)){
            for(let transaction in jobTransactionList){
                transactionActualAmount = (jobTransactionIdAmountMap[jobTransactionList[transaction].jobTransactionId]) ? jobTransactionIdAmountMap[jobTransactionList[transaction].jobTransactionId].actualAmount : 0
                actualAmount = actualAmount + transactionActualAmount
                referenceNoActualAmountMap = referenceNoActualAmountMap + separator + jobTransactionList[transaction].referenceNumber + ':' + String(transactionActualAmount * conversionAmountMultiple) 
                separator = ', '
            }
        }else{
            actualAmount = jobTransactionIdAmountMap.actualAmount
            referenceNoActualAmountMap = jobTransactionList.referenceNumber + ':' + String(actualAmount * conversionAmountMultiple)
        }
        walletParameters.actualAmount = String(actualAmount)
        walletParameters.referenceNoActualAmountMap = referenceNoActualAmountMap
        return { walletParameters, walletList}
    }

    async setSignatureDataForMosambee(formElement, signature){
        if(signature == 'N.A') return;
        for (let [key, formElementData] of Object.entries(formElement)) {
            if(formElementData.attributeTypeId == SIGNATURE){
                formElementData.value = await signatureService.saveFile(signature, moment(), false)
                break;
            }
        }
    }
    
    updateDraftInMosambee(walletParameters, contactData, selectedWalletDetails, formLayoutState, jobMasterId, jobTransaction) {
        walletParameters.contactData = contactData
        walletParameters.selectedWalletDetails = selectedWalletDetails
        formLayoutState.paymentAtEnd.parameters = walletParameters
        draftService.saveDraftInDb(formLayoutState, jobMasterId, null, jobTransaction)
    }

    async prepareJsonAndHitPaymentUrl(walletParameters, contactNumber, otpNumber, jobTransaction, code) {
        const requestBody = walletParameters.secretKey + contactNumber + otpNumber + Number(walletParameters.actualAmount).toFixed(2) + walletParameters.PayProMID +
            jobTransaction.id + code
        const checkSum = jsSha512.update(requestBody + walletParameters.apiPassword)
        const requestJSON = "{\"apiPassword\":" + "\"" + walletParameters.secretKey + "\"" + ",\"customerMobileNo\":" + "\"" + contactNumber + "\"" + ",\"amount\":" + "\"" + Number(walletParameters.actualAmount).toFixed(2) + "\"" + ",\"PayProMID\":" + "\"" + walletParameters.PayProMID + "\""
            + ",\"transRefId\":" + "\"" + jobTransaction.id + "\"" + ",\"otp\":" + "\"" + otpNumber + "\"" + ",\"walletProvider\":" + "\"" + code + "\"" + ",\"checksum\":" + "\"" + checkSum + "\"" + "}";
        const responseMessage = await this.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.paymentURL, requestJSON)
        return responseMessage
    }


    async prepareJsonAndGenerateOtp(jobTransaction, walletParameters, contactNumber, code) {
        const requestBody = walletParameters.secretKey + contactNumber + Number(walletParameters.actualAmount).toFixed(2) + walletParameters.PayProMID +
            jobTransaction.id + walletParameters.referenceNoActualAmountMap + code
        const checkSum = jsSha512.update(requestBody + walletParameters.apiPassword)
        const requestJSON = "{\"apiPassword\":" + "\"" + walletParameters.secretKey + "\"" + ",\"customerMobileNo\":" + "\"" + contactNumber + "\"" + ",\"amount\":" + "\"" + Number(walletParameters.actualAmount).toFixed(2) + "\"" + ",\"PayProMID\":" + "\"" + walletParameters.PayProMID + "\""
            + ",\"transRefId\":" + "\"" + jobTransaction.id + "\"" + ",\"walletProvider\":" + "\"" + code + "\"" + ",\"comment\":" + "\"" + walletParameters.referenceNoActualAmountMap + "\"" + ",\"checksum\":" + "\"" + checkSum + "\"" + "}"
        const responseMessage = await this.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.otpURL, requestJSON)
        return responseMessage
    }

    async prepareJsonAndHitCheckTransactionApi(walletParameters, transactionType) {
        const requestBody = walletParameters.secretKey + walletParameters.PayProMID + walletParameters.referenceNoActualAmountMap
        const checkSum = jsSha512.update(requestBody + walletParameters.apiPassword)
        const requestJSON = "{\"apiPassword\":" + "\"" + walletParameters.secretKey + "\"" + ",\"PayProMID\":" + "\"" + walletParameters.PayProMID + "\"" +
            ",\"comment\":" + "\"" + walletParameters.referenceNoActualAmountMap + "\"" + ",\"checksum\":" + "\"" + checkSum + "\"" + "}";
        const responseMessage = await this.fetchDatafromWalletApi(walletParameters.partnerId, walletParameters.checkTransactionStatusURL, requestJSON, null, walletParameters.mosambeeUsername, transactionType)
        return responseMessage
    }
}

export let MosambeeWalletPaymentServices = new MosambeeWalletPayment()