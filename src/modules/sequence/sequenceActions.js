
import {
    sequenceService
} from '../../services/classes/Sequence'
import {
    keyValueDBService
} from '../../services/classes/KeyValueDBService'
import {
    SEQUENCE_LIST_FETCHING_START,
    SEQUENCE_LIST_FETCHING_STOP,
    PREPARE_UPDATE_LIST,
    SET_RUNSHEET_NUMBER_LIST,
    SET_RESPONSE_MESSAGE,
    Sequence,
    CLEAR_TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP,
    SEQUENCE_LIST_ITEM_DRAGGED,
    SET_SEQUENCE_LIST_ITEM_INDEX
} from '../../lib/constants'
import {
    DUPLICATE_SEQUENCE_MESSAGE,
    SAVE_SUCCESSFUL,
    UNTRACKED_JOBS_MESSAGE
} from '../../lib/ContainerConstants'
import {
    setState, navigateToScene
} from '../global/globalActions'
import CONFIG from '../../lib/config'

export function prepareListForSequenceModule(runsheetNumber) {
    return async function (dispatch) {
        try {
            dispatch(setState(SEQUENCE_LIST_FETCHING_START))
            const sequenceList = await sequenceService.getSequenceList(runsheetNumber)
            // console.logs('sequenceList', sequenceList)
            const { isDuplicateSequenceFound, sequenceArray, transactionsWithChangedSeqeunceMap } = await sequenceService.checkForAutoSequencing(sequenceList)
            dispatch(setState(SEQUENCE_LIST_FETCHING_STOP, {
                sequenceList: sequenceArray,
                responseMessage: (isDuplicateSequenceFound) ? DUPLICATE_SEQUENCE_MESSAGE : '',
                transactionsWithChangedSeqeunceMap
            }))
        } catch (error) {
            console.log(error)
            dispatch(setState(SET_RESPONSE_MESSAGE, error.message))
        }
    }
}

export function resequenceJobsFromServer(sequenceList) {
    return async function (dispatch) {
        try {
            dispatch(setState(SEQUENCE_LIST_FETCHING_START))
            const sequenceRequestDto = await sequenceService.prepareRequestBody(sequenceList)
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            if (!token) {
                throw new Error('Token Missing')
            }
            const sequenceResponse = await sequenceService.fetchResequencedJobsFromServer(token.value, sequenceRequestDto)
            const responseBody = await sequenceResponse.json
            const unallocatedTransactionCount = responseBody.unAllocatedTransactionIds.length
            const updatedSequenceList = await sequenceService.processSequenceResponse(responseBody, sequenceList)
            dispatch(setState(PREPARE_UPDATE_LIST, {
                updatedSequenceList,
                responseMessage: (unallocatedTransactionCount) ? unallocatedTransactionCount + UNTRACKED_JOBS_MESSAGE : ''
            }))
        } catch (error) {
            dispatch(setState(PREPARE_UPDATE_LIST, {
                updatedSequenceList: sequenceList,
                responseMessage: error.message,
            }))
        }
    }
}

export function getRunsheets(displayName) {
    return async function (dispatch) {
        try {
            dispatch(setState(SEQUENCE_LIST_FETCHING_START))
            const runsheetNumberList = await sequenceService.getRunsheets()
            if (runsheetNumberList.length == 1) {
                dispatch(navigateToScene(Sequence, {
                    runsheetNumber: runsheetNumberList[0],
                    displayName
                }))
            }
            dispatch(setState(SET_RUNSHEET_NUMBER_LIST, runsheetNumberList))
        } catch (error) {
            console.log(error)
            dispatch(setState(SET_RESPONSE_MESSAGE, error.message))
        }
    }
}


export function rowMoved(rowParam, sequenceList, transactionsWithChangedSeqeunceMap) {
    return async function (dispatch) {
        try {
            let { cloneSequenceList, newTransactionsWithChangedSeqeunceMap } = await sequenceService.onRowDragged(rowParam, sequenceList, transactionsWithChangedSeqeunceMap)
            dispatch(setState(SEQUENCE_LIST_ITEM_DRAGGED, {
                sequenceList: cloneSequenceList,
                transactionsWithChangedSeqeunceMap: newTransactionsWithChangedSeqeunceMap,
            }))
        } catch (error) {
            console.log(error)
            dispatch(setState(SET_RESPONSE_MESSAGE, error.message))
        }
    }
}



export function saveSequencedJobTransactions(transactionsWithChangedSeqeunceMap) {
    return async function (dispatch) {
        try {
            dispatch(setState(SEQUENCE_LIST_FETCHING_START))
            await sequenceService.updateJobTrasaction(transactionsWithChangedSeqeunceMap)
            dispatch(setState(CLEAR_TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP, SAVE_SUCCESSFUL))
        } catch (error) {
            console.log(error)
            dispatch(setState(SET_RESPONSE_MESSAGE, error.message))
        }
    }
}


export function searchReferenceNumber(searchText, sequenceList) {
    return async function (dispatch) {
        try {
            let searchIndex = sequenceService.searchReferenceNumber(searchText, sequenceList)
            if (searchIndex == -1) {
                throw new Error('Invalid Scan')
            }
            dispatch(setState(SET_SEQUENCE_LIST_ITEM_INDEX, searchIndex + 1))
        } catch (error) {
            console.log(error)
            dispatch(setState(SET_RESPONSE_MESSAGE, error.message))
        }
    }
}

