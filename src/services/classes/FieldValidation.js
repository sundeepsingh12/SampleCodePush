'use strict'
import * as realm from '../../repositories/realmdb'
import { TABLE_JOB_DATA, TABLE_FIELD_DATA } from '../../lib/constants'
import moment from 'moment'
import { jobDataService } from './JobData'
import { addServerSmsService } from './AddServerSms'
import {
    ALERT_MESSAGE, ARRAY_SAROJ_FAREYE, ASSIGN, ASSIGN_BY_MATHEMATICAL_FORMULA, ASSIGN_DATE_TIME, AVERAGE,
    BEFORE,
    CONCATENATE, CONTAINS,
    DATE, DATE_COMPARATOR, DECIMAL,
    ELSE, EQUAL_TO,
    GREATER_THAN, GREATER_THAN_OR_EQUAL_TO,
    LESS_THAN, LESS_THAN_OR_EQUAL_TO,
    MAX, MIN,
    NOT_EQUAL_TO, NUMBER,
    OBJECT_SAROJ_FAREYE,
    RE_ATTEMPT_DATE, REGEX, REQUIRED_FALSE, REQUIRED_TRUE, RETURN,
    SUM,
    THEN, TIME, TIME_COMPARATOR,
} from '../../lib/AttributeConstants'
import DeviceInfo from 'react-native-device-info'
import _ from 'lodash'

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
    fieldValidations(currentElement, formLayoutState, timeOfExecution) {
        let validationList = currentElement.validation ? currentElement.validation.filter(validationObject => validationObject.timeOfExecution == timeOfExecution) : null
        let validationMapObject = this.prepareValidationReferenceMap(validationList)
        let validationStringMap = this.validationStringMap(validationMapObject.validationReferenceMap)
        let validationsResult = this.evaluateValidationMap(validationStringMap, validationMapObject.validationMap, timeOfExecution, formLayoutState)
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
    evaluateValidationMap(validationStringMap, validationMap, timeOfExecution, formLayoutState) {
        let validationActionList, returnValue = true
        for (let index in validationStringMap) {
            if (this.evaluateValidation(validationStringMap[index], validationMap, '||', formLayoutState)) {
                validationActionList = validationMap[index].conditions ? validationMap[index].conditions.filter(validationAction => validationAction.conditionType == THEN) : null
            } else {
                validationActionList = validationMap[index].conditions ? validationMap[index].conditions.filter(validationAction => validationAction.conditionType == ELSE) : null
            }
            let validationActionResult = validationActionList ? this.runValidationActions(validationActionList, timeOfExecution, validationMap[index].fieldAttributeMasterId, formLayoutState) : null
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
    evaluateValidation(validationString, validationMap, splitOperator, formLayoutState) {
        if (!splitOperator) {
            return this.evaluateCondition(this.parseKey(validationMap[validationString].leftKey, formLayoutState), this.parseKey(validationMap[validationString].rightKey, formLayoutState), validationMap[validationString].condition);
        }
        let result, validationList = validationString.split(splitOperator);
        for (let index in validationList) {
            if (splitOperator == '||') {
                result = this.evaluateValidation(validationList[index], validationMap, '&&', formLayoutState);
                if (result) {
                    break;
                }
            } else if (splitOperator == '&&') {
                result = this.evaluateValidation(validationList[index], validationMap, null, formLayoutState);
                if (!result) {
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 
     * @param {*} key 
     * @param {*} formElement 
     * @param {*} jobTransaction 
     */
    parseKey(key, formLayoutState) {
        let formElement = formLayoutState.formElement, fieldAttributeMasterParentIdMap = formLayoutState.fieldAttributeMasterParentIdMap, jobTransaction = formLayoutState.jobTransaction, jobAndFieldAttributesList = formLayoutState.jobAndFieldAttributesList;
        if (key.startsWith('F[')) {
            let id = this.splitKey(key, false);
            let fieldAttributeMasterId = parseInt(id);
            fieldAttributeMasterId = fieldAttributeMasterId != NaN ? fieldAttributeMasterId : id;
            let fieldDataValueToBeAssigned = this.getFieldDataValue(fieldAttributeMasterId, formLayoutState);
            if (fieldDataValueToBeAssigned) {
                return fieldDataValueToBeAssigned;
            } else {
                let valueOfTransientState = this.getFieldAttributeFromTransientState(fieldAttributeMasterId, formLayoutState.transientFormLayoutState);
                if (valueOfTransientState) {
                    return valueOfTransientState;
                } else {
                    return (this.checkSingleOrMultipleTransaction(jobTransaction, fieldAttributeMasterId, false, jobAndFieldAttributesList));
                }
            }
        } else if (key.startsWith('J[')) {
            let jobAttributeMasterId = this.splitKey(key, true);
            return (this.checkSingleOrMultipleTransaction(jobTransaction, jobAttributeMasterId, true, jobAndFieldAttributesList));
        } else if (key.includes('_') && key.split('_')[0] == 'fixed') {
            let fixedAttribute = key.split('_')[1];
            return (this.getFixedAttributeValue(fixedAttribute, jobTransaction, jobAndFieldAttributesList, key));
        }
        else {
            return key;
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
    runValidationActions(validationActionList, timeOfExecution, currentFieldAttributeMasterId, formLayoutState) {
        let returnValue = true, formElement = formLayoutState.formElement, jobTransaction = formLayoutState.jobTransaction, fieldAttributeMasterParentIdMap = formLayoutState.fieldAttributeMasterParentIdMap, jobAndFieldAttributesList = formLayoutState.jobAndFieldAttributesList;
        for (let index in validationActionList) {
            switch (validationActionList[index].type) {
                case ALERT_MESSAGE: {
                    let alertMessage = this.setAlertMessage(validationActionList[index].assignValue, jobTransaction, formElement, jobAndFieldAttributesList)
                    formElement[currentFieldAttributeMasterId].alertMessage = alertMessage
                    break
                }
                case ASSIGN: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (!formElement[parseInt(fieldAttributeMasterId)]) {
                        break
                    }
                    let valueToBeAssigned = null
                    if (validationActionList[index].actionOnAssignFrom) {
                        valueToBeAssigned = this.actionOnAssignFrom(validationActionList[index], formLayoutState)
                    } else {
                        valueToBeAssigned = this.parseKey(validationActionList[index].assignValue, formLayoutState)
                    }
                    formElement[parseInt(fieldAttributeMasterId)].displayValue = formElement[parseInt(fieldAttributeMasterId)].value = valueToBeAssigned || valueToBeAssigned === 0 ? valueToBeAssigned + '' : null
                    formElement[parseInt(fieldAttributeMasterId)].editable = true
                    break
                }
                case ASSIGN_BY_MATHEMATICAL_FORMULA: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement[parseInt(fieldAttributeMasterId)]) {
                        let value = this.solveMathExpression(validationActionList[index].actionOnAssignFrom, formLayoutState)
                        formElement[parseInt(fieldAttributeMasterId)].displayValue = formElement[parseInt(fieldAttributeMasterId)].value = (value || value === 0) ? value + '' : null
                        formElement[parseInt(fieldAttributeMasterId)].editable = true
                    }
                    break
                }
                case ASSIGN_DATE_TIME: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement[parseInt(fieldAttributeMasterId)]) {
                        let value = this.parseKey(validationActionList[index].assignValue, formLayoutState)
                        if (formElement[parseInt(fieldAttributeMasterId)].attributeTypeId == TIME) {
                            let tobeassign = moment()
                            tobeassign.add(parseInt(value), 'h')
                            formElement[parseInt(fieldAttributeMasterId)].displayValue = formElement[parseInt(fieldAttributeMasterId)].value = tobeassign.format('HH:mm')
                        } else if (formElement[parseInt(fieldAttributeMasterId)].attributeTypeId == DATE || formElement[parseInt(fieldAttributeMasterId)].attributeTypeId == RE_ATTEMPT_DATE) {
                            let tobeassign = moment()
                            tobeassign.add(parseInt(value), 'd')
                            formElement[parseInt(fieldAttributeMasterId)].displayValue = formElement[parseInt(fieldAttributeMasterId)].value = tobeassign.format('YYYY-MM-DD')
                        }
                    }
                    break
                }
                case DATE_COMPARATOR: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement[parseInt(fieldAttributeMasterId)]) {
                        let value = this.solveDateTimeExpression(validationActionList[index].actionOnAssignFrom, formLayoutState, true)
                        formElement[parseInt(fieldAttributeMasterId)].displayValue = formElement[parseInt(fieldAttributeMasterId)].value = value ? value + '' : null
                        formElement[parseInt(fieldAttributeMasterId)].editable = true
                    }
                    break
                }
                case REQUIRED_FALSE: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].assignValue)
                    if (formElement[parseInt(fieldAttributeMasterId)]) {
                        formElement[parseInt(fieldAttributeMasterId)].required = false
                    }
                    break
                }
                case REQUIRED_TRUE: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].assignValue)
                    if (formElement[parseInt(fieldAttributeMasterId)]) {
                        formElement[parseInt(fieldAttributeMasterId)].required = true
                    }
                    break
                }
                case RETURN: {
                    returnValue = this.evaluateReturnCondition(validationActionList[index].assignValue, timeOfExecution, formElement, currentFieldAttributeMasterId)
                    break
                }
                case TIME_COMPARATOR: {
                    let fieldAttributeMasterId = this.checkKey(validationActionList[index].key)
                    if (formElement[parseInt(fieldAttributeMasterId)]) {
                        let value = this.solveDateTimeExpression(validationActionList[index].actionOnAssignFrom, formLayoutState, false)
                        formElement[parseInt(fieldAttributeMasterId)].displayValue = formElement[parseInt(fieldAttributeMasterId)].value = value
                        formElement[parseInt(fieldAttributeMasterId)].editable = true
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
    solveMathExpression(expression, formLayoutState) {
        if (!expression) {
            return null;
        }
        let attributeList = expression.split(/[{}]+/), expressionString = '';
        for (let index in attributeList) {
            if (!attributeList[index] && attributeList[index] !== 0) {
                continue;
            }
            let value = this.parseKey(attributeList[index], formLayoutState);
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
    solveDateTimeExpression(expression, formLayoutState, isDate) {
        if (!expression) {
            return null
        }
        let comparatorList = []
        let attributeList = expression.split(/[-+]|[-+]/)
        for (let index in attributeList) {
            if (!attributeList[index] && attributeList[index] !== 0) {
                continue
            }
            comparatorList.push(this.parseKey(attributeList[index].replace(/{|}/g, ''), formLayoutState))
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
            formElement[fieldAttributeMasterId].editable = formElement[fieldAttributeMasterId].value || formElement[fieldAttributeMasterId].value == 0 ? false : true
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
        if (!formElement[rootFieldAttributeMasterId] || !formElement[rootFieldAttributeMasterId].childDataList) {
            return null
        }
        let formElementChildData = formElement[rootFieldAttributeMasterId].childDataList
        let value = this.getChildFieldDataValue(formElementChildData, fieldAttributeMasterId)
        return value.length > 1 ? value : value[0]
    }

    actionOnAssignFrom(validationAction, formLayoutState) {
        if (!formLayoutState.fieldAttributeMasterParentIdMap) {
            return null
        }
        let assignFieldAttributeMasterId = this.splitKey(validationAction.assignValue)
        let dataList = []
        dataList = dataList.concat(this.getChildFieldAttribute(assignFieldAttributeMasterId, formLayoutState.formElement, formLayoutState.fieldAttributeMasterParentIdMap))
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

    setAlertMessage(alertMessage, jobTransaction, formElement, jobAndFieldAttributesList) {
        if (!alertMessage || alertMessage.trim() == '' || !jobAndFieldAttributesList) {
            return alertMessage
        }
        let singleJobTransactionArray = []
        if (jobTransaction.length) {
            singleJobTransactionArray.push(jobTransaction[0])
        } else {
            singleJobTransactionArray.push(jobTransaction)
        }
        let jobDataMap = jobDataService.getJobData(singleJobTransactionArray)[singleJobTransactionArray[0].jobId]
        let fieldAndJobAttrMap = this.getKeyToAttributeMap(jobAndFieldAttributesList, singleJobTransactionArray[0].jobMasterId)
        alertMessage = addServerSmsService.checkForRecursiveData(alertMessage, '', jobDataMap, formElement, jobTransaction, fieldAndJobAttrMap.keyToFieldAttributeMap, fieldAndJobAttrMap.keyToJobAttributeMap, { value: jobAndFieldAttributesList.user })
        return alertMessage
    }

    getKeyToAttributeMap(jobAndFieldAttributesList, jobMasterId) {
        let keyToJobAttributeMap = {}, keyToFieldAttributeMap = {}
        for (let jobAttribute of jobAndFieldAttributesList.jobAttributes) {
            if (jobAttribute.jobMasterId == jobMasterId) {
                keyToJobAttributeMap[jobAttribute.key] = jobAttribute
            }
        }
        for (let fieldAttribute of jobAndFieldAttributesList.fieldAttributes) {
            if (fieldAttribute.jobMasterId == jobMasterId) {
                keyToFieldAttributeMap[fieldAttribute.key] = fieldAttribute
            }
        }
        return { keyToJobAttributeMap, keyToFieldAttributeMap }
    }

    getFixedAttributeValue(fixedAttribute, jobTransaction, jobAndFieldAttributesList, key) {
        switch (fixedAttribute) {
            case 'referenceNumber':
                return (jobTransaction && jobTransaction.referenceNumber) ? jobTransaction.referenceNumber : key;

            case 'userHubName':
                return (jobAndFieldAttributesList && jobAndFieldAttributesList.hub) ? jobAndFieldAttributesList.hub.name : key;

            case 'userHubCode':
                return (jobAndFieldAttributesList && jobAndFieldAttributesList.hub) ? jobAndFieldAttributesList.hub.code : key;

            case 'userCityId':
                return (jobAndFieldAttributesList && jobAndFieldAttributesList.user) ? jobAndFieldAttributesList.user.cityId : key;

            case 'userEmpCode':
                return (jobAndFieldAttributesList && jobAndFieldAttributesList.user) ? jobAndFieldAttributesList.user.employeeCode : key;
        }
    }

    checkSingleOrMultipleTransaction(jobTransaction, attributeMasterId, isJob, jobAndFieldAttributesList) {
        let query = ``, result = 0;
        let imeiNumber = DeviceInfo.getUniqueID();
        if (!jobTransaction.length) {
            query = isJob ? `jobId = ${jobTransaction.jobId}` : `jobTransactionId = ${jobTransaction.id}`;
        } else {
            let isFirstIndex = true;
            for (let index in jobTransaction) {
                if (isFirstIndex) {
                    query += isJob ? `jobId = ${jobTransaction[index].jobId}` : `jobTransactionId = ${jobTransaction[index].jobTransactionId}`;
                    isFirstIndex = false;
                } else {
                    query += isJob ? ` OR jobId = ${jobTransaction[index].jobId}` : ` OR jobTransactionId = ${jobTransaction[index].jobTransactionId}`
                }
            }
        }
        query = isJob ? `(${query}) AND jobAttributeMasterId = ${attributeMasterId}` : `(${query}) AND fieldAttributeMasterId = ${attributeMasterId}`;
        let realmDBObject = realm.getRecordListOnQuery(isJob ? TABLE_JOB_DATA : TABLE_FIELD_DATA, query, null, null, true);
        let attributesList = isJob ? jobAndFieldAttributesList.jobAttributes : jobAndFieldAttributesList.fieldAttributes;
        let attributeMaster = attributesList.filter(attributeMasterObject => attributeMasterObject.id == attributeMasterId);
        for (let index in realmDBObject) {
            let value = realm._decryptData(realmDBObject[index].value, imeiNumber);
            if (attributeMaster[0].attributeTypeId == NUMBER || attributeMaster[0].attributeTypeId == DECIMAL) {
                let floatValue = parseFloat(value);
                result += floatValue ? floatValue : 0;
            } else {
                result = value;
                break;
            }
        }
        return result;
    }

    getFieldDataValue(fieldAttributeMasterId, formLayoutState) {
        let { formElement, fieldAttributeMasterParentIdMap } = formLayoutState;
        if (formElement[fieldAttributeMasterId]) {
            if (formElement[fieldAttributeMasterId].displayValue == ARRAY_SAROJ_FAREYE || formElement[fieldAttributeMasterId].displayValue == OBJECT_SAROJ_FAREYE) {
                return (this.getChildFieldAttribute(fieldAttributeMasterId, formElement, fieldAttributeMasterParentIdMap));
            } else {
                return formElement[fieldAttributeMasterId] ? formElement[fieldAttributeMasterId].displayValue : null;
            }
        } else if (fieldAttributeMasterParentIdMap[fieldAttributeMasterId]) {
            return (this.getChildFieldAttribute(fieldAttributeMasterId, formElement, fieldAttributeMasterParentIdMap));
        }
    }

    getFieldAttributeFromTransientState(fieldAttributeMasterId, transientFormLayoutState) {
        if (!transientFormLayoutState) {
            return null
        }
        for (let index in transientFormLayoutState) {
            let fieldDataValue = this.getFieldDataValue(fieldAttributeMasterId, transientFormLayoutState[index]);
            if (fieldDataValue) {
                return fieldDataValue;
            }
        }
    }

}

export let fieldValidationService = new FieldValidation()