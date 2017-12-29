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
    ERROR_MESSAGE,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA,
    JOB_STATUS,
    UPDATE_FIELD_DATA_VALIDATION,
    NEXT_FOCUS,
    TabScreen,
    HomeTabNavigatorScreen,
    CLEAR_FORM_LAYOUT,
    SET_FORM_LAYOUT_STATE,
    SET_UPDATE_DRAFT
} from '../../lib/constants'

import {
    AFTER,
    Start
} from '../../lib/AttributeConstants'

import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface.js'
import { NavigationActions } from 'react-navigation'
import InitialState from './formLayoutInitialState.js'
import { fieldValidationService } from '../../services/classes/FieldValidation'
import { setState, navigateToScene } from '../global/globalActions'
import { transientStatusService } from '../../services/classes/TransientStatusService'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobStatusService } from '../../services/classes/JobStatus'

import _ from 'lodash'
import { performSyncService } from '../home/homeActions'
import { draftService } from '../../services/classes/DraftService'
import { dataStoreService } from '../../services/classes/DataStoreService'
import { UNIQUE_VALIDATION_FAILED } from '../../lib/ContainerConstants'

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

export function getSortedRootFieldAttributes(statusId, statusName, jobTransactionId, jobMasterId) {
    return async function (dispatch) {
        try {
            dispatch(setState(IS_LOADING, true))
            const sortedFormAttributesDto = await formLayoutService.getSequenceWiseRootFieldAttributes(statusId)
            const draftStatusId = (jobTransactionId < 0) ? draftService.checkIfDraftExistsAndGetStatusId(jobTransactionId, jobMasterId, statusId) : null
            dispatch(setState(GET_SORTED_ROOT_FIELD_ATTRIBUTES, sortedFormAttributesDto))
            dispatch(setState(BASIC_INFO, {
                statusId,
                statusName,
                jobTransactionId,
                latestPositionId: sortedFormAttributesDto.latestPositionId,
                draftStatusId
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
        dispatch(setState(SET_UPDATE_DRAFT, true))
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
        const updatedFieldData = formLayoutEventsInterface.updateFieldData(attributeId, value, cloneFormElement)
        dispatch(setState(UPDATE_FIELD_DATA, updatedFieldData))
    }
}

export function updateFieldDataWithChildData(attributeMasterId, formElement, isSaveDisabled, value, fieldDataListObject) {
    return function (dispatch) {
        const cloneFormElement = _.cloneDeep(formElement)
        console.log('fieldDataListObject', fieldDataListObject)
        cloneFormElement.get(attributeMasterId).value = value
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

export function saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, jobTransactionIdList, pieChart) {
    return async function (dispatch) {
        dispatch(setState(IS_LOADING, true))
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
        let { routeName, routeParam } = await formLayoutService.saveAndNavigate(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, statusList, jobTransactionIdList)
        dispatch(setState(IS_LOADING, false))
        let landingId = (Start.landingTab) ? jobStatusService.getTabIdOnStatusId(statusList.value, formLayoutState.statusId) : false
        if (routeName == TabScreen) {
            dispatch(NavigationActions.reset({
                index: 1,
                actions: [
                    NavigationActions.navigate({ routeName: HomeTabNavigatorScreen }),
                    NavigationActions.navigate({ routeName: TabScreen, params: { loadTabScreen: true, landingTab: landingId } })
                ]
            }))
        } else {
            dispatch(navigateToScene(routeName, routeParam))
        }
        dispatch(performSyncService(pieChart))
        dispatch(setState(CLEAR_FORM_LAYOUT))
    }
}

export function fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction, isSaveDisabled) {
    return async function (dispatch) {
        let cloneFormElement = _.cloneDeep(formElement)
        let validationsResult = fieldValidationService.fieldValidations(currentElement, cloneFormElement, timeOfExecution, jobTransaction)
        if (timeOfExecution == AFTER) {
            cloneFormElement.get(currentElement.fieldAttributeMasterId).value = validationsResult ? cloneFormElement.get(currentElement.fieldAttributeMasterId).displayValue : null
        }
        dispatch(getNextFocusableAndEditableElements(currentElement.fieldAttributeMasterId, cloneFormElement, isSaveDisabled, cloneFormElement.get(currentElement.fieldAttributeMasterId).displayValue, NEXT_FOCUS))
    }
}

export function saveDraftInDb(formLayoutState, jobMasterId) {
    return async function (dispatch) {
        draftService.saveDraftInDb(formLayoutState, jobMasterId)
    }
}

export function restoreDraft(jobTransactionId, statusId, jobMasterId) {
    return async function (dispatch) {
        let formLayoutState = draftService.restoreDraftFromDb(jobTransactionId, statusId, jobMasterId)
        dispatch(setState(SET_FORM_LAYOUT_STATE, formLayoutState))
    }
}

export function restoreDraftOrRedirectToFormLayout(editableFormLayoutState, isDraftRestore, statusId, statusName, jobTransactionId, jobMasterId) {
    return async function (dispatch) {
        if (isDraftRestore) {
            dispatch(restoreDraft(jobTransactionId, statusId))
        } else {
            if (editableFormLayoutState) {
                dispatch(setState(SET_FORM_LAYOUT_STATE, editableFormLayoutState))
            }
            else {
                dispatch(getSortedRootFieldAttributes(statusId, statusName, jobTransactionId, jobMasterId))
            }
        }
    }
}

export function checkUniqueValidationThenSave(fieldAtrribute, formElement, isSaveDisabled, value, latestPositionId, jobTransaction) {
    return async function (dispatch) {
        try {
            let isValuePresentInAnotherTransaction = await dataStoreService.checkForUniqueValidation(value, fieldAtrribute.fieldAttributeMasterId)
            if (isValuePresentInAnotherTransaction) {
                formElement.get(fieldAtrribute.fieldAttributeMasterId).alertMessage = UNIQUE_VALIDATION_FAILED
            } else {
                formElement.get(fieldAtrribute.fieldAttributeMasterId).alertMessage = ''
            }
            dispatch(updateFieldDataWithChildData(fieldAtrribute.fieldAttributeMasterId, formElement, isSaveDisabled, value, latestPositionId, jobTransaction))
        }
        catch (error) {
            console.log(error)
        }
    }
}