'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { selectFromListDataService } from '../../services/classes/SelectFromListService'
import { updateFieldDataWithChildData, getNextFocusableAndEditableElements, updateFieldData } from '../form-layout/formLayoutActions'
import { CHECKBOX, RADIOBUTTON, ARRAYSAROJFAREYE ,OPTION_RADIO_FOR_MASTER,OBJECTSAROJFAREYE} from '../../lib/AttributeConstants'
import { fieldDataService } from '../../services/classes/FieldData'
import { setState } from '../global/globalActions'

const {
    FIELD_ATTRIBUTE_VALUE,
    SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
    ON_BLUR,
    TABLE_JOB_DATA,
    FIELD_ATTRIBUTE,
} = require('../../lib/constants').default

export function setOrRemoveStates(selectFromListState, id, attributeTypeId) {
    return async function (dispatch) {
        try {
            if(attributeTypeId == OPTION_RADIO_FOR_MASTER){
                let selectFromListStates = new Map()
                selectFromListStates.fieldAttributeMasterList = selectFromListState.fieldAttributeMasterList
                selectFromListStates.selectFromListData = selectFromListDataService.setOrRemoveState(selectFromListState.selectFromListData, id, attributeTypeId)
                dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, selectFromListStates))
            }else{
                selectFromListState = selectFromListDataService.setOrRemoveState(selectFromListState, id, attributeTypeId)
                dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, selectFromListState))
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export function selectFromListButton(selectFromListState, params, jobTransactionId, latestPositionId, isSaveDisabled, formElement, nextEditable) {
    return async function (dispatch) {
        try {
            selectFromListState = Object.values(selectFromListDataService.selectFromListDoneButtonClicked(params.attributeTypeId, selectFromListState))
            if (params.attributeTypeId == CHECKBOX || params.attributeTypeId ==  OPTION_RADIO_FOR_MASTER) {
                const fieldDataListData = await fieldDataService.prepareFieldDataForTransactionSavingInState(selectFromListState, jobTransactionId, params.positionId, latestPositionId)
                const value = params.attributeTypeId == OPTION_RADIO_FOR_MASTER ? OBJECTSAROJFAREYE : ARRAYSAROJFAREYE
                dispatch(updateFieldDataWithChildData(params.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, value, fieldDataListData))
                dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, {}))
            } else {
                dispatch(getNextFocusableAndEditableElements(params.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, selectFromListState[0].value, ON_BLUR))
            }
        } catch (error) {
            console.log(error)
        }
    }
}


export function gettingDataSelectFromList(fieldAttributeMasterId) {
    return async function (dispatch) {
        try {
            const fieldAttributeValueList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE)
            if (!fieldAttributeValueList || !fieldAttributeValueList.value) {
                throw new Error('Field attributes missing in store')
            }
            const selectFromListData = await selectFromListDataService.getListSelectFromListAttribute(fieldAttributeValueList.value, fieldAttributeMasterId)
            dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, selectFromListData))
        } catch (error) {
            console.log(error)
        }
    }
}

export function gettingDataForRadioMaster(fieldAttributeMasterId,jobId) {
    return async function (dispatch) {
        try {
           const fieldAttributeMasterList = await selectFromListDataService.getRadioForMasterDto(fieldAttributeMasterId)
             if (!fieldAttributeMasterList && fieldAttributeMasterList.jobFieldAttributeMapId != null && fieldAttributeMasterList.jobFieldAttributeMapId != undefined) {
                throw new Error('Field attributes missing in store')
            }
            const selectFromListData =await selectFromListDataService.getListDataForRadioMasterAttr(fieldAttributeMasterList.jobFieldAttributeMapId,jobId)
            const selectFromListState = new Map()
            selectFromListState.fieldAttributeMasterList = fieldAttributeMasterList
            selectFromListState.selectFromListData = selectFromListData
            dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, selectFromListState))
        } catch (error) {
            console.log(error)
        }
    }
}