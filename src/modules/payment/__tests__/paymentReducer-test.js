'use strict'

import {
    SET_PAYMENT_INITIAL_PARAMETERS,
    SET_SPLIT_PAYMENT,
    SET_SELECTED_PAYMENT_MODE,
    SET_SPLIT_PAYMENT_MODE_LIST,
    CLEAR_PAYMENT_STATE,
    SET_PAYMENT_CHANGED_PARAMETERS
} from '../../../lib/constants'

import paymentReducer from '../paymentReducer'
import InitialState from '../paymentInitialState'
import { Record } from 'immutable'

describe('payment reducer', () => {
    it('it should set payment initial parameters', () => {
        const action = {
            type: SET_PAYMENT_INITIAL_PARAMETERS,
            payload: {
                actualAmount: 30,
                isAmountEditable: false,
                maxValue: 100,
                minValue: 10,
                moneyCollectMaster: {},
                originalAmount: 30,
                paymentModeList: {},
                splitPaymentMode: null,
                jobTransactionIdAmountMap: null
            }
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.actualAmount).toBe(action.payload.actualAmount)
        expect(nextState.isAmountEditable).toBe(action.payload.isAmountEditable)
        expect(nextState.maxValue).toBe(action.payload.maxValue)
        expect(nextState.minValue).toBe(action.payload.minValue)
        expect(nextState.moneyCollectMaster).toBe(action.payload.moneyCollectMaster)
        expect(nextState.originalAmount).toBe(action.payload.originalAmount)
        expect(nextState.paymentModeList).toBe(action.payload.paymentModeList)
        expect(nextState.splitPaymentMode).toBe(action.payload.splitPaymentMode)
        expect(nextState.jobTransactionIdAmountMap).toBe(action.payload.jobTransactionIdAmountMap)
    })

    it('should set split payment initial parameters', () => {
        const action = {
            type: SET_SPLIT_PAYMENT,
            payload: {
                1: {
                    modeTypeId: 1
                }
            }
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.splitPaymentMode).toBe(action.payload)
        expect(nextState.selectedPaymentMode).toBe(null)
        expect(nextState.isSaveButtonDisabled).toBe(true)
    })

    it('should set selected payment mode', () => {
        const action = {
            type: SET_SELECTED_PAYMENT_MODE,
            payload: {
                selectedPaymentMode: 1,
                isSaveButtonDisabled: true
            }
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.selectedPaymentMode).toBe(action.payload.selectedPaymentMode)
        expect(nextState.isSaveButtonDisabled).toBe(action.payload.isSaveButtonDisabled)
        expect(nextState.transactionNumber).toBe(null)
    })

    it('should set selected split payment mode list', () => {
        const action = {
            type: SET_SPLIT_PAYMENT_MODE_LIST,
            payload: {
                splitPaymentModeMap: {
                    1: {}
                }
            }
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.splitPaymentModeMap).toBe(action.payload.splitPaymentModeMap)
    })

    it('should set clear payment state', () => {
        const action = {
            type: CLEAR_PAYMENT_STATE,
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.actualAmount).toBe(null)
        expect(nextState.paymentError).toBe(null)
        expect(nextState.isAmountEditable).toBe(false)
        expect(nextState.maxValue).toBe(null)
        expect(nextState.minValue).toBe(null)
        expect(nextState.moneyCollectMaster).toBe(null)
        expect(nextState.originalAmount).toBe(null)
        expect(nextState.paymentModeList).toEqual({})
        expect(nextState.selectedPaymentMode).toBe(0)
        expect(nextState.isSaveButtonDisabled).toBe(true)
        expect(nextState.transactionNumber).toBe(null)
        expect(nextState.splitPaymentMode).toBe(null)
        expect(nextState.splitPaymentModeMap).toEqual({})
        expect(nextState.jobTransactionIdAmountMap).toBe(null)
    })

    it('should set payment parameters for normal type payment', () => {
        const action = {
            type: SET_PAYMENT_CHANGED_PARAMETERS,
            payload: {
                actualAmount: 10,
                transactionNumber: null,
                selectedPaymentMode: 1
            }
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.actualAmount).toBe(action.payload.actualAmount)
        expect(nextState.isSaveButtonDisabled).toBe(false)
        expect(nextState.selectedPaymentMode).toBe(action.payload.selectedPaymentMode)
        expect(nextState.transactionNumber).toBe(action.payload.transactionNumber)
        expect(nextState.paymentError).toBe(null)
    })

    it('payment parameters in case of cheque payment mode but transaction number null', () => {
        const action = {
            type: SET_PAYMENT_CHANGED_PARAMETERS,
            payload: {
                actualAmount: 10,
                transactionNumber: null,
                selectedPaymentMode: 4
            }
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.actualAmount).toBe(action.payload.actualAmount)
        expect(nextState.isSaveButtonDisabled).toBe(true)
        expect(nextState.selectedPaymentMode).toBe(action.payload.selectedPaymentMode)
        expect(nextState.transactionNumber).toBe(action.payload.transactionNumber)
        expect(nextState.paymentError).toBe(null)
    })

    it('payment parameters in case of cheque payment mode and transaction number less than 4', () => {
        const action = {
            type: SET_PAYMENT_CHANGED_PARAMETERS,
            payload: {
                actualAmount: 10,
                transactionNumber: '123',
                selectedPaymentMode: 4
            }
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.actualAmount).toBe(action.payload.actualAmount)
        expect(nextState.isSaveButtonDisabled).toBe(true)
        expect(nextState.selectedPaymentMode).toBe(action.payload.selectedPaymentMode)
        expect(nextState.transactionNumber).toBe(action.payload.transactionNumber)
        expect(nextState.paymentError).toBe(null)
    })

    it('payment parameters in case of cheque payment mode and transaction number greater or equal to 4', () => {
        const action = {
            type: SET_PAYMENT_CHANGED_PARAMETERS,
            payload: {
                actualAmount: 10,
                transactionNumber: '12345',
                selectedPaymentMode: 4
            }
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.actualAmount).toBe(action.payload.actualAmount)
        expect(nextState.isSaveButtonDisabled).toBe(false)
        expect(nextState.selectedPaymentMode).toBe(action.payload.selectedPaymentMode)
        expect(nextState.transactionNumber).toBe(action.payload.transactionNumber)
        expect(nextState.paymentError).toBe(null)
    })

    it('payment parameters in case of cheque payment mode but amount 0', () => {
        const action = {
            type: SET_PAYMENT_CHANGED_PARAMETERS,
            payload: {
                actualAmount: 0,
                transactionNumber: '12345',
                selectedPaymentMode: 4
            }
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.actualAmount).toBe(action.payload.actualAmount)
        expect(nextState.isSaveButtonDisabled).toBe(true)
        expect(nextState.selectedPaymentMode).toBe(action.payload.selectedPaymentMode)
        expect(nextState.transactionNumber).toBe(action.payload.transactionNumber)
        expect(nextState.paymentError).toBe(null)
    })

    it('payment parameters in case of no payment mode selected', () => {
        const action = {
            type: SET_PAYMENT_CHANGED_PARAMETERS,
            payload: {
                actualAmount: 30,
                transactionNumber: null,
                selectedPaymentMode: 0
            }
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.actualAmount).toBe(action.payload.actualAmount)
        expect(nextState.isSaveButtonDisabled).toBe(true)
        expect(nextState.selectedPaymentMode).toBe(action.payload.selectedPaymentMode)
        expect(nextState.transactionNumber).toBe(action.payload.transactionNumber)
        expect(nextState.paymentError).toBe(null)
    })

    it('payment parameters in case of cash payment mode and transaction number', () => {
        const action = {
            type: SET_PAYMENT_CHANGED_PARAMETERS,
            payload: {
                actualAmount: 20,
                transactionNumber: '12345',
                selectedPaymentMode: 1
            }
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.actualAmount).toBe(action.payload.actualAmount)
        expect(nextState.isSaveButtonDisabled).toBe(false)
        expect(nextState.selectedPaymentMode).toBe(action.payload.selectedPaymentMode)
        expect(nextState.transactionNumber).toBe(null)
        expect(nextState.paymentError).toBe(null)
    })

    it('payment parameters in case of min and max value present', () => {
        const action = {
            type: SET_PAYMENT_CHANGED_PARAMETERS,
            payload: {
                actualAmount: 20,
                transactionNumber: '12345',
                selectedPaymentMode: 1
            }
        }
        let currentState = new InitialState()
        currentState = currentState.set('minValue', 40)
        currentState = currentState.set('maxValue', 100)
        let nextState = paymentReducer(currentState, action)
        expect(nextState.actualAmount).toBe(action.payload.actualAmount)
        expect(nextState.isSaveButtonDisabled).toBe(true)
        expect(nextState.selectedPaymentMode).toBe(action.payload.selectedPaymentMode)
        expect(nextState.transactionNumber).toBe(null)
        expect(nextState.paymentError).toBe('Amount should be greater than or equal to 40 and less than or equal to 100')
    })

    it('payment parameters in case of min and max value present', () => {
        const action = {
            type: SET_PAYMENT_CHANGED_PARAMETERS,
            payload: {
                actualAmount: 20,
                transactionNumber: '12345',
                selectedPaymentMode: 1
            }
        }
        let currentState = new InitialState()
        currentState = currentState.set('minValue', 10)
        currentState = currentState.set('maxValue', 100)
        let nextState = paymentReducer(currentState, action)
        expect(nextState.actualAmount).toBe(action.payload.actualAmount)
        expect(nextState.isSaveButtonDisabled).toBe(false)
        expect(nextState.selectedPaymentMode).toBe(action.payload.selectedPaymentMode)
        expect(nextState.transactionNumber).toBe(null)
        expect(nextState.paymentError).toBe(null)
    })

    it('payment parameters in case undefined action', () => {
        const action = {
            type: 'SET_PAYMENT_CHANGED_PARAMETERS_UNDEFINED',
        }
        let nextState = paymentReducer(undefined, action)
        expect(nextState.actualAmount).toBe(null)
        expect(nextState.paymentError).toBe(null)
        expect(nextState.isAmountEditable).toBe(false)
        expect(nextState.maxValue).toBe(null)
        expect(nextState.minValue).toBe(null)
        expect(nextState.moneyCollectMaster).toBe(null)
        expect(nextState.originalAmount).toBe(null)
        expect(nextState.paymentModeList).toEqual({})
        expect(nextState.selectedPaymentMode).toBe(0)
        expect(nextState.isSaveButtonDisabled).toBe(true)
        expect(nextState.transactionNumber).toBe(null)
        expect(nextState.splitPaymentMode).toBe(null)
        expect(nextState.splitPaymentModeMap).toEqual({})
        expect(nextState.jobTransactionIdAmountMap).toBe(null)
    })
})