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


import * as realm from '../../../repositories/realmdb'
import { keyValueDBService } from '../KeyValueDBService.js'
import moment from 'moment'

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
            formLayoutObject.get(nextElement).editable = true;
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
        formLayoutObject.get(attributeMasterId).value = value;
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

    /**
     * called on saving button and saves Data in db or store
     * currently saving fieldData, jobTransaction and job
     * @param {*formLayoutMap} formLayoutObject 
     * @param {*transactionId} jobTransactionId 
     * @param {*statusId} statusId 
     */
    async saveData(formLayoutObject, jobTransactionId, statusId) {
        if (!formLayoutObject && Object.keys(formLayoutObject).length == 0) {
            return formLayoutObject; // return undefined or empty object if formLayoutObject is empty
        }
        let fieldData = this._saveFieldData(formLayoutObject, jobTransactionId);
        const dbObjects = await this._getDbObjects(jobTransactionId, statusId);
        let jobTransaction = this._setJobTransactionValues(dbObjects.jobTransaction, dbObjects.status[0], dbObjects.jobMaster[0], dbObjects.user, dbObjects.hub, dbObjects.imei);
        let job = this._setJobDbValues(dbObjects.status, dbObjects.jobTransaction.jobId);
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
     */
    async _getDbObjects(jobTransactionId, statusId) {
        let jobTransaction = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, 'id = ' + jobTransactionId, false)[0]; // to get the first transaction, as query is on id and it returns list
        let user = await keyValueDBService.getValueFromStore(USER);
        let hub = await keyValueDBService.getValueFromStore(HUB);
        let imei = await keyValueDBService.getValueFromStore(DEVICE_IMEI);
        let jobMaster = await keyValueDBService.getValueFromStore(JOB_MASTER).then(jobMasterObject => { return jobMasterObject.value.filter(jobMasterObject1 => jobMasterObject1.id == jobTransaction.jobMasterId) });
        let status = await keyValueDBService.getValueFromStore(JOB_STATUS).then(jobStatus => { return jobStatus.value.filter(jobStatus1 => jobStatus1.id == statusId) });
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
    _setJobDbValues(status, jobId) {
        let jobArray = [];
        let realmJobObject = realm.getRecordListOnQuery(TABLE_JOB, 'id = ' + jobId, false)[0]; // to get the first job, as query is on id and it returns list                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
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

