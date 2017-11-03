import { CHECKBOX, RADIOBUTTON, DROPDOWN, TEXT, OPTION_RADIO_KEY, OPTION_RADIO_VALUE ,OPTION_RADIO_FOR_MASTER } from '../../lib/AttributeConstants'
import * as realm from '../../repositories/realmdb'
const {
    FIELD_ATTRIBUTE,
    FIELD_ATTRIBUTE_STATUS,
    TABLE_JOB_DATA
} = require('../../lib/constants').default
import {jobDataService} from './JobData'
import {
    keyValueDBService
} from './KeyValueDBService'
class SelectFromListService {

    arrayToObject = (array) =>
        array.reduce((obj, item) => {
            obj[item.id] = item
            return obj
        }, {})

    setOrRemoveState(selectFromListState, id, attributeTypeId) {
        let tempSelectFromListValues = { ...selectFromListState }
        if (attributeTypeId == RADIOBUTTON || attributeTypeId == DROPDOWN || attributeTypeId == OPTION_RADIO_FOR_MASTER) {
            let previousObject = Object.values(tempSelectFromListValues).filter(item => item.isChecked == true)[0]
            if (previousObject != undefined || previousObject != null)
                previousObject.isChecked = false
        }
        tempSelectFromListValues[id].isChecked = !tempSelectFromListValues[id].isChecked
        if (attributeTypeId == CHECKBOX) {
            tempSelectFromListValues[id].attributeTypeId = TEXT
        } else if (attributeTypeId == RADIOBUTTON) {
            tempSelectFromListValues[id].attributeTypeId = RADIOBUTTON
        } else if (attributeTypeId == DROPDOWN) {
            tempSelectFromListValues[id].attributeTypeId = DROPDOWN
        }
        return tempSelectFromListValues
    }

    selectFromListDoneButtonClicked(attributeTypeId, selectFromListState) {
        let checkedTrueInSelectFromListArray = []
        
        if(attributeTypeId == OPTION_RADIO_FOR_MASTER){
            let selectFromListValue = Object.values(selectFromListState.selectFromListData)
            for (let list of selectFromListValue) {
                if (list.isChecked == true) {
                    selectFromListState.fieldAttributeMasterList.jobFieldAttributeMapId.forEach((item) => {
                        let itemList = {}
                        itemList.fieldAttributeMasterId = item.id,
                        itemList.attributeTypeId = item.attributeTypeId,
                        itemList.key = item.key,
                        itemList.value = (item.attributeTypeId == OPTION_RADIO_KEY) ? list.optionKey : list.optionValue,
                        itemList.id = selectFromListState.id,
                        itemList.isChecked = true
                        checkedTrueInSelectFromListArray.push(itemList)
                    })

                }
            }
        
        }else {
            let selectFromListValue = Object.values(selectFromListState)
            for (let item of selectFromListValue) {
                if (item.isChecked == true) {
                    let itemList = {
                        name: item.name,
                        value: item.code,
                        sequence: item.sequence,
                        fieldAttributeMasterId: item.fieldAttributeMasterId,
                        id: item.id,
                        isChecked: item.isChecked
                    }
                    checkedTrueInSelectFromListArray.push(itemList)
                }
            }
        }
        //Radio button or drop down case
        return checkedTrueInSelectFromListArray
    }

    getListSelectFromListAttribute(fieldAttributeValueList, fieldAttributeMasterId) {
        let selectFromListData = (fieldAttributeValueList.filter(item => item.fieldAttributeMasterId == fieldAttributeMasterId))
        let selectFromListsData = {}
        selectFromListsData = this.arrayToObject(selectFromListData)
        return selectFromListsData
    }

    async getRadioForMasterDto(fieldAttributeMasterId) {
        const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
        let jobFieldAttributeMapId = new Map()
        if (!fieldAttributeMasterList || !fieldAttributeMasterList.value) {
            throw new Error('Field Attributes missing in store')
        }
        const objectFieldAttribute = fieldAttributeMasterList.value.filter(fieldAttributeObject => fieldAttributeObject.parentId == fieldAttributeMasterId &&
            fieldAttributeObject.attributeTypeId == 11)

        fieldAttributeMasterList.value.filter(fieldAttributeObject => fieldAttributeObject.parentId == objectFieldAttribute[0].id)
            .forEach(fieldAttribute => {
                const id = (fieldAttribute.jobAttributeMasterId == 0 || fieldAttribute.jobAttributeMasterId == null) ?fieldAttribute.attributeTypeId : fieldAttribute.jobAttributeMasterId
                if(fieldAttribute.attributeTypeId == OPTION_RADIO_VALUE){
                    jobFieldAttributeMapId.set(id,fieldAttribute)
                }else if(fieldAttribute.attributeTypeId == OPTION_RADIO_KEY){
                    jobFieldAttributeMapId.set(id,fieldAttribute)
                }
            })
             radioMasterDto = {
                jobFieldAttributeMapId,
                objectFieldAttribute
            }
        return radioMasterDto
    }

    getListDataForRadioMasterAttr(jobFieldAttributeMapId,jobId){
        let query = Array.from(jobFieldAttributeMapId.keys()).map(jobAttributeId => `jobAttributeMasterId = ${jobAttributeId}`).join(' OR ')
        query = `(${query}) AND jobId = ${jobId}`
        const jobDatas = realm.getRecordListOnQuery(TABLE_JOB_DATA, query)
        const parentIdJobDataListMap = jobDataService.getParentIdJobDataListMap(jobDatas)
        let radioMasterObjectDto = {}, increment = 0 , innerArray = []
            for (let id in parentIdJobDataListMap) {
                let  object = {
                       id : increment++ ,
                       optionKey: jobFieldAttributeMapId.get(parentIdJobDataListMap[id][1].jobAttributeMasterId).attributeTypeId == OPTION_RADIO_KEY ? parentIdJobDataListMap[id][1].value : parentIdJobDataListMap[id][0].value,
                       optionValue: jobFieldAttributeMapId.get(parentIdJobDataListMap[id][0].jobAttributeMasterId).attributeTypeId == OPTION_RADIO_VALUE ? parentIdJobDataListMap[id][0].value : parentIdJobDataListMap[id][1].value,
                }
                 innerArray.push(object)
            }
        radioMasterObjectDto = this.arrayToObject(innerArray)
        return radioMasterObjectDto;
    }
}

export let selectFromListDataService = new SelectFromListService()