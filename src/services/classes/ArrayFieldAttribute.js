'use strict'
import _ from 'lodash'
import {
    ARRAY_SAROJ_FAREYE,
    OBJECT_SAROJ_FAREYE,
    AFTER,
    TEXT,
    SCAN_OR_TEXT,
    QR_SCAN,
    NUMBER,
    STRING
} from '../../lib/AttributeConstants'
import {
    INVALID_CONFIG_ERROR,
} from '../../lib/ContainerConstants'
import {
    NEXT_FOCUS,
    TABLE_FIELD_DATA,

} from '../../lib/constants'
import { fieldDataService } from '../../services/classes/FieldData'
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface.js'
import { dataStoreService } from '../../services/classes/DataStoreService'
import { fieldValidationService } from '../../services/classes/FieldValidation'
import * as realm from '../../repositories/realmdb'

class ArrayFieldAttribute {

    getSortedArrayChildElements(arrayDTO, jobTransaction, arrayReverseDataStoreFilterMap, fieldAttributeMasterId) {
        let errorMessage;
        let requiredFields = Object.values(arrayDTO.formLayoutObject).filter(arrayElement => (arrayElement.required && !arrayElement.hidden))
        if (requiredFields.length == 0) {
            errorMessage = INVALID_CONFIG_ERROR
            return { arrayRowDTO: {}, childElementsTemplate: arrayDTO, errorMessage }
        } else {
            let arrayMainObject = arrayDTO.arrayMainObject
            let arrayTemplate = _.omit(arrayDTO, ['latestPositionId', 'isSaveDisabled', 'arrayMainObject', 'sequenceWiseSortedFieldAttributesMasterIds', 'fieldAttributeMasterIdFromArray'])
            let arrayRowDTO = this.addArrayRow(0, arrayTemplate, {}, jobTransaction, arrayDTO.isSaveDisabled, arrayDTO.sequenceWiseSortedFieldAttributesMasterIds)
            // Below two lines create a map which is used in case of DSF or DataStore which have mapping with other DSF attribute 
            let cloneArrayReverseDataStoreFilterMap = _.clone(arrayReverseDataStoreFilterMap)
            cloneArrayReverseDataStoreFilterMap[fieldAttributeMasterId] = {} // create map with fieldAttributeMasterId of array as key
            return { arrayRowDTO, childElementsTemplate: arrayTemplate, errorMessage, arrayMainObject, arrayReverseDataStoreFilterMap: cloneArrayReverseDataStoreFilterMap }
        }
    }

    addArrayRow(lastRowId, childElementsTemplate, arrayElements, jobTransaction, isSaveDisabled, sequenceWiseSortedFieldAttributesMasterIds) {
        let cloneArrayElements = JSON.parse(JSON.stringify(arrayElements))
        cloneArrayElements[lastRowId] = childElementsTemplate
        cloneArrayElements[lastRowId].rowId = lastRowId
        cloneArrayElements[lastRowId].allRequiredFieldsFilled = false
        let formLayoutStateParam = { formElement: cloneArrayElements[lastRowId].formLayoutObject, isSaveDisabled, jobTransaction, fieldAttributeMasterParentIdMap: null, jobAndFieldAttributesList: null, sequenceWiseSortedFieldAttributesMasterIds, transientFormLayoutState: null };
        let sortedArrayElements = formLayoutEventsInterface.findNextFocusableAndEditableElement(null, formLayoutStateParam, null, null, NEXT_FOCUS);
        return {
            arrayElements: cloneArrayElements,
            lastRowId: (lastRowId + 1),
            isSaveDisabled: sortedArrayElements.isSaveDisabled
        }
    }

    deleteArrayRow(arrayElements, rowId) {
        let cloneArrayElements = JSON.parse(JSON.stringify(arrayElements))
        let newArrayElements = _.omit(cloneArrayElements, [rowId])
        return newArrayElements
    }

    prepareArrayForSaving(arrayElements, arrayParentItem, jobTransaction, latestPositionId, arrayMainObject) {
        let arrayChildDataList = []
        let isSaveDisabled = false
        for (let rowId in arrayElements) {
            let arrayObject = {}
            let childDataList = []
            let arrayData = arrayElements[rowId].formLayoutObject
            for (let arrayRowElement in arrayData) {
                let afterValidationResult = fieldValidationService.fieldValidations(arrayData[arrayRowElement], arrayElements[rowId].formLayoutObject, AFTER, jobTransaction)
                let isValuePresentInAnotherTransaction = (arrayData[arrayRowElement].attributeTypeId == TEXT || arrayData[arrayRowElement].attributeTypeId == SCAN_OR_TEXT || arrayData[arrayRowElement].attributeTypeId == STRING || arrayData[arrayRowElement].attributeTypeId == QR_SCAN || arrayData[arrayRowElement].attributeTypeId == NUMBER) ? this.checkforUniqueValidation(arrayData[arrayRowElement], arrayElements, rowId) : false
                arrayData[arrayRowElement].value = afterValidationResult && !isValuePresentInAnotherTransaction ? arrayData[arrayRowElement].displayValue : null
                if (arrayData[arrayRowElement].required && (!arrayData[arrayRowElement].value || arrayData[arrayRowElement].value == '')) {
                    isSaveDisabled = true
                    break
                }
                childDataList.push(arrayData[arrayRowElement])
            }
            arrayObject = {
                fieldAttributeMasterId: arrayMainObject.id,
                attributeTypeId: arrayMainObject.attributeTypeId,
                value: OBJECT_SAROJ_FAREYE,
                key: arrayMainObject.key,
                childDataList
            }
            arrayChildDataList.push(arrayObject)
        }
        arrayParentItem.value = ARRAY_SAROJ_FAREYE
        arrayParentItem.childDataList = arrayChildDataList
        let fieldDataListWithLatestPositionId = fieldDataService.prepareFieldDataForTransactionSavingInState(arrayParentItem.childDataList, jobTransaction.id, arrayParentItem.positionId, latestPositionId)
        return { fieldDataListWithLatestPositionId, isSaveDisabled }
    }

    enableSaveIfRequired(arrayElements) {
        let isSaveDisabled = false;
        if (_.isEmpty(arrayElements))
            return false
        for (let rowId in arrayElements) {
            if (!arrayElements[rowId].allRequiredFieldsFilled) {
                isSaveDisabled = true
                break
            }
        }
        return isSaveDisabled
    }

    findNextEditableAndSetSaveDisabled(attributeMasterId, cloneArrayElements, isSaveDisabled, rowId, value, fieldDataList, event, fieldAttributeMasterParentIdMap, sequenceWiseMasterIds) {
        let arrayRow = cloneArrayElements[rowId]
        let formLayoutStateParam = { formElement: arrayRow.formLayoutObject, isSaveDisabled, jobTransaction: null, fieldAttributeMasterParentIdMap, jobAndFieldAttributesList: null, sequenceWiseSortedFieldAttributesMasterIds: sequenceWiseMasterIds, transientFormLayoutState: null };
        let sortedArrayElements = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, formLayoutStateParam, value, fieldDataList, event);
        arrayRow.allRequiredFieldsFilled = (!sortedArrayElements.isSaveDisabled) ? true : false
        let _isSaveDisabled = this.enableSaveIfRequired(cloneArrayElements)
        return {
            newArrayElements: cloneArrayElements,
            isSaveDisabled: _isSaveDisabled
        }
    }

    setInitialArray(currentElement, formElement, arrayTemplate) {
        let arrayValue = formElement[currentElement.fieldAttributeMasterId]
        let arrayElements = {}
        let rowId = 0
        let arrayMainObject = arrayTemplate.arrayMainObject
        let childElementsTemplate = _.omit(arrayTemplate, ['latestPositionId', 'isSaveDisabled', 'arrayMainObject', 'sequenceWiseSortedFieldAttributesMasterIds', 'fieldAttributeMasterIdFromArray'])
        if (arrayValue.value == ARRAY_SAROJ_FAREYE && arrayValue.childDataList) {
            for (let index in arrayValue.childDataList) {
                let arrayObjectSarojFareye = arrayValue.childDataList[index].childDataList
                let formLayoutObject = {}
                for (let index in arrayObjectSarojFareye) {
                    let fieldAttribute = { ...childElementsTemplate.formLayoutObject[arrayObjectSarojFareye[index].fieldAttributeMasterId] }
                    fieldAttribute.value = fieldAttribute.displayValue = arrayObjectSarojFareye[index].value
                    fieldAttribute.editable = true
                    fieldAttribute.childDataList = arrayObjectSarojFareye[index].childDataList
                    formLayoutObject[arrayObjectSarojFareye[index].fieldAttributeMasterId] = fieldAttribute
                }
                arrayElements[rowId] = { formLayoutObject, rowId, allRequiredFieldsFilled: true }
                rowId++
            }
        }
        const arrayRowDTO = {
            arrayElements, lastRowId: rowId, isSaveDisabled: false
        }
        return { childElementsTemplate, arrayRowDTO, arrayMainObject }
    }

    checkforUniqueValidation(currentElement, arrayElements, currentRowId) {
        if (!currentElement) {
            throw new Error('fieldAttributeValue missing in currentElement')
        }
        let isValuePresentInAnotherRow = false
        if (dataStoreService.checkIfUniqueConditionExists(currentElement)) {
            let fieldDataQuery = `fieldAttributeMasterId =  ${currentElement.fieldAttributeMasterId} AND value = '${realm._encryptData(currentElement.displayValue)}'`
            let fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, fieldDataQuery, null, null)
            if (fieldDataList && fieldDataList.length >= 1) return true
            for (let rowId in arrayElements) {
                if (rowId == currentRowId)
                    continue
                if (arrayElements[rowId].formLayoutObject[currentElement.fieldAttributeMasterId].value && arrayElements[rowId].formLayoutObject[currentElement.fieldAttributeMasterId].value == currentElement.displayValue) {
                    isValuePresentInAnotherRow = true
                    break
                }
            }
        }
        return isValuePresentInAnotherRow
    }
}


export let arrayService = new ArrayFieldAttribute()
