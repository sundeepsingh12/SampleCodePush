'use strict'

const {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    DISABLE_SAVE,
    UPDATE_FIELD_DATA,
    STATUS_NAME,
    ON_BLUR,
    TOOGLE_HELP_TEXT,
    BASIC_INFO,
    IS_LOADING,
    Home,
    RESET_STATE,
    ERROR_MESSAGE,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA
} = require('../../lib/constants').default

import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface.js'
import { NavigationActions } from 'react-navigation'
import InitialState from './formLayoutInitialState.js'
import { setState } from '../global/globalActions'

export function _setFormList(sortedFormAttributesDto) {
    return {
        type: GET_SORTED_ROOT_FIELD_ATTRIBUTES,
        payload: sortedFormAttributesDto

    }
}

export function _setBasicInfo(statusId, statusName, jobTransactionId, latestPositionId) {
    return {
        type: BASIC_INFO,
        payload: {
            statusId,
            statusName,
            jobTransactionId,
            latestPositionId
        }

    }
}

export function _disableSave(isSaveDisabled) {
    return {
        type: DISABLE_SAVE,
        payload: isSaveDisabled
    }
}

export function _updateFieldData(updatedFieldData) {
    return {
        type: UPDATE_FIELD_DATA,
        payload: updatedFieldData
    }
}

export function _toogleHelpText(formLayout) {
    return {
        type: TOOGLE_HELP_TEXT,
        payload: formLayout
    }
}

export function _toogleLoader(loading) {
    return {
        type: IS_LOADING,
        payload: loading
    }
}

export function _setErrorMessage(message) {
    return {
        type: ERROR_MESSAGE,
        payload: message
    }
}

export function _setInitialState() {
    return {
        type: RESET_STATE
    }
}

export function getSortedRootFieldAttributes(statusId, statusName, jobTransactionId) {
    return async function (dispatch) {
        try {
            dispatch(_toogleLoader(true));
            const sortedFormAttributesDto = await formLayoutService.getSequenceWiseRootFieldAttributes(statusId)
            Object.keys(sortedFormAttributesDto.nextEditable).length == 0 ? sortedFormAttributesDto.isSaveDisabled = false : sortedFormAttributesDto.isSaveDisabled = true;
            dispatch(_setFormList(sortedFormAttributesDto));
            dispatch(_setBasicInfo(statusId, statusName, jobTransactionId, sortedFormAttributesDto.latestPositionId));
            dispatch(_toogleLoader(false));
        } catch (error) {
            dispatch(_toogleLoader(false));
            dispatch(_setErrorMessage(error));
        }
    }
}

export function getNextFocusableAndEditableElements(attributeMasterId, formElement, nextEditable, isSaveDisabled, value) {
    return async function (dispatch) {
        const cloneFormElement = new Map(formElement);
        const sortedFormAttributeDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, nextEditable, isSaveDisabled, value);
        dispatch(_setFormList(sortedFormAttributeDto));
        console.log("getNextFocusableAndEditableElements",value)
    }
}

export function disableSaveIfRequired(attributeMasterId, isSaveDisabled, formLayoutObject, value) {
    return async function (dispatch) {
        const saveDisabled = formLayoutEventsInterface.disableSaveIfRequired(attributeMasterId, isSaveDisabled, formLayoutObject, value)
        dispatch(_disableSave(saveDisabled));
    }
}

export function updateFieldData(attributeId, value, formElement) {
    return async function (dispatch) {
        const cloneFormElement = new Map(formElement);
        const updatedFieldData = formLayoutEventsInterface.updateFieldData(attributeId, value, cloneFormElement, ON_BLUR);
        dispatch(_updateFieldData(updatedFieldData));
    }
}

export function updateFieldDataWithChildData(attributeMasterId, formElement, nextEditable, isSaveDisabled, value, fieldDataListObject) {
    return function (dispatch) {
        const cloneFormElement = new Map(formElement);
        console.log('cloneFormElement', cloneFormElement);
        const updatedFieldDataObject = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, nextEditable, isSaveDisabled, value, fieldDataListObject.fieldDataList, ON_BLUR);
        dispatch(setState(UPDATE_FIELD_DATA_WITH_CHILD_DATA,
            {
                formElement: updatedFieldDataObject.formLayoutObject,
                latestPositionId: fieldDataListObject.latestPositionId,
                nextEditable: updatedFieldDataObject.nextEditable,
                isSaveDisabled: updatedFieldDataObject.isSaveDisabled
            }
        ));
    }
}

export function toogleHelpText(attributeId, formElement) {
    return async function (dispatch) {
        const cloneFormElement = new Map(formElement);
        const toogledHelpText = formLayoutEventsInterface.toogleHelpTextView(attributeId, cloneFormElement);
        dispatch(_toogleHelpText(toogledHelpText));
    }
}

export function saveJobTransaction(formElement, jobTransactionId, statusId) {
    return async function (dispatch) {
        dispatch(_toogleLoader(true));
        let cloneFormElement = new Map(formElement);
        await formLayoutEventsInterface.saveDataInDb(formElement, jobTransactionId, statusId);
        await formLayoutEventsInterface.addTransactionsToSyncList(jobTransactionId);
        dispatch(_toogleLoader(false));
        dispatch(_setInitialState());
        dispatch(NavigationActions.navigate({ routeName: Home }))

    }
}

export function fieldValidations(currentElement, formElement, timeOfExecution) {
    return function (dispatch) {
        // dispatch(runningValidation)
        fieldValidationService.fieldValidations(currentElement, formElement, timeOfExecution)
    }
}
