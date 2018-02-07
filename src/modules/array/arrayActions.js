'use strict'
import { arrayService } from '../../services/classes/ArrayFieldAttribute'
import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import {
    SET_ARRAY_CHILD_LIST,
    SET_NEW_ARRAY_ROW,
    SET_ARRAY_ELEMENTS,
    SET_ERROR_MSG,
    CLEAR_ARRAY_STATE,
    NEXT_FOCUS,
    SET_ARRAY_ISLOADING,
} from '../../lib/constants'
import { ARRAY_SAROJ_FAREYE, AFTER } from '../../lib/AttributeConstants'
import _ from 'lodash'
import { setState } from '../global/globalActions'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { fieldValidationService } from '../../services/classes/FieldValidation'
import { NavigationActions } from 'react-navigation'

export function showOrDropModal(fieldAttributeMasterId, arrayElements, rowId, idToSet, isSaveDisabled) {
    return async function (dispatch) {
        try {
            let newArray = _.cloneDeep(arrayElements)
            newArray[rowId].modalFieldAttributeMasterId = idToSet
            dispatch(setState(SET_ARRAY_ELEMENTS, { newArrayElements: newArray, isSaveDisabled }))
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
export function getNextFocusableAndEditableElement(attributeMasterId, isSaveDisabled, value, arrayElements, rowId, fieldDataList, event, backPress, containerValue) {
    return async function (dispatch) {
        try {
            let cloneArrayElements = _.cloneDeep(arrayElements)
            let arrayRow = cloneArrayElements[rowId]
            arrayRow.formLayoutObject.get(attributeMasterId).displayValue = value
            arrayRow.formLayoutObject.get(attributeMasterId).childDataList = fieldDataList
            arrayRow.modalFieldAttributeMasterId = null
            let validationsResult = fieldValidationService.fieldValidations(arrayRow.formLayoutObject.get(attributeMasterId), arrayRow.formLayoutObject, AFTER, null)
            arrayRow.formLayoutObject.get(attributeMasterId).value = (validationsResult) ? arrayRow.formLayoutObject.get(attributeMasterId).displayValue : null
            arrayRow.formLayoutObject.get(attributeMasterId).containerValue = (validationsResult) ? containerValue : null
            let newArrayElements = arrayService.findNextEditableAndSetSaveDisabled(attributeMasterId, cloneArrayElements, isSaveDisabled, rowId, value, fieldDataList, event)
            if (!newArrayElements) throw new Error('Row could not be deleted')
            dispatch(setState(SET_ARRAY_ELEMENTS, newArrayElements))

            if (validationsResult && backPress) {
                dispatch(NavigationActions.back())
            }
        } catch (error) {
            dispatch(setState(SET_ERROR_MSG, error.message))
        }
    }
}

export function saveArray(arrayElements, arrayParentItem, jobTransaction, latestPositionId, formElement, isSaveDisabled, arrayMainObject, fieldAttributeMasterParentIdMap) {
    return async function (dispatch) {
        try {
            if (!_.isEmpty(arrayElements)) {
                let fieldDataListWithLatestPositionId = await arrayService.prepareArrayForSaving(arrayElements, arrayParentItem, jobTransaction.id, latestPositionId, arrayMainObject)
                if (!fieldDataListWithLatestPositionId) throw new Error('Array Could not be saved')
                dispatch(updateFieldDataWithChildData(arrayParentItem.fieldAttributeMasterId, formElement, isSaveDisabled, ARRAY_SAROJ_FAREYE, fieldDataListWithLatestPositionId, jobTransaction, fieldAttributeMasterParentIdMap))
                dispatch(setState(CLEAR_ARRAY_STATE))
            } else {
                dispatch(updateFieldDataWithChildData(arrayParentItem.fieldAttributeMasterId, formElement, isSaveDisabled, '', { latestPositionId }, jobTransaction, fieldAttributeMasterParentIdMap))
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

export function setInitialArray(currentElement, formElement, jobStatusId, jobTransaction) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_ARRAY_ISLOADING, true))
            const sequenceWiseRootFieldAttributes = await formLayoutService.getSequenceWiseRootFieldAttributes(jobStatusId, currentElement.fieldAttributeMasterId, jobTransaction)
            if (!formElement.get(currentElement.fieldAttributeMasterId).value || formElement.get(currentElement.fieldAttributeMasterId).value == '') {
                const sequenceWiseRootFieldAttributes = await formLayoutService.getSequenceWiseRootFieldAttributes(jobStatusId, currentElement.fieldAttributeMasterId, jobTransaction)
                const arrayDTO = await arrayService.getSortedArrayChildElements(sequenceWiseRootFieldAttributes)
                if (!arrayDTO) return
                if (arrayDTO.errorMessage) {
                    throw new Error(arrayDTO.errorMessage)
                } else {
                    dispatch(setState(SET_ARRAY_CHILD_LIST, arrayDTO))
                }
            } else {
                let arrayState = arrayService.setInitialArray(currentElement, formElement, sequenceWiseRootFieldAttributes)
                dispatch(setState(SET_ARRAY_CHILD_LIST, arrayState))
            }
        } catch (error) {
            dispatch(setState(SET_ERROR_MSG, error.message))
            dispatch(setState(SET_ARRAY_ISLOADING, false))
        }
    }
}