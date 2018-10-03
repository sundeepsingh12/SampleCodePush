'use strict'

import InitialState from './summaryInitialState' 
import {
    SET_JOB_MASTER_AND_RUNSHEET_DATA,
    RESET_SUMMARY_STATE ,
    START_FETCHING_DATA,
    SET_RUNSHEET_ID
} from '../../lib/constants'

const initialState = new InitialState()

export default function summary(state = initialState, action) {
   switch (action.type) {
       case RESET_SUMMARY_STATE:
           return initialState
       case SET_JOB_MASTER_AND_RUNSHEET_DATA:
           return state.set('jobMasterSummary', action.payload.jobMasterSummaryList)
                        .set('runSheetSummary',action.payload.runsheetSummaryList)
                        .set('currentActiveRunsheetId',action.payload.currentActiveRunsheetId)
                        .set('isLoaderRunning',false)
         case SET_RUNSHEET_ID:
                return state.set('currentActiveRunsheetId',action.payload)      
        case START_FETCHING_DATA:
                return state.set('isLoaderRunning',true)                
   }
   return state
}