'use strict'

import {
    FIELD_ATTRIBUTE,
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
    JOB_STATUS,
    SaveActivated,
    Transient,
    CheckoutDetails,
    UPDATE_FIELD_DATA_VALIDATION,
    NEXT_FOCUS
} from '../../lib/constants'

import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface.js'
import { NavigationActions } from 'react-navigation'
import InitialState from './formLayoutInitialState.js'
import { fieldValidationService } from '../../services/classes/FieldValidation'
import { setState ,navigateToScene} from '../global/globalActions'
import { transientStatusService } from '../../services/classes/TransientStatusService'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import _ from 'lodash'

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
            dispatch(setState(IS_LOADING, true))
            const sortedFormAttributesDto = await formLayoutService.getSequenceWiseRootFieldAttributes(statusId)
            dispatch(setState(GET_SORTED_ROOT_FIELD_ATTRIBUTES, sortedFormAttributesDto))
            dispatch(setState(BASIC_INFO, {
                statusId,
                statusName,
                jobTransactionId,
                latestPositionId: sortedFormAttributesDto.latestPositionId
            }))
            dispatch(setState(IS_LOADING, false))
        } catch (error) {
            console.log(error)
            dispatch(setState(IS_LOADING, false))
            dispatch(_setErrorMessage(error))
        }
    }
}

export function getNextFocusableAndEditableElements(attributeMasterId, formElement, isSaveDisabled, value, event) {
    return async function (dispatch) {
        const cloneFormElement = _.cloneDeep(formElement)
        const sortedFormAttributeDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, isSaveDisabled, value, null, event);
        dispatch(setState(GET_SORTED_ROOT_FIELD_ATTRIBUTES, sortedFormAttributeDto))
    }
}
export function setSequenceDataAndNextFocus(attributeMasterId, formElement, isSaveDisabled, sequenceId) {
    return async function (dispatch) {
        try {
            const sequenceData = await formLayoutEventsInterface.getSequenceData(sequenceId)
            if (sequenceData) {
                const cloneFormElement = _.cloneDeep(formElement)
                let sortedFormAttributeDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, isSaveDisabled, sequenceData, null, ON_BLUR);
                sortedFormAttributeDto.formLayoutObject.get(attributeMasterId).isLoading = false;
                dispatch(_setFormList(sortedFormAttributeDto))
            }
        } catch (error) {
            formElement.get(attributeMasterId).isLoading = false
            dispatch(_setErrorMessage(error.message))
            dispatch(setState(UPDATE_FIELD_DATA, formElement))
            dispatch(_setErrorMessage(''))
        }
    }
}

export function disableSaveIfRequired(attributeMasterId, isSaveDisabled, formLayoutObject, value) {
    return async function (dispatch) {
        const saveDisabled = formLayoutEventsInterface.disableSaveIfRequired(attributeMasterId, isSaveDisabled, formLayoutObject, value)
        dispatch(setState(DISABLE_SAVE, saveDisabled))
    }
}

export function updateFieldData(attributeId, value, formElement) {
    return async function (dispatch) {
        const cloneFormElement = _.cloneDeep(formElement)
        const updatedFieldData = formLayoutEventsInterface.updateFieldData(attributeId, value, cloneFormElement, NEXT_FOCUS)
        dispatch(setState(UPDATE_FIELD_DATA, updatedFieldData))
    }
}

export function updateFieldDataWithChildData(attributeMasterId, formElement, isSaveDisabled, value, fieldDataListObject) {
    return function (dispatch) {
        const cloneFormElement = _.cloneDeep(formElement)
        const updatedFieldDataObject = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, isSaveDisabled, value, fieldDataListObject.fieldDataList, NEXT_FOCUS);
        dispatch(setState(UPDATE_FIELD_DATA_WITH_CHILD_DATA,
            {
                formElement: updatedFieldDataObject.formLayoutObject,
                latestPositionId: fieldDataListObject.latestPositionId,
                isSaveDisabled: updatedFieldDataObject.isSaveDisabled
            }
        ))
    }
}

export function toogleHelpText(attributeId, formElement) {
    return async function (dispatch) {
        const cloneFormElement = _.cloneDeep(formElement)
        const toogledHelpText = formLayoutEventsInterface.toogleHelpTextView(attributeId, cloneFormElement)
        dispatch(setState(TOOGLE_HELP_TEXT, toogledHelpText))
    }
}

export function saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated) {
    return async function (dispatch) {
        let routeName, routeParam
        dispatch(setState(IS_LOADING, true))
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
        const currentStatus = await transientStatusService.getCurrentStatus(statusList, formLayoutState.statusId, jobMasterId)
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
            routeParam = { commonData: previousStatusSaveActivated.commonData.commonData, recurringData: previousStatusSaveActivated.recurringData, totalAmount, signOfData: elementsArray, jobMasterId }
            let formLayoutObject = formLayoutState.formElement
            if (navigationFormLayoutStates) {
                formLayoutObject = await formLayoutService.concatFormElementForTransientStatus(navigationFormLayoutStates, formLayoutState.formElement)
            }
            await transientStatusService.saveDataInDbAndAddTransactionsToSyncList(formLayoutObject, previousStatusSaveActivated.recurringData, jobMasterId, formLayoutState.statusId, true)
        }
        else if (currentStatus.transient) {
            routeName = Transient
            routeParam = { currentStatus, formLayoutState, contactData, jobTransaction, jobMasterId, }
        }
        else {
            routeName = HomeTabNavigatorScreen
            routeParam = {}
            await dispatch(saveDataAndAddToSyncList(formLayoutState, navigationFormLayoutStates, jobMasterId))
            dispatch(setState(RESET_STATE))
        }
        dispatch(setState(IS_LOADING, false))
        dispatch(navigateToScene(routeName, routeParam))
    }
}

export function saveDataAndAddToSyncList(formLayoutState, navigationFormLayoutStates, jobMasterId) {
    return async function (dispatch) {
        try {
            let formLayoutObject = formLayoutState.formElement
            if (navigationFormLayoutStates) {
                formLayoutObject = await formLayoutService.concatFormElementForTransientStatus(navigationFormLayoutStates, formLayoutState.formElement)
            }
            let jobTransactionList = await formLayoutEventsInterface.saveDataInDb(formLayoutObject, formLayoutState.jobTransactionId, formLayoutState.statusId, jobMasterId)
            await formLayoutEventsInterface.addTransactionsToSyncList(jobTransactionList)
        } catch (error) {
            console.log(error)
        }
    }
}

export function fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction, isSaveDisabled) {
    return async function (dispatch) {
        let cloneFormElement = _.cloneDeep(formElement)
        let validationsResult = fieldValidationService.fieldValidations(currentElement, cloneFormElement, timeOfExecution, jobTransaction)
        dispatch(getNextFocusableAndEditableElements(currentElement.fieldAttributeMasterId, cloneFormElement, isSaveDisabled, cloneFormElement.get(currentElement.fieldAttributeMasterId).value, NEXT_FOCUS))
    }
}
