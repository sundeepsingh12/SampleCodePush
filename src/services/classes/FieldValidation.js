'use strict'
import * as realm from '../../repositories/realmdb'
import {
    TABLE_JOB_DATA
} from '../../lib/constants'
import moment from 'moment'
import { fieldAttributeMasterService } from './FieldAttributeMaster'

import {
    AFTER,
    ALERT_MESSAGE,
    ARRAY_SAROJ_FAREYE,
    ASSIGN,
    ASSIGN_BY_MATHEMATICAL_FORMULA,
    ASSIGN_DATE_TIME,
    AVERAGE,
    BEFORE,
    CONCATENATE,
    DATE,
    DATE_COMPARATOR,
    ELSE,
    EQUAL_TO,
    CONTAINS,
    GREATER_THAN,
    GREATER_THAN_OR_EQUAL_TO,
    LESS_THAN,
    LESS_THAN_OR_EQUAL_TO,
    MAX,
    MIN,
    NOT_EQUAL_TO,
    OBJECT_SAROJ_FAREYE,
    RE_ATTEMPT_DATE,
    REGEX,
    REQUIRED_FALSE,
    REQUIRED_TRUE,
    RETURN,
    SUM,
    THEN,
    TIME,
    TIME_COMPARATOR,
} from '../../lib/AttributeConstants'

class FieldValidation {

    getFieldValidationMap(fieldValidationList) {
        let fieldValidationMap = {}
        for (let index in fieldValidationList) {
            let validationList = fieldValidationMap[fieldValidationList[index].fieldAttributeMasterId] ? fieldValidationMap[fieldValidationList[index].fieldAttributeMasterId] : []
            validationList.push(fieldValidationList[index])
            fieldValidationMap[fieldValidationList[index].fieldAttributeMasterId] = validationList
        }
        return fieldValidationMap
    }

    /**
     * 
     * @param {*} currentElement 
     * @param {*} formElement 
     * @param {*} timeOfExecution 
     * @param {*} jobTransaction 
     */
    fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction, fieldAttributeMasterParentIdMap) {
        let validationList = currentElement.validation ? currentElement.validation.filter(validationObject => validationObject.timeOfExecution == timeOfExecution) : null
        let validationMapObject = this.prepareValidationReferenceMap(validationList)
        let validationStringMap = this.validationStringMap(validationMapObject.validationReferenceMap)
        let validationsResult = this.evaluateValidationMap(validationStringMap, validationMapObject.validationMap, formElement, jobTransaction, timeOfExecution, fieldAttributeMasterParentIdMap)
        return validationsResult
    }

    /**
     * 
     * @param {*} validationList 
     */
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
        return {
            validationMap,
            validationReferenceMap
        }
    }

    /**
     * 
     * @param {*} validationReferenceMap 
     */
    validationStringMap(validationReferenceMap) {
        let validationStringMap = {}
        for (let index in validationReferenceMap['root']) {
            let validationObject = {}
            validationStringMap[validationReferenceMap['root'][index]] = validationReferenceMap['root'][index] + this.addOperatorAndValidationId(validationReferenceMap[validationReferenceMap['root'][index]], validationReferenceMap)
        }
        return validationStringMap
    }

    /**
     * 
     * @param {*} validationReferenceObject 
     * @param {*} validationReferenceMap 
     */
    addOperatorAndValidationId(validationReferenceObject, validationReferenceMap) {
        return validationReferenceObject ? validationReferenceObject.operator + validationReferenceObject.id + this.addOperatorAndValidationId(validationReferenceMap[validationReferenceObject.id], validationReferenceMap) : ''
    }

    /**
     * 
     * @param {*} validationStringMap 
     * @param {*} validationMap 
     * @param {*} formElement 
     * @param {*} jobTransaction 
     */
    evaluateValidationMap(validationStringMap, validationMap, formElement, jobTransaction, timeOfExecution, fieldAttributeMasterParentIdMap) {
        let validationActionList, returnValue = true
        for (let index in validationStringMap) {
            if (this.evaluateValidation(validationStringMap[index], validationMap, '||', formElement, jobTransaction, fieldAttributeMasterParentIdMap)) {
                validationActionList = validationMap[index].conditions ? validationMap[index].conditions.filter(validationAction => validationAction.conditionType == THEN) : null
            } else {
                validationActionList = validationMap[index].conditions ? validationMap[index].conditions.filter(validationAction => validationAction.conditionType == ELSE) : null
            }
            let validationActionResult = validationActionList ? this.runValidationActions(validationActionList, formElement, jobTransaction, timeOfExecution, validationMap[index].fieldAttributeMasterId, fieldAttributeMasterParentIdMap) : null
            returnValue = returnValue ? validationActionResult : returnValue
        }
        return returnValue
    }

    /**
     * 
     * @param {*} validationString 
     * @param {*} validationMap 
     * @param {*} splitOperator 
     * @param {*} formElement 
     * @param {*} jobTransaction 
     */
    evaluateValidation(validationString, validationMap, splitOperator, formElement, jobTransaction, fieldAttributeMasterParentIdMap) {
        if (!splitOperator) {
            return this.evaluateCondition(this.parseKey(validationMap[validationString].leftKey, formElement, jobTransaction, fieldAttributeMasterParentIdMap), this.parseKey(validationMap[validationString].rightKey, formElement, jobTransaction, fieldAttributeMasterParentIdMap), validationMap[validationString].condition)
        }
        let result
        let validationList = validationString.split(splitOperator)
        for (let index in validationList) {
            if (splitOperator == '||') {
                result = this.evaluateValidation(validationList[index], validationMap, '&&', formElement, jobTransaction, fieldAttributeMasterParentIdMap)
                if (result) {
                    break;
                }
            } else if (splitOperator == '&&') {
                result = this.evaluateValidation(validationList[index], validationMap, null, formElement, jobTransaction, fieldAttributeMasterParentIdMap)
                if (!result) {
                    break
                }
            }
        }
        return result
    }

    /**
     * 
     * @param {*} key 
     * @param {*} formElement 
     * @param {*} jobTransaction 
     */
    parseKey(key, formElement, jobTransaction, fieldAttributeMasterParentIdMap) {
        //TODO cross status validations and other child validations working on parent like mode type of money collect
        if (key[0] == 'F') {
            let id = this.splitKey(key, false)
            let fieldAttributeMasterId = parseInt(id)
            fieldAttributeMasterId = fieldAttributeMasterId != NaN ? fieldAttributeMasterId : id
            if (!formElement.get(fieldAttributeMasterId) && fieldAttributeMasterParentIdMap) {
                return (this.getChildFieldAttribute(fieldAttributeMasterId, formElement, fieldAttributeMasterParentIdMap))
            } else if (formElement.get(fieldAttributeMasterId) && (formElement.get(fieldAttributeMasterId).displayValue == ARRAY_SAROJ_FAREYE || formElement.get(fieldAttributeMasterId).displayValue == OBJECT_SAROJ_FAREYE)) {
                let childList = this.getChildFieldDataValue(formElement.get(fieldAttributeMasterId).childDataList, fieldAttributeMasterId)
                return childList
            }
            return formElement.get(fieldAttributeMasterId) ? formElement.get(fieldAttributeMasterId).displayValue : null
        } else if (key[0] == 'J') {
            let jobAttributeMasterId = this.splitKey(key, true)
            let jobDataQuery = `jobId = ${jobTransaction.jobId} AND jobAttributeMasterId = ${jobAttributeMasterId} AND parentId = 0`
            const jobData = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery)
            return jobData[0] ? jobData[0].value : null
        } else {
            return key
        }
    }

    /**
     * 
     * @param {*} leftKey 
     * @param {*} rightKey 
     * @param {*} condition 
     */
    evaluateCondition(leftKey, rightKey, condition) {
        if (!leftKey && leftKey !== 0 && !rightKey && rightKey !== 0) {
            return false
        }
        switch (condition) {
            case EQUAL_TO: {
                return (leftKey === rightKey)
            }
            case CONTAINS: {
                return _.includes(leftKey, rightKey)
            }
            case GREATER_THAN:
            case GREATER_THAN_OR_EQUAL_TO:
            case LESS_THAN:
            case LESS_THAN_OR_EQUAL_TO: {
                if (parseFloat(leftKey) == NaN || parseFloat(rightKey) == NaN) {
                    return false
                }
                return (eval(leftKey + condition + rightKey))
            }
            case NOT_EQUAL_TO: {
                return (leftKey !== rightKey)
            }
            case REGEX: {
                let regex = new RegExp(rightKey)
                return regex.test(leftKey)
            }
        }
    }

    /**
     * 
     * @param {*} key 
     * @param {*} isJob 
     */
    splitKey(key, isJob) {
        let temp = isJob ? key.split('J[') : key.split('F[')
        return temp ? temp[temp.length - 1].split(']')[0] : temp
    }

    /**
     * 
     * @param {*} validationActionList 
     * @param {*} formElement 
     * @param {*} jobTransaction 
     */
    runValidationActions(validationActionList, formElement, jobTransaction, timeOfExecution, currentFieldAttributeMasterId, fieldAttributeMasterParentIdMap) {
        let returnValue = true
        for (let index in validationActionList) {
            switch (validationActionList[index].type) {
                case ALERT_MESSAGE: {
                    formElement.get(currentFieldAttributeMasterId).alertMessage = validationActionList[index].assignValue
                    break
                }
                case ASSIGN: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    let valueToBeAssigned = null
                    if (validationActionList[index].actionOnAssignFrom) {
                        valueToBeAssigned = this.actionOnAssignFrom(fieldAttributeMasterId, jobTransaction, formElement, validationActionList[index], fieldAttributeMasterParentIdMap)
                    } else {
                        if (formElement.get(parseInt(fieldAttributeMasterId))) {
                            valueToBeAssigned = this.parseKey(validationActionList[index].assignValue, formElement, jobTransaction, fieldAttributeMasterParentIdMap)
                        }
                    }
                    formElement.get(parseInt(fieldAttributeMasterId)).displayValue = formElement.get(parseInt(fieldAttributeMasterId)).value = valueToBeAssigned || valueToBeAssigned === 0 ? valueToBeAssigned + '' : null
                    formElement.get(parseInt(fieldAttributeMasterId)).editable = true
                    break
                }
                case ASSIGN_BY_MATHEMATICAL_FORMULA: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement.get(parseInt(fieldAttributeMasterId))) {
                        let value = this.solveMathExpression(validationActionList[index].actionOnAssignFrom, formElement, jobTransaction)
                        formElement.get(parseInt(fieldAttributeMasterId)).displayValue = formElement.get(parseInt(fieldAttributeMasterId)).value = (value || value === 0) ? value + '' : null
                        formElement.get(parseInt(fieldAttributeMasterId)).editable = true
                    }
                    break
                }
                case ASSIGN_DATE_TIME: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement.get(parseInt(fieldAttributeMasterId))) {
                        let value = this.parseKey(validationActionList[index].assignValue, formElement, jobTransaction, fieldAttributeMasterParentIdMap)
                        if (formElement.get(parseInt(fieldAttributeMasterId)).attributeTypeId == TIME) {
                            let tobeassign = moment()
                            tobeassign.add(parseInt(value), 'h')
                            formElement.get(parseInt(fieldAttributeMasterId)).displayValue = formElement.get(parseInt(fieldAttributeMasterId)).value = tobeassign.format('HH:mm')
                        } else if (formElement.get(parseInt(fieldAttributeMasterId)).attributeTypeId == DATE || formElement.get(parseInt(fieldAttributeMasterId)).attributeTypeId == RE_ATTEMPT_DATE) {
                            let tobeassign = moment()
                            tobeassign.add(parseInt(value), 'd')
                            formElement.get(parseInt(fieldAttributeMasterId)).displayValue = formElement.get(parseInt(fieldAttributeMasterId)).value = tobeassign.format('YYYY-MM-DD')
                        }
                    }
                    break
                }
                case DATE_COMPARATOR: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement.get(parseInt(fieldAttributeMasterId))) {
                        let value = this.solveDateTimeExpression(validationActionList[index].actionOnAssignFrom, formElement, jobTransaction, true)
                        formElement.get(parseInt(fieldAttributeMasterId)).displayValue = formElement.get(parseInt(fieldAttributeMasterId)).value = value ? value + '' : null
                        formElement.get(parseInt(fieldAttributeMasterId)).editable = true
                    }
                    break
                }
                case REQUIRED_FALSE: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].assignValue)
                    if (formElement.get(parseInt(fieldAttributeMasterId))) {
                        formElement.get(parseInt(fieldAttributeMasterId)).required = false
                    }
                    break
                }
                case REQUIRED_TRUE: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].assignValue)
                    if (formElement.get(parseInt(fieldAttributeMasterId))) {
                        formElement.get(parseInt(fieldAttributeMasterId)).required = true
                    }
                    break
                }
                case RETURN: {
                    returnValue = this.evaluateReturnCondition(validationActionList[index].assignValue, timeOfExecution, formElement, currentFieldAttributeMasterId)
                    break
                }
                case TIME_COMPARATOR: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement.get(parseInt(fieldAttributeMasterId))) {
                        let value = this.solveDateTimeExpression(validationActionList[index].actionOnAssignFrom, formElement, jobTransaction, false)
                        formElement.get(parseInt(fieldAttributeMasterId)).displayValue = formElement.get(parseInt(fieldAttributeMasterId)).value = value
                        formElement.get(parseInt(fieldAttributeMasterId)).editable = true
                    }
                    break
                }
            }
        }

        return returnValue
    }

    /**
     * 
     * @param {*} key 
     */
    checkKey(key) {
        if (key && key[0] == 'F') {
            return this.splitKey(key)
        } else {
            return null
        }
    }

    /**
     * 
     * @param {*} expression 
     * @param {*} formElement 
     * @param {*} jobTransaction 
     */
    solveMathExpression(expression, formElement, jobTransaction) {
        if (!expression) {
            return null
        }
        let attributeList = expression.split(/[{}]+/)
        let expressionString = ''
        let result = false
        for (let index in attributeList) {
            if (!attributeList[index] && attributeList[index] !== 0) {
                continue
            }
            let value = this.parseKey(attributeList[index], formElement, jobTransaction)
            expressionString += value
        }

        return eval(expressionString)
    }

    /**
     * 
     * @param {*} expression 
     * @param {*} formElement 
     * @param {*} jobTransaction 
     * @param {*} isDate 
     */
    solveDateTimeExpression(expression, formElement, jobTransaction, isDate) {
        if (!expression) {
            return null
        }
        let comparatorList = []
        let attributeList = expression.split(/[-+]|[-+]/)
        for (let index in attributeList) {
            if (!attributeList[index] && attributeList[index] !== 0) {
                continue
            }
            comparatorList.push(this.parseKey(attributeList[index].replace(/{|}/g, ''), formElement, jobTransaction))
        }

        let leftKey = this.evaluateDateTime(comparatorList[0], isDate)
        let rightKey = this.evaluateDateTime(comparatorList[1], isDate)
        if (!leftKey || !rightKey) {
            return null
        }
        let difference = (leftKey - rightKey)
        let val = isDate ? parseInt(difference / (24 * 60 * 60 * 1000)) : parseInt(difference / (60 * 1000))
        return val
    }

    /**
     * 
     * @param {*} value 
     * @param {*} isDate 
     */
    evaluateDateTime(value, isDate) {
        if (!value) {
            return null
        }

        if (value == 'fareye_app_curent_date') {
            return moment().startOf('day')
        }

        if (value == 'fareye_app_curent_time') {
            return moment()
        }

        return isDate ? moment(value, 'YYYY-MM-DD') : moment(value, 'YYYY-MM-DD HH:mm:ss')
    }

    evaluateReturnCondition(assignValue, timeOfExecution, formElement, fieldAttributeMasterId) {
        if (assignValue == 'true') {
            return true
        }

        if (timeOfExecution == BEFORE) {
            formElement.get(fieldAttributeMasterId).editable = formElement.get(fieldAttributeMasterId).value || formElement.get(fieldAttributeMasterId).value == 0 ? false : true
        } else {
            return false
        }

        return true
    }

    getRootFieldAttributeMasterId(fieldAttributeMasterId, fieldAttributeMasterParentIdMap) {
        let rootFieldAttributeMasterId = fieldAttributeMasterId
        let parentId = fieldAttributeMasterParentIdMap[rootFieldAttributeMasterId]
        while (parentId) {
            rootFieldAttributeMasterId = parentId
            parentId = fieldAttributeMasterParentIdMap[rootFieldAttributeMasterId]
        }
        return rootFieldAttributeMasterId
    }

    getChildFieldDataValue(childDataList, fieldAttributeMasterId) {
        let value = []
        for (let index in childDataList) {
            if (childDataList[index].fieldAttributeMasterId == fieldAttributeMasterId) {
                value.push(childDataList[index].value)
            } else if (childDataList[index].childDataList) {
                value = value.concat(this.getChildFieldDataValue(childDataList[index].childDataList, fieldAttributeMasterId))
            }
        }
        return value
    }

    getChildFieldAttribute(fieldAttributeMasterId, formElement, fieldAttributeMasterParentIdMap) {
        let rootFieldAttributeMasterId = this.getRootFieldAttributeMasterId(fieldAttributeMasterId, fieldAttributeMasterParentIdMap)
        if (!formElement.get(rootFieldAttributeMasterId) || !formElement.get(rootFieldAttributeMasterId).childDataList) {
            return null
        }
        let formElementChildData = formElement.get(rootFieldAttributeMasterId).childDataList
        let value = this.getChildFieldDataValue(formElementChildData, fieldAttributeMasterId)
        return value.length > 1 ? value : value[0]
    }

    actionOnAssignFrom(fieldAttributeMasterId, jobTransaction, formElement, validationAction, fieldAttributeMasterParentIdMap) {
        if (!fieldAttributeMasterParentIdMap) {
            return null
        }
        let assignFieldAttributeMasterId = this.splitKey(validationAction.assignValue)
        let dataList = []
        dataList = dataList.concat(this.getChildFieldAttribute(assignFieldAttributeMasterId, formElement, fieldAttributeMasterParentIdMap))
        let value = this.evaluateActionOnAssign(validationAction, dataList)
        return value
    }

    evaluateActionOnAssign(validationAction, dataList) {
        if (!dataList) {
            return null
        }
        switch (validationAction.actionOnAssignFrom) {
            case AVERAGE: {
                return this.calculateDataList(dataList).sum / dataList.length
            }
            case CONCATENATE: {
                let value = dataList.join('')
                return value
            }
            case MAX: {
                return this.calculateDataList(dataList).max
            }
            case MIN: {
                return this.calculateDataList(dataList).min
            }
            case SUM: {
                return this.calculateDataList(dataList).sum
            }
        }
    }

    calculateDataList(dataList) {
        let sum = 0, min, max
        for (let index in dataList) {
            let valueToBeAdded = parseFloat(dataList[index])
            sum += valueToBeAdded ? valueToBeAdded : 0
            min = (!min && min !== 0) || min > valueToBeAdded ? valueToBeAdded : min
            max = (!max && max !== 0) || max < valueToBeAdded ? valueToBeAdded : max
        }
        return {
            sum,
            min,
            max
        }
    }

}

export let fieldValidationService = new FieldValidation()