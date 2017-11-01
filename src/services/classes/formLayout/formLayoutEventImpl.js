const {
    ON_BLUR,
    TABLE_FIELD_DATA,
    TABLE_JOB_TRANSACTION,
    JOB_MASTER,
    JOB_STATUS,
    HUB,
    USER,
    DEVICE_IMEI,
    TABLE_JOB,
    PENDING_SYNC_TRANSACTION_IDS
} = require('../../../lib/constants').default

import CONFIG from '../.././../lib/config'

import * as realm from '../../../repositories/realmdb'
import { keyValueDBService } from '../KeyValueDBService.js'
import RestAPIFactory from '../../../lib/RestAPIFactory'
import _ from 'underscore'
import moment from 'moment';
import sha256 from 'sha256';

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
    findNextFocusableAndEditableElements(attributeMasterId, formLayoutObject, nextEditable, isSaveDisabled, value, fieldDataList, event) {
        this.updateFieldInfo(attributeMasterId, value, formLayoutObject, event, fieldDataList);
        isSaveDisabled = !this._enableSave(formLayoutObject, nextEditable);
        const nextEditableElements = nextEditable[attributeMasterId];
        if (!nextEditableElements || nextEditableElements.length == 0) {
            return { formLayoutObject, nextEditable, isSaveDisabled } // there is no next element so return
        }
        nextEditableElements.forEach((nextElement) => {
            if ((typeof (nextElement) == 'string')) {
                nextElement = Number(nextElement.split('$$')[1]);
                formLayoutObject.get(nextElement).focus = true;
            }
            formLayoutObject.get(nextElement).editable =!(formLayoutObject.get(nextElement).attributeTypeId == 62) ? true : false;
        });

        return { formLayoutObject, nextEditable, isSaveDisabled }
    }

    /**
     * if any required attribute does not contain value then disables save
     * 
     * @param {*formLayoutMap} formLayoutObject 
     * @param {*nextEditable} nextEditable 
     */
    _enableSave(formLayoutObject, nextEditable) {
        if (!nextEditable || Object.keys(nextEditable).length == 0) {
            return true;
        }
        let saveEnabled = true;

        for (let key in nextEditable) {
            if (!formLayoutObject.get(Number(key)).value || formLayoutObject.get(Number(key)).value.length == 0) {
                saveEnabled = false; // if any required attribute does not contain value then disable save and break 
                break;
            }
        }
        return saveEnabled;
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
        return isSaveDisabled;
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
        formLayoutObject.get(attributeMasterId).value = (value != null && value != undefined && value.length != 0  && value.length < 64 && 
            formLayoutObject.get(attributeMasterId).attributeTypeId == 61 )? sha256(value) :value;
        formLayoutObject.get(attributeMasterId).childDataList = fieldDataList
        if (value && value.length > 0 && calledFrom == ON_BLUR) {
            formLayoutObject.get(attributeMasterId).showCheckMark = true;
        }
        return formLayoutObject;
    }

    toogleHelpText(attributeMasterId, formLayoutObject) {
        if (!attributeMasterId || !formLayoutObject) {
            return;
        }
        formLayoutObject.get(attributeMasterId).showHelpText = !formLayoutObject.get(attributeMasterId).showHelpText;
        return formLayoutObject;
    }

   async getSequenceAttrData(sequenceMasterId){
        let data = null;
        let masterData = null;
        const token =  await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        if (!token && token.value != null && token.value != undefined) {
           throw new Error('Token Missing')
        }
        if( !_.isNull(sequenceMasterId) && !_.isUndefined(sequenceMasterId) ){
            masterData = 'sequenceMasterId=' + sequenceMasterId + '&count=' + 1;
            const url = (masterData == null) ? CONFIG.API.GET_SEQUENCE_NEXT_COUNT : CONFIG.API.GET_SEQUENCE_NEXT_COUNT + "?" + masterData
            let getSequenceData = await RestAPIFactory(token.value).serviceCall(null, url, 'GET')
            if (getSequenceData) {
                json = await getSequenceData.json
                data =(!_.isNull(json[0]) && !_.isUndefined(json[0]) && !_.isEmpty(json[0])) ? json[0] : null ;
            }
        }else{
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
    async saveData(formLayoutObject, jobTransactionId, statusId,jobMasterId) {
        if (!formLayoutObject && Object.keys(formLayoutObject).length == 0) {
            return formLayoutObject; // return undefined or empty object if formLayoutObject is empty
        }
        let fieldData = this._saveFieldData(formLayoutObject, jobTransactionId);
        const dbObjects = await this._getDbObjects(jobTransactionId, statusId, jobMasterId);
        let jobTransaction = this._setJobTransactionValues(dbObjects.jobTransaction, dbObjects.status[0], dbObjects.jobMaster[0], dbObjects.user.value, dbObjects.hub.value, dbObjects.imei.value);
        let job = this._setJobDbValues(dbObjects.status[0], dbObjects.jobTransaction.jobId,jobMasterId,dbObjects.user.value, dbObjects.hub.value,dbObjects.jobTransaction.referenceNumber);
        //TODO add other dbs which needs updation
        realm.performBatchSave(fieldData, jobTransaction, job);
    }

    /**
     * creates fieldData db structure for current transaction
     * and returns an object containing fieldDataArray
     * 
     * @param {*formLayoutMap} formLayoutObject 
     * @param {*jobTransactionId} jobTransactionId 
     */
    _saveFieldData(formLayoutObject, jobTransactionId) {
        let currentFieldDataObject = {}; // used object to set currentFieldDataId as call-by-reference whereas if we take integer then it is by call-by-value and hence value of id is not updated in that scenario.
        currentFieldDataObject.currentFieldDataId = realm.getRecordListOnQuery(TABLE_FIELD_DATA, null, true, 'id').length;
        let fieldDataArray = [];
        for (var [key, value] of formLayoutObject) {
            if(value.attributeTypeId == 61){
                continue;
            }
            let fieldDataObject = this._convertFormLayoutToFieldData(value, jobTransactionId, ++currentFieldDataObject.currentFieldDataId);
            fieldDataArray.push(fieldDataObject);
            if (value.childDataList && value.childDataList.length > 0) {
                currentFieldDataObject.currentFieldDataId = this._recursivelyFindChildData(value.childDataList, fieldDataArray, currentFieldDataObject, jobTransactionId);
            }
        }
        return {
            tableName: TABLE_FIELD_DATA,
            value: fieldDataArray
        };
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
            let childObject = childDataList[i];
            if (!childObject) {
                return currentFieldDataObject.currentFieldDataId;
            }
            let fieldDataObject = this._convertFormLayoutToFieldData(childObject, jobTransactionId, ++currentFieldDataObject.currentFieldDataId);
            fieldDataArray.push(fieldDataObject);
            if (!childObject.childDataList || childObject.childDataList.length == 0) {
                continue;
            } else {
                this._recursivelyFindChildData(childObject.childDataList, fieldDataArray, currentFieldDataObject, jobTransactionId);
            }
        }
    }

    _convertFormLayoutToFieldData(formLayoutObject, jobTransactionId, id) {
        return {
            id: id,
            value: formLayoutObject.value != undefined && formLayoutObject.value != null ? '' + formLayoutObject.value : null, // to make value as string
            jobTransactionId: jobTransactionId,
            positionId: formLayoutObject.positionId,
            parentId: formLayoutObject.parentId,
            fieldAttributeMasterId: formLayoutObject.fieldAttributeMasterId
        };
    }

    /**
     * getting objects from db/store
     * currently getting jobTransaction,user,hub,imei,jobMaster,status
     * 
     * @param {*jobTransactionId} jobTransactionId 
     * @param {*statusId} statusId 
     * @param {*jobMasterId} jobMasterId 
     */
     async _getDbObjects(jobTransactionId,statusId,jobMasterId) {
        let user = await keyValueDBService.getValueFromStore(USER);
        let hub = await keyValueDBService.getValueFromStore(HUB);
        let imei = await keyValueDBService.getValueFromStore(DEVICE_IMEI);
        let status = await keyValueDBService.getValueFromStore(JOB_STATUS).then(jobStatus => { return jobStatus.value.filter(jobStatus1 => jobStatus1.id == statusId) });
        let jobMaster = await keyValueDBService.getValueFromStore(JOB_MASTER).then(jobMasterObject => { return jobMasterObject.value.filter(jobMasterObject1 => jobMasterObject1.id == jobMasterId) });
        let jobTransaction = null;
        if(jobTransactionId > 0){
            // case of normal job
            jobTransaction = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, 'id = ' + jobTransactionId, false)[0]; // to get the first transaction, as query is on id and it returns list
        }else{
            // case of new job
            jobTransaction = this._getDefaultValuesForJobTransaction(jobTransactionId,status[0],jobMaster[0],user.value,hub.value,imei.value);
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

    _setJobTransactionValues(jobTransaction1, status, jobMaster, user, hub, imei) {
        let jobTransactionArray = [];
        let jobTransaction = Object.assign({}, jobTransaction1); // no need to have null checks as it is called from a private method
        jobTransaction.jobType = jobMaster.code;
        jobTransaction.jobStatusId = status.id;
        jobTransaction.statusCode = status.code;
        jobTransaction.employeeCode = user.employeeCode;
        jobTransaction.hubCode = hub.code;
        jobTransaction.lastTransactionTimeOnMobile = moment().format('YYYY-MM-DD HH:mm:ss');
        jobTransaction.imeiNumber = imei.imeiNumber;
        jobTransactionArray.push(jobTransaction);
        return {
            tableName: TABLE_JOB_TRANSACTION,
            value: jobTransactionArray
        }
        //TODO only basic columns are set, some columns are not set which will be set as codebase progresses further
    }

    /**
     * updates jobStatus on the basis of action on status
     * 
     * @param {*statusObject} status 
     * @param {*jobId} jobId 
     */
    _setJobDbValues(status, jobId, jobMasterId,user,hub,referenceNumber) {
        let jobArray = [];
        let realmJobObject = null;
        if(jobId > 0){
            realmJobObject = realm.getRecordListOnQuery(TABLE_JOB, 'id = ' + jobId, false)[0]; // to get the first job, as query is on id and it returns list                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        }else{
            realmJobObject = this._getDefaultValuesForJob(jobMasterId,jobId,user,hub,referenceNumber);
        }
        let job = Object.assign({}, realmJobObject);
        switch (status.actionOnStatus) {
            case 1: job.status = 3; // jobStatus 3 is for closed when actionOnStatus is success
                break;
            case 2: job.status = 1;// jobStatus 1 is for unassigned
                break;
            case 3: job.status = 4;// jobStatus 4 is for fail when actionOnStatus is failed
                break;
        }
        jobArray.push(job);
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
    _getDefaultValuesForJob(jobMasterId, id, user, hub, referenceNumber){
        return job = {
            id : id,
            referenceNo : referenceNumber,
            hubId : hub.id,
            cityId : user.cityId,
            companyId : user.company.id,
            jobMasterId : jobMasterId,
            status : 3,
            latitude : 0.0,
            longitude : 0.0,
            slot : 0,
            merchantCode : null,
            jobStartTime : moment().format('YYYY-MM-DD HH:mm:ss'),
            createdAt : moment().format('YYYY-MM-DD HH:mm:ss'),
            attemptCount : 1,
            missionId : null,
            jobEndTime : null,
            currentProcessId : null 
        }
    }

    _getDefaultValuesForJobTransaction(id,status,jobMaster,user,hub,imei){
        //TODO some values like lat/lng and battery are not valid values, update them as their library is added
        return jobTransaction = {
            id : id,
            runsheetNo : "AUTO-GEN",
            syncErp : false,
            userId : user.id,
            jobId : id,
            jobStatusId : status.id,
            companyId : user.company.id,
            actualAmount : 0.0,
            originalAmount : 0.0,
            moneyTransactionType : '',
            referenceNumber : user.id + "/" + hub.id + "/" + moment().valueOf(),
            runsheetId : null,
            hubId : hub.id,
            cityId : user.cityId,
            trackKm : 0.0,
            trackHalt : 0.0,
            trackCallCount : 0,
            trackCallDuration : 0,
            trackSmsCount : 0,
            trackTransactionTimeSpent : 0.0,
            jobCreatedAt : moment().format('YYYY-MM-DD HH:mm:ss'),
            erpSyncTime : moment().format('YYYY-MM-DD HH:mm:ss'),
            androidPushTime : moment().format('YYYY-MM-DD HH:mm:ss'),
            lastUpdatedAtServer : moment().format('YYYY-MM-DD HH:mm:ss'),
            lastTransactionTimeOnMobile : moment().format('YYYY-MM-DD HH:mm:ss'),
            deleteFlag : 0,
            attemptCount : 1,
            jobType : jobMaster.code,
            jobMasterId : jobMaster.id,
            employeeCode : user.employeeCode,
            hubCode : hub.code,
            statusCode : status.code,
            startTime : "00:00",
            endTime : "00:00",
            merchantCode : null,
            seqSelected : 0,
            seqAssigned : 0,
            seqActual : 0,
            latitude : 0.0,
            longitude : 0.0,
            trackBattery : 0,
            imeiNumber : imei.imeiNumber
        }

    }

    /**
     * adding jobTransactionId to sync list
     * 
     * syncList is a list which is to be synced with the server
     * 
     * @param {*jobTransactionId} jobTransactionId 
     */
    async addToSyncList(jobTransactionId) {
        let pendingSyncTransactionIds = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
        let transactionsToSync = (!pendingSyncTransactionIds || !pendingSyncTransactionIds.value) ? [] : pendingSyncTransactionIds.value; // if there is no pending transactions then assign empty array else its existing values
        transactionsToSync.push(jobTransactionId);
        await keyValueDBService.validateAndSaveData(PENDING_SYNC_TRANSACTION_IDS, transactionsToSync);
        return;
    }
}

