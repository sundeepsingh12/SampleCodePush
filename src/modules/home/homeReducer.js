'use strict'

const InitialState = require('./homeInitialState').default

const initialState = new InitialState()
const {
  JOB_FETCHING_START,
  JOB_FETCHING_END,
  SET_TABS_LIST,
  SET_FETCHING_FALSE,
  CLEAR_HOME_STATE,
  SET_REFRESHING_TRUE,
  SET_TABS_TRANSACTIONS,
} = require('../../lib/constants').default


export default function homeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)
  let tempTabIdJobTransactions

  switch (action.type) {
    case JOB_FETCHING_START:

    case SET_TABS_LIST:
      return state.set('tabsList', action.payload.tabsList)
        .set('tabIdStatusIdMap', action.payload.tabIdStatusIdMap)

    case CLEAR_HOME_STATE:
      return state.set('tabsList', [])
        .set('isRefreshing', false)
  }
  
  return state
}