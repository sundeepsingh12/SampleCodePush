import { CHECKBOX, RADIOBUTTON, DROPDOWN, TEXT, OPTION_RADIO_KEY, OPTION_RADIO_VALUE ,OPTION_RADIO_FOR_MASTER } from '../../lib/AttributeConstants'

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
            let selectFromListValue = Object.values(selectFromListState.selectListData)
            for (let list of selectFromListValue) {
                if (list.isChecked == true) {
                    selectFromListState.radioMasterDto.forEach((item) => {
                        let itemList = {}
                        itemList.fieldAttributeMasterId = item.id,
                        itemList.attributeTypeId = item.attributeTypeId,
                        itemList.value = (item.attributeTypeId == OPTION_RADIO_KEY) ? list.optionKey : list.optionValue,
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

    /** return radioMasterDto which has 40 and 41 attributeTypeId as child
     * 
     getRadioForMasterDto(fieldAttributeMasterId,fieldAttributeMasterList) {
     * @param {*} fieldAttributeValueList 
     * @param {*} fieldAttributeMasterId 
     * 
     */

     getRadioForMasterDto(fieldAttributeMasterId,fieldAttributeMasterList) {
        let radioMasterDto = []
        const objectFieldAttribute = fieldAttributeMasterList.value.filter(fieldAttributeObject => fieldAttributeObject.parentId == fieldAttributeMasterId)

        fieldAttributeMasterList.value.filter(fieldAttributeObject => fieldAttributeObject.parentId == objectFieldAttribute[0].id)
            .forEach(fieldAttribute => {
                if(fieldAttribute.attributeTypeId == OPTION_RADIO_VALUE || fieldAttribute.attributeTypeId == OPTION_RADIO_KEY){
                    const fieldData = { 
                        id: fieldAttribute.id,
                        jobAttributeMasterId : fieldAttribute.jobAttributeMasterId,
                        attributeTypeId : fieldAttribute.attributeTypeId
                    }
                    radioMasterDto.push(fieldData)
                }
            })
        return radioMasterDto
    }
    /** return array of jobdata mapped with optionRadioMaster
     * 
      getListDataForRadioMasterAttr(parentIdJobDataListMap,currentElement) {
     * @param {*} parentIdJobDataListMap 
     * @param {*} currentElement 
     * 
     * 
     */

    getListDataForRadioMasterAttr(parentIdJobDataListMap,currentElement){
        let  increment = 0 , innerObject = {}, value, key
        if(currentElement.childDataList != null && currentElement.childDataList.length > 0){
            value = (currentElement.childDataList[0].attributeTypeId == OPTION_RADIO_VALUE) ? currentElement.childDataList[0].value : currentElement.childDataList[1].value
            key = (currentElement.childDataList[0].attributeTypeId == OPTION_RADIO_KEY) ? currentElement.childDataList[0].value : currentElement.childDataList[1].value
        }
            for (let id in parentIdJobDataListMap) {
                if(parentIdJobDataListMap[id].length == 2){
                    let  object = {
                        id : increment,
                        optionKey: parentIdJobDataListMap[id][1].attributeTypeId == OPTION_RADIO_KEY ? parentIdJobDataListMap[id][1].value :  parentIdJobDataListMap[id][0].value ,
                        optionValue:parentIdJobDataListMap[id][0].attributeTypeId == OPTION_RADIO_VALUE ? parentIdJobDataListMap[id][0].value :parentIdJobDataListMap[id][1].value ,
                    }
                    if(value != undefined && object.optionKey == key && object.optionValue ==  value){
                        object.isChecked = true;    
                        value = undefined
                    }
                    innerObject[increment++] = object
                }
            }
        return innerObject;
    }
}

export let selectFromListDataService = new SelectFromListService()