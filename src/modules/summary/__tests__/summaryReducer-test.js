'use strict'

import {
    SET_SUMMARY_FOR_JOBMASTER,
    SET_SUMMARY_FOR_RUNSHEET, 
    RESET_SUMMARY_STATE
} from '../../../lib/constants'

import summaryReducer from '../summaryReducer'

describe('summary reducer', () => {

    it('it should set summary for job master', () => {
        const action = {
            type: SET_SUMMARY_FOR_JOBMASTER,
            payload: {
                data: []
            }
        }
        let nextState = summaryReducer(undefined, action)
        expect(nextState.jobMasterSummary).toBe(action.payload)
    })

    it('it should set summary for runSheet', () => {
        const action = {
            type: SET_SUMMARY_FOR_RUNSHEET,
            payload: {
                data: []
            }
        }
        let nextState = summaryReducer(undefined, action)
        expect(nextState.runSheetSummary).toBe(action.payload)
    })

    it('it should set intialState', () => {
        let data = {"jobMasterSummary": [], "runSheetSummary": [], "isLoaderRunning": false}
        
        const action = {
            type: RESET_SUMMARY_STATE,
        }
        let nextState = summaryReducer(undefined, action)
        expect(nextState.isLoaderRunning).toBe(false)
    })
    it('it should not return any state', () => {        
        const action = {
            type: 'NO_STATE',
        }
        let nextState = summaryReducer(undefined, action)
        expect(nextState.isLoaderRunning).toBe(false)
    })

})