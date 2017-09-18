'use strict'

import { jobDetailsService } from './JobDetails'
import * as realm from '../../repositories/realmdb'

const {
    TABLE_FIELD_DATA
} = require('../../lib/constants').default

class FieldData {

    /**
     * @param {*} fieldDataList 
     * @returns
     * FieldDataMap : {
     *                  JobTransactionId : {
     *                                        FieldAttributeMasterId :   FieldData
     *                                     }
     *                }
     */
    getFieldDataMap(fieldDataList) {
        let fieldDataMap = {}
        fieldDataList.forEach(fieldDataObj => {
            const {
                fieldAttributeMasterId,
                jobTransactionId,
                parentId,
                value
            } = fieldDataObj
            let fieldData = {
                jobTransactionId,
                fieldAttributeMasterId,
                value
            }
            if (parentId !== 0) {
                return
            }
            fieldDataMap[jobTransactionId] = fieldDataMap[jobTransactionId] ? fieldDataMap[jobTransactionId] : {}
            fieldDataMap[jobTransactionId][fieldAttributeMasterId] = fieldData
        })
        return fieldDataMap
    }

    /**
     * This method fetch data from db and prepares field data object for display
     * @param {*} jobTransactionId 
     * @param {*} fieldAttributeMasterMap 
     * @param {*} fieldAttributeMap 
     * dataObject {
     *              dataList : {
     *                              attributeMasterId : {
     *                                                      data,
     *                                                      sequence
     *                                                      label,
     *                                                      attributeTypeId,
     *                                                      childDataList : [dataList]
     *                                                   }
     *                          }
     *                         
     *              dataMap : {
     *                          attributeMasterId : {
     *                                                  data,
     *                                                  childdDataMap,
     *                                                  sequence,
     *                                                  label,
     *                                                  attributeTypeId
     *                                              }
     *                         }
     */
    prepareFieldDataForTransactionParticularStatus(jobTransactionId, fieldAttributeMasterMap, fieldAttributeMap) {
        const fieldAttributeMapQuery = Object.keys(fieldAttributeMasterMap).map(fieldAttributeMasterId => 'fieldAttributeMasterId = ' + fieldAttributeMasterId).join(' OR ')
        let fieldDataQuery = 'jobTransactionId = ' + jobTransactionId
        if (fieldAttributeMapQuery !== undefined && fieldAttributeMapQuery !== null && fieldAttributeMapQuery.length !== 0) {
            fieldDataQuery += ' AND (' + fieldAttributeMapQuery + ')'
        }
        let fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, fieldDataQuery)
        let fieldDataObject = jobDetailsService.prepareDataObject(jobTransactionId, 0, fieldDataList, fieldAttributeMasterMap, fieldAttributeMap, false, 0,true)
        return fieldDataObject
    }
}

export let fieldDataService = new FieldData()