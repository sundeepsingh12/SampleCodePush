'use strict'

const InitialState = require('./jobDetailsInitialState').default

const initialState = new InitialState()
import {
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END,
    IS_MISMATCHING_LOCATION,
    RESET_STATE,
    RESET_STATE_FOR_JOBDETAIL,
    SHOW_DROPDOWN,
    SET_JOBDETAILS_DRAFT_INFO,
    SET_LOADER_FOR_SYNC_IN_JOBDETAIL,
    SET_LOADER_FOR_SYNC_IN_JOBDETAIL_AND_DRAFT
} from '../../lib/constants'


export default function jobDetailsReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {
        case JOB_DETAILS_FETCHING_START:
            return state.set('jobDetailsLoading', true)

        case IS_MISMATCHING_LOCATION:
            return state.set('statusList', action.payload)
        case SET_LOADER_FOR_SYNC_IN_JOBDETAIL:
            return state.set('syncLoading', action.payload)

        case JOB_DETAILS_FETCHING_END:
            return state.set('fieldDataList', action.payload.fieldDataList)
                .set('jobDataList', action.payload.jobDataList)
                .set('jobTransaction', action.payload.jobTransaction)
                .set('jobDetailsLoading', false)
                .set('currentStatus', action.payload.currentStatus)
                .set('errorMessage', action.payload.errorMessage)
                .set('statusRevertList', action.payload.parentStatusList)
                .set('draftStatusInfo', action.payload.draftStatusInfo)
                .set('isEtaTimerShow', action.payload.isEtaTimerShow)
                .set('jobExpiryTime', action.payload.jobExpiryTime)
                .set('syncLoading',action.payload.isSyncLoading)
                
        case RESET_STATE:
            return initialState

        case RESET_STATE_FOR_JOBDETAIL:
            return state.set('errorMessage', false)
                .set('statusRevertList', [])
                .set('jobDetailsLoading', false)
                .set('draftStatusInfo', {})

        case SHOW_DROPDOWN:
            return state.set('isShowDropdown', action.payload)

        case SET_JOBDETAILS_DRAFT_INFO:
            return state.set('draftStatusInfo', action.payload)
        
        case SET_LOADER_FOR_SYNC_IN_JOBDETAIL_AND_DRAFT:
            return state.set('draftStatusInfo', null)
                        .set('syncLoading', action.payload)

    }
    return state
}