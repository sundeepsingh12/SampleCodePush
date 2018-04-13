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
    USER_SUMMARY,
    JOB_STATUS,
    JOB_MASTER,
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS
} from '../../lib/constants'
import { keyValueDBService } from './KeyValueDBService'
import { geoFencingService } from './GeoFencingService'
import _ from 'lodash'
import { draftService } from './DraftService'


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
        let dataList = isObject ? {} : []
        let filteredDataList = isJob ? realmDBDataList.filter(arrayItem => (arrayItem.parentId == positionId && arrayItem.jobId == id)) : realmDBDataList.filter(arrayItem => (arrayItem.parentId == positionId && arrayItem.jobTransactionId == id))
        for (let index in filteredDataList) {
            let data = filteredDataList[index]
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

    checkForEnablingStatus(enableOutForDelivery, enableResequenceRestriction, jobTime, jobMasterList, tabId, seqSelected, statusList, jobTransactionId, actionOnStatus) {
        let enableFlag = false
        if (enableOutForDelivery) { // check for out for delivery
            enableFlag = this.checkOutForDelivery(jobMasterList, statusList)
        }
        if (!enableFlag && enableResequenceRestriction && actionOnStatus != 1) { // check for enable resequence restriction and job closed
            enableFlag = this.checkEnableResequence(jobMasterList, tabId, seqSelected, statusList, jobTransactionId)
        }
        if (!enableFlag && jobTime) { // check for jobTime expiry
            enableFlag = this.checkJobExpire(jobTime)
        }
        return enableFlag
    }

    /**@function getParentStatusList(statusList,currentStatus,jobTransactionId)
     * ## It will get all parent status list of current jobTransaction.It will not add status of UNSEEN and SEEN code
     * 
     * @param {object} statusList - It contains data for all status
     * @param {object} currentStatus - It contains current status
     * @param {Number} jobTransactionId - It contains id of current jobTransaction
     *
     *@returns {Array} parentStatusList
     */

    async getParentStatusList(statusList, currentStatus, jobTransactionId) {
        let parentStatusList = []
        for (let status of statusList) {
            if (status.code === UNSEEN || _.isEqual(_.toLower(status.code), 'seen'))
                continue
            for (let nextStatus of status.nextStatusList) {
                if (currentStatus.id === nextStatus.id) { // check for currentStatus Id in  nextStatusList
                    parentStatusList.push([status.id, status.name, status.code, status.statusCategory])
                }
            }
        }
        if ((parentStatusList.length > 0 && await jobTransactionService.checkIdToBeSync(jobTransactionId))) { // check for parentStatusList length and jobTransaction sync with server 
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
        const jobAttributeTime = jobDataList[Object.keys(jobDataList)[0]] // get jobExpiry time from jobData list
        return ((jobAttributeTime != null && jobAttributeTime != undefined) && moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isAfter(jobAttributeTime.data.value)) ? 'Job Expired!' : false // check for jobExpiry time with current time of job completion
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
        const jobMasterIdWithEnableResequence = jobMasterList.value.filter((obj) => obj.enableResequenceRestriction == true)
        const statusMap = statusList.value.filter((status) => status.tabId == tabId && status.code !== UNSEEN)
        const firstEnableSequenceTransaction = jobTransactionService.getFirstTransactionWithEnableSequence(jobMasterIdWithEnableResequence, statusMap)
        return !(!_.isEmpty(firstEnableSequenceTransaction) && firstEnableSequenceTransaction.id != jobTransactionId && seqSelected >= firstEnableSequenceTransaction.seqSelected) ? false : "Please finish previous items first"
    }

    /**@function checkOutForDelivery(jobMasterList)
     * ## It will check for out for delivery of all job master transactions if there is any unseen transaction present, it return a string value.
     * 
     * @param {object} jobMasterList - It contains data for all jobMaster
     *
     *@returns {string,Boolean} if unseentransaction present then return string else boolean
     */

    checkOutForDelivery(jobMasterList, statusList) {
        const jobMasterIdListWithDelivery = jobMasterList.value.filter((obj) => obj.enableOutForDelivery == true).map(obj => obj.id) // jobMaster Id list with out for delivery
        const mapOfUnseenStatusWithJobMaster = jobStatusService.getjobMasterIdStatusIdMap(jobMasterIdListWithDelivery, UNSEEN, statusList.value)
        const unseenTransactions = jobTransactionService.getJobTransactionsForStatusIds(Object.values(mapOfUnseenStatusWithJobMaster))
        return !(unseenTransactions && unseenTransactions.length > 0) ? false : "Please Scan all Parcels First"
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

    updateTransactionOnRevert(jobTransactionData, previousStatus) {
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

    /**@function setAllDataForRevertStatus(statusList,jobTransaction,previousStatus)
     * ## It will set all data for revert status and update realm database
     * 
     * @param {Array} statusList - job location latitude
     * @param {object} jobTransaction - user location latitud
     * @param {object} previousStatus - user location longitude
     * 
     * @description --> update userSummaryDb,jobSummaryDb,runsheetDb,transactionLogDb,jobTransactionDb,jobDb for status revert action
     */

    async setAllDataForRevertStatus(statusList, jobTransaction, previousStatus) {
        let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
        let lastTrackLog = { // update track location of user
            latitude: (userSummary.value.lastLat) ? userSummary.value.lastLat : 0,
            longitude: (userSummary.value.lastLng) ? userSummary.value.lastLng : 0
        }
        let user = await keyValueDBService.getValueFromStore(USER)
        let statusData = statusList.value.filter(list => list.id == jobTransaction.jobStatusId)
        let updatedJobDb = formLayoutEventsInterface._setJobDbValues(statusData, jobTransaction.jobId) // update JobDb on revert
        await formLayoutEventsInterface._updateJobSummary(jobTransaction, previousStatus[0], []) // update user Summary on revert
        await formLayoutEventsInterface._updateUserSummary(jobTransaction.jobStatusId, previousStatus[3], [jobTransaction], userSummary.value, previousStatus[0])
        let transactionLog = await formLayoutEventsInterface._updateTransactionLogs([jobTransaction], previousStatus[0], jobTransaction.jobStatusId, jobTransaction.jobMasterId, user, lastTrackLog) // update transaction log on revert
        let runSheet = await formLayoutEventsInterface._updateRunsheetSummary(jobTransaction.jobStatusId, previousStatus[3], [jobTransaction]) // update runSheet Summary on revert
        let updatedJobTransaction = this.updateTransactionOnRevert(jobTransaction, previousStatus) // update jobTransaction on revert
        await formLayoutEventsInterface.addTransactionsToSyncList(updatedJobTransaction.value) // add jobTransaction to sync list
        realm.performBatchSave(updatedJobTransaction, updatedJobDb, runSheet, transactionLog) // update jobTransaction, job, runSheet, transactionLog Db in batch
        await draftService.deleteDraftFromDb(jobTransaction)
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
        let jobTransaction = realm.getRecordListOnQuery(TABLE_JOB, 'id = ' + jobId, false)[0]; // get jobtransaction on jobId
        if (!jobTransaction.latitude || !jobTransaction.longitude || !userLat || !userLong)
            return false
        const dist = geoFencingService.distance(jobTransaction.latitude, jobTransaction.longitude, userLat, userLong)
        return (dist * 1000 >= 100)
    }

    async getJobDetailsParameters() {
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
        const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
        const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
        const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
        const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
        const fieldAttributeStatusList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_STATUS)
        return { statusList, jobMasterList, jobAttributeMasterList, fieldAttributeMasterList, fieldAttributeStatusList, jobAttributeStatusList }
    }
}

export let jobDetailsService = new JobDetails()