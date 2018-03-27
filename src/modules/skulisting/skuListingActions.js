'use strict'

import {
    SKU_LIST_FETCHING_STOP,
    SKU_LIST_FETCHING_START,
    SHOW_SEARCH_BAR,
    SKU_CODE_CHANGE,
    UPDATE_SKU_ACTUAL_QUANTITY,
    SET_SHOW_VIEW_IMAGE,
    UPDATE_SKU_LIST_ITEMS
} from '../../lib/constants'

import {
    skuListing
} from '../../services/classes/SkuListing'
import {
    fieldAttributeValidation
} from '../../services/classes/FieldAttributeValidation'
import { signatureService } from '../../services/classes/SignatureRemarks'
import moment from 'moment'

import {
    SKU_ORIGINAL_QUANTITY,
    SKU_CODE,
    SKU_ACTUAL_QUANTITY,
    TOTAL_ORIGINAL_QUANTITY,
    TOTAL_ACTUAL_QUANTITY,
    SKU_ACTUAL_AMOUNT,
    ARRAY_SAROJ_FAREYE,
    SKU_PHOTO,
    SKU_REASON,
} from '../../lib/AttributeConstants'
import { NavigationActions } from 'react-navigation'

import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { fieldDataService } from '../../services/classes/FieldData'
import {
    setState,
    showToastAndAddUserExceptionLog
} from '../global/globalActions'
import {
    Toast
} from 'native-base'

export function prepareSkuList(fieldAttributeMasterId, jobId) {
    return async function (dispatch) {
        try {
            dispatch(setState(SKU_LIST_FETCHING_START, true))
            const skuListingDto = await skuListing.getSkuListingDto(fieldAttributeMasterId)
            const skuObjectValidation = await fieldAttributeValidation.getFieldAttributeValidationFromFieldAttributeId(skuListingDto.childFieldAttributeId[0])
            const skuValidationForImageAndReason = await fieldAttributeValidation.getFieldAttributeValidationFromFieldAttributeId(fieldAttributeMasterId)
            const skuData = await skuListing.prepareSkuListingData(skuListingDto.idFieldAttributeMap, jobId, skuObjectValidation, skuValidationForImageAndReason)
            const skuArrayChildAttributes = await skuListing.getSkuChildAttributes(skuListingDto.idFieldAttributeMap, skuData.attributeTypeIdValueMap)
            dispatch(setState(SKU_LIST_FETCHING_STOP, {
                skuListItems: skuData.skuObjectListDto,
                skuObjectValidation,
                skuArrayChildAttributes,
                skuObjectAttributeId: skuListingDto.childFieldAttributeId[0],
                skuValidationForImageAndReason,
                reasonsList: skuData.reasonsList,
            }))
            if (skuListingDto.isSkuCodePresent)
                dispatch(setState(SHOW_SEARCH_BAR))
        } catch (error) {
            dispatch(setState(SKU_LIST_FETCHING_START, false))    // false to stop sku loader        
            dispatch(showToastAndAddUserExceptionLog(2201, error.message, 'danger', 1))
        }
    }
}

export function scanSkuItem(skuListItems, skuCode) {
    return async function (dispatch) {
//use try catch and dispatch showToastAndAddUserExceptionLog in catch
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
export function updateSkuActualQuantityAndOtherData(value, rowItem, skuListItems, skuChildElements, skuValidationForImageAndReason) {
    return async function (dispatch) {
        try {
            if (rowItem.attributeTypeId == SKU_PHOTO || rowItem.attributeTypeId == SKU_REASON) {
                if (rowItem.attributeTypeId == SKU_PHOTO) {
                    value = await signatureService.saveFile(value, moment(), true)
                    dispatch(NavigationActions.back())
                    dispatch(setState(SET_SHOW_VIEW_IMAGE, {imageData: '', showImage: false, viewData: '' }))
                }
                let copyOfskuListItems = _.cloneDeep(skuListItems)
                copyOfskuListItems[rowItem.parentId].filter(item => item.attributeTypeId == rowItem.attributeTypeId)[0].value = value
                dispatch(setState(UPDATE_SKU_LIST_ITEMS, copyOfskuListItems))
            } else {
                const updatedSkuArray = skuListing.prepareUpdatedSkuArray(value, rowItem, skuListItems, skuChildElements, skuValidationForImageAndReason)
                dispatch(setState(UPDATE_SKU_ACTUAL_QUANTITY, {
                    skuListItems: updatedSkuArray.updatedObject,
                    skuRootChildElements: updatedSkuArray.updatedChildElements
                }))
            }
        } catch (error) {
            dispatch(showToastAndAddUserExceptionLog(2202, error.message, 'danger', 1))
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
export function saveSkuListItems(skuListItems, skuObjectValidation, skuRootChildItems, skuObjectAttributeId, jobTransaction, latestPositionId, parentObject, formElement, isSaveDisabled, navigation, skuValidationForImageAndReason) {
    return async function (dispatch) {
        try {
            const message = skuListing.getFinalCheckForValidation(skuObjectValidation, skuRootChildItems)
            if (!message) {
                const skuChildElements = skuListing.prepareSkuListChildElementsForSaving(skuListItems, skuRootChildItems, skuObjectAttributeId, skuValidationForImageAndReason)
                if (_.isNull(skuChildElements)) {
                    Toast.show({
                        text: `Please Fill all the Required Details`,
                        position: 'bottom',
                        buttonText: 'OK'
                    }) 
                } else {
                    let fieldDataListWithLatestPositionId = await fieldDataService.prepareFieldDataForTransactionSavingInState(skuChildElements, jobTransaction.id, parentObject.positionId, latestPositionId)
                    dispatch(updateFieldDataWithChildData(parentObject.fieldAttributeMasterId, formElement, isSaveDisabled, ARRAY_SAROJ_FAREYE, fieldDataListWithLatestPositionId, jobTransaction))
                }
            }
            else {
                Toast.show({
                    text: `${message}`,
                    position: 'bottom',
                    buttonText: 'OK'
                })
            }
        } catch (error) {
            dispatch(showToastAndAddUserExceptionLog(2203, error.message, 'danger', 1))
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