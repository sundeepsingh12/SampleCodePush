import { CHECKBOX, RADIOBUTTON, DROPDOWN, TEXT } from '../../lib/AttributeConstants'
class selectFromListService {

    arrayToObject = (array) =>
        array.reduce((obj, item) => {
            obj[item.id] = item
            return obj
        }, {})

    setOrRemoveState(selectFromListState, id, attributeTypeId) {
        let tempSelectFromListValues = { ...selectFromListState }
        if (attributeTypeId == RADIOBUTTON || attributeTypeId == DROPDOWN) {
            let previousObject = Object.values(tempSelectFromListValues).filter(item => item.isChecked == true)[0]
            if (previousObject != undefined)
                previousObject.isChecked = false
        }

        tempSelectFromListValues[id].isChecked = !tempSelectFromListValues[id].isChecked
        tempSelectFromListValues[id].attributeTypeId = (attributeTypeId == CHECKBOX) ? TEXT : RADIOBUTTON
        return tempSelectFromListValues
    }

    selectFromListDoneButtonClicked(attributeTypeId, selectFromListState) {
        let checkedTrueInSelectFromListArray = []
        let selectFromListValue = Object.values(selectFromListState)
        if (attributeTypeId == CHECKBOX) {
            for (let item of selectFromListValue) {
                if (item.isChecked == true) {
                    let { name, code, id, fieldAttributeMasterId, sequence, isChecked } = item
                    let itemList = {
                        name,
                        value: code,
                        sequence,
                        fieldAttributeMasterId,
                        id,
                        isChecked
                    }
                    checkedTrueInSelectFromListArray.push(itemList)
                }
            }
        }
        //Radio button or drop down case
        else {
            checkedTrueInSelectFromListArray = Object.values(selectFromListValue).filter(item => item.isChecked == true)
        }
        return checkedTrueInSelectFromListArray
    }

    getListSelectFromListAttribute(fieldAttributeValueList, fieldAttributeMasterId) {
        let selectFromListData = (fieldAttributeValueList.filter(item => item.fieldAttributeMasterId == fieldAttributeMasterId))
        let selectFromListsData = {}
        selectFromListsData = this.arrayToObject(selectFromListData)
        return selectFromListsData
    }
}

export let selectFromListDataService = new selectFromListService()