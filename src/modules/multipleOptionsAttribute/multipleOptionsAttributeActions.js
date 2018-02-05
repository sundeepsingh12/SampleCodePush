'use strict'

import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { setState } from '../global/globalActions'
import { getNextFocusableAndEditableElement } from '../array/arrayActions'
import { fieldDataService } from '../../services/classes/FieldData'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { multipleOptionsAttributeService } from '../../services/classes/MultipleOptionsAttribute'
// import { jobDataService } from '../../services/classes/JobData'
import { fieldAttributeMasterService } from '../../services/classes/FieldAttributeMaster'
// import * as realm from '../../repositories/realmdb'
import {
    CHECKBOX,
    // RADIOBUTTON,
    ARRAY_SAROJ_FAREYE,
    OPTION_RADIO_FOR_MASTER,
    OBJECT_SAROJ_FAREYE,
    OPTION_RADIO_VALUE,
    // DROPDOWN
} from '../../lib/AttributeConstants'
import {
    FIELD_ATTRIBUTE_VALUE,
    FIELD_ATTRIBUTE,
    SET_OPTIONS_LIST
} from '../../lib/constants'
import {
    // AFTER
} from '../../lib/AttributeConstants'
import _ from 'lodash'

export function getOptionsList(fieldAttributeMasterId, formElement) {
    return async function (dispatch) {
        try {
            let optionList = []
            const fieldAttributeValueList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE)
            if (!fieldAttributeValueList || !fieldAttributeValueList.value) {
                return
            }
            let childDataList = []
            childDataList = formElement.get(fieldAttributeMasterId).childDataList ? formElement.get(fieldAttributeMasterId).childDataList : formElement.get(fieldAttributeMasterId).value ? childDataList.concat(formElement.get(fieldAttributeMasterId)) : []
            let selectedOptionsMap = {}
            for (let index in childDataList) {
                selectedOptionsMap[childDataList[index].value] = true
            }
            optionList = fieldAttributeMasterService.filterFieldAttributeValueList(fieldAttributeValueList.value, fieldAttributeMasterId)
            let optionsMap = multipleOptionsAttributeService.changeOptionStatus(optionList, selectedOptionsMap)
            dispatch(setState(SET_OPTIONS_LIST, {
                optionsMap
            }))
        } catch (error) {
            console.log(error)
            dispatch(setState(ERROR_MESSAGE, error.message))
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
            console.log(error)
            // dispatch(setState(ERROR_MESSAGE, error.message))
            // dispatch(setState(ERROR_MESSAGE, ''))
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
            console.log(error)
        }
    }
}

export function saveOptionsFieldData(optionsMap, currentElement, latestPositionId, formElement, isSaveDisabled, jobTransaction, calledFromArray, rowId, fieldAttributeMasterParentIdMap, item) {
    return async function (dispatch) {
        try {
            let optionFieldDataList, fieldDataListObject = {
                latestPositionId
            }
            let fieldDataValue
            if (currentElement.attributeTypeId == CHECKBOX) {
                fieldDataValue = ARRAY_SAROJ_FAREYE
            } else if (currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER) {
                fieldDataValue = OBJECT_SAROJ_FAREYE
            } else {
                fieldDataValue = item ? item.code : null
            }
            if (fieldDataValue == ARRAY_SAROJ_FAREYE || fieldDataValue == OBJECT_SAROJ_FAREYE) {
                optionFieldDataList = currentElement.attributeTypeId == CHECKBOX ? multipleOptionsAttributeService.prepareOptionFieldData(optionsMap, currentElement) : multipleOptionsAttributeService.prepareOptionFieldDataFromJobData(item)
                fieldDataListObject = fieldDataService.prepareFieldDataForTransactionSavingInState(optionFieldDataList, jobTransaction.id, currentElement.positionId, latestPositionId)
            }
            if (calledFromArray) {
                dispatch(getNextFocusableAndEditableElement(currentElement.fieldAttributeMasterId, isSaveDisabled, fieldDataValue, formElement, rowId, fieldDataListObject.fieldDataList, NEXT_FOCUS))
                return
            }
            dispatch(updateFieldDataWithChildData(currentElement.fieldAttributeMasterId, formElement, isSaveDisabled, fieldDataValue, fieldDataListObject, jobTransaction, fieldAttributeMasterParentIdMap, true))
        } catch (error) {
            console.log(error)
        }
    }
}