'use strict'
import {
    SEQUENCE_LIST_FETCHING_START,
    SEQUENCE_LIST_FETCHING_STOP,
    TOGGLE_RESEQUENCE_BUTTON
} from '../../../lib/constants'

import sequenceReducer from '../sequenceReducer'

describe('sequenceReducer', () => {

    it('should start fetching sequence list', () => {
        const action = {
            type: SEQUENCE_LIST_FETCHING_START
        }
        let nextState = sequenceReducer(undefined, action)
        expect(nextState.isSequenceScreenLoading).toBe(true)
    })

    it('should stop fetching sequence list', () => {
        const action = {
            type: SEQUENCE_LIST_FETCHING_STOP,
            payload: {
                sequenceList: {}
            }
        }
        let nextState = sequenceReducer(undefined, action)
        expect(nextState.sequenceList).toBe(action.payload.sequenceList)
        expect(nextState.isSequenceScreenLoading).toBe(false)
    })

    it('should toggle resequence button',() => {
          const action = {
            type: TOGGLE_RESEQUENCE_BUTTON,
            payload: {
                isSequenceScreenLoading: false,
                isResequencingDisabled:false
            }
        }

        let nextState = sequenceReducer(undefined, action)
        expect(nextState.isSequenceScreenLoading).toBe(action.payload.isSequenceScreenLoading)
        expect(nextState.isResequencingDisabled).toBe(action.payload.isResequencingDisabled)
    })
})