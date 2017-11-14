'use strict'
import { arrayService } from '../../services/classes/ArrayFieldAttribute'
import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import {
    SET_ARRAY_CHILD_LIST,
    SET_NEW_ARRAY_ROW,
    SET_ARRAY_ELEMENTS,
    SET_ERROR_MSG,
    ON_BLUR,
} from '../../lib/constants'
import { ARRAYSAROJFAREYE } from '../../lib/AttributeConstants'
import _ from 'lodash'
import { setState } from '../global/globalActions'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'

export function getSortedArrayChildElements(fieldAttributeMasterId, jobStatusId, lastrowId, arrayElements) {
    return async function (dispatch) {
        try {
            const sequenceWiseRootFieldAttributes = await formLayoutService.getSequenceWiseRootFieldAttributes(jobStatusId, fieldAttributeMasterId)
            const arrayDTO = await arrayService.getSortedArrayChildElements(lastrowId, arrayElements, sequenceWiseRootFieldAttributes)
            if (!arrayDTO) {
                dispatch(setState(SET_ERROR_MSG), false)
            } else {
                dispatch(setState(SET_ARRAY_CHILD_LIST, arrayDTO))
            }
        } catch (error) {
            console.log(error)
        }
    }
}
export function addRowInArray(lastrowId, childElementsTemplate, arrayElements) {
    return async function (dispatch) {//comment discuss this
        const newArrayRow = arrayService.addArrayRow(lastrowId, childElementsTemplate, arrayElements)
        dispatch(setState(SET_NEW_ARRAY_ROW, newArrayRow))
    }
}
export function deleteArrayRow(arrayElements, rowId, lastrowId) {
    return async function (dispatch) { //comment discuss this
        let newArrayElements = arrayService.deleteArrayRow(arrayElements, rowId, lastrowId)
        let isSaveDisabled = arrayService.enableSaveIfRequired(newArrayElements)
        dispatch(setState(SET_ARRAY_ELEMENTS, {
            newArrayElements,
            isSaveDisabled
        }))
    }
}
export function getNextFocusableAndEditableElement(attributeMasterId, nextEditable, isSaveDisabled, value, arrayElements, rowId) {
    return async function (dispatch) {
        let newArrayElements = arrayService.findNextEditableAndSetSaveDisabled(attributeMasterId, arrayElements, nextEditable, isSaveDisabled, rowId, value)
        dispatch(setState(SET_ARRAY_ELEMENTS, newArrayElements))
    }
}

export function saveArray(arrayElements, arrayParentItem, jobTransactionId, latestPositionId, formElement, nextEditable, isSaveDisabled) {
    return async function (dispatch) {
        if (!_.isEmpty(arrayElements)) {
            let fieldDataListWithLatestPositionId = await arrayService.prepareArrayForSaving(arrayElements, arrayParentItem, jobTransactionId, latestPositionId)
            dispatch(updateFieldDataWithChildData(arrayParentItem.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, ARRAYSAROJFAREYE, fieldDataListWithLatestPositionId))
        }
    }
}