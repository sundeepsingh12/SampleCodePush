import _ from 'lodash';
import moment from 'moment';
import sha256 from 'sha256';
import { AFTER, AMOUNT, BEFORE, DATA_STORE, EXTERNAL_DATA_STORE, FAIL, GET, MONEY_COLLECT, NPS_FEEDBACK, PENDING, RE_ATTEMPT_DATE, SEQUENCE_COUNT, SEQUENCE_ID, SEQUENCE_ID_UNAVAILABLE, SIGNATURE_AND_FEEDBACK, SKU_ARRAY, SUCCESS, TOKEN_MISSING } from '../../../lib/AttributeConstants';
import RestAPIFactory from '../../../lib/RestAPIFactory';
import CONFIG from '../../../lib/config';
import { CUSTOM_NAMING, DEVICE_IMEI, HUB, JOB_MASTER, JOB_STATUS, JOB_SUMMARY, LAST_JOB_COMPLETED_TIME, NEXT_FOCUS, PENDING_SYNC_TRANSACTION_IDS, PREVIOUSLY_TRAVELLED_DISTANCE, TABLE_FIELD_DATA, TABLE_JOB, TABLE_JOB_TRANSACTION, TABLE_RUNSHEET, TABLE_TRANSACTION_LOGS, TRACK_BATTERY, TRANSACTION_TIME_SPENT, USER, USER_SUMMARY } from '../../../lib/constants';
import * as realm from '../../../repositories/realmdb';
import { addServerSmsService } from '../AddServerSms';
import { fieldValidationService } from '../FieldValidation';
import { jobStatusService } from '../JobStatus';
import { keyValueDBService } from '../KeyValueDBService.js';



export default class FormLayoutEventImpl {

    /**
     * sets nextEditable and focusable to true and disables or enables save
     * on the basis of values filled in required fields
     * 
     * @param {*fieldAttributeMasterId} attributeMasterId 
     * @param {*formLayoutMap} formLayoutObject 
     * @param {*nextEditableObject} nextEditable 
     * @param {*isSaveDisabled} isSaveDisabled 
     * @param {*fieldAttribute value} value 
     */
    findNextFocusableAndEditableElements(attributeMasterId, formLayoutObject, isSaveDisabled, value, fieldDataList, event, jobTransaction, fieldAttributeMasterParentIdMap, jobAndFieldAttributesList) {
        let isAllAttributeHidden = true //this is a check if there are all hidden attribute or not
        if (attributeMasterId && formLayoutObject.get(attributeMasterId)) {
            this.updateFieldInfo(attributeMasterId, value, formLayoutObject, event, fieldDataList);
        }
        isSaveDisabled = false

        for (var [key, value] of formLayoutObject) {

            if (key != attributeMasterId || event == NEXT_FOCUS) {
                value.focus = false
            }
            // if (!value.value && value.value !== 0 && value.required) {
            //     isSaveDisabled = true
            // }

            if (value.displayValue || value.displayValue === 0) {
                continue
            }
            if (!value.hidden) {//if any visible attribute present then set isAllAttributeHidden to false
                isAllAttributeHidden = false
            }
            value.editable = true
            if (value.required) {
                value.focus = event == NEXT_FOCUS ? true : value.focus
                isSaveDisabled = true
                if (event != NEXT_FOCUS) {
                    break
                }
            }
            if (event == NEXT_FOCUS && value.attributeTypeId !== DATA_STORE && value.attributeTypeId !== EXTERNAL_DATA_STORE) {
                let beforeValidationResult = fieldValidationService.fieldValidations(value, formLayoutObject, BEFORE, jobTransaction, fieldAttributeMasterParentIdMap, jobAndFieldAttributesList)
                let valueAfterValidation = formLayoutObject.get(value.fieldAttributeMasterId).value
                if (!valueAfterValidation && valueAfterValidation !== 0) {
                    if (value.required) {
                        isSaveDisabled = true
                        break
                    } else {
                        isSaveDisabled = false
                        continue
                    }
                }
                let afterValidationResult = fieldValidationService.fieldValidations(formLayoutObject.get(value.fieldAttributeMasterId), formLayoutObject, AFTER, jobTransaction, fieldAttributeMasterParentIdMap, jobAndFieldAttributesList)
                if (!afterValidationResult && value.required) {
                    break
                } else {
                    isSaveDisabled = false
                    value.focus = false
                }
            }
            if (isSaveDisabled) {
                break
            }
        }
        if (!isSaveDisabled) {
            if (formLayoutObject.get(attributeMasterId)) {
                formLayoutObject.get(attributeMasterId).focus = true
            }
        }
        return { formLayoutObject, isSaveDisabled, isAllAttributeHidden }
    }

    /**
     * enables/disables save and sets checkMark = false if required element does not contain value
     * 
     * @param {*fieldAttributeMasterId} attributeMasterId 
     * @param {*isSaveDisabled} isSaveDisabled 
     * @param {*formLayoutMap} formLayoutObject 
     * @param {*fieldValue} value 
     */
    disableSave(attributeMasterId, isSaveDisabled, formLayoutObject, value) {
        this.updateFieldInfo(attributeMasterId, value, formLayoutObject);
        if (formLayoutObject.get(attributeMasterId) && formLayoutObject.get(attributeMasterId).required) {
            formLayoutObject.get(attributeMasterId).showCheckMark = false;
            return true;
        }
        return isSaveDisabled
    }

    /**
     * sets fieldData value to formLayoutDto and 
     * sets checkMark to true only if called from ON_BLUR event
     * 
     * @param {*} attributeMasterId 
     * @param {*} value 
     * @param {*} formLayoutObject 
     * @param {*} calledFrom 
     */
    updateFieldInfo(attributeMasterId, value, formLayoutObject, calledFrom, fieldDataList) {
        formLayoutObject.get(attributeMasterId).displayValue = (value != null && value != undefined && calledFrom == NEXT_FOCUS && value.length != 0 && value.length < 64 &&
            formLayoutObject.get(attributeMasterId).attributeTypeId == 61) ? sha256(value) : value;
        formLayoutObject.get(attributeMasterId).childDataList = fieldDataList ? fieldDataList : formLayoutObject.get(attributeMasterId).childDataList
        if (!calledFrom) {
            formLayoutObject.get(attributeMasterId).alertMessage = null
        }
        return formLayoutObject;
    }

    /**@function getSequenceAttrData(sequenceMasterId)
     * It hits api to get sequence attr data from server.
     * 
     * @param {Number} sequenceMasterId 
     * 
     * @returns {float}  -> data
     */

    async getSequenceAttrData(sequenceMasterId) {
        if (_.isNull(sequenceMasterId) || _.isUndefined(sequenceMasterId))
            throw new Error(SEQUENCE_ID_UNAVAILABLE)
        const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        if (!token) {
            throw new Error(TOKEN_MISSING)
        }
        let masterData = SEQUENCE_ID + sequenceMasterId + SEQUENCE_COUNT + 1;
        const url = (masterData == null) ? CONFIG.API.GET_SEQUENCE_NEXT_COUNT : CONFIG.API.GET_SEQUENCE_NEXT_COUNT + "?" + masterData
        let getSequenceData = await RestAPIFactory(token.value).serviceCall(null, url, GET)
        let json = await getSequenceData.json
        let data = (!_.isNull(json[0]) && !_.isUndefined(json[0]) && !_.isEmpty(json[0])) ? json[0] : null;
        return data
    }

    /**
     * called on saving button and saves Data in db or store
     * currently saving fieldData, jobTransaction and job
     * @param {*formLayoutMap} formLayoutObject 
     * @param {*transactionId} jobTransactionId 
     * @param {*statusId} statusId 
     * @param {*jobMasterId} jobMasterId
     */
    async saveData(formLayoutObject, jobTransactionId, statusId, jobMasterId, jobTransactionList) {
        try {
            let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
            let user = await keyValueDBService.getValueFromStore(USER)
            let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
            let previouslyTravelledDistance = await keyValueDBService.getValueFromStore(PREVIOUSLY_TRAVELLED_DISTANCE)
            previouslyTravelledDistance = (!parseFloat(previouslyTravelledDistance)) ? 0 : previouslyTravelledDistance.value
            let trackKms = userSummary.value.gpsKms - previouslyTravelledDistance
            let trackTransactionTimeSpent = await keyValueDBService.getValueFromStore(TRANSACTION_TIME_SPENT)
            trackTransactionTimeSpent = moment().diff(trackTransactionTimeSpent.value, 'seconds')
            let trackBattery = await keyValueDBService.getValueFromStore(TRACK_BATTERY)
            let gpsKms = (!userSummary.value.gpsKms) ? "0" : userSummary.value.gpsKms
            await keyValueDBService.validateAndSaveData(PREVIOUSLY_TRAVELLED_DISTANCE, gpsKms)
            let lastTrackLog = {
                latitude: (userSummary.value.lastLat) ? userSummary.value.lastLat : 0,
                longitude: (userSummary.value.lastLng) ? userSummary.value.lastLng : 0
            }
            let fieldData, jobTransaction, job, dbObjects
            if (jobTransactionList && jobTransactionList.length) { //Case of bulk
                fieldData = this._saveFieldDataForBulk(formLayoutObject, jobTransactionList, currentTime)
                dbObjects = await this._getDbObjects(jobTransactionId, statusId, jobMasterId, currentTime, user, jobTransactionList)
                jobTransaction = this._setBulkJobTransactionValues(dbObjects.jobTransaction, dbObjects.status[0], dbObjects.jobMaster[0], dbObjects.user.value, dbObjects.hub.value, dbObjects.imei.value, currentTime, lastTrackLog, trackKms, trackTransactionTimeSpent, trackBattery, fieldData.npsFeedbackValue, fieldData.amountMap) // to edit later 
                job = this._setBulkJobDbValues(dbObjects.status[0], dbObjects.jobTransaction, jobMasterId, dbObjects.user.value, dbObjects.hub.value, fieldData.reAttemptDate)
            }
            else {
                jobTransactionId = await this.changeJobTransactionIdInCaseOfNewJob(jobTransactionId, jobTransactionList)//In case of new job change jobTransactionId
                fieldData = this._saveFieldData(formLayoutObject, jobTransactionId, null, currentTime)
                dbObjects = await this._getDbObjects(jobTransactionId, statusId, jobMasterId, currentTime, user, jobTransactionList)
                jobTransaction = this._setJobTransactionValues(dbObjects.jobTransaction, dbObjects.status[0], dbObjects.jobMaster[0], dbObjects.user.value, dbObjects.hub.value, dbObjects.imei.value, currentTime, lastTrackLog, trackKms, trackTransactionTimeSpent, trackBattery, fieldData.npsFeedbackValue, fieldData.amountMap) //to edit later
                job = this._setJobDbValues(dbObjects.status[0], dbObjects.jobTransaction.jobId, jobMasterId, dbObjects.user.value, dbObjects.hub.value, dbObjects.jobTransaction.referenceNumber, currentTime, fieldData.reAttemptDate, lastTrackLog)
            }
            //TODO add other dbs which needs updation
            const customNaming = await keyValueDBService.getValueFromStore(CUSTOM_NAMING)
            if (customNaming && customNaming.value && customNaming.value.updateEta) {
                await this._getRunsheetIdToUpdateJobTransactions(jobTransaction.value, currentTime, dbObjects.status[0].statusCategory)
            }
            const prevStatusId = (jobTransactionList && jobTransactionList.length) ? dbObjects.jobTransaction[0].jobStatusId : dbObjects.jobTransaction.jobStatusId
            const transactionLog = await this._updateTransactionLogs(jobTransaction.value, statusId, prevStatusId, jobMasterId, user, lastTrackLog)
            const runSheet = (jobTransactionId >= 0 || (jobTransactionList && jobTransactionList.length)) ? await this._updateRunsheetSummary(prevStatusId, dbObjects.status[0].statusCategory, jobTransaction.value) : []
            await this._updateUserSummary(prevStatusId, dbObjects.status[0].statusCategory, jobTransaction.value, userSummary.value, dbObjects.status[0].id)
            await this._updateJobSummary(dbObjects.jobTransaction, statusId, jobTransactionList)
            let serverSmsLogs = await addServerSmsService.addServerSms(statusId, jobMasterId, fieldData, jobTransaction.value)
            realm.performBatchSave(fieldData, jobTransaction, transactionLog, runSheet, job, serverSmsLogs)
            await keyValueDBService.validateAndSaveData(LAST_JOB_COMPLETED_TIME, moment().format('YYYY-MM-DD HH:mm:ss'))
            await keyValueDBService.validateAndSaveData(TRANSACTION_TIME_SPENT, moment().format('YYYY-MM-DD HH:mm:ss'))
            return jobTransaction.jobTransactionDTOList
        } catch (error) {
        }
    }

    async _getRunsheetIdToUpdateJobTransactions(jobTransaction, currentTime, statusCategory) {
        try {
            let runsheetIdToJobTransactionMap = {}
            let delayInCompletingJobTransaction = null
            for (let index in jobTransaction) {
                if (jobTransaction[index].jobEtaTime && (statusCategory == FAIL || statusCategory == SUCCESS) && moment(currentTime).isAfter(jobTransaction[index].jobEtaTime)) {
                    if (_.isEmpty(runsheetIdToJobTransactionMap) || !runsheetIdToJobTransactionMap[jobTransaction[index].runsheetId] || jobTransaction[index].seqSelected > runsheetIdToJobTransactionMap[jobTransaction[index].runsheetId].seqSelected) {
                        delayInCompletingJobTransaction = moment(currentTime).unix() - moment(jobTransaction[index].jobEtaTime).unix()
                        runsheetIdToJobTransactionMap[jobTransaction[index].runsheetId] = jobTransaction[index].seqSelected
                    }
                }
            }
            if (!_.isNull(delayInCompletingJobTransaction) && !_.isEmpty(runsheetIdToJobTransactionMap)) {
                await this._updateEtaTimeOfJobtransactions(delayInCompletingJobTransaction, runsheetIdToJobTransactionMap)
            }
        } catch (error) {
        }
    }

    async _updateEtaTimeOfJobtransactions(delayInCompletingJobTransaction, runsheetIdToJobTransactionMap) {
        try {
            let jobTransactions = []
            const statusIds = await jobStatusService.getNonUnseenStatusIdsForStatusCategory(PENDING)
            for (let index in runsheetIdToJobTransactionMap) {
                let jobTransactionQueryToUpdateEta = '('
                jobTransactionQueryToUpdateEta += statusIds.map(statusId => 'jobStatusId = ' + statusId).join(' OR ')
                jobTransactionQueryToUpdateEta += `) AND runsheetId = "${index} "`
                jobTransactionQueryToUpdateEta += `AND seqSelected > "${runsheetIdToJobTransactionMap[index]}"`
                let jobTransactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQueryToUpdateEta)
                for (let index in jobTransactionList) {
                    let jobTransactionData = { ...jobTransactionList[index] }
                    jobTransactionData.jobEtaTime = moment((moment(jobTransactionData.jobEtaTime).unix() + delayInCompletingJobTransaction) * 1000).format('YYYY-MM-DD HH:mm:ss')
                    jobTransactions.push(jobTransactionData)
                }
            }
            realm.saveList(TABLE_JOB_TRANSACTION, jobTransactions)
        } catch (error) {
        }
    }

    _updateTransactionLogs(jobTransaction, statusId, prevStatusId, jobMasterId, user, lastTrackLog) {
        let transactionLogs = this._prepareTransactionLogsData(prevStatusId, statusId, jobTransaction, jobMasterId, user.value, moment().format('YYYY-MM-DD HH:mm:ss'), lastTrackLog)
        return { tableName: TABLE_TRANSACTION_LOGS, value: transactionLogs }
    }

    _prepareTransactionLogsData(prevStatusId, statusId, jobTransaction, jobMasterId, user, dateTime, lastTrackLog) {
        let transactionLogs = []
        for (let job in jobTransaction) {
            transactionLog = {
                userId: user.id,
                transactionId: jobTransaction[job].id,
                jobMasterId: jobMasterId,
                toJobStatusId: statusId,
                fromJobStatusId: prevStatusId,
                latitude: lastTrackLog.latitude,
                longitude: lastTrackLog.longitude,
                transactionTime: dateTime,
                updatedAt: dateTime,
                hubId: jobTransaction[job].hubId,
                cityId: jobTransaction[job].cityId,
                companyId: jobTransaction[job].companyId,
            }
            transactionLogs.push(transactionLog)
        }
        return transactionLogs
    }

    /**@function _updateUserSummary(prevStatusId,statusCategory,jobTransactionList,userSummary,nextStatusId)
     * update userSummaryDb  after completing transactions.
     * 
     * @param {Number} prevStatusId  // prev status id
     * @param {Number} statusCategory
     * @param {Array}  jobTransactionList // all transaction list
     * @param {Array} userSummary // userSummary list
     * @param {Number} nextStatusId // new status Id
     * 
     * @description => update count of user summary and collection type 
     * 
     */

    async _updateUserSummary(prevStatusId, statusCategory, jobTransactionList, userSummary, nextStatusId) {
        if (!jobTransactionList || !userSummary) { // check for jobTransactionList and userSummary
            return
        }
        const status = ['pendingCount', 'failCount', 'successCount']
        const moneyTypeCollectionTypeMap = { 'Collection-Cash': 'cashCollected', 'Collection-SOD': 'cashCollectedByCard', 'Refund': 'cashPayment' }
        const prevStatusCategory = await jobStatusService.getStatusCategoryOnStatusId(prevStatusId) // get previous Status Category
        const count = jobTransactionList.length
        if (prevStatusCategory && userSummary[status[prevStatusCategory - 1]] - count >= 0 && prevStatusId != nextStatusId) { // check for previous status category and negative userSummary count 
            userSummary[status[prevStatusCategory - 1]] -= count
        }
        if (jobTransactionList[0].moneyTransactionType && jobTransactionList[0].actualAmount > 0) { //check for moneyTransactionType and actualAmount of jobTransaction
            userSummary[moneyTypeCollectionTypeMap[jobTransactionList[0].moneyTransactionType]] += jobTransactionList[0].actualAmount * count
        }
        userSummary[status[statusCategory - 1]] += count // update next status count
        userSummary.lastOrderTime = (jobTransactionList[0].lastTransactionTimeOnMobile) ? jobTransactionList[0].lastTransactionTimeOnMobile : userSummary.lastOrderTime
        userSummary.lastOrderNumber = jobTransactionList[0].referenceNumber // update lastOrderNumber
        await keyValueDBService.validateAndSaveData(USER_SUMMARY, userSummary)
    }

    /**@function _updateJobSummary(jobTransaction,statusId,jobTransactionIdList)
     * update jobSummaryDb count after completing transactions.
     * 
     * @param {object} jobTransaction 
     * @param {Array} jobTransactionIdList // case of bulk
     * @param {Number} statusId // new transaction status Id
     * 
     */

    async _updateJobSummary(jobTransaction, statusId, jobTransactionList) {
        const prevStatusId = (jobTransactionList && jobTransactionList.length) ? jobTransaction[0].jobStatusId : jobTransaction.jobStatusId
        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
        const count = (jobTransactionList && jobTransactionList.length) ? jobTransactionList.length : 1
        let jobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
        jobSummaryList.value.forEach(item => {
            item.updatedTime = currentDate
            if (item.jobStatusId == prevStatusId) { // check for previous statusID
                item.count = (item.count - count >= 0) ? item.count - count : 0
            }
            if (item.jobStatusId == statusId) { // check for next statusID
                item.count += count
            }
        })
        await keyValueDBService.validateAndUpdateData(JOB_SUMMARY, jobSummaryList)
    }

    /**@function _updateRunsheetSummary(prevStatusId,statusCategory,jobTransactionList)
      * update runSheetDb count after completing transactions.
      *   and returns an object containing tablename and runSheetArray
      * 
      * @param {Number} prevStatusId 
      * @param {Array} jobTransactionList 
      * @param {Number} statusCategory // next status category
      * 
      * @returns {Object}  -> { tablename : TABLE, value : []}
      */

    async _updateRunsheetSummary(prevStatusId, statusCategory, jobTransactionList) {
        let runSheetList = []
        const status = ['pendingCount', 'failCount', 'successCount']
        const moneyTypeCollectionTypeMap = { 'Collection-Cash': 'cashCollected', 'Collection-SOD': 'cashCollectedByCard', 'Refund': 'cashPayment' }
        const prevStatusCategory = await jobStatusService.getStatusCategoryOnStatusId(prevStatusId) // get previous status category
        const runSheetData = realm.getRecordListOnQuery(TABLE_RUNSHEET, null)
        let runsheetMap = runSheetData.reduce(function (total, current) {
            total[current.id] = Object.assign({}, current);
            return total;
        }, {}); // build map of runsheetId and runsheet
        let prevJobTransactionValue = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION) // in case of mapping of moneycollect to more than 1 status, we have to get actual amount in previous status
        let prevJobTransactionMap = _.keyBy(prevJobTransactionValue, 'id')
        for (let id in jobTransactionList) {
            if (prevStatusCategory && runsheetMap[jobTransactionList[id].runsheetId][status[prevStatusCategory - 1]] > 0) { // check for previousStatus category undefined and runSheetMap conut is greater than 0 
                runsheetMap[jobTransactionList[id].runsheetId][status[prevStatusCategory - 1]] -= 1
            }
            runsheetMap[jobTransactionList[id].runsheetId][status[statusCategory - 1]] += 1;
            if (jobTransactionList[id].moneyTransactionType && jobTransactionList[id].actualAmount > 0) { // check for moneyTransactionType and  actualAmount
                if (prevJobTransactionMap[jobTransactionList[id].id].moneyTransactionType == jobTransactionList[id].moneyTransactionType && prevJobTransactionMap[jobTransactionList[id].id].actualAmount > 0) {
                    runsheetMap[jobTransactionList[id].runsheetId][moneyTypeCollectionTypeMap[jobTransactionList[id].moneyTransactionType]] += jobTransactionList[id].actualAmount - prevJobTransactionMap[jobTransactionList[id].id].actualAmount
                } else {
                    runsheetMap[jobTransactionList[id].runsheetId][moneyTypeCollectionTypeMap[jobTransactionList[id].moneyTransactionType]] += jobTransactionList[id].actualAmount
                }
            }
            runSheetList.push(runsheetMap[jobTransactionList[id].runsheetId])
        }
        return { tableName: TABLE_RUNSHEET, value: runSheetList }
    }


    /**
     * creates fieldData db structure for current transaction
     * and returns an object containing fieldDataArrayinue
     * 
     * @param {*formLayoutMap} formLayoutObject 
     * @param {*jobTransactionId} jobTransactionId 
     */
    _saveFieldData(formLayoutObject, jobTransactionId, isBulk, currentTime) {
        let currentFieldDataObject = {} // used object to set currentFieldDataId as call-by-reference whereas if we take integer then it is by call-by-value and hence value of id is not updated in that scenario.
        currentFieldDataObject.currentFieldDataId = realm.getRecordListOnQuery(TABLE_FIELD_DATA, null, true, 'id').length
        let fieldDataArray = []
        let npsFeedbackValue = null
        let reAttemptDate = null
        let moneyCollectObject = skuArrayObject = null
        let amountMap = {
            originalAmount: null,
            actualAmount: null,
            moneyTransactionType: null
        }
        for (var [key, value] of formLayoutObject) {
            if (value.attributeTypeId == 61) {
                continue
            } else if (value.attributeTypeId == NPS_FEEDBACK) {
                npsFeedbackValue = value.value
            } else if (value.attributeTypeId == SIGNATURE_AND_FEEDBACK) {
                let npsFeedback = _.values(value.childDataList).filter(item => item.attributeTypeId == NPS_FEEDBACK)
                npsFeedbackValue = _.isEmpty(npsFeedback) ? null : npsFeedback[0].value
            } else if (value.attributeTypeId == RE_ATTEMPT_DATE) {
                reAttemptDate = value.value
            } else if (value.attributeTypeId == MONEY_COLLECT && value.jobTransactionIdAmountMap && value.childDataList) {
                if (isBulk) {
                    moneyCollectObject = value
                    continue
                } else {
                    amountMap.actualAmount = value.jobTransactionIdAmountMap.actualAmount
                    amountMap.originalAmount = value.jobTransactionIdAmountMap.originalAmount
                    amountMap.moneyTransactionType = value.jobTransactionIdAmountMap.moneyTransactionType
                }
            } else if (value.attributeTypeId == SKU_ARRAY && value.childDataList) {
                if (isBulk) {
                    skuArrayObject = value
                    continue
                } else {
                    value.childDataList = value.childDataList[jobTransactionId].childDataList
                }
            }
            let fieldDataObject = this._convertFormLayoutToFieldData(value, jobTransactionId, ++currentFieldDataObject.currentFieldDataId, currentTime)
            fieldDataArray.push(fieldDataObject)
            if (value.childDataList && value.childDataList.length > 0) {
                currentFieldDataObject.currentFieldDataId = this._recursivelyFindChildData(value.childDataList, fieldDataArray, currentFieldDataObject, jobTransactionId, currentTime);
            }
        }
        return {
            tableName: TABLE_FIELD_DATA,
            value: fieldDataArray,
            npsFeedbackValue,
            reAttemptDate,
            moneyCollectObject,
            skuArrayObject,
            amountMap
        }
    }
    _saveFieldDataForSkuArrayInBulk(fieldData, jobTransactionId, lastId, currentTime) {
        let skuArrayFieldData = []
        let currentFieldDataObject = {}
        currentFieldDataObject.currentFieldDataId = lastId
        skuArrayFieldData.push(this._convertFormLayoutToFieldData(fieldData, jobTransactionId, ++currentFieldDataObject.currentFieldDataId, currentTime))
        if (fieldData.childDataList) {
            currentFieldDataObject.currentFieldDataId = this._recursivelyFindChildData(fieldData.childDataList[jobTransactionId].childDataList, skuArrayFieldData, currentFieldDataObject, jobTransactionId, currentTime);
        }
        return {
            skuArrayFieldData, currentFieldDataObject
        }
    }

    _saveFieldDataForBulk(formLayoutObject, jobTransactionList, currentTime) {
        let fieldDataArray = []
        const fieldData = this._saveFieldData(formLayoutObject, jobTransactionList[0].jobTransactionId, true, currentTime)//Get Field Data for first jobTransaction 
        let jobTransactionIdAmountMap = fieldData.moneyCollectObject ? fieldData.moneyCollectObject.jobTransactionIdAmountMap ? fieldData.moneyCollectObject.jobTransactionIdAmountMap : {} : {}
        fieldData.amountMap = fieldData.moneyCollectObject ? fieldData.moneyCollectObject.jobTransactionIdAmountMap ? fieldData.moneyCollectObject.jobTransactionIdAmountMap : fieldData.amountMap : fieldData.amountMap
        fieldDataArray.push(...fieldData.value)
        let lastId = fieldData.value.length
        let moneyCollectFieldData = []
        let skuArrayFieldData = []
        if (fieldData.moneyCollectObject) {
            moneyCollectFieldData.push(this._convertFormLayoutToFieldData(fieldData.moneyCollectObject, jobTransactionList[0].jobTransactionId, ++lastId, currentTime))
            let moneyCollectFieldDataObject = this.setMoneyCollectFieldDataForBulk(fieldData.moneyCollectObject.childDataList, jobTransactionList[0], lastId, jobTransactionIdAmountMap, currentTime)
            moneyCollectFieldData = moneyCollectFieldData.concat(moneyCollectFieldDataObject.fieldDataArray)
            lastId = moneyCollectFieldDataObject.lastId
        }
        if (fieldData.skuArrayObject) {
            let { skuArrayFieldData, currentFieldDataObject } = this._saveFieldDataForSkuArrayInBulk(fieldData.skuArrayObject, jobTransactionList[0].jobTransactionId, ++lastId, currentTime)
            lastId = currentFieldDataObject.currentFieldDataId
            fieldDataArray = fieldDataArray.concat(skuArrayFieldData)
        }
        fieldDataArray = fieldDataArray.concat(moneyCollectFieldData)

        //Now copy this fieldData for all other job transactions,just change job transaction id
        for (let i = 1; i < jobTransactionList.length; i++) {
            moneyCollectFieldData = skuArrayFieldData = []
            if (fieldData.moneyCollectObject) {
                moneyCollectFieldData.push(this._convertFormLayoutToFieldData(fieldData.moneyCollectObject, jobTransactionList[i].jobTransactionId, ++lastId, currentTime))
                let moneyCollectFieldDataObject = this.setMoneyCollectFieldDataForBulk(fieldData.moneyCollectObject.childDataList, jobTransactionList[i], lastId, jobTransactionIdAmountMap, currentTime)
                moneyCollectFieldData = moneyCollectFieldData.concat(moneyCollectFieldDataObject.fieldDataArray)
                lastId = moneyCollectFieldDataObject.lastId
            }
            if (fieldData.skuArrayObject) {
                let { skuArrayFieldData, currentFieldDataObject } = this._saveFieldDataForSkuArrayInBulk(fieldData.skuArrayObject, jobTransactionList[i].jobTransactionId, ++lastId, currentTime)
                lastId = currentFieldDataObject.currentFieldDataId
                fieldDataArray = fieldDataArray.concat(skuArrayFieldData)
            }
            let fieldDataForJobTransaction = []
            fieldData.value.forEach(fieldDataObject => {
                let newObject = { ...fieldDataObject }
                newObject.jobTransactionId = jobTransactionList[i].jobTransactionId
                newObject.id = ++lastId
                fieldDataArray.push(newObject)
            })
            fieldDataArray = fieldDataArray.concat(moneyCollectFieldData)
        }
        return {
            tableName: TABLE_FIELD_DATA,
            value: fieldDataArray,
            npsFeedbackValue: fieldData.npsFeedbackValue,
            reAttemptDate: fieldData.reAttemptDate,
            amountMap: fieldData.amountMap
        }
    }

    setMoneyCollectFieldDataForBulk(childDataList, jobTransaction, lastId, jobTransactionIdAmountMap, currentTime) {
        let fieldDataArray = []
        for (let index in childDataList) {
            if (childDataList[index].attributeTypeId == 25) {
                childDataList[index].value = jobTransactionIdAmountMap[jobTransaction.jobTransactionId] ? jobTransactionIdAmountMap[jobTransaction.jobTransactionId].originalAmount ? jobTransactionIdAmountMap[jobTransaction.jobTransactionId].originalAmount : 0 : 0
                fieldDataArray.push(this._convertFormLayoutToFieldData(childDataList[index], jobTransaction.jobTransactionId, ++lastId, currentTime))
            } else if (childDataList[index].attributeTypeId == 26) {
                childDataList[index].value = jobTransactionIdAmountMap[jobTransaction.jobTransactionId] ? jobTransactionIdAmountMap[jobTransaction.jobTransactionId].actualAmount ? jobTransactionIdAmountMap[jobTransaction.jobTransactionId].actualAmount : 0 : 0
                fieldDataArray.push(this._convertFormLayoutToFieldData(childDataList[index], jobTransaction.jobTransactionId, ++lastId, currentTime))
            } else if (childDataList[index].childDataList) {
                fieldDataArray.push(this._convertFormLayoutToFieldData(childDataList[index], jobTransaction.jobTransactionId, ++lastId, currentTime))
                let fieldDataObject = this.setMoneyCollectFieldDataForBulk(childDataList[index].childDataList, jobTransaction, lastId, jobTransactionIdAmountMap, currentTime)
                fieldDataArray = fieldDataArray.concat(fieldDataObject.fieldDataArray)
                lastId = fieldDataObject.lastId
            } else if (childDataList[index].key.toLocaleLowerCase() == AMOUNT) {
                childDataList[index].value = jobTransactionIdAmountMap[jobTransaction.jobTransactionId] ? jobTransactionIdAmountMap[jobTransaction.jobTransactionId].actualAmount ? jobTransactionIdAmountMap[jobTransaction.jobTransactionId].actualAmount : 0 : 0
                fieldDataArray.push(this._convertFormLayoutToFieldData(childDataList[index], jobTransaction.jobTransactionId, ++lastId, currentTime))
            } else {
                fieldDataArray.push(this._convertFormLayoutToFieldData(childDataList[index], jobTransaction.jobTransactionId, ++lastId, currentTime))
            }
        }
        return {
            fieldDataArray,
            lastId
        }
    }

    /**
     * recursively iterates over childDataList in fieldData
     * and helps in preparing fieldData
     * 
     * @param {*childDataList} childDataList 
     * @param {*fieldDataArray} fieldDataArray 
     * @param {*currentFieldDataObject} currentFieldDataObject 
     * @param {*jobTransactionId} jobTransactionId 
     */
    _recursivelyFindChildData(childDataList, fieldDataArray, currentFieldDataObject, jobTransactionId, currentTime) {
        for (let i = 0; i <= childDataList.length; i++) {
            let childObject = childDataList[i]
            if (!childObject) {
                return currentFieldDataObject.currentFieldDataId
            }
            let fieldDataObject = this._convertFormLayoutToFieldData(childObject, jobTransactionId, ++currentFieldDataObject.currentFieldDataId, currentTime);
            fieldDataArray.push(fieldDataObject)
            if (!childObject.childDataList || childObject.childDataList.length == 0) {
                continue
            } else {
                this._recursivelyFindChildData(childObject.childDataList, fieldDataArray, currentFieldDataObject, jobTransactionId, currentTime)
            }
        }
    }

    _convertFormLayoutToFieldData(formLayoutObject, jobTransactionId, id, currentTime) {
        return {
            id,
            value: formLayoutObject.value != undefined && formLayoutObject.value != null ? '' + formLayoutObject.value : null, // to make value as string
            jobTransactionId,
            positionId: formLayoutObject.positionId,
            parentId: formLayoutObject.parentId,
            fieldAttributeMasterId: formLayoutObject.fieldAttributeMasterId,
            attributeTypeId: formLayoutObject.attributeTypeId,
            key: formLayoutObject.key,
            dateTime: currentTime + '',
        }
    }

    /**
     * getting objects from db/store
     * currently getting jobTransaction,user,hub,imei,jobMaster,status
     * 
     * @param {*jobTransactionId} jobTransactionId 
     * @param {*statusId} statusId 
     * @param {*jobMasterId} jobMasterId 
     */
    async _getDbObjects(jobTransactionId, statusId, jobMasterId, currentTime, user, jobTransactionList) {
        let hub = await keyValueDBService.getValueFromStore(HUB)
        let imei = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
        //let x = await keyValueDBService.getValueFromStore(JOB_STATUS)
        //console.log(x)
        let jobStatus = await keyValueDBService.getValueFromStore(JOB_STATUS)
        let jobMasterObject = await keyValueDBService.getValueFromStore(JOB_MASTER)
        let status = jobStatus.value.filter(jobStatus1 => jobStatus1.id == statusId)
        let jobMaster = jobMasterObject.value.filter(jobMasterObject1 => jobMasterObject1.id == jobMasterId)

        let jobTransaction = null
        let jobTransactionDBObject = null
        if (jobTransactionList && jobTransactionList.length) {
            let query = jobTransactionList.map(jobTransactionObject => `id = ${jobTransactionObject.jobTransactionId}`).join(' OR ')
            jobTransaction = []
            jobTransactionDBObject = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, query, false)
            for (let index in jobTransactionDBObject) {
                let transaction = { ...jobTransactionDBObject[index] }
                jobTransaction.push(transaction)
            }
        }
        else {
            //JobTransactionId > 0 for Normal Job && <0 for New Job
            jobTransactionDBObject = (jobTransactionId > 0 || (jobTransactionId < 0 && jobTransactionList && jobTransactionList.jobId > 0)) ?
                realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, 'id = ' + jobTransactionId, false)[0] // to get the first transaction, as query is on id and it returns list
                : this._getDefaultValuesForJobTransaction(jobTransactionId, status[0], jobMaster[0], user.value, hub.value, imei.value, currentTime, jobTransactionList.referenceNumber)
            jobTransaction = { ...jobTransactionDBObject }
        }
        //TODO add more db objects
        return {
            jobTransaction,
            user,
            hub,
            imei,
            jobMaster,
            status
        }
    }

    _setJobTransactionValues(jobTransaction1, status, jobMaster, user, hub, imei, currentTime, lastTrackLog, trackKms, trackTransactionTimeSpent, trackBattery, npsFeedbackValue, amountMap) {
        let jobTransactionArray = [], jobTransactionDTOList = []
        let jobTransaction = Object.assign({}, jobTransaction1) // no need to have null checks as it is called from a private method
        jobTransaction.jobType = jobMaster.code
        jobTransaction.jobStatusId = status.id
        jobTransaction.statusCode = status.code
        jobTransaction.employeeCode = (user) ? user.employeeCode : null
        jobTransaction.hubCode = hub.code
        jobTransaction.lastTransactionTimeOnMobile = currentTime
        jobTransaction.imeiNumber = imei.imeiNumber
        jobTransaction.latitude = lastTrackLog.latitude
        jobTransaction.longitude = lastTrackLog.longitude
        jobTransaction.trackKm = trackKms
        jobTransaction.trackTransactionTimeSpent = trackTransactionTimeSpent * 1000
        jobTransaction.trackBattery = (trackBattery && trackBattery.value) ? trackBattery.value : 0
        jobTransaction.npsFeedBack = npsFeedbackValue
        jobTransaction.originalAmount = parseFloat(amountMap.originalAmount) ? parseFloat(amountMap.originalAmount) : 0
        jobTransaction.actualAmount = parseFloat(amountMap.actualAmount) ? parseFloat(amountMap.actualAmount) : 0
        jobTransaction.moneyTransactionType = amountMap.moneyTransactionType
        jobTransactionArray.push(jobTransaction)
        jobTransactionDTOList.push({
            id: jobTransaction.id,
            referenceNumber: jobTransaction.referenceNumber,
            jobId: jobTransaction.jobId
        })
        return {
            tableName: TABLE_JOB_TRANSACTION,
            value: jobTransactionArray,
            jobTransactionDTOList
        }
        //TODO only basic columns are set, some columns are not set which will be set as codebase progresses further
    }

    _setBulkJobTransactionValues(jobTransactionList, status, jobMaster, user, hub, imei, currentTime, lastTrackLog, trackKms, trackTransactionTimeSpent, trackBattery, npsFeedbackValue, amountMap) {
        let jobTransactionArray = [], jobTransactionDTOList = []
        for (let jobTransaction1 in jobTransactionList) {
            let jobTransaction = Object.assign({}, jobTransactionList[jobTransaction1]) // no need to have null checks as it is called from a private method
            jobTransaction.jobType = jobMaster.code
            jobTransaction.jobStatusId = status.id
            jobTransaction.statusCode = status.code
            jobTransaction.employeeCode = user.employeeCode
            jobTransaction.hubCode = hub.code
            jobTransaction.lastTransactionTimeOnMobile = currentTime
            jobTransaction.imeiNumber = imei.imeiNumber
            jobTransaction.latitude = lastTrackLog.latitude
            jobTransaction.longitude = lastTrackLog.longitude
            jobTransaction.trackKm = trackKms
            jobTransaction.trackTransactionTimeSpent = trackTransactionTimeSpent * 1000
            jobTransaction.trackBattery = (trackBattery && trackBattery.value) ? trackBattery.value : 0
            jobTransaction.npsFeedBack = npsFeedbackValue
            jobTransaction.originalAmount = amountMap[jobTransaction.id] ? parseFloat(amountMap[jobTransaction.id].originalAmount) : parseFloat(amountMap.originalAmount) ? parseFloat(amountMap.originalAmount) : 0
            jobTransaction.actualAmount = amountMap[jobTransaction.id] ? parseFloat(amountMap[jobTransaction.id].actualAmount) : parseFloat(amountMap.actualAmount) ? parseFloat(amountMap.actualAmount) : 0
            jobTransaction.moneyTransactionType = amountMap.moneyTransactionType
            jobTransactionArray.push(jobTransaction)
            jobTransactionDTOList.push({
                id: jobTransaction.id,
                referenceNumber: jobTransaction.referenceNumber,
                jobId: jobTransaction.jobId
            })
        }
        return {
            tableName: TABLE_JOB_TRANSACTION,
            value: jobTransactionArray,
            jobTransactionDTOList
        }
    }

    /**
     * updates jobStatus on the basis of action on status
     * 
     * @param {*statusObject} status 
     * @param {*jobId} jobId 
     */
    _setJobDbValues(status, jobId, jobMasterId, user, hub, referenceNumber, currentTime, reAttemptDate, lastTrackLog) {
        let jobArray = []
        let realmJobObject = null
        if (jobId > 0) {
            realmJobObject = realm.getRecordListOnQuery(TABLE_JOB, 'id = ' + jobId, false)[0]; // to get the first job, as query is on id and it returns list                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        } else {
            realmJobObject = this._getDefaultValuesForJob(jobMasterId, jobId, user, hub, referenceNumber, currentTime)
        }
        let job = Object.assign({}, realmJobObject)
        switch (status.actionOnStatus) {
            case 0: job.status = 2; // jobStatus 2 is for  assigned
                break;
            case 1: job.status = 3; // jobStatus 3 is for closed when actionOnStatus is success
                break;
            case 2: job.status = 1;// jobStatus 1 is for unassigned
                break;
            case 3: job.status = 4;// jobStatus 4 is for fail when actionOnStatus is failed
                break;
        }
        if (reAttemptDate && moment().isBefore(reAttemptDate + " 00:00:00")) {
            job.jobStartTime = reAttemptDate + " 00:00:00"
        }
        if (jobId < 0) {
            job.latitude = lastTrackLog.latitude,
                job.longitude = lastTrackLog.longitude
        }
        jobArray.push(job)
        return {
            tableName: TABLE_JOB,
            value: jobArray
        }
    }

    _setBulkJobDbValues(status, jobTransactions, jobMasterId, user, hub, reAttemptDate) {
        let jobArray = []
        const query = jobTransactions.map(jobTransaction => 'id = ' + jobTransaction.jobId).join(' OR ')
        let realmJobObjects = realm.getRecordListOnQuery(TABLE_JOB, query)
        for (let realmJobObject in realmJobObjects) {
            let job = Object.assign({}, realmJobObjects[realmJobObject])
            switch (status.actionOnStatus) {
                case 1: job.status = 3; // jobStatus 3 is for closed when actionOnStatus is success
                    break;
                case 2: job.status = 1;// jobStatus 1 is for unassigned
                    break;
                case 3: job.status = 4;// jobStatus 4 is for fail when actionOnStatus is failed
                    break;
            }
            if (reAttemptDate && moment().isBefore(reAttemptDate + " 00:00:00")) {
                job.jobStartTime = reAttemptDate + " 00:00:00"
            }
            jobArray.push(job)
        }
        return {
            tableName: TABLE_JOB,
            value: jobArray
        }
    }

    /**
     * set default values for job in case of new job
     * 
     * @param {*} jobMasterId 
     * @param {*} id 
     */
    _getDefaultValuesForJob(jobMasterId, id, user, hub, referenceNumber, currentTime) {
        return job = {
            id,
            referenceNo: referenceNumber,
            hubId: (hub) ? hub.id : null,
            cityId: (user) ? user.cityId : null,
            companyId: (user && user.company) ? user.company.id : null,
            jobMasterId,
            status: 3,
            latitude: 0.0,
            longitude: 0.0,
            slot: 0,
            merchantCode: null,
            jobStartTime: currentTime,
            createdAt: currentTime,
            attemptCount: 1,
            missionId: null,
            jobEndTime: null,
            currentProcessId: null
        }
    }

    _getDefaultValuesForJobTransaction(id, status, jobMaster, user, hub, imei, currentTime, referenceNumber) {
        //TODO some values like lat/lng and battery are not valid values, update them as their library is added
        return jobTransaction = {
            id,
            runsheetNo: "AUTO-GEN",
            syncErp: false,
            userId: user.id,
            jobId: id,
            jobStatusId: status.id,
            companyId: user.company.id,
            actualAmount: 0.0,
            originalAmount: 0.0,
            moneyTransactionType: '',
            referenceNumber,
            runsheetId: null,
            hubId: hub.id,
            cityId: user.cityId,
            trackKm: 0.0,
            trackHalt: 0.0,
            trackCallCount: 0,
            trackCallDuration: 0,
            trackSmsCount: 0,
            trackTransactionTimeSpent: 0.0,
            jobCreatedAt: currentTime,
            erpSyncTime: currentTime,
            androidPushTime: currentTime,
            lastUpdatedAtServer: currentTime,
            lastTransactionTimeOnMobile: currentTime,
            deleteFlag: 0,
            attemptCount: 1,
            jobType: jobMaster.code,
            jobMasterId: jobMaster.id,
            employeeCode: user.employeeCode,
            hubCode: hub.code,
            statusCode: status.code,
            startTime: "00:00",
            endTime: "00:00",
            merchantCode: null,
            seqSelected: 0,
            seqAssigned: 0,
            seqActual: 0,
            latitude: 0.0,
            longitude: 0.0,
            trackBattery: 0,
            imeiNumber: imei.imeiNumber
        }

    }

    /**
     * adding jobTransactionId to sync list
     * 
     * syncList is a list which is to be synced with the server
     * 
     * @param {*jobTransactionId} jobTransactionId 
     */
    async addToSyncList(jobTransactionList) {
        let pendingSyncTransactionIds = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS)
        let transactionsToSync = (!pendingSyncTransactionIds || !pendingSyncTransactionIds.value) ? [] : pendingSyncTransactionIds.value; // if there is no pending transactions then assign empty array else its existing values
        //UnionWith is used to remove duplicacy ie if same job tarnsaction is present in jobTransactionList and transactionsToSync
        let totalTransactionsToSync = _.unionWith(transactionsToSync, jobTransactionList, _.isEqual);
        await keyValueDBService.validateAndSaveData(PENDING_SYNC_TRANSACTION_IDS, totalTransactionsToSync)
        return
    }

    /**
     * In case of new job get jobTransaction with most negative Id and subtract 1 from it
     * @param {*} jobTransactionId 
     * @param {*} jobTransactionList 
     */
    changeJobTransactionIdInCaseOfNewJob(jobTransactionId, jobTransactionList) {
        return (jobTransactionId < 0 && jobTransactionList && (jobTransactionList.jobId < 0)) ? this.makeNegativeJobTransactionId() : jobTransactionId//if it is not a case of new job then return jobTransactionId
    }

    /**
     * query job transaction table and find all jobTransaction in ascending order of id
     * and return id - 1 as transactionId for next job transaction which we have to save 
     */
    makeNegativeJobTransactionId() {
        let jobTransaction = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, null, true, 'id')
        let jobTransactionObjectWithMostNegativeJobTransactionId = { ...jobTransaction[0] }//use only first job as it has most negative or lowest jobTransactionId
        return (_.isEmpty(jobTransactionObjectWithMostNegativeJobTransactionId) || jobTransactionObjectWithMostNegativeJobTransactionId.id > 0) ? -1 : jobTransactionObjectWithMostNegativeJobTransactionId.id - 1 //if no job is present or first queried job has positive id then return -1 as trasactionId
    }
}