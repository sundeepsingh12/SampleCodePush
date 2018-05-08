'use strict'

import {
    bulkService
} from '../classes/Bulk'

import {
    jobMasterService
} from '../classes/JobMaster'


describe('test case for performsearch', () => {

    it('should return empty jobTransaction array for no search found', () => {
        const searchValue = 'test'
        const bulkTransactions = []
        const searchSelectionOnLine1Line2 = false, idToSeparatorMap = {}
        const searchObject = {
            errorMessage: 'Invalid Scan'
        }
        const pageObject = {
            additionalParams: JSON.stringify({})
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, {}, pageObject)).toEqual(searchObject)
    })

    it('should return  no error message with matching reference number', () => {
        const searchValue = 'test'
        const bulkTransactions = {
            1: {
                referenceNumber: 'test',
                id: 1
            }
        }
        const searchSelectionOnLine1Line2 = false, idToSeparatorMap = {}
        const searchObject = {
            errorMessage: '',
            displayText: 'Select None',
            selectAll: false
        }
        const pageObject = {
            additionalParams: JSON.stringify({})
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, {}, pageObject)).toEqual(searchObject)
    })

    it('should return error message for no match in runsheet no', () => {
        const searchValue = 'test'
        const bulkTransactions = {
            1: {
                referenceNumber: 'test2',
                id: 1
            }
        }
        const searchSelectionOnLine1Line2 = false, idToSeparatorMap = {}
        const searchObject = {
            errorMessage: 'Invalid Scan'
        }
        const pageObject = {
            additionalParams: JSON.stringify({})
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, {}, pageObject)).toEqual(searchObject)
    })
    it('should return empty jobTransaction array for no match in display value', () => {
        const searchValue = 'test'
        const bulkTransactions = {
            1: {
                referenceNumber: 'test2',
                id: 1
            }
        }
        const searchSelectionOnLine1Line2 = true, idToSeparatorMap = {}
        const searchObject = {
            errorMessage: 'Invalid Scan'
        }
        const pageObject = {
            additionalParams: JSON.stringify({})
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, {}, pageObject)).toEqual(searchObject)
    })
    it('should return match for line 1', () => {
        const searchValue = 'test'
        const bulkTransactions = {
            1: {
                runsheetNo: 'test2',
                line1: 'test',
                id: 1
            }
        }
        const searchSelectionOnLine1Line2 = true, idToSeparatorMap = {
            1: '-'
        }
        const searchObject = {
            errorMessage: '',
            displayText: 'Select None',
            selectAll: false
        }
        const pageObject = {
            additionalParams: JSON.stringify({})
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, {}, pageObject)).toEqual(searchObject)
    })
    it('should return no job transactions for line1 same in 2 transaction', () => {
        const searchValue = 'test'
        const bulkTransactions = {
            1: {
                runsheetNo: 'test2',
                line1: 'test', id: 1
            },
            2: {
                runsheetNo: 'test2',
                line1: 'test',
                id: 2
            }
        }
        const searchSelectionOnLine1Line2 = true, idToSeparatorMap = {
            1: '-'
        }
        const searchObject = {
            errorMessage: 'Invalid Scan',
            displayText: 'Select All',
            selectAll: false
        }
        const pageObject = {
            additionalParams: JSON.stringify({})
        }
        expect(bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, {}, pageObject)).toEqual(searchObject)
    })
})

describe('test case for checkForPresenceInDisplayText', () => {

    it('should return false for no value found in display text', () => {
        const searchValue = 'test'
        const bulkTransactions = {
            runsheetNo: 'test2',

        }
        const idToSeparatorMap = {
            1: '-',
            2: '-'
        }
        expect(bulkService.checkForPresenceInDisplayText(searchValue, bulkTransactions, idToSeparatorMap)).toEqual(false)
    })
    it('should return true for value found in line1', () => {
        const searchValue = 'test'
        const bulkTransactions = {
            runsheetNo: 'test2',
            line1: 'test'
        }
        const idToSeparatorMap = {
            1: '-',
            2: '-'
        }
        expect(bulkService.checkForPresenceInDisplayText(searchValue, bulkTransactions, idToSeparatorMap)).toEqual(true)
    })
    it('should return true for value found in circleline1', () => {
        const searchValue = 'test'
        const bulkTransactions = {
            runsheetNo: 'test2',
            circleLine1: 'test'
        }
        const idToSeparatorMap = {
            1: '-',

        }
        expect(bulkService.checkForPresenceInDisplayText(searchValue, bulkTransactions, idToSeparatorMap)).toEqual(true)
    })
    it('should return true for value found in circleline2', () => {
        const searchValue = 'test'
        const bulkTransactions = {
            runsheetNo: 'test2',
            circleLine2: 'test'
        }
        const idToSeparatorMap = {
            1: '-',

        }
        expect(bulkService.checkForPresenceInDisplayText(searchValue, bulkTransactions, idToSeparatorMap)).toEqual(true)
    })
})
describe('test case for checkLineContents', () => {

    it('should return false for no value found in display text', () => {
        const searchValue = 'test'
        const seperator = '-'
        const lineContent = 'test1'
        expect(bulkService.checkLineContents(lineContent, seperator, searchValue)).toEqual(false)
    })
    it('should return true for  value found in display text', () => {
        const searchValue = 'test'
        const seperator = '-'
        const lineContent = 'test'
        expect(bulkService.checkLineContents(lineContent, seperator, searchValue)).toEqual(true)
    })
})

describe('test case for getIdSeparatorMap', () => {

    it('should return empty object for no jobMasterIdCustomizationMap', () => {
        //const jobMasterIdCustomizationMap = []
        expect(bulkService.getIdSeparatorMap(undefined, 0)).toEqual({})
    })
    it('should return empty object for no jobMasterIdCustomizationMap.value', () => {
        const jobMasterIdCustomizationMap = {}
        expect(bulkService.getIdSeparatorMap(jobMasterIdCustomizationMap, 0)).toEqual({})
    })
    it('should return empty idtoseperatormap for no map for particular job masterid', () => {
        const jobMasterIdCustomizationMap = {
            value: {
                400: {
                    1: {
                        appJobListMasterId: 1,
                        seperator: '-'
                    }
                }
            }
        }
        const idToSeparatorMap = {
        }
        expect(bulkService.getIdSeparatorMap(jobMasterIdCustomizationMap, 500)).toEqual(idToSeparatorMap)
    })
    it('should return id to seprator map', () => {
        const jobMasterIdCustomizationMap = {
            value: {
                400: {
                    1: {
                        appJobListMasterId: 1,
                        separator: '-'
                    }
                }
            }
        }
        const idToSeparatorMap = {
            1: '-'
        }
        expect(bulkService.getIdSeparatorMap(jobMasterIdCustomizationMap, 400)).toEqual(idToSeparatorMap)
    })

})

describe('test case for getSelectedTransactionObject', () => {

    it('should return empty object for no jobMasterIdCustomizationMap', () => {
        let jobTransaction = {
            id: 1,
            jobId: 1,
            jobMasterId: 1
        }
        let jobTransactionObject = {
            jobTransactionId: 1,
            jobId: 1,
            jobMasterId: 1
        }
        expect(bulkService.getSelectedTransactionObject(jobTransaction)).toEqual(jobTransactionObject)
    })
})
describe('test case for checkForSimilarityBulk', () => {

    it('should return false for null similarity config', () => {
        expect(bulkService.checkForSimilarityBulk({}, {}, {})).toEqual(false)
    })

    it('should return false for same line 1', () => {
        const jobTransaction = {
            line1: 'abc'
        }
        const bulkConfig = {
            lineOneEnabled: true
        }
        expect(bulkService.checkForSimilarityBulk(jobTransaction, jobTransaction, bulkConfig)).toEqual(false)
    })
    it('should return true for different line 1', () => {
        const jobTransaction = {
            line1: 'abc'
        }
        const jobTransaction2 = {
            line1: 'abc1'
        }
        const bulkConfig = {
            lineOneEnabled: true
        }
        expect(bulkService.checkForSimilarityBulk(jobTransaction, jobTransaction2, bulkConfig)).toEqual(true)
    })
})

describe('test case for setEnabledTransactions', () => {

    it('should return number of enabled transactions', () => {
        let jobTransaction = {
            1: {
                id: 1,
                jobId: 1,
                jobMasterId: 1
            }
        }
        expect(bulkService.setEnabledTransactions(jobTransaction, jobTransaction[1], {})).toEqual(1)
    })

    it('should return 2 enabled transactions', () => {
        let jobTransaction = {
            1: {
                id: 1,
                jobId: 1,
                jobMasterId: 1,
                line1: 'abc'
            },
            2: {
                id: 2,
                jobId: 2,
                jobMasterId: 2,
                line1: 'abc'
            }
        }
        const bulkConfig = {
            lineOneEnabled: true
        }
        expect(bulkService.setEnabledTransactions(jobTransaction, jobTransaction[1], bulkConfig, {})).toEqual(2)
    })

    it('should return 2 enabled transactions for selected item as current transaction', () => {
        let jobTransaction = {
            1: {
                id: 1,
                jobId: 1,
                jobMasterId: 1,
                line1: 'abc'
            },
            2: {
                id: 2,
                jobId: 2,
                jobMasterId: 2,
                line1: 'abc'
            }
        }
        const selectedItem = {
            1: {
                id: 1,
                jobId: 1,
                jobMasterId: 1,
            },
        }
        const bulkConfig = {
            lineOneEnabled: true
        }
        expect(bulkService.setEnabledTransactions(jobTransaction, jobTransaction[1], bulkConfig, {})).toEqual(2)
    })
})


describe('test case for getDisplayTextAndSelectAll', () => {

    it('should return display text and select all in case of no similarity check ', () => {
        const pageObject = {
            additionalParams: {
                selectAll: true
            }
        }
        const result = {
            displayText: 'Select None',
            selectAll: true
        }
        expect(bulkService.getDisplayTextAndSelectAll(null, {}, null, {}, pageObject)).toEqual(result)
    })

    it('should return display text and select all in case of similarity check ', () => {
        const pageObject = {
            additionalParams: {
                selectAll: true
            }
        }
        const bulkConfig = {
            lineOneEnabled: true
        }
        const result = {
            displayText: 'Select None',
            selectAll: false
        }
        expect(bulkService.getDisplayTextAndSelectAll(bulkConfig, {}, 0, {}, pageObject)).toEqual(result)
    })
})