'use strict'

import { jobDetailsService } from './JobDetails'
import * as realm from '../../repositories/realmdb'

const {
    TABLE_FIELD_DATA
} = require('../../lib/constants').default

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

    prepareFieldDataForTransactionParticularStatus(jobTransactionId, fieldAttributeMasterMap, fieldAttributeMap) {
        console.log('sadsa',fieldAttributeMap)
        const fieldAttributeMapQuery = Object.keys(fieldAttributeMasterMap).map(fieldAttributeMasterId => 'fieldAttributeMasterId = ' + fieldAttributeMasterId).join(' OR ')
        let fieldDataQuery = 'jobTransactionId = ' + jobTransactionId
        if (fieldAttributeMapQuery !== undefined && fieldAttributeMapQuery !== null && fieldAttributeMapQuery.length !== 0) {
            fieldDataQuery += ' AND (' + fieldAttributeMapQuery + ')'
        }
        console.log('fieldData query',fieldDataQuery)
        let fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, fieldDataQuery)
        let fieldDataObject = jobDetailsService.prepareDataObject(jobTransactionId, 0, fieldDataList, fieldAttributeMasterMap, fieldAttributeMap, false, 0,true)
        return fieldDataObject
    }
}

export let fieldDataService = new FieldData()