import { keyValueDBService } from '../KeyValueDBService.js'
import { transientStatusAndSaveActivatedService } from '../TransientStatusAndSaveActivatedService.js'
import { AFTER, OBJECT, STRING, TEXT, DECIMAL, SCAN_OR_TEXT, QR_SCAN, NUMBER, QC_IMAGE, QC_REMARK, QC_PASS_FAIL, OPTION_CHECKBOX_ARRAY } from '../../../lib/AttributeConstants'
import _ from 'lodash'
import { SaveActivated, Transient, CheckoutDetails, TabScreen, SHOULD_RELOAD_START, BACKUP_ALREADY_EXIST, TABLE_FIELD_DATA, TABLE_JOB_TRANSACTION } from '../../../lib/constants'
import { formLayoutEventsInterface } from './FormLayoutEventInterface'
import { draftService } from '../DraftService.js'
import { fieldValidationService } from '../FieldValidation'
import { dataStoreService } from '../DataStoreService.js'
import { geoFencingService } from '../GeoFencingService.js'
import * as realm from '../../../repositories/realmdb'
import { transactionCustomizationService } from '../TransactionCustomization'
import { UNIQUE_VALIDATION_FAILED_FORMLAYOUT } from '../../../lib/ContainerConstants'
class FormLayout {

    /**
     * It accepts statusId to be captured
     * and returns an object containing {formLayoutObject,nextEditable,latestPositionId}
     * mapped to this statusId
     * 
     * structure of formLayout,nextEditable and latestPositionId is as per the declaration in initial state of formLayout
     * 
     * @param {*} statusId id of status to be captured
     */
    async getSequenceWiseRootFieldAttributes(statusId, fieldAttributeMasterIdFromArray, jobTransaction, latestPositionId) {
        if (!statusId) {
            throw new Error('Missing statusId');
        }
        const { fieldAttributes, jobAttributes, user, hub, fieldAttributeStatusList, fieldAttributeMasterValidation, fieldAttributeValidationCondition } = await transactionCustomizationService.getFormLayoutParameters()
        if (!fieldAttributes || !fieldAttributeStatusList) {
            throw new Error('Value of fieldAttributes or fieldAttribute Status missing')
        }
        let fieldAttributesMappedToStatus = fieldAttributeStatusList.filter(fieldAttributeStatus => fieldAttributeStatus.statusId == statusId).sort((a, b) => a.sequence - b.sequence)
        // first find list of fieldAttributeStatus mapped to a status using filter, then sort them on their sequence and then get list of fieldAttributeIds using map
        if (!fieldAttributesMappedToStatus) {
            return []
        }
        let fieldAttributeMap = {}, arrayMainObject = {}; //map for root field attributes
        if (fieldAttributeMasterIdFromArray) {
            arrayMainObject = fieldAttributes.filter(fieldAttributeObject => (fieldAttributeObject.parentId == fieldAttributeMasterIdFromArray && fieldAttributeObject.attributeTypeId == OBJECT))
        }
        for (const fieldAttribute in fieldAttributes) {
            if (!fieldAttributeMasterIdFromArray || (fieldAttributeMasterIdFromArray && fieldAttributes[fieldAttribute].parentId == arrayMainObject[0].id)) {
                fieldAttributeMap[fieldAttributes[fieldAttribute].id] = fieldAttributes[fieldAttribute]
            }
        }
        const fieldAttributeMasterValidationMap = this.getFieldAttributeValidationMap(fieldAttributeMasterValidation);
        const fieldAttrMasterValidationConditionMap = this.getFieldAttributeValidationConditionMap(fieldAttributeValidationCondition, fieldAttributeMasterValidationMap)
        if (!latestPositionId) {
            latestPositionId = this.getLatestPositionIdForJobTransaction(jobTransaction)
        }
        const sequenceWiseFormLayout = this.getFormLayoutSortedObject(fieldAttributeMasterValidationMap, fieldAttrMasterValidationConditionMap, latestPositionId, fieldAttributesMappedToStatus, fieldAttributeMap, fieldAttributeMasterIdFromArray)
        if (fieldAttributeMasterIdFromArray) {
            sequenceWiseFormLayout.arrayMainObject = arrayMainObject[0]
            return sequenceWiseFormLayout
        } else {
            sequenceWiseFormLayout.jobAndFieldAttributesList = { jobAttributes, fieldAttributes, user, hub }
            return sequenceWiseFormLayout
        }
    }

    /**
     * accepts fieldAttributeMasterValidations and
     * returns map of fieldAttributeValidation (id wise fieldAttributeValidation)
     * @param {*} fieldAttributeMasterValidations array of fieldAttributeMasterValidations
     */
    getFieldAttributeValidationMap(fieldAttributeMasterValidations) {
        if (!fieldAttributeMasterValidations) {
            return;
        }
        let fieldAttributeValidationMap = {};
        for (const fieldAttributeMasterValidation of fieldAttributeMasterValidations) {
            if (!fieldAttributeMasterValidation || !fieldAttributeMasterValidation.fieldAttributeMasterId) {
                continue;
            }
            let fieldAttributeId = fieldAttributeMasterValidation.fieldAttributeMasterId;
            if (!fieldAttributeValidationMap[fieldAttributeId]) {
                fieldAttributeValidationMap[fieldAttributeId] = [];
            }
            fieldAttributeValidationMap[fieldAttributeId].push(fieldAttributeMasterValidation);
        }
        return fieldAttributeValidationMap;
    }

    /**
     * accepts fieldAttributeValidationConditions,fieldAttributeMasterValidationMap
     * and returns fieldAttributeValidationConditionMap
     * 
     * @param {*} fieldAttributeValidationConditions array of fieldAttributeValidationCondition
     * @param {*} fieldAttributeMasterValidationMap fieldAttributeMasterValidationMap
     */
    getFieldAttributeValidationConditionMap(fieldAttributeValidationConditions, fieldAttributeMasterValidationMap) {
        if (!fieldAttributeMasterValidationMap || !fieldAttributeValidationConditions) {
            return
        }
        let fieldAttributeValidationConditionMap = {};
        for (const fieldAttributeValidationCondition of fieldAttributeValidationConditions) {
            let validationMasterId = fieldAttributeValidationCondition.fieldAttributeMasterValidationId;
            if (!fieldAttributeValidationConditionMap[validationMasterId]) {
                fieldAttributeValidationConditionMap[validationMasterId] = [];
            }
            fieldAttributeValidationConditionMap[validationMasterId].push(fieldAttributeValidationCondition);

        }
        return fieldAttributeValidationConditionMap;
    }

    /**
     * constructs formLayoutDto in sorted order and nextEditable object and latest positionId 
     * also sets editable and focusable to true for first required element
     * @param {*} sequenceWiseSortedFieldAttributesForStatus sequence wise sorted fieldAttribute for status
     * @param {*} fieldAttributeMasterValidationMap fieldAttributeMaster validation map
     * @param {*} fieldAttrMasterValidationConditionMap validation condition map
     */
    getFormLayoutSortedObject(fieldAttributeMasterValidationMap, fieldAttrMasterValidationConditionMap, latestPositionId, fieldAttributesMappedToStatus, fieldAttributeMap, fieldAttributeMasterIdFromArray) {
        let formLayoutObject = {}
        let fieldAttributeMasterParentIdMap = {}, sequenceWiseSortedFieldAttributesMasterIds = [], counterPositionId = latestPositionId + 1
        for (let i = 0; i < fieldAttributesMappedToStatus.length; i++) {
            let particularFieldAttributeMap = fieldAttributeMap[fieldAttributesMappedToStatus[i].fieldAttributeId]
            if (!fieldAttributeMasterIdFromArray) {
                fieldAttributeMasterParentIdMap[fieldAttributesMappedToStatus[i].fieldAttributeId] = particularFieldAttributeMap.parentId
            }
            if ((!fieldAttributeMasterIdFromArray && !particularFieldAttributeMap.parentId) || (fieldAttributeMasterIdFromArray && particularFieldAttributeMap)) {
                sequenceWiseSortedFieldAttributesMasterIds.push(fieldAttributesMappedToStatus[i].fieldAttributeId)
                let validationArr = fieldAttributeMasterValidationMap[particularFieldAttributeMap.id]
                if (validationArr && validationArr.length > 0 && fieldAttrMasterValidationConditionMap) {
                    for (var validation of validationArr) {
                        validation.conditions = fieldAttrMasterValidationConditionMap[validation.id]
                    }
                }
                formLayoutObject[particularFieldAttributeMap.id] = this.getFieldAttributeObject(particularFieldAttributeMap, validationArr, counterPositionId++)
            }
        }
        if (_.isEmpty(formLayoutObject)) {
            return { formLayoutObject, isSaveDisabled: false, noFieldAttributeMappedWithStatus: true } //no field attribute mapped to this status
        }
        let positionId = sequenceWiseSortedFieldAttributesMasterIds.length + latestPositionId
        return { formLayoutObject, isSaveDisabled: false, latestPositionId: positionId, noFieldAttributeMappedWithStatus: false, fieldAttributeMasterParentIdMap, sequenceWiseSortedFieldAttributesMasterIds }
    }



    /**
     * creates fieldAttributeDto
     * @param  fieldAttribute 
     * @param  validationArray 
     * @param  positionId 
     */
    getFieldAttributeObject(fieldAttribute, validationArray, positionId) {
        const { label, subLabel, helpText, key, required, hidden, attributeTypeId, dataStoreAttributeId, dataStoreMasterId, externalDataStoreMasterUrl, dataStoreFilterMapping, jobAttributeMasterId } = fieldAttribute
        return {
            label,
            subLabel,
            helpText,
            key,
            required,
            hidden,
            attributeTypeId,
            fieldAttributeMasterId: fieldAttribute.id,
            positionId,
            parentId: 0,
            showHelpText: false,
            editable: !(fieldAttribute.editable) ? false : fieldAttribute.editable,
            focus: fieldAttribute.focus ? fieldAttribute.focus : false,
            validation: (validationArray && validationArray.length > 0) ? validationArray : null,
            sequenceMasterId: fieldAttribute.sequenceMasterId,
            dataStoreMasterId,
            dataStoreAttributeId,
            externalDataStoreMasterUrl,
            dataStoreFilterMapping,
            jobAttributeMasterId
        };
    }

    concatFormElementForTransientStatus(navigationFormLayoutStates, formElement) {
        let combineMap = _.assign({}, formElement)
        for (let formLayoutCounter in navigationFormLayoutStates) {
            combineMap = _.assign({}, combineMap, navigationFormLayoutStates[formLayoutCounter].formElement)
        }
        return combineMap
    }

    async saveAndNavigate(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, statusList, taskListScreenDetails) {
        let routeName, routeParam
        const currentStatus = transientStatusAndSaveActivatedService.getCurrentStatus(statusList, formLayoutState.statusId, jobMasterId)
        if (formLayoutState.jobTransactionId < 0 && currentStatus.saveActivated) {
            routeName = SaveActivated
            routeParam = {
                formLayoutState, contactData, currentStatus, jobTransaction, jobMasterId, navigationFormLayoutStates
            }
            draftService.deleteDraftFromDb(jobTransaction, jobMasterId)

        } else if (formLayoutState.jobTransactionId < 0 && !_.isEmpty(previousStatusSaveActivated)) {
            let { elementsArray, amount } = transientStatusAndSaveActivatedService.getDataFromFormElement(formLayoutState.formElement)
            let totalAmount = transientStatusAndSaveActivatedService.calculateTotalAmount(previousStatusSaveActivated.commonData.amount, previousStatusSaveActivated.recurringData, amount)
            routeName = CheckoutDetails
            routeParam = { commonData: previousStatusSaveActivated.commonData.commonData, recurringData: previousStatusSaveActivated.recurringData, totalAmount, signOfData: elementsArray, jobMasterId }
            let formLayoutObject = formLayoutState.formElement
            if (navigationFormLayoutStates) {
                formLayoutObject = this.concatFormElementForTransientStatus(navigationFormLayoutStates, formLayoutState.formElement)
            }
            await transientStatusAndSaveActivatedService.saveDataInDbAndAddTransactionsToSyncList(formLayoutObject, previousStatusSaveActivated.recurringData, jobMasterId, formLayoutState.statusId, true)
            draftService.deleteDraftFromDb(jobTransaction, jobMasterId)
        }
        else if (currentStatus.transient) {
            routeName = Transient
            let { jobDetailsScreenKey, pageObjectAdditionalParams } = taskListScreenDetails
            routeParam = { currentStatus, formLayoutState, contactData, jobTransaction, jobMasterId, jobDetailsScreenKey, pageObjectAdditionalParams }
        }
        else {
            routeName = TabScreen
            routeParam = {}
            let formLayoutObject = formLayoutState.formElement
            if (navigationFormLayoutStates) {
                formLayoutObject = this.concatFormElementForTransientStatus(navigationFormLayoutStates, formLayoutState.formElement)
            }
            let jobTransactionList = await formLayoutEventsInterface.saveDataInDb(formLayoutObject, formLayoutState.jobTransactionId, formLayoutState.statusId, jobMasterId, jobTransaction, formLayoutState.jobAndFieldAttributesList)
            await formLayoutEventsInterface.addTransactionsToSyncList(jobTransactionList, jobMasterId)
            //if (!jobTransaction.length) { //Delete draft only if not bulk
            draftService.deleteDraftFromDb(jobTransaction, jobMasterId)
            //}
            //await keyValueDBService.validateAndSaveData(SHOULD_RELOAD_START, new Boolean(true))
            await keyValueDBService.validateAndSaveData(BACKUP_ALREADY_EXIST, new Boolean(false))
            await geoFencingService.addNewGeoFenceAndDeletePreviousFence()
        }
        return {
            routeName,
            routeParam
        }
    }

    isFormValid(formElement, jobTransaction, fieldAttributeMasterParentIdMap, jobAndFieldAttributesList) {
        if (!formElement) {
            throw new Error('formElement is missing')
        }
        for (let currentObject in formElement) {
            if (formElement[currentObject].attributeTypeId == QC_IMAGE || formElement[currentObject].attributeTypeId == QC_REMARK || formElement[currentObject].attributeTypeId == OPTION_CHECKBOX_ARRAY || formElement[currentObject].attributeTypeId == QC_PASS_FAIL) {
                continue;
            }
            let afterValidationResult = fieldValidationService.fieldValidations(formElement[currentObject], formElement, AFTER, jobTransaction, fieldAttributeMasterParentIdMap, jobAndFieldAttributesList)
            let uniqueValidationResult = this.checkUniqueValidation(formElement[currentObject])
            if (uniqueValidationResult) {
                formElement[currentObject].alertMessage = UNIQUE_VALIDATION_FAILED_FORMLAYOUT
            }
            formElement[currentObject].value = afterValidationResult && !uniqueValidationResult ? formElement[currentObject].displayValue : null
            if (formElement[currentObject].required && (formElement[currentObject].value == undefined || formElement[currentObject].value == null || formElement[currentObject].value == '')) {
                return { isFormValid: false, formElement }
            } else if ((formElement[currentObject].value && formElement[currentObject].value != 0) && (formElement[currentObject].attributeTypeId == 6 || formElement[currentObject].attributeTypeId == 27) && !Number.isInteger(Number(formElement[currentObject].value))) {
                return { isFormValid: false, formElement }
            } else if ((formElement[currentObject].value && formElement[currentObject].value != 0) && formElement[currentObject].attributeTypeId == 13 && !Number(formElement[currentObject].value)) {
                return { isFormValid: false, formElement }
            }
        }
        return { isFormValid: true, formElement }
    }

    checkUniqueValidation(currentObject) {
        switch (currentObject.attributeTypeId) {
            case STRING:
            case TEXT:
            case DECIMAL:
            case SCAN_OR_TEXT:
            case QR_SCAN:
            case NUMBER:
                return dataStoreService.checkForUniqueValidation(currentObject.displayValue, currentObject)
            default:
                return false
        }
    }
    getLatestPositionIdForJobTransaction(jobTransaction) {
        let query = ''
        if (jobTransaction.length) {
            query = jobTransaction.map(job => 'jobTransactionId = ' + job.jobTransactionId).join(' OR ')
        } else {
            query = 'jobTransactionId = ' + jobTransaction.id
        }
        let maxPositionId = realm.getMaxValueOfProperty(TABLE_FIELD_DATA, query, 'positionId')
        return (!maxPositionId) ? 0 : maxPositionId
    }
}

export let formLayoutService = new FormLayout()
