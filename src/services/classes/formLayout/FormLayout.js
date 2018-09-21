import { keyValueDBService } from '../KeyValueDBService.js'
import { transientStatusAndSaveActivatedService } from '../TransientStatusAndSaveActivatedService.js'
import { 
    AFTER, 
    OBJECT, 
    STRING, 
    TEXT, 
    DECIMAL, 
    SCAN_OR_TEXT, 
    QR_SCAN, 
    NUMBER, 
    QC_IMAGE, 
    QC_REMARK, 
    QC_PASS_FAIL, 
    OPTION_CHECKBOX_ARRAY,
    SKU_ARRAY,
    ARRAY,
    MONEY_COLLECT,
    MONEY_PAY,
    FIXED_SKU,
    PRINT
 } from '../../../lib/AttributeConstants'
import _ from 'lodash'
import { SaveActivated, Transient, CheckoutDetails, TabScreen, SHOULD_RELOAD_START, BACKUP_ALREADY_EXIST, TABLE_FIELD_DATA, FIELD_ATTRIBUTE_VALUE } from '../../../lib/constants'
import { formLayoutEventsInterface } from './FormLayoutEventInterface'
import { draftService } from '../DraftService.js'
import { fieldValidationService } from '../FieldValidation'
import { dataStoreService } from '../DataStoreService.js'
import { geoFencingService } from '../GeoFencingService.js'
import * as realm from '../../../repositories/realmdb'
import { transactionCustomizationService } from '../TransactionCustomization'
import { fieldAttributeValueMasterService } from '../FieldAttributeValueMaster'
import { UNIQUE_VALIDATION_FAILED_FORMLAYOUT } from '../../../lib/ContainerConstants'
import { jobDataService } from '../JobData'
import BluetoothSerial from 'react-native-bluetooth-serial';
import { EscPos } from 'escpos-xml';

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
    async printingTemplateFormatStructure(cloneFormElement, jobTransaction, printAttributeMasterId) {
        let masterIdPrintingObjectMap = {}, jobDataObject = {}
        let transaction = jobTransaction && jobTransaction.length ? jobTransaction[0] : jobTransaction
        const fieldAttributeValueList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE);
        let printingFieldAttributeMasterValue = fieldAttributeValueMasterService.filterFieldAttributeValueList(fieldAttributeValueList.value, printAttributeMasterId);
        let {attributeMap, jobAttributesMap} = this.combineJobAndFieldAttribute(cloneFormElement.jobAndFieldAttributesList.jobAttributes, cloneFormElement.jobAndFieldAttributesList.fieldAttributes)
        let { masterIdJobAttributeMap, printingAttributeValueMap, labelMap } = this.createMapOfMasterIdAndPrintingObject(printingFieldAttributeMasterValue, masterIdPrintingObjectMap, attributeMap, jobAttributesMap)
        printingAttributeValueMap = _.sortBy(printingAttributeValueMap, function (object) { return object.sequence });
        if (!_.isEmpty(masterIdJobAttributeMap)) {
            jobDataObject = jobDataService.prepareJobDataForTransactionParticularStatus(transaction.jobId, masterIdJobAttributeMap, masterIdJobAttributeMap)
        }
        let dataList = Object.assign({}, jobDataObject.dataList, cloneFormElement.formElement)
        await this.preparePrintingTemplate(transaction.id, dataList, printingAttributeValueMap, masterIdPrintingObjectMap, labelMap)
    }

    combineJobAndFieldAttribute(jobAttributes, fieldAttributes){
       let attributeMap = {}, jobAttributesMap = {}
       for(let id in jobAttributes){
           attributeMap[jobAttributes[id].id] = jobAttributes[id]
           jobAttributesMap[jobAttributes[id].id] = jobAttributes[id]
       }
       for(let id in fieldAttributes){
        attributeMap[fieldAttributes[id].id] = fieldAttributes[id]
       }
       return {attributeMap, jobAttributesMap}
    }

    printTypeFormatString(value, label){
       switch(label){
           case 'Barcode' : return `<barcode system="CODE_128" width="DOT_250" height= "100">${String(value)}</barcode>`
           case 'Text' :  return `<text size="1:0">${String(value)+` `}</text>`
           case 'Header' :  return `<bold><text size="1:1">${String(value)+` `}</text></bold>`
       }
    }

    prepareTemplateForObjectInArray(childDataValueObject, printingFieldAttributeMasterValue, attributeMasterIdType, labelCount, labelMap, printFormatValue, printArray){
        let objectLabel = ``
        let childData = `` , childArray = [], valueData, printingDataObject
        for (let childItem in childDataValueObject) {
            valueData = childDataValueObject[childItem].data ? childDataValueObject[childItem].data : childDataValueObject[childItem]
            printingDataObject = printingFieldAttributeMasterValue[valueData[attributeMasterIdType]]
            if (printingDataObject) {
                if(labelCount == 0){
                    objectLabel += this.printTypeFormatString(labelMap ? labelMap[valueData[attributeMasterIdType]] : childDataValueObject[childItem].label, 'Text')
                }
                if(printingDataObject.code == 'Qrcode'){
                    if(!_.isEmpty(childData)){
                        childArray.push(childData)
                        childData = ``
                    } 
                    childArray.push([valueData.value])
                }else{
                    childData += this.printTypeFormatString(valueData.value, printingDataObject.code)
                }
            }
        }
        if(labelCount == 0){
            printFormatValue += objectLabel + `<line-feed />`
        }
        for(let child in childArray){
            if(childArray[child].constructor === Array){
                if(!_.isEmpty(printFormatValue)) printArray.push(printFormatValue) 
                printArray.push(childArray[child]) 
            }else{
                printArray.push(printFormatValue + childArray[child])
            }
            printFormatValue = ``
        }
        if(!_.isEmpty(childData)){
            printFormatValue += childData + `<line-feed />`
        }
        return {printArray, printFormatValue}
    }

    prepareTemplateForArrayInArray(childDataList, labelMap, printingFieldAttributeMasterValue, printFormatValue, attributeMasterIdType, printArray){
        let detailArrayChildData, detailsValue, objectValue
        for (let detailsData in childDataList) {
            detailArrayChildData = childDataList[detailsData]
            detailsValue = labelMap ? detailArrayChildData : detailArrayChildData.data
            if (detailsValue && detailsValue.value != null && detailsValue.value == 'ObjectSarojFareye' && detailArrayChildData.childDataList) {
                for (let detailObject in detailArrayChildData.childDataList) {
                    objectValue =  detailArrayChildData.childDataList[detailObject] && detailArrayChildData.childDataList[detailObject].data ? detailArrayChildData.childDataList[detailObject].data : detailArrayChildData.childDataList[detailObject]
                    if (objectValue && printingFieldAttributeMasterValue[objectValue[attributeMasterIdType]] && objectValue.value) {
                        if(printingFieldAttributeMasterValue[objectValue[attributeMasterIdType]].code == 'Qrcode'){
                            if(!_.isEmpty(printFormatValue)) {
                                printArray.push(printFormatValue)
                                printFormatValue = ``
                            }
                            printArray.push([objectValue.value])
                        }else{
                            printFormatValue += this.printTypeFormatString(objectValue.value, printingFieldAttributeMasterValue[objectValue[attributeMasterIdType]].code) + `<line-feed />`
                        }
                    }
                }
            }
        }
        return {printArray, printFormatValue}
    }

    preparePrintTemplateInCaseOfArray(childDataObject, printingFieldAttributeMasterValue, labelMap, attributeMasterIdType, printFormatValue, printArray){
        let labelCount = 0, childObjectValue, childArrayObject, dataItem
        for (let data in childDataObject) {
            if (childDataObject[data].attributeTypeId == OBJECT) { // case of object in array
               childObjectValue = this.prepareTemplateForObjectInArray(childDataObject[data].childDataList, printingFieldAttributeMasterValue, attributeMasterIdType, labelCount, labelMap, printFormatValue, printArray)
               printArray = childObjectValue.printArray
               printFormatValue = childObjectValue.printFormatValue
               labelCount +=1
            } else if (childDataObject[data].attributeTypeId == ARRAY) {  // case of array in array
               childArrayObject = this.prepareTemplateForArrayInArray(childDataObject[data].childDataList, labelMap, printingFieldAttributeMasterValue, printFormatValue, attributeMasterIdType, printArray)
               printArray = childArrayObject.printArray
               printFormatValue = childArrayObject.printFormatValue
            } else { // case of normal attribute in array
                dataItem = childDataObject[data] && childDataObject[data].data ? childDataObject[data].data : childDataObject[data]
                if ( dataItem && printingFieldAttributeMasterValue[dataItem[attributeMasterIdType]] && dataItem.value) {
                    if(printingFieldAttributeMasterValue[dataItem[attributeMasterIdType]].code == 'Qrcode'){
                        if(!_.isEmpty(printFormatValue)){
                            printArray.push(printFormatValue)
                            printFormatValue = ``
                        } 
                        printArray.push([dataItem.value])
                    }else{
                        printFormatValue += this.printTypeFormatString(dataItem.value, printingFieldAttributeMasterValue[dataItem[attributeMasterIdType]].code) + `<line-feed />`
                    }
                }
            }
        }
        return {printArray, printFormatValue}
    }


   async preparePrintingTemplate(jobTransactionId, dataList, printingAttributeValueMap, printingFieldAttributeMasterValue, labelMap) {
        let printFormatValue = ``, printArray = [], attributeMasterIdType, attributeId, childDataObject, dataItem, arrayTemplate
        for (let id in printingAttributeValueMap) {
            if(!dataList[printingAttributeValueMap[id].name]) continue
            attributeMasterIdType = dataList[printingAttributeValueMap[id].name].data && dataList[printingAttributeValueMap[id].name].data.fieldAttributeMasterId || dataList[printingAttributeValueMap[id].name].fieldAttributeMasterId ? 'fieldAttributeMasterId' : 'jobAttributeMasterId'
            attributeId = dataList && printingAttributeValueMap[id] &&  dataList[printingAttributeValueMap[id].name] ? dataList[printingAttributeValueMap[id].name].attributeTypeId : null
            if (dataList[printingAttributeValueMap[id].name].childDataList && attributeId && attributeId == SKU_ARRAY || attributeId == ARRAY || attributeId == MONEY_COLLECT || attributeId == FIXED_SKU || attributeId == MONEY_PAY) { // case of arrayType attribute
                childDataObject = dataList[printingAttributeValueMap[id].name] ? dataList[printingAttributeValueMap[id].name].childDataList : null
                childDataObject = labelMap && printingAttributeValueMap[id].code == 'Sku' ? childDataObject[jobTransactionId].childDataList : childDataObject
                printFormatValue += `<align mode="center"><text-line size="1:0">${dataList[printingAttributeValueMap[id].name].label}</text-line><line-feed /></align>`
                arrayTemplate = this.preparePrintTemplateInCaseOfArray(childDataObject, printingFieldAttributeMasterValue, labelMap, attributeMasterIdType, printFormatValue, printArray)
                printArray = arrayTemplate.printArray
                printFormatValue = arrayTemplate.printFormatValue
            } else { // case of normal attribute
                dataItem = dataList[printingAttributeValueMap[id].name].data ? dataList[printingAttributeValueMap[id].name].data : dataList[printingAttributeValueMap[id].name]
                if (dataItem && dataItem.value && printingAttributeValueMap[id]) {
                    if(printingAttributeValueMap[id].code == 'Qrcode'){
                        if(!_.isEmpty(printFormatValue)){
                            printArray.push(printFormatValue)
                            printFormatValue = ``
                        } 
                        printArray.push([dataItem.value])
                    }else{
                        printFormatValue += this.printTypeFormatString(dataItem.value, printingAttributeValueMap[id].code) + `<line-feed />`
                    }
                }
            }
        }
        printFormatValue += `<line-feed />`
        printArray.push(printFormatValue)
        await this.printSortingData(printArray)
    }

    async printSortingData(printArray) {
        let startStr = `<?xml version="1.0" encoding="UTF-8"?><document><small><align mode="center">`
        let endStr = `</align></small></document>`, buffer
        for(let printData in printArray){
            if(printArray[printData] && printArray[printData].constructor == Array){
                await BluetoothSerial.write(String(printArray[printData][0]), 150);
            }else{
                buffer = EscPos.getBufferFromTemplate(startStr + printArray[printData] + endStr, {});
                await BluetoothSerial.write(buffer, 0);
            }
        }
    }

    createMapOfMasterIdAndPrintingObject(printingAttributeValueList, masterIdPrintingObjectMap, attributeMap, jobAttributesMap) {
        let masterIdJobAttributeMap = {}, printingAttributeValueMap = {}, labelMap = {}
        for (let item in printingAttributeValueList) {
            let masterId = printingAttributeValueList[item].name.split('[')
            masterId = (masterId[masterId.length - 1]).split(']')
            printingAttributeValueList[item].name = masterId[0]
            masterIdPrintingObjectMap[masterId[0]] = printingAttributeValueList[item]
            if (jobAttributesMap) {
                labelMap[masterId[0]] = attributeMap[masterId[0]].label
                if(jobAttributesMap[masterId[0]]) masterIdJobAttributeMap[masterId[0]] = jobAttributesMap[masterId[0]]
            }
            if (masterId[0] && ((jobAttributesMap && attributeMap[masterId[0]] && attributeMap[masterId[0]].parentId) || !attributeMap[masterId[0]])) {
                continue
            }
            printingAttributeValueMap[masterId[0]] = printingAttributeValueList[item]
        }
        return { masterIdJobAttributeMap, printingAttributeValueMap, labelMap }
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
