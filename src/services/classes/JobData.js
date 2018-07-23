'use strict'

import * as realm from '../../repositories/realmdb'
import {
    jobDetailsService
} from './JobDetails'
import {
    TABLE_JOB_DATA,
} from '../../lib/constants'

import {
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CONTACT_NUMBER,
    LANDMARK,
    PINCODE,
    JOB_EXPIRY_TIME,

} from '../../lib/AttributeConstants'

import _ from 'lodash'

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
    getJobDataDetailsForListing(jobDataList, jobAttributeMasterMap, jobAttributeStatusMap = {}, jobIdJobTransactionStatusIdMap = {}) {
        let jobDataMap = {}, contactMap = {}, addressMap = {}, jobExpiryMap = {}
        for (let index in jobDataList) {
            const { jobAttributeMasterId, jobId, parentId, value } = jobDataList[index];
            const jobStatusId = jobIdJobTransactionStatusIdMap[jobId]
            let jobData = { jobId, jobAttributeMasterId, value };
            if (parentId !== 0) {
                continue;
            }
            jobDataMap[jobId] = jobDataMap[jobId] ? jobDataMap[jobId] : {};
            jobDataMap[jobId][jobAttributeMasterId] = jobData;
            if (this.checkContacNumber(jobAttributeMasterId, value, jobAttributeMasterMap)) {
                contactMap[jobId] = contactMap[jobId] ? contactMap[jobId] : [];
                contactMap[jobId].push(jobData);
            } else if (this.checkAddressField(jobAttributeMasterId, value, jobAttributeMasterMap)) {
                addressMap[jobId] = addressMap[jobId] ? addressMap[jobId] : [];
                addressMap[jobId].push(jobData);
            } else if (this.checkJobExpiryAttributeForParticularStatus(jobAttributeMasterId, value, jobAttributeMasterMap, jobAttributeStatusMap, jobStatusId)) {
                jobExpiryMap[jobId] = jobData
            }

        }
        return { jobDataMap, contactMap, addressMap, jobExpiryMap };
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
     * This method checks if job attribute is of address type
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

    /**This method checks if job expiry attribute is present
     * 
     * @param {*} jobAttributeMasterId 
     * @param {*} jobAttributeMasterMap 
     * @param {*} jobStatusId 
     * @param {*} jobAttributeStatusMap 
     */
    checkJobExpiryAttributeForParticularStatus(jobAttributeMasterId, value, jobAttributeMasterMap, jobAttributeStatusMap, jobStatusId) {
        if (!jobAttributeMasterMap[jobAttributeMasterId]) {
            return false
        }


        if (jobAttributeMasterMap[jobAttributeMasterId].hidden ||
            value == undefined || value == null || value.trim() === '') {
            return false
        }

        //Check if job expiry is mapped to the status in which job transaction is currently present or if job attribute is not mapped to any status
        if (jobAttributeMasterMap[jobAttributeMasterId].attributeTypeId == JOB_EXPIRY_TIME) {
            if (_.isEmpty(jobAttributeStatusMap) || !jobAttributeStatusMap[jobStatusId] || (jobAttributeStatusMap[jobStatusId] == jobAttributeMasterId)) {
                return true
            }

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
    getParentIdJobDataListMap(jobDatas, jobTransactionList) {
        let parentIdJobDataListMap = {}
        jobTransactionList.map((jobTransaction) => { parentIdJobDataListMap[jobTransaction.jobId] = {} })
        jobDatas.forEach(jobData => {
            let jobDataList = (parentIdJobDataListMap[jobData.jobId][jobData.parentId]) ? parentIdJobDataListMap[jobData.jobId][jobData.parentId] : []
            jobDataList.push(jobData)
            parentIdJobDataListMap[jobData.jobId][jobData.parentId] = jobDataList
        })
        return parentIdJobDataListMap
    }

    buildMasterIdDataMapFormList(dataList, dataMap, key) {
        if (_.isEmpty(dataList)) return
        for (let data in dataList) {
            let dataSet = (dataList[data] && dataList[data].data) ? dataList[data].data : null
            if (dataSet) {
                dataMap[dataSet[key]] = { value: dataSet.value }
            }
            if (dataList[data].childDataList) {
                this.buildMasterIdDataMapFormList(dataList[data].childDataList, dataMap, key)
            }
        }
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

    
    getCallerIdListAndJobId(incomingNumber,idJobAttributeMap,query){
        const allJobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA,query)
        let isNumberPresentInJobData = false,callerIdDisplayList = [],id=0,jobId
        allJobDataList.forEach(jobData=>{

            //Check whether number from which call is made is present in jobdata db and also get job id from that job data
            if(!isNumberPresentInJobData && idJobAttributeMap[jobData.jobAttributeMasterId].attributeTypeId == CONTACT_NUMBER && (incomingNumber==jobData.value)){
                isNumberPresentInJobData = true
                jobId = jobData.jobId
            }

            //Prepare callerIdDisplayList,This will be used for displaying info whenever call is made
            if(idJobAttributeMap[jobData.jobAttributeMasterId]  && idJobAttributeMap[jobData.jobAttributeMasterId].attributeTypeId != CONTACT_NUMBER ){
                callerIdDisplayList.push({id:id++,jobAttributeLabel:idJobAttributeMap[jobData.jobAttributeMasterId].label,value:jobData.value})
            }

        })
        return {isNumberPresentInJobData,callerIdDisplayList,jobId}
      
    }
}
export let jobDataService = new JobData()