'use strict'

const InitialState = require('./homeInitialState').default
import {ListView} from 'react-native'


const initialState = new InitialState()
const {
  JOB_FETCHING_START,
  JOB_FETCHING_END,
  SET_TABS_LIST,
} = require('../../lib/constants').default
 

export default function homeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch(action.type) {
      case JOB_FETCHING_END : 
      let pageNumberCurrent = state.jobs.pageNumber + 1
      return state.setIn(['jobs','pageNumber'],pageNumberCurrent)
                  .setIn(['jobs','isFetching'],false)
                  .setIn(['jobs','lazydata'],[...state.jobs.lazydata,...action.payload])
      case JOB_FETCHING_START : 
      return state.setIn(['jobs','isFetching'],true)

      case  SET_TABS_LIST :
        return state.set('tabsList',action.payload)
  }
  return state
}