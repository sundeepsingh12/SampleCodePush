'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { checkBoxDataService } from '../../services/classes/CheckBoxService'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { CHECKBOX, RADIOBUTTON } from '../../lib/AttributeConstants'

// import { } from '../../services/classes/CheckBoxService'

const {
    FIELD_ATTRIBUTE_VALUE,
    SET_VALUE_IN_CHECKBOX,
    SET_OR_REMOVE_FROM_STATE_ARRAY,
    CHECKBOX_BUTTON_CLICKED,
} = require('../../lib/constants').default


export function actionDispatch(type, payload) {
    return {
        type: type,
        payload: payload
    }
}



export function setOrRemoveStates(checkBoxValues, id, attributeTypeId) {
    return async function (dispatch) {
        try {
            checkBoxValues = checkBoxDataService.setOrRemoveState(checkBoxValues, id, attributeTypeId)
            dispatch(actionDispatch(SET_OR_REMOVE_FROM_STATE_ARRAY, checkBoxValues))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}

export function checkBoxButtonDone(checkBoxValues, params, jobTransactionId, latestPositionId, isSaveDisabled, formElement, nextEditable) {
    return async function (dispatch) {
        try {
            checkBoxValues = checkBoxDataService.checkBoxDoneButtonClicked(checkBoxValues)
            await dispatch(actionDispatch(CHECKBOX_BUTTON_CLICKED, checkBoxValues))
            if(params.attributeTypeId == CHECKBOX){
            const fieldDataListData = await checkBoxDataService.prepareFieldDataForTransactionSavingInState(checkBoxValues, jobTransactionId, params.parentId, latestPositionId)
            console.log("fieldDataList", fieldDataListData)
            //LatestpositionId and change form layout state
            console.log("paramss", params)

            dispatch(updateFieldDataWithChildData(params.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, "ArraySarojFareye", fieldDataListData))
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
            const wholeDataFromMaster = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE)
            console.log("wholeDataFromMaster", wholeDataFromMaster)
            const checkBoxDataList = await checkBoxDataService.getcheckBoxDataList(wholeDataFromMaster.value, fieldAttributeMasterId)
            dispatch(actionDispatch(SET_VALUE_IN_CHECKBOX, checkBoxDataList))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
            console.log('checkBoxAction getcheckboxdata')
        }
    }
}