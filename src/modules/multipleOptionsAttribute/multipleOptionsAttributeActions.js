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
    // OPTION_RADIO_FOR_MASTER,
    OBJECT_SAROJ_FAREYE,
    // DROPDOWN
} from '../../lib/AttributeConstants'
import {
    FIELD_ATTRIBUTE_VALUE,
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
            console.log(formElement.get(fieldAttributeMasterId).value)
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
            if (!fieldAttributeMasterList || !fieldAttributeMasterList.value || jobTransaction.length) {
                return
            }

            let fieldAttributeMasterMap = fieldAttributeMasterService.getFieldAttributeMasterMapWithParentId(fieldAttributeMasterList.value)
            let childMap = fieldAttributeMasterMap[jobTransaction.jobMasterId][currentElement.positionId]
            let optionsList = multipleOptionsAttributeService.getOptionsListForJobData(childMap, currentElement)
            // let query = Array.from(jobFieldAttributeMapId.map(item => `jobAttributeMasterId = ${item.jobAttributeMasterId}`)).join(' OR ')
            // query = `(${query}) AND jobId = ${jobId}`
            // const jobDatas = realm.getRecordListOnQuery(TABLE_JOB_DATA, query)
            // const parentIdJobDataListMap = jobDataService.getParentIdJobDataListMap(jobDatas)
            // const selectFromListData = selectFromListDataService.getListDataForRadioMasterAttr(parentIdJobDataListMap, currentElement)
            // if (!jobFieldAttributeMapId || (_.keys(selectFromListData).length === 0 && selectFromListData.constructor === Object)) {
            //     throw new Error('mapping of radioForMaster error')
            // }
            // selectFromListState.radioMasterDto = jobFieldAttributeMapId
            // selectFromListState.selectListData = selectFromListData
            // dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, selectFromListState))
        } catch (error) {
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

export function saveOptionsFieldData(optionsMap, currentElement, latestPositionId, formElement, isSaveDisabled, jobTransaction, calledFromArray, rowId, fieldAttributeMasterParentIdMap, value) {
    return async function (dispatch) {
        try {
            let optionFieldDataList, fieldDataListObject = {
                latestPositionId
            }
            let fieldDataValue = value ? value : currentElement.attributeTypeId == CHECKBOX ? ARRAY_SAROJ_FAREYE : OBJECT_SAROJ_FAREYE
            if (!value) {
                optionFieldDataList = multipleOptionsAttributeService.prepareOptionFieldData(optionsMap, currentElement)
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