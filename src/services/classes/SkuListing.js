'use strict'
import {
    FIELD_ATTRIBUTE,
    FIELD_ATTRIBUTE_STATUS,
    TABLE_JOB_DATA,
    FIELD_ATTRIBUTE_VALUE,
} from '../../lib/constants'
import {
    keyValueDBService
} from './KeyValueDBService'
import { jobDataService } from './JobData'
import * as realm from '../../repositories/realmdb'
import {
    SKU_ORIGINAL_QUANTITY,
    SKU_CODE,
    SKU_ACTUAL_QUANTITY,
    TOTAL_ORIGINAL_QUANTITY,
    TOTAL_ACTUAL_QUANTITY,
    SKU_ACTUAL_AMOUNT,
    SKU_UNIT_PRICE,
    OBJECT,
    OBJECT_SAROJ_FAREYE,
    SKU_PHOTO,
    SKU_REASON,
    NA,
    UNIT_PRICE,
} from '../../lib/AttributeConstants'
import {
    fieldAttributeStatusService
} from './FieldAttributeStatus'
import {
    SELECT_ANY_REASON,
    TOTAL_ORG_QTY_NOT_EQUAL_TOTAL_ACTUAL_QTY,
    QTY_NOT_ZERO,
    TOTAL_ORG_QTY_EQUAL_TOTAL_ACTUAL_QTY,
    QTY_ZERO,
    REASON,
    OPEN_CAMERA,
    ORIGNAL_QUANTITY,
    ACTUAL_QUANTITY,
    SKU_CODE_MAX_LIMIT_REACHED,
    SKU_CODE_MIN_LIMIT_REACHED,
    PHOTO,
    RESULT_NOT_FOUND,
} from '../../lib/ContainerConstants'
import _ from 'lodash'
class SkuListing {

    async getSkuListingDto(fieldAttributeMasterId) {
        if (!fieldAttributeMasterId) {
            throw new Error('Field Attribute master id missing')
        }

        const fieldAttributesList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
        if (!fieldAttributesList || !fieldAttributesList.value) {
            throw new Error('Field Attributes missing in store')
        }

        let idFieldAttributeMap = new Map(), isSkuCodePresent = false, childFieldAttributeId, childFieldAttributeKey
        let fieldAttributesListValues = fieldAttributesList.value
        fieldAttributesListValues.map(fieldAttributeObject => {
            if (fieldAttributeObject.parentId == fieldAttributeMasterId && fieldAttributeObject.attributeTypeId == OBJECT) {
                childFieldAttributeId = fieldAttributeObject.id
                childFieldAttributeKey = fieldAttributeObject.key
            }
        })
        for (let index in fieldAttributesListValues) {
            if (fieldAttributesListValues[index].parentId == childFieldAttributeId) {
                if (fieldAttributesListValues[index].attributeTypeId == SKU_CODE) {
                    isSkuCodePresent = true
                }
                const id = (fieldAttributesListValues[index].jobAttributeMasterId == 0 || fieldAttributesListValues[index].jobAttributeMasterId == null) ? fieldAttributesListValues[index].attributeTypeId : fieldAttributesListValues[index].jobAttributeMasterId
                idFieldAttributeMap.set(id, fieldAttributesListValues[index])
            }
            if (fieldAttributesListValues[index].parentId == fieldAttributeMasterId && fieldAttributesListValues[index].attributeTypeId != OBJECT) {
                idFieldAttributeMap.set(fieldAttributesListValues[index].attributeTypeId, fieldAttributesListValues[index])
            }
        }
        const skuListingDto = {
            idFieldAttributeMap,
            isSkuCodePresent,
            childFieldAttributeId,
            childFieldAttributeKey
        }

        return skuListingDto
    }

    /**
     * 
     * @param {*} idFieldAttributeMap 
     * @param {*} jobId 
     * 
     * idFieldAttributeMap - fieldAttributeTypeId/JobAttributeId Vs FieldAttribute Map
     */
    async prepareSkuListingData(idFieldAttributeMap, jobId, skuObjectValidation, skuValidationForImageAndReason) {
        if (!jobId) {
            throw new Error('Job id missing')
        }
        let reasonsList, skuActualQuantityObject, originalQuantityValue = 0
        let query = Array.from(idFieldAttributeMap.keys()).map(jobAttributeId => `jobAttributeMasterId = ${jobAttributeId}`).join(' OR ')
        query = `(${query}) AND jobId = ${jobId}`
        const jobDatas = realm.getRecordListOnQuery(TABLE_JOB_DATA, query)
        let autoIncrementId = 0, skuObjectListDto = {}, attributeTypeIdValueMap = {}, totalActualQuantityValue = 0, totalOriginalQuantityValue = 0, skuActualAmount = 0
        const parentIdJobDataListMap = jobDataService.getParentIdJobDataListMap(jobDatas)
        for (let parentId in parentIdJobDataListMap) {
            let innerArray = [], unitPrice = 0, actualQuantityValue = 0
            parentIdJobDataListMap[parentId].forEach(jobData => {
                let isUnitPricePresent = false
                const fieldAttribute = idFieldAttributeMap.get(jobData.jobAttributeMasterId)
                let innerObject = {
                    label: fieldAttribute.label,
                    attributeTypeId: fieldAttribute.attributeTypeId,
                    value: jobData.value,
                    id: fieldAttribute.id,
                    key: fieldAttribute.key,
                    parentId,
                    autoIncrementId
                }
                innerArray.push(innerObject)
                autoIncrementId++
                if (innerObject.attributeTypeId == SKU_ORIGINAL_QUANTITY) {
                    originalQuantityValue = innerObject.value
                    totalOriginalQuantityValue += parseInt(originalQuantityValue)

                } else if (innerObject.attributeTypeId == SKU_UNIT_PRICE) {
                    unitPrice = parseInt(innerObject.value)
                    isUnitPricePresent = true
                }
                if (!isUnitPricePresent) {
                    actualQuantityValue = (skuObjectValidation && skuObjectValidation.leftKey == 1) ? originalQuantityValue : 0
                    skuActualAmount += (unitPrice * actualQuantityValue)
                }
            })
            skuActualQuantityObject = {
                label: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).label,
                attributeTypeId: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).attributeTypeId,
                value: (skuObjectValidation && skuObjectValidation.leftKey == 0) ? '0' : originalQuantityValue,
                id: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).id,
                key: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).key,
                parentId,
                autoIncrementId: autoIncrementId++
            }
            innerArray.push(skuActualQuantityObject)
            if (idFieldAttributeMap.get(SKU_REASON)) {
                let value0AndReasonAtZeroQuantity, valueMaxAndReasonAtMaxQuantity
                if (skuValidationForImageAndReason && skuObjectValidation && skuObjectValidation.leftKey) {
                    value0AndReasonAtZeroQuantity = _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtZeroQty') && skuObjectValidation.leftKey == 0
                    valueMaxAndReasonAtMaxQuantity = _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtMaxQty') && skuObjectValidation.leftKey != 0
                }
                let skuReason = {
                    label: idFieldAttributeMap.get(SKU_REASON).label,
                    attributeTypeId: idFieldAttributeMap.get(SKU_REASON).attributeTypeId,
                    value: (valueMaxAndReasonAtMaxQuantity || value0AndReasonAtZeroQuantity) ? REASON : null,
                    id: idFieldAttributeMap.get(SKU_REASON).id,
                    key: idFieldAttributeMap.get(SKU_REASON).key,
                    parentId,
                    autoIncrementId: autoIncrementId++
                }
                innerArray.push(skuReason)
            }
            if (idFieldAttributeMap.get(SKU_PHOTO)) {
                let value0AndImageAtZeroQuantity, valueMaxAndImageAtMaxQuantity
                if (skuValidationForImageAndReason && skuObjectValidation && skuObjectValidation.leftKey) {
                    value0AndImageAtZeroQuantity = skuValidationForImageAndReason && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtZeroQty') && skuObjectValidation.leftKey == 0
                    valueMaxAndImageAtMaxQuantity = skuValidationForImageAndReason && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtMaxQty') && skuObjectValidation.leftKey != 0
                }
                let skuPhoto = {
                    label: idFieldAttributeMap.get(SKU_PHOTO).label,
                    attributeTypeId: idFieldAttributeMap.get(SKU_PHOTO).attributeTypeId,
                    value: (valueMaxAndImageAtMaxQuantity || value0AndImageAtZeroQuantity) ? OPEN_CAMERA : null,
                    id: idFieldAttributeMap.get(SKU_PHOTO).id,
                    key: idFieldAttributeMap.get(SKU_PHOTO).key,
                    parentId,
                    autoIncrementId: autoIncrementId
                }
                innerArray.push(skuPhoto)
            }
            actualQuantityValue = parseInt(skuActualQuantityObject.value)
            totalActualQuantityValue += actualQuantityValue
            autoIncrementId++
            skuObjectListDto[parentId] = innerArray
        }
        if (skuValidationForImageAndReason && (!_.isEmpty(skuValidationForImageAndReason.rightKey) || !_.isEmpty(skuValidationForImageAndReason.leftKey))) {
            const fieldAttributeValueList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE)
            if (!fieldAttributeValueList || !fieldAttributeValueList.value) {
                throw new Error('Field attributes missing in store')
            }
            reasonsList = fieldAttributeValueList.value.filter(item => item.fieldAttributeMasterId == idFieldAttributeMap.get(SKU_REASON).id)
            let selectAnyReason = {
                id: -999999,
                name: SELECT_ANY_REASON,
                code: -43210,
                fieldAttributeMasterId: -43210,
                sequence: -1
            }
            reasonsList.push(selectAnyReason)
            reasonsList.sort(function (reason1, reason2) {
                return reason1.sequence - reason2.sequence
            })
        }
        attributeTypeIdValueMap[TOTAL_ORIGINAL_QUANTITY] = totalOriginalQuantityValue
        attributeTypeIdValueMap[TOTAL_ACTUAL_QUANTITY] = totalActualQuantityValue
        attributeTypeIdValueMap[SKU_ACTUAL_AMOUNT] = skuActualAmount
        return {
            skuObjectListDto,
            attributeTypeIdValueMap,
            reasonsList,
        }
    }

    getSkuChildAttributes(idFieldAttributeMap, attributeTypeIdValueMap) {
        const childAttributesList = {}
        if (!idFieldAttributeMap.has(TOTAL_ACTUAL_QUANTITY)) {
            throw new Error('Total Actual Quantity missing')
        }

        if (!idFieldAttributeMap.has(SKU_ACTUAL_AMOUNT)) {
            throw new Error('Sku Actual Amount missing')
        }

        if (!idFieldAttributeMap.has(TOTAL_ORIGINAL_QUANTITY)) {
            throw new Error('Total Original Quantity missing')
        }

        const totalActualQty = {
            fieldAttributeMasterId: idFieldAttributeMap.get(TOTAL_ACTUAL_QUANTITY).id,
            value: attributeTypeIdValueMap[TOTAL_ACTUAL_QUANTITY],
            attributeTypeId: TOTAL_ACTUAL_QUANTITY,
            key: idFieldAttributeMap.get(TOTAL_ACTUAL_QUANTITY).key
        }
        childAttributesList[TOTAL_ACTUAL_QUANTITY] = totalActualQty
        const totalOriginalQty = {
            fieldAttributeMasterId: idFieldAttributeMap.get(TOTAL_ORIGINAL_QUANTITY).id,
            value: attributeTypeIdValueMap[TOTAL_ORIGINAL_QUANTITY],
            attributeTypeId: TOTAL_ORIGINAL_QUANTITY,
            key: idFieldAttributeMap.get(TOTAL_ORIGINAL_QUANTITY).key
        }
        childAttributesList[TOTAL_ORIGINAL_QUANTITY] = totalOriginalQty

        const skuActualAmount = {
            fieldAttributeMasterId: idFieldAttributeMap.get(SKU_ACTUAL_AMOUNT).id,
            value: attributeTypeIdValueMap[SKU_ACTUAL_AMOUNT],
            attributeTypeId: SKU_ACTUAL_AMOUNT,
            key: idFieldAttributeMap.get(SKU_ACTUAL_AMOUNT).key
        }
        childAttributesList[SKU_ACTUAL_AMOUNT] = skuActualAmount
        return childAttributesList
    }

    getFinalCheckForValidation(skuObjectValidation, skuRootChildElements) {

        if (!skuObjectValidation) {
            throw new Error('Sku Object validation missing')
        }
        if (!skuRootChildElements) {
            throw new Error('Sku child elements missing')
        }
        const rightKey = (skuObjectValidation) ? skuObjectValidation.rightKey : null
        let message
        if (!rightKey) return
        if (rightKey != null && rightKey.includes("1")) {
            if (skuRootChildElements[TOTAL_ACTUAL_QUANTITY] && skuRootChildElements[TOTAL_ORIGINAL_QUANTITY] && skuRootChildElements[TOTAL_ACTUAL_QUANTITY].value == skuRootChildElements[TOTAL_ORIGINAL_QUANTITY].value)
                message = TOTAL_ORG_QTY_NOT_EQUAL_TOTAL_ACTUAL_QTY
        } else if (rightKey.includes("2")) {
            if (skuRootChildElements[TOTAL_ACTUAL_QUANTITY] && skuRootChildElements[TOTAL_ACTUAL_QUANTITY].value == 0)
                message = QTY_NOT_ZERO
        } else if (rightKey.includes("3")) {
            if (skuRootChildElements[TOTAL_ACTUAL_QUANTITY] && skuRootChildElements[TOTAL_ORIGINAL_QUANTITY] && skuRootChildElements[TOTAL_ACTUAL_QUANTITY].value != skuRootChildElements[TOTAL_ORIGINAL_QUANTITY].value)
                message = TOTAL_ORG_QTY_EQUAL_TOTAL_ACTUAL_QTY
        } else if (rightKey.includes("4")) {
            if (skuRootChildElements[TOTAL_ACTUAL_QUANTITY] && skuRootChildElements[TOTAL_ACTUAL_QUANTITY].value != 0)
                message = QTY_ZERO
        }
        return message
    }

    /**
     * 
     * @param {*} skuListItems 
     * @param {*} skuRootChildItems 
     * @param {*} skuObjectAttributeId 
     * 
     * 
     * Sample Return type
     * 
     * childElementsArray : []
     */

    prepareSkuListChildElementsForSaving(skuListItems, skuRootChildItems, skuObjectAttributeId, skuValidationForImageAndReason, skuObjectAttributeKey) {
        let ShouldProceedOrNot = true
        if (!skuObjectAttributeId) {
            throw new Error('Sku Object AttributeId missing')
        }

        if (!skuListItems) {
            throw new Error('Sku list items missing')
        }
        let childElementsArray = []
        for (let index in skuListItems) {
            let childDataList = [], imageAtMaxQty, imageAt0Qty, imageAtAnyQty, reasonAtMaxQty, reasonAt0Qty, reasonAtAnyQty
            const originalQuantityValue = parseInt(skuListItems[index].filter(object => object.attributeTypeId == SKU_ORIGINAL_QUANTITY).map(item => item.value)[0])
            const actualQuantityValue = parseInt(skuListItems[index].filter(object => object.attributeTypeId == SKU_ACTUAL_QUANTITY).map(item => item.value)[0])
            if (skuValidationForImageAndReason) {
                imageAtMaxQty = (actualQuantityValue == originalQuantityValue && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtMaxQty'))
                imageAt0Qty = actualQuantityValue == 0 && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtZeroQty')
                imageAtAnyQty = actualQuantityValue != 0 && actualQuantityValue != originalQuantityValue && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtAnyQty')
                reasonAtMaxQty = actualQuantityValue == originalQuantityValue && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtMaxQty')
                reasonAt0Qty = actualQuantityValue == 0 && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtZeroQty')
                reasonAtAnyQty = actualQuantityValue != 0 && actualQuantityValue != originalQuantityValue && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtAnyQty')
            }
            skuListItems[index].forEach(skuItem => {
                if (skuValidationForImageAndReason && ((skuItem.attributeTypeId == SKU_PHOTO && skuItem.value == OPEN_CAMERA && (imageAtMaxQty || imageAt0Qty || imageAtAnyQty)) || (skuItem.attributeTypeId == SKU_REASON && (skuItem.value == REASON || skuItem.value < 0) && (reasonAtMaxQty || reasonAt0Qty || reasonAtAnyQty)))) {
                    ShouldProceedOrNot = false
                }
                const skuObjectChild = {
                    attributeTypeId: skuItem.attributeTypeId,
                    value: skuItem.value,
                    fieldAttributeMasterId: skuItem.id,
                    key: skuItem.key
                }
                childDataList.push(skuObjectChild)
            })
            const skuObject = {
                attributeTypeId: OBJECT,
                childDataList,
                value: OBJECT_SAROJ_FAREYE,
                fieldAttributeMasterId: skuObjectAttributeId,
                key: skuObjectAttributeKey
            }
            childElementsArray.push(skuObject)
        }
        for (let index in skuRootChildItems) {
            childElementsArray.push(skuRootChildItems[index])
        }
        return (ShouldProceedOrNot) ? childElementsArray : null
    }

    prepareUpdatedSkuArray(value, rowItem, skuListItems, skuChildElements, skuValidationForImageAndReason) {
       //TODO
       //Change this logic because for changing one row's actual quantity we are calculating values for whole sku array objects which is taking O(NM) which can be done in O(M)
        const updatedObject = JSON.parse(JSON.stringify(skuListItems))
        const updatedChildElements = JSON.parse(JSON.stringify(skuChildElements))
        let totalActualQuantity = 0, skuActualAmount = 0
        for (let index in updatedObject) {
            let unitPrice = 0, actualQuantity = 0, isUnitPricePresent = false
            const originalQuantityValue = parseInt(updatedObject[index].filter(object => object.attributeTypeId == SKU_ORIGINAL_QUANTITY).map(item => item.value)[0])
            updatedObject[index].forEach(item => {
                if (item.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                    if (rowItem.parentId == item.parentId && rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                        item.value = value
                    }
                    actualQuantity = parseInt(item.value)
                    totalActualQuantity += parseInt(item.value)
                } else if (item.attributeTypeId == SKU_UNIT_PRICE) {
                    unitPrice = item.value
                } else if (item.attributeTypeId == SKU_REASON && rowItem.parentId == item.parentId && rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                    item.value = this.changeSKUReasonStatus(parseInt(value), skuValidationForImageAndReason, originalQuantityValue)
                } else if (item.attributeTypeId == SKU_PHOTO && rowItem.parentId == item.parentId && rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                    item.value = this.changeSKUPhotoStatus(parseInt(value), skuValidationForImageAndReason, originalQuantityValue)
                }
                if (!isUnitPricePresent && unitPrice > 0 && actualQuantity > 0) {
                    skuActualAmount += (unitPrice * actualQuantity)
                    isUnitPricePresent = true
                }
            })
        }
        updatedChildElements[TOTAL_ACTUAL_QUANTITY].value = totalActualQuantity
        updatedChildElements[SKU_ACTUAL_AMOUNT].value = skuActualAmount
        return {
            updatedObject,
            updatedChildElements
        }
    }


    scanSKUCode(functionParams) {
        let { skuListItems, searchText, skuObjectValidation, skuValidationForImageAndReason, skuChildItems } = functionParams
        let cloneSKUListItems = _.cloneDeep(skuListItems), errorMessage, cloneSkuChildItems = _.cloneDeep(skuChildItems)
        for (let listItemIndex in cloneSKUListItems) {
            let codeMatches = false, orignalQuantityAndActualQuantity = {}
            for (let skuComponentIndex in cloneSKUListItems[listItemIndex]) {
                if (cloneSKUListItems[listItemIndex][skuComponentIndex].attributeTypeId == SKU_CODE && _.isEqual(cloneSKUListItems[listItemIndex][skuComponentIndex].value.toLowerCase(), searchText.toLowerCase())) {
                    codeMatches = true
                }
                switch (cloneSKUListItems[listItemIndex][skuComponentIndex].attributeTypeId) {
                    case SKU_ACTUAL_QUANTITY:
                        orignalQuantityAndActualQuantity[ACTUAL_QUANTITY] = cloneSKUListItems[listItemIndex][skuComponentIndex]
                        break
                    case SKU_ORIGINAL_QUANTITY:
                        orignalQuantityAndActualQuantity[ORIGNAL_QUANTITY] = cloneSKUListItems[listItemIndex][skuComponentIndex]
                        break
                    case SKU_PHOTO:
                        orignalQuantityAndActualQuantity[PHOTO] = cloneSKUListItems[listItemIndex][skuComponentIndex]
                        break
                    case SKU_REASON:
                        orignalQuantityAndActualQuantity[REASON] = cloneSKUListItems[listItemIndex][skuComponentIndex]
                        break
                    case SKU_UNIT_PRICE:
                        orignalQuantityAndActualQuantity[UNIT_PRICE] = cloneSKUListItems[listItemIndex][skuComponentIndex]
                        break
                }
            }
            if (codeMatches) {
                let returnParam = this.changeSKUObjectWhenCodeMatches(skuObjectValidation, orignalQuantityAndActualQuantity, skuValidationForImageAndReason, cloneSkuChildItems)
                errorMessage = returnParam.errorMessage
                cloneSkuChildItems = returnParam.cloneSkuChildItems
                break
            } else {
                errorMessage = RESULT_NOT_FOUND;
            }
        }
        return { errorMessage, cloneSKUListItems, cloneSkuChildItems }
    }

    changeSKUObjectWhenCodeMatches(skuObjectValidation, orignalQuantityAndActualQuantity, skuValidationForImageAndReason, cloneSkuChildItems) {
        let errorMessage
        if (skuObjectValidation.leftKey == 1) {
            if (orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value == 0) {
                errorMessage = SKU_CODE_MIN_LIMIT_REACHED
            } else {
                cloneSkuChildItems[TOTAL_ACTUAL_QUANTITY].value -= 1
                orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value = parseInt(orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value) - 1
                cloneSkuChildItems[SKU_ACTUAL_AMOUNT].value = parseInt(cloneSkuChildItems[SKU_ACTUAL_AMOUNT].value) - parseInt(orignalQuantityAndActualQuantity[UNIT_PRICE].value)
            }
        } else {
            if (orignalQuantityAndActualQuantity[ORIGNAL_QUANTITY].value == orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value) {
                errorMessage = SKU_CODE_MAX_LIMIT_REACHED
            } else {
                cloneSkuChildItems[TOTAL_ACTUAL_QUANTITY].value += 1
                orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value = parseInt(orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value) + 1
                cloneSkuChildItems[SKU_ACTUAL_AMOUNT].value = parseInt(cloneSkuChildItems[SKU_ACTUAL_AMOUNT].value) + parseInt(orignalQuantityAndActualQuantity[UNIT_PRICE].value)
            }
        }
        if (!errorMessage) {
            orignalQuantityAndActualQuantity[PHOTO].value = this.changeSKUPhotoStatus(orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value, skuValidationForImageAndReason, orignalQuantityAndActualQuantity[ORIGNAL_QUANTITY].value)
            orignalQuantityAndActualQuantity[REASON].value = this.changeSKUReasonStatus(orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value, skuValidationForImageAndReason, orignalQuantityAndActualQuantity[ORIGNAL_QUANTITY].value)
        }
        return { errorMessage, cloneSkuChildItems }
    }

    changeSKUPhotoStatus(actualQuantityValue, skuValidationForImageAndReason, originalQuantityValue) {
        const imageAt0Qty = actualQuantityValue == 0 && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtZeroQty')
        const imageAtAnyQty = actualQuantityValue != 0 && actualQuantityValue != originalQuantityValue && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtAnyQty')
        const imageAtMaxQty = actualQuantityValue == originalQuantityValue && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtMaxQty')
        return (skuValidationForImageAndReason && (imageAtMaxQty || imageAt0Qty || imageAtAnyQty)) ? OPEN_CAMERA : null
    }

    changeSKUReasonStatus(actualQuantityValue, skuValidationForImageAndReason, originalQuantityValue) {
        const reasonAt0Qty = actualQuantityValue == 0 && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtZeroQty')
        const reasonAtAnyQty = actualQuantityValue != 0 && actualQuantityValue != originalQuantityValue && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtAnyQty')
        const reasonAtMaxQty = actualQuantityValue == originalQuantityValue && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtMaxQty')
        return (skuValidationForImageAndReason && (reasonAtMaxQty || reasonAt0Qty || reasonAtAnyQty)) ? REASON : null
    }
}

export let skuListing = new SkuListing()