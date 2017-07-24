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
        fieldDataList.forEach(fieldData => {
            let fieldDataObj = {...fieldData}
            if (!fieldDataMap[fieldDataObj.jobTransactionId]) {
                fieldDataMap[fieldDataObj.jobTransactionId] = {}
            }
            fieldDataMap[fieldDataObj.jobTransactionId][fieldDataObj.fieldAttributeMasterId] = fieldDataObj
        })
        return fieldDataMap
    }
}

export let fieldDataService = new FieldData()