import { arrayService } from '../../services/classes/ArrayFieldAttribute'
import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface.js'
const {
    SET_ARRAY_CHILD_LIST,
    SET_NEW_ARRAY_ROW,
    SET_ARRAY_ELEMENTS,
    SET_SAVE_DISABLED,
    ON_BLUR,
  } = require('../../lib/constants').default
import { ARRAYSAROJFAREYE } from '../../lib/AttributeConstants'
import _ from 'lodash'
import { setState } from '../global/globalActions'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'

export function _setSaveDisabled(isSaveDisabled) {
    return {
        type: SET_SAVE_DISABLED,
        payload: isSaveDisabled
    }
}
export function getSortedArrayChildElements(fieldAttributeMasterId, jobStatusId, lastrowId, arrayElements) {
    return async function (dispatch) {
        try {
            const arrayDTO = await arrayService.getSortedArrayChildElements(jobStatusId, fieldAttributeMasterId, lastrowId, arrayElements)
            dispatch(setState(SET_ARRAY_CHILD_LIST, arrayDTO))
        } catch (error) {
            console.log(error)
        }
    }
}
export function addRowInArray(lastrowId, childElementsTemplate, arrayElements) {
    return async function (dispatch) {
        const newArrayRow = arrayService.addArrayRow(lastrowId, childElementsTemplate, arrayElements)
        dispatch(setState(SET_NEW_ARRAY_ROW, newArrayRow))
    }
}
export function deleteArrayRow(arrayElements, rowId, lastrowId, isSaveDisabled) {
    return async function (dispatch) {
        const newArrayElements = arrayService.deleteArrayRow(arrayElements, rowId, lastrowId, isSaveDisabled)
        dispatch(setState(SET_ARRAY_ELEMENTS, newArrayElements))
    }
}
export function getNextFocusableAndEditableElement(attributeMasterId, nextEditable, isSaveDisabled, value, arrayElements, rowId) {
    return async function (dispatch) {
        let cloneArrayElements = _.cloneDeep(arrayElements)
        let arrayRow = cloneArrayElements[rowId]
        let sortedArrayElements = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, arrayRow.formLayoutObject, nextEditable, isSaveDisabled, value, null, ON_BLUR);
        dispatch(setState(SET_ARRAY_ELEMENTS, {
            newArrayElements: cloneArrayElements,
            isSaveDisabled: sortedArrayElements.isSaveDisabled
        }))
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