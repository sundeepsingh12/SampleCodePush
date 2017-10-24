'use strict'
const {
    FIELD_ATTRIBUTE,
    FIELD_ATTRIBUTE_STATUS,
    TABLE_JOB_DATA
} = require('../../lib/constants').default
import {
    keyValueDBService
} from './KeyValueDBService'
import {jobDataService} from './JobData'
import * as realm from '../../repositories/realmdb'
import {
    SKU_ORIGINAL_QUANTITY,
    SKU_CODE,
    SKU_ACTUAL_QUANTITY,
    TOTAL_ORIGINAL_QUANTITY,
    TOTAL_ACTUAL_QUANTITY,
    SKU_ACTUAL_AMOUNT,
    SKU_UNIT_PRICE
} from '../../lib/AttributeConstants'
import {
    fieldAttributeStatusService
} from './FieldAttributeStatus'

class SkuListing {

      async getSkuListingDto(fieldAttributeMasterId) {
        const fieldAttributesList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
        let idFieldAttributeMap = new Map(), isSkuCodePresent = false
        if (!fieldAttributesList || !fieldAttributesList.value) {
            throw new Error('Field Attributes missing in store')
        }
        const childFieldAttributeId = fieldAttributesList.value.filter(fieldAttributeObject => fieldAttributeObject.parentId == fieldAttributeMasterId &&
            fieldAttributeObject.attributeTypeId == 11).map(object => object.id)

        fieldAttributesList.value.filter(fieldAttributeObject => fieldAttributeObject.parentId == childFieldAttributeId[0])
            .forEach(fieldAttribute => {
                if(fieldAttribute.attributeTypeId==SKU_CODE){
                    isSkuCodePresent = true
                }
                const id = (fieldAttribute.jobAttributeMasterId == 0 || fieldAttribute.jobAttributeMasterId==null) ?fieldAttribute.attributeTypeId:fieldAttribute.jobAttributeMasterId
                idFieldAttributeMap.set(id,fieldAttribute)
            })

            fieldAttributesList.value.filter(fieldAttributeObject => fieldAttributeObject.parentId == fieldAttributeMasterId && fieldAttributeObject.attributeTypeId!=11).forEach(fieldAttribute=>{
                idFieldAttributeMap.set(fieldAttribute.attributeTypeId,fieldAttribute)
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
        prepareSkuListingData(idFieldAttributeMap, jobId,skuObjectValidation) {
            let query = Array.from(idFieldAttributeMap.keys()).map(jobAttributeId => `jobAttributeMasterId = ${jobAttributeId}`).join(' OR ')
            query = `(${query}) AND jobId = ${jobId}`
            const jobDatas = realm.getRecordListOnQuery(TABLE_JOB_DATA, query)
            let autoIncrementId = 0, skuObjectListDto = {},attributeTypeIdValueMap={},totalActualQuantityValue=0,totalOriginalQuantityValue=0,skuActualAmount=0
            const parentIdJobDataListMap = jobDataService.getParentIdJobDataListMap(jobDatas)
            for (let parentId in parentIdJobDataListMap) {
                let innerArray = [],originalQuantityValue=0,unitPrice=0,actualQuantityValue=0
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
                    if(innerObject.attributeTypeId==SKU_ORIGINAL_QUANTITY){
                         originalQuantityValue = innerObject.value
                         totalOriginalQuantityValue+=parseInt(originalQuantityValue)

                    }
                    else if(innerObject.attributeTypeId==SKU_UNIT_PRICE){
                        unitPrice = parseInt(innerObject.value)
                        isUnitPricePresent = true

                    }else if(innerObject.attributeTypeId==SKU_ACTUAL_QUANTITY){
                            actualQuantityValue=parseInt(innerObject.value)
                            totalActualQuantityValue+=actualQuantityValue
                    }
                    if(!isUnitPricePresent){
                        skuActualAmount+=(unitPrice*actualQuantityValue)
                    }
                })
                let skuActualQuantityObject = {
                        label: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).label,
                        attributeTypeId: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).attributeTypeId,
                        value: (skuObjectValidation.leftKey==0)?'0':originalQuantityValue,
                        id: idFieldAttributeMap.get(SKU_ACTUAL_QUANTITY).id,
                        parentId,
                        autoIncrementId
                }
                innerArray.push(skuActualQuantityObject)
                autoIncrementId++
                skuObjectListDto[parentId] = innerArray
            }
            attributeTypeIdValueMap[TOTAL_ORIGINAL_QUANTITY] = totalOriginalQuantityValue
            attributeTypeIdValueMap[TOTAL_ACTUAL_QUANTITY] = totalActualQuantityValue
            attributeTypeIdValueMap[SKU_ACTUAL_AMOUNT] = skuActualAmount
            return {
                skuObjectListDto,
                attributeTypeIdValueMap
            }
    }

    getSkuChildAttributes(idFieldAttributeMap,attributeTypeIdValueMap){
        const childAttributesList = {}
        const totalActualQty = {
            id:idFieldAttributeMap.get(TOTAL_ACTUAL_QUANTITY).id,
            value:attributeTypeIdValueMap[TOTAL_ACTUAL_QUANTITY],
            attributeTypeId:TOTAL_ACTUAL_QUANTITY
        }
        childAttributesList[TOTAL_ACTUAL_QUANTITY]=totalActualQty
        const totalOriginalQty = {
            id:idFieldAttributeMap.get(TOTAL_ORIGINAL_QUANTITY).id,
            value:attributeTypeIdValueMap[TOTAL_ORIGINAL_QUANTITY],
            attributeTypeId:TOTAL_ORIGINAL_QUANTITY
        }
        childAttributesList[TOTAL_ORIGINAL_QUANTITY]=totalOriginalQty

          const skuActualAmount = {
            id:idFieldAttributeMap.get(SKU_ACTUAL_AMOUNT).id,
            value:attributeTypeIdValueMap[SKU_ACTUAL_AMOUNT],
            attributeTypeId:SKU_ACTUAL_AMOUNT
        }
        childAttributesList[SKU_ACTUAL_AMOUNT]=skuActualAmount
        return childAttributesList
    }

    getFinalCheckForValidation(skuObjectValidation,skuRootChildElements){
        const rightKey = skuObjectValidation.rightKey
        let message
        if (rightKey.includes("1")) {
                    if (skuRootChildElements[TOTAL_ACTUAL_QUANTITY].value==skuRootChildElements[TOTAL_ORIGINAL_QUANTITY].value)
                        message = "Quantity should be less than max quantity.Cannot proceed.";
                } else if (rightKey.includes("2")) {
                    if (skuRootChildElements[TOTAL_ACTUAL_QUANTITY].value==0)
                        message = "Quantity can't be 0.Cannot proceed.";
                } else if (rightKey.includes("3")) {
                    if (skuRootChildElements[TOTAL_ACTUAL_QUANTITY].value!=skuRootChildElements[TOTAL_ORIGINAL_QUANTITY].value)
                        message = "Quantity should be equal to max quantity.Cannot proceed.";
                } else if (rightKey.includes("4")) {
                    if (skuRootChildElements[TOTAL_ACTUAL_QUANTITY].value!=0)
                        message = "Quantity should be 0.Cannot proceed.";
                }
                return message
    }

    prepareSkuListChildElementsForSaving(skuListItems,skuRootChildItems,skuObjectAttributeId){
            
            let childElementsArray = []
            for(let index in skuListItems){
                const childDataList = []
                skuListItems[index].forEach(skuItem=>{
                    const skuObjectChild = {
                    attributeTypeId:skuItem.attributeTypeId,
                    value:skuItem.value,
                    fieldAttributeMasterId:skuItem.id
                    }
                    childDataList.push(skuObjectChild)
                })
                const skuObject = {
                    attributeTypeId:11,
                    childDataList,
                    value:'ObjectSarojFareye',
                    fieldAttributeMasterId:skuObjectAttributeId
                }
                childElementsArray.push(skuObject)
            }
            for(let index in skuRootChildItems){
                childElementsArray.push(skuRootChildItems[index])
            }
            return childElementsArray
    }

    prepareUpdatedSkuArray(value,parentId,skuListItems,skuChildElements){

        const updatedObject = JSON.parse(JSON.stringify(skuListItems))
        const updatedChildElements = JSON.parse(JSON.stringify(skuChildElements))
        let totalOriginalQuantityValue = 0, totalActualQuantity = 0,skuActualAmount=0
        for (let index in updatedObject) {
            let unitPrice=0,actualQuantity=0
            updatedObject[index].forEach(item => {
                let isUnitPricePresent = false
                if (item.attributeTypeId == SKU_ORIGINAL_QUANTITY) {
                    totalOriginalQuantityValue += parseInt(item.value)
                    isUnitPricePresent = true

                } else if (item.attributeTypeId == SKU_ACTUAL_QUANTITY) {
                    if(parentId==item.parentId)
                    item.value=value
                    actualQuantity = item.value
                    totalActualQuantity += parseInt(item.value)
                }
                else if(item.attributeTypeId==SKU_UNIT_PRICE){
                    unitPrice = item.value
                }
                if(!isUnitPricePresent){
                    skuActualAmount +=(unitPrice * actualQuantity)
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
}

export let skuListing = new SkuListing()