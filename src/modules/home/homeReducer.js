'use strict'

const InitialState = require('./homeInitialState').default
import {ListView} from 'react-native'


const initialState = new InitialState()
const {
  JOB_FETCHING_START,
  JOB_FETCHING_WAIT
} = require('../../lib/constants').default
 

export default function homeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch(action.type) {
      case JOB_FETCHING_START : 
      let pageNumberCurrent = state.pageNumber + 1
      return state.set('pageNumber',pageNumberCurrent)
                  .set('isFetching',false)
                  .set('lazydata',action.payload)
      case JOB_FETCHING_WAIT : 
      return state.set('isFetching',true)
  }
  return state
}