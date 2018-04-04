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
    SET_UPDATE_DRAFT,
    CLEAR_BULK_STATE,
    SET_FORM_TO_INVALID,
    USER,
    AutoLogoutScreen,
    SET_OPTION_ATTRIBUTE_ERROR,
    SET_FORM_INVALID_AND_FORM_ELEMENT
} from '../../lib/constants'

import {
    AFTER,
    Start,
} from '../../lib/AttributeConstants'

import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface.js'
import { NavigationActions } from 'react-navigation'
import InitialState from './formLayoutInitialState.js'
import { fieldValidationService } from '../../services/classes/FieldValidation'
import { setState, navigateToScene, showToastAndAddUserExceptionLog } from '../global/globalActions'
import { transientStatusService } from '../../services/classes/TransientStatusService'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobStatusService } from '../../services/classes/JobStatus'

import _ from 'lodash'
import { performSyncService } from '../home/homeActions'
import { draftService } from '../../services/classes/DraftService'
import { dataStoreService } from '../../services/classes/DataStoreService'
import { UNIQUE_VALIDATION_FAILED_FORMLAYOUT } from '../../lib/ContainerConstants'
import moment from 'moment'
import getTheme from '../../../native-base-theme/components';
import platform from '../../../native-base-theme/variables/platform';
import styles from '../../themes/FeStyle'
import { Toast } from 'native-base'

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

export function getSortedRootFieldAttributes(statusId, statusName, jobTransactionId, jobMasterId, jobTransaction) {
    return async function (dispatch) {
        try {
            dispatch(setState(IS_LOADING, true))
            const sortedFormAttributesDto = await formLayoutService.getSequenceWiseRootFieldAttributes(statusId, null, jobTransaction)
            let latestPositionId = sortedFormAttributesDto.latestPositionId
            let fieldAttributeMasterParentIdMap = sortedFormAttributesDto.fieldAttributeMasterParentIdMap
            const draftStatusId = (jobTransactionId < 0) ? draftService.checkIfDraftExistsAndGetStatusId(jobTransactionId, jobMasterId, statusId) : null
            if (!draftStatusId) {
                sortedFormAttributesDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(null, sortedFormAttributesDto.formLayoutObject, sortedFormAttributesDto.isSaveDisabled, null, null, NEXT_FOCUS, jobTransaction, fieldAttributeMasterParentIdMap);
            }
            dispatch(setState(GET_SORTED_ROOT_FIELD_ATTRIBUTES, sortedFormAttributesDto))
            dispatch(setState(BASIC_INFO, {
                statusId,
                statusName,
                jobTransactionId,
                latestPositionId,
                draftStatusId,
                fieldAttributeMasterParentIdMap
            }))
            dispatch(setState(IS_LOADING, false))
        } catch (error) {
            showToastAndAddUserExceptionLog(1001, error.message, 'danger', 0)
            dispatch(setState(IS_LOADING, false))
            dispatch(_setErrorMessage(error))
        }
    }
}

export function getNextFocusableAndEditableElements(attributeMasterId, formElement, isSaveDisabled, value, event, jobTransaction, fieldAttributeMasterParentIdMap) {
    return async function (dispatch) {
        try {
            const cloneFormElement = _.cloneDeep(formElement)
            const sortedFormAttributeDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, isSaveDisabled, value, null, event, jobTransaction, fieldAttributeMasterParentIdMap);
            dispatch(setState(GET_SORTED_ROOT_FIELD_ATTRIBUTES, sortedFormAttributeDto))
            if (value) {
                dispatch(setState(SET_UPDATE_DRAFT, true))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1002, error.message, 'danger', 1)
        }
    }
}
export function setSequenceDataAndNextFocus(attributeMasterId, formElement, isSaveDisabled, sequenceId, jobTransaction, fieldAttributeMasterParentIdMap) {
    return async function (dispatch) {
        try {
            formElement.get(attributeMasterId).isLoading = true
            dispatch(setState(UPDATE_FIELD_DATA, formElement))
            const sequenceData = await formLayoutEventsInterface.getSequenceData(sequenceId)
            if (sequenceData) {
                const cloneFormElement = _.cloneDeep(formElement)
                let sortedFormAttributeDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, isSaveDisabled, sequenceData, null, null, jobTransaction, fieldAttributeMasterParentIdMap);
                sortedFormAttributeDto.formLayoutObject.get(attributeMasterId).isLoading = false;
                dispatch(_setFormList(sortedFormAttributeDto))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1003, error.message, 'danger', 0)            
            formElement.get(attributeMasterId).isLoading = false
            dispatch(_setErrorMessage(error.message))
            dispatch(setState(UPDATE_FIELD_DATA, formElement))
            dispatch(_setErrorMessage(''))
        }
    }
}

export function disableSaveIfRequired(attributeMasterId, isSaveDisabled, formLayoutObject, value) {
    return async function (dispatch) {
        try {
            const saveDisabled = formLayoutEventsInterface.disableSaveIfRequired(attributeMasterId, isSaveDisabled, formLayoutObject, value)
            dispatch(setState(DISABLE_SAVE, saveDisabled))
        } catch (error) {
            showToastAndAddUserExceptionLog(1004, error.message, 'danger', 1)
        }
    }
}

export function updateFieldData(attributeId, value, formElement) {
    return async function (dispatch) {
        try {
            const cloneFormElement = _.cloneDeep(formElement)
            const updatedFieldData = formLayoutEventsInterface.updateFieldData(attributeId, value, cloneFormElement)
            dispatch(setState(UPDATE_FIELD_DATA, updatedFieldData))
        } catch (error) {
            showToastAndAddUserExceptionLog(1005, error.message, 'danger', 1)
        }
    }
}

export function updateFieldDataWithChildData(attributeMasterId, formElement, isSaveDisabled, value, fieldDataListObject, jobTransaction, fieldAttributeMasterParentIdMap, modalPresent, containerValue) {
    return function (dispatch) {
        try {
            const cloneFormElement = _.cloneDeep(formElement)
            cloneFormElement.get(attributeMasterId).displayValue = value
            cloneFormElement.get(attributeMasterId).childDataList = fieldDataListObject.fieldDataList
            let validationsResult = fieldValidationService.fieldValidations(cloneFormElement.get(attributeMasterId), cloneFormElement, AFTER, jobTransaction, fieldAttributeMasterParentIdMap)
            cloneFormElement.get(attributeMasterId).value = validationsResult ? cloneFormElement.get(attributeMasterId).displayValue : null
            cloneFormElement.get(attributeMasterId).containerValue = validationsResult ? containerValue : null
            const updatedFieldDataObject = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, isSaveDisabled, value, validationsResult ? fieldDataListObject.fieldDataList : null, NEXT_FOCUS, jobTransaction);
            dispatch(setState(UPDATE_FIELD_DATA_WITH_CHILD_DATA,
                {
                    formElement: updatedFieldDataObject.formLayoutObject,
                    latestPositionId: fieldDataListObject.latestPositionId,
                    isSaveDisabled: updatedFieldDataObject.isSaveDisabled,
                    modalFieldAttributeMasterId: validationsResult ? null : modalPresent ? attributeMasterId : null
                }
            ))
            if (validationsResult && !modalPresent) {
                dispatch(NavigationActions.back())
            }
            if (!validationsResult && cloneFormElement.get(attributeMasterId).alertMessage) {
                if (modalPresent) {
                    dispatch(setState(SET_OPTION_ATTRIBUTE_ERROR, { error: cloneFormElement.get(attributeMasterId).alertMessage }))
                } else {
                    Toast.show({ text: cloneFormElement.get(attributeMasterId).alertMessage, position: 'bottom', buttonText: 'OK', duration: 5000 })
                }
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1006, error.message, 'danger', 1)
        }
    }
}

export function saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, pieChart, fieldAttributeMasterParentIdMap) {
    return async function (dispatch) {
        try {
            let cloneFormLayoutState = _.cloneDeep(formLayoutState)
            const userData = await keyValueDBService.getValueFromStore(USER)
            if (userData && userData.value && userData.value.company && userData.value.company.autoLogoutFromDevice && !moment(moment(userData.value.lastLoginTime).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))) {
                dispatch(NavigationActions.navigate({ routeName: AutoLogoutScreen }))
            } else {
                dispatch(setState(IS_LOADING, true))
                let isFormValidAndFormElement = await formLayoutService.isFormValid(cloneFormLayoutState.formElement, jobTransaction, fieldAttributeMasterParentIdMap)
                if (isFormValidAndFormElement.isFormValid) {
                    const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
                    let { routeName, routeParam } = await formLayoutService.saveAndNavigate(cloneFormLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, statusList)
                    let landingId = (Start.landingTab) ? jobStatusService.getTabIdOnStatusId(statusList.value, cloneFormLayoutState.statusId) : false
                    dispatch(setState(IS_LOADING, false))
                    if (routeName == TabScreen) {
                        dispatch(NavigationActions.reset({
                            index: 1,
                            actions: [
                                NavigationActions.navigate({ routeName: HomeTabNavigatorScreen }),
                                NavigationActions.navigate({ routeName: TabScreen, params: { landingTab: landingId } })
                            ]
                        }))
                    } else {
                        dispatch(navigateToScene(routeName, routeParam))
                    }
                    dispatch(performSyncService(pieChart))
                    dispatch(setState(CLEAR_FORM_LAYOUT))
                } else {
                    dispatch(setState(SET_FORM_INVALID_AND_FORM_ELEMENT, {
                        isLoading: false,
                        isFormValid: false,
                        formElement: isFormValidAndFormElement.formElement
                    }))
                }
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1007, error.message, 'danger', 1)            
            dispatch(setState(IS_LOADING, false))
        }
    }
}

export function fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction, isSaveDisabled, fieldAttributeMasterParentIdMap) {
    return async function (dispatch) {
        try {
            let cloneFormElement = _.cloneDeep(formElement)
            let isValuePresentInAnotherTransaction = false
            let validationsResult = fieldValidationService.fieldValidations(currentElement, cloneFormElement, timeOfExecution, jobTransaction, fieldAttributeMasterParentIdMap)
            if (timeOfExecution == AFTER) {
                isValuePresentInAnotherTransaction = formLayoutService.checkUniqueValidation(currentElement)
                cloneFormElement.get(currentElement.fieldAttributeMasterId).value = validationsResult && !isValuePresentInAnotherTransaction ? cloneFormElement.get(currentElement.fieldAttributeMasterId).displayValue : null
            }
            if (isValuePresentInAnotherTransaction) {
                cloneFormElement.get(currentElement.fieldAttributeMasterId).alertMessage = UNIQUE_VALIDATION_FAILED_FORMLAYOUT
            }
            dispatch(getNextFocusableAndEditableElements(currentElement.fieldAttributeMasterId, cloneFormElement, isSaveDisabled, cloneFormElement.get(currentElement.fieldAttributeMasterId).displayValue, NEXT_FOCUS, jobTransaction))
        }
        catch (error) {
            showToastAndAddUserExceptionLog(1008, error.message, 'danger', 1)
        }
    }
}
export function saveDraftInDb(formLayoutState, jobMasterId) {
    return async function (dispatch) {
        try {
            draftService.saveDraftInDb(formLayoutState, jobMasterId)
        } catch (error) {
            showToastAndAddUserExceptionLog(1009, error.message, 'danger', 1)
        }
    }
}

export function restoreDraft(jobTransactionId, statusId, jobMasterId) {
    return async function (dispatch) {
        try {
            let formLayoutState = draftService.restoreDraftFromDb(jobTransactionId, statusId, jobMasterId)
            dispatch(setState(SET_FORM_LAYOUT_STATE, {
                editableFormLayoutState: formLayoutState,
                statusName: formLayoutState.statusName
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1010, error.message, 'danger', 1)
        }
    }
}

export function restoreDraftOrRedirectToFormLayout(editableFormLayoutState, isDraftRestore, statusId, statusName, jobTransactionId, jobMasterId, jobTransaction) {
    return async function (dispatch) {
        try {
            if (isDraftRestore) {
                dispatch(restoreDraft(jobTransactionId, statusId))
            } else {
                if (editableFormLayoutState) {
                    dispatch(setState(SET_FORM_LAYOUT_STATE, { editableFormLayoutState, statusName }))
                }
                else {
                    dispatch(getSortedRootFieldAttributes(statusId, statusName, jobTransactionId, jobMasterId, jobTransaction))
                }
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1011, error.message, 'danger', 1)
        }
    }
}

export function checkUniqueValidationThenSave(fieldAtrribute, formElement, isSaveDisabled, value, latestPositionId, jobTransaction) {
    return async function (dispatch) {
        try {
            let isValuePresentInAnotherTransaction = await dataStoreService.checkForUniqueValidation(value, fieldAtrribute)
            let cloneFormElement = _.cloneDeep(formElement)
            if (isValuePresentInAnotherTransaction) {
                cloneFormElement.get(fieldAtrribute.fieldAttributeMasterId).alertMessage = UNIQUE_VALIDATION_FAILED_FORMLAYOUT
                cloneFormElement.get(fieldAtrribute.fieldAttributeMasterId).displayValue = value
                cloneFormElement.get(fieldAtrribute.fieldAttributeMasterId).value = null
                dispatch(setState(GET_SORTED_ROOT_FIELD_ATTRIBUTES, {
                    formLayoutObject: cloneFormElement,
                    isSaveDisabled: true
                }))
                dispatch(setState(SET_UPDATE_DRAFT, true))
            } else {
                cloneFormElement.get(fieldAtrribute.fieldAttributeMasterId).alertMessage = ''
                dispatch(updateFieldDataWithChildData(fieldAtrribute.fieldAttributeMasterId, cloneFormElement, isSaveDisabled, value, latestPositionId, jobTransaction, null, true))
            }
        }
        catch (error) {
            showToastAndAddUserExceptionLog(1012, error.message, 'danger', 1)
        }
    }
}