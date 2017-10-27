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

    fieldValidations(currentElement, formElement, timeOfExecution) {
        let validationList = currentElement.validation ? currentElement.validation.filter(validationObject => validationObject.timeOfExecution == timeOfExecution) : null
        console.log('fieldValidations', validationList)
        let validationMapObject = this.prepareValidationReferenceMap(validationList)
        let validationStringList = this.prepareValidationStringList(validationMapObject.validationReferenceMap)
        console.log('validationStringList', validationStringList)
        this.evaluateValidationList(validationStringList, validationMapObject.validationMap, '||')
    }

    prepareValidationReferenceMap(validationList) {
        let validationReferenceMap = {},
            validationMap = {}
        for (let index in validationList) {
            validationMap[validationList[index].id] = validationList[index]
            let key = validationList[index].referenceId ? validationList[index].referenceId : 'root'
            if (key == 'root') {
                validationReferenceMap[key] = validationReferenceMap[key] ? validationReferenceMap[key] : []
                validationReferenceMap[key].push(validationList[index].id)
            } else {
                validationReferenceMap[key] = {}
                validationReferenceMap[key].operator = validationList[index].operator
                validationReferenceMap[key].id = validationList[index].id
            }
        }
        console.log('prepareValidationReferenceMap validationReferenceMap', validationReferenceMap)
        console.log('prepareValidationReferenceMap validationMap', validationMap)
        return {
            validationMap,
            validationReferenceMap
        }
    }

    prepareValidationStringList(validationReferenceMap) {
        let validationStringList = []
        for (let index in validationReferenceMap['root']) {
            validationStringList.push(validationReferenceMap['root'][index] + this.addOperatorAndValidationId(validationReferenceMap[validationReferenceMap['root'][index]], validationReferenceMap))
        }
        return validationStringList
    }

    addOperatorAndValidationId(validationReferenceObject, validationReferenceMap) {
        return validationReferenceObject ? validationReferenceObject.operator + validationReferenceObject.id + this.addOperatorAndValidationId(validationReferenceMap[validationReferenceObject.id], validationReferenceMap) : ''
    }

    evaluateValidationList(validationList, validationMap, splitOperator) {
        let result
        for (let index in validationList) {
            let splitValidation = splitOperator ? validationList[index].split(splitOperator) : validationList[index]
            if (splitOperator == '||' && splitValidation.length > 1) {
                result = this.evaluateValidationList(splitValidation, validationMap, '&&')
                if (result) {
                    break;
                }
            } else if(splitOperator == '&&' && splitValidation.length > 1) {
                result = this.evaluateValidationList(splitValidation, validationMap, null)
                if (!result) {
                    break
                }
            } else {
                result = this.runValidations(splitValidation)
            }
        }
        return result
    }

    runValidations(validation) {
        return true
    }

}

export let fieldValidationService = new FieldValidation()