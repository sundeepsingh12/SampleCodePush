'use strict'

import { setState } from '../../global/globalActions'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { moduleCustomizationService } from '../../../services/classes/ModuleCustomization'
import { upiPaymentService } from '../../../services/payment/UPIPayment'

const {
    CUSTOMIZATION_APP_MODULE,
    DEVICE_IMEI,
    SET_UPI_PAYMENT_PARAMETERS,
    SET_UPI_APPROVAL,
} = require('../../../lib/constants').default

import CONFIG from '../../../lib/config'

import {
    UPIMODULE,
    OBJECT_SAROJ_FAREYE
} from '../../../lib/AttributeConstants'

export function getUPIPaymentParameters(jobMasterId, jobId) {
    return async function (dispatch) {
        try {
            const modulesCustomization = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
            const upiModule = moduleCustomizationService.getModuleCustomizationForAppModuleId(modulesCustomization.value, UPIMODULE)[0]
            const upiConfigJSON = upiModule ? upiModule.remark ? JSON.parse(upiModule.remark) : null : null
            let customerName = upiPaymentService.getInitialUPIParameters(jobMasterId, jobId, upiConfigJSON)
            console.log('username', customerName)
            dispatch(setState(SET_UPI_PAYMENT_PARAMETERS, {
                customerName,
                upiConfigJSON
            }))
        } catch (error) {
            console.log(error)
        }
    }
}

export function approveTransactionAPIRequest(amount, customerName, customerContact, payerVPA, referenceNumber, upiConfigJSON) {
    return async function (dispatch) {
        try {
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            const deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
            console.log(customerName, customerContact, payerVPA, upiConfigJSON)
            if (!customerName || !customerContact || !payerVPA || !upiConfigJSON) {
                throw new Exception('Invalid Parameters')
            }
            const approveTransactionResponse = await upiPaymentService.approveTransactionUPI(amount, customerName, customerContact, deviceIMEI.value, payerVPA, referenceNumber, upiConfigJSON, token.value)
            const approveTransactionResponseJson = await approveTransactionResponse.json
            if (approveTransactionResponseJson.status && approveTransactionResponseJson.status == '00') {
                dispatch(setState(SET_UPI_APPROVAL,
                    {
                        upiApproval: true
                    }
                ))
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export function queryTransactionAPIRequest(transactionId) {
    return async function (dispatch) {
        try {
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            if (!transactionId) {
                throw new Exception('Invalid Transaction Id')
            }
            const queryTransactionResponse = await upiPaymentService.queryTransactionUPI(token.value, transactionId, upiConfigJSON)
            const queryTransactionResponseJson = await queryTransactionResponse.json
            if (queryTransactionResponseJson.responseStatus && queryTransactionResponseJson.responseStatus == 'COMPLETED') {
                //TODO : update and save fielddatalist in form layout state
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export function testSave(actualAmount, currentElement, formElement, jobMasterId, jobId, jobTransactionId, latestPositionId, moneyCollectMaster, nextEditable, isSaveDisabled, originalAmount, selectedIndex, transactionNumber, remarks, receipt) {
    return async function (dispatch) {
        try {
            const moneyCollectChildFieldDataList = paymentService.prepareMoneyCollectChildFieldDataListDTO(actualAmount, moneyCollectMaster, originalAmount, selectedIndex, transactionNumber, remarks, receipt)
            const fieldDataListObject = fieldDataService.prepareFieldDataForTransactionSavingInState(moneyCollectChildFieldDataList, jobTransactionId, currentElement.positionId, latestPositionId)
            dispatch(updateFieldDataWithChildData(currentElement.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, OBJECT_SAROJ_FAREYE, fieldDataListObject))
            dispatch()
        } catch (error) {

        }
    }
}

