'use strict'
import _ from 'lodash'
import {
    DATA_STORE_ATTR_MASTER_ID,
    DATA_STORE_MASTER_ID,
    SEARCH_VALUE,
    GET,
    EXTERNAL_DATA_STORE_URL,
    DATA_STORE_ATTR_KEY,
    SKU_ARRAY,
    CAMERA_HIGH,
    CAMERA_MEDIUM,
    CAMERA,
    SIGNATURE,
    SIGNATURE_AND_FEEDBACK,
    CASH_TENDERING,
    OPTION_CHECKBOX,
    ARRAY,
    OPTION_RADIO_FOR_MASTER,
    FIXED_SKU,
    MULTIPLE_SCANNER,
    SKU_ACTUAL_AMOUNT,
    TOTAL_ORIGINAL_QUANTITY,
    TOTAL_ACTUAL_QUANTITY,
    MONEY_COLLECT,
    MONEY_PAY,
    ACTUAL_AMOUNT,
    PATH_TEMP,
    SIGN,
    IMAGE_EXTENSION
} from '../../lib/AttributeConstants'
import { formLayoutEventsInterface } from './formLayout/FormLayoutEventInterface.js'
import { formLayoutService } from '../../services/classes/formLayout/FormLayout'


class TransientStatusService {

    /**
       * This function returns current status
       * @param {*} statusList 
       * @param {*} statusId 
       * @param {*} jobMasterId 
       * @returns current status
       */
    getCurrentStatus(statusList, statusId, jobMasterId) {
        const currentStatus = statusList.value.filter(status => status.jobMasterId == jobMasterId && status.id == statusId);
        return currentStatus[0]
    }

    /**
      * This function returns recurring data object 
      * by adding the new object to the  previous object 
      * using jobTransactionId as a key
      * @param {*} formLayoutState 
      * @param {*} recurringData 
      * @param {*} jobTransaction 
      * @param {*} statusId
      * @returns  jobTransaction.id :{
           jobTransaction.id,
           jobTransaction.jobId,
           textToShow, //this text is used as label 
           fieldDataArray: elementsArray, //details of recurring data 
           formLayoutState,//formLayout state of save activated status
           amount //amount collected if any
       }
      */
    setSavedJobDetails(formLayoutState, recurringData, jobTransaction, statusId) {
        let differentData = { ...recurringData }
        let priority = -1, textToShow = ''
        let savedJobDetailsObject = {}
        for (let [id, currentObject] of formLayoutState.formElement.entries()) {
            if (currentObject.attributeTypeId == 54 && priority < 4) {
                priority = 4
                textToShow = currentObject.value
                break
            }
            else if (currentObject.attributeTypeId == 63 && priority < 3) {
                priority = 3
                textToShow = currentObject.value
            }
            else if (currentObject.attributeTypeId == 44 && priority < 2) {
                priority = 2
                textToShow = currentObject.value
            }
            else if (currentObject.attributeTypeId == 22 && priority < 1) {
                priority = 1
                textToShow = currentObject.value
            }
        }
        if (priority == -1) {
            textToShow = Object.keys(savedJobDetails).length + 1
        }
        let { elementsArray, amount } = this.getDataFromFormElement(formLayoutState.formElement)
        differentData[jobTransaction.id] = {
            id: jobTransaction.id,
            jobId: jobTransaction.jobId,
            textToShow,
            fieldDataArray: elementsArray,
            formLayoutState,
            amount
        }
        return {
            differentData
        }
    }

    /**
      * This function returns recurring data object 
      * by adding the new object to the  previous object 
      * using jobTransactionId as a key
      * @param {*} formElement 
      * @param {*} recurringData 
      * @param {*} jobTransaction 
      * @param {*} statusId
      * @returns  
      *  elementsArray, //details of recurring data , some field attributes are filtered
         amount //amount collected if any
      */
    getDataFromFormElement(formElement) {
        let elementsArray = []
        let id = 0
        let amount = 0
        for (let [id, fieldDataObject] of formElement.entries()) {
            let fieldDataElement = {}
            switch (fieldDataObject.attributeTypeId) {
                case CAMERA_HIGH:
                case CAMERA_MEDIUM:
                case CAMERA:
                case SIGNATURE:
                case SKU_ARRAY:
                case SIGNATURE_AND_FEEDBACK:
                case CASH_TENDERING:
                case OPTION_CHECKBOX:
                case ARRAY:
                case OPTION_RADIO_FOR_MASTER:
                case FIXED_SKU:
                case MULTIPLE_SCANNER:
                case SKU_ACTUAL_AMOUNT:
                case TOTAL_ORIGINAL_QUANTITY:
                case TOTAL_ACTUAL_QUANTITY:
                case MONEY_COLLECT:
                case MONEY_PAY:
                    break;
                default:
                    fieldDataElement.id = id
                    fieldDataElement.label = fieldDataObject.label
                    fieldDataElement.value = fieldDataObject.value
                    elementsArray.push(fieldDataElement)
            }
            if ((fieldDataObject.attributeTypeId == MONEY_COLLECT || fieldDataObject.attributeTypeId == MONEY_PAY) && fieldDataObject.childDataList != null && fieldDataObject.childDataList.length > 0) {
                for (let childFieldData of fieldDataObject.childDataList) {
                    if (childFieldData.attributeTypeId == ACTUAL_AMOUNT) {
                        let { label } = fieldDataObject
                        let { value } = childFieldData
                        amount += parseFloat(value)
                        elementsArray.push({ label, value, id })
                    }
                }
            }
        }
        return {
            elementsArray,
            amount
        }
    }

    /**
     * This function returns common data object 
     * @param {*} formLayoutState
     * @returns
     *  commonData, //details of common data
        statusName //status name for last transient status
        totalAmount //amount collected if any
     */
    populateCommonData(formLayoutState) {
        let commonData = []
        let totalAmount = 0
        let id = 0;
        for (let formLayoutCounter in formLayoutState) {
            let formElementForPreviousStatus = formLayoutState[formLayoutCounter].formElement
            let { elementsArray, amount } = this.getDataFromFormElement(formElementForPreviousStatus)
            commonData = _.concat(commonData, elementsArray)
            if (amount != null && amount != undefined) {
                totalAmount += amount
            }
        }
        let returnParams = { commonData, totalAmount, statusName: _.values(formLayoutState)[_.size(formLayoutState) - 1].statusName, }
        return returnParams
    }

    /**
     * This function save data in DB and add the transaction to SyncList 
     * @param {*} previousFormLayoutState // previous form layout state 
     * @param {*} recurringData // save activated data
     * @param {*} jobMasterId
     * @param {*} statusId 
     * @param {*} isCalledFromFormLayout // true if called from formLayout container ,
     *                                      false if called from saveActivatedActions
     */
    async saveDataInDbAndAddTransactionsToSyncList(previousFormLayoutState, recurringData, jobMasterId, statusId, isCalledFromFormLayout) {
        for (let counter in recurringData) {
            let formLayoutObject
            let dataForSingleTransaction = recurringData[counter]
            if (!isCalledFromFormLayout) {
                formLayoutObject = await formLayoutService.concatFormElementForTransientStatus(previousFormLayoutState, dataForSingleTransaction.formLayoutState.formElement)
            } else {
                formLayoutObject = new Map([...previousFormLayoutState, ...dataForSingleTransaction.formLayoutState.formElement])
            }
            await formLayoutEventsInterface.saveDataInDb(formLayoutObject, dataForSingleTransaction.id, statusId, jobMasterId)
            await formLayoutEventsInterface.addTransactionsToSyncList(dataForSingleTransaction.id);
        }
    }

    /**
     * This function calculate total amount 
     * @param {*} commonAmount // amount in common data
     * @param {*} recurringData // save activated data
     * @param {*} signOffAmount // amount in status mapped after save activated 
     * @returns totalAmount : float
     */
    calculateTotalAmount(commonAmount, recurringData, signOffAmount) {
        let totalAmount = commonAmount
        if (signOffAmount) {
            totalAmount += signOffAmount
        }
        for (let dataCounter in recurringData) {
            totalAmount += recurringData[dataCounter].amount
        }
        return totalAmount
    }

    /**
    * This function deletes object from recurring data 
    * @param {*} itemId // item to be deleted
    * @param {*} recurringData // save activated data
    * @returns resulting recurring data
    */
    deleteRecurringItem(itemId, recurringData) {
        let cloneRecurringData = { ...recurringData }
        delete cloneRecurringData[itemId]
        return cloneRecurringData
    }

    /**
    * This function deletes object from recurring data 
    * @param {*} differentData // save activated data
    * @param {*} navigationFormLayoutStates // data from previous states of save Activated
    * @param {*} mapToArray 
    * @returns{
    * differentData,
    * navigationFormLayoutStates
    * }
    */
    convertMapToArrayOrArrayToMap(differentData, navigationFormLayoutStates, mapToArray) {
        for (let differentDataCounter in differentData) {
            let resultStructure
            let formElement = differentData[differentDataCounter].formLayoutState.formElement
            if (mapToArray) {
                resultStructure = JSON.stringify([...formElement])
            } else {
                resultStructure = new Map(JSON.parse(formElement))
            }
            differentData[differentDataCounter].formLayoutState.formElement = resultStructure
        }
        for (let navigationFormLayoutStatesCounter in navigationFormLayoutStates) {
            let resultStructure
            let formElement = navigationFormLayoutStates[navigationFormLayoutStatesCounter].formElement
            if (mapToArray) {
                resultStructure = JSON.stringify([...formElement])
            } else {
                resultStructure = new Map(JSON.parse(formElement))
            }
            navigationFormLayoutStates[navigationFormLayoutStatesCounter].formElement = resultStructure
        }
        return {
            differentData,
            arrayFormElement: navigationFormLayoutStates
        }
    }
}

export let transientStatusService = new TransientStatusService()