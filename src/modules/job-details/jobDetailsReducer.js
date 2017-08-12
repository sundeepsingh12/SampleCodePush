'use strict'

const InitialState = require('./jobDetailsInitialState').default

const initialState = new InitialState()
const {
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END
} = require('../../lib/constants').default


export default function jobDetailsReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    // switch (action.type) {
    //     case JOB_DETAILS_FETCHING_START :
    //         return state

    //     case JOB_DETAILS_FETCHING_END :
    //         return state.set('jobDataList',action.payload.jobDataList)
    //                     .set('fieldDataList',action.payload.fieldDataList)
    // }
    return state
}