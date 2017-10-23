import { CHECKBOX, RADIOBUTTON } from '../../lib/AttributeConstants'
class CheckBoxService {
    //FieldAttributeValueMasterId vs custom object
    //Todo refactor
    sortArrayAsc(array) {
        console.log("InsideSort")

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
        console.log("tempCheckBoxValues", tempCheckBoxValues)
        console.log("attributeTypeId", attributeTypeId)
        if (attributeTypeId == RADIOBUTTON) {
            console.log("fieldAttributeMasterId43160")
            let radioBox = Object.values(tempCheckBoxValues).filter(item => item.isChecked == true)[0]
            if (radioBox != undefined)
                radioBox.isChecked = false
        }
        //remove this
        //todo
        let checkBox = tempCheckBoxValues[id]
        console.log('tempCheckBoxValuess',tempCheckBoxValues[id])
        checkBox.isChecked = !checkBox.isChecked
        checkBox.attributeTypeId = (attributeTypeId == 9) ? 9 : 2
        console.log(checkBox)
        console.log(tempCheckBoxValues)
        return tempCheckBoxValues
    }

    checkBoxDoneButtonClicked(checkBoxValues) {
        let checkedTrueInCheckBoxArray = []
        let checkBoxValue = { ...checkBoxValues }
        checkedTrueInCheckBoxArray = Object.values(checkBoxValue).filter(item => item.isChecked == true)
        console.log("checkedTrueInCheckBoxArray")
        console.log(checkedTrueInCheckBoxArray)
        return checkedTrueInCheckBoxArray
    }

    getcheckBoxDataList(wholeDataFromMaster, fieldAttributeMasterId) {
        let checkBoxDataList = []
        console.log("ServiceCheckBoxServiceWholeData")
        console.log(wholeDataFromMaster)
        checkBoxDataList = Object.values(wholeDataFromMaster).filter(item => item.fieldAttributeMasterId == fieldAttributeMasterId)

        console.log("checkBoxDataListt")
        console.log(checkBoxDataList)
        checkBoxDataList = this.sortArrayAsc(checkBoxDataList)
        console.log("checkBoxDataListSorted")
        console.log(checkBoxDataList)
        let checkBoxDataLists = {}
        checkBoxDataLists = this.arrayToObject(checkBoxDataList)
        console.log("checkBoxDataLists",checkBoxDataLists)        
        console.log("attributeValue.isChecked")
        return checkBoxDataLists
    }

    prepareFieldDataForTransactionSavingInState(fieldDataListDTO, jobTransactionId, parentId, latestPositionId) {
        let fieldDataList = []
        for (let index in fieldDataListDTO) {
            let fieldData = {}
            fieldData.attributeTypeId = fieldDataListDTO[index].attributeTypeId
            fieldData.fieldAttributeMasterId = fieldDataListDTO[index].fieldAttributeMasterId
            fieldData.jobTransactionId = jobTransactionId
            fieldData.parentId = parentId
            fieldData.positionId = latestPositionId
            fieldData.value = fieldDataListDTO[index].code
            latestPositionId++
            if (fieldDataListDTO[index].childDataList) {
                let fieldDataDTO = this.prepareFieldDataForTransactionSavingInState(fieldDataListDTO[index].childDataList, jobTransactionId, fieldData.positionId, latestPositionId)
                fieldData.childDataList = fieldDataDTO.fieldDataList
                latestPositionId = fieldDataDTO.latestPositionId
            }
            fieldDataList.push(fieldData)
        }

        return {
            fieldDataList,
            latestPositionId
        }
    }

}

export let checkBoxDataService = new CheckBoxService()