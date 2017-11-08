'use strict'

import {
    SKU_LIST_FETCHING_STOP,
    SKU_LIST_FETCHING_START,
    SHOW_SEARCH_BAR,
    SKU_CODE_CHANGE,
    UPDATE_SKU_ACTUAL_QUANTITY
} from '../../lib/constants'

import {
    skuListing
} from '../../services/classes/SkuListing'
import {
    fieldAttributeValidation
} from '../../services/classes/FieldAttributeValidation'

import {
    SKU_ORIGINAL_QUANTITY,
    SKU_CODE,
    SKU_ACTUAL_QUANTITY,
    TOTAL_ORIGINAL_QUANTITY,
    TOTAL_ACTUAL_QUANTITY,
    SKU_ACTUAL_AMOUNT,
    ARRAY_SAROJ_FAREYE
} from '../../lib/AttributeConstants'

import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { fieldDataService } from '../../services/classes/FieldData'

export function prepareSkuList(fieldAttributeMasterId, jobId) {
    return async function (dispatch) {
        try {
            dispatch(startFetchingSkuList())
            const skuListingDto = await skuListing.getSkuListingDto(fieldAttributeMasterId)
            const skuObjectValidation = await fieldAttributeValidation.getFieldAttributeValidationFromFieldAttributeId(skuListingDto.childFieldAttributeId[0])
            const skuData = await skuListing.prepareSkuListingData(skuListingDto.idFieldAttributeMap, jobId, skuObjectValidation)
            const skuArrayChildAttributes = await skuListing.getSkuChildAttributes(skuListingDto.idFieldAttributeMap, skuData.attributeTypeIdValueMap)
            dispatch(stopFetchingSkuList(skuData.skuObjectListDto, skuObjectValidation, skuArrayChildAttributes, skuListingDto.childFieldAttributeId[0]))
            if (skuListingDto.isSkuCodePresent)
                dispatch(showSearchBar())
        } catch (error) {
            console.log(error)
            dispatch(stopFetchingSkuList([]))
        }
    }
}

export function startFetchingSkuList() {
    return {
        type: SKU_LIST_FETCHING_START,
    }
}

export function stopFetchingSkuList(skuListItems, skuObjectValidation, skuArrayChildAttributes, skuObjectAttributeId) {
    return {
        type: SKU_LIST_FETCHING_STOP,
        payload: {
            skuListItems,
            skuObjectValidation,
            skuArrayChildAttributes,
            skuObjectAttributeId
        }
    }
}

export function showSearchBar() {
    return {
        type: SHOW_SEARCH_BAR,
        payload: true
    }
}

export function scanSkuItem(skuListItems, skuCode) {
    return async function (dispatch) {

    }
}

/**
 * 
 * @param {*} value 
 * @param {*} parentId 
 * @param {*} skuListItems 
 * 
 *This method updates SkuActualQuantity of a particular list item and TotalActualQuantity,
 * TotalOriginalQuantity & SkuActualAmount as well,Called when actualQuantity is changed by user
 */
export function updateSkuActualQuantityAndOtherData(value, parentId, skuListItems, skuChildElements) {
    return async function (dispatch) {
        try {
            const updatedSkuArray = skuListing.prepareUpdatedSkuArray(value, parentId, skuListItems, skuChildElements)
            dispatch(updateSkuListItem(updatedSkuArray.updatedObject, updatedSkuArray.updatedChildElements))
        } catch (error) {
            console.log(error)
        }
    }

}

export function updateSkuListItem(skuListItems, skuRootChildElements) {
    return {
        type: UPDATE_SKU_ACTUAL_QUANTITY,
        payload: {
            skuListItems,
            skuRootChildElements
        }
    }
}
/**This is called when Proceed button is clicked
 * 
 * @param {*} skuListItems 
 * @param {*} skuObjectValidation 
 * @param {*} skuRootChildItems 
 * @param {*} skuObjectAttributeId 
 */
export function saveSkuListItems(skuListItems, skuObjectValidation, skuRootChildItems, skuObjectAttributeId, jobTransactionId, latestPositionId, parentObject, formElement, nextEditable, isSaveDisabled) {
    return async function (dispatch) {
        try {
            const message = skuListing.getFinalCheckForValidation(skuObjectValidation, skuRootChildItems)
            console.log('message', message)
            // if (!message) {
            const skuChildElements = skuListing.prepareSkuListChildElementsForSaving(skuListItems, skuRootChildItems, skuObjectAttributeId)
            let fieldDataListWithLatestPositionId = await fieldDataService.prepareFieldDataForTransactionSavingInState(skuChildElements, jobTransactionId, parentObject.positionId, latestPositionId)
            dispatch(updateFieldDataWithChildData(parentObject.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, ARRAY_SAROJ_FAREYE, fieldDataListWithLatestPositionId))
            // }
            // else{
            //     //Show Toast or Modal here according to message string returned
            // }
        } catch (error) {
            console.log(error)
            //UI needs updating here
        }

    }
}

export function changeSkuCode(skuCode) {
    return {
        type: SKU_CODE_CHANGE,
        payload: {
            skuCode
        }
    }
}