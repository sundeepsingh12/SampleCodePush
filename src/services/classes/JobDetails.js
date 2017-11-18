'use strict'

import * as realm from '../../repositories/realmdb'

import { jobTransactionService } from '../../services/classes/JobTransaction'
import { jobDataService } from './JobData'
import {jobStatusService} from './JobStatus'
import {
    ARRAY_SAROJ_FAREYE,
    CONTACT_NUMBER,
    OBJECT_SAROJ_FAREYE,
    UNSEEN
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
                if (data.value == OBJECT_SAROJ_FAREYE || data.value == ARRAY_SAROJ_FAREYE) {
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


    async checkOutForDelivery(jobMasterList){
        const jobListWithDelivery  = jobMasterList.value.filter((obj) => obj.enableOutForDelivery == true).map(obj => obj.id) 
        const mapOfUnseenStatusWithJobMaster = await jobStatusService.getjobMasterIdStatusIdMap(jobListWithDelivery,UNSEEN)
        let statusIds = Object.keys(mapOfUnseenStatusWithJobMaster).map(function(key) {
            return mapOfUnseenStatusWithJobMaster[key];
          });
        const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(statusIds)  
        return  !(unseenTransactions.length>0)
    }
}

export let jobDetailsService = new JobDetails()