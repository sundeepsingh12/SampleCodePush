'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { selectFromListDataService } from '../../services/classes/SelectFromListService'
import { updateFieldDataWithChildData, getNextFocusableAndEditableElements, updateFieldData } from '../form-layout/formLayoutActions'
import { CHECKBOX, RADIOBUTTON, ARRAY_SAROJ_FAREYE } from '../../lib/AttributeConstants'
import { fieldDataService } from '../../services/classes/FieldData'
import { setState } from '../global/globalActions'

const {
    FIELD_ATTRIBUTE_VALUE,
    SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
    ON_BLUR,
} = require('../../lib/constants').default

export function setOrRemoveStates(selectFromListState, id, attributeTypeId) {
    return async function (dispatch) {
        try {
            selectFromListState = selectFromListDataService.setOrRemoveState(selectFromListState, id, attributeTypeId)
            dispatch(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, selectFromListState))
        } catch (error) {
            console.log(error)
        }
    }
}

export function selectFromListButton(selectFromListState, params, jobTransactionId, latestPositionId, isSaveDisabled, formElement, nextEditable) {
    return async function (dispatch) {
        try {
            selectFromListState = Object.values(selectFromListDataService.selectFromListDoneButtonClicked(params.attributeTypeId, selectFromListState))
            if (params.attributeTypeId == CHECKBOX) {
                const fieldDataListData = await fieldDataService.prepareFieldDataForTransactionSavingInState(selectFromListState, jobTransactionId, params.positionId, latestPositionId)

                dispatch(updateFieldDataWithChildData(params.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, ARRAY_SAROJ_FAREYE, fieldDataListData))
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