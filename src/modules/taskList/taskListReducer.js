'use strict'

import InitialState from './taskListInitialState'

const initialState = new InitialState()
import {
  SET_TABS_LIST,
  JOB_DOWNLOADING_STATUS,
  FUTURE_RUNSHEET_ENABLED,
  SET_SELECTED_DATE,
  IS_CALENDAR_VISIBLE,
  LISTING_SEARCH_VALUE,
} from '../../lib/constants'


export default function taskList(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state)
  }

  switch (action.type) {
    case SET_TABS_LIST:
      return state.set('tabsList', action.payload.tabsList)
        .set('tabIdStatusIdMap', action.payload.tabIdStatusIdMap)

    case JOB_DOWNLOADING_STATUS:
      return state.set('downloadingJobs', action.payload.isDownloadingjobs)

    case FUTURE_RUNSHEET_ENABLED:
      return state.set('isFutureRunsheetEnabled', action.payload)

    case SET_SELECTED_DATE:
      return state.set('selectedDate', action.payload)

    case IS_CALENDAR_VISIBLE:
      return state.set('isCalendarVisible', action.payload)

    case LISTING_SEARCH_VALUE:
      return state.set('searchText',action.payload) 

  }

  return state
}