'use strict'

import { paymentService } from '../../services/payment/Payment'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { fieldDataService } from '../../services/classes/FieldData'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import {
    CLEAR_PAYMENT_STATE,
    CUSTOMIZATION_APP_MODULE,
    FIELD_ATTRIBUTE,
    FIELD_ATTRIBUTE_VALIDATION,
    JOB_MASTER_MONEY_TRANSACTION_MODE,
    SET_PAYMENT_INITIAL_PARAMETERS,
    UPDATE_PAYMENT_AT_END,
    SET_SELECTED_PAYMENT_MODE,
    SET_SPLIT_PAYMENT_MODE_LIST,
} from '../../lib/constants'

import {
    CASH,
    CHEQUE,
    DEMAND_DRAFT,
    OBJECT_SAROJ_FAREYE,
    MONEY_PAY,
} from '../../lib/AttributeConstants'

import {
    NO,
    YES,
    INVALID_CONFIGURATION,
    REFUND,
    COLLECTION_CASH,
    COLLECTION_SOD,
    VALID_AMOUNT_ERROR
} from '../../lib/ContainerConstants'
import { Toast } from 'native-base'
import { CashTenderingService } from '../../services/classes/CashTenderingServices'
import size from 'lodash/size'


/**
 * This action sets initial payment parameters
 * @param {*} jobTransaction 
 * @param {*} fieldAttributeMasterId 
 * @param {*} formData 
 * @param {*} jobStatusId 
 */
export function getPaymentParameters(jobTransaction, fieldAttributeMasterId, formData, jobStatusId) {
    return async function (dispatch) {
        try {
            dispatch(setState(CLEAR_PAYMENT_STATE))
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const fieldAttributeMasterValidationList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALIDATION)
            const jobMasterMoneyTransactionModesList = await keyValueDBService.getValueFromStore(JOB_MASTER_MONEY_TRANSACTION_MODE)
            const modulesCustomizationList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
            const paymentParameters = paymentService.getPaymentParameters(jobTransaction, fieldAttributeMasterId, jobMasterMoneyTransactionModesList.value, fieldAttributeMasterList.value, formData, jobStatusId, fieldAttributeMasterValidationList.value, modulesCustomizationList.value)
            let isAmountEditable = paymentParameters.amountEditableObject ? true : parseFloat(paymentParameters.actualAmount) ? false : true
            //In case of bulk actual amount should not be null
            if (!parseFloat(paymentParameters.actualAmount) && jobTransaction.length) {
                throw new Error(INVALID_CONFIGURATION)
            }

            dispatch(setState(
                SET_PAYMENT_INITIAL_PARAMETERS,
                {
                    actualAmount: Math.round((parseFloat(paymentParameters.actualAmount)) * 100) / 100,
                    isAmountEditable,
                    maxValue: paymentParameters.amountEditableObject ? paymentParameters.amountEditableObject.maxValue : null,
                    minValue: paymentParameters.amountEditableObject ? paymentParameters.amountEditableObject.minValue : null,
                    moneyCollectMaster: paymentParameters.moneyCollectMaster,
                    originalAmount: Math.round((parseFloat(paymentParameters.originalAmount)) * 100) / 100,
                    paymentModeList: paymentParameters.paymentModeList,
                    splitPaymentMode: paymentParameters.splitPaymentMode ? NO : null,
                    jobTransactionIdAmountMap: paymentParameters.jobTransactionIdAmountMap,
                    isSaveButtonDisabled:size(paymentParameters.paymentModeList.endPaymentModeList) > 1 || size(paymentParameters.paymentModeList.otherPaymentModeList) > 1

                }
            ))
        } catch (error) {
            showToastAndAddUserExceptionLog(1601, error.message, 'danger', 1)
        }
    }
}

/**
 * This action preapres and saves money collect field data in form layout state
 * @param {*} actualAmount 
 * @param {*} currentElement 
 * @param {*} formElement 
 * @param {*} jobMasterId 
 * @param {*} jobId 
 * @param {*} jobTransaction 
 * @param {*} latestPositionId 
 * @param {*} moneyCollectMaster 
 * @param {*} isSaveDisabled 
 * @param {*} originalAmount 
 * @param {*} selectedPaymentMode 
 * @param {*} transactionNumber 
 * @param {*} remarks 
 * @param {*} receipt 
 * @param {*} jobTransactionIdAmountMap 
 */
export function saveMoneyCollectObject(actualAmount, currentElement, jobTransaction, moneyCollectMaster, originalAmount, selectedPaymentMode, transactionNumber, remarks, receipt, jobTransactionIdAmountMap, formLayoutState) {
    return async function (dispatch) {
        try {
            //While saving actual amount should be a number
            if (!Number(actualAmount)) {
                Toast.show({ text: VALID_AMOUNT_ERROR, position: 'bottom', buttonText: 'OK', duration: 5000 })
                return
            }
            const moneyCollectChildFieldDataList = paymentService.prepareMoneyCollectChildFieldDataListDTO(actualAmount, moneyCollectMaster, originalAmount, selectedPaymentMode, transactionNumber, remarks, receipt)
            const fieldDataListObject = fieldDataService.prepareFieldDataForTransactionSavingInState(moneyCollectChildFieldDataList, jobTransaction.id, currentElement.positionId, formLayoutState.latestPositionId)
            const isCardPayment = paymentService.checkCardPayment(selectedPaymentMode)
            //Initialising jobTransactionIdAmountMap in case of null for saving actual and original amount in job transaction
            if (!jobTransactionIdAmountMap) {
                jobTransactionIdAmountMap = {}
                jobTransactionIdAmountMap.actualAmount = actualAmount
                jobTransactionIdAmountMap.originalAmount = originalAmount
            }

            //Setting moneyTransactionType in jobTransactionIdAmountMap for saving moneyTransactionType in job transaction
            if (moneyCollectMaster.attributeTypeId == MONEY_PAY) {
                jobTransactionIdAmountMap.moneyTransactionType = REFUND
            } else if (selectedPaymentMode == CASH.id) {
                jobTransactionIdAmountMap.moneyTransactionType = COLLECTION_CASH
            } else {
                jobTransactionIdAmountMap.moneyTransactionType = COLLECTION_SOD
            }
            formLayoutState.formElement[currentElement.fieldAttributeMasterId].jobTransactionIdAmountMap = jobTransactionIdAmountMap
            formLayoutState.formElement = CashTenderingService.checkForCashTenderingAndResetValue(formLayoutState.formElement, currentElement)
            let paymentAtEnd = {
                currentElement: formLayoutState.formElement[currentElement.fieldAttributeMasterId],
                modeTypeId: selectedPaymentMode,
                parameters: null,
                isCardPayment
            }
            formLayoutState.paymentAtEnd = paymentAtEnd
            dispatch(updateFieldDataWithChildData(currentElement.fieldAttributeMasterId, formLayoutState, OBJECT_SAROJ_FAREYE, fieldDataListObject, jobTransaction))
            dispatch(setState(UPDATE_PAYMENT_AT_END, {
                paymentAtEnd
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1602, error.message, 'danger', 1)
        }
    }
}

/**
 * This action preapres and saves money collect field data in form layout state for split payment mode
 * @param {*} actualAmount 
 * @param {*} currentElement 
 * @param {*} formLayoutState 
 * @param {*} jobTransaction 
 * @param {*} latestPositionId 
 * @param {*} moneyCollectMaster 
 * @param {*} isSaveDisabled 
 * @param {*} originalAmount 
 * @param {*} splitPaymentModeMap 
 * @param {*} paymentContainerKey 
 */
export function saveMoneyCollectSplitObject(actualAmount, currentElement, formLayoutState, jobTransaction, moneyCollectMaster, originalAmount, splitPaymentModeMap, paymentContainerKey,navigation) {
    return async function (dispatch) {
        try {
            paymentService.checkSplitAmount(actualAmount, splitPaymentModeMap)
            const moneyCollectChildFieldDataList = paymentService.prepareMoneyCollectChildFieldDataListDTOForSplit(actualAmount, moneyCollectMaster, originalAmount, splitPaymentModeMap)
            const fieldDataListObject = fieldDataService.prepareFieldDataForTransactionSavingInState(moneyCollectChildFieldDataList, jobTransaction.id, currentElement.positionId, formLayoutState.latestPositionId)
            // const isCardPayment = paymentService.checkCardPayment(selectedPaymentMode)
            // let paymentAtEnd = {
            //     currentElement,
            //     modeTypeId: selectedPaymentMode,
            //     isCardPayment
            // }
            dispatch(updateFieldDataWithChildData(currentElement.fieldAttributeMasterId, formLayoutState, OBJECT_SAROJ_FAREYE, fieldDataListObject, jobTransaction))
            // dispatch(setState(UPDATE_PAYMENT_AT_END, {
            //     paymentAtEnd
            // }))
            // dispatch(setState(CLEAR_PAYMENT_STATE))
            // navDispatch(NavigationActions.back())
            navigation.pop(1)
        } catch (error) {
            showToastAndAddUserExceptionLog(1603, error.message, 'danger', 1)
        }
    }
}

/**
 * This action changes UI for selected payment mode accordingly
 * @param {*} selectedPaymentMode 
 * @param {*} splitPaymentMode 
 * @param {*} modeTypeId 
 * @param {*} actualAmount 
 * @param {*} transactionNumber 
 */
export function paymentModeSelect(selectedPaymentMode, splitPaymentMode, modeTypeId, actualAmount, transactionNumber) {
    return async function (dispatch) {
        try {
            let tempSelectedPaymentMode = JSON.parse(JSON.stringify(selectedPaymentMode)), isSaveButtonDisabled = false, otherPaymentEnable = false
            //Check if actual amount is valid string
            if (!actualAmount) {
                isSaveButtonDisabled = true
            }
            //Check if payment mode is not split
            if (splitPaymentMode != YES) {
                //Check if payment mode is Cheque or DD and actual amount and transaction number are valid strings
                if (parseInt(modeTypeId) == CHEQUE.id || parseInt(modeTypeId) == DEMAND_DRAFT.id) {
                    isSaveButtonDisabled = true
                }
                tempSelectedPaymentMode = modeTypeId
                otherPaymentEnable = true
            } else if (!paymentService.checkCardPayment(parseInt(modeTypeId))) {
                tempSelectedPaymentMode = tempSelectedPaymentMode ? tempSelectedPaymentMode : {}
                let otherPaymentModeList = tempSelectedPaymentMode.otherPaymentModeList ? tempSelectedPaymentMode.otherPaymentModeList : {}
                otherPaymentModeList[modeTypeId] = otherPaymentModeList[modeTypeId] ? false : true
                tempSelectedPaymentMode.otherPaymentModeList = otherPaymentModeList
            } else {
                tempSelectedPaymentMode = tempSelectedPaymentMode ? tempSelectedPaymentMode : {}
                tempSelectedPaymentMode.cardPaymentMode = tempSelectedPaymentMode.cardPaymentMode ? tempSelectedPaymentMode.cardPaymentMode == modeTypeId ? null : tempSelectedPaymentMode.cardPaymentMode : modeTypeId
            }
            for (let index in tempSelectedPaymentMode.otherPaymentModeList) {
                if (tempSelectedPaymentMode.otherPaymentModeList[index]) {
                    otherPaymentEnable = true
                }
            }

            //Check if actual amount is valid string and payment modes in split are all filled
            if (!tempSelectedPaymentMode.cardPaymentMode && !otherPaymentEnable) {
                isSaveButtonDisabled = true
            }
            dispatch(setState(SET_SELECTED_PAYMENT_MODE, { selectedPaymentMode: tempSelectedPaymentMode, isSaveButtonDisabled }))

        } catch (error) {
            showToastAndAddUserExceptionLog(1604, error.message, 'danger', 1)
        }
    }
}

/**
 * This action sets splitPaymentModeMap for split payment screen
 * @param {*} selectedPaymentMode 
 */
export function getSplitPaymentModeList(selectedPaymentMode) {
    return async function (dispatch) {
        try {
            // dispatch(loading split)
            let splitPaymentModeMap = paymentService.prepareSplitPaymentModeList(selectedPaymentMode)
            dispatch(setState(SET_SPLIT_PAYMENT_MODE_LIST, { splitPaymentModeMap }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1605, error.message, 'danger', 1)
        }
    }
}

/**
 * This action add or remove cheque or dd row from list in case of split payment
 * @param {*} modeTypeId 
 * @param {*} splitPaymentModeMap 
 * @param {*} arrayIndex 
 */
export function changeChequeOrDDPaymentModeList(modeTypeId, splitPaymentModeMap, arrayIndex) {
    return async function (dispatch) {
        try {
            let splitPaymentModeMapClone = JSON.parse(JSON.stringify(splitPaymentModeMap))
            let paymentModeObject = splitPaymentModeMapClone[modeTypeId]
            let paymentModeArray = splitPaymentModeMapClone[modeTypeId].list
            //If array index is present means have to remove row else add row
            if (arrayIndex || arrayIndex === 0) {
                let previousAmount = parseFloat(paymentModeArray[arrayIndex].amount) ? parseFloat(paymentModeArray[arrayIndex].amount) : 0
                let totalAmount = parseFloat(paymentModeObject.amount) ? parseFloat(paymentModeObject.amount) : 0
                paymentModeObject.amount = totalAmount - previousAmount
                paymentModeArray.splice(arrayIndex, 1)
            } else {
                paymentModeArray.push({
                    modeTypeId,
                    amount: null
                })
            }
            dispatch(setState(SET_SPLIT_PAYMENT_MODE_LIST, { splitPaymentModeMap: splitPaymentModeMapClone }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1606, error.message, 'danger', 1)
        }
    }
}

/**
 * This action sets amount for particular payment mode in split payment mode
 * @param {*} modeTypeId 
 * @param {*} amount 
 * @param {*} splitPaymentModeMap 
 */
export function setPaymentAmount(modeTypeId, amount, splitPaymentModeMap) {
    return async function (dispatch) {
        try {
            let splitPaymentModeMapClone = JSON.parse(JSON.stringify(splitPaymentModeMap))
            let paymentModeObject = splitPaymentModeMapClone[modeTypeId]
            paymentModeObject.amount = amount
            dispatch(setState(SET_SPLIT_PAYMENT_MODE_LIST, { splitPaymentModeMap: splitPaymentModeMapClone }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1607, error.message, 'danger', 1)
        }
    }
}

/**
 * This action sets payment parameters for particular cheque or dd row in split payment mode
 * @param {*} modeTypeId 
 * @param {*} arrayIndex 
 * @param {*} splitPaymentModeMap 
 * @param {*} amount 
 * @param {*} transactionNumber 
 */
export function setPaymentParameterForChequeOrDD(modeTypeId, arrayIndex, splitPaymentModeMap, amount, transactionNumber) {
    return async function (dispatch) {
        try {
            let splitPaymentModeMapClone = JSON.parse(JSON.stringify(splitPaymentModeMap))
            let paymentModeObject = splitPaymentModeMapClone[modeTypeId]
            let paymentModeArray = splitPaymentModeMapClone[modeTypeId].list
            if (amount || amount === '') {
                let currentAmount = parseFloat(amount) ? parseFloat(amount) : 0
                let previousAmount = parseFloat(paymentModeArray[arrayIndex].amount) ? parseFloat(paymentModeArray[arrayIndex].amount) : 0
                let totalAmount = parseFloat(paymentModeObject.amount) ? parseFloat(paymentModeObject.amount) : 0
                paymentModeObject.amount = Math.round((totalAmount + currentAmount - previousAmount) * 100) / 100
            }
            paymentModeArray[arrayIndex].amount = amount || amount === '' ? amount : paymentModeArray[arrayIndex].amount
            paymentModeArray[arrayIndex].transactionNumber = transactionNumber || transactionNumber === '' ? transactionNumber : paymentModeArray[arrayIndex].transactionNumber
            dispatch(setState(SET_SPLIT_PAYMENT_MODE_LIST, { splitPaymentModeMap: splitPaymentModeMapClone }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1608, error.message, 'danger', 1)
        }
    }
}
