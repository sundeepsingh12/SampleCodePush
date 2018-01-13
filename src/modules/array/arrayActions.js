'use strict'
import { arrayService } from '../../services/classes/ArrayFieldAttribute'
import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import {
    SET_ARRAY_CHILD_LIST,
    SET_NEW_ARRAY_ROW,
    SET_ARRAY_ELEMENTS,
    SET_ERROR_MSG,
    CLEAR_ARRAY_STATE,
    NEXT_FOCUS

} from '../../lib/constants'
import { ARRAY_SAROJ_FAREYE, AFTER } from '../../lib/AttributeConstants'
import _ from 'lodash'
import { setState } from '../global/globalActions'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { fieldValidationService } from '../../services/classes/FieldValidation'

export function getSortedArrayChildElements(fieldAttributeMasterId, jobStatusId, lastrowId, arrayElements, latestPositionId) {
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
            if (!newArrayRow) throw new Error('Row could not be added')
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
            if (!newArrayElements) throw new Error('Row could not be deleted')
            dispatch(setState(SET_ARRAY_ELEMENTS, {
                newArrayElements,
                isSaveDisabled
            }))
        } catch (error) {
            dispatch(setState(SET_ERROR_MSG, error.message))
        }
    }
}
export function getNextFocusableAndEditableElement(attributeMasterId, isSaveDisabled, value, arrayElements, rowId, fieldDataList, event) {
    return async function (dispatch) {
        try {
            let newArrayElements = arrayService.findNextEditableAndSetSaveDisabled(attributeMasterId, arrayElements, isSaveDisabled, rowId, value, fieldDataList, event)
            if (!newArrayElements) throw new Error('Row could not be deleted')
            dispatch(setState(SET_ARRAY_ELEMENTS, newArrayElements))
        } catch (error) {
            dispatch(setState(SET_ERROR_MSG, error.message))
        }
    }
}

export function saveArray(arrayElements, arrayParentItem, jobTransaction, latestPositionId, formElement, isSaveDisabled) {
    return async function (dispatch) {
        try {
            if (!_.isEmpty(arrayElements)) {
                let fieldDataListWithLatestPositionId = await arrayService.prepareArrayForSaving(arrayElements, arrayParentItem, jobTransaction.id, latestPositionId)
                if (!fieldDataListWithLatestPositionId) throw new Error('Array Could not be saved')
                dispatch(updateFieldDataWithChildData(arrayParentItem.fieldAttributeMasterId, formElement, isSaveDisabled, ARRAY_SAROJ_FAREYE, fieldDataListWithLatestPositionId, jobTransaction))
                dispatch(setState(CLEAR_ARRAY_STATE))
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

export function fieldValidationsArray(currentElement, arrayElements, timeOfExecution, jobTransaction, rowId, isSaveDisabled) {
    return function (dispatch) {
        let newArray = _.cloneDeep(arrayElements)
        let formElement = newArray[rowId].formLayoutObject
        let validationsResult = fieldValidationService.fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction)
        if (timeOfExecution == AFTER) {
            formElement.get(currentElement.fieldAttributeMasterId).value = validationsResult ? formElement.get(currentElement.fieldAttributeMasterId).displayValue : null
        }
        dispatch(getNextFocusableAndEditableElement(currentElement.fieldAttributeMasterId, isSaveDisabled, currentElement.displayValue, newArray, rowId, null, NEXT_FOCUS))
    }
}