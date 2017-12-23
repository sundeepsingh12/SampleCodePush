'use strict'

import {
    SKU_LIST_FETCHING_STOP,
    SKU_LIST_FETCHING_START,
    SHOW_SEARCH_BAR,
    SKU_CODE_CHANGE,
    UPDATE_SKU_ACTUAL_QUANTITY,
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
import {
    setState
} from '../global/globalActions'
import {
  Toast
} from 'native-base'

export function prepareSkuList(fieldAttributeMasterId, jobId) {
    return async function (dispatch) {
        try {
            dispatch(setState(SKU_LIST_FETCHING_START))
            const skuListingDto = await skuListing.getSkuListingDto(fieldAttributeMasterId)
            const skuObjectValidation = await fieldAttributeValidation.getFieldAttributeValidationFromFieldAttributeId(skuListingDto.childFieldAttributeId[0])
            const skuData = await skuListing.prepareSkuListingData(skuListingDto.idFieldAttributeMap, jobId, skuObjectValidation)
            const skuArrayChildAttributes = await skuListing.getSkuChildAttributes(skuListingDto.idFieldAttributeMap, skuData.attributeTypeIdValueMap)
            dispatch(setState(SKU_LIST_FETCHING_STOP, {
                skuListItems: skuData.skuObjectListDto,
                skuObjectValidation,
                skuArrayChildAttributes,
                skuObjectAttributeId: skuListingDto.childFieldAttributeId[0]
            }))
            if (skuListingDto.isSkuCodePresent)
                dispatch(setState(SHOW_SEARCH_BAR))
        } catch (error) {
            console.log(error)
            dispatch(setState(SKU_LIST_FETCHING_STOP))
        }
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
            dispatch(setState(UPDATE_SKU_ACTUAL_QUANTITY, {
                skuListItems: updatedSkuArray.updatedObject,
                skuRootChildElements: updatedSkuArray.updatedChildElements
            }))
        } catch (error) {
            console.log(error)
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
export function saveSkuListItems(skuListItems, skuObjectValidation, skuRootChildItems, skuObjectAttributeId, jobTransactionId, latestPositionId, parentObject, formElement, isSaveDisabled,navigation) {
    return async function (dispatch) {
        try {
            const message = skuListing.getFinalCheckForValidation(skuObjectValidation, skuRootChildItems)
            if (!message) {
                const skuChildElements = skuListing.prepareSkuListChildElementsForSaving(skuListItems, skuRootChildItems, skuObjectAttributeId)
                let fieldDataListWithLatestPositionId = await fieldDataService.prepareFieldDataForTransactionSavingInState(skuChildElements, jobTransactionId, parentObject.positionId, latestPositionId)
                dispatch(updateFieldDataWithChildData(parentObject.fieldAttributeMasterId, formElement, isSaveDisabled, ARRAY_SAROJ_FAREYE, fieldDataListWithLatestPositionId))
                navigation.goBack()
            }
            else {
                Toast.show({
              text: `${message}`,
              position: 'bottom',
              buttonText: 'OK'
            })
            }
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