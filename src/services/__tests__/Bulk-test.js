'use strict'

import {
    bulkService
} from '../classes/Bulk'

import {
    jobMasterService
} from '../classes/JobMaster'


describe('test cases for prepareJobMasterVsStatusList', () => {
    // it('should prepare job master vs status', () => {
    //     const jobStatusList = [{
    //         id: 1,
    //         jobMasterId: 1,
    //         code: 'UNSEEN',
    //         name: 'Unseen'
    //     }, {
    //         id: 2,
    //         jobMasterId: 1,
    //         code: 'PENDING',
    //         name: 'Pending',
    //         nextStatusList: [{
    //             id: 3,
    //             jobMasterId: 1,
    //             code: 'Success',
    //             name: 'Success'
    //         }]
    //     }]

    //     const bulkConfigList = [{
    //         jobMasterName: 'A',
    //         id: 0,
    //         statusName: 'Pending',
    //         statusId: 2,
    //         nextStatusList: [{
    //             id: 3,
    //             jobMasterId: 1,
    //             code: 'Success',
    //             name: 'Success'
    //         }],
    //         jobMasterId: 1
    //     }]
    //     const jobMasterList = [{
    //         id: 1,
    //         title: 'A'
    //     }]

    //     jobMasterService.getIdJobMasterMap = jest.fn()
    //     jobMasterService.getIdJobMasterMap.mockReturnValue({
    //         1: {
    //             id: 1,
    //             title: 'A'
    //         }
    //     })

    //     bulkService._getJobMasterIdStatusNameList = jest.fn()
    //     bulkService._getJobMasterIdStatusNameList.mockReturnValue(bulkConfigList)

    //     expect(bulkService.prepareJobMasterVsStatusList(jobMasterList, jobStatusList)).toEqual(bulkConfigList)
    // })
})

describe('test case for _getJobMasterIdStatusNameList', () => {
    it('should return bulk config list', () => {
        const jobStatusList = [{
            id: 1,
            jobMasterId: 1,
            code: 'UNSEEN',
            name: 'Unseen'
        }, {
            id: 2,
            jobMasterId: 1,
            code: 'PENDING',
            name: 'Pending',
            nextStatusList: [{
                id: 3,
                jobMasterId: 1,
                code: 'Success',
                name: 'Success'
            }]
        }]
        const idJobMasterMap = {
            1: {
                id: 1,
                title: 'A'
            }
        }
        const bulkConfigList = [{
            jobMasterName: 'A',
            id: 0,
            statusName: 'Pending',
            statusId: 2,
            nextStatusList: [{
                id: 3,
                jobMasterId: 1,
                code: 'Success',
                name: 'Success'
            }],
            jobMasterId: 1
        }]
        expect(bulkService._getJobMasterIdStatusNameList(jobStatusList, idJobMasterMap)).toEqual(bulkConfigList)
    })
})

describe('test case for getSelectedTransactionIds', () => {
    it('should return no transactions', () => {
        const jobTransactions = [{
            id: 1,
            isChecked: false
        },
        {
            id: 2,
            isChecked: false
        }]
        expect(bulkService.getSelectedTransactionIds(jobTransactions)).toEqual([])
    })
    it('should return selected transactions', () => {
        const jobTransactions = [{
            id: 1,
            isChecked: true
        },
        {
            id: 2,
            isChecked: false
        }]
        const selectedItems = [1]
        expect(bulkService.getSelectedTransactionIds(jobTransactions)).toEqual(selectedItems)
    })
})

describe('test case for _getStatusIdJobMasterIdBulkAllowedMap', () => {
    it('should return null for empty bulkJobMasterStatusConfiguration', () => {
        expect(bulkService._getStatusIdJobMasterIdBulkAllowedMap({})).toEqual(undefined)
    })
    it('should return  statusIdJobMasterIdBulkAllowedMap', () => {
        const bulkJobMasterStatusConfiguration = [{
            statusId: 123,
            jobMasterId: 1,
            bulkUpdateAllowed: true
        }]
        const statusIdJobMasterIdBulkAllowedMap = {
            123: {
                1: true
            }
        }
        expect(bulkService._getStatusIdJobMasterIdBulkAllowedMap(bulkJobMasterStatusConfiguration)).toEqual(statusIdJobMasterIdBulkAllowedMap)
    })
})

describe('test case for getManualSelection', () => {
    it('should return true for empty jobMasterManualSelectionConfiguration', () => {
        expect(bulkService.getManualSelection([])).toEqual(true, 1)
    })
    it('should return  manual selection config', () => {
        const jobMasterId = 1
        const jobMasterManualSelectionConfiguration = [
            {
                jobMasterId: 1,
                manualSelectionAllowed: false
            }
        ]
        expect(bulkService.getManualSelection(jobMasterManualSelectionConfiguration, jobMasterId)).toEqual(false)
    })
})
describe('test case for performsearch', () => {

    it('should return empty jobTransaction array for no search found', () => {
        const searchValue = 'test'
        const bulkTransactions = []
        const searchSelectionOnLine1Line2 = false, idToSeparatorMap = {}
        const searchObject = {
            jobTransactionArray: [], errorMessage: 'Invalid Scan'
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap)).toEqual(searchObject)
    })
    it('should return  jobTransaction array with matching reference number', () => {
        const searchValue = 'test'
        const bulkTransactions = [{
            referenceNumber: 'test'
        }]
        const searchSelectionOnLine1Line2 = false, idToSeparatorMap = {}
        const searchObject = {
            jobTransactionArray: [{
                referenceNumber: 'test'
            }], errorMessage: ''
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap)).toEqual(searchObject)
    })
    it('should return  jobTransaction array with matching reference number', () => {
        const searchValue = 'test'
        const bulkTransactions = [{
            runsheetNo: 'test'
        }]
        const searchSelectionOnLine1Line2 = false, idToSeparatorMap = {}
        const searchObject = {
            jobTransactionArray: [{
                runsheetNo: 'test'
            }], errorMessage: ''
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap)).toEqual(searchObject)
    })
    it('should return empty jobTransaction array for no match in runsheet no', () => {
        const searchValue = 'test'
        const bulkTransactions = [{
            runsheetNo: 'test2'
        }]
        const searchSelectionOnLine1Line2 = false, idToSeparatorMap = {}
        const searchObject = {
            jobTransactionArray: [], errorMessage: 'Invalid Scan'
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap)).toEqual(searchObject)
    })
    it('should return empty jobTransaction array for no match in display value', () => {
        const searchValue = 'test'
        const bulkTransactions = [{
            runsheetNo: 'test2'
        }]
        const searchSelectionOnLine1Line2 = true, idToSeparatorMap = {}
        const searchObject = {
            jobTransactionArray: [], errorMessage: 'Invalid Scan'
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap)).toEqual(searchObject)
    })
    it('should return match for line 1', () => {
        const searchValue = 'test'
        const bulkTransactions = [{
            runsheetNo: 'test2',
            line1: 'test'
        }]
        const searchSelectionOnLine1Line2 = true, idToSeparatorMap = {
            1: '-'
        }
        const searchObject = {
            jobTransactionArray: [{
                runsheetNo: 'test2',
                line1: 'test'
            }], errorMessage: ''
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap)).toEqual(searchObject)
    })
    it('should return no job transactions for line1 same in 2 transaction', () => {
        const searchValue = 'test'
        const bulkTransactions = [{
            runsheetNo: 'test2',
            line1: 'test',
        },
        {
            runsheetNo: 'test2',
            line1: 'test',
        }]
        const searchSelectionOnLine1Line2 = true, idToSeparatorMap = {
            1: '-'
        }
        const searchObject = {
            jobTransactionArray: [{
                runsheetNo: 'test2',
                line1: 'test',
            },
            {
                runsheetNo: 'test2',
                line1: 'test',
            }], errorMessage: 'Invalid Scan'
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap)).toEqual(searchObject)
    })
    it('should return match for line 2', () => {
        const searchValue = 'test'
        const bulkTransactions = [{
            runsheetNo: 'test2',
            line2: 'test'
        }]
        const searchSelectionOnLine1Line2 = true, idToSeparatorMap = {
            1: '-',
            2: '-'
        }
        const searchObject = {
            jobTransactionArray: [{
                runsheetNo: 'test2',
                line2: 'test'
            }], errorMessage: ''
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap)).toEqual(searchObject)
    })
    it('should return no match for no separator', () => {
        const searchValue = 'test'
        const bulkTransactions = [{
            runsheetNo: 'test2',
            line1: 'test-test2'
        }]
        const searchSelectionOnLine1Line2 = true, idToSeparatorMap = {

        }
        const searchObject = {
            jobTransactionArray: [], errorMessage: 'Invalid Scan'
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap)).toEqual(searchObject)
    })
})