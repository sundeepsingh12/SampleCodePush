'use strict'

class FieldAttributeMaster {
    /**
     * 
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
        if (!fieldAttributeMasterList) {
            fieldAttributeMasterList = []
        }
        fieldAttributeMasterList.forEach(fieldAttributeMaster => {
            if (!fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId]) {
                fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId] = {}
            }
            fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId][fieldAttributeMaster.id] = fieldAttributeMaster
        })

        return fieldAttributeMasterMap
    }

    /**
     * This function traverses field attribute status list
     * @param {*} fieldAttributeStatusList
     * @returns
     * Map<StatusId,Map<FieldAttributeMasterId,FieldAttributeStatus>>
     */
    getFieldAttributeStatusMap(fieldAttributeStatusList) {
        let fieldAttributeStatusMap = {}
        if (!fieldAttributeStatusList) {
            fieldAttributeStatusList = []
        }
        fieldAttributeStatusList.forEach(fieldAttributeStatus => {
            // if (!fieldAttributeStatusMap[fieldAttributeStatus.statusId]) {
            //     fieldAttributeStatusMap[fieldbAttributeStatus.statusId] = {}
            // }
            fieldAttributeStatusMap[fieldAttributeStatus.fieldAttributeId] = fieldAttributeStatus
            // jobAttributeStatus[statusId].push(jobAttributeStatus.jobAttributeId)
        })

        return fieldAttributeStatusMap
    }

    /**
     * This function traverse field status list (as there is no field attribute status list)
     * @param {*} statusList 
     * @param {*} fieldAttributeMasterMap 
     * @returns Map<StatusId,Map<FieldAttributeMasterId,FieldAttributeMaster>>
     */
    getAllFieldAttributeStatusMap(statusList, fieldAttributeMasterMap) {
        let fieldAttributeStatusMap = {}
        if (!statusList) {
            statusList = []
        }
        statusList.forEach(status => {
            if (!fieldAttributeStatusMap[status.id]) {
                fieldAttributeStatusMap[status.id] = {}
            }
            fieldAttributeStatusMap[status.id] = fieldAttributeMasterMap
        })

        return fieldAttributeStatusMap
    }
}

export let fieldAttributeMasterService = new FieldAttributeMaster()