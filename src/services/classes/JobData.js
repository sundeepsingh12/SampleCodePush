'use strict'

import {
    jobAttributeMasterService
} from './JobAttributeMaster'
import * as realm from '../../repositories/realmdb'
import {
    jobDetailsService
} from './JobDetails'
import {
    TABLE_JOB_DATA,
    TABLE_JOB_TRANSACTION,
    TABLE_JOB,
    TABLE_RUNSHEET,
    TABLE_FIELD_DATA,
} from '../../lib/constants'

import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CONTACT_NUMBER,
    LANDMARK,
    PINCODE
} from '../../lib/AttributeConstants'

class JobData {

    /**
     * 
     * @param {*} jobDataList 
     * @returns 
     * {
     *  JobDataMap : { 
     *                  JobId : {
     *                              JobAttributeMasterId :JobData 
     *                          } 
     *               }
     *  ContactMap : {
     *                  JobId : JobData
     *               }
     *  AddressMap : {
     *                  JobId : [JobData]
     *               }
     * }
     */
    getJobDataDetailsForListing(jobDataList, jobAttributeMasterMap) {
        let jobDataDetailsForListing = {},
            jobDataMap = {},
            contactMap = {},
            addressMap = {}
        jobDataList.forEach(jobDataObj => {
            const {
                jobAttributeMasterId,
                jobId,
                parentId,
                value
            } = jobDataObj
            let jobData = {
                jobId,
                jobAttributeMasterId,
                value
            }

            if (parentId !== 0) {
                return
            }

            jobDataMap[jobId] = jobDataMap[jobId] ? jobDataMap[jobId] : {}

            jobDataMap[jobId][jobAttributeMasterId] = jobData
            if (this.checkContacNumber(jobAttributeMasterId, value, jobAttributeMasterMap)) {
                contactMap[jobId] = contactMap[jobId] ? contactMap[jobId] : []
                contactMap[jobId].push(jobData)
            } else if (this.checkAddressField(jobAttributeMasterId, value, jobAttributeMasterMap)) {
                addressMap[jobId] = addressMap[jobId] ? addressMap[jobId] : []
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
            jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId !== CONTACT_NUMBER ||
            value == undefined || value == null || value.trim() === '' ||
            value.length < 6 || /(.)\\1+/.test(value)) {
            return false
        }
        return true
    }

    /**
     * This method checks if job attrinute is of address type
     * @param {*} jobAttributeMasterId 
     * @param {*} value 
     * @param {*} jobAttributeMasterMap 
     */
    checkAddressField(jobAttributeMasterId, value, jobAttributeMasterMap) {
        if (!jobAttributeMasterMap[jobAttributeMasterId]) {
            return false
        }
        if (jobAttributeMasterMap[jobAttributeMasterId].hidden ||
            value == undefined || value == null || value.trim() === '') {
            return false
        }
        if (jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == ADDRESS_LINE_1 ||
            jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == ADDRESS_LINE_2 ||
            jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == LANDMARK ||
            jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == PINCODE) {
            return true
        }
        return false
    }

    /**
     * This method fetch data from db and prepares job data object for display
     * @param {*} jobId 
     * @param {*} jobAttributeMasterMap 
     * @param {*} jobAttributeMap 
     * @returns 
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
     * 
     */
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


    /**Returns parentId Vs JobData List
     * 
     * @param {*} jobDatas 
     */
    getParentIdJobDataListMap(jobDatas) {
        let parentIdJobDataListMap = {}
        jobDatas.forEach(jobData => {
            let jobDataList = (parentIdJobDataListMap[jobData.parentId]) ? parentIdJobDataListMap[jobData.parentId] : []
            jobDataList.push(jobData)
            parentIdJobDataListMap[jobData.parentId] = jobDataList
        })
        return parentIdJobDataListMap
    }

    /**Returns job data map for transaction list
     * 
     * @param {*} jobTransactionList 
     */
    getJobData(jobTransactionList) {
        let jobDataQuery = jobTransactionList.map(jobTransaction => 'jobId = ' + jobTransaction.jobId).join(' OR ')
        let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery, null, null)
        let jobDataMap = {}
        jobDataList.forEach(jobDataObj => {
            const {
                jobAttributeMasterId,
                jobId,
                parentId,
                value
            } = jobDataObj
            let jobData = {
                jobId,
                jobAttributeMasterId,
                value
            }
            jobDataMap[jobId] = jobDataMap[jobId] ? jobDataMap[jobId] : {}

            jobDataMap[jobId][jobAttributeMasterId] = jobData
        })
        return jobDataMap
    }
}
export let jobDataService = new JobData()