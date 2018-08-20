'use strict'
import { TABLE_JOB_DATA, FormLayout, QCReasonScreen, QCAttribute, QCImageAndRemarksScreen, QCSummaryScreen } from '../../lib/constants'
import { QC_IMAGE, QC_LABEL, QC_REMARK, QC_ARRAY, QC_PASS_FAIL, QC_RESULT, QC_VALUE, OPTION_CHECKBOX_ARRAY, OPTION_CHECKBOX_KEY, OPTION_CHECKBOX_VALUE, NUMBER, OBJECT_SAROJ_FAREYE, ARRAY_SAROJ_FAREYE, OBJECT, AFTER, BEFORE } from '../../lib/AttributeConstants'
import DeviceInfo from 'react-native-device-info'
import * as realm from '../../repositories/realmdb'
import { PASS, FAIL } from '../../lib/ContainerConstants'
import { fieldValidationService } from './FieldValidation'
import { paymentService } from '../payment/Payment'
import { fieldDataService } from './FieldData';

class QC {

    /**
     * QC Structures prepared and used
     * qcAttributeMasterArray : {
     *                                  childList : {
     *                                                  object : {
     *                                                                  qcLabel
     *                                                                  qcValue
     *                                                                  qcSequence
     *                                                                  qcResult
     *                                                             }
     *                                                  qcResult
     *                                                  qcRemark
     *                                                  qcImage
     *                                                  qcPassFail
     *                                                  optionCheckBoxArray : {
     *                                                                              object : {
     *                                                                                          optionCheckBoxLabel : optionCheckBox value
     *                                                                                          optionCheckBoxValue : optionCheckBox key
     *                                                                                       }
     *                                                                        }
     *                                              }
     *                                  valdiationMap : {
     *                                                      qcPassRemarksValidation
     *                                                      qcFailReasonsValidation
     *                                                      qcImageValidation
     *                                                      qcSummaryValidation
     *                                                      qcFailRemarksValidation
     *                                                      qcResultValidation
     *                                                      qcPassButtonTextValidation
     *                                                      qcFailButtonTextValidation
     *                                                  }
     *                               }
     */


    /**
    * This function return initial data for qc to display
    * @param {*} initialParameters 
    * initialParameters : {
    *                          currentElement,
    *                          formLayoutState,
    *                          jobTransaction
    *                     }
    * @returns
    * {
    *      qcAttributeMasterArray : defined above
    *      qcDataArray(sorted on basis of qcSequence) : [
    *                                                      {
    *                                                          qcLabel
    *                                                          qcValue
    *                                                          qcSequence
    *                                                      }
    *                                                   ]
    * }
    */
    prepareQCAttributeAndData(initialParameters) {
        let currentElement = initialParameters.currentElement;
        let jobAttributeList = initialParameters.formLayoutState.jobAndFieldAttributesList.jobAttributes;
        let fieldAttributeList = initialParameters.formLayoutState.jobAndFieldAttributesList.fieldAttributes;
        let formElement = initialParameters.formLayoutState.formElement;
        let qcAttributeMasterArray = this.prepareQCMasterArrayAttribute(currentElement, fieldAttributeList, formElement);
        let qcObject = this.getQCData(initialParameters.jobTransaction, qcAttributeMasterArray);
        return { qcAttributeMasterArray, qcObject };
    }

    /**
     * This function prepares qc array data that is mapped to job data array,segregate them on basis of label,value and sequence and sort them on sequence
     * It also prepares imageURLArray if present
     * @param {*} jobTransaction 
     * @param {*} qcAttributeMasterArray 
     * @returns
     * {
     *      qcDataArray : {
     *                          obejectId : {
     *                                          label
     *                                          value
     *                                          sequence
     *                                      }
     *                    }
     *      qcImageUrlDataArray : [string]
     * }
     */
    getQCData(jobTransaction, qcAttributeMasterArray) {
        let qcDataArray = {}, qcDataObjectId = 1;
        let jobArrayMasterIdMappedToQcArray = qcAttributeMasterArray.jobAttributeMasterId;
        let jobDataDBObject = realm.getRecordListOnQuery(TABLE_JOB_DATA, null, null, null, true);
        let qcDataArrayQuery = `jobId = ${jobTransaction.jobId} AND jobAttributeMasterId = ${jobArrayMasterIdMappedToQcArray}`;
        let qcJobArrayData = jobDataDBObject.filtered(qcDataArrayQuery);
        let positionIdOfArray = qcJobArrayData[0].positionId;
        let decryptionKey = DeviceInfo.getUniqueID();
        this.getChildQCData(positionIdOfArray, { realmDBObject: jobDataDBObject, jobId: jobTransaction.jobId, decryptionKey, qcAttributeMasterArray }, qcDataArray, qcDataObjectId);
        qcDataArray = _.sortBy(qcDataArray, function (object) { return object.qcSequence })
        let qcImageUrlDataArray = this.getQCImageUrlData(jobTransaction, qcAttributeMasterArray, jobDataDBObject, decryptionKey);
        return { qcDataArray, qcImageUrlDataArray };
    }

    /**
     * This function prepares image url data from mapped job attribute
     * @param {*} jobTransaction 
     * @param {*} qcAttributeMasterArray 
     * @param {*} jobDataDBObject 
     * @param {*} decryptionKey 
     * @returns
     * imageUrlDataArray : [string]
     */
    getQCImageUrlData(jobTransaction, qcAttributeMasterArray, jobDataDBObject, decryptionKey) {
        if (!qcAttributeMasterArray.qcValidationMap || !qcAttributeMasterArray.qcValidationMap.qcImageURLAttributeValidation) {
            return null;
        }
        let imageUrlDataArray = [];
        let jobAttributeMasterIdVal = qcAttributeMasterArray.qcValidationMap.qcImageURLAttributeValidation.rightKey;
        let jobAttributeMasterId = fieldValidationService.splitKey(jobAttributeMasterIdVal, true);
        let imageUrlQuery = `jobId = ${jobTransaction.jobId} AND jobAttributeMasterId = ${jobAttributeMasterId}`;
        let imageURLJobData = jobDataDBObject.filtered(imageUrlQuery);
        for (let imageURL in imageURLJobData) {
            let value = realm._decryptData(imageURLJobData[imageURL].value, decryptionKey);
            let imageUrlArray = value.split(',');
            imageUrlDataArray = imageUrlDataArray.concat(imageUrlArray);
        }
        return imageUrlDataArray;
    }

    /**
     * This function gets child data of job datat on basis of parent id and prepares a qc object or option array object accordingly
     * @param {*} positionId 
     * @param {*} qcDTO 
     * qcDTO : {
     *              qcAttributeMasterArray
     *              realmDBObject
     *              jobId
     *              decryptionKey
     *         }
     * @param {*} qcDataArray 
     * @param {*} qcDataObjectId
     */
    getChildQCData(positionId, qcDTO, qcDataArray, qcDataObjectId) {
        let query = `jobId = ${qcDTO.jobId} AND parentId = ${positionId}`;
        let objectList = qcDTO.realmDBObject.filtered(query);
        for (let object in objectList) {
            let value = realm._decryptData(objectList[object].value, qcDTO.decryptionKey);
            if (value == OBJECT_SAROJ_FAREYE || value == ARRAY_SAROJ_FAREYE) {
                let positionIdOfObject = objectList[object].positionId;
                qcDataArray[qcDataObjectId] = { objectId: qcDataObjectId, qcResult: qcDTO.qcAttributeMasterArray.qcResult };
                this.getChildQCData(positionIdOfObject, qcDTO, qcDataArray, qcDataObjectId);
                qcDataObjectId++;
            } else {
                let jobAttributeMasterId = objectList[object].jobAttributeMasterId;
                let qcAttributeMasterObject = qcDTO.qcAttributeMasterArray.childList.object ? qcDTO.qcAttributeMasterArray.childList.object : qcDTO.qcAttributeMasterArray.childList;
                this.checkQcObjectAttributeType(jobAttributeMasterId, qcAttributeMasterObject, qcDataArray[qcDataObjectId], value);
            }
        }
    }

    /**
     * This function checks for qc child attribute and assign value to object accordingly
     * @param {*} jobAttributeMasterId 
     * @param {*} qcAttributeMasterObject 
     * @param {*} qcDataObject 
     * @param {*} data 
     */
    checkQcObjectAttributeType(jobAttributeMasterId, qcAttributeMasterObject, qcDataObject, data) {
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
    }

    /**
     * This function prepares qc attribute master array with its child attributes and validations
     * @param {*} currentElement 
     * @param {*} fieldAttributeList 
     * @param {*} formElement 
     * @returns
     * qcAttributeMasterArray : defined above
     */
    prepareQCMasterArrayAttribute(currentElement, fieldAttributeList, formElement) {
        let qcAttributeMasterArray = {}, qcArrayChildObject = {}, fieldAttributeParentIdMap = {}, qcOptionCheckboxArrayChildObject = {};
        for (let fieldAttribute in fieldAttributeList) {
            if (fieldAttributeList[fieldAttribute].parentId) {
                fieldAttributeParentIdMap[fieldAttributeList[fieldAttribute].parentId] = fieldAttributeParentIdMap[fieldAttributeList[fieldAttribute].parentId] ? fieldAttributeParentIdMap[fieldAttributeList[fieldAttribute].parentId] : [];
                fieldAttributeParentIdMap[fieldAttributeList[fieldAttribute].parentId].push(fieldAttributeList[fieldAttribute]);
                continue;
            }
            if (!formElement[fieldAttributeList[fieldAttribute].id]) {
                continue;
            }
            qcAttributeMasterArray = this.checkQCAttributeType(formElement[fieldAttributeList[fieldAttribute].id], qcArrayChildObject, qcAttributeMasterArray);
        }
        //For preparing child attribute of qc array
        this.getChildFieldAttributes(currentElement, fieldAttributeParentIdMap, qcArrayChildObject);
        //For preparing child attribute of option checkbox array
        if (qcArrayChildObject.optionCheckboxArray) {
            this.getChildFieldAttributes(qcArrayChildObject.optionCheckboxArray, fieldAttributeParentIdMap, qcOptionCheckboxArrayChildObject);
        }
        qcAttributeMasterArray.childList = qcArrayChildObject;
        qcArrayChildObject.optionCheckboxArray.childList = qcOptionCheckboxArrayChildObject;
        qcAttributeMasterArray.qcValidationMap = this.setQCConfigurationValidation(qcAttributeMasterArray, currentElement);
        return qcAttributeMasterArray;
    }

    /**
     * This function segregates different qc validation and prepares a validation map
     * @param {*} currentElement 
     * @returns
     * validationMap : (validationMap of qcAttributeMaster defined above)
     */
    setQCConfigurationValidation(currentElement) {
        let validationList = currentElement.validation;
        let validationMap = {};
        for (let validation in validationList) {
            if (validationList[validation].timeOfExecution == 'MINMAX') {
                validationMap.qcImageURLAttributeValidation = validationList[validation];
            } else if (validationList[validation].timeOfExecution == 'REMARKS') {
                switch (validationList[validation].uniqueKey) {
                    case 'captureRemarksWhenAllPointNotConfirmed': {
                        validationMap.qcPassRemarksValidation = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 'captureFailureReasonsForQcFail': {
                        validationMap.qcFailReasonsValidation = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 'captureImageWhenQcPass': {
                        validationMap.qcImageValidation = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 'showSummaryPage': {
                        validationMap.qcSummaryValidation = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 'enableSelectAllButton': {
                        // case of select all (currently not in design)
                        // qcAttributeMasterArray.qcSelectAllValidation = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 'qcRemarksWhenQcFail': {
                        validationMap.qcFailRemarksValidation = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 'byDefaultAllQcPointsSelected': {
                        validationMap.qcResultValidation = validationList[validation].condition == 'TRUE';
                        break;
                    }
                    case 'qcPassButtonText': {
                        validationMap.qcPassButtonTextValidation = validationList[validation].condition;
                        break;
                    }
                    case 'qcFailButtonText': {
                        validationMap.qcFailButtonTextValidation = validationList[validation].condition;
                        break;
                    }
                }
            }
        }
        return validationMap;
    }

    /**
     * This function prepares child list of given field attribute and assign it to its parent accordingly
     * @param {*} fieldAttribute 
     * @param {*} fieldAttributeParentIdMap 
     * @param {*} qcArrayChildObject 
     */
    getChildFieldAttributes(fieldAttribute, fieldAttributeParentIdMap, qcArrayChildObject) {
        let parentId = fieldAttribute.fieldAttributeMasterId ? fieldAttribute.fieldAttributeMasterId : fieldAttribute.id;
        if (!fieldAttributeParentIdMap[parentId]) {
            this.checkQCAttributeType(fieldAttribute, qcArrayChildObject);
        } else {
            let childList = fieldAttributeParentIdMap[parentId];
            for (let index in childList) {
                qcArrayChildObject.object = childList[index].attributeTypeId == OBJECT ? childList[index] : qcArrayChildObject.object;
                this.getChildFieldAttributes(childList[index], fieldAttributeParentIdMap, qcArrayChildObject);
            }
        }
    }

    /**
     * This function checks attribute type of field attribute and assign it to qc array child accordingly
     * @param {*} fieldAttribute 
     * @param {*} qcArrayChildObject 
     * @param {*} qcArray 
     * @returns
     * qcArray : (same as qcAttributeMasterArray defined above)
     */
    checkQCAttributeType(fieldAttribute, qcArrayChildObject, qcArray) {
        let cloneFieldAttribute = JSON.parse(JSON.stringify(fieldAttribute));
        switch (fieldAttribute.attributeTypeId) {
            case QC_ARRAY: {
                qcArray = cloneFieldAttribute;
                break;
            }
            case QC_PASS_FAIL: {
                qcArrayChildObject.qcPassFail = cloneFieldAttribute;
                break;
            }
            case QC_REMARK: {
                qcArrayChildObject.qcRemark = cloneFieldAttribute;
                break;
            }
            case QC_IMAGE: {
                qcArrayChildObject.qcImage = cloneFieldAttribute;
                break;
            }
            case QC_PASS_FAIL: {
                qcArrayChildObject.qcPassFail = cloneFieldAttribute;
                break;
            }
            case OPTION_CHECKBOX_ARRAY: {
                qcArrayChildObject.optionCheckboxArray = cloneFieldAttribute;
                break;
            }
            case QC_LABEL: {
                qcArrayChildObject.object.qcLabel = cloneFieldAttribute;
                break;
            }
            case QC_VALUE: {
                qcArrayChildObject.object.qcValue = cloneFieldAttribute;
                break;
            }
            case QC_RESULT: {
                qcArrayChildObject.object.qcResult = cloneFieldAttribute;
                break;
            }
            case NUMBER: {
                qcArrayChildObject.object.qcSequence = cloneFieldAttribute;
                break;
            }
            case OPTION_CHECKBOX_KEY: {
                qcArrayChildObject.object.optionValue = cloneFieldAttribute;
                break;
            }
            case OPTION_CHECKBOX_VALUE: {
                qcArrayChildObject.object.optionLabel = cloneFieldAttribute;
                break;
            }
        }
        return qcArray
    }

    /**
     * This function prepares qc reason data from job data mapped and also matches the data with qcDataArray selected
     * @param {*} qcDataArray 
     * @param {*} qcAttributeMaster 
     * @param {*} jobTransaction 
     * @param {*} formLayoutState 
     * {
     *      formElement
     *      latestPositionId
     *      fieldAttributeMasterParentIdMap
     *      jobAndFieldAttributesList
     * }
     * @returns
     * {
     *      optionLabel
     *      optionValue
     *      qcResult
     * }
     */
    getQCReasons(qcDataArray, qcAttributeMaster, jobTransaction, formLayoutState) {
        fieldValidationService.fieldValidations(formLayoutState.formElement[qcAttributeMaster.childList.optionCheckboxArray.fieldAttributeMasterId], formLayoutState.formElement, BEFORE, jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap, formLayoutState.jobAndFieldAttributesList);
        let realmJobDataQuery = `jobId = ${jobTransaction.jobId} AND jobAttributeMasterId = ${qcAttributeMaster.childList.optionCheckboxArray.jobAttributeMasterId}`;
        let qcReasonDataObject = {}, qcReasonDataObjectId = 1;
        let realmJobDBObject = realm.getRecordListOnQuery(TABLE_JOB_DATA, null, null, null, true);
        let qcReasonDataArrayapped = realmJobDBObject.filtered(realmJobDataQuery);
        let positionIdOfOptionCheckoxMappedArray = qcReasonDataArrayapped[0].positionId;
        let decryptionKey = DeviceInfo.getUniqueID();
        this.getChildQCData(positionIdOfOptionCheckoxMappedArray, { realmDBObject: realmJobDBObject, jobId: jobTransaction.jobId, decryptionKey, qcAttributeMasterArray: qcAttributeMaster.childList.optionCheckboxArray }, qcReasonDataObject, qcReasonDataObjectId);
        this.matchReasonWithQCData(qcReasonDataObject, qcDataArray);
        return qcReasonDataObject;
    }

    /**
     * This function matches qc reason with qc data array and changes qc reason result accordingly
     * @param {*} qcReasonDataObject 
     * @param {*} qcDataArray 
     */
    matchReasonWithQCData(qcReasonDataObject, qcDataArray) {
        let valueReasonMap = {};
        for (let index in qcReasonDataObject) {
            valueReasonMap[qcReasonDataObject[index].optionValue] = valueReasonMap[qcReasonDataObject[index].optionValue] ? valueReasonMap[qcReasonDataObject[index].optionValue] : [];
            valueReasonMap[qcReasonDataObject[index].optionValue].push(index);
        }

        for (let index in qcDataArray) {
            if (qcDataArray[index].qcResult || !valueReasonMap[qcDataArray[index].qcValue]) {
                continue;
            }
            let reasonArrayToBeChanged = valueReasonMap[qcDataArray[index].qcValue];
            for (let reason in reasonArrayToBeChanged) {
                qcReasonDataObject[reasonArrayToBeChanged[reason]].qcResult = true;
            }
        }
    }

    /**
     * This function prepares clone of form layout state parameters
     * @param {*} formLayoutState 
     * @return 
     * {
     *      formElement
     *      fieldAttributeMasterParentIdMap
     *      jobAndFieldAttributesList
     * }
     */
    prepareCloneFormLayoutState(formLayoutState) {
        // let formElement = JSON.parse(JSON.stringify(formLayoutState.formElement));
        // let fieldAttributeMasterParentIdMap = JSON.parse(JSON.stringify(formLayoutState.fieldAttributeMasterParentIdMap));
        // let jobAndFieldAttributesList = JSON.parse(JSON.stringify(formLayoutState.jobAndFieldAttributesList));
        return JSON.parse(JSON.stringify(formLayoutState));
    }

    /**
     * This function saves qc data array and navigates to screen according to qc validation
     * @param {*} isQCPass 
     * @param {*} stateParameters 
     * {
     *      qcDataArray,
     *      qcAttributeMaster
     * }
     * @param {*} propsParameters 
     * {
     *      formLayoutState,
     *      jobTransaction
     * }
     * @returns
     * {
     *      formLayoutState : {
     *                            formElement
     *                            latestPositionId
     *                            fieldAttributeMasterParentIdMap
     *                            jobAndFieldAttributesList  
     *                        }
     *      screenNameToBeNavigated
     * }
     */
    saveQCDataAndNavigate(isQCPass, stateParameters, propsParameters) {
        let formLayoutState = this.prepareCloneFormLayoutState(propsParameters.formLayoutState);
        let fieldDataObject = this.saveQCData(stateParameters.qcDataArray, stateParameters.qcAttributeMaster, propsParameters.jobTransaction, propsParameters.formLayoutState.latestPositionId);
        formLayoutState.formElement[stateParameters.qcAttributeMaster.fieldAttributeMasterId].value = ARRAY_SAROJ_FAREYE;
        formLayoutState.formElement[stateParameters.qcAttributeMaster.fieldAttributeMasterId].childDataList = fieldDataObject.fieldDataList;
        formLayoutState.latestPositionId = fieldDataObject.latestPositionId;
        if (stateParameters.qcAttributeMaster.childList.qcPassFail) {
            formLayoutState.formElement[stateParameters.qcAttributeMaster.childList.qcPassFail.fieldAttributeMasterId].value = isQCPass ? (stateParameters.qcAttributeMaster.qcValidationMap ? stateParameters.qcAttributeMaster.qcValidationMap.qcPassButtonTextValidation ? stateParameters.qcAttributeMaster.qcValidationMap.qcPassButtonTextValidation : PASS : PASS) : (stateParameters.qcAttributeMaster.qcValidationMap ? stateParameters.qcAttributeMaster.qcValidationMap.qcFailButtonTextValidation ? stateParameters.qcAttributeMaster.qcValidationMap.qcFailButtonTextValidation : FAIL : FAIL);
        }
        let afterValidationResult = fieldValidationService.fieldValidations(stateParameters.qcAttributeMaster, formLayoutState.formElement, AFTER, propsParameters.jobTransaction, formLayoutState.fieldAttributeMasterParentIdMap, formLayoutState.jobAndFieldAttributesList);
        if (!afterValidationResult) {
            return { formLayoutState }
        }
        let screenNameToBeNavigated = this.getScreenNameToNavigate(isQCPass, stateParameters.qcAttributeMaster, stateParameters.qcDataArray, QCAttribute);
        return { formLayoutState, screenNameToBeNavigated };
    }

    /**
     * This function determimes to which screen to navigate based on qc validation and current screen
     * @param {*} isQCPass 
     * @param {*} qcAttributeMaster 
     * @param {*} qcDataArray 
     * @param {*} currentScreen 
     * @returns
     * screenNameToBeNavigated
     */
    getScreenNameToNavigate(isQCPass, qcAttributeMaster, qcDataArray, currentScreen) {
        if (!qcAttributeMaster.qcValidationMap) {
            FormLayout;
        } else if (currentScreen == QCAttribute && !isQCPass && qcAttributeMaster.qcValidationMap.qcFailReasonsValidation) {
            // navigate(QCReasonScreen, { qcDataArray: qcDataArray, qcAttributeMaster: qcAttributeMaster, jobTransaction: jobTransaction });
            return QCReasonScreen;
        } else if ((currentScreen == QCAttribute || currentScreen == QCReasonScreen) && qcAttributeMaster.qcValidationMap.qcImageValidation) {
            //navigate to image n remarks
            return QCImageAndRemarksScreen;
        } else if ((currentScreen == QCAttribute || currentScreen == QCReasonScreen) && isQCPass && qcAttributeMaster.qcValidationMap.qcPassRemarksValidation) {
            let failList = qcDataArray.filter(qcObject => !qcObject.qcResult);
            if (failList.length > 0) {
                //navigate to image n remarks
                return QCImageAndRemarksScreen;
            }
        } else if (currentScreen == QCReasonScreen && qcAttributeMaster.qcValidationMap.qcFailRemarksValidation) {
            return QCImageAndRemarksScreen;
        }
        if (qcAttributeMaster.qcValidationMap.qcSummaryValidation) {
            //navigate to summary
            return QCSummaryScreen;
        } else {
            return FormLayout;
        }
    }

    /**
     * This function prepares field data list to be saved in qc array child data list with parent id and position id set
     * @param {*} qcDataArray 
     * @param {*} qcAttributeMaster 
     * @param {*} jobTransaction 
     * @param {*} latestPositionId 
     * @returns
     * {
     *      fieldDataList : [{
     *                          fieldAttributeMasterId
     *                          value
     *                          parentId
     *                          positionId
     *                          attributeTypeId
     *                          jobTransactionId  
     *                      }]
     *      latestPositionId
     * }
     */
    saveQCData(qcDataArray, qcAttributeMaster, jobTransaction, latestPositionId) {
        let fieldDataListDTO = [];
        let qcObject = qcAttributeMaster.childList.object;
        for (let index in qcDataArray) {
            let object = paymentService.setFieldDataKeysAndValues(qcObject.attributeTypeId, qcObject.id, OBJECT_SAROJ_FAREYE);
            object.childDataList = {};
            object.childDataList[qcObject.qcLabel.id] = paymentService.setFieldDataKeysAndValues(qcObject.qcLabel.attributeTypeId, qcObject.qcLabel.id, qcDataArray[index].qcLabel);
            object.childDataList[qcObject.qcResult.id] = paymentService.setFieldDataKeysAndValues(qcObject.qcResult.attributeTypeId, qcObject.qcResult.id, qcDataArray[index].qcResult ? true : false);
            object.childDataList[qcObject.qcSequence.id] = paymentService.setFieldDataKeysAndValues(qcObject.qcSequence.attributeTypeId, qcObject.qcSequence.id, qcDataArray[index].qcSequence);
            object.childDataList[qcObject.qcValue.id] = paymentService.setFieldDataKeysAndValues(qcObject.qcValue.attributeTypeId, qcObject.qcValue.id, qcDataArray[index].qcValue);
            fieldDataListDTO.push(object);
        }
        let fieldDataObject = fieldDataService.prepareFieldDataForTransactionSavingInState(fieldDataListDTO, jobTransaction.id, qcAttributeMaster.positionId, latestPositionId)
        return fieldDataObject;
    }


    saveQCReasonAndNavigate(qcReasonData, qcAttributeMaster, jobTransaction, formLayoutState) {
        let cloneFormLayoutState = this.prepareCloneFormLayoutState(formLayoutState);
        let fieldDataObject = this.saveQCReasonData(qcReasonData, qcAttributeMaster, jobTransaction, formLayoutState.latestPositionId);
        cloneFormLayoutState.formElement[qcAttributeMaster.childList.optionCheckboxArray.fieldAttributeMasterId].value = ARRAY_SAROJ_FAREYE;
        cloneFormLayoutState.formElement[qcAttributeMaster.childList.optionCheckboxArray.fieldAttributeMasterId].childDataList = fieldDataObject.fieldDataList;
        cloneFormLayoutState.latestPositionId = fieldDataObject.latestPositionId;
        let afterValidationResult = fieldValidationService.fieldValidations(qcAttributeMaster.childList.optionCheckboxArray, cloneFormLayoutState.formElement, AFTER, jobTransaction, cloneFormLayoutState.fieldAttributeMasterParentIdMap, cloneFormLayoutState.jobAndFieldAttributesList);
        if (!afterValidationResult) {
            return { formLayoutState: cloneFormLayoutState }
        }
        let screenNameToBeNavigated = this.getScreenNameToNavigate(false, qcAttributeMaster, [], QCReasonScreen);
        return { formLayoutState: cloneFormLayoutState, screenNameToBeNavigated };
    }

    saveQCReasonData(qcReasonData, qcAttributeMaster, jobTransaction, latestPositionId) {
        let fieldDataListDTO = [];
        let optionArrayObject = qcAttributeMaster.childList.optionCheckboxArray.childList.object;
        for (let index in qcReasonData) {
            if (!qcReasonData[index].qcResult) {
                continue;
            }
            let object = paymentService.setFieldDataKeysAndValues(optionArrayObject.attributeTypeId, optionArrayObject.id, OBJECT_SAROJ_FAREYE);
            object.childDataList = {};
            object.childDataList[optionArrayObject.optionLabel.id] = paymentService.setFieldDataKeysAndValues(optionArrayObject.optionLabel.attributeTypeId, optionArrayObject.optionLabel.id, qcReasonData[index].optionLabel);
            object.childDataList[optionArrayObject.optionValue.id] = paymentService.setFieldDataKeysAndValues(optionArrayObject.optionValue.attributeTypeId, optionArrayObject.optionValue.id, qcReasonData[index].optionValue);
            fieldDataListDTO.push(object);
        }
        let fieldDataObject = fieldDataService.prepareFieldDataForTransactionSavingInState(fieldDataListDTO, jobTransaction.id, qcAttributeMaster.childList.optionCheckboxArray.positionId, latestPositionId)
        return fieldDataObject;
    }

    getQCImageAndRemarksData(qcAttributeMaster, formLayoutState, jobTransaction, qcImageAndRemarkPresentObject) {
        let imageData, remarksData;
        let cloneFormLayoutState = this.prepareCloneFormLayoutState(formLayoutState);
        if (qcImageAndRemarkPresentObject.isQCImage) {
            fieldValidationService.fieldValidations(cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcImage.fieldAttributeMasterId], cloneFormLayoutState.formElement, BEFORE, jobTransaction, cloneFormLayoutState.fieldAttributeMasterParentIdMap, cloneFormLayoutState.jobAndFieldAttributesList);
            imageData = cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcImage.fieldAttributeMasterId].value;
        }
        if (qcImageAndRemarkPresentObject.isQCRemarks) {
            fieldValidationService.fieldValidations(cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcRemark.fieldAttributeMasterId], cloneFormLayoutState.formElement, BEFORE, jobTransaction, cloneFormLayoutState.fieldAttributeMasterParentIdMap, cloneFormLayoutState.jobAndFieldAttributesList);
            remarksData = cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcRemark.fieldAttributeMasterId].value;
        }
        return { imageData, remarksData };
    }

    saveOCImageRemarksAndNavigate(qcImageRemarksObject, qcAttributeMaster, formLayoutState, jobTransaction) {
        let imageAfterValidationResult = true, remarksAfterValidationResult = true;
        let cloneFormLayoutState = this.prepareCloneFormLayoutState(formLayoutState);
        if (qcImageRemarksObject.isQCImage) {
            cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcImage.fieldAttributeMasterId].displayValue = qcImageRemarksObject.qcImageData ? qcImageRemarksObject.qcImageData.value : null;
            imageAfterValidationResult = fieldValidationService.fieldValidations(cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcImage.fieldAttributeMasterId], cloneFormLayoutState.formElement, AFTER, jobTransaction, cloneFormLayoutState.fieldAttributeMasterParentIdMap, cloneFormLayoutState.jobAndFieldAttributesList);
            cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcImage.fieldAttributeMasterId].value = imageAfterValidationResult ? cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcImage.fieldAttributeMasterId].displayValue : null;
        }
        if (qcImageRemarksObject.isQCRemarks && qcImageRemarksObject.qcRemarksData) {
            cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcRemark.fieldAttributeMasterId].displayValue = qcImageRemarksObject.qcRemarksData;
            remarksAfterValidationResult = fieldValidationService.fieldValidations(cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcRemark.fieldAttributeMasterId], cloneFormLayoutState.formElement, AFTER, jobTransaction, cloneFormLayoutState.fieldAttributeMasterParentIdMap, cloneFormLayoutState.jobAndFieldAttributesList);
            cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcRemark.fieldAttributeMasterId].value = remarksAfterValidationResult ? cloneFormLayoutState.formElement[qcAttributeMaster.childList.qcRemark.fieldAttributeMasterId].displayValue : null;
        }

        if (imageAfterValidationResult && remarksAfterValidationResult) {
            return { formLayoutState: cloneFormLayoutState, screenNameToBeNavigated: this.getScreenNameToNavigate(null, qcAttributeMaster, [], QCImageAndRemarksScreen) };
        } else {
            return { formLayoutState: cloneFormLayoutState };
        }
    }
}

export let qcService = new QC()