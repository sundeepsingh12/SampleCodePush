'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { selectFromListDataService } from '../../services/classes/selectFromListService'
import { updateFieldDataWithChildData, getNextFocusableAndEditableElements, updateFieldData } from '../form-layout/formLayoutActions'
import { CHECKBOX, RADIOBUTTON, ARRAYSAROJFAREYE } from '../../lib/AttributeConstants'
import { fieldDataService } from '../../services/classes/FieldData'

const {
    FIELD_ATTRIBUTE_VALUE,
    SET_VALUE_IN_CHECKBOX,
} = require('../../lib/constants').default


export function actionDispatch(payload) {
    return {
        type: SET_VALUE_IN_CHECKBOX,
        payload: payload
    }
}



export function setOrRemoveStates(checkBoxValues, id, attributeTypeId) {
    return async function (dispatch) {
        try {
            checkBoxValues = selectFromListDataService.setOrRemoveState(checkBoxValues, id, attributeTypeId)
            dispatch(actionDispatch(checkBoxValues))
        } catch (error) {
            console.log(error)
        }
    }
}

export function checkBoxButtonDone(checkBoxValues, params, jobTransactionId, latestPositionId, isSaveDisabled, formElement, nextEditable) {
    return async function (dispatch) {
        try {
            checkBoxValues = selectFromListDataService.checkBoxDoneButtonClicked(params.attributeTypeId,checkBoxValues)
            await dispatch(actionDispatch(Object.values(checkBoxValues)))
            if (params.attributeTypeId == CHECKBOX) {
                const fieldDataListData = await fieldDataService.prepareFieldDataForTransactionSavingInState(checkBoxValues, jobTransactionId, params.positionId, latestPositionId)
                console.log("fieldDataList", fieldDataListData)

                dispatch(updateFieldDataWithChildData(params.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, ARRAYSAROJFAREYE, fieldDataListData))
            } else {
                console.log("getNextFocusableAndEditableElementssss", checkBoxValues[0].code)
                dispatch(getNextFocusableAndEditableElements(params.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, checkBoxValues[0].code))
                dispatch(updateFieldData(params.fieldAttributeMasterId, checkBoxValues[0].code, formElement));
            }
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}


export function getCheckBoxData(fieldAttributeMasterId) {
    console.log("entered getcheckboxdata")
    return async function (dispatch) {
        try {
            const fieldAttributeValueList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE)
            console.log("fieldAttributeValueList", fieldAttributeValueList)
            const checkBoxDataList = await selectFromListDataService.getcheckBoxDataList(fieldAttributeValueList.value, fieldAttributeMasterId)
            dispatch(actionDispatch(checkBoxDataList))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
            console.log('checkBoxAction getcheckboxdata')
        }
    }
}