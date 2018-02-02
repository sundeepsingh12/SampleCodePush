import {
    CHECKBOX,
    RADIOBUTTON,
    DROPDOWN,
    TEXT,
    OPTION_RADIO_KEY,
    OPTION_RADIO_VALUE,
    OPTION_RADIO_FOR_MASTER
} from '../../lib/AttributeConstants'
import * as realm from '../../repositories/realmdb'

class MultipleOptionsAttribute {

    changeOptionStatus(optionList, selectedOptionsMap) {
        let optionMap = {}
        for (let index in optionList) {
            optionMap[optionList[index].id] = optionList[index]
            if (selectedOptionsMap[optionList[index].code]) {
                optionMap[optionList[index].id].selected = true
            } else {
                optionMap[optionList[index].id].selected = false
            }
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
                fieldAttributeMasterId: optionMap[index].fieldAttributeMasterId,
                value: optionMap[index].code
            })
        }
        return optionFieldDataList
    }

    getOptionsListForJobData(childMap, currentElement) {
        let jobQuery
        for(let index in childMap) {
            jobQuery = `jobAttributeMasterId = ${childMap[index].jobAttributeMasterId}`
        }
        
    }

}

export let multipleOptionsAttributeService = new MultipleOptionsAttribute()