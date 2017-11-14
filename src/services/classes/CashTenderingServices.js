'use strict'
import {
    keyValueDBService,
} from './KeyValueDBService'

import {
    NUMBER,
    DECIMAL,
    MONEY_COLLECT,
    ARRAY,
    OBJECT,
    CASH,
    STRING,
    OBJECT_SAROJ_FAREYE
} from '../../lib/AttributeConstants'

class CashTenderingServices {

    calculateQuantity(cashTenderingList, totalAmount, payload) {
        totalAmount -= (cashTenderingList[payload.id].childDataList[NUMBER].value) * (cashTenderingList[payload.id].childDataList[DECIMAL].value)
        if (payload.quantity != '') {
            cashTenderingList[payload.id].childDataList[NUMBER].value = parseInt(payload.quantity)
            totalAmount += (parseInt(payload.quantity)) * (cashTenderingList[payload.id].childDataList[DECIMAL].value)
        } else {
            cashTenderingList[payload.id].childDataList[NUMBER].value = ''
        }
        return {
            cashTenderingList,
            totalAmount
        }
    }

    initializeValuesOfDenominations(cashTenderingList) {
        const cashTenderingListInitialized = {}
        let i = 1000
        for (let fieldDataObject in cashTenderingList) {
            cashTenderingList[fieldDataObject].childDataList[NUMBER].value = 0
            cashTenderingList[fieldDataObject].childDataList[STRING].value = 'return'
            cashTenderingList[fieldDataObject].id = i
            cashTenderingListInitialized[i] = cashTenderingList[fieldDataObject]
            i++
        }
        return cashTenderingListInitialized
    }

    checkForCashInMoneyCollect(formElement, currentElement) {
        let cash = 0
        if (formElement != null) {
            for (let [key, fieldDataObject] of formElement.entries()) {
                if (fieldDataObject.attributeTypeId == MONEY_COLLECT && fieldDataObject.childDataList && currentElement.positionId > fieldDataObject.positionId) {
                    let cashDetailsArray = fieldDataObject.childDataList
                        .filter(item => item.attributeTypeId == ARRAY)[0].childDataList
                        .filter(item_1 => item_1.attributeTypeId == OBJECT)[0].childDataList
                    if (cashDetailsArray.filter(item_2 => item_2.value == CASH.modeType).length) {
                        cash = cashDetailsArray.filter(item_3 => item_3.attributeTypeId == DECIMAL)[0].value
                    }
                }
            }
        }
        return cash
    }

    prepareObjectWithFieldAttributeData(fieldAttributeData) {
        let objectWithFieldData = {
            fieldAttributeMasterId: fieldAttributeData.id,
            label: fieldAttributeData.label,
            attributeTypeId: fieldAttributeData.attributeTypeId
        }
        return objectWithFieldData
    }

    prepareCashTenderingList(fieldAttributeMasterList, fieldAttributeValueDataArray, fieldAttributeMasterId, counter) {
        let cashTenderinglist = {}
        for (let fieldAttributeData of fieldAttributeMasterList) {
            if (fieldAttributeData.parentId == fieldAttributeMasterId) {
                let fieldAttributeDataObject = this.prepareObjectWithFieldAttributeData(fieldAttributeData)
                if (fieldAttributeData.attributeTypeId == DECIMAL) {
                    fieldAttributeDataObject.id = counter++
                    fieldAttributeDataObject.value = 0
                    cashTenderinglist[TOTAL_AMOUNT] = fieldAttributeDataObject
                } else if (fieldAttributeData.attributeTypeId == OBJECT) {
                    let fixedSKUObjectChildListTemplate = {}
                    fieldAttributeDataObject.value = OBJECT_SAROJ_FAREYE
                    for (let fieldAttributeMaster of fieldAttributeMasterList) {
                        if (fieldAttributeMaster.parentId == fieldAttributeDataObject.fieldAttributeMasterId && (fieldAttributeMaster.attributeTypeId == STRING || fieldAttributeMaster.attributeTypeId == DECIMAL || fieldAttributeMaster.attributeTypeId == NUMBER)) {
                            let childDataObject = this.prepareObjectWithFieldAttributeData(fieldAttributeMaster)
                            fixedSKUObjectChildListTemplate[childDataObject.attributeTypeId] = childDataObject
                        }
                    }
                    fieldAttributeDataObject.childDataList = fixedSKUObjectChildListTemplate
                    fieldAttributeDataObject.view = fixedSKUObjectChildListTemplate[1].value
                    cashTenderinglist = this.prepareCashTenderingListObjectsFromTemplate(fieldAttributeDataObject, fieldAttributeValueDataArray, cashTenderinglist, fieldAttributeMasterId, counter)
                    break
                }
            }
        }
        return cashTenderinglist;
    }

    prepareCashTenderingListObjectsFromTemplate(cashTenderingObjectTemplate, fieldAttributeValueDataArray, cashTenderinglist, fieldAttributeMasterId, counter) {
        fieldAttributeValueDataArray.filter(fieldAttributeValueDataObject =>
            fieldAttributeValueDataObject.fieldAttributeMasterId == fieldAttributeMasterId).
            forEach(fieldAttrObject => {
                let cashTenderingObject = JSON.parse(JSON.stringify(cashTenderingObjectTemplate))
                cashTenderingObject.id = counter++
                cashTenderingObject.sequence = fieldAttrObject.sequence
                cashTenderingObject.childDataList[STRING].value = 'receive'
                cashTenderingObject.childDataList[DECIMAL].value = fieldAttrObject.code
                cashTenderingObject.childDataList[NUMBER].value = 0
                cashTenderingObject.view = fieldAttrObject.name
                cashTenderinglist[cashTenderingObject.id] = cashTenderingObject
            })
        return cashTenderinglist
    }

}

export let CashTenderingService = new CashTenderingServices()