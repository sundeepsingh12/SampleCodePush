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
    UPDATE_FIELD_DATA_WITH_CHILD_DATA,
    JOB_STATUS,
    SaveActivated,
    Transient,
    CheckoutDetails
} = require('../../lib/constants').default

import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface.js'
import { NavigationActions } from 'react-navigation'
import InitialState from './formLayoutInitialState.js'
import { setState } from '../global/globalActions'
import { transientStatusService } from '../../services/classes/TransientStatusService'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { navigateToScene } from '../../modules/global/globalActions'

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

export function getNextFocusableAndEditableElements(attributeMasterId, formElement, nextEditable, isSaveDisabled, value, event) {
    return async function (dispatch) {
        const cloneFormElement = new Map(formElement);
        const sortedFormAttributeDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, nextEditable, isSaveDisabled, value, null, event);
        dispatch(_setFormList(sortedFormAttributeDto));
        console.log("getNextFocusableAndEditableElements",value)
    }
}
export function setSequenceDataAndNextFocus(attributeMasterId, formElement, nextEditable, isSaveDisabled, sequenceId) {
    return async function (dispatch) {
        try{
            const sequenceData = await formLayoutEventsInterface.getSequenceData(sequenceId)
            if( sequenceData ){
                const cloneFormElement = new Map(formElement);
                let sortedFormAttributeDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, nextEditable, isSaveDisabled, sequenceData,null,ON_BLUR);
                sortedFormAttributeDto.formLayoutObject.get(attributeMasterId).isLoading = false;
                dispatch(_setFormList(sortedFormAttributeDto));
                const nextEditableElement = nextEditable[attributeMasterId];
                if(nextEditableElement != null && nextEditableElement.length != 0){
                    nextEditableElement.forEach((nextElement) => {
                        if ((typeof (nextElement) == 'string')) {
                            nextElement = formElement.get(Number(nextElement.split('$$')[1]));
                            if(nextElement && !nextElement.value && nextElement.attributeTypeId == 62){
                                const newFormElement = new Map(sortedFormAttributeDto.formLayoutObject);
                                newFormElement.get(nextElement.fieldAttributeMasterId).isLoading = true;
                                dispatch(_updateFieldData(newFormElement))
                                dispatch(setSequenceDataAndNextFocus(nextElement.fieldAttributeMasterId, newFormElement, nextEditable,
                                    isSaveDisabled,nextElement.sequenceMasterId))
                            }
                        }
                    })
                }
            }
        }catch(error){
            formElement.get(attributeMasterId).isLoading = false;
            dispatch(_setErrorMessage(error.message));
            dispatch(_updateFieldData(formElement))
            dispatch(_setErrorMessage(''));
        }
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
        console.log('fieldDataListObject', fieldDataListObject);
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

export function saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated) {
    return async function (dispatch) {
        let routeName, routeParam
        dispatch(_toogleLoader(true))
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS);
        const currentStatus = await transientStatusService.getCurrentStatus(statusList, formLayoutState.statusId, jobMasterId);
        if (formLayoutState.jobTransactionId < 0 && currentStatus.saveActivated) {
            routeName = SaveActivated
            routeParam = {
                formLayoutState,
                contactData, currentStatus, jobTransaction, jobMasterId,
                navigationFormLayoutStates
            }
        } else if (formLayoutState.jobTransactionId < 0 && !_.isEmpty(previousStatusSaveActivated)) {
            let { elementsArray, amount } = await transientStatusService.getDataFromFormElement(formLayoutState.formElement)
            let totalAmount = await transientStatusService.calculateTotalAmount(previousStatusSaveActivated.commonData.amount, previousStatusSaveActivated.recurringData, amount)
            routeName = CheckoutDetails
            routeParam = { commonData: previousStatusSaveActivated.commonData.commonData, recurringData: previousStatusSaveActivated.recurringData, totalAmount, signOfData: elementsArray,jobMasterId }
            let formLayoutObject = formLayoutState.formElement
            if (navigationFormLayoutStates) {
                formLayoutObject = await formLayoutService.concatFormElementForTransientStatus(navigationFormLayoutStates, formLayoutState.formElement);
            }
            await transientStatusService.saveDataInDbAndAddTransactionsToSyncList(formLayoutObject, previousStatusSaveActivated.recurringData, jobMasterId, formLayoutState.statusId, true)
        }
        else if (currentStatus.transient) {
            routeName = Transient
            routeParam = { currentStatus, formLayoutState, contactData, jobTransaction, jobMasterId, }
        }
        else {
            routeName = Home
            routeParam = {}
            await dispatch(saveDataAndAddToSyncList(formLayoutState, navigationFormLayoutStates, jobMasterId))
            dispatch(_setInitialState());
        }
        dispatch(_toogleLoader(false));
        dispatch(navigateToScene(routeName, routeParam))
    }
}

export function saveDataAndAddToSyncList(formLayoutState, navigationFormLayoutStates, jobMasterId) {
    return async function (dispatch) {
        try {
            let formLayoutObject = formLayoutState.formElement
            if (navigationFormLayoutStates) {
                formLayoutObject = await formLayoutService.concatFormElementForTransientStatus(navigationFormLayoutStates, formLayoutState.formElement);
            }
            await formLayoutEventsInterface.saveDataInDb(formLayoutObject, formLayoutState.jobTransactionId, formLayoutState.statusId, jobMasterId);
            await formLayoutEventsInterface.addTransactionsToSyncList(formLayoutState.jobTransactionId);
        } catch (error) {
            console.log(error)
        }
    }
}

export function fieldValidations(currentElement, formElement, timeOfExecution) {
    return function (dispatch) {
        // dispatch(runningValidation)
        fieldValidationService.fieldValidations(currentElement, formElement, timeOfExecution)
    }
}
