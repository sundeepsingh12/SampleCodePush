'use strict'

import { jobAttributeMasterService } from './JobAttributeMaster'
import * as realm from '../../repositories/realmdb'
const {
    TABLE_JOB_DATA,
    TABLE_JOB_TRANSACTION,
    TABLE_JOB,
    TABLE_RUNSHEET,
    TABLE_FIELD_DATA,
} = require('../../lib/constants')

class JobData {

    /**
     * 
     * @param {*} jobDataList 
     * @returns 
     * {
     *  JobDataMap : Map<JobId,Map<JobAttributeMasterId,JobData>>
     *  ContactMap : Map<JobId,[JobData]>
     *  AddressMap : Map<JobId,[JobData]>
     * }
     */
    getJobDataDetailsForListing(jobDataList, jobAttributeMasterMap) {
        let jobDataDetailsForListing = {},
            jobDataMap = {},
            contactMap = {},
            addressMap = {}
        jobDataList.forEach(jobDataObj => {
            const jobId = jobDataObj.jobId
            const jobAttributeMasterId = jobDataObj.jobAttributeMasterId
            const value = jobDataObj.value
            const parentId = jobDataObj.parentId
            let jobData = {
                jobId,
                jobAttributeMasterId,
                value
            }

            if (parentId !== 0) {
                return
            }

            if (!jobDataMap[jobId]) {
                jobDataMap[jobId] = {}
            }

            jobDataMap[jobId][jobAttributeMasterId] = jobData
            if (this.checkContacNumber(jobAttributeMasterId, value, jobAttributeMasterMap)) {
                if (!contactMap[jobId]) {
                    contactMap[jobId] = []
                }
                contactMap[jobId].push(jobData)
            } else if (this.checkAddressField(jobAttributeMasterId, value, jobAttributeMasterMap)) {
                if (!addressMap[jobId]) {
                    addressMap[jobId] = []
                }
                addressMap[jobId].push(jobData)
            }
        })
        jobDataDetailsForListing.jobDataMap = jobDataMap
        jobDataDetailsForListing.contactMap = contactMap
        jobDataDetailsForListing.addressMap = addressMap
        return jobDataDetailsForListing
    }

    /**
     * This method checks if job attrinute is a contact number,
     * contact number is greater than 6 digits
     * all digits of number are not same(eg 1111111,222222)
     * @param {*} jobData 
     * @param {*} jobAttributeMasterMap 
     */
    checkContacNumber(jobAttributeMasterId, value, jobAttributeMasterMap) {
        if (!jobAttributeMasterMap[jobAttributeMasterId]) {
            return false
        }
        if (jobAttributeMasterMap[jobAttributeMasterId].hidden ||
            jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId !== 27 ||
            value == undefined || value == null || value.trim() === '' ||
            value.length < 6 || /(.)\\1+/.test(value)) {
            return false
        }
        return true
    }

    checkAddressField(jobAttributeMasterId, value, jobAttributeMasterMap) {
        if (!jobAttributeMasterMap[jobAttributeMasterId]) {
            return false
        }
        if (jobAttributeMasterMap[jobAttributeMasterId].hidden ||
            value == undefined || value == null || value.trim() === '') {
            return false
        }
        if (jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == 28 ||
            jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == 29 ||
            jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == 30 ||
            jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == 31) {
            return true
        }
        return false
    }




    /**
     * 
     * @param {*} jobId 
     * @param {*} positionId 
     * @param {*} jobDataList 
     * @param {*} jobAttributeMasterMap 
     * @param {*} jobAttributeMap 
     * @returns jobDataObject {
     *              jobDataList : [
     *                  {
     *                      jobData,
     *                      sequence
     *                      label,
     *                      attributeTypeId,
     *                      childJobDataList : [jobDataList]
     *                  }
     *               ]
     *              jobDataMap : {
     *                  jobAttributeMasterId : {
     *                                              jobData,
     *                                              childJobDataMap
     *                                         }
     *              }
     * }
     */
    prepareJobDataObject(jobId, positionId, realmJobDataList, jobAttributeMasterMap, jobAttributeMap) {
        let jobDataMap = {},
            jobDataList = [],
            contactList = [],
            addressList = []
        let jobDataQuery = 'jobId = ' + jobId + ' AND parentId = ' + positionId
        let filteredJobDataList = realm.filterRecordList(realmJobDataList, jobDataQuery)

        for (let index in filteredJobDataList) {
            let jobData = {...filteredJobDataList[index] }
            let jobAttributeMaster = jobAttributeMasterMap[jobData.jobAttributeMasterId]
            let jobAttributeStatus = jobAttributeMap[jobData.jobAttributeMasterId]
            if (!jobAttributeMaster.hidden && jobData.value !== undefined && jobData.value !== null) {
                let jobDataObject = {}
                    // jobDataMap[jobAttributeMaster.attributeTypeId] = {}
                jobDataMap[jobData.jobAttributeMasterId] = {}
                jobDataObject.jobData = jobData
                jobDataObject.sequence = jobAttributeStatus.sequence
                jobDataObject.label = jobAttributeMaster.label
                jobDataObject.attributeTypeId = jobAttributeMaster.attributeTypeId
                    // jobDataList[jobAttributeStatus.sequence] = {}
                    // jobDataList[jobAttributeStatus.sequence].jobData = []
                if (jobData.value.toLocaleLowerCase() == 'objectsarojfareye' || jobData.value.toLocaleLowerCase() == 'arraysarojfareye') {
                    let childJobDataObject = prepareJobDataMap(jobId, jobData.positionId, jobDataList, jobAttributeMasterMap)
                    jobDataMap[jobData.jobAttributeMasterId].childJobDataMap = jobDataObject.jobDataMap
                    jobDataObject.childJobDataList = childJobDataObject.jobDataList
                        // sequenceJobDataMap[jobAttributeStatus.sequence].childJobDataMap = sequenceJobDataMap
                }
                jobDataList.push(jobDataObject)
                jobDataMap[jobData.jobAttributeMasterId] = jobDataObject
                    // sequenceJobDataMap[jobAttributeStatus.sequence].jobData.push(jobData)
                if (parentId !== 0) {
                    continue
                } else if (this.checkContacNumber(jobData.jobAttributeMasterId, jobData.value, jobAttributeMasterMap)) {
                    contactList.push(jobData)
                } else if (this.checkAddressField(jobData.jobAttributeMasterId, jobData.value, jobAttributeMasterMap)) {
                    addressList.push(jobData)
                }
            }
        }
        jobDataList = jobDataList.sort((x, y) => x.sequence - y.sequence)
        return {
            jobDataMap,
            jobDataList
        }
    }

    prepareJobDataForTransactionParticularStatus(jobId, jobAttributeMasterMap, jobAttributeMap) {
        const jobAttributeMapQuery = Object.keys(jobAttributeMap).map(jobAttributeMasterId => 'jobAttributeMasterId == ' + jobAttributeMasterId).join(' OR ')
        let jobDataQuery = 'jobId = ' + jobId + ' AND (' + jobAttributeMapQuery + ')'
        let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery)
        let jobDataObject = this.prepareJobDataObject(jobId, 0, jobDataList, jobAttributeMasterMap, jobAttributeMap)
        return jobDataObject
    }

}

export let jobDataService = new JobData()