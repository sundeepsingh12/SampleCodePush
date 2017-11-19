'use strict'

import InitialState from './taskListInitialState'

const initialState = new InitialState()
import {
  SET_TABS_LIST,
  JOB_DOWNLOADING_STATUS,
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
  }

  return state
}