'use strict'

import postAssignmentReducer from '../postAssignmentReducer'
import {
    SET_POST_ASSIGNMENT_TRANSACTION_LIST,
    SET_POST_ASSIGNMENT_ERROR,
    SET_POST_SCAN_SUCCESS,
} from '../../../lib/constants'

import InitialState from '../postAssignmentInitialState'

describe('test cases for case SET_POST_ASSIGNMENT_TRANSACTION_LIST', () => {
    it('should set jobTransaction list', () => {
        const jobTransactionMap = {
            '123': {
                id: 1,
                referenceNumber: '123'
            }
        }
        const action = {
            type: SET_POST_ASSIGNMENT_TRANSACTION_LIST,
            payload: {
                jobTransactionMap,
                loading: false,
                pendingCount: 3,
                scanError: 'Error'
            }
        }
        let nextState = postAssignmentReducer(undefined, action)
        expect(nextState.jobTransactionMap).toEqual(jobTransactionMap)
        expect(nextState.loading).toEqual(false)
        expect(nextState.pendingCount).toEqual(3)
        expect(nextState.scanError).toEqual('Error')
        expect(nextState.scanSuccess).toEqual(false)
        expect(nextState.error).toEqual(null)
    })
})

describe('test cases for case SET_POST_ASSIGNMENT_ERROR', () => {
    it('should set error', () => {
        const action = {
            type: SET_POST_ASSIGNMENT_ERROR,
            payload: {
                error: 'Test Error'
            }
        }
        let nextState = postAssignmentReducer(undefined, action)
        expect(nextState.loading).toEqual(false)
        expect(nextState.scanSuccess).toEqual(false)
        expect(nextState.error).toEqual('Test Error')
    })
})

describe('test cases for case SET_POST_SCAN_SUCCESS', () => {
    it('should set scan error', () => {
        const action = {
            type: SET_POST_SCAN_SUCCESS,
            payload: {
                scanSuccess: false,
                scanError: 'Test Error'
            }
        }
        let nextState = postAssignmentReducer(undefined, action)
        expect(nextState.loading).toEqual(false)
        expect(nextState.scanSuccess).toEqual(false)
        expect(nextState.error).toEqual(null)
        expect(nextState.scanError).toEqual('Test Error')
    })
})


describe('test cases for undefined action', () => {
    it('should return initial state', () => {
        const action = {
            type: undefined,
        }
        let nextState = postAssignmentReducer(undefined, action)
        expect(nextState.jobTransactionMap).toEqual(null)
        expect(nextState.loading).toEqual(null)
        expect(nextState.pendingCount).toEqual(0)
        expect(nextState.error).toEqual(null)
        expect(nextState.scanSuccess).toEqual(false)
        expect(nextState.scanError).toEqual(null)

    })
})