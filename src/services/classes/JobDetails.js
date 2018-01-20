'use strict'

import * as realm from '../../repositories/realmdb'

import { jobDataService } from './JobData'
import { jobTransactionService } from './JobTransaction'
import { jobStatusService } from './JobStatus'
import {
    ARRAY_SAROJ_FAREYE,
    CONTACT_NUMBER,
    OBJECT_SAROJ_FAREYE,
    UNSEEN
} from '../../lib/AttributeConstants'
import moment from 'moment'
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface'
import {
    TABLE_JOB,
    USER,
    TABLE_JOB_TRANSACTION,
    USER_SUMMARY
} from '../../lib/constants'
import { keyValueDBService } from './KeyValueDBService'


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
    
    /**@function checkForEnablingStatus(enableOutForDelivery,enableResequenceRestriction,jobTime,jobMasterList,tabId,seqSelected,statusList,jobTransactionId)
     * ## It will get all parent status list of current jobTransaction.
     * 
     * @param {Boolean} enableOutForDelivery - It contains boolean value to check enableOutForDelivery is enable in jobMaster 
     * @param {Boolean} enableResequenceRestriction - It contains boolean value to check enableResequenceRestriction is enable in jobMaster
     * @param {string} jobTime - It contains string value
     * @param {object} jobMasterList - It contains all job masters
     * @param {Number} tabId - It contains current tab Id
     * @param {Number} seqSelected - It contains current transaction sequence selected
     * @param {object} statusList - It contains all status 
     * @param {Number} jobTransactionId - It contains current id of job transaction 
     * 
     *@returns {string,Boolean} It returns boolean if enableOutForDelivery,enableResequenceRestriction and jobTime cases fail
     */

   async checkForEnablingStatus(enableOutForDelivery, enableResequenceRestriction, jobTime, jobMasterList, tabId, seqSelected, statusList, jobTransactionId){
       let enableFlag = false
        if(enableOutForDelivery){
            enableFlag =  await this.checkOutForDelivery(jobMasterList)
        }
        if(!enableFlag && enableResequenceRestriction){
            enableFlag =  this.checkEnableResequence(jobMasterList, tabId, seqSelected, statusList, jobTransactionId)
        }
        if(!enableFlag && jobTime){
            enableFlag =  this.checkJobExpire(jobTime)
        }
        return enableFlag
    }
    
    /**@function getParentStatusList(statusList,currentStatus,jobTransactionId)
     * ## It will get all parent status list of current jobTransaction.
     * 
     * @param {object} statusList - It contains data for all status
     * @param {object} currentStatus - It contains current status
     * @param {Number} jobTransactionId - It contains id of current jobTransaction
     *
     *@returns {Array} parentStatusList
     */

    async getParentStatusList(statusList,currentStatus,jobTransactionId){
        let parentStatusList = []
        for(let status of statusList){
            if(status.code === UNSEEN)
                continue
            for(let nextStatus of status.nextStatusList){
                if(currentStatus.id === nextStatus.id){
                   parentStatusList.push([status.id, status.name, status.code, status.statusCategory])
                }
            }
        }
        if((parentStatusList.length > 0 && await jobTransactionService.checkIdToBeSync(jobTransactionId))){
            parentStatusList = []
            parentStatusList.push(1)
        }
        return parentStatusList
    }

    /**@function checkJobExpire(jobDataList)
     * ## It will check for job Expiry time of job Transaction if it expires ,return a string value.
     * 
     * @param {object} jobDataList - It contains data for transaction jobDataList
     *
     *@returns {string,Boolean} if jobExpire, return string else boolean
     */

    checkJobExpire(jobDataList) {
        const jobAttributeTime = jobDataList[Object.keys(jobDataList)[0]]
        return ((jobAttributeTime != null && jobAttributeTime != undefined) && moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isAfter(jobAttributeTime.data.value)) ? 'Job Expired!' : false
    }

    /**@function checkEnableResequence(jobMasterList,tabId,seqSelected,statusList,jobTransactionId)
     * ## It will check for enable resequence of all job master transactions if there is any first enable resequence transaction present, it return a string value.
     * 
     * @param {object} jobMasterList - It contains data for all jobMasterList
     * @param {Number} tabId - It contains data for all jobMasterList
     * @param {Number} seqSelected - It contains data for all jobMasterList
     * @param {object} statusList - It contains data for all jobMasterList
     * @param {Number} jobTransactionId - It contains data for all jobMasterList
     * 
     *@returns {string,Boolean} if seqSelected value is greater than firstEnableSequenceTransaction seqSelected value  then return boolean else string
     */

    checkEnableResequence(jobMasterList, tabId, seqSelected, statusList, jobTransactionId) {
        const jobMasterIdWithEnableResequence = jobMasterList.value.filter((obj) => obj.enableResequenceRestriction == true).map(obj => obj.id)
        const statusMap = statusList.value.filter((status) => status.tabId == tabId && status.code !== UNSEEN).map(obj => obj.id)
        const firstEnableSequenceTransaction = jobTransactionService.getFirstTransactionWithEnableSequence(jobMasterIdWithEnableResequence, statusMap)
        return !(firstEnableSequenceTransaction.id != jobTransactionId && seqSelected >= firstEnableSequenceTransaction.seqSelected) ? false : "Please finish previous items first"
    }

    /**@function checkOutForDelivery(jobMasterList)
     * ## It will check for out for delivery of all job master transactions if there is any unseen transaction present, it return a string value.
     * 
     * @param {object} jobMasterList - It contains data for all jobMaster
     *
     *@returns {string,Boolean} if unseentransaction present then return string else boolean
     */

    async checkOutForDelivery(jobMasterList) {
        const jobListWithDelivery = jobMasterList.value.filter((obj) => obj.enableOutForDelivery == true).map(obj => obj.id)
        const mapOfUnseenStatusWithJobMaster = await jobStatusService.getjobMasterIdStatusIdMap(jobListWithDelivery, UNSEEN)
        let statusIds = Object.keys(mapOfUnseenStatusWithJobMaster).map(function (key) {
            return mapOfUnseenStatusWithJobMaster[key];
        });
        const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(statusIds)
        return !(unseenTransactions.length > 0) ? false : "Please Scan all Parcels First"
    }

    /**@function toRadians(angle)
     * ## convert degree to radians
     * 
     * @param {string} angle - It contains data for form layout
     *
     *@returns {string} radians value
     */

    toRadians(angle) {
        return angle * (Math.PI / 180);
    }
    
    /**@function updateTransactionOnRevert(jobTransactionData,previousStatus)
     * ## It will update transactionData on revert status 
     * 
     * @param {object} jobTransactionData - It contains data for revert transaction
     * @param {object} previousStatus - It contains [jobStatusId,statusCode]
     * @returns {Object} --> {
         tableName,
         value: -> jobTransactionArray,
       }
     */

    updateTransactionOnRevert(jobTransactionData,previousStatus){
        let jobTransactionArray = [];
        let jobTransaction = Object.assign({}, jobTransactionData) // no need to have null checks as it is called from a private method        
        jobTransaction.jobStatusId = previousStatus[0]
        jobTransaction.statusCode = previousStatus[2]
        jobTransaction.actualAmount = 0.00
        jobTransaction.originalAmount = 0.00
        jobTransaction.lastUpdatedAtServer = moment().format('YYYY-MM-DD HH:mm:ss')
        jobTransactionArray.push(jobTransaction)
        return {
            tableName: TABLE_JOB_TRANSACTION,
            value: jobTransactionArray,
        }
    }

    /**@function distance(jobLat,jobLong,userLat,userLong)
     * ## find aerial distance between user location and job location
     * 
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

    /**@function setAllDataForRevertStatus(statusList,jobTransaction,previousStatus)
     * ## It will set all data for revert status and update realm database
     * 
     * @param {Array} statusList - job location latitude
     * @param {object} jobTransaction - user location latitud
     * @param {object} previousStatus - user location longitude
     * 
     * @description --> update userSummaryDb,jobSummaryDb,runsheetDb,transactionLogDb,jobTransactionDb,jobDb for status revert action
     */

    async setAllDataForRevertStatus(statusList,jobTransaction,previousStatus){
     let updatedJobTransaction
     let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)     
     let lastTrackLog = {
        latitude: (userSummary.value.lastLat) ? userSummary.value.lastLat : 0,
        longitude: (userSummary.value.lastLng) ? userSummary.value.lastLng : 0
     }
     let user = await keyValueDBService.getValueFromStore(USER)                
     let statusData = statusList.value.filter(list => list.id == jobTransaction.jobStatusId)
     let updatedJobDb = formLayoutEventsInterface._setJobDbValues(statusData,jobTransaction.jobId)
     await formLayoutEventsInterface._updateJobSummary(jobTransaction,previousStatus[0])
     let transactionLog = await formLayoutEventsInterface._updateTransactionLogs([jobTransaction],previousStatus[0],jobTransaction.jobStatusId,jobTransaction.jobMasterId,user, lastTrackLog)
     let runSheet = await formLayoutEventsInterface._updateRunsheetSummary(jobTransaction,previousStatus[3]) 
     updatedJobTransaction = this.updateTransactionOnRevert(jobTransaction,previousStatus)  
     await formLayoutEventsInterface.addTransactionsToSyncList(updatedJobTransaction.value)       
     realm.performBatchSave(updatedJobTransaction, updatedJobDb, runSheet, transactionLog)  
    }

    /**@function checkLatLong(jobId,userLat,userLong)
     * ## check if distance between user and job is less than 100 m or not
     * 
     * @param {string} jobId - job location latitude
     * @param {string} userLat - user location latitud
     * @param {string} userLong - user location longitude
     * 
     * @returns {boolean} - true if distance is greater than 100m else false
     */
    checkLatLong(jobId, userLat, userLong) {
        let jobTransaction = realm.getRecordListOnQuery(TABLE_JOB, 'id = ' + jobId, false)[0];
        if (!jobTransaction.latitude || !jobTransaction.longitude || !userLat || !userLong)
            return false
        const dist = this.distance(jobTransaction.latitude, jobTransaction.longitude, userLat, userLong)
        return (dist * 1000 >= 100)
    }
}

export let jobDetailsService = new JobDetails()