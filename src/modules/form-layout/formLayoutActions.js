'use strict'

import {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    UPDATE_FIELD_DATA,
    SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT,
    IS_LOADING,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA,
    JOB_STATUS,
    NEXT_FOCUS,
    TabScreen,
    Transient,
    CLEAR_FORM_LAYOUT,
    SET_FORM_LAYOUT_STATE,
    USER,
    AutoLogoutScreen,
    SET_OPTION_ATTRIBUTE_ERROR,
    ADD_FORM_LAYOUT_STATE,
    SET_FORM_INVALID_AND_FORM_ELEMENT,
    SYNC_RUNNING_AND_TRANSACTION_SAVING,
    SET_LANDING_TAB,
    FormLayout,
    CLEAR_FORM_LAYOUT_WITH_LOADER
} from '../../lib/constants'

import {
    AFTER,
} from '../../lib/AttributeConstants'

import { formLayoutService } from '../../services/classes/formLayout/FormLayout.js'
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface.js'
import { NavigationActions, StackActions } from 'react-navigation'
import { navDispatch, navigate, push } from '../navigators/NavigationService';
import { fieldValidationService } from '../../services/classes/FieldValidation'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobStatusService } from '../../services/classes/JobStatus'

import _ from 'lodash'
import { performSyncService, pieChartCount } from '../home/homeActions'
import { draftService } from '../../services/classes/DraftService'
import { dataStoreService } from '../../services/classes/DataStoreService'
import { UNIQUE_VALIDATION_FAILED_FORMLAYOUT,OK } from '../../lib/ContainerConstants'
import moment from 'moment'
import { Toast } from 'native-base'
import { fetchJobs } from '../taskList/taskListActions';


export function getSortedRootFieldAttributes(statusId, statusName, jobTransactionId, jobTransaction) {
    return async function (dispatch) {
        try {
            dispatch(setState(CLEAR_FORM_LAYOUT_WITH_LOADER))
            let sortedFormAttributesDto = await formLayoutService.getSequenceWiseRootFieldAttributes(statusId, null, jobTransaction)
            let { latestPositionId, noFieldAttributeMappedWithStatus, jobAndFieldAttributesList, sequenceWiseSortedFieldAttributesMasterIds } = sortedFormAttributesDto
            let fieldAttributeMasterParentIdMap = sortedFormAttributesDto.fieldAttributeMasterParentIdMap
            sortedFormAttributesDto = formLayoutEventsInterface.findNextFocusableAndEditableElement(null, sortedFormAttributesDto.formLayoutObject, sortedFormAttributesDto.isSaveDisabled, null, null, NEXT_FOCUS, jobTransaction, fieldAttributeMasterParentIdMap, jobAndFieldAttributesList, sequenceWiseSortedFieldAttributesMasterIds);
            dispatch(setState(SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT, {
                statusId,
                statusName,
                jobTransactionId,
                latestPositionId,
                fieldAttributeMasterParentIdMap,
                noFieldAttributeMappedWithStatus: (noFieldAttributeMappedWithStatus || sortedFormAttributesDto.isAllAttributeHidden),
                formLayoutObject: sortedFormAttributesDto.formLayoutObject,
                isSaveDisabled: sortedFormAttributesDto.isSaveDisabled,
                isLoading: false,
                jobAndFieldAttributesList,
                sequenceWiseFieldAttributeMasterIds: sequenceWiseSortedFieldAttributesMasterIds
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1001, error.message, 'danger', 0)
            dispatch(setState(IS_LOADING, false))
        }
    }
}

export function getNextFocusableAndEditableElements(attributeMasterId, formLayoutState, value, event, jobTransaction) {
    return async function (dispatch) {
        try {
            const cloneFormElement = _.cloneDeep(formLayoutState.formElement)
            const { formLayoutObject, isSaveDisabled } = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, formLayoutState.isSaveDisabled, value, null, event, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap, formLayoutState.jobAndFieldAttributesList, formLayoutState.sequenceWiseFieldAttributeMasterIds);
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
            formLayoutState.formElement[currentElement.fieldAttributeMasterId].isLoading = true
            formLayoutState.formElement[currentElement.fieldAttributeMasterId].editable = false
            dispatch(setState(UPDATE_FIELD_DATA, formLayoutState.formElement))
            const sequenceData = await formLayoutEventsInterface.getSequenceData(sequenceId)
            if (sequenceData) {
                formLayoutState.formElement[currentElement.fieldAttributeMasterId].displayValue = sequenceData
                formLayoutState.formElement[currentElement.fieldAttributeMasterId].isLoading = false
                dispatch(fieldValidations(currentElement, formLayoutState, AFTER, jobTransaction))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1003, error.message, 'danger', 1)
            formLayoutState.formElement[currentElement.fieldAttributeMasterId].isLoading = false
            dispatch(setState(UPDATE_FIELD_DATA, formLayoutState.formElement))
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
            cloneFormElement[attributeMasterId].displayValue = value
            cloneFormElement[attributeMasterId].childDataList = fieldDataListObject.fieldDataList
            cloneFormElement[attributeMasterId].alertMessage = null
            let validationsResult = fieldValidationService.fieldValidations(cloneFormElement[attributeMasterId], cloneFormElement, AFTER, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap, formLayoutState.jobAndFieldAttributesList)
            cloneFormElement[attributeMasterId].value = validationsResult ? cloneFormElement[attributeMasterId].displayValue : null
            cloneFormElement[attributeMasterId].containerValue = validationsResult ? containerValue : null
            const updatedFieldDataObject = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, cloneFormElement, formLayoutState.isSaveDisabled, value, validationsResult ? fieldDataListObject.fieldDataList : null, NEXT_FOCUS, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap, formLayoutState.jobAndFieldAttributesList, formLayoutState.sequenceWiseFieldAttributeMasterIds);
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
                navDispatch(StackActions.pop())
            }
            if (!validationsResult && cloneFormElement[attributeMasterId].alertMessage) {
                if (modalPresent) {
                    dispatch(setState(SET_OPTION_ATTRIBUTE_ERROR, { error: cloneFormElement[attributeMasterId].alertMessage }))
                } else {
                    Toast.show({ text: cloneFormElement[attributeMasterId].alertMessage, position: 'bottom', buttonText: 'OK', duration: 5000 })
                }
            }
        } catch (error) {
            //console.log(error)
            showToastAndAddUserExceptionLog(1006, error.message, 'danger', 1)
        }
    }
}

export function saveJobTransaction(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, taskListScreenDetails) {
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
                navDispatch(NavigationActions.navigate({ routeName: AutoLogoutScreen }))
            } else {
                dispatch(setState(IS_LOADING, true))
                let isFormValidAndFormElement = await formLayoutService.isFormValid(cloneFormLayoutState.formElement, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap, formLayoutState.jobAndFieldAttributesList)
                if (isFormValidAndFormElement.isFormValid) {
                    const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
                    let { routeName, routeParam } = await formLayoutService.saveAndNavigate(cloneFormLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, statusList, taskListScreenDetails)
                    dispatch(setState(IS_LOADING, false))
                    if (routeName == TabScreen && taskListScreenDetails.jobDetailsScreenKey && taskListScreenDetails.pageObjectAdditionalParams) {
                        let landingTabId = JSON.parse(taskListScreenDetails.pageObjectAdditionalParams).landingTabAfterJobCompletion ? jobStatusService.getTabIdOnStatusId(statusList.value, cloneFormLayoutState.statusId) : null
                        dispatch(setState(SET_LANDING_TAB, { landingTabId }))
                        dispatch(pieChartCount())
                        navDispatch(NavigationActions.navigate({ routeName: TabScreen }))
                        dispatch(fetchJobs())
                    } else if (routeName == TabScreen) {
                        navDispatch(StackActions.popToTop());
                        dispatch(fetchJobs())
                    } else if (routeName == Transient) {
                        //When single status is present in transient case navigate to form layout directly
                        if (_.size(routeParam.currentStatus.nextStatusList) == 1) {
                            let { formLayoutState, currentStatus, contactData, jobTransaction, jobMasterId, jobDetailsScreenKey, pageObjectAdditionalParams } = routeParam
                            if (!navigationFormLayoutStates) {
                                navigationFormLayoutStates = {}
                            }
                            let cloneTransientFormLayoutMap = _.cloneDeep(navigationFormLayoutStates)
                            cloneTransientFormLayoutMap[currentStatus.id] = formLayoutState
                            dispatch(setState(ADD_FORM_LAYOUT_STATE, cloneTransientFormLayoutMap))
                            push(FormLayout, {
                                contactData,
                                jobTransactionId: jobTransaction.id,
                                jobTransaction: jobTransaction,
                                statusId: currentStatus.nextStatusList[0].id,
                                statusName: currentStatus.nextStatusList[0].name,
                                jobMasterId: jobMasterId,
                                navigationFormLayoutStates: cloneTransientFormLayoutMap,
                                latestPositionId: formLayoutState.latestPositionId,
                                jobDetailsScreenKey,
                                pageObjectAdditionalParams,
                                previousStatus: currentStatus
                            })
                            draftService.saveDraftInDb(formLayoutState, jobMasterId, cloneTransientFormLayoutMap, jobTransaction)
                        } else {
                            push(routeName, routeParam)
                        }
                    } else {
                        push(routeName, routeParam)
                    }
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
            dispatch(performSyncService())
        }
    }
}

export function fieldValidations(currentElement, formLayoutState, timeOfExecution, jobTransaction) {
    return async function (dispatch) {
        try {
            let cloneFormElement = _.cloneDeep(formLayoutState.formElement)
            let isValuePresentInAnotherTransaction = false
            let validationsResult = fieldValidationService.fieldValidations(currentElement, cloneFormElement, timeOfExecution, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap, formLayoutState.jobAndFieldAttributesList)
            if (timeOfExecution == AFTER) {
                isValuePresentInAnotherTransaction = formLayoutService.checkUniqueValidation(currentElement)
                cloneFormElement[currentElement.fieldAttributeMasterId].value = validationsResult && !isValuePresentInAnotherTransaction ? cloneFormElement[currentElement.fieldAttributeMasterId].displayValue : null
            }
            if (isValuePresentInAnotherTransaction) {
                cloneFormElement[currentElement.fieldAttributeMasterId].alertMessage = UNIQUE_VALIDATION_FAILED_FORMLAYOUT
            }
            formLayoutState.formElement = cloneFormElement
            dispatch(getNextFocusableAndEditableElements(currentElement.fieldAttributeMasterId, formLayoutState, cloneFormElement[currentElement.fieldAttributeMasterId].displayValue, NEXT_FOCUS, jobTransaction))
        }
        catch (error) {
            showToastAndAddUserExceptionLog(1008, error.message, 'danger', 1)
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
                dispatch(getSortedRootFieldAttributes(statusId, statusName, jobTransactionId, jobTransaction))
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
                cloneFormElement[fieldAtrribute.fieldAttributeMasterId].alertMessage = UNIQUE_VALIDATION_FAILED_FORMLAYOUT
                cloneFormElement[fieldAtrribute.fieldAttributeMasterId].displayValue = value
                cloneFormElement[fieldAtrribute.fieldAttributeMasterId].value = null
                dispatch(setState(GET_SORTED_ROOT_FIELD_ATTRIBUTES, {
                    formLayoutObject: cloneFormElement,
                    isSaveDisabled: true
                }))
            } else {
                cloneFormElement[fieldAtrribute.fieldAttributeMasterId].alertMessage = ''
                formLayoutState.formElement = cloneFormElement
                dispatch(updateFieldDataWithChildData(fieldAtrribute.fieldAttributeMasterId, formLayoutState, value, { latestPositionId: formLayoutState.latestPositionId }, jobTransaction, true))
            }
        }
        catch (error) {
            showToastAndAddUserExceptionLog(1012, error.message, 'danger', 1)
        }
    }
}

export function restoreDraftAndNavigateToFormLayout(contactData, jobTransaction, draft, navgiationStateForSaveActivated, pageObjectAdditionalParams, jobDetailsScreenKey) {
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
                    referenceNumber: draft.referenceNumber
                }
            }
            if (!_.isEmpty(draftRestored.navigationFormLayoutStatesForRestore)) {
                dispatch(setState(ADD_FORM_LAYOUT_STATE, draftRestored.navigationFormLayoutStatesForRestore))
            }
            navigate('FormLayout', {
                contactData,
                jobTransactionId: jobTransaction.id,
                jobTransaction: jobTransaction,
                statusId: draftRestored.formLayoutState.statusId,
                statusName: draftRestored.formLayoutState.statusName,
                jobMasterId: draft.jobMasterId,
                navigationFormLayoutStates: !_.isEmpty(draftRestored.navigationFormLayoutStatesForRestore) ? draftRestored.navigationFormLayoutStatesForRestore : (navgiationStateForSaveActivated ? navgiationStateForSaveActivated : {}),
                isDraftRestore: true,
                pageObjectAdditionalParams,
                jobDetailsScreenKey
            })
        } catch (error) {
            showToastAndAddUserExceptionLog(1013, error.message, 'danger', 1)
        }
    }
}
