import { keyValueDBService } from '../KeyValueDBService.js'
import { transientStatusAndSaveActivatedService } from '../TransientStatusAndSaveActivatedService.js'
import {
    AFTER,
    BEFORE,
    OBJECT,
    STRING,
    TEXT,
    DECIMAL,
    SCAN_OR_TEXT,
    QR_SCAN,
    NUMBER
} from '../../../lib/AttributeConstants'
import _ from 'lodash'
import {
    HomeTabNavigatorScreen,
    SaveActivated,
    Transient,
    CheckoutDetails,
    TabScreen,
    SHOULD_RELOAD_START,
    GEO_FENCING,
    FIELD_ATTRIBUTE,
    FIELD_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_VALIDATION,
    FIELD_ATTRIBUTE_VALIDATION_CONDITION,
    BACKUP_ALREADY_EXIST,
    TABLE_FIELD_DATA,
    JOB_ATTRIBUTE,
    USER
} from '../../../lib/constants'
import { formLayoutEventsInterface } from './FormLayoutEventInterface'
import { draftService } from '../DraftService.js'
import { fieldValidationService } from '../FieldValidation'
import { dataStoreService } from '../DataStoreService.js'
import { geoFencingService } from '../GeoFencingService.js'
import * as realm from '../../../repositories/realmdb'
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
        const fieldAttributes = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE);
        const jobAttributes = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
        const user = await keyValueDBService.getValueFromStore(USER)
        const fieldAttributeStatusList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_STATUS);
        const fieldAttributeMasterValidation = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALIDATION);
        const fieldAttributeValidationCondition = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALIDATION_CONDITION);

        if (!fieldAttributes || !fieldAttributes.value || !fieldAttributeStatusList || !fieldAttributeStatusList.value) {
            throw new Error('Value of fieldAttributes or fieldAttribute Status missing')
        }
        let filedAttributesMappedToStatus = fieldAttributeStatusList.value.filter(fieldAttributeStatus => fieldAttributeStatus.statusId == statusId)
            .sort((a, b) => a.sequence - b.sequence) // first find list of fieldAttributeStatus mapped to a status using filter, then sort them on their sequence and then get list of fieldAttributeIds using map

        if (!filedAttributesMappedToStatus) {
            return []
        }
        let fieldAttributeMap = {}; //map for root field attributes
        let fieldAttributeValidationMap = {};
        let arrayMainObject = {};
        let fieldAttributeMasterParentIdMap = {}
        if (fieldAttributeMasterIdFromArray) {
            arrayMainObject = fieldAttributes.value.filter(fieldAttributeObject => (fieldAttributeObject.parentId == fieldAttributeMasterIdFromArray &&
                fieldAttributeObject.attributeTypeId == OBJECT))
        }

        for (const fieldAttribute of fieldAttributes.value) {
            if (fieldAttribute)
                if (fieldAttributeMasterIdFromArray) {
                    if (fieldAttribute.parentId == arrayMainObject[0].id) {
                        fieldAttributeMap[fieldAttribute.id] = fieldAttribute
                    }
                } else {
                    fieldAttributeMap[fieldAttribute.id] = fieldAttribute;
                }
        }

        let sequenceWiseSortedFieldAttributesForStatus = []

        for (let index in filedAttributesMappedToStatus) {
            fieldAttributeMasterParentIdMap[filedAttributesMappedToStatus[index].fieldAttributeId] = fieldAttributeMasterIdFromArray ? {} : fieldAttributeMap[filedAttributesMappedToStatus[index].fieldAttributeId].parentId
            if (fieldAttributeMasterIdFromArray) {
                if (fieldAttributeMap[filedAttributesMappedToStatus[index].fieldAttributeId]) {
                    sequenceWiseSortedFieldAttributesForStatus.push(fieldAttributeMap[filedAttributesMappedToStatus[index].fieldAttributeId])
                }
            } else if (!fieldAttributeMap[filedAttributesMappedToStatus[index].fieldAttributeId].parentId) {
                sequenceWiseSortedFieldAttributesForStatus.push(fieldAttributeMap[filedAttributesMappedToStatus[index].fieldAttributeId])
            }
            // if ((fieldAttributeMasterIdFromArray && fieldAttributeMap[filedAttributesMappedToStatus[index].fieldAttributeId]) || (!fieldAttributeMap[filedAttributesMappedToStatus[index].fieldAttributeId].parentId)) {
            //     sequenceWiseSortedFieldAttributesForStatus.push(fieldAttributeMap[filedAttributesMappedToStatus[index].fieldAttributeId])
            // }
        } //getting fieldAttribute list

        const fieldAttributeMasterValidationMap = this.getFieldAttributeValidationMap(fieldAttributeMasterValidation.value);
        const fieldAttrMasterValidationConditionMap = this.getFieldAttributeValidationConditionMap(fieldAttributeValidationCondition.value, fieldAttributeMasterValidationMap)
        if (!latestPositionId) {
            latestPositionId = this.getLatestPositionIdForJobTransaction(jobTransaction)
        }
        const sequenceWiseFormLayout = this.getFormLayoutSortedObject(sequenceWiseSortedFieldAttributesForStatus, fieldAttributeMasterValidationMap, fieldAttrMasterValidationConditionMap, jobTransaction, latestPositionId)
        if (fieldAttributeMasterIdFromArray) {
            sequenceWiseFormLayout.arrayMainObject = arrayMainObject[0]
            return sequenceWiseFormLayout
        }
        else {
            sequenceWiseFormLayout.fieldAttributeMasterParentIdMap = fieldAttributeMasterParentIdMap
            sequenceWiseFormLayout.jobAndFieldAttributesList = {
                jobAttributes: jobAttributes.value,
                fieldAttributes: fieldAttributes.value,
                user: user.value
            }
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
    getFormLayoutSortedObject(sequenceWiseSortedFieldAttributesForStatus, fieldAttributeMasterValidationMap, fieldAttrMasterValidationConditionMap, jobTransaction, latestPositionId) {
        let formLayoutObject = new Map()
        if (!sequenceWiseSortedFieldAttributesForStatus || sequenceWiseSortedFieldAttributesForStatus.length == 0) {
            return { formLayoutObject, isSaveDisabled: false, noFieldAttributeMappedWithStatus: true } //no field attribute mapped to this status
        }

        let isRequiredAttributeFound = false
        let tempFieldAttributeList = []
        for (let i = 0; i < sequenceWiseSortedFieldAttributesForStatus.length; i++) {
            let fieldAttribute = sequenceWiseSortedFieldAttributesForStatus[i]
            if (!isRequiredAttributeFound) {
                fieldAttribute.required ? (fieldAttribute.editable = true, fieldAttribute.focus = true, isRequiredAttributeFound = true) : fieldAttribute.editable = true
            }
            let validationArr = fieldAttributeMasterValidationMap[fieldAttribute.id]
            if (validationArr && validationArr.length > 0 && fieldAttrMasterValidationConditionMap) {
                for (var validation of validationArr) {
                    validation.conditions = fieldAttrMasterValidationConditionMap[validation.id]
                }
            }
            formLayoutObject.set(fieldAttribute.id, this.getFieldAttributeObject(fieldAttribute, validationArr, i + latestPositionId + 1))
            if (!fieldAttribute.hidden) {
                tempFieldAttributeList.push(formLayoutObject.get(fieldAttribute.id))
            }
        }
        //TODO remove this code (just a quick fix for demo)
        // if (tempFieldAttributeList.length == 1) {
        //     fieldValidationService.fieldValidations(tempFieldAttributeList[0], formLayoutObject, BEFORE, jobTransaction)
        //     if (tempFieldAttributeList[0].value != undefined && tempFieldAttributeList[0].value != null && tempFieldAttributeList[0].value != '') {
        //         isRequiredAttributeFound = false
        //     }
        //     // formLayoutObject.set(tempFieldAttributeList[0].id, this.getFieldAttributeObject(tempFieldAttributeList[0], formLayoutObject.get(tempFieldAttributeList[0].id).validation, formLayoutObject.get(tempFieldAttributeList[0].id).positionId))
        // }
        let positionId = sequenceWiseSortedFieldAttributesForStatus.length + latestPositionId
        return { formLayoutObject, isSaveDisabled: isRequiredAttributeFound, latestPositionId: positionId, noFieldAttributeMappedWithStatus: false }
    }



    /**
     * creates fieldAttributeDto
     * @param {*fieldAttribute} fieldAttribute 
     * @param {*validationArray} validationArray 
     * @param {*positionId} positionId 
     */
    getFieldAttributeObject(fieldAttribute, validationArray, positionId) {
        const { label, subLabel, helpText, key, required, hidden, attributeTypeId, dataStoreAttributeId, dataStoreMasterId, externalDataStoreMasterUrl, dataStoreFilterMapping } = fieldAttribute
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
            dataStoreFilterMapping
        };
    }

    concatFormElementForTransientStatus(navigationFormLayoutStates, formElement) {
        let combineMap = new Map(formElement)
        for (let formLayoutCounter in navigationFormLayoutStates) {
            let formElementForPreviousStatus = navigationFormLayoutStates[formLayoutCounter].formElement
            let formElement1 = JSON.parse(JSON.stringify([...combineMap]))//deep cloning ES6 Map
            let formElement2 = JSON.parse(JSON.stringify([...formElementForPreviousStatus]))// concatinating fieldAttributes i.e. formElement map of multiple status in case if transient status is present
            combineMap = new Map(formElement1.concat(formElement2))
        }
        return combineMap
    }

    async saveAndNavigate(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, statusList) {
        let routeName, routeParam
        const currentStatus = await transientStatusAndSaveActivatedService.getCurrentStatus(statusList, formLayoutState.statusId, jobMasterId)
        if (formLayoutState.jobTransactionId < 0 && currentStatus.saveActivated) {
            routeName = SaveActivated
            routeParam = {
                formLayoutState, contactData, currentStatus, jobTransaction, jobMasterId, navigationFormLayoutStates
            }
            draftService.deleteDraftFromDb(jobTransaction, jobMasterId)

        } else if (formLayoutState.jobTransactionId < 0 && !_.isEmpty(previousStatusSaveActivated)) {
            let { elementsArray, amount } = await transientStatusAndSaveActivatedService.getDataFromFormElement(formLayoutState.formElement)
            let totalAmount = await transientStatusAndSaveActivatedService.calculateTotalAmount(previousStatusSaveActivated.commonData.amount, previousStatusSaveActivated.recurringData, amount)
            routeName = CheckoutDetails
            routeParam = { commonData: previousStatusSaveActivated.commonData.commonData, recurringData: previousStatusSaveActivated.recurringData, totalAmount, signOfData: elementsArray, jobMasterId }
            let formLayoutObject = formLayoutState.formElement
            if (navigationFormLayoutStates) {
                formLayoutObject = await this.concatFormElementForTransientStatus(navigationFormLayoutStates, formLayoutState.formElement)
            }
            await transientStatusAndSaveActivatedService.saveDataInDbAndAddTransactionsToSyncList(formLayoutObject, previousStatusSaveActivated.recurringData, jobMasterId, formLayoutState.statusId, true)
            draftService.deleteDraftFromDb(jobTransaction, jobMasterId)
        }
        else if (currentStatus.transient) {
            routeName = Transient
            routeParam = { currentStatus, formLayoutState, contactData, jobTransaction, jobMasterId, }
        }
        else {
            routeName = TabScreen
            routeParam = {}
            let formLayoutObject = formLayoutState.formElement
            if (navigationFormLayoutStates) {
                formLayoutObject = await this.concatFormElementForTransientStatus(navigationFormLayoutStates, formLayoutState.formElement)
            }
            let jobTransactionList = await formLayoutEventsInterface.saveDataInDb(formLayoutObject, formLayoutState.jobTransactionId, formLayoutState.statusId, jobMasterId, jobTransaction)
            await formLayoutEventsInterface.addTransactionsToSyncList(jobTransactionList)
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

    isFormValid(formElement, jobTransaction, fieldAttributeMasterParentIdMap) {
        if (!formElement) {
            throw new Error('formElement is missing')
        }
        for (let [id, currentObject] of formElement.entries()) {
            let afterValidationResult = fieldValidationService.fieldValidations(currentObject, formElement, AFTER, jobTransaction, fieldAttributeMasterParentIdMap)
            let uniqueValidationResult = this.checkUniqueValidation(currentObject)
            if (uniqueValidationResult) {
                currentObject.alertMessage = UNIQUE_VALIDATION_FAILED_FORMLAYOUT
            }
            currentObject.value = afterValidationResult && !uniqueValidationResult ? currentObject.displayValue : null
            if (currentObject.required && (currentObject.value == undefined || currentObject.value == null || currentObject.value == '')) {
                return { isFormValid: false, formElement }
            } else if ((currentObject.value || currentObject.value == 0) && (currentObject.attributeTypeId == 6 || currentObject.attributeTypeId == 27) && !Number.isInteger(Number(currentObject.value))) {
                return { isFormValid: false, formElement }
            } else if ((currentObject.value || currentObject.value == 0) && currentObject.attributeTypeId == 13 && !Number(currentObject.value)) {
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
