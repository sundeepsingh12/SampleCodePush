'use strict'

import InitialState from './summaryInitialState' 
import {
    SET_SUMMARY_FOR_JOBMASTER,
    SET_SUMMARY_FOR_RUNSHEET, 
    RESET_SUMMARY_STATE 
} from '../../lib/constants'

const initialState = new InitialState()

export default function summary(state = initialState, action) {
   switch (action.type) {
       case RESET_SUMMARY_STATE:
           return initialState
       case SET_SUMMARY_FOR_JOBMASTER:
           return state.set('jobMasterSummary', action.payload)
       case SET_SUMMARY_FOR_RUNSHEET:
           return state.set('runSheetSummary', action.payload)
   }
   return state
}