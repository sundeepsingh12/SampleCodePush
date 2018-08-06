'use strict'
import { TABLE_JOB_DATA } from '../../lib/constants'
import { QC_IMAGE, QC_LABEL, QC_REMARK, QC_ARRAY, QC_PASS_FAIL, QC_RESULT, QC_VALUE, OPTION_CHECKBOX_ARRAY, OPTION_CHECKBOX_KEY, OPTION_CHECKBOX_VALUE, NUMBER, OBJECT_SAROJ_FAREYE, ARRAY_SAROJ_FAREYE } from '../../lib/AttributeConstants'
import DeviceInfo from 'react-native-device-info'
import * as realm from '../../repositories/realmdb'
import { PASS, FAIL } from '../../lib/ContainerConstants'

class QC {

    prepareQCAttributes(initialParameters) {
        let currentElement = initialParameters.currentElement;
        let jobAttributeList = initialParameters.formLayoutState.jobAndFieldAttributesList.jobAttributes;
        let fieldAttributeList = initialParameters.formLayoutState.jobAndFieldAttributesList.fieldAttributes;
        let formElement = initialParameters.formLayoutState.formElement;
        let qcAttributeMasterArray = this.prepareQCChildAttributes(currentElement, fieldAttributeList, formElement);
        let qcDataArray = this.getQcData(initialParameters.jobTransaction, qcAttributeMasterArray);
        return { qcAttributeMasterArray, qcDataArray };
    }

    getQcData(jobTransaction, qcAttributeMasterArray) {
        let qcDataArray = {}, qcDataObjectId = 1;
        let jobArrayMasterIdMappedToQcArray = qcAttributeMasterArray.jobAttributeMasterId;
        let jobDataDBObject = realm.getRecordListOnQuery(TABLE_JOB_DATA, null, null, null, true);
        let qcDataArrayQuery = `jobId = ${jobTransaction.jobId} AND jobAttributeMasterId = ${jobArrayMasterIdMappedToQcArray}`;
        let qcJobArrayData = jobDataDBObject.filtered(qcDataArrayQuery);
        let positionIdOfArray = qcJobArrayData[0].positionId;
        let decryptionKey = DeviceInfo.getUniqueID();
        this.getChildQcData(positionIdOfArray, { realmDBObject: jobDataDBObject, jobId: jobTransaction.jobId, decryptionKey, qcAttributeMasterArray }, qcDataArray, qcDataObjectId);
        qcDataArray = _.sortBy(qcDataArray, function (object) { return object.qcSequence })
        console.log('qcDataArray', qcDataArray);
        return qcDataArray;
    }

    getChildQcData(positionId, qcDTO, qcDataArray, qcDataObjectId) {
        let query = `jobId = ${qcDTO.jobId} AND parentId = ${positionId}`;
        let objectList = qcDTO.realmDBObject.filtered(query);
        for (let object in objectList) {
            let value = realm._decryptData(objectList[object].value, qcDTO.decryptionKey);
            if (value == OBJECT_SAROJ_FAREYE || value == ARRAY_SAROJ_FAREYE) {
                let positionIdOfObject = objectList[object].positionId;
                qcDataArray[qcDataObjectId] = { objectId: qcDataObjectId, qcResult: qcDTO.qcAttributeMasterArray.qcResult };
                this.getChildQcData(positionIdOfObject, qcDTO, qcDataArray, qcDataObjectId);
                qcDataObjectId++;
            } else {
                let jobAttributeMasterId = objectList[object].jobAttributeMasterId;
                let qcAttributeMasterObject = qcDTO.qcAttributeMasterArray.childList.qcObject ? qcDTO.qcAttributeMasterArray.childList.qcObject : qcDTO.qcAttributeMasterArray.childList;
                this.checkQcObjectAttributeType(jobAttributeMasterId, qcAttributeMasterObject, qcDataArray[qcDataObjectId], value);
            }
        }
    }

    checkQcObjectAttributeType(jobAttributeMasterId, qcAttributeMasterObject, qcDataObject, data) {
        console.log('checkQcObjectAttributeType');
        if (qcAttributeMasterObject.qcLabel && qcAttributeMasterObject.qcLabel.jobAttributeMasterId == jobAttributeMasterId) {
            qcDataObject.qcLabel = data;
        } else if (qcAttributeMasterObject.qcValue && qcAttributeMasterObject.qcValue.jobAttributeMasterId == jobAttributeMasterId) {
            qcDataObject.qcValue = data;
        } else if (qcAttributeMasterObject.qcSequence && qcAttributeMasterObject.qcSequence.jobAttributeMasterId == jobAttributeMasterId) {
            qcDataObject.qcSequence = parseInt(data);
        } else if (qcAttributeMasterObject.optionValue && qcAttributeMasterObject.optionValue.jobAttributeMasterId == jobAttributeMasterId) {
            qcDataObject.optionValue = data;
        } else if (qcAttributeMasterObject.optionLabel && qcAttributeMasterObject.optionLabel.jobAttributeMasterId == jobAttributeMasterId) {
            qcDataObject.optionLabel = data;
        }
        // switch (jobAttributeMasterId) {
        //     case qcAttributeMasterObject.qcLabel.jobAttributeMasterId: {
        //         qcDataObject.qcLabel = data;
        //         break;
        //     }
        //     case qcAttributeMasterObject.qcValue.jobAttributeMasterId: {
        //         qcDataObject.qcValue = data;
        //         break;
        //     }
        //     case qcAttributeMasterObject.qcSequence.jobAttributeMasterId: {
        //         qcDataObject.qcSequence = parseInt(data);
        //         break;
        //     }
        //     case qcAttributeMasterObject.optionValue.jobAttributeMasterId: {
        //         qcDataObject.optionValue = data;
        //         break;
        //     }
        //     case qcAttributeMasterObject.optionLabel.jobAttributeMasterId: {
        //         qcDataObject.optionLabel = data;
        //         break;
        //     }
        // }
    }

    prepareQCChildAttributes(currentElement, fieldAttributeList, formElement) {
        let qcObject = { qcLabel: null, qcValue: null, qcResult: null, qcSequence: null }, qcAttributeMasterArray = {}, qcArrayChildObject = { qcObject }, fieldAttributeParentIdMap = {}, qcOptionCheckboxArrayChildObject = { optionLabel: null, optionValue: null };
        for (let fieldAttribute in fieldAttributeList) {
            if (fieldAttributeList[fieldAttribute].parentId) {
                fieldAttributeParentIdMap[fieldAttributeList[fieldAttribute].parentId] = fieldAttributeParentIdMap[fieldAttributeList[fieldAttribute].parentId] ? fieldAttributeParentIdMap[fieldAttributeList[fieldAttribute].parentId] : [];
                fieldAttributeParentIdMap[fieldAttributeList[fieldAttribute].parentId].push(fieldAttributeList[fieldAttribute]);
                continue;
            }
            if (!formElement[fieldAttributeList[fieldAttribute].id]) {
                continue;
            }
            qcAttributeMasterArray = this.checkQCAttributeType(fieldAttributeList[fieldAttribute], qcArrayChildObject, qcAttributeMasterArray);
        }
        this.getChildFieldAttributes(currentElement, fieldAttributeParentIdMap, qcArrayChildObject);
        this.getChildFieldAttributes(qcArrayChildObject.optionCheckboxArray, fieldAttributeParentIdMap, qcOptionCheckboxArrayChildObject);
        qcAttributeMasterArray.childList = qcArrayChildObject;
        qcArrayChildObject.optionCheckboxArray.childList = qcOptionCheckboxArrayChildObject;
        this.setQCConfigurationValidation(qcAttributeMasterArray, currentElement);
        console.log('qcArray', qcAttributeMasterArray)
        return qcAttributeMasterArray;
    }

    setQCConfigurationValidation(qcAttributeMasterArray, currentElement) {
        let validationList = currentElement.validation;
        for (let validation in validationList) {
            if (validationList[validation].timeOfExecution == 'MINMAX') {
                qcAttributeMasterArray.qcImageURLAttribute = validationList[validation].rightKey;
            } else if (validationList[validation].timeOfExecution == 'REMARKS') {
                switch (validationList[validation].id) {
                    case 22: {
                        qcAttributeMasterArray.qcPassRemarks = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 23: {
                        qcAttributeMasterArray.qcFailReasons = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 24: {
                        qcAttributeMasterArray.qcImage = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 25: {
                        qcAttributeMasterArray.qcSummary = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 26: {
                        // qcAttributeMasterArray.qcImage = validationList[validation].condition;
                        break;
                    }
                    case 27: {
                        qcAttributeMasterArray.qcFailRemarks = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 28: {
                        qcAttributeMasterArray.qcResult = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 29: {
                        qcAttributeMasterArray.qcPassButtonText = validationList[validation].condition;
                        break;
                    }
                    case 30: {
                        qcAttributeMasterArray.qcFailButtonText = validationList[validation].condition;
                        break;
                    }
                }
            }
        }
    }

    getChildFieldAttributes(fieldAttribute, fieldAttributeParentIdMap, qcArrayChildObject) {
        let parentId = fieldAttribute.fieldAttributeMasterId ? fieldAttribute.fieldAttributeMasterId : fieldAttribute.id;
        if (!fieldAttributeParentIdMap[parentId]) {
            this.checkQCAttributeType(fieldAttribute, qcArrayChildObject);
        } else {
            let childList = fieldAttributeParentIdMap[parentId];
            for (let index in childList) {
                this.getChildFieldAttributes(childList[index], fieldAttributeParentIdMap, qcArrayChildObject);
            }
        }
    }

    checkQCAttributeType(fieldAttribute, qcArrayChildObject, qcArray) {
        switch (fieldAttribute.attributeTypeId) {
            case QC_ARRAY: {
                qcArray = fieldAttribute;
                break;
            }
            case QC_PASS_FAIL: {
                qcArrayChildObject.qcPassFail = fieldAttribute;
                break;
            }
            case QC_REMARK: {
                qcArrayChildObject.qcRemark = fieldAttribute;
                break;
            }
            case QC_IMAGE: {
                qcArrayChildObject.qcImage = fieldAttribute;
                break;
            }
            case OPTION_CHECKBOX_ARRAY: {
                qcArrayChildObject.optionCheckboxArray = fieldAttribute;
                break;
            }
            case QC_LABEL: {
                qcArrayChildObject.qcObject.qcLabel = fieldAttribute;
                break;
            }
            case QC_VALUE: {
                qcArrayChildObject.qcObject.qcValue = fieldAttribute;
                break;
            }
            case QC_RESULT: {
                qcArrayChildObject.qcObject.qcResult = fieldAttribute;
                break;
            }
            case NUMBER: {
                qcArrayChildObject.qcObject.qcSequence = fieldAttribute;
                break;
            }
            case OPTION_CHECKBOX_KEY: {
                qcArrayChildObject.optionValue = fieldAttribute;
            }
            case OPTION_CHECKBOX_VALUE: {
                qcArrayChildObject.optionLabel = fieldAttribute;
            }
        }
        return qcArray
    }

    getQCPassFailParameters(qcDataArray, qcAttributeMaster, qcPassFail, jobTransaction) {
        console.log('wqe')
        let passFailParamaters;
        if (qcPassFail == FAIL) {
            passFailParamaters = this.getQCFailParameters(qcDataArray, qcAttributeMaster, jobTransaction);
        }
        return passFailParamaters;
    }

    getQCFailParameters(qcDataArray, qcAttributeMaster, jobTransaction) {
        let qcFailReasons;
        console.log('wqe')
        if (qcAttributeMaster.qcFailReasons) {
            qcFailReasons = this.getQCReasons(qcDataArray, qcAttributeMaster, jobTransaction);
        }
        return { qcFailReasons };
    }

    getQCPassParameters() {

    }

    getQCReasons(qcDataArray, qcAttributeMaster, jobTransaction) {
        let realmJobDataQuery = `jobId = ${jobTransaction.jobId} AND jobAttributeMasterId = ${qcAttributeMaster.childList.optionCheckboxArray.jobAttributeMasterId}`;
        let qcReasonDataObject = {}, qcReasonDataObjectId = 1;
        let realmJobDBObject = realm.getRecordListOnQuery(TABLE_JOB_DATA, null, null, null, true);
        let qcReasonDataArrayapped = realmJobDBObject.filtered(realmJobDataQuery);
        let positionIdOfOptionCheckoxMappedArray = qcReasonDataArrayapped[0].positionId;
        let decryptionKey = DeviceInfo.getUniqueID();
        this.getChildQcData(positionIdOfOptionCheckoxMappedArray, { realmDBObject: realmJobDBObject, jobId: jobTransaction.jobId, decryptionKey, qcAttributeMasterArray: qcAttributeMaster.childList.optionCheckboxArray }, qcReasonDataObject, qcReasonDataObjectId);
        console.log('qcReasonDataObject', qcReasonDataObject);
        return qcReasonDataObject;
    }
}

export let qcService = new QC()