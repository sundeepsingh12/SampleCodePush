'use strict'
import {
    JOB_MASTER,
    JOB_STATUS,
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS,
    SET_LOADER_FOR_PAYBYLINK,
    SET_PAY_BY_LINK_PARAMETERS,
    SET_PAY_BY_LINK_MESSAGE,
    SET_BULK_SEARCH_TEXT,
    CUSTOMIZATION_LIST_MAP,
    SET_BULK_ERROR_MESSAGE,
    SET_BULK_TRANSACTION_PARAMETERS
} from '../../../../lib/constants'
import thunk from 'redux-thunk'
import {TRANSACTION_PENDING, TRANSACTION_SUCCESSFUL} from '../../../../lib/ContainerConstants'
import { keyValueDBService } from '../../../../services/classes/KeyValueDBService'
var actions = require('../payByLinkPaymentActions')
import { payByLinkPaymentService } from '../../../../services/payment/PayByLinkPayment'

import configureStore from 'redux-mock-store'
import { paymentService } from '../../../../services/payment/Payment'
 import { MosambeeWalletPaymentServices } from '../../../../services/payment/MosambeeWalletPayment';
const middlewares = [thunk]
const mockStore = configureStore(middlewares)


describe('test for set payByLink parameters', () => {

    it('should get parameters without error', () => {
        const jobTransaction = {
                id: 1,
                jobId: 1,
                jobMasterId: 1
        }
        const customerContact = 123213223
        const jobTransactionIdAmountMap = null
        let  walletParameters = {
            apiPassword : 1,
            secretKey : 2,
            contactData : 2131324543
        }

        const expectedActions = [
            {
                type: SET_LOADER_FOR_PAYBYLINK,
                payload: true
            },
            {
                type: SET_PAY_BY_LINK_PARAMETERS,
                payload: {
                    payByLinkConfigJSON: {
                        apiPassword : 2,
                        secretKey : 1,
                        contactData : 2131324543
                    }, 
                    customerContact 
                }
            }
        ]

        MosambeeWalletPaymentServices.setWalletListAndWalletParameters = jest.fn()
        MosambeeWalletPaymentServices.setWalletListAndWalletParameters.mockReturnValue({walletParameters: walletParameters})
        const store = mockStore({})
        return store.dispatch(actions.getPayByLinkPaymentParameters(customerContact, jobTransaction, jobTransactionIdAmountMap))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(MosambeeWalletPaymentServices.setWalletListAndWalletParameters).toHaveBeenCalled()
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})

describe('test for hit payByLink payment api for payment', () => {

    it('should hit api for payment', () => {
        const jobTransaction = {
                id: 1,
                jobId: 1,
                jobMasterId: 1
        }
        const customerContact = 123213223
        const jobTransactionIdAmountMap = null
        let  walletParameters = {
            apiPassword : 1,
            secretKey : 2,
            contactData : 2131324543
        }

        const payByLinkConfigJSON = {
            apiPassword : 1,
            secretKey : 2,
            contactData : 2131324543
        }
        const payByLinkId = 97
        const navigationParams = {
            formLayoutState : null, jobMasterId : 1, jobTransaction
        }
        const data = {
            status: 'success',
            transId : 3212332,
            message: 'Transaction Successful.'
        }

        const expectedActions = [
            {
                type: SET_LOADER_FOR_PAYBYLINK,
                payload: true
            },
            {
                type: SET_PAY_BY_LINK_MESSAGE,
                payload: 'Transaction Successful.'
            }
        ]

        payByLinkPaymentService.prepareJsonAndHitPayByLinkUrl = jest.fn()
        MosambeeWalletPaymentServices.updateDraftInMosambee = jest.fn()
        payByLinkPaymentService.prepareJsonAndHitPayByLinkUrl.mockReturnValue(data)
        const store = mockStore({})
        return store.dispatch(actions.hitPayByLinkApiForPayment(customerContact, payByLinkConfigJSON, payByLinkId, navigationParams))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(payByLinkPaymentService.prepareJsonAndHitPayByLinkUrl).toHaveBeenCalled()
                expect(MosambeeWalletPaymentServices.updateDraftInMosambee).toHaveBeenCalled()
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})

describe('test for hit checkTransactionApi for testing payment is complete', () => {
    const jobTransaction = {
        id: 1,
        jobId: 1,
        jobMasterId: 1
}
const customerContact = 123213223
const payByLinkConfigJSON = {
    apiPassword : 1,
    secretKey : 2,
    contactData : 2131324543,
    actualAmount: 10
}
const navigationParams = {
    formLayoutState : null, 
    jobMasterId : 1, 
    jobTransaction,
    contactData: customerContact,
    navigationFormLayoutStates : null, 
    previousStatusSaveActivated : false, 
    taskListScreenDetails: null 
}
it('should hit checktransaction Api for payment successful', () => {
    MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi = jest.fn()

    const expectedActions = [
        {
            type: SET_LOADER_FOR_PAYBYLINK,
            payload: true
        },
        {
            type: SET_PAY_BY_LINK_MESSAGE,
            payload: TRANSACTION_SUCCESSFUL
        }
    ]
    paymentService.addPaymentObjectToDetailsArray = jest.fn()
    MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi.mockReturnValueOnce({transId : '12345'})
    const store = mockStore({})
    return store.dispatch(actions.hitCheckTransactionApiForCheckingPayment(payByLinkConfigJSON, navigationParams))
        .then(() => {
            expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
            expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            expect(MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi).toHaveBeenCalled()
            expect(paymentService.addPaymentObjectToDetailsArray).toHaveBeenCalled()
        })
})

    it('should hit checktransaction Api for payment failed', () => {
        MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi = jest.fn()

        const expectedActions = [
            {
                type: SET_LOADER_FOR_PAYBYLINK,
                payload: true
            },
            {
                type: SET_PAY_BY_LINK_MESSAGE,
                payload: TRANSACTION_PENDING
            }
        ]
        MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi.mockReturnValue({transId : null})
        const store = mockStore({})
        return store.dispatch(actions.hitCheckTransactionApiForCheckingPayment(payByLinkConfigJSON, navigationParams))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi).toHaveBeenCalled()
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
    it('should hit checktransaction Api and throw error', () => {
        MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi = jest.fn()

        const expectedActions = [
            {
                type: SET_LOADER_FOR_PAYBYLINK,
                payload: true
            },
            {
                type: SET_PAY_BY_LINK_MESSAGE,
                payload: TRANSACTION_PENDING
            }
        ]
        MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.hitCheckTransactionApiForCheckingPayment(payByLinkConfigJSON, navigationParams))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi).toHaveBeenCalled()
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})