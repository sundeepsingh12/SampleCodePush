'use strict'

import {
    FIELD_ATTRIBUTE,
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    DISABLE_SAVE,
    UPDATE_FIELD_DATA,
    STATUS_NAME,
    ON_BLUR,
    TOOGLE_HELP_TEXT,
    SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT,
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
    ADD_FORM_LAYOUT_STATE,
    SET_FORM_INVALID_AND_FORM_ELEMENT,
    SYNC_RUNNING_AND_TRANSACTION_SAVING
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
//import { transientStatusService } from '../../services/classes/TransientStatusService'
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

export function _setErrorMessage(message) {
    return {
        type: ERROR_MESSAGE,
        payload: message
    }
}

export function getSortedRootFieldAttributes(statusId, statusName, jobTransactionId, jobMasterId, jobTransaction, positionId) {
    return async function (dispatch) {
        try {
            dispatch(setState(IS_LOADING, true))
            const sortedFormAttributesDto = await formLayoutService.getSequenceWiseRootFieldAttributes(statusId, null, jobTransaction)
            let { latestPositionId, noFieldAttributeMappedWithStatus } = sortedFormAttributesDto
            let fieldAttributeMasterParentIdMap = sortedFormAttributesDto.fieldAttributeMasterParentIdMap
            sortedFormAttributesDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(null, sortedFormAttributesDto.formLayoutObject, sortedFormAttributesDto.isSaveDisabled, null, null, NEXT_FOCUS, jobTransaction, fieldAttributeMasterParentIdMap);
            dispatch(setState(SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT, {
                statusId,
                statusName,
                jobTransactionId,
                latestPositionId,
                fieldAttributeMasterParentIdMap,
                noFieldAttributeMappedWithStatus: (noFieldAttributeMappedWithStatus || sortedFormAttributesDto.isAllAttributeHidden),
                formLayoutObject: sortedFormAttributesDto.formLayoutObject,
                isSaveDisabled: sortedFormAttributesDto.isSaveDisabled,
                isLoading: false
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1001, error.message, 'danger', 0)
            dispatch(setState(IS_LOADING, false))
            dispatch(_setErrorMessage(error))
        }
    }
}

export function getNextFocusableAndEditableElements(attributeMasterId, formLayoutState, value, event, jobTransaction) {
    return async function (dispatch) {
        try {
            const cloneFormElement = _.cloneDeep(formLayoutState.formElement)
            const { formLayoutObject, isSaveDisabled } = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, formLayoutState.isSaveDisabled, value, null, event, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap);
            dispatch(setState(GET_SORTED_ROOT_FIELD_ATTRIBUTES, { formLayoutObject, isSaveDisabled }))
            if (formLayoutState.updateDraft) {
                formLayoutState.formElement = formLayoutObject
                formLayoutState.isSaveDisabled = isSaveDisabled
                draftService.saveDraftInDb(formLayoutState, formLayoutState.jobMasterId, null, jobTransaction)
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1002, error.message, 'danger', 1)
        }
    }
}
export function setSequenceDataAndNextFocus(currentElement, formLayoutState, sequenceId, jobTransaction) {
    return async function (dispatch) {
        try {
            formLayoutState.formElement.get(currentElement.fieldAttributeMasterId).isLoading = true
            formLayoutState.formElement.get(currentElement.fieldAttributeMasterId).editable = false
            dispatch(setState(UPDATE_FIELD_DATA, formLayoutState.formElement))
            const sequenceData = await formLayoutEventsInterface.getSequenceData(sequenceId)
            if (sequenceData) {
                formLayoutState.formElement.get(currentElement.fieldAttributeMasterId).displayValue = sequenceData
                formLayoutState.formElement.get(currentElement.fieldAttributeMasterId).isLoading = false
                dispatch(fieldValidations(currentElement, formLayoutState, AFTER, jobTransaction))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1003, error.message, 'danger', 1)
            formLayoutState.formElement.get(currentElement.fieldAttributeMasterId).isLoading = false
            dispatch(setState(UPDATE_FIELD_DATA, formLayoutState.formElement))
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

export function updateFieldData(attributeId, value, formLayoutState, jobTransaction) {
    return async function (dispatch) {
        try {
            const cloneFormElement = _.cloneDeep(formLayoutState.formElement)
            const updatedFieldData = formLayoutEventsInterface.updateFieldData(attributeId, value, cloneFormElement)
            dispatch(setState(UPDATE_FIELD_DATA, updatedFieldData))
            if (formLayoutState.updateDraft) {
                formLayoutState.formElement = updatedFieldData
                draftService.saveDraftInDb(formLayoutState, formLayoutState.jobMasterId, null, jobTransaction)
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1005, error.message, 'danger', 1)
        }
    }
}

export function updateFieldDataWithChildData(attributeMasterId, formLayoutState, value, fieldDataListObject, jobTransaction, modalPresent, containerValue) {
    return function (dispatch) {
        try {
            const cloneFormElement = _.cloneDeep(formLayoutState.formElement)
            cloneFormElement.get(attributeMasterId).displayValue = value
            cloneFormElement.get(attributeMasterId).childDataList = fieldDataListObject.fieldDataList
            cloneFormElement.get(attributeMasterId).alertMessage = null
            let validationsResult = fieldValidationService.fieldValidations(cloneFormElement.get(attributeMasterId), cloneFormElement, AFTER, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap)
            cloneFormElement.get(attributeMasterId).value = validationsResult ? cloneFormElement.get(attributeMasterId).displayValue : null
            cloneFormElement.get(attributeMasterId).containerValue = validationsResult ? containerValue : null
            const updatedFieldDataObject = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, formLayoutState.isSaveDisabled, value, validationsResult ? fieldDataListObject.fieldDataList : null, NEXT_FOCUS, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap);
            dispatch(setState(UPDATE_FIELD_DATA_WITH_CHILD_DATA,
                {
                    formElement: updatedFieldDataObject.formLayoutObject,
                    latestPositionId: fieldDataListObject.latestPositionId,
                    isSaveDisabled: updatedFieldDataObject.isSaveDisabled,
                    modalFieldAttributeMasterId: validationsResult ? null : modalPresent ? attributeMasterId : null
                }
            ))
            if (formLayoutState.updateDraft) {
                formLayoutState.formElement = updatedFieldDataObject.formLayoutObject
                formLayoutState.isSaveDisabled = updatedFieldDataObject.isSaveDisabled
                formLayoutState.latestPositionId = fieldDataListObject.latestPositionId
                draftService.saveDraftInDb(formLayoutState, formLayoutState.jobMasterId, null, jobTransaction)
            }
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

export function saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, pieChart) {
    return async function (dispatch) {
        try {
            let syncRunningAndTransactionSaving = await keyValueDBService.getValueFromStore(SYNC_RUNNING_AND_TRANSACTION_SAVING);
            if (syncRunningAndTransactionSaving && syncRunningAndTransactionSaving.value) {
                syncRunningAndTransactionSaving.value.transactionSaving = true
            }
            await keyValueDBService.validateAndSaveData(SYNC_RUNNING_AND_TRANSACTION_SAVING, syncRunningAndTransactionSaving.value)
            let cloneFormLayoutState = _.cloneDeep(formLayoutState)
            const userData = await keyValueDBService.getValueFromStore(USER)
            if (userData && userData.value && userData.value.company && userData.value.company.autoLogoutFromDevice && !moment(moment(userData.value.lastLoginTime).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))) {
                dispatch(NavigationActions.navigate({ routeName: AutoLogoutScreen }))
            } else {
                dispatch(setState(IS_LOADING, true))
                let isFormValidAndFormElement = await formLayoutService.isFormValid(cloneFormLayoutState.formElement, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap)
                if (isFormValidAndFormElement.isFormValid) {
                    const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
                    let { routeName, routeParam } = await formLayoutService.saveAndNavigate(cloneFormLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, statusList)
                    //let landingId = (Start.landingTab) ? jobStatusService.getTabIdOnStatusId(statusList.value, cloneFormLayoutState.statusId) : false
                    dispatch(setState(IS_LOADING, false))
                    if (routeName == TabScreen) {
                        dispatch(NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: HomeTabNavigatorScreen }),
                                //NavigationActions.navigate({ routeName: TabScreen, params: { landingTab: landingId } })
                            ]
                        }))
                    } else {
                        dispatch(navigateToScene(routeName, routeParam))
                    }
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
        } finally {
            let syncRunningAndTransactionSaving = await keyValueDBService.getValueFromStore(SYNC_RUNNING_AND_TRANSACTION_SAVING);
            if (syncRunningAndTransactionSaving && syncRunningAndTransactionSaving.value) {
                syncRunningAndTransactionSaving.value.transactionSaving = false
            }
            await keyValueDBService.validateAndSaveData(SYNC_RUNNING_AND_TRANSACTION_SAVING, syncRunningAndTransactionSaving.value)
            dispatch(performSyncService(pieChart))
        }
    }
}

export function fieldValidations(currentElement, formLayoutState, timeOfExecution, jobTransaction) {
    return async function (dispatch) {
        try {
            let cloneFormElement = _.cloneDeep(formLayoutState.formElement)
            let isValuePresentInAnotherTransaction = false
            let validationsResult = fieldValidationService.fieldValidations(currentElement, cloneFormElement, timeOfExecution, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap)
            if (timeOfExecution == AFTER) {
                isValuePresentInAnotherTransaction = formLayoutService.checkUniqueValidation(currentElement)
                cloneFormElement.get(currentElement.fieldAttributeMasterId).value = validationsResult && !isValuePresentInAnotherTransaction ? cloneFormElement.get(currentElement.fieldAttributeMasterId).displayValue : null
            }
            if (isValuePresentInAnotherTransaction) {
                cloneFormElement.get(currentElement.fieldAttributeMasterId).alertMessage = UNIQUE_VALIDATION_FAILED_FORMLAYOUT
            }
            formLayoutState.formElement = cloneFormElement
            dispatch(getNextFocusableAndEditableElements(currentElement.fieldAttributeMasterId, formLayoutState, cloneFormElement.get(currentElement.fieldAttributeMasterId).displayValue, NEXT_FOCUS, jobTransaction))
        }
        catch (error) {
            showToastAndAddUserExceptionLog(1008, error.message, 'danger', 1)
        }
    }
}
export function saveDraftInDb(formLayoutState, jobMasterId, jobTransaction) {
    return async function (dispatch) {
        try {
            draftService.saveDraftInDb(formLayoutState, jobMasterId, null, jobTransaction)
            dispatch(setState(SET_UPDATE_DRAFT, false))
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

export function restoreDraftOrRedirectToFormLayout(editableFormLayoutState, isDraftRestore, statusId, statusName, jobTransactionId, jobMasterId, jobTransaction, latestPositionId) {
    return async function (dispatch) {
        try {
            if (editableFormLayoutState) {
                dispatch(setState(SET_FORM_LAYOUT_STATE, { editableFormLayoutState, statusName }))
            }
            else {
                dispatch(getSortedRootFieldAttributes(statusId, statusName, jobTransactionId, jobMasterId, jobTransaction))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1011, error.message, 'danger', 1)
        }
    }
}

export function checkUniqueValidationThenSave(fieldAtrribute, formLayoutState, value, jobTransaction) {
    return async function (dispatch) {
        try {
            let isValuePresentInAnotherTransaction = await dataStoreService.checkForUniqueValidation(value, fieldAtrribute)
            let cloneFormElement = _.cloneDeep(formLayoutState.formElement)
            if (isValuePresentInAnotherTransaction) {
                cloneFormElement.get(fieldAtrribute.fieldAttributeMasterId).alertMessage = UNIQUE_VALIDATION_FAILED_FORMLAYOUT
                cloneFormElement.get(fieldAtrribute.fieldAttributeMasterId).displayValue = value
                cloneFormElement.get(fieldAtrribute.fieldAttributeMasterId).value = null
                dispatch(setState(GET_SORTED_ROOT_FIELD_ATTRIBUTES, {
                    formLayoutObject: cloneFormElement,
                    isSaveDisabled: true
                }))
            } else {
                cloneFormElement.get(fieldAtrribute.fieldAttributeMasterId).alertMessage = ''
                formLayoutState.formElement = cloneFormElement
                dispatch(updateFieldDataWithChildData(fieldAtrribute.fieldAttributeMasterId, formLayoutState, value, { latestPositionId: formLayoutState.latestPositionId }, jobTransaction, true))
            }
        }
        catch (error) {
            showToastAndAddUserExceptionLog(1012, error.message, 'danger', 1)
        }
    }
}

export function restoreDraftAndNavigateToFormLayout(contactData, jobTransaction, draft, navgiationStateForSaveActivated) {
    return async function (dispatch) {
        try {
            let draftRestored = draftService.getFormLayoutStateFromDraft(draft)
            dispatch(setState(SET_FORM_LAYOUT_STATE, {
                editableFormLayoutState: draftRestored.formLayoutState,
                statusName: draftRestored.formLayoutState.statusName
            }))
            if (!jobTransaction) {
                jobTransaction = {
                    id: draftRestored.formLayoutState.jobTransactionId,
                    jobMasterId: draft.jobMasterId,
                    jobId: draftRestored.formLayoutState.jobTransactionId,
                }
            }
            if (restoreDraftAndNavigateToFormLayout) {
                dispatch(setState(ADD_FORM_LAYOUT_STATE, draftRestored.navigationFormLayoutStatesForRestore))
            }
            dispatch(navigateToScene('FormLayout', {
                contactData,
                jobTransactionId: jobTransaction.id,
                jobTransaction: jobTransaction,
                statusId: draftRestored.formLayoutState.statusId,
                statusName: draftRestored.formLayoutState.statusName,
                jobMasterId: draft.jobMasterId,
                navigationFormLayoutStates: !_.isEmpty(draftRestored.navigationFormLayoutStatesForRestore) ? draftRestored.navigationFormLayoutStatesForRestore : (navgiationStateForSaveActivated ? navgiationStateForSaveActivated : null),
                isDraftRestore: true
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1013, error.message, 'danger', 1)
        }
    }
}
