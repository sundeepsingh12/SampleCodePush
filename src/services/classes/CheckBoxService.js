
class CheckBoxService {
    //FieldAttributeValueMasterId vs custom object

sortArrayAsc(array) {
        console.log("InsideSort")
        
        return array.sort(function (a, b) {
            console.info(b.sequence)
            return b.sequence < a.sequence ? 1
                : b.sequence > a.sequence ? -1
                    : 0
        })
    }

    setOrRemoveState(checkBoxValues,id){
            let tempCheckBoxValues = {...checkBoxValues}
            console.log(tempCheckBoxValues)

            if(Object.values(tempCheckBoxValues)[0].fieldAttributeMasterId == 43160){
            console.log("fieldAttributeMasterId43160")   
            let radioBox = Object.values(tempCheckBoxValues).filter(item => item.isChecked == true )[0]             
            if(radioBox != undefined)    
            radioBox.isChecked = false
            }

            let checkBox = Object.values(tempCheckBoxValues).filter(item => item.id == id)[0]
            checkBox.isChecked = !checkBox.isChecked
            console.log(checkBox)
            console.log(tempCheckBoxValues)
            return tempCheckBoxValues
    }

    checkBoxDoneButtonClicked(checkBoxValues){
         let checkedTrueInCheckBoxArray = []
            let checkBoxValue = {...checkBoxValues}
            checkedTrueInCheckBoxArray = Object.values(checkBoxValue).filter(item => item.isChecked == true)
            console.log("checkedTrueInCheckBoxArray")
            console.log(checkedTrueInCheckBoxArray)
            return checkedTrueInCheckBoxArray
    }

    getcheckBoxDataList(wholeDataFromMaster, fieldAttributeMasterId) {
        let checkBoxDataList = {}
        console.log("ServiceCheckBoxServiceWholeData")
        console.log(wholeDataFromMaster)
        let i = 0
        for (let list in wholeDataFromMaster) {
            let attributeValue = wholeDataFromMaster[list]
            if (attributeValue.fieldAttributeMasterId == fieldAttributeMasterId) {
                attributeValue.isChecked = false
                checkBoxDataList[attributeValue.id] = attributeValue
                console.log(attributeValue)
            }
        }
        console.log("checkBoxDataList")
        console.log(checkBoxDataList)
        checkBoxDataList = this.sortArrayAsc(Object.values(checkBoxDataList))
        console.log("checkBoxDataListSorted")
        console.log(checkBoxDataList)
        console.log("attributeValue.isChecked")
        return checkBoxDataList
    }

}

export let checkBoxDataLists = new CheckBoxService()