'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { selectFromListDataService } from '../../services/classes/SelectFromListService'
import { updateFieldDataWithChildData, getNextFocusableAndEditableElements, updateFieldData } from '../form-layout/formLayoutActions'
import { getNextFocusableAndEditableElement } from '../array/arrayActions'
import { CHECKBOX, RADIOBUTTON, ARRAY_SAROJ_FAREYE, OPTION_RADIO_FOR_MASTER, OBJECT_SAROJ_FAREYE, DROPDOWN } from '../../lib/AttributeConstants'
import { fieldDataService } from '../../services/classes/FieldData'
import { setState } from '../global/globalActions'
import * as realm from '../../repositories/realmdb'
import { jobDataService } from '../../services/classes/JobData'
import {
    FIELD_ATTRIBUTE_VALUE,
    SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
    ON_BLUR,
    TABLE_JOB_DATA,
    FIELD_ATTRIBUTE,
    SELECTFROMLIST_ITEMS_LENGTH,
    SET_FILTERED_DATA_SELECTFROMLIST,
    ERROR_MESSAGE,
    INPUT_TEXT_VALUE,
} from '../../lib/constants'
import _ from 'lodash'

export function _setErrorMessage(message) {
    return {
        type: ERROR_MESSAGE,
        payload: message
    }
}

export function setOrRemoveStates(selectFromListState, id, attributeTypeId) {
    return async function (dispatch) {
        try {
            if (attributeTypeId == OPTION_RADIO_FOR_MASTER) {
                const selectFromListStates = {}
                selectFromListStates.radioMasterDto = selectFromListState.radioMasterDto
                selectFromListStates.selectListData = selectFromListDataService.setOrRemoveState(selectFromListState.selectListData, id, attributeTypeId)
                dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, selectFromListStates))
            } else {
                selectFromListState = selectFromListDataService.setOrRemoveState(selectFromListState, id, attributeTypeId)
                dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, selectFromListState))
            }
        } catch (error) {
            dispatch(setState(ERROR_MESSAGE, error.message))
            dispatch(setState(ERROR_MESSAGE, ''))
        }
    }
}

export function selectFromListButton(selectFromListState, params, jobTransactionId, latestPositionId, isSaveDisabled, formElement, nextEditable, calledFromArray, rowId) {
    return async function (dispatch) {
        try {
            selectFromListState = _.values(selectFromListDataService.selectFromListDoneButtonClicked(params.attributeTypeId, selectFromListState))
            if (params.attributeTypeId == CHECKBOX || params.attributeTypeId == OPTION_RADIO_FOR_MASTER) {
                const fieldDataListData = await fieldDataService.prepareFieldDataForTransactionSavingInState(selectFromListState, jobTransactionId, params.positionId, latestPositionId)
                const value = params.attributeTypeId == OPTION_RADIO_FOR_MASTER ? OBJECT_SAROJ_FAREYE : ARRAY_SAROJ_FAREYE
                if (calledFromArray)
                    dispatch(getNextFocusableAndEditableElement(params.fieldAttributeMasterId, nextEditable, isSaveDisabled, value, formElement, rowId, fieldDataListData))
                else
                    dispatch(updateFieldDataWithChildData(params.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, value, fieldDataListData))
            } else {
                if (calledFromArray)
                    dispatch(getNextFocusableAndEditableElement(params.fieldAttributeMasterId, nextEditable, isSaveDisabled, selectFromListState[0].value, formElement, rowId))
                else
                    dispatch(getNextFocusableAndEditableElements(params.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, selectFromListState[0].value, ON_BLUR))
            }
            dispatch(setState(INPUT_TEXT_VALUE, ''))
            dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, {}))
        } catch (error) {
            dispatch(setState(ERROR_MESSAGE, error.message))
            dispatch(setState(ERROR_MESSAGE, ''))
        }
    }
}


export function gettingDataSelectFromList(fieldAttributeMasterId, formElement, attributeTypeIdOfCurrentElement) {
    return async function (dispatch) {
        try {
            const fieldAttributeValueList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE)
            if (!fieldAttributeValueList || !fieldAttributeValueList.value) {
                throw new Error('Field attributes missing in store')
            }
            const selectFromListData = await selectFromListDataService.getListSelectFromListAttribute(fieldAttributeValueList.value, fieldAttributeMasterId)
            if (formElement) {
                for (let [key, fieldDataObject] of formElement.entries()) {
                    if (fieldDataObject.fieldAttributeMasterId == fieldAttributeMasterId && fieldDataObject.childDataList) {
                        let childDataListOfSelectFromListAttribute = fieldDataObject.childDataList
                        let selectFromListDataValues = _.values(selectFromListData.selectFromListsData)
                        for (let child of childDataListOfSelectFromListAttribute) {
                            for (let childOfCurrentState of selectFromListDataValues) {
                                if (child.value == childOfCurrentState.code) {
                                    childOfCurrentState.isChecked = true
                                }
                            }
                        }
                    }
                    else if (fieldDataObject.fieldAttributeMasterId == fieldAttributeMasterId && fieldDataObject.value) {
                        let selectFromListDataValues = _.values(selectFromListData.selectFromListsData)
                        for (let childOfCurrentState of selectFromListDataValues) {
                            if (fieldDataObject.value == childOfCurrentState.code) {
                                childOfCurrentState.isChecked = true
                                dispatch(setState(INPUT_TEXT_VALUE, childOfCurrentState.name))

                            }
                        }
                    }
                }
            }
            if (attributeTypeIdOfCurrentElement == DROPDOWN && selectFromListData.selectFromListsDataLength >= 30) {
                dispatch(setState(SELECTFROMLIST_ITEMS_LENGTH, 1))
                dispatch(setState(SET_FILTERED_DATA_SELECTFROMLIST, selectFromListData.selectFromListsData))
            }
            dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, selectFromListData.selectFromListsData))
        } catch (error) {
            dispatch(setState(ERROR_MESSAGE, error.message))
            dispatch(setState(ERROR_MESSAGE, ''))
        }
    }
}

export function gettingDataForRadioMaster(currentElement, jobId) {
    return async function (dispatch) {
        try {
            const selectFromListState = {}
            const fieldAttributeList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            if (!fieldAttributeList || !fieldAttributeList.value) {
                throw new Error('Field Attributes missing in store')
            }
            const jobFieldAttributeMapId = selectFromListDataService.getRadioForMasterDto(currentElement.fieldAttributeMasterId, fieldAttributeList)
            let query = Array.from(jobFieldAttributeMapId.map(item => `jobAttributeMasterId = ${item.jobAttributeMasterId}`)).join(' OR ')
            query = `(${query}) AND jobId = ${jobId}`
            const jobDatas = realm.getRecordListOnQuery(TABLE_JOB_DATA, query)
            const parentIdJobDataListMap = jobDataService.getParentIdJobDataListMap(jobDatas)
            const selectFromListData = selectFromListDataService.getListDataForRadioMasterAttr(parentIdJobDataListMap, currentElement)
            if (!jobFieldAttributeMapId || (_.keys(selectFromListData).length === 0 && selectFromListData.constructor === Object)) {
                throw new Error('mapping of radioForMaster error')
            }
            selectFromListState.radioMasterDto = jobFieldAttributeMapId
            selectFromListState.selectListData = selectFromListData
            dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, selectFromListState))
        } catch (error) {
            dispatch(setState(ERROR_MESSAGE, error.message))
            dispatch(setState(ERROR_MESSAGE, ''))
        }
    }
}


export function setFilteredDataInDropdown(selectFromListState, searchText) {
    return async function (dispatch) {
        try {
            if (searchText.length) {
                let filteredDataDropdown = selectFromListDataService.getFilteredDataInDropDown(selectFromListState, searchText)
                dispatch(setState(SET_FILTERED_DATA_SELECTFROMLIST, filteredDataDropdown))
            } else {
                dispatch(setState(SET_FILTERED_DATA_SELECTFROMLIST, selectFromListState))
            }
        } catch (error) {
            dispatch(setState(ERROR_MESSAGE, error.message))
            dispatch(setState(ERROR_MESSAGE, ''))
        }
    }
}