'use strict'

class FieldAttributeValueMaster {
    /**
     * This function filters fieldAttributeValueList on basis of fieldAttributeMasterId
     * @param {*} fieldAttributeValueList 
     * @param {*} fieldAttributeMasterId 
     * @returns
     * [FieldAttributeValue]
     */
    filterFieldAttributeValueList(fieldAttributeValueList, fieldAttributeMasterId) {
        return fieldAttributeValueList.filter(item => item.fieldAttributeMasterId == fieldAttributeMasterId)
    }
}

export let fieldAttributeValueMasterService = new FieldAttributeValueMaster()