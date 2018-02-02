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
    IMAGE_EXTENSION,
    EXTERNAL_DATA_STORE,
    DATA_STORE,
    QR_SCAN,
    SCAN_OR_TEXT,
    POST,
} from '../../lib/AttributeConstants'
import { formLayoutEventsInterface } from './formLayout/FormLayoutEventInterface.js'
import { formLayoutService } from '../../services/classes/formLayout/FormLayout'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import {
    HUB,
    USER,
    JOB_MASTER,
} from '../../lib/constants'
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'
import {
    SMS_NOT_SENT_TRY_AGAIN_LATER,
    EMAIL_NOT_SENT_TRY_AGAIN_LATER,
    SMS_SENT_SUCCESSFULLY,
    EMAIL_SENT_SUCCESSFULLY,
} from '../../lib/ContainerConstants'
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
    saveRecurringData(formLayoutState, recurringData, jobTransaction, statusId) {
        let differentData = { ...recurringData }
        let priority = -1, textToShow = ''
        let savedJobDetailsObject = {}
        for (let [id, currentObject] of formLayoutState.formElement.entries()) {
            if (currentObject.attributeTypeId == SCAN_OR_TEXT && priority < 4) {
                priority = 4
                textToShow = currentObject.value
                break
            }
            else if (currentObject.attributeTypeId == EXTERNAL_DATA_STORE && priority < 3) {
                priority = 3
                textToShow = currentObject.value
            }
            else if (currentObject.attributeTypeId == DATA_STORE && priority < 2) {
                priority = 2
                textToShow = currentObject.value
            }
            else if (currentObject.attributeTypeId == QR_SCAN && priority < 1) {
                priority = 1
                textToShow = currentObject.value
            }
        }
        if (priority == -1) {
            textToShow = _.size(recurringData) + 1
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
        let emailTableElement = {}
        let emailIdInFieldData = []
        let contactNumberInFieldData = false
        for (let counter in recurringData) {
            let formLayoutObject
            let dataForSingleTransaction = recurringData[counter]
            if (!isCalledFromFormLayout) {
                formLayoutObject = await formLayoutService.concatFormElementForTransientStatus(previousFormLayoutState, dataForSingleTransaction.formLayoutState.formElement)
            } else {
                formLayoutObject = new Map([...previousFormLayoutState, ...dataForSingleTransaction.formLayoutState.formElement])
            }
            let returnParams = (formLayoutObject) ? this.prepareDTOOfFromLayoutObject(formLayoutObject, emailIdInFieldData, contactNumberInFieldData) : {}
            emailIdInFieldData = returnParams.emailIdInFieldData
            contactNumberInFieldData = returnParams.contactNumberInFieldData
            if (!_.isEmpty(returnParams.formattedFormLayoutObject)) {
                emailTableElement[dataForSingleTransaction.id] = returnParams.formattedFormLayoutObject
            }
            let jobTransactionList = await formLayoutEventsInterface.saveDataInDb(formLayoutObject, dataForSingleTransaction.id, statusId, jobMasterId)
            await formLayoutEventsInterface.addTransactionsToSyncList(jobTransactionList)
        }
        return { emailTableElement, emailIdInFieldData, contactNumberInFieldData }
    }

    /**This service is used to send email or sms.
     * 
     * @param {*} emailIdOrSmsList  -- list of emailIds or PhoneNumbers to send 
     * @param {*} isEmail -- it checks whether to send sms or email
     * @param {*} totalAmount
     * @param {*} emailTableElement -- dto
     * @param {*} emailGeneratedFromComplete -- either called from complete button
     *  
     */

    async sendEmailOrSms(totalAmount, emailTableElement, emailIdOrSmsList, isEmail, emailGeneratedFromComplete, jobMasterId) {
        try {
            const userData = await keyValueDBService.getValueFromStore(USER)
            if (userData && userData.value && userData.value.company && userData.value.company.code && (_.startsWith(_.toLower(userData.value.company.code), 'dhl'))) {
                if (!_.isEmpty(emailIdOrSmsList) && !isEmail) {
                    emailIdOrSmsList = [_.trim(emailIdOrSmsList)]
                }
                const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
                let currentJobMasterCode = jobMasterList.value.filter((data) => data.id == jobMasterId)[0].code
                let body = {
                        companyCode: userData.value.company.code,
                        emailTableElement,
                        emailTotalCash: totalAmount,
                    }
                const hub = await keyValueDBService.getValueFromStore(HUB)
                let hubcode = hub.value.code
                const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
                let postJSON = "{\"emailIds\":" + JSON.stringify(emailIdOrSmsList) + ", \"subject\": \"" + currentJobMasterCode + "\"" + ", \"hubCode\": \"" + hubcode + "\"" + ", \"body\": " + JSON.stringify(body) + ", \"emailGeneratedFromComplete\": \"" + emailGeneratedFromComplete + "\"" + "}";
                let jSessionId = ((token.value).split('JSESSIONID=')[1]).split(';')[0]
                let url = (isEmail) ? CONFIG.API.SEND_EMAIL_LINK + jSessionId : CONFIG.API.SEND_SMS_LINK + jSessionId
                let response = await RestAPIFactory(token.value).serviceCall(postJSON, url, POST)  // dhl sit https
                if (!response || response.status != 202) {
                    if (!isEmail) {
                        return SMS_NOT_SENT_TRY_AGAIN_LATER
                    } else {
                        return EMAIL_NOT_SENT_TRY_AGAIN_LATER
                    }
                } else {
                    if (!isEmail) {
                        return SMS_SENT_SUCCESSFULLY
                    } else {
                        return EMAIL_SENT_SUCCESSFULLY
                    }
                }
            } else return ''
        } catch (error) {
            console.log(error.message)
        }
    }

    /**
     * 
     * @param {*} formLayoutObject //complete form layout object
     */
    prepareDTOOfFromLayoutObject(formLayoutObject, emailIdInFieldData, contactNumberInFieldData) {
        let formattedFormLayoutObject = []
        for (let [id, fieldDataObject] of formLayoutObject.entries()) {
            if (fieldDataObject && !fieldDataObject.hidden) {
                formattedFormLayoutObject.push({
                    key: fieldDataObject.key,
                    label: fieldDataObject.label,
                    value: (fieldDataObject.value && !_.isEmpty(fieldDataObject.value)) ? fieldDataObject.value : ""
                })
                if (emailIdInFieldData != [] && _.includes(fieldDataObject.value, '@') && _.includes(fieldDataObject.value, '.')) {
                    emailIdInFieldData.push(fieldDataObject.value)
                } else if (!contactNumberInFieldData && (fieldDataObject.key == "mobile_phone")) {
                    contactNumberInFieldData = true
                }
            }
        }
        return { formattedFormLayoutObject, emailIdInFieldData, contactNumberInFieldData }
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

    createObjectForStore(saveActivatedState, screenName, jobMasterId, navigationParams, navigationFormLayoutStates) {
        let cloneSaveActivatedState = _.cloneDeep(saveActivatedState)
        let cloneNavigationFormLayoutStates = _.cloneDeep(navigationFormLayoutStates)
        let { differentData, arrayFormElement } = this.convertMapToArrayOrArrayToMap(cloneSaveActivatedState.differentData, cloneNavigationFormLayoutStates, true)
        cloneSaveActivatedState.differentData = differentData
        cloneNavigationFormLayoutStates = arrayFormElement
        let storeObject = {}
        storeObject[jobMasterId] = {
            saveActivatedState: cloneSaveActivatedState, screenName,
            jobMasterId,
            navigationParams,
            navigationFormLayoutStates: cloneNavigationFormLayoutStates
        }
        return storeObject
    }
}

export let transientStatusService = new TransientStatusService()