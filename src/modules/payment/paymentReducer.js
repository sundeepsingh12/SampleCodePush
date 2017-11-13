'use strict'

const InitialState = require('./paymentInitialState').default

const initialState = new InitialState()
import {
  CLEAR_PAYMENT_STATE,
  SET_PAYMENT_CHANGED_PARAMETERS,
  SET_PAYMENT_INITIAL_PARAMETERS,
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
} from '../../lib/AttributeConstants'


export default function paymentReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch (action.type) {
    case SET_PAYMENT_INITIAL_PARAMETERS: {
      return state.set('actualAmount', action.payload.actualAmount)
        .set('isAmountEditable', action.payload.isAmountEditable)
        .set('maxValue', action.payload.maxValue)
        .set('minValue', action.payload.minValue)
        .set('moneyCollectMaster', action.payload.moneyCollectMaster)
        .set('originalAmount', action.payload.originalAmount)
        .set('paymentModeList', action.payload.paymentModeList)
    }

    case SET_PAYMENT_CHANGED_PARAMETERS: {
      const actualAmount = action.payload.actualAmount
      const transactionNumber = action.payload.transactionNumber
      let minValue = state.minValue
      let maxValue = state.maxValue
      let isSaveButtonDisabled, paymentError
      if (!actualAmount || !action.payload.selectedIndex) {
        isSaveButtonDisabled = true
      } else if (action.payload.selectedIndex !== CHEQUE.id && action.payload.selectedIndex !== DEMAND_DRAFT.id) {
        isSaveButtonDisabled = false
        transactionNumber = null
      } else if (transactionNumber && transactionNumber.trim().length > 3) {
        isSaveButtonDisabled = false
      } else {
        isSaveButtonDisabled = true
      }

      if ((maxValue == null || maxValue == undefined || maxValue == NaN || minValue == null || minValue == undefined || minValue == NaN) || (actualAmount >= minValue && actualAmount <= maxValue)) {
        paymentError = null
      } else {
        paymentError = `Amount should be greater than or equal to ${minValue} and less than or equal to ${maxValue}`
        isSaveButtonDisabled = true
      }

      return state.set('actualAmount', actualAmount)
        .set('isSaveButtonDisabled', isSaveButtonDisabled)
        .set('selectedIndex', action.payload.selectedIndex)
        .set('transactionNumber', transactionNumber)
        .set('paymentError', paymentError)
    }

    case CLEAR_PAYMENT_STATE: {
      return initialState
    }
  }

  return state
}