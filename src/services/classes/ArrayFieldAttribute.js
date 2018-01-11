'use strict'
import _ from 'lodash'
import {
    ARRAY_SAROJ_FAREYE,
    OBJECT_SAROJ_FAREYE,
    INVALID_CONFIG_ERROR
} from '../../lib/AttributeConstants'
import {
    NEXT_FOCUS,
} from '../../lib/constants'
import { fieldDataService } from '../../services/classes/FieldData'
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface.js'

class ArrayFieldAttribute {
    getSortedArrayChildElements(lastRowId, arrayElements, arrayDTO) {
        if (_.isEmpty(arrayElements)) {
            let errorMessage;
            let requiredFields = Array.from(arrayDTO.formLayoutObject.values()).filter(arrayElement => (arrayElement.required && !arrayElement.hidden))
            if (requiredFields.length <= 0) {
                errorMessage = INVALID_CONFIG_ERROR
                return { arrayRowDTO: {}, childElementsTemplate: arrayDTO, errorMessage }
            } else {
                let arrayRowDTO = this.addArrayRow(lastRowId, arrayDTO, arrayElements)
                return { arrayRowDTO, childElementsTemplate: arrayDTO, errorMessage }
            }
        }
        return
    }

    addArrayRow(lastRowId, childElementsTemplate, arrayElements) {
        let cloneArrayElements = _.cloneDeep(arrayElements)
        cloneArrayElements[lastRowId] = childElementsTemplate
        cloneArrayElements[lastRowId].rowId = lastRowId
        cloneArrayElements[lastRowId].allRequiredFieldsFilled = false
        return {
            arrayElements: cloneArrayElements,
            lastRowId: (lastRowId + 1),
            isSaveDisabled: true
        }
    }

    deleteArrayRow(arrayElements, rowId, lastRowId) {
        let cloneArrayElements = _.cloneDeep(arrayElements)
        let newArrayElements = _.omit(cloneArrayElements, [rowId])
        return newArrayElements
    }
    prepareArrayForSaving(arrayElements, arrayParentItem, jobTransactionId, latestPositionId) {
        let arrayChildDataList = []
        for (let rowId in arrayElements) {
            let arrayObject = {}
            let childDataList = []
            for (let [key, arrayRowElement] of arrayElements[rowId].formLayoutObject) {
                childDataList.push({ fieldAttributeMasterId: arrayRowElement.fieldAttributeMasterId, attributeTypeId: arrayRowElement.attributeTypeId, value: arrayRowElement.value })
            }
            arrayObject = {
                fieldAttributeMasterId: arrayElements[rowId].arrayMainObject.id,
                attributeTypeId: arrayElements[rowId].arrayMainObject.attributeTypeId,
                value: OBJECT_SAROJ_FAREYE,
                childDataList
            }
            arrayChildDataList.push(arrayObject)
        }
        arrayParentItem.value = ARRAY_SAROJ_FAREYE
        arrayParentItem.childDataList = arrayChildDataList
        let fieldDataListWithLatestPositionId = fieldDataService.prepareFieldDataForTransactionSavingInState(arrayParentItem.childDataList, jobTransactionId, arrayParentItem.positionId, latestPositionId)
        return fieldDataListWithLatestPositionId
    }
    enableSaveIfRequired(arrayElements) {
        let isSaveDisabled = false;
        if (_.isEmpty(arrayElements))
            return false
        for (let rowId in arrayElements) {
            if (!arrayElements[rowId].allRequiredFieldsFilled) {
                isSaveDisabled = true
            }
        }
        return isSaveDisabled
    }
    findNextEditableAndSetSaveDisabled(attributeMasterId, arrayElements, isSaveDisabled, rowId, value, fieldDataList, event) {
        let cloneArrayElements = _.cloneDeep(arrayElements)
        let arrayRow = cloneArrayElements[rowId]
        arrayRow.formLayoutObject.get(attributeMasterId).displayValue = value
        arrayRow.formLayoutObject.get(attributeMasterId).value = value
        let sortedArrayElements = formLayoutEventsInterface.findNextFocusableAndEditableElement(attributeMasterId, arrayRow.formLayoutObject, isSaveDisabled, value, fieldDataList, event);
        arrayRow.allRequiredFieldsFilled = (!sortedArrayElements.isSaveDisabled) ? true : false
        let _isSaveDisabled = this.enableSaveIfRequired(cloneArrayElements)
        return {
            newArrayElements: cloneArrayElements,
            isSaveDisabled: _isSaveDisabled
        }
    }
}

export let arrayService = new ArrayFieldAttribute()
