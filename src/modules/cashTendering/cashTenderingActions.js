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
import { Toast } from 'native-base'

import { setState, navigateToScene } from '../global/globalActions'
import {
    NOT_REQUIRED,
    OK,
    CASHTENDERINGLIST_NOT_SAVE_PROPERLY,
    FORMELEMENT_OR_CURRENTELEMENT_NOT_FOUND,
    TOTAL_AMOUNT_NOT_SET,
    FIELD_ATTRIBUTE_NOT_SET,
} from '../../lib/ContainerConstants'
export function onSave(parentObject, formElement, cashTenderingList, cashTenderingListReturn, isSaveDisabled, latestPositionId, jobTransaction, isReceive) {
    return async function (dispatch) {
        try {
            if (!cashTenderingList) {
                throw new Error(CASHTENDERINGLIST_NOT_SAVE_PROPERLY)
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
                throw new Error(CASHTENDERINGLIST_NOT_SAVE_PROPERLY)
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

export function checkForCash(routeParams) {
    return async function (dispatch) {
        try {
            if (!routeParams.formElements || !routeParams.currentElement) {
                throw new Error(FORMELEMENT_OR_CURRENTELEMENT_NOT_FOUND)
            }
            let cash = CashTenderingService.checkForCashInMoneyCollect(routeParams.formElements, routeParams.currentElement)
            if (cash > 0) {
                routeParams.cash = cash
                dispatch(navigateToScene('CashTendering', routeParams))
            } else {
                { Toast.show({ text: NOT_REQUIRED, position: 'bottom', buttonText: OK }) }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export function onChangeQuantity(cashTenderingList, totalAmount, payload, isReceive) {
    return async function (dispatch) {
        try {
            if (!cashTenderingList) {
                throw new Error(CASHTENDERINGLIST_NOT_SAVE_PROPERLY)
            }
            if (totalAmount == null || totalAmount == undefined || totalAmount == NaN) {
                throw new Error(TOTAL_AMOUNT_NOT_SET)
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
                throw new Error(FIELD_ATTRIBUTE_NOT_SET)
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