const {
    ON_BLUR,
    TABLE_FIELD_DATA,
    TABLE_JOB_TRANSACTION,
    JOB_MASTER,
    JOB_STATUS,
    HUB,
    USER,
    DEVICE_IMEI,
} = require('../../../lib/constants').default


import * as realm from '../../../repositories/realmdb'
import {keyValueDBService} from '../KeyValueDBService.js'
import moment from 'moment'

export default class FormLayoutEventImpl {

    findNextFocusableAndEditableElements(attributeMasterId, formLayoutObject, nextEditable, isSaveDisabled, value){
        console.log('inside interface impl with attributeMasterId', attributeMasterId);
        this.updateFieldInfo(attributeMasterId,value,formLayoutObject);
        isSaveDisabled = !this._enableSave(formLayoutObject, nextEditable);

        const nextEditableElements = (!nextEditable) ? null : nextEditable[attributeMasterId];
        if(!nextEditableElements || nextEditableElements.length == 0){
            return {formLayoutObject,nextEditable,isSaveDisabled} // there is no next element so return
        }
        nextEditableElements.forEach((nextElement) => {
            if((typeof(nextElement) == 'string')){
                nextElement = Number(nextElement.split('$$')[1]);
                formLayoutObject.get(nextElement).focus = true;
            }
            formLayoutObject.get(nextElement).editable = true;
        });

        return {formLayoutObject,nextEditable,isSaveDisabled}
    }

    _enableSave(formLayoutObject,nextEditable){
        if(!nextEditable || Object.keys(nextEditable).length == 0){
            return true;
        }
        let saveEnabled = true;

        for(let key in nextEditable){
            if(!formLayoutObject.get(Number(key)).value || formLayoutObject.get(Number(key)).value.length == 0){
                saveEnabled = false; // if any required attribute does not contain value then disable save and break 
                break;
            }
        }
        return saveEnabled;
    }

    disableSave(attributeMasterId, isSaveDisabled, formLayoutObject, value){
        this.updateFieldInfo(attributeMasterId,value,formLayoutObject);        
        if(formLayoutObject.get(attributeMasterId) && formLayoutObject.get(attributeMasterId).required){
            formLayoutObject.get(attributeMasterId).showCheckMark = false;
            return true;
        }
        return isSaveDisabled;
    }

    updateFieldInfo(attributeMasterId, value, formLayoutObject, calledFrom){
        formLayoutObject.get(attributeMasterId).value = value;
        if(value && value.length > 0 && calledFrom == ON_BLUR){
            formLayoutObject.get(attributeMasterId).showCheckMark = true;
        }
        return formLayoutObject;
    }

    toogleHelpText(attributeMasterId, formLayoutObject){
        if(!attributeMasterId || !formLayoutObject){
            return;
        }
        formLayoutObject.get(attributeMasterId).showHelpText = !formLayoutObject.get(attributeMasterId).showHelpText;
        return formLayoutObject;
    }
    
    async saveData(formLayoutObject,jobTransactionId,statusId){
        //TODO remove this hard coded line to get json for childData
        // let formLayoutObject1 = this.getTempFormLayoutObject(formLayoutObject.get(238));
        // formLayoutObject.set(238,formLayoutObject1);

        if(!formLayoutObject && Object.keys(formLayoutObject).length == 0){
            return formLayoutObject; // return undefined or empty object if formLayoutObject is empty
        }
        let fieldData = this._saveFieldData(formLayoutObject,jobTransactionId);
        let jobTransaction = await this._saveJobTransaction(jobTransactionId,statusId);
        realm.performBatchSave(fieldData,jobTransaction);
    }

    _saveFieldData(formLayoutObject, jobTransactionId){
        let currentFieldDataObject = {}; // used object to set currentFieldDataId as call-by-reference whereas if we take integer then it is by call-by-value and hence value of id is not updated in that scenario.
        currentFieldDataObject.currentFieldDataId = realm.getRecordListOnQuery(TABLE_FIELD_DATA,null,true, 'id').length;
        let fieldDataArray = [];
        for (var [key, value] of formLayoutObject) {
            let fieldDataObject = this._convertFormLayoutToFieldData(value,jobTransactionId,++currentFieldDataObject.currentFieldDataId);
            fieldDataArray.push(fieldDataObject);
            if(value.childDataList && value.childDataList.length > 0){
                currentFieldDataObject.currentFieldDataId = this._recursivelyFindChildData(value.childDataList, fieldDataArray, currentFieldDataObject, jobTransactionId);
            }  
        }
        return {
            tableName: TABLE_FIELD_DATA,
            value: fieldDataArray
        };
        // realm.saveList(TABLE_FIELD_DATA,fieldDataArray);  
    }

    _recursivelyFindChildData(childDataList, fieldDataArray, currentFieldDataObject,jobTransactionId){
        for(let i = 0; i <= childDataList.length ; i++){
            let childObject = childDataList[i];
            if(!childObject){
                return currentFieldDataObject.currentFieldDataId;
            }
            let fieldDataObject = this._convertFormLayoutToFieldData(childObject,jobTransactionId,++currentFieldDataObject.currentFieldDataId);
            fieldDataArray.push(fieldDataObject);
            if(!childObject.childDataList || childObject.childDataList.length == 0){
                continue;
            }else{
                this._recursivelyFindChildData(childObject.childDataList , fieldDataArray, currentFieldDataObject,jobTransactionId);
            }
        }
    }

    _convertFormLayoutToFieldData(formLayoutObject,jobTransactionId,id){
        return {
            id : id, 
            value : formLayoutObject.value,
            jobTransactionId : jobTransactionId,
            positionId : formLayoutObject.positionId,
            parentId : formLayoutObject.parentId,
            fieldAttributeMasterId : formLayoutObject.fieldAttributeMasterId
        };
    }

    async _saveJobTransaction(jobTransactionId, statusId){
        let jobTransactionArray = [];
        let jobTransaction = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION,'id = ' +jobTransactionId, false)[0]; // to get the first transaction, as query is on id and it returns list
        let user = await keyValueDBService.getValueFromStore(USER);
        let hub =  await keyValueDBService.getValueFromStore(HUB);
        let imei = await keyValueDBService.getValueFromStore(DEVICE_IMEI);
        let jobMaster = await keyValueDBService.getValueFromStore(JOB_MASTER).then(jobMasterObject => {return jobMasterObject.value.filter(jobMasterObject1 => jobMasterObject1.id == jobTransaction.jobMasterId)});
        let status = await keyValueDBService.getValueFromStore(JOB_STATUS).then(jobStatus =>{ return jobStatus.value.filter(jobStatus1 => jobStatus1.id == statusId)});
        jobTransaction =  this._setJobTransactionValues(jobTransaction,status[0],jobMaster[0],user.value,hub.value,imei.value);
        return {
            tableName: TABLE_JOB_TRANSACTION,
            value: jobTransactionArray.push(jobTransaction)
        };
    }

    _setJobTransactionValues(jobTransaction1,status,jobMaster,user,hub,imei){
        let jobTransaction = Object.assign({},jobTransaction1);
        jobTransaction.syncFlag = 1;
        jobTransaction.jobType = jobMaster.code;
        jobTransaction.jobStatusId = status.id;
        jobTransaction.statusCode = status.code;
        jobTransaction.employeeCode = user.employeeCode;
        jobTransaction.hubCode = hub.code;
        jobTransaction.lastTransactionTimeOnMobile = moment().format('YYYY-MM-DD HH:mm:ss');
        jobTransaction.imeiNumber = imei.imeiNumber;
        return jobTransaction;
        //TODO only basic columns are set, some columns are not set which will be set as codebase progresses further
    }
    

    getTempFormLayoutObject(testObject){
        let a = [
            {
              "id": 1,
              "value": "2",
              "jobTransactionId": 5,
              "positionId": 2,
              "parentId": 0,
              "fieldAttributeMasterId": 5,
              "childDataList": [
                {
                  "id": 1,
                  "value": "3",
                  "jobTransactionId": 5,
                  "positionId": 3,
                  "parentId": 0,
                  "fieldAttributeMasterId": 5
                },
                {
                  "id": 1,
                  "value": "4",
                  "jobTransactionId": 5,
                  "positionId": 4,
                  "parentId": 0,
                  "fieldAttributeMasterId": 5,
                  "childDataList": [
                    {
                      "id": 1,
                      "value": "5",
                      "jobTransactionId": 5,
                      "positionId": 5,
                      "parentId": 0,
                      "fieldAttributeMasterId": 5
                    },
                    {
                      "id": 1,
                      "value": "6",
                      "jobTransactionId": 5,
                      "positionId": 6,
                      "parentId": 0,
                      "fieldAttributeMasterId": 5
                    }
                  ]
                }
              ]
            },
            {
              "id": 1,
              "value": "7",
              "jobTransactionId": 5,
              "positionId": 7,
              "parentId": 0,
              "fieldAttributeMasterId": 5
            }
          ]
        testObject.childDataList = a;
        // testObject.childDataList.push(a);
        return testObject;
    }

}

