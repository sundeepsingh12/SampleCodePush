'use strict'
 
import InitialState from './statisticsInitialState' 

const {
    SET_DATA_IN_STATISTICS_LIST
} = require('../../lib/constants').default

const initialState = new InitialState()

export default function statistics(state = initialState, action) {
    switch (action.type) {
        case SET_DATA_IN_STATISTICS_LIST:
            return state.set('statisticsListItems', action.payload)
    }
    return state
}