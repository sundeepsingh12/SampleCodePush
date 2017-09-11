'use strict'

import { jobAttributeMasterService } from './JobAttributeMaster'
import * as realm from '../../repositories/realmdb'
import { jobDetailsService } from './JobDetails'
const {
    TABLE_JOB_DATA,
    TABLE_JOB_TRANSACTION,
    TABLE_JOB,
    TABLE_RUNSHEET,
    TABLE_FIELD_DATA,
} = require('../../lib/constants').default

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

    prepareJobDataForTransactionParticularStatus(jobId, jobAttributeMasterMap, jobAttributeMap) {
        const jobAttributeMapQuery = Object.keys(jobAttributeMap).map(jobAttributeMasterId => 'jobAttributeMasterId = ' + jobAttributeMasterId).join(' OR ')
        let jobDataQuery = 'jobId = ' + jobId
        if (jobAttributeMapQuery !== undefined && jobAttributeMapQuery !== null && jobAttributeMapQuery.length !== 0) {
            jobDataQuery += ' AND (' + jobAttributeMapQuery + ')'
        }
        let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery)
        let jobDataObject = jobDetailsService.prepareDataObject(jobId, 0, jobDataList, jobAttributeMasterMap, jobAttributeMap, true, 0, true)
        return jobDataObject
    }

}

export let jobDataService = new JobData()