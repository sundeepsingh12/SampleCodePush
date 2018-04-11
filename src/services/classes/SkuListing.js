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
    NA
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

        let idFieldAttributeMap = new Map(), isSkuCodePresent = false
        const childFieldAttributeId = fieldAttributesList.value.filter(fieldAttributeObject => fieldAttributeObject.parentId == fieldAttributeMasterId &&
            fieldAttributeObject.attributeTypeId == OBJECT).map(object => object.id)

        fieldAttributesList.value.filter(fieldAttributeObject => fieldAttributeObject.parentId == childFieldAttributeId[0])
            .forEach(fieldAttribute => {
                if (fieldAttribute.attributeTypeId == SKU_CODE) {
                    isSkuCodePresent = true
                }
                const id = (fieldAttribute.jobAttributeMasterId == 0 || fieldAttribute.jobAttributeMasterId == null) ? fieldAttribute.attributeTypeId : fieldAttribute.jobAttributeMasterId
                idFieldAttributeMap.set(id, fieldAttribute)
            })

        fieldAttributesList.value.filter(fieldAttributeObject => fieldAttributeObject.parentId == fieldAttributeMasterId && fieldAttributeObject.attributeTypeId != OBJECT).forEach(fieldAttribute => {
            idFieldAttributeMap.set(fieldAttribute.attributeTypeId, fieldAttribute)
        })

        const skuListingDto = {
            idFieldAttributeMap,
            isSkuCodePresent,
            childFieldAttributeId
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
                    parentId,
                    autoIncrementId
                }
                innerArray.push(innerObject)
                autoIncrementId++
                if (innerObject.attributeTypeId == SKU_ORIGINAL_QUANTITY) {
                    originalQuantityValue = innerObject.value
                    totalOriginalQuantityValue += parseInt(originalQuantityValue)

                }
                else if (innerObject.attributeTypeId == SKU_UNIT_PRICE) {
                    unitPrice = parseInt(innerObject.value)
                    isUnitPricePresent = true

                }
                if (!isUnitPricePresent) {
                    skuActualAmount += (unitPrice * actualQuantityValue)
                }
            })
            skuActualQuantityObject = {
                label: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).label,
                attributeTypeId: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).attributeTypeId,
                value: (skuObjectValidation && skuObjectValidation.leftKey == 0) ? '0' : originalQuantityValue,
                id: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).id,
                parentId,
                autoIncrementId: autoIncrementId++
            }
            innerArray.push(skuActualQuantityObject)
            if (idFieldAttributeMap.get(SKU_REASON)) {
                const value0AndReasonAtZeroQuantity = originalQuantityValue == 0 && _.includes(this.props.skuValidationForImageAndReason.rightKey, 'reasonAtZeroQty') && skuObjectValidation.leftKey == 0
                const valueMaxAndReasonAtMaxQuantity = originalQuantityValue != 0 && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtMaxQty') && skuObjectValidation.leftKey != 0
                let skuReason = {
                    label: idFieldAttributeMap.get(SKU_REASON).label,
                    attributeTypeId: idFieldAttributeMap.get(SKU_REASON).attributeTypeId,
                    value: (skuObjectValidation && skuValidationForImageAndReason && (valueMaxAndReasonAtMaxQuantity || value0AndReasonAtZeroQuantity)) ? REASON : null,
                    id: idFieldAttributeMap.get(SKU_REASON).id,
                    parentId,
                    autoIncrementId: autoIncrementId++
                }
                innerArray.push(skuReason)
            }
            if (idFieldAttributeMap.get(SKU_PHOTO)) {
                const value0AndImageAtZeroQuantity = originalQuantityValue == 0 && _.includes(this.props.skuValidationForImageAndReason.leftKey, 'imageAtZeroQty') && skuObjectValidation.leftKey != 0
                const valueMaxAndImageAtMaxQuantity = originalQuantityValue != 0 && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtMaxQty') && skuObjectValidation.leftKey != 0
                let skuPhoto = {
                    label: idFieldAttributeMap.get(SKU_PHOTO).label,
                    attributeTypeId: idFieldAttributeMap.get(SKU_PHOTO).attributeTypeId,
                    value: (skuObjectValidation && skuValidationForImageAndReason && (valueMaxAndImageAtMaxQuantity || value0AndImageAtZeroQuantity)) ? OPEN_CAMERA : null,
                    id: idFieldAttributeMap.get(SKU_PHOTO).id,
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
            attributeTypeId: TOTAL_ACTUAL_QUANTITY
        }
        childAttributesList[TOTAL_ACTUAL_QUANTITY] = totalActualQty
        const totalOriginalQty = {
            fieldAttributeMasterId: idFieldAttributeMap.get(TOTAL_ORIGINAL_QUANTITY).id,
            value: attributeTypeIdValueMap[TOTAL_ORIGINAL_QUANTITY],
            attributeTypeId: TOTAL_ORIGINAL_QUANTITY
        }
        childAttributesList[TOTAL_ORIGINAL_QUANTITY] = totalOriginalQty

        const skuActualAmount = {
            fieldAttributeMasterId: idFieldAttributeMap.get(SKU_ACTUAL_AMOUNT).id,
            value: attributeTypeIdValueMap[SKU_ACTUAL_AMOUNT],
            attributeTypeId: SKU_ACTUAL_AMOUNT
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

    prepareSkuListChildElementsForSaving(skuListItems, skuRootChildItems, skuObjectAttributeId, skuValidationForImageAndReason) {
        let ShouldProceedOrNot = true
        if (!skuObjectAttributeId) {
            throw new Error('Sku Object AttributeId missing')
        }

        if (!skuListItems) {
            throw new Error('Sku list items missing')
        }
        let childElementsArray = []
        for (let index in skuListItems) {
            const childDataList = []
            const originalQuantityValue = parseInt(skuListItems[index].filter(object => object.attributeTypeId == SKU_ORIGINAL_QUANTITY).map(item => item.value)[0])
            const actualQuantityValue = parseInt(skuListItems[index].filter(object => object.attributeTypeId == SKU_ACTUAL_QUANTITY).map(item => item.value)[0])
            const imageAtMaxQty = actualQuantityValue == originalQuantityValue && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtMaxQty')
            const imageAt0Qty = actualQuantityValue == 0 && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtZeroQty')
            const imageAtAnyQty = actualQuantityValue != 0 && actualQuantityValue != originalQuantityValue && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtAnyQty')
            const reasonAtMaxQty = actualQuantityValue == originalQuantityValue && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtMaxQty')
            const reasonAt0Qty = actualQuantityValue == 0 && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtZeroQty')
            const reasonAtAnyQty = actualQuantityValue != 0 && actualQuantityValue != originalQuantityValue && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtAnyQty')
            skuListItems[index].forEach(skuItem => {
                if (skuValidationForImageAndReason && ((skuItem.attributeTypeId == SKU_PHOTO && skuItem.value == OPEN_CAMERA && (imageAtMaxQty || imageAt0Qty || imageAtAnyQty)) || (skuItem.attributeTypeId == SKU_REASON && (skuItem.value == REASON || skuItem.value < 0) && (reasonAtMaxQty || reasonAt0Qty || reasonAtAnyQty)))) {
                    ShouldProceedOrNot = false
                }
                const skuObjectChild = {
                    attributeTypeId: skuItem.attributeTypeId,
                    value: skuItem.value,
                    fieldAttributeMasterId: skuItem.id
                }
                childDataList.push(skuObjectChild)
            })
            const skuObject = {
                attributeTypeId: OBJECT,
                childDataList,
                value: OBJECT_SAROJ_FAREYE,
                fieldAttributeMasterId: skuObjectAttributeId
            }
            childElementsArray.push(skuObject)
        }
        for (let index in skuRootChildItems) {
            childElementsArray.push(skuRootChildItems[index])
        }
        return (ShouldProceedOrNot) ? childElementsArray : null
    }

    prepareUpdatedSkuArray(value, rowItem, skuListItems, skuChildElements, skuValidationForImageAndReason) {
        const updatedObject = JSON.parse(JSON.stringify(skuListItems))
        const updatedChildElements = JSON.parse(JSON.stringify(skuChildElements))
        let totalOriginalQuantityValue = 0, totalActualQuantity = 0, skuActualAmount = 0
        for (let index in updatedObject) {
            let unitPrice = 0, actualQuantity = 0
            const originalQuantityValue = parseInt(updatedObject[index].filter(object => object.attributeTypeId == SKU_ORIGINAL_QUANTITY).map(item => item.value)[0])
            updatedObject[index].forEach(item => {
                let isUnitPricePresent = false
                if (item.attributeTypeId == SKU_ORIGINAL_QUANTITY) {
                    totalOriginalQuantityValue += parseInt(item.value)
                    isUnitPricePresent = true

                } else if (item.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                    if (rowItem.parentId == item.parentId && rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                        item.value = value
                    }
                    actualQuantity = item.value
                    totalActualQuantity += parseInt(item.value)
                } else if (item.attributeTypeId == SKU_UNIT_PRICE) {
                    unitPrice = item.value
                } else if (item.attributeTypeId == SKU_REASON && rowItem.parentId == item.parentId && rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                    const reasonAt0Qty = value == 0 && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtZeroQty')
                    const reasonAtAnyQty = value != 0 && value != originalQuantityValue && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtAnyQty')
                    const reasonAtMaxQty = value == originalQuantityValue && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtMaxQty')
                    item.value = (skuValidationForImageAndReason && (reasonAtMaxQty || reasonAt0Qty || reasonAtAnyQty)) ? REASON : null
                } else if (item.attributeTypeId == SKU_PHOTO && rowItem.parentId == item.parentId && rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                    const imageAt0Qty = value == 0 && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtZeroQty')
                    const imageAtAnyQty = value != 0 && value != originalQuantityValue && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtAnyQty')
                    const imageAtMaxQty = value == originalQuantityValue && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtMaxQty')
                    item.value = (skuValidationForImageAndReason && (imageAtMaxQty || imageAt0Qty || imageAtAnyQty)) ? OPEN_CAMERA : null
                }
                if (!isUnitPricePresent) {
                    skuActualAmount += (unitPrice * actualQuantity)
                }
            })
        }
        updatedChildElements[TOTAL_ORIGINAL_QUANTITY].value = totalOriginalQuantityValue
        updatedChildElements[TOTAL_ACTUAL_QUANTITY].value = totalActualQuantity
        updatedChildElements[SKU_ACTUAL_AMOUNT].value = skuActualAmount
        return {
            updatedObject,
            updatedChildElements
        }
    }


    scanSKUCode(skuListItems, skuCode, skuObjectValidation) {
        let cloneSKUListItems = _.cloneDeep(skuListItems), errorMessage
        for (let listItemIndex in cloneSKUListItems) {
            let codeMatches = false, orignalQuantityAndActualQuantity = {}
            for (let skuComponentIndex in cloneSKUListItems[listItemIndex]) {
                if (cloneSKUListItems[listItemIndex][skuComponentIndex].attributeTypeId == SKU_CODE && _.isEqual(cloneSKUListItems[listItemIndex][skuComponentIndex].value.toLowerCase(), skuCode.toLowerCase())) {
                    codeMatches = true
                }
                if (cloneSKUListItems[listItemIndex][skuComponentIndex].attributeTypeId == SKU_ACTUAL_QUANTITY) {
                    orignalQuantityAndActualQuantity[ACTUAL_QUANTITY] = cloneSKUListItems[listItemIndex][skuComponentIndex]
                } else if (cloneSKUListItems[listItemIndex][skuComponentIndex].attributeTypeId == SKU_ORIGINAL_QUANTITY) {
                    orignalQuantityAndActualQuantity[ORIGNAL_QUANTITY] = cloneSKUListItems[listItemIndex][skuComponentIndex]
                }
            }
            if (codeMatches) {
                if (skuObjectValidation.leftKey) {
                    if (orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value == 0) {
                        errorMessage = SKU_CODE_MIN_LIMIT_REACHED
                    } else {
                        orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value = parseInt(orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value) - 1
                    }
                } else {
                    if (orignalQuantityAndActualQuantity[ORIGNAL_QUANTITY].value == orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value) {
                        errorMessage = SKU_CODE_MAX_LIMIT_REACHED
                    } else {
                        orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value = parseInt(orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value) + 1
                    }
                }
                break
            }
        }
        console.logs('cloneSKUListItems', cloneSKUListItems, skuListItems)
        return { errorMessage, cloneSKUListItems }
    }
}

export let skuListing = new SkuListing()