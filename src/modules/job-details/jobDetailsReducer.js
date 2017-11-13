'use strict'

const InitialState = require('./jobDetailsInitialState').default

const initialState = new InitialState()
import {
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END
} from '../../lib/constants'


export default function jobDetailsReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {
        case JOB_DETAILS_FETCHING_START :
            return state.set('jobDetailsLoading',true)

        case JOB_DETAILS_FETCHING_END :
            return state.set('fieldDataList',action.payload.fieldDataList)
                        .set('jobDataList',action.payload.jobDataList)
                        .set('jobTransaction',action.payload.jobTransaction)
                        .set('jobDetailsLoading',false)
                        .set('currentStatus',action.payload.currentStatus)
    }
    return state
}