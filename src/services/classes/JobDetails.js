'use strict'

import * as realm from '../../repositories/realmdb'
import { jobDataService } from './JobData'
import {
    ARRAYSAROJFAREYE,
    CONTACT_NUMBER,
    OBJECTSAROJFAREYE,
} from '../../lib/AttributeConstants'

class JobDetails {

    /**
     * common method for getting job data and field data details
     * @param {*} id 
     * @param {*} positionId 
     * @param {*} realmDBDataList 
     * @param {*} attributeMasterMap 
     * @param {*} attributeMap 
     * @param {*} isJob 
     * @returns dataObject {
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
     * }
     */
    prepareDataObject(id, positionId, realmDBDataList, attributeMasterMap, attributeMap, isJob, autoIncrementId, isObject) {
        let dataMap = {}
        let dataQuery = isJob ? 'jobId = ' + id + ' AND parentId = ' + positionId : 'jobTransactionId = ' + id + ' AND parentId = ' + positionId
        let dataList = isObject ? {} : []
        let filteredDataList = realm.filterRecordList(realmDBDataList, dataQuery)
        for (let index in filteredDataList) {
            let data = { ...filteredDataList[index] }
            let attributeMaster = isJob ? attributeMasterMap[data.jobAttributeMasterId] : attributeMasterMap[data.fieldAttributeMasterId]
            let attributeStatus = attributeMaster ? attributeMap[attributeMaster.id] : undefined
            if (attributeMaster && attributeStatus && !attributeMaster.hidden && data.value !== undefined && data.value !== null && data.value.trim() != '') {
                let dataObject = {}
                dataMap[attributeMaster.attributeTypeId] = dataMap[attributeMaster.attributeTypeId] ? dataMap[attributeMaster.attributeTypeId] : {}
                dataMap[attributeMaster.attributeTypeId][attributeMaster.id] = dataMap[attributeMaster.attributeTypeId][attributeMaster.id] ? dataMap[attributeMaster.attributeTypeId][attributeMaster.id] : {}
                dataMap[attributeMaster.attributeTypeId][attributeMaster.id].data = dataObject.data = data
                dataMap[attributeMaster.attributeTypeId][attributeMaster.id].sequence = dataObject.sequence = attributeStatus.sequence
                dataMap[attributeMaster.attributeTypeId][attributeMaster.id].label = dataObject.label = attributeMaster.label
                dataObject.attributeTypeId = attributeMaster.attributeTypeId
                dataObject.id = ++autoIncrementId
                if (data.value == OBJECTSAROJFAREYE || data.value == ARRAYSAROJFAREYE) {
                    let childDataObject = this.prepareDataObject(id, data.positionId, realmDBDataList, attributeMasterMap, attributeMap, isJob, autoIncrementId)
                    autoIncrementId = childDataObject.autoIncrementId
                    dataMap[attributeMaster.attributeTypeId][attributeMaster.id].childDataMap = childDataObject.dataMap
                    dataObject.childDataList = childDataObject.dataList
                }
                isObject ? isJob && attributeMaster.attributeTypeId == CONTACT_NUMBER ? true : dataList[attributeMaster.id] = dataObject : dataList.push(dataObject)
            }
        }
        if (!isObject) {
            dataList = dataList.sort((x, y) => x.sequence - y.sequence)
        }
        return {
            dataMap,
            dataList,
            autoIncrementId
        }
    }
}

export let jobDetailsService = new JobDetails()