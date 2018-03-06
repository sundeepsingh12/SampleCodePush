'use strict'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../paymentActions'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { fieldDataService } from '../../../services/classes/FieldData'
import { updateFieldDataWithChildData } from '../../form-layout/formLayoutActions'
import { paymentService } from '../../../services/payment/Payment'
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
} from '../../../lib/constants'
import {
    INVALID_CONFIGURATION,
} from '../../../lib/ContainerConstants'


describe('test cases for getPaymentParameters', () => {
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        paymentService.getPaymentParameters = jest.fn()
    })

    const singleJobTransaction = {}
    const multipleJobTransaction = [1]
    const fieldAttributeMasterId = null
    const formData = null
    const jobStatusId = null

    it('set payment initial parameters', () => {
        const store = mockStore({})
        let paymentParameters = {
            actualAmount: null,
            amountEditableObject: null,
            moneyCollectMaster: null,
            originalAmount: null,
            paymentModeList: null,
            splitPaymentMode: null,
            jobTransactionIdAmountMap: null
        }

        let payloadResult = {
            actualAmount: NaN,
            isAmountEditable: true,
            maxValue: null,
            minValue: null,
            moneyCollectMaster: null,
            originalAmount: NaN,
            paymentModeList: null,
            splitPaymentMode: null,
            jobTransactionIdAmountMap: null
        }
        paymentService.getPaymentParameters.mockReturnValue(paymentParameters)
        return store.dispatch(actions.getPaymentParameters(singleJobTransaction, fieldAttributeMasterId, formData, jobStatusId))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(4)
                expect(paymentService.getPaymentParameters).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(CLEAR_PAYMENT_STATE)
                expect(store.getActions()[1].type).toEqual(SET_PAYMENT_INITIAL_PARAMETERS)
                expect(store.getActions()[1].payload).toEqual(payloadResult)
            })
    })

    //TODO find mocking of react components and toast
    // it('throw error in case of amount null and multiple transactions', () => {
    //     const store = mockStore({})
    //     let paymentParameters = {
    //         actualAmount: null,
    //         amountEditableObject: null,
    //         moneyCollectMaster: null,
    //         originalAmount: null,
    //         paymentModeList: null,
    //         splitPaymentMode: null,
    //         jobTransactionIdAmountMap: null
    //     }

    //     let payloadResult = {
    //         actualAmount: NaN,
    //         isAmountEditable: true,
    //         maxValue: null,
    //         minValue: null,
    //         moneyCollectMaster: null,
    //         originalAmount: NaN,
    //         paymentModeList: null,
    //         splitPaymentMode: null,
    //         jobTransactionIdAmountMap: null
    //     }
    //     paymentService.getPaymentParameters.mockReturnValue(paymentParameters)
    //     return store.dispatch(actions.getPaymentParameters(multipleJobTransaction, fieldAttributeMasterId, formData, jobStatusId))
    //         .catch((error) => {
    //             expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(4)
    //             expect(paymentService.getPaymentParameters).toHaveBeenCalledTimes(1)
    //             expect(error.message).toEqual(INVALID_CONFIGURATION)
    //         })
    // })
})

describe('test cases for saveMoneyCollectObject', () => {
    beforeEach(() => {
        paymentService.prepareMoneyCollectChildFieldDataListDTO = jest.fn()
        fieldDataService.prepareFieldDataForTransactionSavingInState = jest.fn()
    })

    const singleJobTransaction = {}
    const multipleJobTransaction = [1]

    it('save money collect field data in form layout state', () => {
        const store = mockStore({})
        const actualAmount = 30.1
        const currentElement = {
            fieldAttributeMasterId: 1
        }
        const formElement = new Map()
        formElement.set(1, {})
        const jobMasterId = null
        const jobId = null
        const latestPositionId = null
        const moneyCollectMaster = {
            attributeTypeId: 18
        }
        const isSaveDisabled = null
        const originalAmount = null
        const selectedPaymentMode = null
        const transactionNumber = null
        const remarks = null
        const receipt = null
        const jobTransactionIdAmountMap = null
        fieldDataService.prepareFieldDataForTransactionSavingInState.mockReturnValue({})
        return store.dispatch(actions.saveMoneyCollectObject(actualAmount, currentElement, formElement, jobMasterId, jobId, singleJobTransaction, latestPositionId, moneyCollectMaster, isSaveDisabled, originalAmount, selectedPaymentMode, transactionNumber, remarks, receipt, jobTransactionIdAmountMap))
            .then(() => {
                expect(store.getActions()[1].type).toEqual(CLEAR_PAYMENT_STATE)
            })
    })
})

describe('test cases for paymentModeSelect', () => {

    it('set payment mode cash and enable save', () => {
        const selectedPaymentMode = {}
        const splitPaymentMode = 'NO'
        const modeTypeId = 1
        const actualAmount = 40
        const transactionNumber = null
        const payloadResult = {
            selectedPaymentMode: 1,
            isSaveButtonDisabled: false
        }
        const store = mockStore({})
        return store.dispatch(actions.paymentModeSelect(selectedPaymentMode, splitPaymentMode, modeTypeId, actualAmount, transactionNumber))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_SELECTED_PAYMENT_MODE)
                expect(store.getActions()[0].payload).toEqual(payloadResult)
            })
    })

    it('set payment mode cheque and enable save', () => {
        const selectedPaymentMode = {}
        const splitPaymentMode = 'NO'
        const modeTypeId = 4
        const actualAmount = 40
        const transactionNumber = '12345'
        const payloadResult = {
            selectedPaymentMode: 4,
            isSaveButtonDisabled: false
        }
        const store = mockStore({})
        return store.dispatch(actions.paymentModeSelect(selectedPaymentMode, splitPaymentMode, modeTypeId, actualAmount, transactionNumber))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_SELECTED_PAYMENT_MODE)
                expect(store.getActions()[0].payload).toEqual(payloadResult)
            })
    })

    it('set split payment,tick cash payment and enable save', () => {
        const selectedPaymentMode = {}
        const splitPaymentMode = 'Yes'
        const modeTypeId = 1
        const actualAmount = 40
        const transactionNumber = null
        const payloadResult = {
            selectedPaymentMode: {
                otherPaymentModeList: {
                    1: true
                }
            },
            isSaveButtonDisabled: false
        }
        const store = mockStore({})
        return store.dispatch(actions.paymentModeSelect(selectedPaymentMode, splitPaymentMode, modeTypeId, actualAmount, transactionNumber))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_SELECTED_PAYMENT_MODE)
                expect(store.getActions()[0].payload).toEqual(payloadResult)
            })
    })

    it('set split payment,untick cash payment and disable save', () => {
        const selectedPaymentMode = {
            otherPaymentModeList: {
                1: true
            }
        }
        const splitPaymentMode = 'Yes'
        const modeTypeId = 1
        const actualAmount = 40
        const transactionNumber = null
        const payloadResult = {
            selectedPaymentMode: {
                otherPaymentModeList: {
                    1: false
                }
            },
            isSaveButtonDisabled: true
        }
        const store = mockStore({})
        return store.dispatch(actions.paymentModeSelect(selectedPaymentMode, splitPaymentMode, modeTypeId, actualAmount, transactionNumber))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_SELECTED_PAYMENT_MODE)
                expect(store.getActions()[0].payload).toEqual(payloadResult)
            })
    })

    it('set split payment,tick card payment and enable save', () => {
        const selectedPaymentMode = {}
        const splitPaymentMode = 'Yes'
        const modeTypeId = 15
        const actualAmount = 40
        const transactionNumber = null
        const payloadResult = {
            selectedPaymentMode: {
                cardPaymentMode: 15
            },
            isSaveButtonDisabled: false
        }
        const store = mockStore({})
        return store.dispatch(actions.paymentModeSelect(selectedPaymentMode, splitPaymentMode, modeTypeId, actualAmount, transactionNumber))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_SELECTED_PAYMENT_MODE)
                expect(store.getActions()[0].payload).toEqual(payloadResult)
            })
    })

    it('set split payment,untick card payment and disable save', () => {
        const selectedPaymentMode = {
            cardPaymentMode: 15
        }
        const splitPaymentMode = 'Yes'
        const modeTypeId = 15
        const actualAmount = 40
        const transactionNumber = null
        const payloadResult = {
            selectedPaymentMode: {
                cardPaymentMode: null
            },
            isSaveButtonDisabled: true
        }
        const store = mockStore({})
        return store.dispatch(actions.paymentModeSelect(selectedPaymentMode, splitPaymentMode, modeTypeId, actualAmount, transactionNumber))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_SELECTED_PAYMENT_MODE)
                expect(store.getActions()[0].payload).toEqual(payloadResult)
            })
    })
})

describe('test cases for getSplitPaymentModeList', () => {
    beforeEach(() => {
        paymentService.prepareSplitPaymentModeList = jest.fn()
    })

    it('set split payment modes to be filled', () => {
        const selectedPaymentMode = {}
        const store = mockStore({})
        paymentService.prepareSplitPaymentModeList.mockReturnValue({ modeTypeId: 1 })
        return store.dispatch(actions.getSplitPaymentModeList(selectedPaymentMode))
            .then(() => {
                expect(paymentService.prepareSplitPaymentModeList).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_SPLIT_PAYMENT_MODE_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    splitPaymentModeMap: { modeTypeId: 1 }
                })
            })
    })
})

describe('test cases for changeChequeOrDDPaymentModeList', () => {
    const modeTypeId = 4
    const splitPaymentModeMap = {
        4: {
            amount: 50,
            list: [
                {
                    modeTypeId: 4,
                    amount: 20
                },
                {
                    modeTypeId: 4,
                    amount: 30
                }
            ]
        }
    }

    it('insert new cheque row', () => {
        const store = mockStore({})
        return store.dispatch(actions.changeChequeOrDDPaymentModeList(modeTypeId, splitPaymentModeMap))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_SPLIT_PAYMENT_MODE_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    splitPaymentModeMap: {
                        4: {
                            amount: 50,
                            list: [
                                {
                                    modeTypeId: 4,
                                    amount: 20
                                },
                                {
                                    modeTypeId: 4,
                                    amount: 30
                                },
                                {
                                    modeTypeId: 4,
                                    amount: null
                                }
                            ]
                        }
                    }
                })
            })
    })

    it('delete cheque row', () => {
        const store = mockStore({})
        return store.dispatch(actions.changeChequeOrDDPaymentModeList(modeTypeId, splitPaymentModeMap, 0))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_SPLIT_PAYMENT_MODE_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    splitPaymentModeMap: {
                        4: {
                            amount: 30,
                            list: [
                                {
                                    modeTypeId: 4,
                                    amount: 30
                                },
                            ]
                        }
                    }
                })
            })
    })
})

describe('test cases for setPaymentAmount', () => {
    const modeTypeId = 1
    const amount = 30
    const splitPaymentModeMap = {
        1: {
            modeTypeId: 1,
            amount: 40
        },
        7: {
            modeTypeId: 1,
            amount: 25
        }
    }

    it('set payment amount in split payment mode map', () => {
        const store = mockStore({})
        return store.dispatch(actions.setPaymentAmount(7, 20, splitPaymentModeMap))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_SPLIT_PAYMENT_MODE_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    splitPaymentModeMap: {
                        1: {
                            modeTypeId: 1,
                            amount: 40
                        },
                        7: {
                            modeTypeId: 1,
                            amount: 20
                        }
                    }
                })
            })
    })
})

describe('test cases for setPaymentParameterForChequeOrDD', () => {
    const modeTypeId = 1
    const arrayIndex = 1
    const splitPaymentModeMap = {
        4: {
            amount: 50,
            list: [
                {
                    modeTypeId: 4,
                    amount: 20
                },
                {
                    modeTypeId: 4,
                    amount: 30
                }
            ]
        }
    }

    it('set payment amount and transaction number for cheque or dd in split and add cheque total amount', () => {
        const store = mockStore({})
        return store.dispatch(actions.setPaymentParameterForChequeOrDD(4, 1, splitPaymentModeMap, 40, '234567'))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_SPLIT_PAYMENT_MODE_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    splitPaymentModeMap : {
                        4: {
                            amount: 60,
                            list: [
                                {
                                    modeTypeId: 4,
                                    amount: 20
                                },
                                {
                                    modeTypeId: 4,
                                    amount: 40,
                                    transactionNumber: '234567'
                                }
                            ]
                        }
                    }
                })
            })
    })

    it('set payment amount and transaction number for cheque or dd in split and subtract cheque total amount', () => {
        const store = mockStore({})
        return store.dispatch(actions.setPaymentParameterForChequeOrDD(4, 1, splitPaymentModeMap, '', null))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_SPLIT_PAYMENT_MODE_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    splitPaymentModeMap : {
                        4: {
                            amount: 20,
                            list: [
                                {
                                    modeTypeId: 4,
                                    amount: 20
                                },
                                {
                                    modeTypeId: 4,
                                    amount: '',
                                    transactionNumber: undefined
                                }
                            ]
                        }
                    }
                })
            })
    })
})