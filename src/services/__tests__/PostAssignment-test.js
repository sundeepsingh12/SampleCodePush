'use strict'
import { keyValueDBService } from "../classes/KeyValueDBService";
import { postAssignmentService } from "../classes/PostAssignment";
import { restAPI } from "../../lib/RestAPI";
import {
    TOKEN_MISSING,
    NOT_FOUND,
} from '../../lib/ContainerConstants'

import { formLayoutEventsInterface } from '../classes/formLayout/FormLayoutEventInterface'
import * as realm from '../../repositories/realmdb'

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
            value : {
                employeeCode : 'xyz'
            }
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value : {
                code : 'abc'
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