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
    prepareDataObject(id, positionId, realmDBDataList, attributeMasterMap, attributeMap, isJob) {
        let dataMap = {},
            dataList = [],
            contactList = [],
            addressList = []
        let dataQuery
        if (isJob) {
            dataQuery = 'jobId = ' + id + ' AND parentId = ' + positionId
        } else {
            dataQuery = 'jobTransactionId = ' + id + ' AND parentId = ' + positionId
        }
        let filteredDataList = realm.filterRecordList(realmDBDataList, dataQuery)

        for (let index in filteredDataList) {
            let data = { ...filteredDataList[index] }
            let attributeMaster, attributeStatus

            if (isJob) {
                attributeMaster = attributeMasterMap[data.jobAttributeMasterId]
            } else {
                attributeMaster = attributeMasterMap[data.fieldAttributeMasterId]
            }

            if (isJob) {
                attributeStatus = attributeMap[data.jobAttributeMasterId]
            } else {
                attributeStatus = attributeMap[data.fieldAttributeMasterId]
            }

            if (!attributeMaster.hidden && data.value !== undefined && data.value !== null) {
                let dataObject = {}
                dataMap[data.jobAttributeMasterId] = {}
                dataObject.data = data
                dataObject.sequence = attributeStatus.sequence
                dataObject.label = attributeMaster.label
                dataObject.attributeTypeId = attributeMaster.attributeTypeId
                if (data.value.toLocaleLowerCase() == 'objectsarojfareye' || data.value.toLocaleLowerCase() == 'arraysarojfareye') {
                    let childDataObject = {}
                    // let childDataObject = prepareJobDataMap(id, data.positionId, realmDBDataList, attributeMasterMap)
                    if (isJob) {
                        dataMap[data.jobAttributeMasterId].childDataMap = dataObject.dataMap
                    } else {
                        dataMap[data.fieldAttributeMasterId].childDataMap = dataObject.dataMap
                    }
                    dataObject.childDataList = childDataObject.dataList
                }
                dataList.push(dataObject)

                if(isJob) {
                    dataMap[data.jobAttributeMasterId] = dataObject
                } else {
                    dataMap[data.fieldAttributeMasterId] = dataObject
                }

                if (data.parentId !== 0 || !isJob) {
                    continue
                } else if (jobDataService.checkContacNumber(data.jobAttributeMasterId, data.value, attributeMasterMap)) {
                    contactList.push(data)
                } else if (jobDataService.checkAddressField(data.jobAttributeMasterId, data.value, attributeMasterMap)) {
                    addressList.push(data)
                }
            }
        }
        dataList = dataList.sort((x, y) => x.sequence - y.sequence)
        return {
            dataMap,
            dataList,
            contactList,
            dataList
        }
    }
}

export let jobDetailsService = new JobDetails()