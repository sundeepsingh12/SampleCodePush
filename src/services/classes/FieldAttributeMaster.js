'use strict'

class FieldAttributeMaster {
    /**
     * @param {*} fieldAttributeMasterList 
     * @returns
     * FieldAttributeMasterMap : {
     *                              jobMasterId : {
     *                                              fieldAttributeMasterId : {
     *                                                                          fieldAttributeMaster
     *                                                                       }
     *                                            }
     *                           }
     */
    getFieldAttributeMasterMap(fieldAttributeMasterList) {
        let fieldAttributeMasterMap = {}
        fieldAttributeMasterList = fieldAttributeMasterList ? fieldAttributeMasterList : []
        fieldAttributeMasterList.forEach(fieldAttributeMaster => {
            fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId] = fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId] ? fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId] : {}
            fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId][fieldAttributeMaster.id] = fieldAttributeMaster
        })
        return fieldAttributeMasterMap
    }

    /**
     * @param {*} fieldAttributeStatusList
     * @returns
     * FieldAttributeStatusMap : {
     *                              fieldAttributeId : { fieldAttributeStatus }
     *                         }
     */
    getFieldAttributeStatusMap(fieldAttributeStatusList) {
        let fieldAttributeStatusMap = {}
        fieldAttributeStatusList = fieldAttributeStatusList ? fieldAttributeStatusList : []
        fieldAttributeStatusList.forEach(fieldAttributeStatus => {
            fieldAttributeStatusMap[fieldAttributeStatus.fieldAttributeId] = fieldAttributeStatus
        })
        return fieldAttributeStatusMap
    }
}

export let fieldAttributeMasterService = new FieldAttributeMaster()