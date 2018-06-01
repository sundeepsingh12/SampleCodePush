'use strict'

import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'
import { getNextFocusableAndEditableElement } from '../array/arrayActions'
import { fieldDataService } from '../../services/classes/FieldData'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { multipleOptionsAttributeService } from '../../services/classes/MultipleOptionsAttribute'
import { fieldAttributeMasterService } from '../../services/classes/FieldAttributeMaster'
import { fieldAttributeValueMasterService } from '../../services/classes/FieldAttributeValueMaster'
import { CHECKBOX, ARRAY_SAROJ_FAREYE, OPTION_RADIO_FOR_MASTER, OBJECT_SAROJ_FAREYE, OPTION_RADIO_VALUE, ADVANCE_DROPDOWN } from '../../lib/AttributeConstants'
import { FIELD_ATTRIBUTE_VALUE, FIELD_ATTRIBUTE, SET_OPTIONS_LIST, NEXT_FOCUS, SET_ADV_DROPDOWN_MESSAGE_OBJECT, SET_MODAL_FIELD_ATTRIBUTE, SET_OPTION_ATTRIBUTE_ERROR } from '../../lib/constants'
import _ from 'lodash'

export function getOptionsList(fieldAttributeMasterId, formElement) {
    return async function (dispatch) {
        try {
            let optionList = [];
            const fieldAttributeValueList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE);
            if (!fieldAttributeValueList || !fieldAttributeValueList.value) {
                return;
            }
            let childDataList = [];
            childDataList = formElement.get(fieldAttributeMasterId).childDataList ? formElement.get(fieldAttributeMasterId).childDataList : formElement.get(fieldAttributeMasterId).value ? childDataList.concat(formElement.get(fieldAttributeMasterId)) : [];
            let selectedOptionsMap = {};
            for (let index in childDataList) {
                selectedOptionsMap[childDataList[index].value] = true;
            }
            optionList = fieldAttributeValueMasterService.filterFieldAttributeValueList(fieldAttributeValueList.value, fieldAttributeMasterId);
            let optionsMap = multipleOptionsAttributeService.changeOptionStatus(optionList, selectedOptionsMap);
            dispatch(setState(SET_OPTIONS_LIST, { optionsMap }));
        } catch (error) {
            showToastAndAddUserExceptionLog(1401, error.message, 'danger', 0);
            dispatch(setState(ERROR_MESSAGE, error.message));
        }
    }
}

export function getOptionsListFromJobData(currentElement, jobTransaction) {
    return async function (dispatch) {
        try {
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            let selectedOption
            if (!fieldAttributeMasterList || !fieldAttributeMasterList.value || jobTransaction.length) {
                return
            }

            for (let index in currentElement.childDataList) {
                if (currentElement.childDataList[index].attributeTypeId == OPTION_RADIO_VALUE) {
                    selectedOption = currentElement.childDataList[index].value
                }
            }

            let fieldAttributeMasterMap = fieldAttributeMasterService.getFieldAttributeMasterMapWithParentId(fieldAttributeMasterList.value)
            let fieldAttributeMasterObject = fieldAttributeMasterMap[jobTransaction.jobMasterId][currentElement.fieldAttributeMasterId]
            let fieldAttributeMasterChildList
            for (let index in fieldAttributeMasterObject) {
                fieldAttributeMasterChildList = fieldAttributeMasterMap[jobTransaction.jobMasterId][index]
            }
            let optionsMap = multipleOptionsAttributeService.getOptionsListForJobData(fieldAttributeMasterChildList, currentElement, jobTransaction, selectedOption)
            dispatch(setState(SET_OPTIONS_LIST, {
                optionsMap
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1402, error.message, 'danger', 0)
            dispatch(setState(ERROR_MESSAGE, error.message))
        }
    }
}

export function toggleCheckStatus(optionsMap, id) {
    return async function (dispatch) {
        try {
            let optionsMapClone = _.cloneDeep(optionsMap)
            optionsMapClone[id].selected = !optionsMapClone[id].selected
            dispatch(setState(SET_OPTIONS_LIST, {
                optionsMap: optionsMapClone
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1403, error.message, 'danger', 1)
        }
    }
}

export function saveOptionsFieldData(optionsMap, currentElement, formLayoutState, jobTransaction, calledFromArray, rowId, item) {
    return async function (dispatch) {
        try {
            let optionFieldDataList, fieldDataListObject = {
                latestPositionId: formLayoutState.latestPositionId
            }
            let fieldDataValue, containerValue
            if (currentElement.attributeTypeId == CHECKBOX) {
                fieldDataValue = ARRAY_SAROJ_FAREYE
            } else if (currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER) {
                fieldDataValue = OBJECT_SAROJ_FAREYE
            } else if (currentElement.attributeTypeId == ADVANCE_DROPDOWN) {
                fieldDataValue = containerValue = item ? item.code : null
                dispatch(setState(SET_ADV_DROPDOWN_MESSAGE_OBJECT, {
                }))
            } else {
                fieldDataValue = item ? item.code : null
                containerValue = item ? item.name : null
            }
            if (fieldDataValue == ARRAY_SAROJ_FAREYE || fieldDataValue == OBJECT_SAROJ_FAREYE) {
                optionFieldDataList = currentElement.attributeTypeId == CHECKBOX ? multipleOptionsAttributeService.prepareOptionFieldData(optionsMap, currentElement) : multipleOptionsAttributeService.prepareOptionFieldDataFromJobData(item)
                fieldDataListObject = fieldDataService.prepareFieldDataForTransactionSavingInState(optionFieldDataList, jobTransaction.id, currentElement.positionId, formLayoutState.latestPositionId)
            }
            if (calledFromArray) {
                dispatch(getNextFocusableAndEditableElement(currentElement.fieldAttributeMasterId, formLayoutState.isSaveDisabled, fieldDataValue, formLayoutState.formElement, rowId, fieldDataListObject.fieldDataList, NEXT_FOCUS, 2, containerValue, formLayoutState))
                return
            }
            dispatch(updateFieldDataWithChildData(currentElement.fieldAttributeMasterId, formLayoutState, fieldDataValue, fieldDataListObject, jobTransaction, true, containerValue))
        } catch (error) {
            showToastAndAddUserExceptionLog(1404, error.message, 'danger', 1)
        }
    }
}
export function showAdvanceDropdownMessage(item) {
    return async function (dispatch) {
        try {
            let itemCodeObject = JSON.parse(item.code)
            let itemMessage = ''
            for (let message of itemCodeObject.message) {
                itemMessage += message.key + '\n' + message.value + '\n\n'
            }
            dispatch(setState(SET_ADV_DROPDOWN_MESSAGE_OBJECT, {
                code: itemCodeObject.code,
                itemMessage
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1405, error.message, 'danger', 0)
            dispatch(setState(SET_OPTION_ATTRIBUTE_ERROR, { error: error.message }))
        }
    }
}
