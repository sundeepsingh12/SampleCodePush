'use strict'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../postAssignmentActions'

import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { moduleCustomizationService } from '../../../services/classes/ModuleCustomization'
import { jobMasterService } from '../../../services/classes/JobMaster'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
import {
    SET_POST_ASSIGNMENT_TRANSACTION_LIST,
    SET_POST_SCAN_SUCCESS,
    SET_POST_ASSIGNMENT_ERROR,
} from '../../../lib/constants'
import { jobTransactionService } from '../../../services/classes/JobTransaction';
import { jobStatusService } from '../../../services/classes/JobStatus';
import { postAssignmentService } from '../../../services/classes/PostAssignment';

describe('test cases for fetchUnseenJobs', () => {
    beforeEach(() => {
        jobTransactionService.getUnseenJobTransaction = jest.fn()
        jobMasterService.getJobMasterFromJobMasterList = jest.fn()
    })

    const jobMaster = 1

    it('should set empty job transaction', () => {
        const store = mockStore({})
        jobMasterService.getJobMasterFromJobMasterList.mockReturnValue({ id: 1 })
        jobTransactionService.getUnseenJobTransaction.mockReturnValue({
            jobTransactionMap: {},
            pendingCount: 0
        })
        return store.dispatch(actions.fetchUnseenJobs(jobMaster))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    jobTransactionMap: null,
                    loading: true,
                    jobMaster: null
                })
                expect(jobMasterService.getJobMasterFromJobMasterList).toHaveBeenCalledTimes(1)
                expect(jobTransactionService.getUnseenJobTransaction).toHaveBeenCalledTimes(1)
                expect(store.getActions()[1].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[1].payload).toEqual({
                    jobTransactionMap: {},
                    loading: false,
                    pendingCount: 0
                })
            })
    })

    it('should set job transaction map', () => {
        const store = mockStore({})
        let jobTransactionMap = {
            '123': {
                id: 1,
                referenceNumber: '123'
            },
            '124': {
                id: 2,
                referenceNumber: '124'
            }
        }
        jobTransactionService.getUnseenJobTransaction.mockReturnValue({
            jobTransactionMap,
            pendingCount: 0
        })
        jobMasterService.getJobMasterFromJobMasterList.mockReturnValue([{ id: 1 }])
        return store.dispatch(actions.fetchUnseenJobs(jobMaster))
            .then(() => {
                expect(jobMasterService.getJobMasterFromJobMasterList).toHaveBeenCalledTimes(1)
                expect(jobTransactionService.getUnseenJobTransaction).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    jobTransactionMap: null,
                    loading: true,
                    jobMaster: null
                })
                expect(store.getActions()[1].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[1].payload).toEqual({
                    jobTransactionMap,
                    loading: false,
                    pendingCount: 0,
                    jobMaster: { id: 1 }
                })
            })
    })

    it('should throw error while fetching job transaction', () => {
        const store = mockStore({})
        jobTransactionService.getUnseenJobTransaction = jest.fn(() => {
            throw new Error('error')
        })
        return store.dispatch(actions.fetchUnseenJobs(jobMaster))
            .then(() => {
                expect(jobTransactionService.getUnseenJobTransaction).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    jobTransactionMap: null,
                    loading: true,
                    jobMaster: null
                })
                expect(store.getActions()[1].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[1].payload).toEqual({
                    jobTransactionMap: null,
                    loading: false,
                    jobMaster: null
                })
            })
    })
})

describe('test cases for checkScannedJob', () => {
    beforeEach(() => {
        jobStatusService.getStatusForJobMasterIdAndCode = jest.fn()
        postAssignmentService.checkScanResult = jest.fn()
    })

    const referenceNumber = '123'
    const jobTransactionMap = {}
    const jobMaster = {}
    const pendingCount = 3
    it('successful manual scan', () => {
        const store = mockStore({})
        let jobTransactionMapResult = {
            '123': {}
        }
        postAssignmentService.checkScanResult.mockReturnValue({
            jobTransactionMap: jobTransactionMapResult,
            pendingCount: 2
        })
        return store.dispatch(actions.checkScannedJob(referenceNumber, jobTransactionMap, jobMaster, false, pendingCount, false))
            .then(() => {
                expect(jobStatusService.getStatusForJobMasterIdAndCode).toHaveBeenCalledTimes(1)
                expect(postAssignmentService.checkScanResult).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    jobTransactionMap,
                    loading: true,
                    pendingCount,
                    scanError: null,
                    jobMaster: {}
                })
                expect(store.getActions()[1].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[1].payload).toEqual({
                    jobTransactionMap: jobTransactionMapResult,
                    loading: false,
                    pendingCount: 2,
                    jobMaster: {}

                })
            })
    })

    it('successful scan', () => {
        const store = mockStore({})
        let jobTransactionMapResult = {
            '123': {}
        }
        postAssignmentService.checkScanResult.mockReturnValue({
            jobTransactionMap: jobTransactionMapResult,
            pendingCount: 2
        })
        return store.dispatch(actions.checkScannedJob(referenceNumber, jobTransactionMap, jobMaster, false, pendingCount, true))
            .then(() => {
                setTimeout(() => {
                    expect(store.getActions()[2].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                    expect(store.getActions()[2].payload).toEqual({
                        jobTransactionMap: jobTransactionMapResult,
                        loading: false,
                        pendingCount: 2,
                        jobMaster: {}
                    })
                }, 3000)

                expect(jobStatusService.getStatusForJobMasterIdAndCode).toHaveBeenCalledTimes(1)
                expect(postAssignmentService.checkScanResult).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    jobTransactionMap,
                    loading: true,
                    pendingCount,
                    scanError: null,
                    jobMaster: {}
                })
                expect(store.getActions()[1].type).toEqual(SET_POST_SCAN_SUCCESS)
                expect(store.getActions()[1].payload).toEqual({
                    scanSuccess: true
                })
            })
    })

    it('unsuccessful scan', () => {
        const store = mockStore({})
        let jobTransactionMapResult = {
            '123': {}
        }
        postAssignmentService.checkScanResult = jest.fn(() => {
            throw new Error('Test Error')
        })
        return store.dispatch(actions.checkScannedJob(referenceNumber, jobTransactionMap, jobMaster, false, pendingCount, false))
            .then(() => {
                expect(jobStatusService.getStatusForJobMasterIdAndCode).toHaveBeenCalledTimes(1)
                expect(postAssignmentService.checkScanResult).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    jobTransactionMap,
                    loading: true,
                    pendingCount,
                    jobMaster: {},
                    scanError: null
                })
                expect(store.getActions()[1].type).toEqual(SET_POST_ASSIGNMENT_ERROR)
                expect(store.getActions()[1].payload).toEqual({
                    error: 'Test Error'
                })
            })
    })

    it('unsuccessful scan for force assigned', () => {
        const store = mockStore({})
        let jobTransactionMapResult = {
            '123': {}
        }
        postAssignmentService.checkScanResult.mockReturnValue({
            jobTransactionMap,
            pendingCount,
            scanError: 'Test Error'
        })
        return store.dispatch(actions.checkScannedJob(referenceNumber, jobTransactionMap, jobMaster, true, pendingCount, true))
            .then(() => {
                expect(jobStatusService.getStatusForJobMasterIdAndCode).toHaveBeenCalledTimes(1)
                expect(postAssignmentService.checkScanResult).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[0].payload).toEqual({
                    jobTransactionMap,
                    loading: true,
                    pendingCount,
                    scanError: null,
                    jobMaster: {}
                })
                expect(store.getActions()[1].type).toEqual(SET_POST_ASSIGNMENT_TRANSACTION_LIST)
                expect(store.getActions()[1].payload).toEqual({
                    jobTransactionMap,
                    loading: false,
                    pendingCount,
                    scanError: 'Test Error',
                    jobMaster: {}
                })
            })
    })
})