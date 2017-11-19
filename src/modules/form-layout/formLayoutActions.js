'use strict'

import {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    DISABLE_SAVE,
    UPDATE_FIELD_DATA,
    STATUS_NAME,
    ON_BLUR,
    TOOGLE_HELP_TEXT,
    BASIC_INFO,
    IS_LOADING,
    HomeTabNavigatorScreen,
    RESET_STATE,
    ERROR_MESSAGE,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA,
    UPDATE_FIELD_DATA_VALIDATION,
    UPDATE_NEXT_EDITABLE
} from '../../lib/constants'

import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface.js'
import { NavigationActions } from 'react-navigation'
import InitialState from './formLayoutInitialState.js'
import { fieldValidationService } from '../../services/classes/FieldValidation'
import { setState } from '../global/globalActions'

export function _setFormList(sortedFormAttributesDto) {
    return {
        type: GET_SORTED_ROOT_FIELD_ATTRIBUTES,
        payload: sortedFormAttributesDto

    }
}

export function _setErrorMessage(message) {
    return {
        type: ERROR_MESSAGE,
        payload: message
    }
}

export function getSortedRootFieldAttributes(statusId, statusName, jobTransactionId) {
    return async function (dispatch) {
        try {
            dispatch(setState(IS_LOADING,true))
            const sortedFormAttributesDto = await formLayoutService.getSequenceWiseRootFieldAttributes(statusId)
            Object.keys(sortedFormAttributesDto.nextEditable).length == 0 ? sortedFormAttributesDto.isSaveDisabled = false : sortedFormAttributesDto.isSaveDisabled = true;
            dispatch(_setFormList(sortedFormAttributesDto))
            dispatch(setState(BASIC_INFO,{
                statusId,
                statusName,
                jobTransactionId,
                latestPositionId:sortedFormAttributesDto.latestPositionId
            }))
            dispatch(setState(IS_LOADING,false))
        } catch (error) {
            console.log(error)
             dispatch(setState(IS_LOADING,false))
            dispatch(_setErrorMessage(error))
        }
    }
}

export function getNextFocusableAndEditableElements(attributeMasterId, formElement, nextEditable, isSaveDisabled, value, event) {
    return async function (dispatch) {
        const cloneFormElement = new Map(formElement)
        const sortedFormAttributeDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, nextEditable, isSaveDisabled, value, null, event);
        dispatch(_setFormList(sortedFormAttributeDto))
    }
}
export function setSequenceDataAndNextFocus(attributeMasterId, formElement, nextEditable, isSaveDisabled,sequenceId) {
    return async function (dispatch) {
        try{
            const sequenceData = await formLayoutEventsInterface.getSequenceData(sequenceId)
            if( sequenceData ){
                const cloneFormElement = new Map(formElement);
                let sortedFormAttributeDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, nextEditable, isSaveDisabled, sequenceData,null,ON_BLUR);
                sortedFormAttributeDto.formLayoutObject.get(attributeMasterId).isLoading = false;
                dispatch(_setFormList(sortedFormAttributeDto))
                const nextEditableElement = nextEditable[attributeMasterId]
                if(nextEditableElement != null && nextEditableElement.length != 0){
                    nextEditableElement.forEach((nextElement) => {
                        if ((typeof (nextElement) == 'string')) {
                            nextElement = formElement.get(Number(nextElement.split('$$')[1]));
                            if(nextElement && !nextElement.value && nextElement.attributeTypeId == 62){
                                const newFormElement = new Map(sortedFormAttributeDto.formLayoutObject);
                                newFormElement.get(nextElement.fieldAttributeMasterId).isLoading = true;
                                    dispatch(setState(UPDATE_FIELD_DATA,newFormElement))
                                    dispatch(setSequenceDataAndNextFocus(nextElement.fieldAttributeMasterId, newFormElement, nextEditable, 
                                        isSaveDisabled,nextElement.sequenceMasterId))
                            }
                        }
                    })
                }
            }
        }catch(error){
            formElement.get(attributeMasterId).isLoading = false
            dispatch(_setErrorMessage(error.message))
            dispatch(setState(UPDATE_FIELD_DATA,formElement))
            dispatch(_setErrorMessage(''))
        }
    }
}

export function disableSaveIfRequired(attributeMasterId, isSaveDisabled, formLayoutObject, value) {
    return async function (dispatch) {
        const saveDisabled = formLayoutEventsInterface.disableSaveIfRequired(attributeMasterId, isSaveDisabled, formLayoutObject, value)
           dispatch(setState(DISABLE_SAVE,saveDisabled)) 
    }
}

export function updateFieldData(attributeId, value, formElement) {
    return async function (dispatch) {
        const cloneFormElement = new Map(formElement)
        const updatedFieldData = formLayoutEventsInterface.updateFieldData(attributeId, value, cloneFormElement, ON_BLUR)
        dispatch(setState(UPDATE_FIELD_DATA,updatedFieldData))
    }
}

export function updateFieldDataWithChildData(attributeMasterId, formElement, nextEditable, isSaveDisabled, value, fieldDataListObject) {
    return function (dispatch) {
        const cloneFormElement = new Map(formElement)
        console.log('cloneFormElement', cloneFormElement)
        console.log('fieldDataListObject', fieldDataListObject)      
        const updatedFieldDataObject = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, nextEditable, isSaveDisabled, value, fieldDataListObject.fieldDataList, ON_BLUR);
        dispatch(setState(UPDATE_FIELD_DATA_WITH_CHILD_DATA,
            {
                formElement: updatedFieldDataObject.formLayoutObject,
                latestPositionId: fieldDataListObject.latestPositionId,
                nextEditable: updatedFieldDataObject.nextEditable,
                isSaveDisabled: updatedFieldDataObject.isSaveDisabled
            }
        ))
    }
}

export function toogleHelpText(attributeId, formElement) {
    return async function (dispatch) {
        const cloneFormElement = new Map(formElement)
        const toogledHelpText = formLayoutEventsInterface.toogleHelpTextView(attributeId, cloneFormElement)
        dispatch(setState(TOOGLE_HELP_TEXT, toogledHelpText))
    }
}

export function saveJobTransaction(formElement, jobTransactionId, statusId, jobMasterId,jobTransactionIdList) {
    return async function (dispatch) {
        dispatch(setState(IS_LOADING,true))
        let cloneFormElement = new Map(formElement)
        await formLayoutEventsInterface.saveDataInDb(formElement, jobTransactionId, statusId, jobMasterId,jobTransactionIdList)
        await formLayoutEventsInterface.addTransactionsToSyncList(jobTransactionId,jobTransactionIdList)
        dispatch(setState(IS_LOADING, false))
        dispatch(setState(RESET_STATE))
        dispatch(NavigationActions.navigate({ routeName: HomeTabNavigatorScreen }))

    }
}

export function fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction) {
    return function (dispatch) {
        let alertMessageList = fieldValidationService.fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction)
        dispatch(setState(UPDATE_FIELD_DATA_VALIDATION, {
            formElement,
            message: alertMessageList[0]
        }))
    }
}
