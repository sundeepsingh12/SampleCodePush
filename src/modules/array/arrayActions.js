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
import { ARRAY_SAROJ_FAREYE, AFTER, TEXT, STRING, SCAN_OR_TEXT, QR_SCAN, NUMBER } from '../../lib/AttributeConstants'
import _ from 'lodash'
import { StackActions } from 'react-navigation'
import { navDispatch } from '../navigators/NavigationService'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { fieldValidationService } from '../../services/classes/FieldValidation'
import { DELETE_ROW_ERROR, ADD_ROW_ERROR, SAVE_ARRAY_ERROR, UNIQUE_VALIDATION_FAILED_FORMLAYOUT, ADD_TOAST } from '../../lib/ContainerConstants'
import { Toast } from 'native-base'

export function showOrDropModal(arrayElements, rowId, idToSet, isSaveDisabled) {
    return async function (dispatch) {
        try {
            let newArray = _.cloneDeep(arrayElements)
            newArray[rowId].modalFieldAttributeMasterId = idToSet
            dispatch(setState(SET_ARRAY_ELEMENTS, { newArrayElements: newArray, isSaveDisabled }))
        } catch (error) {
            showToastAndAddUserExceptionLog(101, error.message, 'danger', 1)
        }
    }
}
export function addRowInArray(lastrowId, childElementsTemplate, arrayElements, jobTransaction, isSaveDisabled, sequenceWiseMasterIds) {
    return async function (dispatch) {
        try {
            const newArrayRow = arrayService.addArrayRow(lastrowId, childElementsTemplate, arrayElements, jobTransaction, isSaveDisabled, sequenceWiseMasterIds)
            if (!newArrayRow) throw new Error(ADD_ROW_ERROR)
            dispatch(setState(SET_NEW_ARRAY_ROW, newArrayRow))
        } catch (error) {
            showToastAndAddUserExceptionLog(102, error.message, 'danger', 1)
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
            showToastAndAddUserExceptionLog(103, error.message, 'danger', 1)
        }
    }
}

export function getNextFocusableAndEditableElement(attributeMasterId, isSaveDisabled, value, arrayElements, rowId, fieldDataList, event, backPressOrModalPresent, containerValue, formLayoutState) {
    return async function (dispatch) {
        try {
            let cloneArrayElements = _.cloneDeep(arrayElements)
            let arrayRow = cloneArrayElements[rowId]
            arrayRow.formLayoutObject[attributeMasterId].displayValue = value
            arrayRow.formLayoutObject[attributeMasterId].childDataList = fieldDataList
            let validationsResult = fieldValidationService.fieldValidations(arrayRow.formLayoutObject[attributeMasterId], arrayRow.formLayoutObject, AFTER, null, formLayoutState.fieldAttributeMasterParentIdMap, formLayoutState.jobAndFieldAttributesList)
            arrayRow.formLayoutObject[attributeMasterId].value = (validationsResult) ? arrayRow.formLayoutObject[attributeMasterId].displayValue : null
            arrayRow.formLayoutObject[attributeMasterId].containerValue = (validationsResult) ? containerValue : null
            arrayRow.modalFieldAttributeMasterId = (validationsResult) ? null : (backPressOrModalPresent == 2) ? attributeMasterId : null
            let newArrayElements = arrayService.findNextEditableAndSetSaveDisabled(attributeMasterId, cloneArrayElements, isSaveDisabled, rowId, (validationsResult) ? value : null, (validationsResult) ? fieldDataList : null, event, formLayoutState.fieldAttributeMasterParentIdMap, formLayoutState.sequenceWiseMasterIds)
            dispatch(setState(SET_ARRAY_ELEMENTS, newArrayElements))
            if (validationsResult && backPressOrModalPresent == 1) {
                navDispatch(StackActions.pop())
            }
            if (!validationsResult && arrayRow.formLayoutObject[attributeMasterId].alertMessage) {
                if (backPressOrModalPresent == 2) {
                    dispatch(setState(SET_OPTION_ATTRIBUTE_ERROR, { error: arrayRow.formLayoutObject[attributeMasterId].alertMessage }))
                } else {
                    Toast.show({ text: arrayRow.formLayoutObject[attributeMasterId].alertMessage, position: 'bottom', buttonText: 'OK', duration: 5000 })
                }
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(104, error.message, 'danger', 1)
        }
    }
}
export function getNextFocusableForArrayWithoutChildDatalist(attributeMasterId, isSaveDisabled, value, arrayElements, rowId, event, formLayoutState) {
    return async function (dispatch) {
        try {
            let cloneArrayElements = _.cloneDeep(arrayElements)
            let newArrayElements = arrayService.findNextEditableAndSetSaveDisabled(attributeMasterId, cloneArrayElements, isSaveDisabled, rowId, value, null, event, formLayoutState.fieldAttributeMasterParentIdMap, formLayoutState.sequenceWiseMasterIds)
            if (!newArrayElements) throw new Error(DELETE_ROW_ERROR)
            dispatch(setState(SET_ARRAY_ELEMENTS, newArrayElements))
        } catch (error) {
            showToastAndAddUserExceptionLog(105, error.message, 'danger', 1)
        }
    }
}
export function saveArray(arrayElements, arrayParentItem, jobTransaction, formLayoutState, arrayMainObject, arrayReverseDataStoreFilterMap) {
    return async function (dispatch) {
        try {
            if (!_.isEmpty(arrayElements)) {
                let fieldDataListSaveDisabled = await arrayService.prepareArrayForSaving(arrayElements, arrayParentItem, jobTransaction, formLayoutState.latestPositionId, arrayMainObject)
                if (!fieldDataListSaveDisabled) throw new Error(SAVE_ARRAY_ERROR)
                if (fieldDataListSaveDisabled.isSaveDisabled) {
                    dispatch(setState(SET_ARRAY_ELEMENTS, { newArrayElements: arrayElements, isSaveDisabled: fieldDataListSaveDisabled.isSaveDisabled }))
                    Toast.show({ text: ADD_TOAST, position: 'bottom', buttonText: 'OK', duration: 5000 })
                } else {
                    formLayoutState.arrayReverseDataStoreFilterMap = arrayReverseDataStoreFilterMap
                    dispatch(updateFieldDataWithChildData(arrayParentItem.fieldAttributeMasterId, formLayoutState, ARRAY_SAROJ_FAREYE, fieldDataListSaveDisabled.fieldDataListWithLatestPositionId, jobTransaction))
                    dispatch(setState(CLEAR_ARRAY_STATE))
                }
            } else {
                formLayoutState.arrayReverseDataStoreFilterMap = arrayReverseDataStoreFilterMap
                dispatch(updateFieldDataWithChildData(arrayParentItem.fieldAttributeMasterId, formLayoutState, '', { latestPositionId: formLayoutState.latestPositionId }, jobTransaction))
                dispatch(setState(CLEAR_ARRAY_STATE))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(106, error.message, 'danger', 1)
        }
    }
}

export function clearArrayState() {
    return async function (dispatch) {
        try {
            dispatch(setState(CLEAR_ARRAY_STATE))
        } catch (error) {
            showToastAndAddUserExceptionLog(107, error.message, 'danger', 1)
        }
    }
}

export function fieldValidationsArray(currentElement, arrayElements, timeOfExecution, jobTransaction, rowId, isSaveDisabled, scanValue, formLayoutState) {
    return function (dispatch) {
        try {
            let newArray = _.cloneDeep(arrayElements)
            let formElement = newArray[rowId].formLayoutObject
            let isValuePresentInAnotherTransaction = false
            let validationsResult = fieldValidationService.fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap, formLayoutState.jobAndFieldAttributesList)
            if (timeOfExecution == AFTER) {
                if (scanValue) {
                    formElement[currentElement.fieldAttributeMasterId].displayValue = currentElement.displayValue = scanValue
                }
                isValuePresentInAnotherTransaction = (currentElement.attributeTypeId == TEXT || currentElement.attributeTypeId == SCAN_OR_TEXT || currentElement.attributeTypeId == STRING || currentElement.attributeTypeId == QR_SCAN || currentElement.attributeTypeId == NUMBER) ? arrayService.checkforUniqueValidation(currentElement, newArray, rowId) : false
                formElement[currentElement.fieldAttributeMasterId].value = validationsResult && !isValuePresentInAnotherTransaction ? formElement[currentElement.fieldAttributeMasterId].displayValue : null
            }
            if (isValuePresentInAnotherTransaction) {
                formElement[currentElement.fieldAttributeMasterId].alertMessage = UNIQUE_VALIDATION_FAILED_FORMLAYOUT
            }
            dispatch(getNextFocusableForArrayWithoutChildDatalist(currentElement.fieldAttributeMasterId, isSaveDisabled, (!scanValue) ? currentElement.displayValue : scanValue, newArray, rowId, NEXT_FOCUS, formLayoutState))
        } catch (error) {
            showToastAndAddUserExceptionLog(108, error.message, 'danger', 1)
        }
    }
}
export function setInitialArray(currentElement, formLayoutState, jobTransaction, arrayReverseDataStoreFilterMap) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_ARRAY_ISLOADING, true))
            const sequenceWiseRootFieldAttributes = await formLayoutService.getSequenceWiseRootFieldAttributes(formLayoutState.statusId, currentElement.fieldAttributeMasterId, jobTransaction)
            const sequenceWiseSortedFieldAttributesMasterIds = sequenceWiseRootFieldAttributes.sequenceWiseSortedFieldAttributesMasterIds
            if (!formLayoutState.formElement[currentElement.fieldAttributeMasterId].value || formLayoutState.formElement[currentElement.fieldAttributeMasterId].value == '') {
                const arrayDTO = await arrayService.getSortedArrayChildElements(sequenceWiseRootFieldAttributes, jobTransaction, arrayReverseDataStoreFilterMap, currentElement.fieldAttributeMasterId)
                if (!arrayDTO) return
                if (arrayDTO.errorMessage) {
                    dispatch(setState(SET_ERROR_MSG, arrayDTO.errorMessage))
                } else {
                    arrayDTO.sequenceWiseMasterIds = sequenceWiseSortedFieldAttributesMasterIds
                    dispatch(setState(SET_ARRAY_CHILD_LIST, arrayDTO))
                    dispatch(setState(SET_ARRAY_DATA_STORE_FILTER_MAP, arrayDTO.arrayReverseDataStoreFilterMap))  // set formLayout state of arrayReverseDataStoreFilterMap which is avilable globally
                }
            } else {
                let arrayState = arrayService.setInitialArray(currentElement, formLayoutState.formElement, sequenceWiseRootFieldAttributes)
                arrayState.sequenceWiseMasterIds = sequenceWiseSortedFieldAttributesMasterIds
                dispatch(setState(SET_ARRAY_CHILD_LIST, arrayState))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(109, error.message, 'danger', 1)
            dispatch(setState(SET_ARRAY_ISLOADING, false))
        }
    }
}