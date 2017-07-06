'use strict'

const InitialState = require('./homeInitialState').default
import { ListView } from 'react-native'


const initialState = new InitialState()
const {
  JOB_FETCHING_START,
  JOB_FETCHING_END,
  SET_TABS_LIST,
} = require('../../lib/constants').default


export default function homeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)
  let tempTabIdJobTransactions
  switch (action.type) {
    case SET_TABS_LIST:
      return state.set('tabsList', action.payload)

    case JOB_FETCHING_START:
      tempTabIdJobTransactions = state.tabIdJobTransactions
      if(!tempTabIdJobTransactions[action.payload]) {
        tempTabIdJobTransactions[action.payload].jobTransactions = []
        tempTabIdJobTransactions[action.payload].pageNumber = 0
        tempTabIdJobTransactions[action.payload].isFetching = false
      }
      tempTabIdJobTransactions[action.payload].isFetching = true
      return state.set('tabIdJobTransactions', tempTabIdJobTransactions)

    case JOB_FETCHING_END:
      let jobTransactions
      tempTabIdJobTransactions = state.tabIdJobTransactions
      if(!tempTabIdJobTransactions[action.payload]) {
        tempTabIdJobTransactions[action.payload].jobTransactions = []
        tempTabIdJobTransactions[action.payload].pageNumber = 0
        tempTabIdJobTransactions[action.payload].isFetching = false
      }
      if (state.tabIdJobTransactions[action.payload.tabId]) {
        jobTransactions = state.tabIdJobTransactions[payload.tabId].jobTransactions
        jobTransactions.push(action.payload.jobTransactions)
      } else {
        jobTransactions = []
        jobTransactions.push(action.payload.jobTransactions)
      }
      tempTabIdJobTransactions[action.payload.tabId].jobTransactions = jobTransactions
      tempTabIdJobTransactions[action.payload.tabId].pageNumber += 1
      tempTabIdJobTransactions[action.payload.tabId] .isFetching = false
      return state.set('tabIdJobTransactions', tempTabIdJobTransactions)
  }
  return state
}