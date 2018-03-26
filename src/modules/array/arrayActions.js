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
    SET_OPTION_ATTRIBUTE_ERROR,
    SET_ARRAY_DATA_STORE_FILTER_MAP,
} from '../../lib/constants'
import { ARRAY_SAROJ_FAREYE, AFTER, TEXT, STRING, SCAN_OR_TEXT, QR_SCAN } from '../../lib/AttributeConstants'
import _ from 'lodash'
import { setState } from '../global/globalActions'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { fieldValidationService } from '../../services/classes/FieldValidation'
import { NavigationActions } from 'react-navigation'
import { DELETE_ROW_ERROR, ADD_ROW_ERROR, SAVE_ARRAY_ERROR, UNIQUE_VALIDATION_FAILED_FORMLAYOUT, ADD_TOAST } from '../../lib/ContainerConstants'
import { Toast } from 'native-base'

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
export function addRowInArray(lastrowId, childElementsTemplate, arrayElements, jobTransaction) {
    return async function (dispatch) {
        try {
            const newArrayRow = arrayService.addArrayRow(lastrowId, childElementsTemplate, arrayElements, jobTransaction)
            if (!newArrayRow) throw new Error(ADD_ROW_ERROR)
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
            if (!newArrayElements) throw new Error(DELETE_ROW_ERROR)
            dispatch(setState(SET_ARRAY_ELEMENTS, {
                newArrayElements,
                isSaveDisabled
            }))
        } catch (error) {
            dispatch(setState(SET_ERROR_MSG, error.message))
        }
    }
}
export function getNextFocusableAndEditableElement(attributeMasterId, isSaveDisabled, value, arrayElements, rowId, fieldDataList, event, backPressOrModalPresent, containerValue, fieldAttributeMasterParentIdMap) {
    return async function (dispatch) {
        try {
            let cloneArrayElements = _.cloneDeep(arrayElements)
            let arrayRow = cloneArrayElements[rowId]
            arrayRow.formLayoutObject.get(attributeMasterId).displayValue = value
            arrayRow.formLayoutObject.get(attributeMasterId).childDataList = fieldDataList
            let validationsResult = fieldValidationService.fieldValidations(arrayRow.formLayoutObject.get(attributeMasterId), arrayRow.formLayoutObject, AFTER, null)
            arrayRow.formLayoutObject.get(attributeMasterId).value = (validationsResult && backPressOrModalPresent) ? arrayRow.formLayoutObject.get(attributeMasterId).displayValue : null
            arrayRow.formLayoutObject.get(attributeMasterId).containerValue = (validationsResult) ? containerValue : null
            arrayRow.modalFieldAttributeMasterId = (validationsResult) ? null : (backPressOrModalPresent == 2) ? attributeMasterId : null
            let newArrayElements = arrayService.findNextEditableAndSetSaveDisabled(attributeMasterId, cloneArrayElements, isSaveDisabled, rowId, (validationsResult && backPressOrModalPresent) ? value : null, (validationsResult) ? fieldDataList : null, event, fieldAttributeMasterParentIdMap)
            if (!newArrayElements) throw new Error(DELETE_ROW_ERROR)
            dispatch(setState(SET_ARRAY_ELEMENTS, newArrayElements))
            if (validationsResult && backPressOrModalPresent == 1) {
                dispatch(NavigationActions.back())
            }
            if (!validationsResult && arrayRow.formLayoutObject.get(attributeMasterId).alertMessage) {
                if (backPressOrModalPresent == 2) {
                    dispatch(setState(SET_OPTION_ATTRIBUTE_ERROR, { error: arrayRow.formLayoutObject.get(attributeMasterId).alertMessage }))
                } else {
                    Toast.show({ text: arrayRow.formLayoutObject.get(attributeMasterId).alertMessage, position: 'bottom', buttonText: 'OK', duration: 5000 })
                }
            }
        } catch (error) {
            console.log(error)
            dispatch(setState(SET_ERROR_MSG, error.message))
        }
    }
}
export function getNextFocusableForArrayWithoutChildDatalist(attributeMasterId, isSaveDisabled, value, arrayElements, rowId, event, fieldAttributeMasterParentIdMap) {
    return async function (dispatch) {
        let cloneArrayElements = _.cloneDeep(arrayElements)
        let newArrayElements = arrayService.findNextEditableAndSetSaveDisabled(attributeMasterId, cloneArrayElements, isSaveDisabled, rowId, value, null, event, fieldAttributeMasterParentIdMap)
        if (!newArrayElements) throw new Error(DELETE_ROW_ERROR)
        dispatch(setState(SET_ARRAY_ELEMENTS, newArrayElements))

    }
}
export function saveArray(arrayElements, arrayParentItem, jobTransaction, latestPositionId, formElement, isSaveDisabled, arrayMainObject, fieldAttributeMasterParentIdMap) {
    return async function (dispatch) {
        try {
            if (!_.isEmpty(arrayElements)) {
                let fieldDataListSaveDisabled = await arrayService.prepareArrayForSaving(arrayElements, arrayParentItem, jobTransaction, latestPositionId, arrayMainObject)
                if (!fieldDataListSaveDisabled) throw new Error(SAVE_ARRAY_ERROR)
                if (fieldDataListSaveDisabled.isSaveDisabled) {
                    dispatch(setState(SET_ARRAY_ELEMENTS, { newArrayElements: arrayElements, isSaveDisabled: fieldDataListSaveDisabled.isSaveDisabled }))
                    Toast.show({ text: ADD_TOAST, position: 'bottom', buttonText: 'OK', duration: 5000 })
                } else {
                    dispatch(updateFieldDataWithChildData(arrayParentItem.fieldAttributeMasterId, formElement, isSaveDisabled, ARRAY_SAROJ_FAREYE, fieldDataListSaveDisabled.fieldDataListWithLatestPositionId, jobTransaction, fieldAttributeMasterParentIdMap))
                    dispatch(setState(CLEAR_ARRAY_STATE))
                }
            } else {
                dispatch(updateFieldDataWithChildData(arrayParentItem.fieldAttributeMasterId, formElement, isSaveDisabled, '', { latestPositionId }, jobTransaction, fieldAttributeMasterParentIdMap))
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

export function fieldValidationsArray(currentElement, arrayElements, timeOfExecution, jobTransaction, rowId, isSaveDisabled, scanValue) {
    return function (dispatch) {
        try {
            let newArray = _.cloneDeep(arrayElements)
            let formElement = newArray[rowId].formLayoutObject
            let isValuePresentInAnotherTransaction = false
            let validationsResult = fieldValidationService.fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction)
            if (timeOfExecution == AFTER) {
                isValuePresentInAnotherTransaction = (currentElement.attributeTypeId == TEXT || currentElement.attributeTypeId == SCAN_OR_TEXT || currentElement.attributeTypeId == STRING || currentElement.attributeTypeId == QR_SCAN) ? arrayService.checkforUniqueValidation(currentElement, newArray, rowId) : false
                if (scanValue) formElement.get(currentElement.fieldAttributeMasterId).displayValue = scanValue
                formElement.get(currentElement.fieldAttributeMasterId).value = validationsResult && !isValuePresentInAnotherTransaction ? formElement.get(currentElement.fieldAttributeMasterId).displayValue : null
            }
            if (isValuePresentInAnotherTransaction) {
                formElement.get(currentElement.fieldAttributeMasterId).alertMessage = UNIQUE_VALIDATION_FAILED_FORMLAYOUT
            }
            dispatch(getNextFocusableForArrayWithoutChildDatalist(currentElement.fieldAttributeMasterId, isSaveDisabled, (!scanValue) ? currentElement.displayValue : scanValue, newArray, rowId, NEXT_FOCUS, null))
        } catch (error) {
            console.log(error)
        }
    }
}
export function setInitialArray(currentElement, formElement, jobStatusId, jobTransaction, arrayReverseDataStoreFilterMap, fieldAttributeMasterId) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_ARRAY_ISLOADING, true))
            const sequenceWiseRootFieldAttributes = await formLayoutService.getSequenceWiseRootFieldAttributes(jobStatusId, currentElement.fieldAttributeMasterId, jobTransaction)
            if (!formElement.get(currentElement.fieldAttributeMasterId).value || formElement.get(currentElement.fieldAttributeMasterId).value == '') {
                const arrayDTO = await arrayService.getSortedArrayChildElements(sequenceWiseRootFieldAttributes, jobTransaction, arrayReverseDataStoreFilterMap, fieldAttributeMasterId)
                if (!arrayDTO) return
                if (arrayDTO.errorMessage) {
                    throw new Error(arrayDTO.errorMessage)
                } else {
                    dispatch(setState(SET_ARRAY_CHILD_LIST, arrayDTO))
                    dispatch(setState(SET_ARRAY_DATA_STORE_FILTER_MAP, arrayDTO.arrayReverseDataStoreFilterMap))  // set formLayout state of arrayReverseDataStoreFilterMap which is avilable globally
                }
            } else {
                let arrayState = arrayService.setInitialArray(currentElement, formElement, sequenceWiseRootFieldAttributes)
                dispatch(setState(SET_ARRAY_CHILD_LIST, arrayState))
            }
        } catch (error) {
            dispatch(setState(SET_ERROR_MSG, error.message))
        }
    }
}