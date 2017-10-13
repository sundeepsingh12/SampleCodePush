'use strict'
import {
    keyValueDBService,
} from './KeyValueDBService'

const {
    FIELD_ATTRIBUTE_VALUE,
} = require('../../lib/constants').default

import {
    FIXED_SKU_QUANTITY,
    FIXED_SKU_UNIT_PRICE,
    FIXED_SKU_CODE,
    FIXED_SKU_OBJECT
} from '../../lib/AttributeConstants'

class FixedSKUListing {

    prepareFixedSKUChild(fieldAttributeValueDataArray, fieldAttributeMasterId) {
        let fixedSKUChildList = []
        for (let fieldAttrObjectCounter in fieldAttributeValueDataArray) {
            let fieldAttrObject = fieldAttributeValueDataArray[fieldAttrObjectCounter]
            if (fieldAttributeMasterId == fieldAttrObject.fieldAttributeMasterId) {
                let childObject = {}
                childObject.name = fieldAttrObject.code
                childObject.code = fieldAttrObject.name
                childObject.fieldAttributeMasterId = fieldAttributeMasterId
                childObject.value = 0
                childObject.sequence = fieldAttrObject.sequence
                fixedSKUChildList.push(childObject)
            }
        }
        return fixedSKUChildList;
    }

    prepareFixedSKU(fieldAttributeMasterList, fixedSKUChildList, fieldAttributeMasterId) {
        let fixedSKUList = {}
        let id = 0
        for (let fieldAttributeData of fieldAttributeMasterList) {
            if (fieldAttributeData.parentId == fieldAttributeMasterId) {
                if (fieldAttributeData.attributeTypeId == FIXED_SKU_UNIT_PRICE) {
                    let totalAmountObject = {}
                    totalAmountObject.id = id
                    id++
                    totalAmountObject.attributeTypeId = fieldAttributeData.attributeTypeId
                    totalAmountObject.fieldAttributeMasterId = fieldAttributeData.id
                    totalAmountObject.value = 0
                    fixedSKUList['TotalAmount'] = totalAmountObject
                } else if (fieldAttributeData.attributeTypeId == FIXED_SKU_OBJECT) {
                    let fixedSKUObjectTemplate = {}
                    let fixedSKUObjectChildListTemplate = {}
                    fixedSKUObjectTemplate.attributeTypeId = fieldAttributeData.attributeTypeId
                    fixedSKUObjectTemplate.fieldAttributeMasterId = fieldAttributeData.id
                    fixedSKUObjectTemplate.value = 'ObjectSarojFareye'
                    for (let fieldAttributeMaster of fieldAttributeMasterList) {
                        let tempObject = {}
                        if (fieldAttributeMaster.parentId == fixedSKUObjectTemplate.fieldAttributeMasterId) {
                            if (fieldAttributeMaster.attributeTypeId == FIXED_SKU_CODE) { //Code
                                tempObject.attributeTypeId = FIXED_SKU_CODE;
                                tempObject.fieldAttributeMasterId = fieldAttributeMaster.id
                            } else if (fieldAttributeMaster.attributeTypeId == FIXED_SKU_UNIT_PRICE) { //Unit Price
                                tempObject.attributeTypeId = FIXED_SKU_UNIT_PRICE;
                                tempObject.fieldAttributeMasterId = fieldAttributeMaster.id
                            } else if (fieldAttributeMaster.attributeTypeId == FIXED_SKU_QUANTITY) { //  Quanity
                                tempObject.attributeTypeId = FIXED_SKU_QUANTITY;
                                tempObject.fieldAttributeMasterId = fieldAttributeMaster.id
                            }
                            fixedSKUObjectChildListTemplate[tempObject.attributeTypeId] = tempObject
                        }
                    }
                    fixedSKUObjectTemplate.childDataList = fixedSKUObjectChildListTemplate
                    this.prepareFixedSKUObjectsFromTemplate(fixedSKUObjectTemplate, fixedSKUChildList, fixedSKUList, id)
                }
            }
        }
        return fixedSKUList;
    }
    prepareFixedSKUObjectsFromTemplate(fixedSKUObjectTemplate, fixedSKUChildList, fixedSKUList, id) {
        for (let fieldAttributeValueMaster of fixedSKUChildList) {
            let fixedSKUObject = JSON.parse(JSON.stringify(fixedSKUObjectTemplate))
            fixedSKUObject.id = id
            id++
            fixedSKUObject.childDataList[FIXED_SKU_UNIT_PRICE].value = fieldAttributeValueMaster.name
            fixedSKUObject.childDataList[FIXED_SKU_CODE].value = fieldAttributeValueMaster.code
            fixedSKUObject.childDataList[FIXED_SKU_QUANTITY].value = ''
            fixedSKUList[fixedSKUObject.id] = fixedSKUObject
        }
        return fixedSKUList
    }

    calculateTotalAmount(fixedSKUList) {
        let tempFixedSKUList = { ...fixedSKUList }
        let totalAmount = 0
        for (let fixedSKUObjectCounter in tempFixedSKUList) {
            let fixedSKUChilDataList = tempFixedSKUList[fixedSKUObjectCounter].childDataList
            if (fixedSKUChilDataList && fixedSKUChilDataList[FIXED_SKU_QUANTITY].value) {
                totalAmount = totalAmount + (parseInt(fixedSKUChilDataList[FIXED_SKU_UNIT_PRICE].value) * parseInt(fixedSKUChilDataList[FIXED_SKU_QUANTITY].value))
            }
        }
        tempFixedSKUList['TotalAmount'].value = totalAmount
        return tempFixedSKUList
    }
}


export let FixedSKUDetailsService = new FixedSKUListing()