import {
    jobStatusService
} from '../../services/classes/JobStatus'

import * as realm from '../../repositories/realmdb'
import {
    jobTransactionService
} from '../../services/classes/JobTransaction'
import {
    sequenceService
} from '../../services/classes/Sequence'
import {
    fetchJobs
} from '../home/homeActions'
import {
    keyValueDBService
} from '../../services/classes/KeyValueDBService'
import {
    SEQUENCE_LIST_FETCHING_START,
    SEQUENCE_LIST_FETCHING_STOP,
    HUB,
    TOGGLE_RESEQUENCE_BUTTON,
    PREPARE_UPDATE_LIST,
    SET_RUNSHEET_NUMBER_LIST,
    SET_RESPONSE_MESSAGE,
    Sequence
} from '../../lib/constants'
import {
    setState, navigateToScene
} from '../global/globalActions'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'

export function prepareListForSequenceModule(runsheetNumber) {
    return async function (dispatch) {
        try {
            dispatch(setState(SEQUENCE_LIST_FETCHING_START))
            const sequenceList = await sequenceService.getSequenceList(runsheetNumber)
            dispatch(setState(SEQUENCE_LIST_FETCHING_STOP, {
                sequenceList,
            }))
        } catch (error) {
            //Update UI here
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
            const sequenceResponse = await RestAPIFactory(token.value).serviceCall(JSON.stringify(sequenceRequestDto), CONFIG.API.SEQUENCE_USING_ROUTING_API, 'POST')
            const responseBody = await sequenceResponse.json
            const unallocatedTransactionCount = responseBody.unAllocatedTransactionIds.length
            const updatedSequenceList = await sequenceService.processSequenceResponse(responseBody, sequenceList)
            dispatch(setState(PREPARE_UPDATE_LIST, {
                updatedSequenceList,
                unallocatedTransactionCount
            }))
        } catch (error) {
            dispatch(setState(PREPARE_UPDATE_LIST, {
                updatedSequenceList:sequenceList,
                responseMessage:error.message,
                unallocatedTransactionCount:0
            }))
        }
    }
}

export function getJobTransactionsFromRunsheetNumber(runsheetNumber) {
    return async function (dispatch) {
        try {
            console.log('runsheetNumber', runsheetNumber)
        } catch (error) {
            console.log(error)
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

