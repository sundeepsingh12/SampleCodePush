'use strict'

import * as realm from '../../repositories/realmdb'
import { jobDataService } from './JobData'

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
     *              dataList : [
     *                              {
     *                                  data,
     *                                  sequence
     *                                  label,
     *                                  attributeTypeId,
     *                                  childDataList : [dataList]
     *                              }
     *                         ]
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
        let dataMap = {},
            contactList = [],
            addressList = []
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
                if (data.value.toLocaleLowerCase() == 'objectsarojfareye' || data.value.toLocaleLowerCase() == 'arraysarojfareye') {
                    let childDataObject = this.prepareDataObject(id, data.positionId, realmDBDataList, attributeMasterMap, attributeMap, isJob, autoIncrementId)
                    autoIncrementId = childDataObject.autoIncrementId
                    dataMap[attributeMaster.attributeTypeId][attributeMaster.id].childDataMap = childDataObject.dataMap
                    dataObject.childDataList = childDataObject.dataList
                }
                isObject ? isJob && attributeMaster.attributeTypeId == 27 ? true : dataList[attributeMaster.id] = dataObject : dataList.push(dataObject)
                if (data.parentId !== 0 || !isJob) {
                    continue
                } else if (jobDataService.checkContacNumber(data.jobAttributeMasterId, data.value, attributeMasterMap)) {
                    contactList.push(data)
                } else if (jobDataService.checkAddressField(data.jobAttributeMasterId, data.value, attributeMasterMap)) {
                    addressList.push(data)
                }
            }
        }
        if (!isObject) {
            dataList = dataList.sort((x, y) => x.sequence - y.sequence)
        }
        return {
            dataMap,
            dataList,
            contactList,
            addressList,
            autoIncrementId
        }
    }
}

export let jobDetailsService = new JobDetails()