import {
    OPTION_RADIO_KEY,
    OPTION_RADIO_VALUE,
    OPTION_RADIO_FOR_MASTER
} from '../../lib/AttributeConstants'
import {
    TABLE_JOB_DATA
} from '../../lib/constants'
import * as realm from '../../repositories/realmdb'

class MultipleOptionsAttribute {

    changeOptionStatus(optionList, selectedOptionsMap) {
        let optionMap = {};
        for (let index in optionList) {
            optionMap[optionList[index].id] = optionList[index];
            optionMap[optionList[index].id].selected = selectedOptionsMap[optionList[index].code] ? true : false;
        }
        return optionMap
    }

    prepareOptionFieldData(optionMap, currentElement) {
        let optionFieldDataList = []
        for (let index in optionMap) {
            if (!optionMap[index].selected) {
                continue
            }
            optionFieldDataList.push({
                attributeTypeId: 1,
                fieldAttributeMasterId: optionMap[index].fieldAttributeMasterId,
                value: optionMap[index].code,
                key: currentElement.key
            })
        }
        return optionFieldDataList
    }

    getOptionsListForJobData(fieldAttributeMasterChildList, currentElement, jobTransaction, selectedOption) {
        let jobQuery, keyFieldAttribute, valueFieldAttribute
        let optionMap = {}
        for (let index in fieldAttributeMasterChildList) {
            if (!fieldAttributeMasterChildList[index].jobAttributeMasterId) {
                continue
            }
            jobQuery = jobQuery ? jobQuery + ` OR jobAttributeMasterId = ${fieldAttributeMasterChildList[index].jobAttributeMasterId}` : `jobAttributeMasterId = ${fieldAttributeMasterChildList[index].jobAttributeMasterId}`
            if (fieldAttributeMasterChildList[index].attributeTypeId == OPTION_RADIO_KEY) {
                keyFieldAttribute = fieldAttributeMasterChildList[index]
            } else if (fieldAttributeMasterChildList[index].attributeTypeId == OPTION_RADIO_VALUE) {
                valueFieldAttribute = fieldAttributeMasterChildList[index]
            }
        }
        jobQuery = jobQuery ? `jobId = ${jobTransaction.jobId} AND (${jobQuery})` : null
        let jobData = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobQuery)
        for (let index in jobData) {
            let optionObject
            const { parentId, jobAttributeMasterId, value } = jobData[index]
            if (optionMap[parentId]) {
                optionObject = optionMap[parentId]
            } else {
                optionObject = {}
                optionObject.id = parentId
            }
            if (jobAttributeMasterId == keyFieldAttribute.jobAttributeMasterId) {
                optionObject.keyFieldAttributeMaster = keyFieldAttribute
                optionObject.code = value
            } else if (jobAttributeMasterId == valueFieldAttribute.jobAttributeMasterId) {
                optionObject.valueFieldAttributeMaster = valueFieldAttribute
                optionObject.name = value
                optionObject.selected = selectedOption == value
            }
            optionMap[parentId] = optionObject
        }
        return optionMap
    }

    prepareOptionFieldDataFromJobData(item) {
        let optionFieldDataList = []
        let optionKeyFieldData = {
            attributeTypeId: item.keyFieldAttributeMaster ? item.keyFieldAttributeMaster.attributeTypeId : null,
            fieldAttributeMasterId: item.keyFieldAttributeMaster.id,
            value: item.code,
            key: item.keyFieldAttributeMaster && item.keyFieldAttributeMaster.key ? item.keyFieldAttributeMaster.key : null
        }
        let optionValueFieldData = {
            attributeTypeId: item.valueFieldAttributeMaster ? item.valueFieldAttributeMaster.attributeTypeId : null,
            fieldAttributeMasterId: item.valueFieldAttributeMaster.id,
            value: item.name,
            key: item.valueFieldAttributeMaster && item.valueFieldAttributeMaster.key ? item.valueFieldAttributeMaster.key : null
        }
        optionFieldDataList.push(optionKeyFieldData, optionValueFieldData)
        return optionFieldDataList
    }

}

export let multipleOptionsAttributeService = new MultipleOptionsAttribute()