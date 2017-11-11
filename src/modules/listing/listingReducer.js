'use strict'

const InitialState = require('./listingInitialState').default

const initialState = new InitialState()
import {
    JOB_LISTING_START,
    JOB_LISTING_END,
} from '../../lib/constants'

export default function listingReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)
    switch (action.type) {
        case JOB_LISTING_START:
            return state.set('isRefreshing', true)
        case JOB_LISTING_END:
            return state.set('jobTransactionCustomizationList', action.payload.jobTransactionCustomizationList)
                        .set('isRefreshing', false)
    }
    return state
}