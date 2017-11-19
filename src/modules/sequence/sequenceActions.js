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
    TOGGLE_RESEQUENCE_BUTTON
} from '../../lib/constants'
import _ from 'underscore'
import {
    setState
} from '../global/globalActions'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'

export function prepareListForSequenceModule() {
    return async function (dispatch) {
        try {
            dispatch(setState(SEQUENCE_LIST_FETCHING_START))
            const sequenceList = await sequenceService.getSequenceList()
            dispatch(setState(SEQUENCE_LIST_FETCHING_STOP, {
                sequenceList
            }))
        } catch (error) {
            //Update UI here
            dispatch(setState(SEQUENCE_LIST_FETCHING_STOP))
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
            console.log('responseBody', responseBody)
            const unAllocatedTransactionIdsLength = responseBody.unAllocatedTransactionIds.length
            console.log('unAllocatedTransactionIdsLength', unAllocatedTransactionIdsLength)
            const sequenceList = await sequenceService.processSequenceResponse(responseBody, sequenceList)
            dispatch(setState(SEQUENCE_LIST_FETCHING_STOP, {
                sequenceList,
                unAllocatedTransactionIdsLength
            }))
        } catch (error) {
            console.log(error)
            dispatch(setState(SEQUENCE_LIST_FETCHING_STOP, sequenceList))
        }
    }
}