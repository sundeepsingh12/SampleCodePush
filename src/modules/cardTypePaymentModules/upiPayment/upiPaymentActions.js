'use strict'

import { setState } from '../../global/globalActions'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { moduleCustomizationService } from '../../../services/classes/ModuleCustomization'
import { upiPaymentService } from '../../../services/payment/UPIPayment'

const {
    CUSTOMIZATION_APP_MODULE,
    DEVICE_IMEI,
    SET_UPI_PAYMENT_PARAMETERS
} = require('../../../lib/constants').default

import {
    UPIMODULE
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

export function approveTransactionAPIRequest(customerName, customerContact, payerVPA, upiConfigJSON) {
    return async function (dispatch) {
        try {
            const deviceIMEI = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
            console.log(customerName, customerContact, payerVPA, upiConfigJSON)
            if (!customerName || !customerContact || !payerVPA || !upiConfigJSON) {
                throw new Exception('Invalid Parameters')
            }
            upiPaymentService.approveTransactionUPI(customerName, customerContact, payerVPA, upiConfigJSON, deviceIMEI.value)
        } catch (error) {
            console.log(error)
        }
    }
}

