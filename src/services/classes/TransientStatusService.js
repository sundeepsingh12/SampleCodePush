'use strict'
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'
const {
    REMARKS,
    MINMAX,
    SPECIAL,
    TABLE_FIELD_DATA
} = require('../../lib/constants').default

import {
    DATA_STORE_ATTR_MASTER_ID,
    DATA_STORE_MASTER_ID,
    SEARCH_VALUE,
    GET,
    EXTERNAL_DATA_STORE_URL,
    DATA_STORE_ATTR_KEY,
    SKU_ARRAY,
    CAMERA_HIGH,
    CAMERA_MEDIUM,
    CAMERA,
    SIGNATURE,
    SIGNATURE_AND_FEEDBACK,
    CASH_TENDERING,
    OPTION_CHECKBOX,
    ARRAY,
    OPTION_RADIO_FOR_MASTER,
    FIXED_SKU,
    MULTIPLE_SCANNER,
    SKU_ACTUAL_AMOUNT,
    TOTAL_ORIGINAL_QUANTITY,
    TOTAL_ACTUAL_QUANTITY,
    MONEY_COLLECT,
    MONEY_PAY,
    ACTUAL_AMOUNT,
    PATH_TEMP,
    SIGN,
    IMAGE_EXTENSION
} from '../../lib/AttributeConstants'

import * as realm from '../../repositories/realmdb'

class TransientStatusService {

    getCurrentStatus(statusList, statusId, jobMasterId) {
        const currentStatus = statusList.value.filter(status => status.jobMasterId == jobMasterId && status.id == statusId);
        return currentStatus[0]
    }

    isAllNextStatusSaveActivated(nextStatusList) {
        if (!nextStatusList) {
            throw new Error('No further status mapped to this status')
        }
        return nextStatusList.filter((nextStatus) => !nextStatus.saveActivated).length == 0
    }

    setSavedJobDetails(formElement, jobTransactionId, jobId, savedJobDetails) {
        console.log('formElement', formElement)
        let cloneSavedJobDetials = { ...savedJobDetails }
        let priority = -1, textToShow = ''
        let savedJobDetailsObject = {}
        for (let [id, currentObject] of formElement.entries()) {
            if (currentObject.attributeTypeId == 54 && priority < 4) {
                priority = 4
                textToShow = currentObject.value
                break
            }
            else if (currentObject.attributeTypeId == 63 && priority < 3) {
                priority = 3
                textToShow = currentObject.value
            }
            else if (currentObject.attributeTypeId == 44 && priority < 2) {
                priority = 2
                textToShow = currentObject.value
            }
            else if (currentObject.attributeTypeId == 22 && priority < 1) {
                priority = 1
                textToShow = currentObject.value
            }
        }
        if (priority == -1) {
            textToShow = Object.keys(savedJobDetails).length + 1
        }
        cloneSavedJobDetials[jobTransactionId] = {
            jobTransactionId,
            jobId,
            textToShow,
            formElement
        }
        console.log('savedJobDetails', cloneSavedJobDetials)
        return cloneSavedJobDetials
    }

    buildDetialsForCheckout(formLayoutStates, savedJobDetails) {
        console.log('buildDetialsForCheckout', formLayoutStates, savedJobDetails)
        let rootElements = this.createFieldDataDetails(formLayoutStates)
        let differentData = this.createFieldDataDetails(savedJobDetails)
        console.log('checkoutdetails', rootElements)
        console.log('checkoutdetails', differentData)

        let details = {
            rootElements,
            differentData
        }
        return details
    }

    createFieldDataDetails(formLayoutStates) {
        let elementsArray = []
        for (let formLayoutCounter in formLayoutStates) {
            let formElement = formLayoutStates[formLayoutCounter].formElement
            for (let [id, fieldDataObject] of formElement.entries()) {
                let fieldDataElement = {}
                switch (fieldDataObject.attributeTypeId) {
                    case CAMERA_HIGH:
                    case CAMERA_MEDIUM:
                    case CAMERA:
                    case SIGNATURE:
                    case SKU_ARRAY:
                    case SIGNATURE_AND_FEEDBACK:
                    case CASH_TENDERING:
                    case OPTION_CHECKBOX:
                    case ARRAY:
                    case OPTION_RADIO_FOR_MASTER:
                    case FIXED_SKU:
                    case MULTIPLE_SCANNER:
                    case SKU_ACTUAL_AMOUNT:
                    case TOTAL_ORIGINAL_QUANTITY:
                    case TOTAL_ACTUAL_QUANTITY:
                    case MONEY_COLLECT:
                    case MONEY_PAY:
                        break;
                    default:
                        fieldDataElement.name = fieldDataObject.label
                        fieldDataElement.value = fieldDataObject.value
                        elementsArray.push(fieldDataElement)
                }
            }
        }
        return elementsArray
    }
}

export let transientStatusService = new TransientStatusService()