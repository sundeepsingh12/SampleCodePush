'use strict'
const {
    SET_FIELD_DATA_LIST,
    SAVE_SIGNATURE,
    USER,
    FormLayout,
    SET_REMARKS_VALIDATION
} = require('../../lib/constants').default

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { signatureService } from '../../services/classes/SignatureRemarks'
import moment from 'moment'
import { getNextFocusableAndEditableElements } from '../form-layout/formLayoutActions'

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
        const image_name = await signatureService.saveFile(result);
        const user = await keyValueDBService.getValueFromStore(USER);
        const value = moment().format('YYYY-MM-DD') + '/' + user.value.company.id + '/' + image_name
        dispatch(getNextFocusableAndEditableElements(fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, value))
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
