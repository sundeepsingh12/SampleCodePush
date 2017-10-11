'use strict'

import { paymentService } from '../../services/classes/Payment'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { fieldDataService } from '../../services/classes/FieldData'
import { navigateToScene } from '../../modules/global/globalActions'
const {
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE,
    JOB_MASTER_MONEY_TRANSACTION_MODE,
    SET_PAYMENT_INITIAL_PARAMETERS,
} = require('../../lib/constants').default

export function setPaymentState(type, payload) {
    return {
        type,
        payload
    }
}

export function getPaymentParameters(jobMasterId, jobId, fieldAttributeMasterId) {
    return async function (dispatch) {
        try {
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const jobMasterMoneyTransactionModesList = await keyValueDBService.getValueFromStore(JOB_MASTER_MONEY_TRANSACTION_MODE)
            const paymentParameters = paymentService.getPaymentParameters(jobMasterId, fieldAttributeMasterId, jobMasterMoneyTransactionModesList.value, fieldAttributeMasterList.value, null, jobId)
            dispatch(setPaymentState(
                SET_PAYMENT_INITIAL_PARAMETERS,
                {
                    actualAmount: paymentParameters.actualAmount,
                    isAmountEditable: paymentParameters.isAmountEditable,
                    moneyCollectMaster: paymentParameters.moneyCollectMaster,
                    originalAmount: paymentParameters.originalAmount,
                    paymentModeList: paymentParameters.paymentModeList,
                }
            ))
        } catch (error) {
            console.log(error)
        }
    }
}

export function saveMoneyCollectObject(actualAmount, jobMasterId, jobId, jobTransactionId, latestPositionId, moneyCollectMaster, originalAmount, selectedIndex, transactionNumber, remarks, receipt) {
    return async function (dispatch) {
        try {
            const moneyCollectChildFieldDataList = paymentService.prepareMoneyCollectChildFieldDataListDTO(actualAmount, moneyCollectMaster, originalAmount, selectedIndex, transactionNumber, remarks, receipt)
            const fieldDataListObject = fieldDataService.prepareFieldDataForTransactionSavingInState(moneyCollectChildFieldDataList, jobTransactionId, 0, latestPositionId)
            dispatch(navigateToScene('PayByLink', { actualAmount, jobMasterId, jobId, jobTransactionId }))
        } catch (error) {
            console.log(error)
        }
    }
}