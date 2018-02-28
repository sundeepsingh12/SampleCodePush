'use strict'
import {
    keyValueDBService,
} from './KeyValueDBService'

import {
    FIXED_SKU_QUANTITY,
    FIXED_SKU_UNIT_PRICE,
    FIXED_SKU_CODE,
    OBJECT,
    OBJECT_SAROJ_FAREYE,
    TOTAL_AMOUNT
} from '../../lib/AttributeConstants'

class FixedSKUListing {

    constructor() {
        this.id = 0
    }

    prepareObjectWithFieldAttributeData(fieldAttributeData) {
        if (fieldAttributeData != undefined) {
            let { id, label, attributeTypeId } = fieldAttributeData
            let objectWithFieldData = {
                fieldAttributeMasterId: id,
                label,
                attributeTypeId
            }
            return objectWithFieldData
        } else {
            return null
        }
    }

    prepareFixedSKU(fieldAttributeMasterList, fieldAttributeValueDataArray, fieldAttributeMasterId) {
        let fixedSKUList = {}
        for (let fieldAttributeData of fieldAttributeMasterList) {
            if (fieldAttributeData.parentId == fieldAttributeMasterId) {
                let fieldAttributeDataObject = this.prepareObjectWithFieldAttributeData(fieldAttributeData)
                if (fieldAttributeData.attributeTypeId == FIXED_SKU_UNIT_PRICE) {
                    fieldAttributeDataObject.id = this.id++
                    fieldAttributeDataObject.value = 0
                    fixedSKUList[TOTAL_AMOUNT] = fieldAttributeDataObject
                } else if (fieldAttributeData.attributeTypeId == OBJECT) {
                    let fixedSKUObjectChildListTemplate = {}
                    fieldAttributeDataObject.value = OBJECT_SAROJ_FAREYE
                    for (let fieldAttributeMaster of fieldAttributeMasterList) {
                        if (fieldAttributeMaster.parentId == fieldAttributeDataObject.fieldAttributeMasterId && (fieldAttributeMaster.attributeTypeId == FIXED_SKU_CODE || fieldAttributeMaster.attributeTypeId == FIXED_SKU_UNIT_PRICE || fieldAttributeMaster.attributeTypeId == FIXED_SKU_QUANTITY)) {
                            let childDataObject = this.prepareObjectWithFieldAttributeData(fieldAttributeMaster)
                            fixedSKUObjectChildListTemplate[childDataObject.attributeTypeId] = childDataObject
                        }
                    }
                    fieldAttributeDataObject.childDataList = fixedSKUObjectChildListTemplate
                    fixedSKUList = this.prepareFixedSKUObjectsFromTemplate(fieldAttributeDataObject, fieldAttributeValueDataArray, fixedSKUList, fieldAttributeMasterId)
                }
            }
        }
        return fixedSKUList;
    }

    prepareFixedSKUObjectsFromTemplate(fixedSKUObjectTemplate, fieldAttributeValueDataArray, fixedSKUList, fieldAttributeMasterId) {
        fieldAttributeValueDataArray.filter(fieldAttributeValueDataObject => fieldAttributeValueDataObject.fieldAttributeMasterId == fieldAttributeMasterId).forEach(fieldAttrObject => {
            let { name, code } = fieldAttrObject
            let fixedSKUObject = JSON.parse(JSON.stringify(fixedSKUObjectTemplate))
            fixedSKUObject.id = this.id++
            fixedSKUObject.childDataList[FIXED_SKU_CODE].value = name
            fixedSKUObject.childDataList[FIXED_SKU_UNIT_PRICE].value = code
            fixedSKUObject.childDataList[FIXED_SKU_QUANTITY].value = 0
            fixedSKUList[fixedSKUObject.id] = fixedSKUObject
        })
        return fixedSKUList
    }

    calculateTotalAmount(fixedSKUList) {
        let totalAmount = 0
        for (let fixedSKUObjectCounter in fixedSKUList) {
            let fixedSKUChilDataList = fixedSKUList[fixedSKUObjectCounter].childDataList
            if (fixedSKUChilDataList && fixedSKUChilDataList[FIXED_SKU_QUANTITY].value != '') {
                totalAmount += (fixedSKUChilDataList[FIXED_SKU_UNIT_PRICE].value) * (fixedSKUChilDataList[FIXED_SKU_QUANTITY].value)
            }
        }
        fixedSKUList[TOTAL_AMOUNT].value = totalAmount
        return fixedSKUList
    }

    calculateQuantity(fixedSKUList, totalQuantity, payload) {
        totalQuantity -= fixedSKUList[payload.id].childDataList[FIXED_SKU_QUANTITY].value
        if (payload.quantity != '') {
            fixedSKUList[payload.id].childDataList[FIXED_SKU_QUANTITY].value = parseInt(payload.quantity)
            totalQuantity += parseInt(payload.quantity)
        } else {
            fixedSKUList[payload.id].childDataList[FIXED_SKU_QUANTITY].value = ''
        }
        return {
            fixedSKUList,
            totalQuantity
        }
    }
}

export let fixedSKUDetailsService = new FixedSKUListing()