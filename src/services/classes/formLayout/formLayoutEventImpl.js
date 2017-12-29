import {
    ON_BLUR,
    NEXT_FOCUS,
    TABLE_FIELD_DATA,
    TABLE_RUNSHEET,
    TABLE_JOB_TRANSACTION,
    JOB_MASTER,
    JOB_STATUS,
    JOB_SUMMARY,
    HUB,
    USER,
    DEVICE_IMEI,
    TABLE_JOB,
    TABLE_TRANSACTION_LOGS,
    TABLE_TRACK_LOGS,
    LAST_JOB_COMPLETED_TIME,
    USER_SUMMARY,
    PREVIOUSLY_TRAVELLED_DISTANCE,
    TRANSACTION_TIME_SPENT,
    TRACK_BATTERY,
    NPSFEEDBACK_VALUE,
    PENDING_SYNC_TRANSACTION_IDS
} from '../../../lib/constants'

import CONFIG from '../.././../lib/config'

import * as realm from '../../../repositories/realmdb'
import { keyValueDBService } from '../KeyValueDBService.js'
import RestAPIFactory from '../../../lib/RestAPIFactory'
import _ from 'lodash'
import moment from 'moment'
import sha256 from 'sha256'
import { jobStatusService } from '../JobStatus'
import { formLayoutService } from '../../classes/formLayout/FormLayout'
import { fieldValidationService } from '../FieldValidation'
import {
    AFTER,
    BEFORE,
    DATA_STORE,
    SIGNATURE_AND_FEEDBACK,
    NPS_FEEDBACK,
    EXTERNAL_DATA_STORE
} from '../../../lib/AttributeConstants'
import { fieldValidations } from '../../../modules/form-layout/formLayoutActions';
import {summaryAndPieChartService} from '../SummaryAndPieChart'

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
    findNextFocusableAndEditableElements(attributeMasterId, formLayoutObject, isSaveDisabled, value, fieldDataList, event, jobTransaction) {
        this.updateFieldInfo(attributeMasterId, value, formLayoutObject, event, fieldDataList);
        isSaveDisabled = false

        for (var [key, value] of formLayoutObject) {

            if (key != attributeMasterId || event == NEXT_FOCUS) {
                value.focus = false
            }
            if (!value.value && value.value !== 0 && value.required) {
                isSaveDisabled = true
            }

            if (value.displayValue || value.displayValue === 0) {
                continue
            }

            value.editable = true
            if (value.required) {
                value.focus = event == NEXT_FOCUS ? true : value.focus
                isSaveDisabled = true
                break
            }
            if (event == NEXT_FOCUS && value.attributeTypeId !== DATA_STORE && value.attributeTypeId !== EXTERNAL_DATA_STORE) {
                let beforeValidationResult = fieldValidationService.fieldValidations(value, formLayoutObject, BEFORE, jobTransaction)
                let valueAfterValidation = formLayoutObject.get(value.fieldAttributeMasterId).value
                if (!valueAfterValidation && valueAfterValidation !== 0) {
                    continue
                }
                let afterValidationResult = fieldValidationService.fieldValidations(formLayoutObject.get(value.fieldAttributeMasterId), formLayoutObject, AFTER, jobTransaction)
            }
        }
        if (!isSaveDisabled) {
            formLayoutObject.get(attributeMasterId).focus = true
        }
        return { formLayoutObject, isSaveDisabled }
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
        formLayoutObject.get(attributeMasterId).displayValue = (value != null && value != undefined && value.length != 0 && value.length < 64 &&
            formLayoutObject.get(attributeMasterId).attributeTypeId == 61) ? sha256(value) : value;
        formLayoutObject.get(attributeMasterId).childDataList = fieldDataList
        if (!calledFrom) {
            formLayoutObject.get(attributeMasterId).alertMessage = null
        }
        return formLayoutObject;
    }

    async getSequenceAttrData(sequenceMasterId) {
        let data = null;
        let masterData = null;
        const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        if (!token && token.value != null && token.value != undefined) {
            throw new Error('Token Missing')
        }
        if (!_.isNull(sequenceMasterId) && !_.isUndefined(sequenceMasterId)) {
            masterData = 'sequenceMasterId=' + sequenceMasterId + '&count=' + 1;
            const url = (masterData == null) ? CONFIG.API.GET_SEQUENCE_NEXT_COUNT : CONFIG.API.GET_SEQUENCE_NEXT_COUNT + "?" + masterData
            let getSequenceData = await RestAPIFactory(token.value).serviceCall(null, url, 'GET')
            if (getSequenceData) {
                json = await getSequenceData.json
                data = (!_.isNull(json[0]) && !_.isUndefined(json[0]) && !_.isEmpty(json[0])) ? json[0] : null;
            }
        } else {
            throw new Error('masterId unavailable')
        }
        return data;
    }

    /**
     * called on saving button and saves Data in db or store
     * currently saving fieldData, jobTransaction and job
     * @param {*formLayoutMap} formLayoutObject 
     * @param {*transactionId} jobTransactionId 
     * @param {*statusId} statusId 
     * @param {*jobMasterId} jobMasterId
     */
    async saveData(formLayoutObject, jobTransactionId, statusId, jobMasterId, jobTransactionIdList, jobTransactionAssignOrderToHub) {
        try {
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
                latitude: userSummary.value.lastLat,
                longitude: userSummary.value.lastLng
            }
            let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
            if (!formLayoutObject && Object.keys(formLayoutObject).length == 0) {
                return formLayoutObject // return undefined or empty object if formLayoutObject is empty
            }
            let fieldData, jobTransaction, job, dbObjects
            if (jobTransactionIdList) { //Case of bulk
                fieldData = this._saveFieldDataForBulk(formLayoutObject, jobTransactionIdList)
                dbObjects = await this._getDbObjects(jobTransactionId, statusId, jobMasterId, jobTransactionIdList, currentTime, user, jobTransactionAssignOrderToHub)
                jobTransaction = this._setBulkJobTransactionValues(dbObjects.jobTransaction, dbObjects.status[0], dbObjects.jobMaster[0], dbObjects.user.value, dbObjects.hub.value, dbObjects.imei.value, currentTime, lastTrackLog, trackKms, trackTransactionTimeSpent, trackBattery.value, fieldData.npsFeedbackValue) // to edit later 
                job = this._setBulkJobDbValues(dbObjects.status[0], dbObjects.jobTransaction, jobMasterId, dbObjects.user.value, dbObjects.hub.value)
            }
            else {
                fieldData = this._saveFieldData(formLayoutObject, jobTransactionId)
                dbObjects = await this._getDbObjects(jobTransactionId, statusId, jobMasterId, jobTransactionIdList, currentTime, user, jobTransactionAssignOrderToHub)
                jobTransaction = this._setJobTransactionValues(dbObjects.jobTransaction, dbObjects.status[0], dbObjects.jobMaster[0], dbObjects.user.value, dbObjects.hub.value, dbObjects.imei.value, currentTime, lastTrackLog, trackKms, trackTransactionTimeSpent, trackBattery.value, fieldData.npsFeedbackValue) //to edit later
                job = this._setJobDbValues(dbObjects.status[0], dbObjects.jobTransaction.jobId, jobMasterId, dbObjects.user.value, dbObjects.hub.value, dbObjects.jobTransaction.referenceNumber, currentTime)
            }

            //TODO add other dbs which needs updation
            const prevStatusId = (jobTransactionIdList) ? dbObjects.jobTransaction[0].jobStatusId : dbObjects.jobTransaction.jobStatusId
            const transactionLog = await this._updateTransactionLogs(jobTransaction.value, statusId, prevStatusId, jobMasterId, user, lastTrackLog)
            const runSheet = (jobTransactionId >= 0) ? await this._updateRunsheetSummary(dbObjects.jobTransaction, dbObjects.status[0].statusCategory, jobTransactionIdList) : []
            await this._updateJobSummary(dbObjects.jobTransaction, statusId, jobTransactionIdList)
            realm.performBatchSave(fieldData, jobTransaction, transactionLog, runSheet, job)
            await keyValueDBService.validateAndSaveData(LAST_JOB_COMPLETED_TIME, moment().format('YYYY-MM-DD HH:mm:ss'))
            await keyValueDBService.validateAndSaveData(TRANSACTION_TIME_SPENT, moment().format('YYYY-MM-DD HH:mm:ss'))
            return jobTransaction.jobTransactionDTOList
        } catch (error) {
            console.log(error)
        }
    }

    async _updateTransactionLogs(jobTransaction, statusId, prevStatusId, jobMasterId, user, lastTrackLog) {
        let transactionLogs = this._prepareTransactionLogsData(prevStatusId, statusId, jobTransaction, jobMasterId, user.value, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), lastTrackLog)
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

    /**
     * update jobSummaryDb count after completing transactions.
     * 
     * @param {*jobTransaction} jobTransaction 
     * @param {*jobTransactionIdList} jobTransactionIdList // case of bulk
     * @param {*statusId} statusId // new transaction status Id
     * 
     */

    async _updateJobSummary(jobTransaction,statusId,jobTransactionIdList){
        const prevStatusId  = (jobTransactionIdList) ? jobTransaction[0].jobStatusId : jobTransaction.jobStatusId
        const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        const count = (jobTransactionIdList) ? jobTransactionIdList.length : 1
        const jobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
        jobSummaryList.value.forEach(item => {
            item.updatedTime = currentDate
            if (item.jobStatusId == prevStatusId) {
                item.count = (item.count - count >= 0) ? item.count - count : 0
            }
            if (item.jobStatusId == statusId) {
                item.count += count
            }
        });
        await keyValueDBService.validateAndUpdateData(JOB_SUMMARY, jobSummaryList)
    }

   /**
     * update runSheetDb count after completing transactions.
     * and returns an object containing runSheetArray
     * 
     * @param {*jobTransaction} jobTransaction 
     * @param {*jobTransactionIdList} jobTransactionIdList // case of bulk
     * @param {*statusCategory} statusCategory // new transaction status category
     * 
     */

    async _updateRunsheetSummary(jobTransaction,statusCategory,jobTransactionIdList){
        const setRunsheetSummary = [],runSheetList = []
        const status = ['pendingCount','failCount','successCount']
        const prevStatusId  = (jobTransactionIdList) ? jobTransaction[0].jobStatusId : jobTransaction.jobStatusId
        const prevStatusCategory = await jobStatusService.getStatusCategoryOnStatusId(prevStatusId)
        const runSheetData = realm.getRecordListOnQuery(TABLE_RUNSHEET, null)
        const runsheetMap = runSheetData.reduce(function (total, current) {
            total[current.id] = Object.assign({}, current);
            return total;
        }, {});
        if (jobTransactionIdList) {
            for (id in jobTransaction) {
                let prevCount = runsheetMap[jobTransaction[id].runsheetId][status[prevStatusCategory - 1]]
                runsheetMap[jobTransaction[id].runsheetId][status[prevStatusCategory - 1]] = (prevCount > 0) ? prevCount - 1 : 0
                runsheetMap[jobTransaction[id].runsheetId][status[statusCategory - 1]] += 1;
                runSheetList.push(runsheetMap[jobTransaction[id].runsheetId])
            }
        } else {
            let prevCount = runsheetMap[jobTransaction.runsheetId][status[prevStatusCategory - 1]]
            runsheetMap[jobTransaction.runsheetId][status[prevStatusCategory - 1]] = (prevCount > 0) ? prevCount - 1 : 0
            runsheetMap[jobTransaction.runsheetId][status[statusCategory - 1]] += 1
            runSheetList.push(runsheetMap[jobTransaction.runsheetId])
        }
        return {tableName : TABLE_RUNSHEET, value : runSheetList}
    }


    /**
     * creates fieldData db structure for current transaction
     * and returns an object containing fieldDataArrayinue
     * 
     * @param {*formLayoutMap} formLayoutObject 
     * @param {*jobTransactionId} jobTransactionId 
     */
    _saveFieldData(formLayoutObject, jobTransactionId) {
        try {
            let currentFieldDataObject = {} // used object to set currentFieldDataId as call-by-reference whereas if we take integer then it is by call-by-value and hence value of id is not updated in that scenario.
            currentFieldDataObject.currentFieldDataId = realm.getRecordListOnQuery(TABLE_FIELD_DATA, null, true, 'id').length
            let fieldDataArray = []
            let npsFeedbackValue = null
            for (var [key, value] of formLayoutObject) {
                if (value.attributeTypeId == 61) {
                    continue
                } else if (value.attributeTypeId == NPS_FEEDBACK) {
                    npsFeedbackValue = value.value
                } else if (value.attributeTypeId == SIGNATURE_AND_FEEDBACK) {
                    let npsFeedback = _.values(value.childDataList).filter(item => item.attributeTypeId == NPS_FEEDBACK)
                    npsFeedbackValue = _.isEmpty(npsFeedback) ? null : npsFeedback[0].value
                }
                let fieldDataObject = this._convertFormLayoutToFieldData(value, jobTransactionId, ++currentFieldDataObject.currentFieldDataId)
                fieldDataArray.push(fieldDataObject)
                if (value.childDataList && value.childDataList.length > 0) {
                    currentFieldDataObject.currentFieldDataId = this._recursivelyFindChildData(value.childDataList, fieldDataArray, currentFieldDataObject, jobTransactionId);
                }
            }
            return {
                tableName: TABLE_FIELD_DATA,
                value: fieldDataArray,
                npsFeedbackValue
            }
        } catch (error) {
            console.log(error)
        }
    }

    _saveFieldDataForBulk(formLayoutObject, jobTransactionIdList) {
        let fieldDataArray = []
        const fieldData = this._saveFieldData(formLayoutObject, jobTransactionIdList[0])//Get Field Data for first jobTransaction 
        fieldDataArray.push(...fieldData.value)
        let lastId = fieldData.value.length
        //Now copy this fieldData for all other job transactions,just change job transaction id
        for (let i = 1; i < jobTransactionIdList.length; i++) {
            let fieldDataForJobTransaction = []
            fieldData.value.forEach(fieldDataObject => {
                let newObject = { ...fieldDataObject }
                newObject.jobTransactionId = jobTransactionIdList[i]
                newObject.id = ++lastId
                fieldDataArray.push(newObject)
            })
        }
        return {
            tableName: TABLE_FIELD_DATA,
            value: fieldDataArray,
            npsFeedbackValue: fieldData.npsFeedbackValue
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
    _recursivelyFindChildData(childDataList, fieldDataArray, currentFieldDataObject, jobTransactionId) {
        for (let i = 0; i <= childDataList.length; i++) {
            let childObject = childDataList[i]
            if (!childObject) {
                return currentFieldDataObject.currentFieldDataId
            }
            let fieldDataObject = this._convertFormLayoutToFieldData(childObject, jobTransactionId, ++currentFieldDataObject.currentFieldDataId);
            fieldDataArray.push(fieldDataObject)
            if (!childObject.childDataList || childObject.childDataList.length == 0) {
                continue
            } else {
                this._recursivelyFindChildData(childObject.childDataList, fieldDataArray, currentFieldDataObject, jobTransactionId)
            }
        }
    }

    _convertFormLayoutToFieldData(formLayoutObject, jobTransactionId, id) {
        return {
            id,
            value: formLayoutObject.value != undefined && formLayoutObject.value != null ? '' + formLayoutObject.value : null, // to make value as string
            jobTransactionId,
            positionId: formLayoutObject.positionId,
            parentId: formLayoutObject.parentId,
            fieldAttributeMasterId: formLayoutObject.fieldAttributeMasterId
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
    async _getDbObjects(jobTransactionId, statusId, jobMasterId, jobTransactionIdList, currentTime, user, jobTransactionAssignOrderToHub) {
        let hub = await keyValueDBService.getValueFromStore(HUB)
        let imei = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
        let status = await keyValueDBService.getValueFromStore(JOB_STATUS).then(jobStatus => { return jobStatus.value.filter(jobStatus1 => jobStatus1.id == statusId) })
        let jobMaster = await keyValueDBService.getValueFromStore(JOB_MASTER).then(jobMasterObject => { return jobMasterObject.value.filter(jobMasterObject1 => jobMasterObject1.id == jobMasterId) })

        let jobTransaction = null
        if (jobTransactionIdList) {
            let query = jobTransactionIdList.map(id => 'id = ' + id).join(' OR ')
            jobTransaction = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, query, false)
        }
        else {
            //JobTransactionId > 0 for Normal Job && <0 for New Job
            jobTransaction = (jobTransactionId > 0 || (jobTransactionId < 0 && jobTransactionAssignOrderToHub && jobTransactionAssignOrderToHub.referenceNumber)) ?
                realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, 'id = ' + jobTransactionId, false)[0] // to get the first transaction, as query is on id and it returns list
                : this._getDefaultValuesForJobTransaction(jobTransactionId, status[0], jobMaster[0], user.value, hub.value, imei.value, currentTime)
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

    _setJobTransactionValues(jobTransaction1, status, jobMaster, user, hub, imei, currentTime, lastTrackLog, trackKms, trackTransactionTimeSpent, trackBattery, npsFeedbackValue) {
        let jobTransactionArray = [], jobTransactionDTOList = []
        let jobTransaction = Object.assign({}, jobTransaction1) // no need to have null checks as it is called from a private method
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
        jobTransaction.trackBattery = trackBattery
        jobTransaction.npsFeedBack = npsFeedbackValue
        jobTransactionArray.push(jobTransaction)
        jobTransactionDTOList.push({
            id: jobTransaction.id,
            referenceNumber: jobTransaction.referenceNumber
        })
        return {
            tableName: TABLE_JOB_TRANSACTION,
            value: jobTransactionArray,
            jobTransactionDTOList
        }
        //TODO only basic columns are set, some columns are not set which will be set as codebase progresses further
    }

    _setBulkJobTransactionValues(jobTransactionList, status, jobMaster, user, hub, imei, currentTime, lastTrackLog, trackKms, trackTransactionTimeSpent, trackBattery, npsFeedbackValue) {
        let jobTransactionArray = [], jobTransactionDTOList = []
        for (let jobTransaction1 of jobTransactionList) {
            let jobTransaction = Object.assign({}, jobTransaction1) // no need to have null checks as it is called from a private method
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
            jobTransaction.trackBattery = trackBattery
            jobTransaction.npsFeedBack = npsFeedbackValue
            jobTransactionArray.push(jobTransaction)
            jobTransactionDTOList.push({
                id: jobTransaction.id,
                referenceNumber: jobTransaction.referenceNumber
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
    _setJobDbValues(status, jobId, jobMasterId, user, hub, referenceNumber, currentTime) {
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
        jobArray.push(job)
        return {
            tableName: TABLE_JOB,
            value: jobArray
        }
    }

    _setBulkJobDbValues(status, jobTransactions, jobMasterId, user, hub) {
        let jobArray = []
        const query = jobTransactions.map(jobTransaction => 'id = ' + jobTransaction.jobId).join(' OR ')
        console.log('query', query)
        let realmJobObjects = realm.getRecordListOnQuery(TABLE_JOB, query)
        for (let realmJobObject of realmJobObjects) {
            let job = Object.assign({}, realmJobObject)
            switch (status.actionOnStatus) {
                case 1: job.status = 3; // jobStatus 3 is for closed when actionOnStatus is success
                    break;
                case 2: job.status = 1;// jobStatus 1 is for unassigned
                    break;
                case 3: job.status = 4;// jobStatus 4 is for fail when actionOnStatus is failed
                    break;
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
            hubId: hub.id,
            cityId: user.cityId,
            companyId: user.company.id,
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

    _getDefaultValuesForJobTransaction(id, status, jobMaster, user, hub, imei, currentTime) {
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
            referenceNumber: user.id + "/" + hub.id + "/" + moment().valueOf(),
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
        transactionsToSync = transactionsToSync.concat(jobTransactionList)
        await keyValueDBService.validateAndSaveData(PENDING_SYNC_TRANSACTION_IDS, transactionsToSync)
        return
    }

}

