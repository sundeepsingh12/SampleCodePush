'use strict'

class FieldValidation {

    getFieldValidationMap(fieldValidationList) {
        let fieldValidationMap = {}
        for(let index in fieldValidationList) {
            let validationList = fieldValidationMap[fieldValidationList[index].fieldAttributeMasterId] ? fieldValidationMap[fieldValidationList[index].fieldAttributeMasterId] : []
            validationList.push(fieldValidationList[index])
            fieldValidationMap[fieldValidationList[index].fieldAttributeMasterId] = validationList
        }
        return fieldValidationMap
    }

}

export let fieldValidationService = new FieldValidation()