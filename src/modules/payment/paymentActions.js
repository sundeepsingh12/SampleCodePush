'use strict'

import { paymentService } from '../../services/payment/Payment'
import { setState } from '../global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { fieldDataService } from '../../services/classes/FieldData'
import { navigateToScene } from '../../modules/global/globalActions'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { NavigationActions } from 'react-navigation'
const {
    CLEAR_PAYMENT_STATE,
    CUSTOMIZATION_APP_MODULE,
    FIELD_ATTRIBUTE,
    FIELD_ATTRIBUTE_VALIDATION,
    JOB_ATTRIBUTE,
    JOB_MASTER_MONEY_TRANSACTION_MODE,
    SET_PAYMENT_INITIAL_PARAMETERS,
    UPDATE_PAYMENT_AT_END
} = require('../../lib/constants').default

import {
    OBJECT_SAROJ_FAREYE
} from '../../lib/AttributeConstants'

export function getPaymentParameters(jobMasterId, jobId, fieldAttributeMasterId, formData, jobStatusId) {
    return async function (dispatch) {
        try {
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const fieldAttributeMasterValidationList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALIDATION)
            const jobMasterMoneyTransactionModesList = await keyValueDBService.getValueFromStore(JOB_MASTER_MONEY_TRANSACTION_MODE)
            const modulesCustomizationList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
            const paymentParameters = paymentService.getPaymentParameters(jobMasterId, fieldAttributeMasterId, jobMasterMoneyTransactionModesList.value, fieldAttributeMasterList.value, formData, jobId, jobStatusId, fieldAttributeMasterValidationList.value, modulesCustomizationList.value)
            let isAmountEditable = paymentParameters.amountEditableObject ? true : paymentParameters.actualAmount ? false : true
            dispatch(setState(
                SET_PAYMENT_INITIAL_PARAMETERS,
                {
                    actualAmount: paymentParameters.actualAmount,
                    isAmountEditable,
                    maxValue : paymentParameters.amountEditableObject ? paymentParameters.amountEditableObject.maxValue : null,
                    minValue : paymentParameters.amountEditableObject ? paymentParameters.amountEditableObject.minValue : null,
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

export function saveMoneyCollectObject(actualAmount, currentElement, formElement, jobMasterId, jobId, jobTransactionId, latestPositionId, moneyCollectMaster, nextEditable, isSaveDisabled, originalAmount, selectedIndex, transactionNumber, remarks, receipt) {
    return async function (dispatch) {
        try {
            const moneyCollectChildFieldDataList = paymentService.prepareMoneyCollectChildFieldDataListDTO(actualAmount, moneyCollectMaster, originalAmount, selectedIndex, transactionNumber, remarks, receipt)
            const fieldDataListObject = fieldDataService.prepareFieldDataForTransactionSavingInState(moneyCollectChildFieldDataList, jobTransactionId, currentElement.positionId, latestPositionId)
            const isCardPayment = paymentService.checkCardPayment(selectedIndex)
            let paymentAtEnd = {
                currentElement,
                modeTypeId: selectedIndex,
                isCardPayment
            }
            dispatch(updateFieldDataWithChildData(currentElement.fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, OBJECT_SAROJ_FAREYE, fieldDataListObject))
            dispatch(setState(UPDATE_PAYMENT_AT_END, {
                paymentAtEnd
            }))
            dispatch(setState(CLEAR_PAYMENT_STATE))
            dispatch(NavigationActions.back())
            // dispatch(navigateToScene('PayByLink', { actualAmount, jobMasterId, jobId, jobTransactionId }))
        } catch (error) {
            console.log(error)
        }
    }
}