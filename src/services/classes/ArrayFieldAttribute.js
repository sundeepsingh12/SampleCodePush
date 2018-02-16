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
    getSortedArrayChildElements(arrayDTO, jobTransaction) {
        let errorMessage;
        let requiredFields = Array.from(arrayDTO.formLayoutObject.values()).filter(arrayElement => (arrayElement.required && !arrayElement.hidden))
        if (requiredFields.length <= 0) {
            errorMessage = INVALID_CONFIG_ERROR
            return { arrayRowDTO: {}, childElementsTemplate: arrayDTO, errorMessage }
        } else {
            let arrayMainObject = arrayDTO.arrayMainObject
            let arrayTemplate = _.omit(arrayDTO, ['latestPositionId', 'isSaveDisabled', 'arrayMainObject'])
            let arrayRowDTO = this.addArrayRow(0, arrayTemplate, {}, jobTransaction)
            return { arrayRowDTO, childElementsTemplate: arrayTemplate, errorMessage, arrayMainObject }
        }
    }

    addArrayRow(lastRowId, childElementsTemplate, arrayElements, jobTransaction) {
        let cloneArrayElements = _.cloneDeep(arrayElements)
        cloneArrayElements[lastRowId] = childElementsTemplate
        cloneArrayElements[lastRowId].rowId = lastRowId
        cloneArrayElements[lastRowId].allRequiredFieldsFilled = false
        let sortedArrayElements = formLayoutEventsInterface.findNextFocusableAndEditableElement(null, cloneArrayElements[lastRowId].formLayoutObject, true, null, null, NEXT_FOCUS, jobTransaction);
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
    prepareArrayForSaving(arrayElements, arrayParentItem, jobTransactionId, latestPositionId, arrayMainObject) {
        let arrayChildDataList = []
        let isSaveDisabled = false
        for (let rowId in arrayElements) {
            let arrayObject = {}
            let childDataList = []
            for (let [key, arrayRowElement] of arrayElements[rowId].formLayoutObject) {
                if (arrayRowElement.value == ARRAY_SAROJ_FAREYE || arrayRowElement.value == OBJECT_SAROJ_FAREYE) {
                    let fieldDataListWithLatestPositionId = fieldDataService.prepareFieldDataForTransactionSavingInState(arrayRowElement.childDataList, jobTransactionId, arrayRowElement.positionId, latestPositionId)
                    arrayRowElement.childDataList = fieldDataListWithLatestPositionId.fieldDataList
                    latestPositionId = fieldDataListWithLatestPositionId.latestPositionId
                }
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
        let fieldDataListWithLatestPositionId = fieldDataService.prepareFieldDataForTransactionSavingInState(arrayParentItem.childDataList, jobTransactionId, arrayParentItem.positionId, latestPositionId)
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
}

export let arrayService = new ArrayFieldAttribute()
