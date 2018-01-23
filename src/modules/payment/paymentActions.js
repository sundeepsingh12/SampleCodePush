'use strict'

import { paymentService } from '../../services/payment/Payment'
import { setState } from '../global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { fieldDataService } from '../../services/classes/FieldData'
import { navigateToScene } from '../../modules/global/globalActions'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { NavigationActions } from 'react-navigation'
import {
    CLEAR_PAYMENT_STATE,
    CUSTOMIZATION_APP_MODULE,
    FIELD_ATTRIBUTE,
    FIELD_ATTRIBUTE_VALIDATION,
    JOB_ATTRIBUTE,
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
    DISCOUNT,
    EZE_TAP,
    MOSAMBEE,
    MOSAMBEE_WALLET,
    MPAY,
    M_SWIPE,
    NET_BANKING,
    NOT_PAID,
    PAYNEAR,
    PAYO,
    PAYTM,
    POS,
    RAZOR_PAY,
    SODEXO,
    SPLIT,
    TICKET_RESTAURANT,
    UPI,
    OBJECT_SAROJ_FAREYE,
    MONEY_PAY,
} from '../../lib/AttributeConstants'

import {
    NO,
    YES,
    INVALID_CONFIGURATION,
    REFUND,
    COLLECTION_CASH,
    COLLECTION_SOD
} from '../../lib/ContainerConstants'
import _ from 'lodash'
import { Toast } from 'native-base'

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
                    jobTransactionIdAmountMap: paymentParameters.jobTransactionIdAmountMap
                }
            ))
        } catch (error) {
            console.log(error)
            Toast.show({ text: error.message, position: 'bottom', buttonText: 'OK', duration: 5000 })
        }
    }
}

export function saveMoneyCollectObject(actualAmount, currentElement, formElement, jobMasterId, jobId, jobTransaction, latestPositionId, moneyCollectMaster, isSaveDisabled, originalAmount, selectedPaymentMode, transactionNumber, remarks, receipt, jobTransactionIdAmountMap) {
    return async function (dispatch) {
        try {
            const moneyCollectChildFieldDataList = paymentService.prepareMoneyCollectChildFieldDataListDTO(actualAmount, moneyCollectMaster, originalAmount, selectedPaymentMode, transactionNumber, remarks, receipt)
            const fieldDataListObject = fieldDataService.prepareFieldDataForTransactionSavingInState(moneyCollectChildFieldDataList, jobTransaction.id, currentElement.positionId, latestPositionId)
            const isCardPayment = paymentService.checkCardPayment(selectedPaymentMode)
            let paymentAtEnd = {
                currentElement,
                modeTypeId: selectedPaymentMode,
                isCardPayment
            }
            if (!jobTransactionIdAmountMap) {
                jobTransactionIdAmountMap = {}
                jobTransactionIdAmountMap.actualAmount = actualAmount
                jobTransactionIdAmountMap.originalAmount = originalAmount
            }
            if (moneyCollectMaster.attributeTypeId == MONEY_PAY) {
                jobTransactionIdAmountMap.moneyTransactionType = REFUND
            } else if (selectedPaymentMode == CASH.id) {
                jobTransactionIdAmountMap.moneyTransactionType = COLLECTION_CASH
            } else {
                jobTransactionIdAmountMap.moneyTransactionType = COLLECTION_SOD
            }
            formElement.get(currentElement.fieldAttributeMasterId).jobTransactionIdAmountMap = jobTransactionIdAmountMap
            dispatch(updateFieldDataWithChildData(currentElement.fieldAttributeMasterId, formElement, isSaveDisabled, OBJECT_SAROJ_FAREYE, fieldDataListObject, jobTransaction))
            // dispatch(setState(UPDATE_PAYMENT_AT_END, {
            //     paymentAtEnd
            // }))
            dispatch(setState(CLEAR_PAYMENT_STATE))
            dispatch(NavigationActions.back())
        } catch (error) {
            console.log(error)
        }
    }
}

export function saveMoneyCollectSplitObject(actualAmount, currentElement, formElement, jobTransaction, latestPositionId, moneyCollectMaster, isSaveDisabled, originalAmount, splitPaymentModeMap, paymentContainerKey) {
    return async function (dispatch) {
        try {
            paymentService.checkSplitAmount(actualAmount, splitPaymentModeMap)
            const moneyCollectChildFieldDataList = paymentService.prepareMoneyCollectChildFieldDataListDTOForSplit(actualAmount, moneyCollectMaster, originalAmount, splitPaymentModeMap)
            const fieldDataListObject = fieldDataService.prepareFieldDataForTransactionSavingInState(moneyCollectChildFieldDataList, jobTransaction.id, currentElement.positionId, latestPositionId)
            // const isCardPayment = paymentService.checkCardPayment(selectedPaymentMode)
            // let paymentAtEnd = {
            //     currentElement,
            //     modeTypeId: selectedPaymentMode,
            //     isCardPayment
            // }
            dispatch(updateFieldDataWithChildData(currentElement.fieldAttributeMasterId, formElement, isSaveDisabled, OBJECT_SAROJ_FAREYE, fieldDataListObject, jobTransaction))
            // dispatch(setState(UPDATE_PAYMENT_AT_END, {
            //     paymentAtEnd
            // }))
            dispatch(setState(CLEAR_PAYMENT_STATE))
            dispatch(NavigationActions.back({ key: paymentContainerKey }))
        } catch (error) {
            console.log(error)
        }
    }
}

export function paymentModeSelect(selectedPaymentMode, splitPaymentMode, modeTypeId, actualAmount, transactionNumber) {
    return async function (dispatch) {
        try {
            let tempSelectedPaymentMode = _.cloneDeep(selectedPaymentMode), isSaveButtonDisabled = true, otherPaymentEnable = false
            if (splitPaymentMode != YES) {
                if (modeTypeId == CHEQUE.id || modeTypeId == DEMAND_DRAFT.id) {
                    if (actualAmount && transactionNumber) {
                        isSaveButtonDisabled = false
                    }
                } else {
                    if (actualAmount) {
                        isSaveButtonDisabled = false
                    }
                }
                tempSelectedPaymentMode = modeTypeId
            } else if (!paymentService.checkCardPayment(modeTypeId)) {
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
            if (actualAmount && (tempSelectedPaymentMode.cardPaymentMode || otherPaymentEnable)) {
                isSaveButtonDisabled = false
            }
            dispatch(setState(SET_SELECTED_PAYMENT_MODE, { selectedPaymentMode: tempSelectedPaymentMode, isSaveButtonDisabled }))

        } catch (error) {
            console.log(error)
        }
    }
}

export function getSplitPaymentModeList(selectedPaymentMode) {
    return async function (dispatch) {
        try {
            // dispatch(loading split)
            let splitPaymentModeMap = paymentService.prepareSplitPaymentModeList(selectedPaymentMode)
            dispatch(setState(SET_SPLIT_PAYMENT_MODE_LIST, { splitPaymentModeMap }))
        } catch (error) {
            console.log(error)
        }
    }
}

export function changeChequeOrDDPaymentModeList(modeTypeId, splitPaymentModeMap, arrayIndex) {
    return async function (dispatch) {
        try {
            let splitPaymentModeMapClone = _.cloneDeep(splitPaymentModeMap)
            let paymentModeObject = splitPaymentModeMapClone[modeTypeId]
            let paymentModeArray = splitPaymentModeMapClone[modeTypeId].list
            if (arrayIndex) {
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
            console.log(error)
        }
    }
}

export function setPaymentAmount(modeTypeId, amount, splitPaymentModeMap) {
    return async function (dispatch) {
        try {
            let splitPaymentModeMapClone = _.cloneDeep(splitPaymentModeMap)
            let paymentModeObject = splitPaymentModeMapClone[modeTypeId]
            paymentModeObject.amount = amount
            dispatch(setState(SET_SPLIT_PAYMENT_MODE_LIST, { splitPaymentModeMap: splitPaymentModeMapClone }))
        } catch (error) {
            console.log(error)
        }
    }
}

export function setPaymentParameterForChequeOrDD(modeTypeId, arrayIndex, splitPaymentModeMap, amount, transactionNumber) {
    return async function (dispatch) {
        try {
            let splitPaymentModeMapClone = _.cloneDeep(splitPaymentModeMap)
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
            console.log(error)
        }
    }
}