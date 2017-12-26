'use strict'
import { keyValueDBService } from "../classes/KeyValueDBService";
import { postAssignmentService } from "../classes/PostAssignment";
import { restAPI } from "../../lib/RestAPI";
import {
    TOKEN_MISSING,
    NOT_FOUND,
    SHIPMENT_ALREADY_SCANNED,
    SHIPMENT_NOT_FOUND,
} from '../../lib/ContainerConstants'

import { formLayoutEventsInterface } from '../classes/formLayout/FormLayoutEventInterface'
import * as realm from '../../repositories/realmdb'
import { error } from "util";

describe('test cases for savePostJobOrder', () => {

    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
    })

    it('inserts empty list in store', () => {
        let successList = []
        return postAssignmentService.savePostJobOrder(successList).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
        })
    })

    it('inserts list in store', () => {
        let successList = ['123', '234']
        return postAssignmentService.savePostJobOrder(successList)
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            })
    })

    it('inserts concatenated list in store', () => {
        let successList = ['123', '234']
        keyValueDBService.getValueFromStore.mockReturnValue({
            value : ['122']
        })
        return postAssignmentService.savePostJobOrder(successList)
            .then((result) => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            })
    })

    it('inserts concatenated list in store', () => {
        let successList = ['123', '234']
        keyValueDBService.getValueFromStore.mockReturnValue({
            value : null
        })
        return postAssignmentService.savePostJobOrder(successList)
            .then((result) => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            })
    })
})

describe('test cases for checkPostJobOnServer', () => {
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
        restAPI.initialize = jest.fn()
        restAPI.serviceCall = jest.fn()
    })
    let referenceNumber = '123'
    let jobMaster = {
        id: 12
    }
    let jobTransactionMap = {}

    it('should throw error for token missing', () => {
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        return postAssignmentService.checkPostJobOnServer(referenceNumber, jobMaster, jobTransactionMap)
            .then(() => { })
            .catch((error) => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(restAPI.initialize).not.toHaveBeenCalled()
                expect(restAPI.serviceCall).not.toHaveBeenCalled()
                expect(error.message).toEqual(TOKEN_MISSING)
            })
    })

    it('should hit force assign api and save success list ', () => {
        keyValueDBService.getValueFromStore.mockReturnValueOnce({ value: {} })
        keyValueDBService.getValueFromStore.mockReturnValueOnce({ value: [] })
        restAPI.serviceCall.mockReturnValue({
            json: [{
                notFoundList: [],
                successList: ['123'],
                message: '',
            }]
        })
        return postAssignmentService.checkPostJobOnServer(referenceNumber, jobMaster, jobTransactionMap)
            .then((data) => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(restAPI.initialize).toHaveBeenCalledTimes(1)
                expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
                expect(data).toEqual(null)
            })
    })

    it('should hit force assign api and save not found list and return error message', () => {
        keyValueDBService.getValueFromStore.mockReturnValueOnce({ value: {} })
        keyValueDBService.getValueFromStore.mockReturnValueOnce({ value: [] })
        restAPI.serviceCall.mockReturnValue({
            json: [{
                notFoundList: ['123'],
                successList: [],
                message: '',
            }]
        })
        return postAssignmentService.checkPostJobOnServer(referenceNumber, jobMaster, jobTransactionMap)
            .then((data) => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(restAPI.initialize).toHaveBeenCalledTimes(1)
                expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
                expect(data).toEqual(NOT_FOUND)
            })
    })

    it('should hit force assign api and save not found list and return error message returned by server', () => {
        keyValueDBService.getValueFromStore.mockReturnValueOnce({ value: {} })
        keyValueDBService.getValueFromStore.mockReturnValueOnce({ value: [] })
        restAPI.serviceCall.mockReturnValue({
            json: [{
                notFoundList: ['123'],
                successList: [],
                message: 'Order not of hub',
            }]
        })
        return postAssignmentService.checkPostJobOnServer(referenceNumber, jobMaster, jobTransactionMap)
            .then((data) => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(restAPI.initialize).toHaveBeenCalledTimes(1)
                expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
                expect(data).toEqual('Order not of hub')
            })
    })

})

describe('test cases for updateTransactionStatus', () => {
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        formLayoutEventsInterface._updateRunsheetSummary = jest.fn()
        formLayoutEventsInterface._updateJobSummary = jest.fn()
        formLayoutEventsInterface.addTransactionsToSyncList = jest.fn()
        realm.performBatchSave = jest.fn()
    })

    const transaction = {
        id: 123,
        referenceNumber: 'xyz',
    }

    const pendingStatus = {
        id: 12,
        statusCategory: 'PENDING',
    }

    const jobMaster = {
        code: 'JBM'
    }

    it('should update transaction status,runsheet and job summary', () => {
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                employeeCode: 'xyz'
            }
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                code: 'abc'
            }
        })
        return postAssignmentService.updateTransactionStatus(transaction, pendingStatus, jobMaster)
            .then(() => {
                expect(formLayoutEventsInterface._updateRunsheetSummary).toHaveBeenCalledTimes(1)
                expect(formLayoutEventsInterface._updateJobSummary).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(realm.performBatchSave).toHaveBeenCalledTimes(1)
                expect(formLayoutEventsInterface.addTransactionsToSyncList).toHaveBeenCalledTimes(1)
            })
    })
})

describe('test cases for checkScanResult', () => {
    beforeEach(() => {
        postAssignmentService.updateTransactionStatus = jest.fn()
        postAssignmentService.checkPostJobOnServer = jest.fn()
    })
    const referenceNumber = '123'
    // const jobTransactionMap = {}
    const pendingStatus = 11
    const jobMaster = {
        id: 1,
        code: 'ABC'
    }
    const isForceAssignmentAllowed = false
    const pendingCount = 4

    it('should throw error for already scanned shipment', () => {
        const jobTransactionMap = {
            123: {
                isScanned: true
            }
        }

        return postAssignmentService.checkScanResult(referenceNumber, jobTransactionMap, pendingStatus, jobMaster, false, 4)
            .then()
            .catch((error) => {
                expect(error.message).toEqual(SHIPMENT_ALREADY_SCANNED)
                expect(postAssignmentService.updateTransactionStatus).not.toHaveBeenCalled()
                expect(postAssignmentService.checkPostJobOnServer).not.toHaveBeenCalled()
            })
    })

    it('should call updateTransactionStatus method to update existing transaction', () => {
        const jobTransactionMap = {
            123: {
                isScanned: false
            }
        }

        const resultJobTransactionMap = {
            123: {
                isScanned: true
            }
        }

        postAssignmentService.updateTransactionStatus.mockReturnValue(null)

        return postAssignmentService.checkScanResult(referenceNumber, jobTransactionMap, pendingStatus, jobMaster, false, 4)
            .then((postAssignmentResult) => {
                expect(postAssignmentService.updateTransactionStatus).toHaveBeenCalledTimes(1)
                expect(postAssignmentService.checkPostJobOnServer).not.toHaveBeenCalled()
                expect(postAssignmentResult.jobTransactionMap).toEqual(resultJobTransactionMap)
                expect(postAssignmentResult.pendingCount).toEqual(3)
            })
    })

    it('should throw error for scanned shipment not found when force assigned is false', () => {
        const jobTransactionMap = {
            124: {
                isScanned: true
            }
        }

        return postAssignmentService.checkScanResult(referenceNumber, jobTransactionMap, pendingStatus, jobMaster, false, 4)
            .then()
            .catch((error) => {
                expect(error.message).toEqual(SHIPMENT_NOT_FOUND)
                expect(postAssignmentService.updateTransactionStatus).not.toHaveBeenCalled()
                expect(postAssignmentService.checkPostJobOnServer).not.toHaveBeenCalled()
            })
    })

    it('should call checkPostJobOnServer method if force assigned is true', () => {
        const jobTransactionMap = {
            124: {
                isScanned: false
            }
        }

        const scanError = 'Not Found'
        postAssignmentService.checkPostJobOnServer.mockReturnValue(scanError)

        return postAssignmentService.checkScanResult(referenceNumber, jobTransactionMap, pendingStatus, jobMaster, true, 4)
            .then((postAssignmentResult) => {
                expect(postAssignmentService.checkPostJobOnServer).toHaveBeenCalledTimes(1)
                expect(postAssignmentService.updateTransactionStatus).not.toHaveBeenCalled()
                expect(postAssignmentResult.jobTransactionMap).toEqual(jobTransactionMap)
                expect(postAssignmentResult.pendingCount).toEqual(4)
                expect(postAssignmentResult.scanError).toEqual(scanError)
            })
    })
})