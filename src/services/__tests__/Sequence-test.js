import {
    sequenceService
} from '../classes/Sequence'
import {
    keyValueDBService
} from '../classes/KeyValueDBService'
import {
    jobTransactionService
} from '../classes/JobTransaction'
import {
    jobStatusService
} from '../classes/JobStatus'
import { transactionCustomizationService } from './../classes/TransactionCustomization'
import RestAPIFactory from '../../lib/RestAPIFactory'
import {
    HUB,
    TABLE_JOB_TRANSACTION,
} from '../../lib/constants'

import {
    PENDING,
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    PINCODE,
    LANDMARK,
    POST
} from '../../lib/AttributeConstants'
import {
    SEQUENCELIST_MISSING,
    CURRENT_SEQUENCE_ROW_MISSING,
    RUNSHEET_NUMBER_MISSING,
    TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP,
    SEARCH_TEXT_MISSING,
    SEQUENCE_REQUEST_DTO,
    TOKEN_MISSING,
    JOB_MASTER_ID_CUSTOMIZATION_MAP_MISSING
} from '../../lib/ContainerConstants'
import _ from 'lodash'
import * as realm from '../../repositories/realmdb'
import CONFIG from '../../lib/config'


describe('test searchReferenceNumber', () => {
    const sequenceList = [{
        referenceNumber: '123'
    },
    {
        referenceNumber: '234'
    }]
    const searchText = '234'
    it('should return transaction object having reference number equal to searchText', () => {
        expect(sequenceService.searchReferenceNumber(searchText, sequenceList)).toEqual({ referenceNumber: '234' })
    })

    it('should return null', () => {
        expect(sequenceService.searchReferenceNumber('345', sequenceList)).toEqual(undefined)
    })


    it('should throw sequenceList missing error', () => {
        const message = SEQUENCELIST_MISSING
        try {
            sequenceService.searchReferenceNumber(searchText, null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw searchText missing error', () => {
        const message = SEARCH_TEXT_MISSING
        try {
            sequenceService.searchReferenceNumber(null, sequenceList)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})


describe('test fetchResequencedJobsFromServer', () => {

    it('should return transaction list with sequence set by server', () => {
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(null);
        sequenceService.fetchResequencedJobsFromServer('123', 'temp')
        expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
    })

    it('should throw token missing error', () => {
        const message = TOKEN_MISSING
        try {
            sequenceService.fetchResequencedJobsFromServer(null, 'abc')
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw sequenceRequestDto missing error', () => {
        const message = SEQUENCE_REQUEST_DTO
        try {
            sequenceService.fetchResequencedJobsFromServer('abc', null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})



describe('test jumpSequence', () => {
    const sequenceList = [{
        referenceNumber: '123',
        seqSelected: 1,
        id: 123,
        seqAssigned: 1
    },
    {
        referenceNumber: '234',
        seqSelected: 2,
        id: 234,
        seqAssigned: 2
    }]
    it('should throw currentSequenceListItemIndex missing error', () => {
        const message = CURRENT_SEQUENCE_ROW_MISSING
        try {
            sequenceService.jumpSequence(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw sequenceList missing error', () => {
        const message = SEQUENCELIST_MISSING
        try {
            sequenceService.jumpSequence('1', '2', null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should return sequenceList and transactionMap having changed sequence where from > 0', () => {
        const cloneSequenceList = [{
            referenceNumber: '234',
            id: 234,
            seqSelected: 1,
            seqAssigned: 1
        }, {
            referenceNumber: '123',
            id: 123,
            seqSelected: 2,
            seqAssigned: 2
        }]
        const transactionsWithChangedSeqeunceMap = {
            123: {
                referenceNumber: '123',
                id: 123,
                seqSelected: 2,
                seqAssigned: 2
            },
            234: {
                referenceNumber: '234',
                id: 234,
                seqSelected: 1,
                seqAssigned: 1
            }
        }
        expect(sequenceService.jumpSequence(1, 1, sequenceList, {})).toEqual({ cloneSequenceList, newTransactionsWithChangedSeqeunceMap: transactionsWithChangedSeqeunceMap })
    })

    it('should return sequenceList and transactionMap having changed sequence where from < to', () => {
        const sequenceCloneList = [{
            referenceNumber: '234',
            id: 234,
            seqSelected: 0,
            seqAssigned: 0
        }, {
            referenceNumber: '123',
            id: 123,
            seqSelected: 3,
            seqAssigned: 3
        }]
        const transactionsWithChangedSeqeunceMap = {
            123: {
                referenceNumber: '123',
                id: 123,
                seqSelected: 3,
                seqAssigned: 3
            },
            234: {
                referenceNumber: '234',
                id: 234,
                seqSelected: 0,
                seqAssigned: 0
            }
        }
        expect(sequenceService.jumpSequence(0, 3, sequenceList, {})).toEqual({ cloneSequenceList: sequenceCloneList, newTransactionsWithChangedSeqeunceMap: transactionsWithChangedSeqeunceMap })
    })
})


describe('test onRowDragged', () => {
    const sequenceList = [{
        referenceNumber: '123',
        seqSelected: 1,
        id: 123,
        seqAssigned: 1
    },
    {
        referenceNumber: '234',
        seqSelected: 2,
        id: 234,
        seqAssigned: 2
    }]

    it('should throw sequenceList missing error', () => {
        const message = SEQUENCELIST_MISSING
        try {
            sequenceService.onRowDragged('1', null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should return sequenceList and transactionMap having changed sequence in case of from > to', () => {
        const cloneSequenceList = [{
            referenceNumber: '234',
            id: 234,
            seqSelected: 1,
            seqAssigned: 1
        }, {
            referenceNumber: '123',
            id: 123,
            seqSelected: 2,
            seqAssigned: 2
        }]
        const transactionsWithChangedSeqeunceMap = {
            123: {
                referenceNumber: '123',
                id: 123,
                seqSelected: 2,
                seqAssigned: 2
            },
            234: {
                referenceNumber: '234',
                id: 234,
                seqSelected: 1,
                seqAssigned: 1
            }
        }
        expect(sequenceService.onRowDragged({ to: 0, from: 1 }, sequenceList, {}, false)).toEqual({ cloneSequenceList, newTransactionsWithChangedSeqeunceMap: transactionsWithChangedSeqeunceMap })
    })

    it('should return sequenceList and transactionMap having changed sequence in case of from < to', () => {
        const cloneSequenceList = [{
            referenceNumber: '234',
            id: 234,
            seqSelected: 1,
            seqAssigned: 1
        }, {
            referenceNumber: '123',
            id: 123,
            seqSelected: 2,
            seqAssigned: 2
        }]
        const transactionsWithChangedSeqeunceMap = {
            123: {
                referenceNumber: '123',
                id: 123,
                seqSelected: 2,
                seqAssigned: 2
            },
            234: {
                referenceNumber: '234',
                id: 234,
                seqSelected: 1,
                seqAssigned: 1
            }
        }
        expect(sequenceService.onRowDragged({ to: 1, from: 0 }, sequenceList, {}, false)).toEqual({ cloneSequenceList, newTransactionsWithChangedSeqeunceMap: transactionsWithChangedSeqeunceMap })
    })
})



describe('test checkForAutoSequencing', () => {
    const sequenceList = [{
        seqSelected: 1,
        id: 123,
    }, {
        seqSelected: 1,
        id: 234,
    }]
    it('should throw sequenceList missing error', () => {
        expect(sequenceService.checkForAutoSequencing(null)).toEqual({})
    })

    it('should return sequenceList and transactionMap having changed sequence in case of duplicate sequence found', () => {
        const sequenceArray = [{
            "id": 123,
            "seqActual": 1,
            "seqAssigned": 1,
            "seqSelected": 1
        }, {
            "id": 234,
            "seqActual": 1,
            "seqAssigned": 2,
            "seqSelected": 2
        }]
        const transactionsWithChangedSeqeunceMap =
            {
                "234": {
                    "id": 234,
                    "seqActual": 1,
                    "seqAssigned": 2,
                    "seqSelected": 2
                }
            }
        expect(sequenceService.checkForAutoSequencing(sequenceList)).toEqual({ isDuplicateSequenceFound: true, sequenceArray, transactionsWithChangedSeqeunceMap })
    })

    it('should return sequenceList and transactionMap having changed sequence in case duplicated sequence  not found', () => {
        const sequenceArray = [{
            "id": 124,
            "seqActual": 1,
            "seqAssigned": 1,
            "seqSelected": 1
        }, {
            "id": 235,
            "seqActual": 2,
            "seqAssigned": 2,
            "seqSelected": 2
        }]
        const transactionsWithChangedSeqeunceMap = {}
        const sequenceListWithNoDup = [{
            seqSelected: 1,
            id: 124,
        },
        {
            seqSelected: 2,
            id: 235,
        }]
        expect(sequenceService.checkForAutoSequencing(sequenceListWithNoDup)).toEqual({ isDuplicateSequenceFound: false, sequenceArray, transactionsWithChangedSeqeunceMap })
    })

    it('should return sequenceList and transactionMap having changed sequence in case of duplicate sequence found and SeqActual present', () => {

        const sequenceListWithSeqActual = [{
            seqSelected: 1,
            id: 123,
            seqActual: 1,
        }, {
            seqSelected: 1,
            id: 234,
            seqActual: 1,
        }]

        const sequenceArray = [{
            "id": 123,
            "seqActual": 1,
            "seqAssigned": 1,
            "seqSelected": 1,
        }, {
            "id": 234,
            "seqActual": 1,
            "seqAssigned": 2,
            "seqSelected": 2,
        }]
        const transactionsWithChangedSeqeunceMap =
            {
                "234": {
                    "id": 234,
                    "seqActual": 1,
                    "seqAssigned": 2,
                    "seqSelected": 2
                }
            }
        expect(sequenceService.checkForAutoSequencing(sequenceListWithSeqActual)).toEqual({ isDuplicateSequenceFound: true, sequenceArray, transactionsWithChangedSeqeunceMap })
    })
})



describe('test getSequenceList', () => {
    beforeEach(() => {
        jobStatusService.getNonUnseenStatusIdsForStatusCategory = jest.fn()
        transactionCustomizationService.getJobListingParameters = jest.fn()
        jobTransactionService.getAllJobTransactionsCustomizationList = jest.fn()
    })

    it('gives jobTransaction List', () => {
        let runsheetNumber = 123
        return sequenceService.getSequenceList(123).then(() => {
            expect(jobStatusService.getNonUnseenStatusIdsForStatusCategory).toHaveBeenCalledTimes(1)
            expect(transactionCustomizationService.getJobListingParameters).toHaveBeenCalledTimes(1)
            expect(jobTransactionService.getAllJobTransactionsCustomizationList).toHaveBeenCalledTimes(1)
        })
    })

    it('should throw runsheetNumber missing error', () => {
        const message = RUNSHEET_NUMBER_MISSING
        try {
            sequenceService.getSequenceList(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})



describe('test updateJobTrasaction', () => {
    beforeEach(() => {
        realm.saveList = jest.fn()
    })

    it('gives jobTransaction List', () => {
        let transactionMap = {
            123: {
                id: 123
            }
        }
        return sequenceService.updateJobTrasaction(transactionMap).then(() => {
            expect(realm.saveList).toHaveBeenCalledTimes(1)
        })
    })

    it('should throw transactionsWithChangedSeqeunceMap missing error', () => {
        const message = TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP
        try {
            sequenceService.updateJobTrasaction(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})



describe('test changeLineTextOrCicleText', () => {

    it('should return changed sequence of text having no separator', () => {
        const textToChange = 'Sequence: 1'
        const newSequence = 2
        const finalText = 'Sequence: 2'
        const separator = '&'
        expect(sequenceService.changeLineTextOrCicleText(separator, textToChange, newSequence)).toEqual(finalText)
    })

    it('should return changed sequence of text having separator', () => {
        const textToChange = '1234&2345356&Sequence: 1'
        const newSequence = 2
        const finalText = '1234&2345356&Sequence: 2'
        const separator = '&'
        expect(sequenceService.changeLineTextOrCicleText(separator, textToChange, newSequence)).toEqual(finalText)
    })

    it('should return changed sequence of text having separator and sequence in between', () => {
        const textToChange = '1234&2345356&Sequence: 1&12345&25361'
        const newSequence = 2
        const finalText = '1234&2345356&Sequence: 2&12345&25361'
        const separator = '&'
        expect(sequenceService.changeLineTextOrCicleText(separator, textToChange, newSequence)).toEqual(finalText)
    })

    it('should return changed sequence and separator is missing', () => {
        const textToChange = 'Sequence: 1'
        const newSequence = 2
        const finalText = 'Sequence: 2'
        expect(sequenceService.changeLineTextOrCicleText(null, textToChange, newSequence)).toEqual(finalText)
    })
})



describe('test changeSequenceInJobTransaction', () => {

    let sequenceArray = [{
        id: 123,
        jobMasterId: 1234,
        line1: 'Sequence: 1',
        line2: 'Sequence: 1',
        circleLine1: 'Sequence: 1',
        circleLine2: 'Sequence: 1',
        seqSelected: 2
    }, {
        id: 234,
        jobMasterId: 123,
        line1: 'Sequence: 1',
        line2: 'Sequence: 1',
        circleLine1: 'Sequence: 1',
        circleLine2: 'Sequence: 1',
        seqSelected: 2
    }]
    let transactionsWithChangedSeqeunceMap = {
        123: {
            id: 123,
            jobMasterId: 1234,
            line1: 'Sequence: 1',
            line2: 'Sequence: 1',
            circleLine1: 'Sequence: 1',
            circleLine2: 'Sequence: 1',
            seqSelected: 2
        }, 234: {
            id: 234,
            jobMasterId: 123,
            line1: 'Sequence: 1',
            line2: 'Sequence: 1',
            circleLine1: 'Sequence: 1',
            circleLine2: 'Sequence: 1',
            seqSelected: 2
        }
    }
    it('should jobMasterSeperatorMap missing so same no change', () => {
        expect(sequenceService.changeSequenceInJobTransaction(sequenceArray, transactionsWithChangedSeqeunceMap, {})).toEqual({ sequenceArray, transactionsWithChangedSeqeunceMap })
    })


    it('should return changed sequence list and transactionsWithChangedSeqeunceMap when line 1 ,line 2 ,circle 1 is empty', () => {

        let jobMasterSeperatorMap = {
            1234: {

            }
        }
        let result = {
            sequenceArray: [{
                id: 123,
                jobMasterId: 1234,
                line1: 'Sequence: 1',
                line2: 'Sequence: 1',
                circleLine1: 'Sequence: 1',
                circleLine2: 'Sequence: 1',
                seqSelected: 2
            }, {
                id: 234,
                jobMasterId: 123,
                line1: 'Sequence: 1',
                line2: 'Sequence: 1',
                circleLine1: 'Sequence: 1',
                circleLine2: 'Sequence: 1',
                seqSelected: 2
            }],
            transactionsWithChangedSeqeunceMap: {
                123: {
                    id: 123,
                    jobMasterId: 1234,
                    line1: 'Sequence: 1',
                    line2: 'Sequence: 1',
                    circleLine1: 'Sequence: 1',
                    circleLine2: 'Sequence: 1',
                    seqSelected: 2
                }, 234: {
                    id: 234,
                    jobMasterId: 123,
                    line1: 'Sequence: 1',
                    line2: 'Sequence: 1',
                    circleLine1: 'Sequence: 1',
                    circleLine2: 'Sequence: 1',
                    seqSelected: 2
                }
            }
        }
        expect(sequenceService.changeSequenceInJobTransaction(sequenceArray, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap)).toEqual(result)
    })

    it('should return changed sequence list and transactionsWithChangedSeqeunceMap', () => {

        let jobMasterSeperatorMap = {
            1234: {
                line1: {
                    separator: '&',
                },

                line2: {
                    separator: '&'
                },
                circle1: {
                    separator: '&'
                },
                circle2: {
                    separator: '&'
                },
            }
        }
        let result = {
            sequenceArray: [{
                id: 123,
                jobMasterId: 1234,
                line1: 'Sequence: 2',
                line2: 'Sequence: 2',
                circleLine1: 'Sequence: 2',
                circleLine2: 'Sequence: 2',
                seqSelected: 2
            }, {
                id: 234,
                jobMasterId: 123,
                line1: 'Sequence: 1',
                line2: 'Sequence: 1',
                circleLine1: 'Sequence: 1',
                circleLine2: 'Sequence: 1',
                seqSelected: 2
            }],
            transactionsWithChangedSeqeunceMap: {
                123: {
                    id: 123,
                    jobMasterId: 1234,
                    line1: 'Sequence: 2',
                    line2: 'Sequence: 2',
                    circleLine1: 'Sequence: 2',
                    circleLine2: 'Sequence: 2',
                    seqSelected: 2
                }, 234: {
                    id: 234,
                    jobMasterId: 123,
                    line1: 'Sequence: 1',
                    line2: 'Sequence: 1',
                    circleLine1: 'Sequence: 1',
                    circleLine2: 'Sequence: 1',
                    seqSelected: 2
                }
            }
        }
        expect(sequenceService.changeSequenceInJobTransaction(sequenceArray, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap)).toEqual(result)
    })

})



describe('test createSeperatorMap', () => {

    it('should throw jobMasterIdCustomizationMap missing error', () => {
        const message = JOB_MASTER_ID_CUSTOMIZATION_MAP_MISSING
        try {
            sequenceService.createSeperatorMap(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should return jobMasterSeperatorMap', () => {
        let jobMasterIdCustomizationMap = {
            value: {
                123: {
                    1: {
                        routingSequenceNumber: true,
                        separator: '&'
                    },
                    2: {
                        routingSequenceNumber: true,
                        separator: '&'
                    },
                    3: {
                        routingSequenceNumber: true,
                        separator: '&'
                    },
                    4: {
                        routingSequenceNumber: true,
                        separator: '&'
                    }
                }
            }
        }
        let jobMasterSeperatorMap = {
            123: {
                line1: { separator: '&' },
                line2: { separator: '&' },
                circle1: { separator: '&' },
                circle2: { separator: '&' }
            }
        }
        expect(sequenceService.createSeperatorMap(jobMasterIdCustomizationMap)).toEqual(jobMasterSeperatorMap)
    })

    it('should return jobMasterSeperatorMap', () => {
        let jobMasterIdCustomizationMap = {
            value: {
                123: {
                    1: {
                        routingSequenceNumber: true,
                        separator: '&'
                    },
                    2: {
                        routingSequenceNumber: true,
                        separator: '&'
                    },
                    3: {
                        routingSequenceNumber: false,
                        separator: '&'
                    },
                    4: {
                        routingSequenceNumber: false,
                        separator: '&'
                    }
                }
            }
        }
        let jobMasterSeperatorMap = {
            123: {
                line1: { separator: '&' },
                line2: { separator: '&' },
            }
        }
        expect(sequenceService.createSeperatorMap(jobMasterIdCustomizationMap)).toEqual(jobMasterSeperatorMap)
    })

    it('should return empty jobMasterSeperatorMap', () => {
        let jobMasterIdCustomizationMap = {
            value: {
                123: {
                    1: {
                        routingSequenceNumber: false,
                        separator: '&'
                    },
                    2: {
                        routingSequenceNumber: false,
                        separator: '&'
                    },
                    3: {
                        routingSequenceNumber: false,
                        separator: '&'
                    },
                    4: {
                        routingSequenceNumber: false,
                        separator: '&'
                    }
                }
            }
        }
        let jobMasterSeperatorMap = {

        }
        expect(sequenceService.createSeperatorMap(jobMasterIdCustomizationMap)).toEqual(jobMasterSeperatorMap)
    })
})





