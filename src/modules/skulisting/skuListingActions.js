'use strict'

import {
    SKU_LIST_FETCHING_STOP,
    SKU_LIST_FETCHING_START,
    SHOW_SEARCH_BAR,
    SKU_CODE_CHANGE,
    UPDATE_SKU_ACTUAL_QUANTITY,
    UPDATE_SKU_LIST_ITEMS,
    SkuListing,
    NEXT_FOCUS,
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
    NA,
    SKUVALIDATION
} from '../../lib/AttributeConstants'
import { NavigationActions } from 'react-navigation'

import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { fieldDataService } from '../../services/classes/FieldData'
import {
    setState, navigateToScene, showToastAndAddUserExceptionLog
} from '../global/globalActions'
import {
    Toast
} from 'native-base'
import { getNextFocusableAndEditableElements } from '../form-layout/formLayoutActions'
import { SKIP_SKU_MESSAGE, OK } from '../../lib/ContainerConstants'

export function prepareSkuList(fieldAttributeMaster, jobId) {
    return async function (dispatch) {
        try {
            dispatch(setState(SKU_LIST_FETCHING_START, true))
            const skuListingDto = await skuListing.getSkuListingDto(fieldAttributeMaster.fieldAttributeMasterId)
            const skuObjectValidation = await fieldAttributeValidation.getFieldAttributeValidationFromFieldAttributeId(skuListingDto.childFieldAttributeId)
            const skuValidationForImageAndReason = fieldAttributeMaster.validation ? fieldAttributeMaster.validation.filter(validation => validation.timeOfExecution == SKUVALIDATION)[0] : null;
            const skuData = await skuListing.prepareSkuListingData(skuListingDto.idFieldAttributeMap, jobId, skuObjectValidation, skuValidationForImageAndReason)
            const skuArrayChildAttributes = await skuListing.getSkuChildAttributes(skuListingDto.idFieldAttributeMap, skuData.attributeTypeIdValueMap)
            dispatch(setState(SKU_LIST_FETCHING_STOP, {
                skuListItems: skuData.skuObjectListDto,
                skuObjectValidation,
                skuArrayChildAttributes,
                skuObjectAttributeId: skuListingDto.childFieldAttributeId,
                skuObjectAttributeKey: skuListingDto.childFieldAttributeKey,
                skuValidationForImageAndReason,
                reasonsList: skuData.reasonsList,
                skuCodeMap: skuData.skuCodeMap
            }))
        } catch (error) {
            dispatch(setState(SKU_LIST_FETCHING_START, false))    // false to stop sku loader        
            showToastAndAddUserExceptionLog(2201, error.message, 'danger', 1)
        }
    }
}

export function scanSkuItem(functionParams) {
    return async function (dispatch) {
        try {
            let { errorMessage, cloneSKUListItems, cloneSkuChildItems } = await skuListing.scanSKUCode(functionParams)
            if (errorMessage) {
                Toast.show({
                    text: errorMessage,
                    position: 'bottom',
                    buttonText: 'OK'
                })
            } else {
                dispatch(setState(UPDATE_SKU_ACTUAL_QUANTITY, { skuListItems: cloneSKUListItems, skuRootChildElements: cloneSkuChildItems }))
            }
        } catch (error) {
            dispatch(showToastAndAddUserExceptionLog(2204, error.message, 'danger', 1))
        }
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
export function updateSkuActualQuantityAndOtherData(value, rowItem, skuListItems, skuChildElements, skuValidationForImageAndReason, jobId,goBack) {
    return async function (dispatch) {
        try {
            if (rowItem.attributeTypeId == SKU_PHOTO || rowItem.attributeTypeId == SKU_REASON) {
                if (rowItem.attributeTypeId == SKU_PHOTO) {
                    value = await signatureService.saveFile(value, moment(), true)
                    // dispatch(NavigationActions.back())
                    goBack()
                }
                let copyOfskuListItems = _.cloneDeep(skuListItems)
                copyOfskuListItems[jobId][rowItem.parentId].filter(item => item.attributeTypeId == rowItem.attributeTypeId)[0].value = value
                dispatch(setState(UPDATE_SKU_LIST_ITEMS, copyOfskuListItems))
            } else {
                const updatedSkuArray = skuListing.prepareUpdatedSkuArray(value, rowItem, skuListItems, skuChildElements, skuValidationForImageAndReason, jobId)
                dispatch(setState(UPDATE_SKU_ACTUAL_QUANTITY, {
                    skuListItems: updatedSkuArray.updatedSkuList,
                    skuRootChildElements: updatedSkuArray.updatedSkuChildList
                }))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(2202, error.message, 'danger', 1)
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
export function saveSkuListItems(skuListItems, skuObjectValidation, skuRootChildItems, skuObjectAttributeId, jobTransactionList, parentObject, formLayoutState, skuValidationForImageAndReason, skuObjectAttributeKey,navigate) {
    return async function (dispatch) {
        try {
            let jobTransaction = _.isArray(jobTransactionList) ? jobTransactionList : [jobTransactionList]
            const message = skuListing.getFinalCheckForValidation(skuObjectValidation, skuRootChildItems)
            if (!message) {
                let fieldDataListWithLatestPositionId = {}
                fieldDataListWithLatestPositionId.fieldDataList = {}
                let positionId = formLayoutState.latestPositionId, checkForSkuChild = false, skuChildElements
                for (let id in jobTransaction) {
                    let jobId = jobTransaction[id].jobId
                    let jobTransactionId = jobTransaction[id].jobTransactionId ? jobTransaction[id].jobTransactionId : jobTransaction[id].id
                    skuChildElements = skuListing.prepareSkuListChildElementsForSaving(skuListItems[jobId], skuRootChildItems[jobId], skuObjectAttributeId, skuValidationForImageAndReason, skuObjectAttributeKey, jobId)
                    if (_.isEmpty(skuChildElements)) {
                        break;
                    } else {
                        let { fieldDataList, latestPositionId } = await fieldDataService.prepareFieldDataForTransactionSavingInState(skuChildElements, jobTransactionId, parentObject.positionId, positionId)
                        fieldDataListWithLatestPositionId.fieldDataList[jobTransactionId] = {}
                        fieldDataListWithLatestPositionId.fieldDataList[jobTransactionId].childDataList = fieldDataList
                        positionId = latestPositionId
                    }
                }
                if (_.isEmpty(skuChildElements)) {
                    Toast.show({
                        text: `Please Fill all the Required Details`,
                        position: 'bottom',
                        buttonText: OK
                    })
                } else {
                    fieldDataListWithLatestPositionId.latestPositionId = positionId
                    dispatch(updateFieldDataWithChildData(parentObject.fieldAttributeMasterId, formLayoutState, ARRAY_SAROJ_FAREYE, fieldDataListWithLatestPositionId, jobTransaction,null,null,navigate))
                }
            }
            else {
                Toast.show({
                    text: `${message}`,
                    position: 'bottom',
                    buttonText: OK
                })
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(2203, error.message, 'danger', 1)
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

/**
 * This method checks if SKU is in new job or normal job
 * if in new job then show toast message and skip SKU by saving NA in it
 * else open SkuListing
 * @param {*} routeParams 
 */
export function checkForNewJob(routeParams,navigate) {
    return async function (dispatch) {
        try {
            let { currentElement, jobTransaction } = routeParams
            //case of new job
            if (jobTransaction.id < 0 && jobTransaction.jobId < 0) {
                Toast.show({
                    text: SKIP_SKU_MESSAGE,
                    position: 'bottom',
                    buttonText: OK, duration: 5000
                })
                dispatch(getNextFocusableAndEditableElements(currentElement.fieldAttributeMasterId, routeParams.formLayoutState, NA, NEXT_FOCUS, jobTransaction))// save NA as value
            } else {
                dispatch(navigateToScene(SkuListing, routeParams,navigate))//navigate to SkuListing
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(2205, error.message, 'danger', 1)
        }
    }
}