'use strict'

const InitialState = require('./homeInitialState').default
import { ListView } from 'react-native'


const initialState = new InitialState()
const {
  JOB_FETCHING_START,
  JOB_FETCHING_END,
  SET_TABS_LIST,
  SET_FETCHING_FALSE,
  CLEAR_HOME_STATE,
} = require('../../lib/constants').default


export default function homeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)
  let tempTabIdJobTransactions
  switch (action.type) {
    case JOB_FETCHING_START:
      console.log(state.tabIdJobTransactions)
      tempTabIdJobTransactions = { ...state.tabIdJobTransactions }
      console.log(tempTabIdJobTransactions[action.payload])
      if (!tempTabIdJobTransactions[action.payload.tabId]) {
        tempTabIdJobTransactions[action.payload.tabId] = {}
        tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization = []
        tempTabIdJobTransactions[action.payload.tabId].pageNumber = 0
        tempTabIdJobTransactions[action.payload.tabId].isFetching = false
        tempTabIdJobTransactions[action.payload.tabId].isLastPage = true
      }
      console.log('tabIdJobTransactions')
      console.log(state.tabIdJobTransactions)
      tempTabIdJobTransactions[action.payload.tabId].isFetching = true
      return state.set('tabIdJobTransactions', tempTabIdJobTransactions)
        .set('isRefreshing', false)

    case JOB_FETCHING_END:
      let jobTransactions, jobTransactionCustomization
      console.log('action.payload')
      console.log(action.payload)
      tempTabIdJobTransactions = { ...state.tabIdJobTransactions }
      if (tempTabIdJobTransactions[action.payload.tabId] && tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization) {
        jobTransactionCustomization = tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization
        jobTransactionCustomization = jobTransactionCustomization.concat(action.payload.jobTransactionCustomizationList)
      } else {
        jobTransactionCustomization = []
        jobTransactions = jobTransactions.concat(action.payload.jobTransactionOject.jobTransactions)
        jobTransactionCustomization = jobTransactionCustomization.concat(action.payload.jobTransactionCustomization)
      }
      tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization = jobTransactionCustomization
      tempTabIdJobTransactions[action.payload.tabId].pageNumber = action.payload.pageNumber
      tempTabIdJobTransactions[action.payload.tabId].isFetching = false
      tempTabIdJobTransactions[action.payload.tabId].isLastPage = action.payload.isLastPage
      return state.set('tabIdJobTransactions', tempTabIdJobTransactions)
        .set('isRefreshing', false)

    case SET_FETCHING_FALSE:
      console.log(action.payload.tabId)
      tempTabIdJobTransactions = { ...state.tabIdJobTransactions }
      tempTabIdJobTransactions[action.payload.tabId].isFetching = false
      tempTabIdJobTransactions[action.payload.tabId].isLastPage = true
      tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization = tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization
      console.log(tempTabIdJobTransactions)
      return state.set('tabIdJobTransactions', tempTabIdJobTransactions)

    case SET_TABS_LIST:
      return state.set('tabsList', action.payload)
    
    case CLEAR_HOME_STATE:
      return state.set('tabIdJobTransactions',{})
                  .set('tabsList',[])
                  .set('isRefreshing',false)
  }
  return state
}