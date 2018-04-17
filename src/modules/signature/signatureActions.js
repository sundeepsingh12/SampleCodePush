'use strict'
import {
    SET_FIELD_DATA_LIST,
    SAVE_SIGNATURE,
    USER,
    FormLayout,
    SET_REMARKS_VALIDATION,
    FIELD_ATTRIBUTE,
    NEXT_FOCUS
} from '../../lib/constants'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { signatureService } from '../../services/classes/SignatureRemarks'
import moment from 'moment'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import {
    OBJECT_SAROJ_FAREYE
} from '../../lib/AttributeConstants'
import { showToastAndAddUserExceptionLog } from '../global/globalActions'

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

export function saveSignature(result, fieldAttributeMasterId, formLayoutState, jobTransaction) {
    return async function (dispatch) {
        try {
            const value = await signatureService.saveFile(result, moment())
            dispatch(updateFieldDataWithChildData(fieldAttributeMasterId, formLayoutState, value, { latestPositionId: formLayoutState.latestPositionId }, jobTransaction))
        } catch (error) {
            showToastAndAddUserExceptionLog(2101, error.message, 'danger', 1)
        }
    }
}

export function getRemarksList(fieldDataList) {
    return async function (dispatch) {
        try {
            const remarksList = signatureService.filterRemarksList(fieldDataList)
            dispatch(setFieldDataList(remarksList))
        } catch (error) {
            showToastAndAddUserExceptionLog(2102, error.message, 'danger', 1)
        }
    }
}

export function setIsRemarksValidation(validation) {
    return async function (dispatch) {
        try {
            let isRemarksValidation = signatureService.getRemarksValidation(validation)
            if (isRemarksValidation) {
                dispatch(_setIsRemarksValidation(true))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(2103, error.message, 'danger', 1)
        }
    }
}

export function saveSignatureAndRating(result, rating, currentElement, formLayoutState, jobTransaction) {
    return async function (dispatch) {
        try {
            const signatureValue = await signatureService.saveFile(result, moment())
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const fieldDataListObject = signatureService.prepareSignAndNpsFieldData(signatureValue, rating, currentElement, fieldAttributeMasterList, jobTransaction.id, formLayoutState.latestPositionId)
            dispatch(updateFieldDataWithChildData(currentElement.fieldAttributeMasterId, formLayoutState, OBJECT_SAROJ_FAREYE, fieldDataListObject, jobTransaction))
        } catch (error) {
            showToastAndAddUserExceptionLog(2104, error.message, 'danger', 1)
        }
    }
}