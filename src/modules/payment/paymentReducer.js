'use strict'

import InitialState from './paymentInitialState'

const initialState = new InitialState()
import {
  CLEAR_PAYMENT_STATE,
  SET_PAYMENT_CHANGED_PARAMETERS,
  SET_PAYMENT_INITIAL_PARAMETERS,
  SET_SPLIT_PAYMENT,
  SET_SELECTED_PAYMENT_MODE,
  SET_SPLIT_PAYMENT_MODE_LIST,
} from '../../lib/constants'

import {
  CHEQUE,
  DEMAND_DRAFT,
} from '../../lib/AttributeConstants'

import {
  VALIDATION_AMOUNT_ERROR_LEFT,
  VALIDATION_AMOUNT_ERROR_RIGHT,
} from '../../lib/ContainerConstants'


export default function paymentReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state)
  }

  switch (action.type) {
    case SET_PAYMENT_INITIAL_PARAMETERS: {
      return state.set('actualAmount', action.payload.actualAmount)
        .set('isAmountEditable', action.payload.isAmountEditable)
        .set('maxValue', action.payload.maxValue)
        .set('minValue', action.payload.minValue)
        .set('moneyCollectMaster', action.payload.moneyCollectMaster)
        .set('originalAmount', action.payload.originalAmount)
        .set('paymentModeList', action.payload.paymentModeList)
        .set('splitPaymentMode', action.payload.splitPaymentMode)
        .set('jobTransactionIdAmountMap', action.payload.jobTransactionIdAmountMap)
        .set('isSaveButtonDisabled',action.payload.isSaveButtonDisabled)
    }

    case SET_PAYMENT_CHANGED_PARAMETERS: {
      const { actualAmount, transactionNumber } = action.payload
      let minValue = state.minValue
      let maxValue = state.maxValue
      let isSaveButtonDisabled, paymentError
      if (!actualAmount || !action.payload.selectedPaymentMode) {    //Checking actual amount and selectedPaymentMode to be valid
        isSaveButtonDisabled = true
      } else if (action.payload.selectedPaymentMode !== CHEQUE.id && action.payload.selectedPaymentMode !== DEMAND_DRAFT.id) {       //Checking selectedPaymentMode for cheque or dd
        isSaveButtonDisabled = false
        transactionNumber = null
      } else if (transactionNumber && transactionNumber.trim().length > 3) {      //Checking transactionNumber for length greater than 3
        isSaveButtonDisabled = false
      } else {
        isSaveButtonDisabled = true
      }

      if ((!Number(maxValue) || !Number(minValue)) || (actualAmount >= minValue && actualAmount <= maxValue)) {  //Checking if maxValue or min value present then actual amount lies within the range
        paymentError = null
      } else {
        paymentError = `${VALIDATION_AMOUNT_ERROR_LEFT} ${minValue} ${VALIDATION_AMOUNT_ERROR_RIGHT} ${maxValue}`
        isSaveButtonDisabled = true
      }

      return state.set('actualAmount', actualAmount)
        .set('isSaveButtonDisabled', isSaveButtonDisabled)
        .set('selectedPaymentMode', action.payload.selectedPaymentMode)
        .set('transactionNumber', transactionNumber)
        .set('paymentError', paymentError)
    }

    case SET_SPLIT_PAYMENT: {
      return state.set('splitPaymentMode', action.payload)
        .set('selectedPaymentMode', null)
        .set('isSaveButtonDisabled', true)
    }

    case SET_SELECTED_PAYMENT_MODE: {
      return state.set('selectedPaymentMode', action.payload.selectedPaymentMode)
        .set('isSaveButtonDisabled', action.payload.isSaveButtonDisabled)
        .set('transactionNumber', null)
    }

    case SET_SPLIT_PAYMENT_MODE_LIST: {
      return state.set('splitPaymentModeMap', action.payload.splitPaymentModeMap)
    }

    case CLEAR_PAYMENT_STATE: {
      return initialState
    }

  }

  return state
}