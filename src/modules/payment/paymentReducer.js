'use strict'

const InitialState = require('./paymentInitialState').default

const initialState = new InitialState()
const {
  SET_PAYMENT_CHANGED_PARAMETERS,
  SET_PAYMENT_INITIAL_PARAMETERS,
} = require('../../lib/constants').default

const {
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
} = require('../../lib/AttributeConstants')


export default function paymentReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch (action.type) {
    case SET_PAYMENT_INITIAL_PARAMETERS:
      return state.set('actualAmount', action.payload.actualAmount)
        .set('isAmountEditable', action.payload.isAmountEditable)
        .set('moneyCollectMaster', action.payload.moneyCollectMaster)
        .set('originalAmount', action.payload.originalAmount)
        .set('paymentModeList', action.payload.paymentModeList)

    case SET_PAYMENT_CHANGED_PARAMETERS:
      const actualAmount = action.payload.actualAmount
      const transactionNumber = action.payload.transactionNumber
      let isSaveButtonDisabled
      if (actualAmount == undefined || actualAmount == null || actualAmount.length == 0 || !action.payload.selectedIndex) {
        isSaveButtonDisabled = true
      } else if (action.payload.selectedIndex !== CHEQUE.id && action.payload.selectedIndex !== DEMAND_DRAFT.id) {
        isSaveButtonDisabled = false
      } else if (transactionNumber && transactionNumber.trim().length > 3) {
        isSaveButtonDisabled = false
      } else {
        isSaveButtonDisabled = true
      }

      return state.set('actualAmount', actualAmount)
        .set('isSaveButtonDisabled', isSaveButtonDisabled)
        .set('selectedIndex', action.payload.selectedIndex)
        .set('transactionNumber', transactionNumber)
  }

  return state
}