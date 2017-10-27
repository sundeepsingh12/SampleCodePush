'use strict'

import { fixedSKUDetailsService } from '../../services/classes/FixedSKUListing'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { fieldDataService } from '../../services/classes/FieldData'
const {
    FIELD_ATTRIBUTE_VALUE,
    FIELD_ATTRIBUTE,
    IS_LOADER_RUNNING,
    CHANGE_QUANTITY,
    SET_FIXED_SKU,
} = require('../../lib/constants').default
import {
    ARRAY_SAROJ_FAREYE
} from '../../lib/AttributeConstants'

import { setState } from '../global/globalActions'

export function onSave(parentObject, formElement, nextEditable, fixedSKUList, isSaveDisabled, latestPositionId, jobTransactionId) {
    return async function (dispatch) {
        try {
            fixedSKUList = await fixedSKUDetailsService.calculateTotalAmount(fixedSKUList)
            let fieldDataListWithLatestPositionId = await fieldDataService.prepareFieldDataForTransactionSavingInState(fixedSKUList, jobTransactionId, parentObject.positionId, latestPositionId)
            dispatch(setState(SET_FIXED_SKU, {
                fixedSKUList,
                isLoaderRunning: false
            }))
            dispatch(updateFieldDataWithChildData(parentObject.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, ARRAY_SAROJ_FAREYE, fieldDataListWithLatestPositionId))
        } catch (error) {
            console.log(error)
        }
    }
}

export function onChangeQuantity(fixedSKUList, totalQuantity, payload) {
    return async function (dispatch) {
        try {
            let payload1 = await fixedSKUDetailsService.calculateQuantity(fixedSKUList, totalQuantity, payload)
            dispatch(setState(CHANGE_QUANTITY, payload1))
        } catch (error) {
            console.log(error)
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
            console.log(error)
        }
    }
}