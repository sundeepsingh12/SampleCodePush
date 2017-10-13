'use strict'

import { FixedSKUDetailsService } from '../../services/classes/FixedSKUListing'
import {
    keyValueDBService,
} from '../../services/classes/KeyValueDBService'
const {
    FIELD_ATTRIBUTE_VALUE,
    FIELD_ATTRIBUTE,
    IS_LOADER_RUNNING,
    INFLATE_FIXEDSKU_CHILD,
    CHANGE_QUANTITY,
} = require('../../lib/constants').default
import {
    FIXED_SKU_QUANTITY,
    FIXED_SKU_UNIT_PRICE,
    FIXED_SKU_CODE
} from '../../lib/AttributeConstants'
import { navigateToScene } from '../global/globalActions'
export function actionDispatch(type, payload) {
    return {
        type: type,
        payload: payload
    }
}
export function onSave(fixedSKUList) {
    return async function (dispatch) {
        try {
            dispatch(actionDispatch(IS_LOADER_RUNNING, true))
            fixedSKUList = FixedSKUDetailsService.calculateTotalAmount(fixedSKUList)
            let payload = {
                fixedSKUList: fixedSKUList,
                isLoaderRunning: false
            }
            // console.log('divyanshu',payload)
            dispatch(actionDispatch(INFLATE_FIXEDSKU_CHILD, payload))
        } catch (error) {
            console.log(error)
        }
    }
}

export function onChangeQuantity(fixedSKUList, payload) {
    return function (dispatch) {
        try {
            let tempFixedSKUList = { ...fixedSKUList }
            if (payload.quantity != undefined) {
                tempFixedSKUList[payload.id].childDataList[FIXED_SKU_QUANTITY].value = parseInt(payload.quantity)
            } else {
                tempFixedSKUList[payload.id].childDataList[FIXED_SKU_QUANTITY].value = 0
            }
            let totalQuantity = 0
            for (let fixedSKUObjectCounter in tempFixedSKUList) {
                let fixedSKUChildDataList = tempFixedSKUList[fixedSKUObjectCounter].childDataList
                if (fixedSKUChildDataList && fixedSKUChildDataList[FIXED_SKU_QUANTITY].value) {
                    totalQuantity = totalQuantity + parseInt(fixedSKUChildDataList[FIXED_SKU_QUANTITY].value)
                }
            }
            let payload1 = {
                tempFixedSKUList,
                totalQuantity
            }
            dispatch(actionDispatch(CHANGE_QUANTITY, payload1))
        } catch (error) {
            console.log(error)
        }
    }
}

export function fetchFixedSKU(attributeTypeId, fieldAttributeMasterId) {
    return async function (dispatch) {
        try {
            dispatch(actionDispatch(IS_LOADER_RUNNING, true))
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const fieldAttributeValueDataArray = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE)
            const fixedSKUChildList = await FixedSKUDetailsService.prepareFixedSKUChild(fieldAttributeValueDataArray.value, fieldAttributeMasterId)
            const fixedSKUList = await FixedSKUDetailsService.prepareFixedSKU(fieldAttributeMasterList.value, fixedSKUChildList, fieldAttributeMasterId)
            let payload = {
                fixedSKUList: fixedSKUList,
                isLoaderRunning: false
            }
            dispatch(actionDispatch(INFLATE_FIXEDSKU_CHILD, payload))
        } catch (error) {
            console.log(error)
        }
    }
}