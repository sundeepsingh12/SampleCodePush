import { CHECKBOX, RADIOBUTTON, DROPDOWN, TEXT } from '../../lib/AttributeConstants'
class SelectFromListService {

    arrayToObject = (array) =>
        array.reduce((obj, item) => {
            obj[item.id] = item
            return obj
        }, {})

    setOrRemoveState(selectFromListState, id, attributeTypeId) {
        let tempSelectFromListValues = { ...selectFromListState }
        if (attributeTypeId == RADIOBUTTON || attributeTypeId == DROPDOWN) {
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
        //Radio button or drop down case
        return checkedTrueInSelectFromListArray
    }

    getListSelectFromListAttribute(fieldAttributeValueList, fieldAttributeMasterId) {
        let selectFromListData = (fieldAttributeValueList.filter(item => item.fieldAttributeMasterId == fieldAttributeMasterId))
        let selectFromListsData = {}
        selectFromListsData = this.arrayToObject(selectFromListData)
        return selectFromListsData
    }
}

export let selectFromListDataService = new SelectFromListService()