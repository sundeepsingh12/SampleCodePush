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
    fieldValidations(currentElement, formElement, timeOfExecution, jobTransaction) {
        let validationList = currentElement.validation ? currentElement.validation.filter(validationObject => validationObject.timeOfExecution == timeOfExecution) : null
        let validationMapObject = this.prepareValidationReferenceMap(validationList)
        let validationStringMap = this.validationStringMap(validationMapObject.validationReferenceMap)
        let validationsResult = this.evaluateValidationMap(validationStringMap, validationMapObject.validationMap, formElement, jobTransaction, timeOfExecution)
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
    evaluateValidationMap(validationStringMap, validationMap, formElement, jobTransaction, timeOfExecution) {
        let validationActionList, alertMessageList = [], returnValue = true
        for (let index in validationStringMap) {
            if (this.evaluateValidation(validationStringMap[index], validationMap, '||', formElement, jobTransaction)) {
                validationActionList = validationMap[index].conditions ? validationMap[index].conditions.filter(validationAction => validationAction.conditionType == THEN) : null
            } else {
                validationActionList = validationMap[index].conditions ? validationMap[index].conditions.filter(validationAction => validationAction.conditionType == ELSE) : null
            }
            let validationActionResultList = validationActionList ? this.runValidationActions(validationActionList, formElement, jobTransaction, timeOfExecution, validationMap[index].fieldAttributeMasterId) : null
            if (validationActionResultList) {
                validationActionResultList.alertMessage ? alertMessageList.concat(validationActionResultList.alertMessage) : null
                returnValue = validationActionResultList.returnValue
            }
        }
        return {
            alertMessageList,
            returnValue
        }
    }

    /**
     * 
     * @param {*} validationString 
     * @param {*} validationMap 
     * @param {*} splitOperator 
     * @param {*} formElement 
     * @param {*} jobTransaction 
     */
    evaluateValidation(validationString, validationMap, splitOperator, formElement, jobTransaction) {
        if (!splitOperator) {
            return this.evaluateCondition(this.parseKey(validationMap[validationString].leftKey, formElement, jobTransaction), this.parseKey(validationMap[validationString].rightKey, formElement, jobTransaction), validationMap[validationString].condition)
        }
        let result
        let validationList = validationString.split(splitOperator)
        for (let index in validationList) {
            if (splitOperator == '||') {
                result = this.evaluateValidation(validationList[index], validationMap, '&&', formElement, jobTransaction)
                if (result) {
                    break;
                }
            } else if (splitOperator == '&&') {
                result = this.evaluateValidation(validationList[index], validationMap, null, formElement, jobTransaction)
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
    parseKey(key, formElement, jobTransaction) {
        //TODO cross status validations and other child validations working on parent like mode type of money collect
        if (key[0] == 'F') {
            let id = this.splitKey(key, false)
            let fieldAttributeMasterId = parseInt(id)
            fieldAttributeMasterId = fieldAttributeMasterId != NaN ? fieldAttributeMasterId : id
            return formElement.get(fieldAttributeMasterId) ? formElement.get(fieldAttributeMasterId).value : null
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
                return leftKey.includes(rightKey)
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
                return rightKey.test(leftKey)
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
    runValidationActions(validationActionList, formElement, jobTransaction, timeOfExecution, fieldAttributeMasterId) {
        let validationActionResult = {
            alertMessageList: [],
            returnValue: true,
        }
        for (let index in validationActionList) {
            switch (validationActionList[index].type) {
                case ALERT_MESSAGE: {
                    validationActionResult.alertMessageList.push(validationActionList[index].assignValue)
                    break
                }
                case ASSIGN: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (validationActionList[index].actionOnAssignFrom) {
                        this.actionOnAssignFrom(fieldAttributeMasterId, jobTransaction, formElement, validationActionList[index])
                    } else {
                        if (formElement.get(parseInt(fieldAttributeMasterId))) {
                            formElement.get(parseInt(fieldAttributeMasterId)).value = this.parseKey(validationActionList[index].assignValue, formElement, jobTransaction)
                            formElement.get(parseInt(fieldAttributeMasterId)).editable = true
                        }
                    }
                    break
                }
                case ASSIGN_BY_MATHEMATICAL_FORMULA: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement.get(parseInt(fieldAttributeMasterId))) {
                        let value = this.solveMathExpression(validationActionList[index].actionOnAssignFrom, formElement, jobTransaction)
                        formElement.get(parseInt(fieldAttributeMasterId)).value = (value || value === 0) ? value + '' : null
                        formElement.get(parseInt(fieldAttributeMasterId)).editable = true
                    }
                    break
                }
                case ASSIGN_DATE_TIME: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement.get(parseInt(fieldAttributeMasterId))) {
                        let value = this.parseKey(validationActionList[index].assignValue, formElement, jobTransaction)
                        if (formElement.get(parseInt(fieldAttributeMasterId)).attributeTypeId == TIME) {
                            let tobeassign = moment()
                            tobeassign.add(parseInt(value), 'h')
                            formElement.get(parseInt(fieldAttributeMasterId)).value = tobeassign.format('HH:mm')
                        } else if (formElement.get(parseInt(fieldAttributeMasterId)).attributeTypeId == DATE || formElement.get(parseInt(fieldAttributeMasterId)).attributeTypeId == RE_ATTEMPT_DATE) {
                            let tobeassign = moment()
                            tobeassign.add(parseInt(value), 'd')
                            formElement.get(parseInt(fieldAttributeMasterId)).value = tobeassign.format('YYYY-MM-DD')
                        }
                    }
                    break
                }
                case DATE_COMPARATOR: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement.get(parseInt(fieldAttributeMasterId))) {
                        let value = this.solveDateTimeExpression(validationActionList[index].actionOnAssignFrom, formElement, jobTransaction, true)
                        formElement.get(parseInt(fieldAttributeMasterId)).value = value ? value + '' : null
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
                    validationActionResult.returnValue = this.evaluateReturnCondition(validationActionList[index].assignValue, timeOfExecution, formElement, fieldAttributeMasterId)
                    break
                }
                case TIME_COMPARATOR: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement.get(parseInt(fieldAttributeMasterId))) {
                        let value = this.solveDateTimeExpression(validationActionList[index].actionOnAssignFrom, formElement, jobTransaction, false)
                        formElement.get(parseInt(fieldAttributeMasterId)).value = value
                        formElement.get(parseInt(fieldAttributeMasterId)).editable = true
                    }
                    break
                }
            }
        }

        return validationActionResult
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

    async actionOnAssignFrom(fieldAttributeMasterId, jobTransaction, formElement, validationAction) {
        const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
        let fieldAttributeMasterMap = fieldAttributeMasterService.getFieldAttributeMasterMap(fieldAttributeMasterList.value)
        let fieldAttributeMasterObject = fieldAttributeMasterMap[jobTransaction.jobMasterId]
        let parentId = rootFieldAttributeMasterId = validationAction.getAssignValue
        while (fieldAttributeMasterObject[parentId]) {
            rootFieldAttributeMasterId = parentId
            parentId = fieldAttributeMasterObject[fieldAttributeMasterId].parentId
        }
        let dataList = this.findObjectValues(rootFieldAttributeMasterId, fieldAttributeMasterId, formElement)
        evaluateActionOnAssign(validationAction, dataList)
    }

    findObjectValues(rootFieldAttributeMasterId, fieldAttributeMasterId, formElement) {
        let valueList = []
        if (!formElement.get(rootFieldAttributeMasterId).childDataList) {
            return null
        }
        let childDataList = formElement.get(rootFieldAttributeMasterId.childDataList)
        for (let index in childDataList) {
            let childList = childDataList[index].childDataList
            if (!childList) {
                continue
            }
            valueList.push('' + childList.filter(fielData => fielData.fieldAttributeMasterId == fieldAttributeMasterId))
        }
    }

    evaluateActionOnAssign(validationAction, dataList) {
        switch (validationAction.getActionOnAssignFrom) {
            case AVERAGE: {
                break
            }
            case CONCATENATE: {
                break
            }
            case MAX: {
                break
            }
            case MIN: {
                break
            }
            case SUM: {
                break
            }
        }
    }

}

export let fieldValidationService = new FieldValidation()