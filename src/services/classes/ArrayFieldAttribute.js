'use strict'
import _ from 'lodash'
import {
    ARRAY_SAROJ_FAREYE,
    OBJECT_SAROJ_FAREYE,
    AFTER
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

    getSortedArrayChildElements(arrayDTO, jobTransaction) {
        let errorMessage;
        let requiredFields = Array.from(arrayDTO.formLayoutObject.values()).filter(arrayElement => (arrayElement.required && !arrayElement.hidden))
        if (requiredFields.length <= 0) {
            errorMessage = INVALID_CONFIG_ERROR
            return { arrayRowDTO: {}, childElementsTemplate: arrayDTO, errorMessage }
        } else {
            let arrayMainObject = arrayDTO.arrayMainObject
            let arrayTemplate = _.omit(arrayDTO, ['latestPositionId', 'isSaveDisabled', 'arrayMainObject'])
            let arrayRowDTO = this.addArrayRow(0, arrayTemplate, {}, jobTransaction, arrayDTO.isSaveDisabled)
            return { arrayRowDTO, childElementsTemplate: arrayTemplate, errorMessage, arrayMainObject }
        }
    }

    addArrayRow(lastRowId, childElementsTemplate, arrayElements, jobTransaction, isSaveDisabled) {
        let cloneArrayElements = _.cloneDeep(arrayElements)
        cloneArrayElements[lastRowId] = childElementsTemplate
        cloneArrayElements[lastRowId].rowId = lastRowId
        cloneArrayElements[lastRowId].allRequiredFieldsFilled = false
        let sortedArrayElements = formLayoutEventsInterface.findNextFocusableAndEditableElement(null, cloneArrayElements[lastRowId].formLayoutObject, isSaveDisabled, null, null, NEXT_FOCUS, jobTransaction);
        return {
            arrayElements: cloneArrayElements,
            lastRowId: (lastRowId + 1),
            isSaveDisabled: sortedArrayElements.isSaveDisabled
        }
    }

    deleteArrayRow(arrayElements, rowId, lastRowId) {
        let cloneArrayElements = _.cloneDeep(arrayElements)
        let newArrayElements = _.omit(cloneArrayElements, [rowId])
        return newArrayElements
    }

    prepareArrayForSaving(arrayElements, arrayParentItem, jobTransaction, latestPositionId, arrayMainObject) {
        let arrayChildDataList = []
        let isSaveDisabled = false
        for (let rowId in arrayElements) {
            let arrayObject = {}
            let childDataList = []
            for (let [key, arrayRowElement] of arrayElements[rowId].formLayoutObject) {
                if (arrayRowElement.value == ARRAY_SAROJ_FAREYE || arrayRowElement.value == OBJECT_SAROJ_FAREYE) {
                    let fieldDataListWithLatestPositionId = fieldDataService.prepareFieldDataForTransactionSavingInState(arrayRowElement.childDataList, jobTransaction.id, arrayRowElement.positionId, latestPositionId)
                    arrayRowElement.childDataList = fieldDataListWithLatestPositionId.fieldDataList
                    latestPositionId = fieldDataListWithLatestPositionId.latestPositionId
                }
                let afterValidationResult = fieldValidationService.fieldValidations(arrayRowElement, arrayElements[rowId].formLayoutObject, AFTER, jobTransaction)
                arrayRowElement.value = afterValidationResult && !arrayRowElement.alertMessage ? arrayRowElement.displayValue : null
                if (arrayRowElement.required && (!arrayRowElement.value || arrayRowElement.value == '')) {
                    isSaveDisabled = true
                    break
                }
                childDataList.push(arrayRowElement)
            }
            arrayObject = {
                fieldAttributeMasterId: arrayMainObject.id,
                attributeTypeId: arrayMainObject.attributeTypeId,
                value: OBJECT_SAROJ_FAREYE,
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

    findNextEditableAndSetSaveDisabled(attributeMasterId, cloneArrayElements, isSaveDisabled, rowId, value, fieldDataList, event, fieldAttributeMasterParentIdMap) {
        let arrayRow = cloneArrayElements[rowId]
        let sortedArrayElements = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, arrayRow.formLayoutObject, isSaveDisabled, value, fieldDataList, event, null, fieldAttributeMasterParentIdMap);
        arrayRow.allRequiredFieldsFilled = (!sortedArrayElements.isSaveDisabled) ? true : false
        let _isSaveDisabled = this.enableSaveIfRequired(cloneArrayElements)
        return {
            newArrayElements: cloneArrayElements,
            isSaveDisabled: _isSaveDisabled
        }
    }

    setInitialArray(currentElement, formElement, arrayTemplate) {
        let arrayValue = formElement.get(currentElement.fieldAttributeMasterId)
        let arrayElements = {}
        let rowId = 0
        let arrayMainObject = arrayTemplate.arrayMainObject
        let childElementsTemplate = _.omit(arrayTemplate, ['latestPositionId', 'isSaveDisabled', 'arrayMainObject'])
        if (arrayValue.value == ARRAY_SAROJ_FAREYE && arrayValue.childDataList) {
            for (let index in arrayValue.childDataList) {
                let arrayObjectSarojFareye = arrayValue.childDataList[index].childDataList
                let formLayoutObject = new Map()
                let arrayRow = {}
                for (let index in arrayObjectSarojFareye) {
                    let fieldAttribute = { ...childElementsTemplate.formLayoutObject.get(arrayObjectSarojFareye[index].fieldAttributeMasterId) }
                    fieldAttribute.value = fieldAttribute.displayValue = arrayObjectSarojFareye[index].value
                    fieldAttribute.editable = true
                    fieldAttribute.childDataList = arrayObjectSarojFareye[index].childDataList
                    formLayoutObject.set(arrayObjectSarojFareye[index].fieldAttributeMasterId, fieldAttribute)
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
                if (arrayElements[rowId].formLayoutObject.get(currentElement.fieldAttributeMasterId).value && arrayElements[rowId].formLayoutObject.get(currentElement.fieldAttributeMasterId).value == currentElement.displayValue) {
                    isValuePresentInAnotherRow = true
                    break
                }
            }
        }
        return isValuePresentInAnotherRow
    }
}


export let arrayService = new ArrayFieldAttribute()
