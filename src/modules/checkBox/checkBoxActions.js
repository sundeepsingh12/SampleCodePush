'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { checkBoxDataLists } from '../../services/classes/CheckBoxService'

// import { } from '../../services/classes/CheckBoxService'

const {
    FIELD_ATTRIBUTE_VALUE,
    SET_VALUE_IN_CHECKBOX,
    SET_OR_REMOVE_FROM_STATE_ARRAY,
    CHECKBOX_BUTTON_CLICKED,
} = require('../../lib/constants').default


export function actionDispatch(type,payload) {
    return {
        type: type,
        payload: payload
    }
}



export function setOrRemoveStates(checkBoxValues,id){
     return async function (dispatch) {
        try {
            checkBoxValues =  checkBoxDataLists.setOrRemoveState(checkBoxValues,id)
            dispatch(actionDispatch(SET_OR_REMOVE_FROM_STATE_ARRAY,checkBoxValues))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}

export function checkBoxButtonDone(checkBoxValues){
     return async function (dispatch) {
        try {
            checkBoxValues =  checkBoxDataLists.checkBoxDoneButtonClicked(checkBoxValues)
            dispatch(actionDispatch(CHECKBOX_BUTTON_CLICKED,checkBoxValues))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}


export function getCheckBoxData() {
    console.log("entered getcheckboxdata")
    return async function (dispatch) {
        try {
            const wholeData = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE)
            console.log("wholeData")
            const checkBoxDataList = await checkBoxDataLists.getcheckBoxDataList(wholeData.value, '43159')
            dispatch(actionDispatch(SET_VALUE_IN_CHECKBOX,checkBoxDataList))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
            console.log('checkBoxAction getcheckboxdata')
        }
    }
}