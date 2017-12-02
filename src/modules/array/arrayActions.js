'use strict'
import { arrayService } from '../../services/classes/ArrayFieldAttribute'
import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import {
    SET_ARRAY_CHILD_LIST,
    SET_NEW_ARRAY_ROW,
    SET_ARRAY_ELEMENTS,
    SET_ERROR_MSG,
    ON_BLUR,
    CLEAR_ARRAY_STATE,
    UPDATE_FIELD_DATA_VALIDATION
} from '../../lib/constants'
import { ARRAYSAROJFAREYE } from '../../lib/AttributeConstants'
import _ from 'lodash'
import { setState } from '../global/globalActions'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { fieldValidationService } from '../../services/classes/FieldValidation'

export function getSortedArrayChildElements(fieldAttributeMasterId, jobStatusId, lastrowId, arrayElements) {
    return async function (dispatch) {
        try {
            const sequenceWiseRootFieldAttributes = await formLayoutService.getSequenceWiseRootFieldAttributes(jobStatusId, fieldAttributeMasterId)
            const arrayDTO = await arrayService.getSortedArrayChildElements(lastrowId, arrayElements, sequenceWiseRootFieldAttributes)
            if (!arrayDTO) return
            if (arrayDTO.errorMessage) {
                throw new Error(arrayDTO.errorMessage)
            } else {
                dispatch(setState(SET_ARRAY_CHILD_LIST, arrayDTO))
            }
        } catch (error) {
            dispatch(setState(SET_ERROR_MSG, error.message))
        }
    }
}
export function addRowInArray(lastrowId, childElementsTemplate, arrayElements) {
    return async function (dispatch) {
        try {
            const newArrayRow = arrayService.addArrayRow(lastrowId, childElementsTemplate, arrayElements)
            dispatch(setState(SET_NEW_ARRAY_ROW, newArrayRow))
        } catch (error) {
            dispatch(setState(SET_ERROR_MSG, error.message))
        }
    }
}
export function deleteArrayRow(arrayElements, rowId, lastrowId) {
    return async function (dispatch) {
        try {
            let newArrayElements = arrayService.deleteArrayRow(arrayElements, rowId, lastrowId)
            let isSaveDisabled = arrayService.enableSaveIfRequired(newArrayElements)
            dispatch(setState(SET_ARRAY_ELEMENTS, {
                newArrayElements,
                isSaveDisabled
            }))
        } catch (error) {
            dispatch(setState(SET_ERROR_MSG, error.message))
        }
    }
}
export function getNextFocusableAndEditableElement(attributeMasterId, nextEditable, isSaveDisabled, value, arrayElements, rowId) {
    return async function (dispatch) {
        try {
            let newArrayElements = arrayService.findNextEditableAndSetSaveDisabled(attributeMasterId, arrayElements, nextEditable, isSaveDisabled, rowId, value)
            dispatch(setState(SET_ARRAY_ELEMENTS, newArrayElements))
        } catch (error) {
            dispatch(setState(SET_ERROR_MSG, error.message))
        }
    }
}

export function saveArray(arrayElements, arrayParentItem, jobTransactionId, latestPositionId, formElement, nextEditable, isSaveDisabled) {
    return async function (dispatch) {
        try {
            if (!_.isEmpty(arrayElements)) {
                let fieldDataListWithLatestPositionId = await arrayService.prepareArrayForSaving(arrayElements, arrayParentItem, jobTransactionId, latestPositionId)
                dispatch(updateFieldDataWithChildData(arrayParentItem.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, ARRAYSAROJFAREYE, fieldDataListWithLatestPositionId))
                dispatch(setState(SET_ERROR_MSG, ''))
            }
        } catch (error) {
            dispatch(setState(SET_ERROR_MSG, error.message))
        }
    }
}

export function clearArrayState() {
    return async function (dispatch) {
        dispatch(setState(CLEAR_ARRAY_STATE))
    }
}

export function fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction) {
    return function (dispatch) {
        let alertMessageList = fieldValidationService.fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction)
        // dispatch(setState(UPDATE_FIELD_DATA_VALIDATION, {
        //     formElement,
        //     message: alertMessageList[0]
        // }))
    }
}