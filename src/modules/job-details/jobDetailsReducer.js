'use strict'

const InitialState = require('./jobDetailsInitialState').default

const initialState = new InitialState()
import {
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END,
    IS_MISMATCHING_LOCATION,
    RESET_STATE,
    RESET_STATE_FOR_JOBDETAIL,
} from '../../lib/constants'


export default function jobDetailsReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {
        case JOB_DETAILS_FETCHING_START:
            return state.set('jobDetailsLoading', true)
        case IS_MISMATCHING_LOCATION:
            return state.set('statusList',action.payload)
        case JOB_DETAILS_FETCHING_END :
            return state.set('fieldDataList',action.payload.fieldDataList)
                        .set('jobDataList',action.payload.jobDataList)
                        .set('jobTransaction',action.payload.jobTransaction)
                        .set('jobDetailsLoading',false)
                        .set('currentStatus',action.payload.currentStatus)
                        .set('errorMessage',action.payload.errorMessage)
                        .set('statusRevertList',action.payload.parentStatusList)
                        .set('draftStatusInfo', action.payload.draftStatusInfo)
                        .set('isEtaTimerShow', action.payload.isEtaTimerShow)
        case RESET_STATE:
            return initialState
        case RESET_STATE_FOR_JOBDETAIL:
            return state.set('errorMessage',false) 
                        .set('statusRevertList',[])
                        .set('jobDetailsLoading',false)
                        .set('draftStatusInfo', {})              
    }
    return state
}