'use strict'
 
import InitialState from './statisticsInitialState' 
import {SET_DATA_IN_STATISTICS_LIST} from '../../lib/constants'

const initialState = new InitialState()

export default function statistics(state = initialState, action) {
    switch (action.type) {
        case SET_DATA_IN_STATISTICS_LIST:
            return state.set('statisticsListItems', action.payload)
    }
    return state
}