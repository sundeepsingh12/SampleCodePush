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
      console.log(state.tabIdJobTransactions)
      tempTabIdJobTransactions = state.tabIdJobTransactions
      console.log(tempTabIdJobTransactions[action.payload])
      if(!tempTabIdJobTransactions[action.payload.tabId]) {
        tempTabIdJobTransactions[action.payload.tabId] = {}
        tempTabIdJobTransactions[action.payload.tabId].jobTransactions = []
        tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization = []
        tempTabIdJobTransactions[action.payload.tabId].pageNumber = 0
        tempTabIdJobTransactions[action.payload.tabId].isFetching = false
      }
      console.log('tabIdJobTransactions')
      console.log(state.tabIdJobTransactions)
      tempTabIdJobTransactions[action.payload.tabId].isFetching = true
      return state.set('tabIdJobTransactions', tempTabIdJobTransactions)

    case JOB_FETCHING_END:
      let jobTransactions,jobTransactionCustomization
      console.log('action.payload')
      console.log(action.payload)
      tempTabIdJobTransactions = {...state.tabIdJobTransactions}
      if (tempTabIdJobTransactions[action.payload.tabId] && tempTabIdJobTransactions[action.payload.tabId].jobTransactions) {
        jobTransactions = tempTabIdJobTransactions[action.payload.tabId].jobTransactions
        jobTransactions = jobTransactions.concat(action.payload.jobTransactionOject.jobTransactions)
        jobTransactionCustomization = tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization
        jobTransactionCustomization = jobTransactionCustomization.concat(action.payload.jobTransactionOject.jobTransactionCustomization)
      } else {
        jobTransactions = []
        jobTransactionCustomization = []
        jobTransactions = jobTransactions.concat(action.payload.jobTransactionOject.jobTransactions)
        jobTransactionCustomization = jobTransactionCustomization.concat(action.payload.jobTransactionOject.jobTransactionCustomization)
      }
      tempTabIdJobTransactions[action.payload.tabId].jobTransactions = jobTransactions
      tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization = jobTransactionCustomization
      tempTabIdJobTransactions[action.payload.tabId].pageNumber += 1
      tempTabIdJobTransactions[action.payload.tabId] .isFetching = false
      return state.set('tabIdJobTransactions', tempTabIdJobTransactions)
  }
  return state
}