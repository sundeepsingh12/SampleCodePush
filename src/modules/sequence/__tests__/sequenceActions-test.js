'use strict'
'use strict'
var actions = require('../sequenceActions')
import CONFIG from '../../../lib/config'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { sequenceService } from '../../../services/classes/Sequence'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
import {
    SEQUENCE_LIST_FETCHING_START,
    SEQUENCE_LIST_FETCHING_STOP,
    PREPARE_UPDATE_LIST,
    SET_RUNSHEET_NUMBER_LIST,
    SET_RESPONSE_MESSAGE,
    CLEAR_TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP,
    SEQUENCE_LIST_ITEM_DRAGGED,
    SET_SEQUENCE_LIST_ITEM
} from '../../../lib/constants'
import {
    DUPLICATE_SEQUENCE_MESSAGE,
    SAVE_SUCCESSFUL,
    UNTRACKED_JOBS_MESSAGE,
    TOKEN_MISSING,
    INVALID_SCAN,
    RUNSHEET_NUMBER_MISSING,
    RUNSHEET_MISSING,
    SEQUENCELIST_MISSING
} from '../../../lib/ContainerConstants'
import { runSheetService } from '../../../services/classes/RunSheet'

describe('test case for prepareListForSequenceModule', () => {

    const runsheetNumber = '123'
    const isDuplicateSequenceFound = false
    const sequenceArray = [{ id: 1, seqSelected: 1 }, { id: 2, seqSelected: 2 }]
    const sequenceArrayDuplcateSequence = [{ id: 1, seqSelected: 2 }, { id: 2, seqSelected: 2 }]
    const transactionsWithChangedSeqeunceMap = {}
    const sequenceList = [{ id: 1, seqSelected: 1 }, { id: 2, seqSelected: 2 }]
    const sequenceListWithDuplicateSequence = [{ id: 1, seqSelected: 2 }, { id: 2, seqSelected: 2 }]
    const transactionsWithChangedSeqeunceMapForDuplicateSequence = {
        1: { id: 1, seqSelected: 2 },
        2: { id: 2, seqSelected: 2 }
    }

    const expectedActions = [{
        type: SEQUENCE_LIST_FETCHING_START,
        payload: undefined
    }, {
        type: SEQUENCE_LIST_FETCHING_STOP,
        payload: {
            sequenceList: sequenceArray,
            responseMessage: '',
            transactionsWithChangedSeqeunceMap,
            jobMasterSeperatorMap: {}
        }
    }, {
        type: SEQUENCE_LIST_FETCHING_STOP,
        payload: {
            sequenceList: sequenceArrayDuplcateSequence,
            responseMessage: DUPLICATE_SEQUENCE_MESSAGE,
            transactionsWithChangedSeqeunceMap: transactionsWithChangedSeqeunceMapForDuplicateSequence,
            jobMasterSeperatorMap: {}
        }
    }, {
        type: SET_RESPONSE_MESSAGE,
        payload: RUNSHEET_NUMBER_MISSING
    }]

    it('should prepare jobTransaction list for given runsheet and no duplicate sequence is found', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        sequenceService.createSeperatorMap = jest.fn()
        sequenceService.createSeperatorMap.mockReturnValue({})
        sequenceService.getSequenceList = jest.fn()
        sequenceService.getSequenceList.mockReturnValue(sequenceList)
        sequenceService.checkForAutoSequencing = jest.fn()
        sequenceService.checkForAutoSequencing.mockReturnValue({
            sequenceArray,
            isDuplicateSequenceFound,
            transactionsWithChangedSeqeunceMap
        });
        const store = mockStore({})
        return store.dispatch(actions.prepareListForSequenceModule(runsheetNumber, '[123, 1234]'))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(sequenceService.createSeperatorMap).toHaveBeenCalledTimes(1)
                expect(sequenceService.getSequenceList).toHaveBeenCalledTimes(1)
                expect(sequenceService.checkForAutoSequencing).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should prepare jobTransaction list for given runsheet and duplicate sequence are found', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        sequenceService.createSeperatorMap = jest.fn()
        sequenceService.createSeperatorMap.mockReturnValue({})
        sequenceService.getSequenceList = jest.fn()
        sequenceService.getSequenceList.mockReturnValue(sequenceList)
        sequenceService.checkForAutoSequencing = jest.fn()
        sequenceService.checkForAutoSequencing.mockReturnValue({
            sequenceArray: sequenceArrayDuplcateSequence,
            isDuplicateSequenceFound: true,
            transactionsWithChangedSeqeunceMap: transactionsWithChangedSeqeunceMapForDuplicateSequence
        });
        const store = mockStore({})
        return store.dispatch(actions.prepareListForSequenceModule(runsheetNumber, '[123, 1234]'))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(sequenceService.createSeperatorMap).toHaveBeenCalledTimes(1)
                expect(sequenceService.getSequenceList).toHaveBeenCalledTimes(1)
                expect(sequenceService.checkForAutoSequencing).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })

    it('should not prepare jobTransaction list for given runsheet and throw an error', () => {
        keyValueDBService.getValueFromStore = jest.fn(() => {
            throw new Error(RUNSHEET_NUMBER_MISSING)
        })
        const store = mockStore({})
        return store.dispatch(actions.prepareListForSequenceModule(null, '[123, 1234]'))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[3].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[3].payload)
            })
    })
})


describe('test case for getRunsheets', () => {

    const runsheetNumberList = [{ id: 123 }, { id: 234 }]
    const expectedActions = [{
        type: SEQUENCE_LIST_FETCHING_START,
        payload: undefined
    }, {
        type: SET_RUNSHEET_NUMBER_LIST,
        payload: runsheetNumberList
    }, {
        type: SET_RESPONSE_MESSAGE,
        payload: RUNSHEET_MISSING
    }, {
        type: SET_RUNSHEET_NUMBER_LIST,
        payload: [{ id: 234 }]
    }]

    it('should set runsheet number list', () => {
        runSheetService.getRunsheets = jest.fn()
        runSheetService.getRunsheets.mockReturnValue(runsheetNumberList)
        const store = mockStore({})
        return store.dispatch(actions.getRunsheetsForSequence())
            .then(() => {
                expect(runSheetService.getRunsheets).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should set runsheet number list and only one runsheet is present', () => {
        runSheetService.getRunsheets = jest.fn()
        runSheetService.getRunsheets.mockReturnValue([{ id: 234 }])
        const store = mockStore({})
        return store.dispatch(actions.getRunsheetsForSequence())
            .then(() => {
                expect(runSheetService.getRunsheets).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[3].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[3].payload)
            })
    })

    it('should throw an error as runsheet not found', () => {
        runSheetService.getRunsheets = jest.fn(() => {
            throw new Error(RUNSHEET_MISSING)
        })
        const store = mockStore({})
        return store.dispatch(actions.getRunsheetsForSequence())
            .then(() => {
                expect(runSheetService.getRunsheets).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })
})


describe('test case for rowMoved', () => {
    const rowParam = {
        to: 0,
        from: 1
    }
    const sequenceList = [{ id: 123, }, { id: 234 }]
    const transactionsWithChangedSeqeunceMap = {}
    const cloneSequenceList = [{ id: 2 }, { id: 1 }]
    const newTransactionsWithChangedSeqeunceMap = {
        123: {
            id: 123
        },
        234: {
            id: 234
        }
    }
    const expectedActions = [{
        type: SEQUENCE_LIST_ITEM_DRAGGED,
        payload: {
            sequenceList: cloneSequenceList,
            transactionsWithChangedSeqeunceMap: newTransactionsWithChangedSeqeunceMap,
        }
    }, {
        type: SET_RESPONSE_MESSAGE,
        payload: SEQUENCELIST_MISSING
    }]

    it('should move row of sequence list', () => {
        sequenceService.onRowDragged = jest.fn()
        sequenceService.onRowDragged.mockReturnValue({
            cloneSequenceList,
            newTransactionsWithChangedSeqeunceMap
        })
        const store = mockStore({})
        return store.dispatch(actions.rowMoved(rowParam, sequenceList, transactionsWithChangedSeqeunceMap))
            .then(() => {
                expect(sequenceService.onRowDragged).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)

            })
    })

    it('should throw an error and test catch block', () => {
        sequenceService.onRowDragged = jest.fn(() => {
            throw new Error(SEQUENCELIST_MISSING)
        })
        const store = mockStore({})
        return store.dispatch(actions.rowMoved())
            .then(() => {
                expect(sequenceService.onRowDragged).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)
            })
    })
})

describe('test case for saveSequencedJobTransactions', () => {
    const transactionsWithChangedSeqeunceMap = {
        123: {
            id: 123
        }, 234: {
            id: 234
        }
    }
    const expectedActions = [{
        type: SEQUENCE_LIST_FETCHING_START,
        payload: undefined
    }, {
        type: CLEAR_TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP,
        payload: SAVE_SUCCESSFUL
    }, {
        type: SET_RESPONSE_MESSAGE,
        payload: SEQUENCELIST_MISSING
    }]

    it('should save transaction with changed sequence', () => {
        sequenceService.updateJobTrasaction = jest.fn()
        const store = mockStore({})
        return store.dispatch(actions.saveSequencedJobTransactions(transactionsWithChangedSeqeunceMap))
            .then(() => {
                expect(sequenceService.updateJobTrasaction).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should test catch block when error it thrown', () => {
        sequenceService.updateJobTrasaction = jest.fn(() => {
            throw new Error(SEQUENCELIST_MISSING)
        })
        const store = mockStore({})
        return store.dispatch(actions.saveSequencedJobTransactions())
            .then(() => {
                expect(sequenceService.updateJobTrasaction).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })
})


describe('test case for searchReferenceNumber', () => {

    const searchText = 'REF-123', sequenceList = [{
        runsheetNo: 'REF-123'
    }, {
        runsheetNo: 'REF-113'
    },]
    const expectedActions = [{
        type: SET_SEQUENCE_LIST_ITEM,
        payload: {
            runsheetNo: 'REF-123'
        }
    }, {
        type: SET_RESPONSE_MESSAGE,
        payload: INVALID_SCAN
    }]

    it('should search transaction for given reference number', () => {
        sequenceService.searchReferenceNumber = jest.fn()
        sequenceService.searchReferenceNumber.mockReturnValue({
            runsheetNo: 'REF-123'
        })
        const store = mockStore({})
        return store.dispatch(actions.searchReferenceNumber(searchText, sequenceList))
            .then(() => {
                expect(sequenceService.searchReferenceNumber).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should test catch block when error it thrown in case of invalid scan', () => {
        sequenceService.searchReferenceNumber = jest.fn(() => {
            throw new Error(INVALID_SCAN)
        })
        const store = mockStore({})
        return store.dispatch(actions.searchReferenceNumber())
            .then(() => {
                expect(sequenceService.searchReferenceNumber).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should throw invalid scan error', () => {
        sequenceService.searchReferenceNumber = jest.fn(null)
        const store = mockStore({})
        return store.dispatch(actions.searchReferenceNumber())
            .then(() => {
                expect(sequenceService.searchReferenceNumber).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)
            })
    })
})


describe('test case for jumpSequence', () => {
    const currentSequenceListItemIndex = 1, newSequence = 1
    const rowParam = {
        to: 0,
        from: 1
    }
    const sequenceList = [{ id: 123, seqSelected: 1 }, { id: 234, seqSelected: 2 }]
    const transactionsWithChangedSeqeunceMap = {}
    const cloneSequenceList = [{ id: 123, seqSelected: 1 }, { id: 234, seqSelected: 2 }]
    const newTransactionsWithChangedSeqeunceMap = {
        123: {
            id: 123,
            seqSelected: 1
        },
        234: {
            id: 234,
            seqSelected: 2
        }
    }
    const expectedActions = [{
        type: SEQUENCE_LIST_ITEM_DRAGGED,
        payload: {
            sequenceList: cloneSequenceList,
            transactionsWithChangedSeqeunceMap: newTransactionsWithChangedSeqeunceMap,
        }
    }, {
        type: SET_RESPONSE_MESSAGE,
        payload: SEQUENCELIST_MISSING
    }]

    it('should move row of sequence list and set sequence to given newSequence', () => {
        sequenceService.jumpSequence = jest.fn()
        sequenceService.jumpSequence.mockReturnValue({
            cloneSequenceList,
            newTransactionsWithChangedSeqeunceMap
        })
        const store = mockStore({})
        return store.dispatch(actions.jumpSequence(currentSequenceListItemIndex, newSequence, sequenceList, transactionsWithChangedSeqeunceMap))
            .then(() => {
                expect(sequenceService.jumpSequence).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)

            })
    })

    it('should throw an error and test catch block', () => {
        const sequenceList = [{ id: 123, seqSelected: 1 }, { id: 234, seqSelected: 2 }]
        sequenceService.jumpSequence = jest.fn(() => {
            throw new Error(SEQUENCELIST_MISSING)
        })
        const store = mockStore({})
        return store.dispatch(actions.jumpSequence())
            .then(() => {
                expect(sequenceService.jumpSequence).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)
            })
    })
})


describe('test case for resequenceJobsFromServer', () => {
    const updatedSequenceList = [{
        runsheetNo: 'REF-123'
    }, {
        runsheetNo: 'REF-113'
    },]
    const sequenceList = [{ id: 1, seqSelected: 1 }, { id: 2, seqSelected: 2 }]
    const responseBody = {
        json: {
            unAllocatedTransactionIds: [
                { id: 1 },
                { id: 2 }
            ]
        }
    }
    const expectedActions = [{
        type: SEQUENCE_LIST_FETCHING_START,
        payload: undefined
    }, {
        type: PREPARE_UPDATE_LIST,
        payload: {
            updatedSequenceList,
            responseMessage: 2 + UNTRACKED_JOBS_MESSAGE
        }
    }, {
        type: PREPARE_UPDATE_LIST,
        payload: {
            updatedSequenceList: sequenceList,
            responseMessage: TOKEN_MISSING,
        }
    }]

    it('should fetch resequenced jobs from server', () => {
        sequenceService.prepareRequestBody = jest.fn()
        sequenceService.prepareRequestBody.mockReturnValue({})
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        sequenceService.fetchResequencedJobsFromServer = jest.fn()
        sequenceService.fetchResequencedJobsFromServer.mockReturnValue(responseBody)
        sequenceService.processSequenceResponse = jest.fn()
        sequenceService.processSequenceResponse.mockReturnValue(updatedSequenceList)
        const store = mockStore({})
        return store.dispatch(actions.resequenceJobsFromServer(sequenceList))
            .then(() => {
                expect(sequenceService.prepareRequestBody).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(sequenceService.fetchResequencedJobsFromServer).toHaveBeenCalledTimes(1)
                expect(sequenceService.processSequenceResponse).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should throw an error and test catch block', () => {
        sequenceService.fetchResequencedJobsFromServer = jest.fn(() => {
            throw new Error(TOKEN_MISSING)
        })
        const store = mockStore({})
        return store.dispatch(actions.resequenceJobsFromServer(sequenceList))
            .then(() => {
                expect(sequenceService.fetchResequencedJobsFromServer).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })

    it('should throw token missing error', () => {
        sequenceService.prepareRequestBody = jest.fn()
        sequenceService.prepareRequestBody.mockReturnValue({})
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        const store = mockStore({})
        return store.dispatch(actions.resequenceJobsFromServer(sequenceList))
            .then(() => {
                expect(sequenceService.prepareRequestBody).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(sequenceService.fetchResequencedJobsFromServer).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })
})
