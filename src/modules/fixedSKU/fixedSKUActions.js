'use strict'

import { fixedSKUDetailsService } from '../../services/classes/FixedSKUListing'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { fieldDataService } from '../../services/classes/FieldData'
import {
    FIELD_ATTRIBUTE_VALUE,
    FIELD_ATTRIBUTE,
    IS_LOADER_RUNNING,
    CHANGE_QUANTITY,
    SET_FIXED_SKU,
} from '../../lib/constants'
import {
    ARRAY_SAROJ_FAREYE
} from '../../lib/AttributeConstants'

import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'

export function onSave(parentObject, formElement, fixedSKUList, isSaveDisabled, latestPositionId, jobTransaction) {
    return async function (dispatch) {
        try {
            fixedSKUList = await fixedSKUDetailsService.calculateTotalAmount(fixedSKUList)
            let fieldDataListWithLatestPositionId = await fieldDataService.prepareFieldDataForTransactionSavingInState(fixedSKUList, jobTransaction.id, parentObject.positionId, latestPositionId)
            formElement.get(parentObject.fieldAttributeMasterId).editable = false
            dispatch(setState(SET_FIXED_SKU, {
                fixedSKUList,
                isLoaderRunning: false
            }))
            dispatch(updateFieldDataWithChildData(parentObject.fieldAttributeMasterId, formElement, isSaveDisabled, ARRAY_SAROJ_FAREYE, fieldDataListWithLatestPositionId, jobTransaction))
        } catch (error) {
            showToastAndAddUserExceptionLog(901, error.message, 'danger', 1)
        }
    }
}

export function onChangeQuantity(fixedSKUList, totalQuantity, payload) {
    return async function (dispatch) {
        try {
            let payload1 = await fixedSKUDetailsService.calculateQuantity(fixedSKUList, totalQuantity, payload)
            dispatch(setState(CHANGE_QUANTITY, payload1))
        } catch (error) {
            showToastAndAddUserExceptionLog(902, error.message, 'danger', 1)
        }
    }
}

export function fetchFixedSKU(fieldAttributeMasterId) {
    return async function (dispatch) {
        try {
            dispatch(setState(IS_LOADER_RUNNING, true))
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const fieldAttributeValueDataArray = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE)
            const fixedSKUList = await fixedSKUDetailsService.prepareFixedSKU(fieldAttributeMasterList.value, fieldAttributeValueDataArray.value, fieldAttributeMasterId)
            dispatch(setState(SET_FIXED_SKU, {
                fixedSKUList: fixedSKUList,
                isLoaderRunning: false
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(903, error.message, 'danger', 1)            
            dispatch(setState(IS_LOADER_RUNNING, false))
        }
    }
}