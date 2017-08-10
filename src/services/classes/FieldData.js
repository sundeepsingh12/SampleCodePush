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
            const jobTransactionId = fieldDataObj.jobTransactionId
            const fieldAttributeMasterId = fieldDataObj.fieldAttributeMasterId
            const value = fieldDataObj.value
            const parentId = fieldDataObj.parentId
            let fieldData = {
                jobTransactionId,
                fieldAttributeMasterId,
                value
            }

            if (parentId !== 0) {
                return
            }

            if (!fieldDataMap[jobTransactionId]) {
                fieldDataMap[jobTransactionId] = {}
            }

            fieldDataMap[jobTransactionId][fieldAttributeMasterId] = fieldData
        })
        return fieldDataMap
    }

    prepareFieldDataForTransactionParticularStatus(jobTransactionId, fieldAttributeMasterMap, fieldAttributeMap, fieldAttributeMasterList, fieldAttributeStatusList) {
        const fieldAttributeMapQuery = Object.keys(fieldAttributeMap).map(fieldAttributeMasterId => 'fieldAttributeMasterId == ' + fieldAttributeMasterId).join(' OR ')
        let fieldDataQuery = 'jobTransactionId = ' + jobTransactionId + ' AND (' + fieldAttributeMapQuery + ')'
        let fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, fieldDataQuery)
        let fieldDataObject = this.prepareJobDataObject(jobTransactionId, 0, fieldDataList, fieldAttributeMasterMap, fieldAttributeMap)
        return fieldDataObject
    }
}

export let fieldDataService = new FieldData()