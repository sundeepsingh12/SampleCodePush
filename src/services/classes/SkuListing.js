'use strict'
import {
    FIELD_ATTRIBUTE,
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
} from '../../lib/AttributeConstants'

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
    UNIT_PRICE,
    ACTUAL_AMOUNT
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
    async prepareSkuListingData(idFieldAttributeMap, jobTransactionList, skuObjectValidation, skuValidationForImageAndReason) {
        if (_.isEmpty(jobTransactionList)) {
            throw new Error('JobTransactions is missing')
        }
        let reasonsList = [], skuActualQuantityObject, autoIncrementId = 0, skuCodeMap = {}
        let query = Array.from(idFieldAttributeMap.keys()).map(jobAttributeId => `jobAttributeMasterId = ${jobAttributeId}`).join(' OR ')
        query = `(${query}) AND (${jobTransactionList.map(jobTransaction => `jobId = ${jobTransaction.jobId}`).join(' OR ')})`
        const jobDatas = realm.getRecordListOnQuery(TABLE_JOB_DATA, query)
        let skuObjectListDto = {}, attributeTypeIdValueMap = {}, jobIdData
        const parentIdJobDataListArray = jobDataService.getParentIdJobDataListMap(jobDatas, jobTransactionList)
        for (let jobId in parentIdJobDataListArray) {
            let totalActualQuantityValue = 0, totalOriginalQuantityValue = 0, skuActualAmount = 0
            let parentIdJobDataListMap = parentIdJobDataListArray[jobId]
            attributeTypeIdValueMap[jobId] = {}
            skuObjectListDto[jobId] = {}
            for (let parentId in parentIdJobDataListMap) {
                let innerArray = [], unitPrice = 0, actualQuantityValue = 0, checkForActualAmount, originalQuantityValue = 0
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
                    if (innerObject.attributeTypeId == SKU_CODE) {
                        skuCodeMap[jobData.value.toLowerCase()] = (!skuCodeMap[jobData.value.toLowerCase()]) ? [parentId, jobId] : skuCodeMap[jobData.value.toLowerCase()]
                    }
                    if (innerObject.attributeTypeId == SKU_ORIGINAL_QUANTITY) {
                        originalQuantityValue = innerObject.value
                        totalOriginalQuantityValue += parseInt(originalQuantityValue)
                    } else if (innerObject.attributeTypeId == SKU_UNIT_PRICE) {
                        unitPrice = parseInt(innerObject.value)
                        isUnitPricePresent = true
                    }
                    if (originalQuantityValue && unitPrice) {
                        actualQuantityValue = (skuObjectValidation && skuObjectValidation.leftKey == 0) ? 0 : originalQuantityValue
                        skuActualAmount += (unitPrice * actualQuantityValue)
                        unitPrice = 0
                    }
                })
                skuActualQuantityObject = {
                    label: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).label,
                    attributeTypeId: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).attributeTypeId,
                    value: actualQuantityValue,
                    id: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).id,
                    key: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).key,
                    parentId,
                    autoIncrementId: autoIncrementId++
                }
                innerArray.push(skuActualQuantityObject)
                if (idFieldAttributeMap.get(SKU_REASON)) {
                    let value0AndReasonAtZeroQuantity, valueMaxAndReasonAtMaxQuantity
                    if (skuValidationForImageAndReason) {
                        value0AndReasonAtZeroQuantity = skuObjectValidation && skuObjectValidation.leftKey ? _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtZeroQty') && skuObjectValidation.leftKey == 0 : _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtZeroQty')
                        valueMaxAndReasonAtMaxQuantity = skuObjectValidation && skuObjectValidation.leftKey ? _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtMaxQty') && skuObjectValidation.leftKey != 0 : _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtMaxQty')
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
                    if (skuValidationForImageAndReason) {
                        value0AndImageAtZeroQuantity = skuObjectValidation && skuObjectValidation.leftKey ? _.includes(skuValidationForImageAndReason.leftKey, 'imageAtZeroQty') && skuObjectValidation.leftKey == 0 : _.includes(skuValidationForImageAndReason.leftKey, 'imageAtZeroQty')
                        valueMaxAndImageAtMaxQuantity = skuObjectValidation && skuObjectValidation.leftKey ? _.includes(skuValidationForImageAndReason.leftKey, 'imageAtMaxQty') && skuObjectValidation.leftKey != 0 : _.includes(skuValidationForImageAndReason.leftKey, 'imageAtMaxQty')
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
                skuObjectListDto[jobId][parentId] = innerArray
            }
            attributeTypeIdValueMap[jobId][TOTAL_ORIGINAL_QUANTITY] = totalOriginalQuantityValue
            attributeTypeIdValueMap[jobId][TOTAL_ACTUAL_QUANTITY] = totalActualQuantityValue
            attributeTypeIdValueMap[jobId][SKU_ACTUAL_AMOUNT] = skuActualAmount
        }
        if (skuValidationForImageAndReason && (!_.isEmpty(skuValidationForImageAndReason.rightKey) || !_.isEmpty(skuValidationForImageAndReason.leftKey)) && idFieldAttributeMap.get(SKU_REASON)) {
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
        return {
            skuObjectListDto,
            attributeTypeIdValueMap,
            reasonsList,
            skuCodeMap
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
        childAttributesList[ACTUAL_QUANTITY] = childAttributesList[ORIGNAL_QUANTITY] = childAttributesList[ACTUAL_AMOUNT] = 0
        for (let transactionId in attributeTypeIdValueMap) {
            childAttributesList[transactionId] = {}
            const totalActualQty = {
                fieldAttributeMasterId: idFieldAttributeMap.get(TOTAL_ACTUAL_QUANTITY).id,
                value: attributeTypeIdValueMap[transactionId][TOTAL_ACTUAL_QUANTITY],
                attributeTypeId: TOTAL_ACTUAL_QUANTITY,
                key: idFieldAttributeMap.get(TOTAL_ACTUAL_QUANTITY).key
            }
            childAttributesList[transactionId][TOTAL_ACTUAL_QUANTITY] = totalActualQty
            const totalOriginalQty = {
                fieldAttributeMasterId: idFieldAttributeMap.get(TOTAL_ORIGINAL_QUANTITY).id,
                value: attributeTypeIdValueMap[transactionId][TOTAL_ORIGINAL_QUANTITY],
                attributeTypeId: TOTAL_ORIGINAL_QUANTITY,
                key: idFieldAttributeMap.get(TOTAL_ORIGINAL_QUANTITY).key
            }
            childAttributesList[transactionId][TOTAL_ORIGINAL_QUANTITY] = totalOriginalQty

            const skuActualAmount = {
                fieldAttributeMasterId: idFieldAttributeMap.get(SKU_ACTUAL_AMOUNT).id,
                value: attributeTypeIdValueMap[transactionId][SKU_ACTUAL_AMOUNT],
                attributeTypeId: SKU_ACTUAL_AMOUNT,
                key: idFieldAttributeMap.get(SKU_ACTUAL_AMOUNT).key
            }
            childAttributesList[transactionId][SKU_ACTUAL_AMOUNT] = skuActualAmount
            childAttributesList[ACTUAL_AMOUNT] += skuActualAmount.value
            childAttributesList[ORIGNAL_QUANTITY] += totalOriginalQty.value
            childAttributesList[ACTUAL_QUANTITY] += totalActualQty.value
        }
        return childAttributesList
    }

    getFinalCheckForValidation(skuObjectValidation, skuRootChildElements) {
        if (!skuRootChildElements) {
            throw new Error('Sku child elements missing')
        }
        const rightKey = (skuObjectValidation) ? skuObjectValidation.rightKey : null
        let message
        if (!rightKey) return
        if (rightKey != null && rightKey.includes("1") && skuRootChildElements[ACTUAL_QUANTITY] == skuRootChildElements[ORIGNAL_QUANTITY]) {
            message = TOTAL_ORG_QTY_NOT_EQUAL_TOTAL_ACTUAL_QTY
        } else if (rightKey.includes("2") && skuRootChildElements[ACTUAL_QUANTITY] == 0) {
            message = QTY_NOT_ZERO
        } else if (rightKey.includes("3") && skuRootChildElements[ORIGNAL_QUANTITY] && skuRootChildElements[ACTUAL_QUANTITY] != skuRootChildElements[ORIGNAL_QUANTITY]) {
            message = TOTAL_ORG_QTY_EQUAL_TOTAL_ACTUAL_QTY
        } else if (rightKey.includes("4") && skuRootChildElements[ACTUAL_QUANTITY] != 0) {
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

    prepareUpdatedSkuArray(value, rowItem, skuListItems, skuChildElements, skuValidationForImageAndReason, jobId) {
        let updatedSkuList = JSON.parse(JSON.stringify(skuListItems))
        let updatedObject = updatedSkuList[jobId]
        let updatedSkuChildList = JSON.parse(JSON.stringify(skuChildElements))
        let updatedChildElements = updatedSkuChildList[jobId]
        let actualQuantity = 0, oldActualQty = 0, originalQuantityValue = 0, unitPriceValue = 0
        for (let index in updatedObject[rowItem.parentId]) {
            if (updatedObject[rowItem.parentId][index].attributeTypeId == SKU_ORIGINAL_QUANTITY) {
                originalQuantityValue = parseInt(updatedObject[rowItem.parentId][index].value)
            }
            else if (updatedObject[rowItem.parentId][index].attributeTypeId == SKU_UNIT_PRICE) {
                unitPriceValue = parseInt(updatedObject[rowItem.parentId][index].value)
            }
            if (updatedObject[rowItem.parentId][index].attributeTypeId == SKU_ACTUAL_QUANTITY && rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                oldActualQty = rowItem.value
                updatedObject[rowItem.parentId][index].value = value
                actualQuantity = parseInt(value)
            }
            else if (updatedObject[rowItem.parentId][index].attributeTypeId == SKU_REASON && rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                updatedObject[rowItem.parentId][index].value = this.changeSKUReasonStatus(parseInt(value), skuValidationForImageAndReason, originalQuantityValue)
            } else if (updatedObject[rowItem.parentId][index].attributeTypeId == SKU_PHOTO && rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                updatedObject[rowItem.parentId][index].value = this.changeSKUPhotoStatus(parseInt(value), skuValidationForImageAndReason, originalQuantityValue)
            }
        }
        updatedSkuChildList[ACTUAL_AMOUNT] += unitPriceValue * (actualQuantity - oldActualQty)
        updatedSkuChildList[ACTUAL_QUANTITY] += actualQuantity - oldActualQty
        updatedChildElements[TOTAL_ACTUAL_QUANTITY].value += actualQuantity - oldActualQty
        updatedChildElements[SKU_ACTUAL_AMOUNT].value += unitPriceValue * (actualQuantity - oldActualQty)
        updatedSkuList[jobId] = updatedObject
        updatedSkuChildList[jobId] = updatedChildElements
        return {
            updatedSkuList,
            updatedSkuChildList
        }
    }


    scanSKUCode(functionParams) {
        let { skuListItems, searchText, skuObjectValidation, skuValidationForImageAndReason, skuChildItems, skuCodeMap } = functionParams
        let cloneSKUListItems = JSON.parse(JSON.stringify(skuListItems)), errorMessage, cloneSkuChildItems = JSON.parse(JSON.stringify(skuChildItems))
        let codeMatches = skuCodeMap[searchText.toLowerCase()], orignalQuantityAndActualQuantity = {}
        if (codeMatches) {
            let skuListItemValue = cloneSKUListItems[codeMatches[1]][codeMatches[0]]
            for (let skuComponentIndex in skuListItemValue) {
                switch (skuListItemValue[skuComponentIndex].attributeTypeId) {
                    case SKU_ACTUAL_QUANTITY:
                        orignalQuantityAndActualQuantity[ACTUAL_QUANTITY] = skuListItemValue[skuComponentIndex]
                        break
                    case SKU_ORIGINAL_QUANTITY:
                        orignalQuantityAndActualQuantity[ORIGNAL_QUANTITY] = skuListItemValue[skuComponentIndex]
                        break
                    case SKU_PHOTO:
                        orignalQuantityAndActualQuantity[PHOTO] = skuListItemValue[skuComponentIndex]
                        break
                    case SKU_REASON:
                        orignalQuantityAndActualQuantity[REASON] = skuListItemValue[skuComponentIndex]
                        break
                    case SKU_UNIT_PRICE:
                        orignalQuantityAndActualQuantity[UNIT_PRICE] = skuListItemValue[skuComponentIndex]
                        break
                }
            }
            let returnParam = this.changeSKUObjectWhenCodeMatches(skuObjectValidation, orignalQuantityAndActualQuantity, skuValidationForImageAndReason, cloneSkuChildItems, codeMatches[1])
            errorMessage = returnParam.errorMessage
            cloneSkuChildItems = returnParam.cloneSkuChildItemsMap
        } else {
            errorMessage = RESULT_NOT_FOUND;
        }
        return { errorMessage, cloneSKUListItems, cloneSkuChildItems }
    }

    changeSKUObjectWhenCodeMatches(skuObjectValidation, orignalQuantityAndActualQuantity, skuValidationForImageAndReason, cloneSkuChildItemsMap, jobId) {
        let errorMessage, cloneSkuChildItems = cloneSkuChildItemsMap[jobId]
        if (!skuObjectValidation || skuObjectValidation.leftKey == 1) {
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
            if (orignalQuantityAndActualQuantity[PHOTO]) {
                orignalQuantityAndActualQuantity[PHOTO].value = this.changeSKUPhotoStatus(orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value, skuValidationForImageAndReason, orignalQuantityAndActualQuantity[ORIGNAL_QUANTITY].value)
            }
            if (orignalQuantityAndActualQuantity[REASON]) {
                orignalQuantityAndActualQuantity[REASON].value = this.changeSKUReasonStatus(orignalQuantityAndActualQuantity[ACTUAL_QUANTITY].value, skuValidationForImageAndReason, orignalQuantityAndActualQuantity[ORIGNAL_QUANTITY].value)
            }
        }
        cloneSkuChildItemsMap[jobId] = cloneSkuChildItems
        return { errorMessage, cloneSkuChildItemsMap }
    }

    changeSKUPhotoStatus(actualQuantityValue, skuValidationForImageAndReason, originalQuantityValue) {
        if (skuValidationForImageAndReason) {
            const imageAt0Qty = actualQuantityValue == 0 && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtZeroQty')
            const imageAtAnyQty = actualQuantityValue != 0 && actualQuantityValue != originalQuantityValue && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtAnyQty')
            const imageAtMaxQty = actualQuantityValue == originalQuantityValue && _.includes(skuValidationForImageAndReason.leftKey, 'imageAtMaxQty')
            return (skuValidationForImageAndReason && (imageAtMaxQty || imageAt0Qty || imageAtAnyQty)) ? OPEN_CAMERA : null
        }
    }

    changeSKUReasonStatus(actualQuantityValue, skuValidationForImageAndReason, originalQuantityValue) {
        if (skuValidationForImageAndReason) {
            const reasonAt0Qty = actualQuantityValue == 0 && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtZeroQty')
            const reasonAtAnyQty = actualQuantityValue != 0 && actualQuantityValue != originalQuantityValue && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtAnyQty')
            const reasonAtMaxQty = actualQuantityValue == originalQuantityValue && _.includes(skuValidationForImageAndReason.rightKey, 'reasonAtMaxQty')
            return (skuValidationForImageAndReason && (reasonAtMaxQty || reasonAt0Qty || reasonAtAnyQty)) ? REASON : null
        }
    }
}

export let skuListing = new SkuListing()