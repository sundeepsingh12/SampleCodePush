'use strict'

import { jobDetailsService } from './JobDetails'
import * as realm from '../../repositories/realmdb'

import {
    TABLE_FIELD_DATA
} from '../../lib/constants'
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
        let fieldDataMap = {};
        for (let index in fieldDataList) {
            const { fieldAttributeMasterId, jobTransactionId, parentId, value } = fieldDataList[index];
            let fieldData = { jobTransactionId, fieldAttributeMasterId, value };
            if (parentId !== 0) {
                continue;
            }
            fieldDataMap[jobTransactionId] = fieldDataMap[jobTransactionId] ? fieldDataMap[jobTransactionId] : {};
            fieldDataMap[jobTransactionId][fieldAttributeMasterId] = fieldData;
        }
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
        let fieldDataObject = jobDetailsService.prepareDataObject(jobTransactionId, 0, fieldDataList, fieldAttributeMasterMap, fieldAttributeMap, false, 0, true)
        return fieldDataObject
    }

    /**
     * This function prepares field data of a transaction for saving in form layout state.It sets position id, parent id , transaction id  of field data
     * @param {*} fieldDataListDTO 
     * @param {*} parentId 
     * @param {*} latestPositionId 
     * @returns
     * {
     *      fieldDataList : [
     *                          {
     *                              attributeTypeId,
     *                              fieldAttributeMasterId,
     *                              jobTransactionId,
     *                              parentId,
     *                              positionId,
     *                              value
     *                          }
     *                      ],
     *      latestPositionId : integer
     * }
     */
    prepareFieldDataForTransactionSavingInState(fieldDataListDTO, jobTransactionId, parentId, latestPositionId) {
        let fieldDataList = []
        for (let index in fieldDataListDTO) {
            let fieldData = {}
            latestPositionId++
            fieldData.attributeTypeId = fieldDataListDTO[index].attributeTypeId
            fieldData.fieldAttributeMasterId = fieldDataListDTO[index].fieldAttributeMasterId
            fieldData.jobTransactionId = jobTransactionId
            fieldData.parentId = parentId
            fieldData.positionId = latestPositionId
            fieldData.value = fieldDataListDTO[index].value
            fieldData.key = fieldDataListDTO[index].key
            if (fieldDataListDTO[index].childDataList) {
                let fieldDataDTO = this.prepareFieldDataForTransactionSavingInState(fieldDataListDTO[index].childDataList, jobTransactionId, fieldData.positionId, latestPositionId)
                fieldData.childDataList = fieldDataDTO.fieldDataList
                latestPositionId = fieldDataDTO.latestPositionId
            }
            fieldDataList.push(fieldData)
        }

        return {
            fieldDataList,
            latestPositionId
        }
    }

}

export let fieldDataService = new FieldData()