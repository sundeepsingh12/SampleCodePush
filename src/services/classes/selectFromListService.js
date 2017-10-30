import { CHECKBOX, RADIOBUTTON } from '../../lib/AttributeConstants'
class selectFromListService {
    sortArrayInAscending(array) {
        return array.sort((a, b) => {
            console.info(b.sequence)
            return b.sequence < a.sequence ? 1
                : b.sequence > a.sequence ? -1
                    : 0
        })
    }

    arrayToObject = (array) =>
        array.reduce((obj, item) => {
            obj[item.id] = item
            return obj
        }, {})

    setOrRemoveState(checkBoxValues, id, attributeTypeId) {
        let tempCheckBoxValues = { ...checkBoxValues }
        if (attributeTypeId == RADIOBUTTON) {
            let radioBox = Object.values(tempCheckBoxValues).filter(item => item.isChecked == true)[0]
            if (radioBox != undefined)
                radioBox.isChecked = false
        }

        let checkBox = tempCheckBoxValues[id]
        checkBox.isChecked = !checkBox.isChecked
        checkBox.attributeTypeId = (attributeTypeId == CHECKBOX) ? 2 : 9
        console.log('tempCheckBoxValues', tempCheckBoxValues)        
        return tempCheckBoxValues
    }

    checkBoxDoneButtonClicked(attributeTypeId,checkBoxValues) {
        let checkedTrueInCheckBoxArray = []
        let checkBoxValue = { ...checkBoxValues }
        if(attributeTypeId == CHECKBOX){
        for (let item of Object.values(checkBoxValue)) {
            if(item.isChecked == true){
                let { name, code, id, fieldAttributeMasterId, sequence, isChecked } = item
                let itemList = {
                    name: name,
                    value: code,
                    sequence: sequence,
                    fieldAttributeMasterId: fieldAttributeMasterId,
                    id: id,
                    isChecked: isChecked
                }
                checkedTrueInCheckBoxArray.push(itemList)
        }
        }
        } else {
        checkedTrueInCheckBoxArray = Object.values(checkBoxValue).filter(item => item.isChecked == true)     
        }
        console.log("checkedTrueInCheckBoxArray",checkedTrueInCheckBoxArray)
        return checkedTrueInCheckBoxArray
    }

    getcheckBoxDataList(fieldAttributeValueList, fieldAttributeMasterId) {
        let checkBoxDataList = []
        checkBoxDataList = Object.values(fieldAttributeValueList).filter(item => item.fieldAttributeMasterId == fieldAttributeMasterId)
        checkBoxDataList = this.sortArrayInAscending(checkBoxDataList)
        let checkBoxDataLists = {}
        checkBoxDataLists = this.arrayToObject(checkBoxDataList)
        console.log("checkBoxDataLists", checkBoxDataLists)
        return checkBoxDataLists
    }

}

export let selectFromListDataService = new selectFromListService()