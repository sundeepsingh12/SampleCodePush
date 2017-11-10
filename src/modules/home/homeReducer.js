'use strict'

const InitialState = require('./homeInitialState').default

const initialState = new InitialState()
import {
  JOB_FETCHING_START,
  JOB_FETCHING_END,
  SET_TABS_LIST,
  SET_FETCHING_FALSE,
  CLEAR_HOME_STATE,
  SET_REFRESHING_TRUE,
  SET_TABS_TRANSACTIONS,
  JOB_DOWNLOADING_STATUS,
} from '../../lib/constants'


export default function homeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch (action.type) {
    case JOB_FETCHING_START:
      return state.set('isRefreshing',action.payload.isRefreshing)

    case SET_TABS_LIST:
      return state.set('tabsList', action.payload.tabsList)
        .set('tabIdStatusIdMap', action.payload.tabIdStatusIdMap)

    case CLEAR_HOME_STATE:
      return state.set('tabsList', [])
        .set('isRefreshing', false)
    
    case JOB_DOWNLOADING_STATUS:
      return state.set('downloadingJobs',action.payload.isDownloadingjobs)
  }
  
  return state
}