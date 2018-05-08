'use strict'

import InitialState from './taskListInitialState'

const initialState = new InitialState()
import {
  SET_TABS_LIST,
  JOB_DOWNLOADING_STATUS,
  IS_CALENDAR_VISIBLE,
  LISTING_SEARCH_VALUE,
  RESET_STATE,
  SET_FUTURE_RUNSHEET_ENABLED_AND_SELECTED_DATE,
  TASKLIST_LOADER_FOR_SYNC
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

    case IS_CALENDAR_VISIBLE:
      return state.set('isCalendarVisible', action.payload)
    case TASKLIST_LOADER_FOR_SYNC:
      return state.set('syncLoadingInTaskList', action.payload)

    case LISTING_SEARCH_VALUE:
      return state.set('searchText', action.payload)

    case SET_FUTURE_RUNSHEET_ENABLED_AND_SELECTED_DATE:
      return state.set('selectedDate', action.payload.selectedDate)
        .set('isFutureRunsheetEnabled', action.payload.enableFutureDateRunsheet)

    case RESET_STATE:
      return initialState
  }
  return state
}