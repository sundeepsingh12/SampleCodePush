'use strict'
const {
    SET_FIELD_DATA_LIST,
    SAVE_SIGNATURE,
    USER,
    FormLayout,
    SET_REMARKS_VALIDATION, FIELD_ATTRIBUTE
} = require('../../lib/constants').default
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { signatureService } from '../../services/classes/SignatureRemarks'
import moment from 'moment'
import { getNextFocusableAndEditableElements, updateFieldDataWithChildData, updateFieldData } from '../form-layout/formLayoutActions'
import {
    OBJECTSAROJFAREYE
} from '../../lib/AttributeConstants'
export function setFieldDataList(fieldDataList) {
    return {
        type: SET_FIELD_DATA_LIST,
        payload: fieldDataList
    }
}

export function _setIsRemarksValidation(isRemarksValidation) {
    return {
        type: SET_REMARKS_VALIDATION,
        payload: isRemarksValidation
    }
}

export function saveSignature(result, fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled) {
    return async function (dispatch) {
        const value = await signatureService.saveFile(result);
        dispatch(getNextFocusableAndEditableElements(fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, value))
        dispatch(updateFieldData(fieldAttributeMasterId, value, formElement))
    }
}

export function getRemarksList(fieldDataList) {
    return async function (dispatch) {
        try {
            const remarksList = signatureService.filterRemarksList(fieldDataList)
            dispatch(setFieldDataList(remarksList))
        } catch (error) {
            console.log(error) // TODo handle UI
        }
    }
}

export function setIsRemarksValidation(validation) {
    return async function (dispatch) {
        let isRemarksValidation = signatureService.getRemarksValidation(validation)
        if (isRemarksValidation) {
            dispatch(_setIsRemarksValidation(true))
        }
    }
}

export function saveSignatureAndRating(result, rating, currentElement, formElement, nextEditable, isSaveDisabled, jobTransactionId, latestPositionId) {
    return async function (dispatch) {
        const signatureValue = await signatureService.saveFile(result);
        const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
        const fieldDataListObject = signatureService.prepareSignAndNpsFieldData(signatureValue, rating, currentElement, fieldAttributeMasterList, jobTransactionId, latestPositionId)
        dispatch(updateFieldDataWithChildData(currentElement.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, OBJECTSAROJFAREYE, fieldDataListObject))
    }
}