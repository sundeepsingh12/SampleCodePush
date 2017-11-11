'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import _ from 'lodash'
import { formLayoutService } from './formLayout/FormLayout'
import {
    OBJECTSAROJFAREYE,
    ARRAYSAROJFAREYE
} from '../../lib/AttributeConstants'
import { fieldDataService } from '../../services/classes/FieldData'

class ArrayFieldAttribute {
    async getSortedArrayChildElements(statusId, fieldAttributeMasterId, lastRowId, arrayElements) {
        if (_.isEmpty(arrayElements)) {
            let arrayDTO = await formLayoutService.getSequenceWiseRootFieldAttributes(statusId, fieldAttributeMasterId)
            console.log('arraydto', arrayDTO)
            let arrayRowDTO = await this.addArrayRow(lastRowId, arrayDTO, arrayElements)
            return { arrayRowDTO, childElementsTemplate: arrayDTO }
        }
    }

    addArrayRow(lastRowId, childElementsTemplate, arrayElements) {
        let cloneArrayElements = _.cloneDeep(arrayElements)
        cloneArrayElements[lastRowId] = childElementsTemplate
        cloneArrayElements[lastRowId].rowId = lastRowId
        return { arrayElements: cloneArrayElements, lastRowId: (lastRowId + 1), isSaveDisabled: true }
    }

    deleteArrayRow(arrayElements, rowId, lastRowId, isSaveDisabled) {
        let cloneArrayElements = _.cloneDeep(arrayElements)
        let newArrayElements = _.omit(cloneArrayElements, [rowId])
        if ((rowId == lastRowId - 1) || _.isEmpty(newArrayElements))
            isSaveDisabled = false
        return { newArrayElements, isSaveDisabled }
    }
    prepareArrayForSaving(arrayElements, arrayParentItem, jobTransactionId, latestPositionId) {
        let cloneArrayElements = _.cloneDeep(arrayElements)
        let arrayChildDataList = []
        for (let rowId in cloneArrayElements) {
            let arrayObject = {}
            let childDataList = []
            for (let [key, arrayRowElement] of cloneArrayElements[rowId].formLayoutObject) {
                childDataList.push({ fieldAttributeMasterId: arrayRowElement.fieldAttributeMasterId, attributeTypeId: arrayRowElement.attributeTypeId, value: arrayRowElement.value })
            }
            arrayObject = {
                fieldAttributeMasterId: cloneArrayElements[rowId].arrayMainObject.id,
                attributeTypeId: cloneArrayElements[rowId].arrayMainObject.attributeTypeId,
                value: OBJECTSAROJFAREYE,
                childDataList
            }
            // cloneArrayElements[rowId].childDataList = arrayObject
            arrayChildDataList.push(arrayObject)
        }
        arrayParentItem.value = ARRAYSAROJFAREYE
        arrayParentItem.childDataList = arrayChildDataList
        let fieldDataListWithLatestPositionId = fieldDataService.prepareFieldDataForTransactionSavingInState(arrayParentItem.childDataList, jobTransactionId, arrayParentItem.positionId, latestPositionId)
        return fieldDataListWithLatestPositionId
    }
}
export let arrayService = new ArrayFieldAttribute()
