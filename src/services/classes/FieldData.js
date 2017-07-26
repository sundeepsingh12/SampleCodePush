'use strict'

class FieldData {
    
    /**
     * 
     * @param {*} fieldDataList 
     * @returns
     * Map<JobTransactionId,Map<FieldAttributeMasterId,FieldData>>
     */
    getFieldDataMap(fieldDataList) {
        let fieldDataMap = {}
        fieldDataList.forEach(fieldDataObj => {
            let jobTransactionId = fieldDataObj.jobTransactionId
            let fieldAttributeMasterId = fieldDataObj.fieldAttributeMasterId
            let value = fieldDataObj.value
            let fieldData = {
                jobTransactionId,
                fieldAttributeMasterId,
                value
            }
            if (!fieldDataMap[jobTransactionId]) {
                fieldDataMap[jobTransactionId] = {}
            }
            fieldDataMap[jobTransactionId][fieldAttributeMasterId] = fieldData
        })
        return fieldDataMap
    }
}

export let fieldDataService = new FieldData()