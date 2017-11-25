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


import {
    TABLE_JOB,
} from '../../lib/constants'

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
    /**
     * ## convert degree to radians
     * @param {string} angle - It contains data for form layout
     *
     *@returns {string} radians value
     */
    toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    /**
     * ## find aerial distance between user location and job location
     * @param {string} jobLat - job location latitude
     * @param {string} jobLat - job location longitude
     * @param {string} userLat - user location latitud
     * @param {string} userLong - user location longitude
     * 
     * @returns {string} - distance between user and job locations
     */
    distance(jobLat, jobLong, userLat, userLong) {
        const theta = jobLong - userLong
        let dist = Math.sin(this.toRadians(jobLat)) * Math.sin(this.toRadians(userLat)) + Math.cos(this.toRadians(jobLat)) * Math.cos(this.toRadians(userLat)) * Math.cos(this.toRadians(theta));
        dist = (Math.acos(dist) * (180 / Math.PI)) * 60 * 1.1515 * 1.609344;
        return dist;
    }

    /**
     * ## check if distance between user and job is less than 100 m or not
     * @param {string} jobId - job location latitude
     * @param {string} userLat - user location latitud
     * @param {string} userLong - user location longitude
     * 
     * @returns {boolean} - true if distance is greater than 100m else false
     */
    checkLatLong(jobId, userLat, userLong) {
        let jobTransaction = realm.getRecordListOnQuery(TABLE_JOB, 'id = ' + jobId, false)[0];
        if ( !jobTransaction.latitude || !jobTransaction.longitude || !userLat || !userLong) 
            return false
        const dist = this.distance(jobTransaction.latitude, jobTransaction.longitude, userLat, userLong)
        return (dist * 1000 >= 100)
    }
}

export let jobDetailsService = new JobDetails()