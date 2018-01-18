'use strict'

import { CashTenderingService } from '../../services/classes/CashTenderingServices'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { fieldDataService } from '../../services/classes/FieldData'
import {
    FIELD_ATTRIBUTE_VALUE,
    FIELD_ATTRIBUTE,
    CHANGE_AMOUNT,
    IS_CASH_TENDERING_LOADER_RUNNING,
    SET_CASH_TENDERING,
    IS_RECEIVE_TOGGLE,
    FETCH_CASH_TENDERING_LIST_RETURN,
    CHANGE_AMOUNT_RETURN,
} from '../../lib/constants'
import {
    ARRAY_SAROJ_FAREYE,
} from '../../lib/AttributeConstants'

import { setState } from '../global/globalActions'

export function onSave(parentObject, formElement, cashTenderingList, cashTenderingListReturn, isSaveDisabled, latestPositionId, jobTransaction, isReceive) {
    return async function (dispatch) {
        try {
            if (!cashTenderingList) {
                throw new Error("cashTenderingList not set Properly onSave action")
            }
            let cashTenderingListCombined = (isReceive) ? cashTenderingList : Object.assign({}, cashTenderingList, cashTenderingListReturn)
            let fieldDataListWithLatestPositionId = await fieldDataService.prepareFieldDataForTransactionSavingInState(cashTenderingListCombined, jobTransaction.id, parentObject.positionId, latestPositionId)
            if (cashTenderingListReturn != null) {
                dispatch(setState(IS_RECEIVE_TOGGLE, true))
            }
            dispatch(updateFieldDataWithChildData(parentObject.fieldAttributeMasterId, formElement, isSaveDisabled, ARRAY_SAROJ_FAREYE, fieldDataListWithLatestPositionId, jobTransaction))
        } catch (error) {
            console.log(error)
        }
    }
}

export function getCashTenderingListReturn(cashTenderingList) {
    return async function (dispatch) {
        try {
            if (!cashTenderingList) {
                throw new Error("cashTenderingList not set Properly in getCashTenderingListReturn Action")
            }
            dispatch(setState(IS_CASH_TENDERING_LOADER_RUNNING, true))
            let cashTenderingListReturn = CashTenderingService.initializeValuesOfDenominations(cashTenderingList)
            dispatch(setState(FETCH_CASH_TENDERING_LIST_RETURN, {
                cashTenderingListReturn: cashTenderingListReturn,
                isCashTenderingLoaderRunning: false
            }))
        } catch (error) {
            console.log(error)
        }
    }
}

export function checkForCash(formElement, currentElement) {
    return async function (dispatch) {
        try {
            if (!formElement || !currentElement) {
                throw new Error("formElement or currentElement not found in checkForCash Action")
            }
            let cash = CashTenderingService.checkForCashInMoneyCollect(formElement, currentElement)
            return cash
        } catch (error) {
            console.log(error)
        }
    }
}

export function onChangeQuantity(cashTenderingList, totalAmount, payload, isReceive) {
    return async function (dispatch) {
        try {
            if (!cashTenderingList) {
                throw new Error("cashTenderingList not set Properly in onChangeQuantity Action")
            }
            if (totalAmount == null || totalAmount == undefined || totalAmount == NaN) {
                throw new Error("totalAmount not set Properly in onChangeQuantity Action")
            }
            let payload1 = await CashTenderingService.calculateQuantity(cashTenderingList, totalAmount, payload)
            if (isReceive == true) {
                dispatch(setState(CHANGE_AMOUNT, payload1))
            } else {
                dispatch(setState(CHANGE_AMOUNT_RETURN, payload1))
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export function fetchCashTenderingList(fieldAttributeMasterId) {
    return async function (dispatch) {
        try {
            if (fieldAttributeMasterId == null || fieldAttributeMasterId == undefined || fieldAttributeMasterId == NaN) {
                throw new Error("fieldAttributeMasterId not set Properly in fetchCashTenderingList Action")
            }
            dispatch(setState(IS_CASH_TENDERING_LOADER_RUNNING, true))
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const fieldAttributeValueDataArray = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALUE)
            const cashTenderingList = await CashTenderingService.prepareCashTenderingList(fieldAttributeMasterList.value, fieldAttributeValueDataArray.value, fieldAttributeMasterId, 0)
            dispatch(setState(SET_CASH_TENDERING, {
                cashTenderingList: cashTenderingList,
                isCashTenderingLoaderRunning: false
            }))
        } catch (error) {
            console.log("errors", error)
        }
    }
}