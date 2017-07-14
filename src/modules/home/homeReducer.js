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
  SET_REFRESHING_TRUE,
  SET_TABS_TRANSACTIONS,
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
      tempTabIdJobTransactions[action.payload.tabId].message = ''
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
        jobTransactionCustomization = jobTransactionCustomization.concat(action.payload.jobTransactionCustomization)
      }
      tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization = jobTransactionCustomization
      tempTabIdJobTransactions[action.payload.tabId].pageNumber = action.payload.pageNumber
      tempTabIdJobTransactions[action.payload.tabId].isFetching = false
      tempTabIdJobTransactions[action.payload.tabId].isLastPage = action.payload.isLastPage
      tempTabIdJobTransactions[action.payload.tabId].message = ''
      return state.set('tabIdJobTransactions', tempTabIdJobTransactions)
        .set('isRefreshing', false)

    case SET_FETCHING_FALSE:
      console.log(action.payload.tabId)
      tempTabIdJobTransactions = { ...state.tabIdJobTransactions }
      tempTabIdJobTransactions[action.payload.tabId].isFetching = false
      tempTabIdJobTransactions[action.payload.tabId].isLastPage = true
      tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization = tempTabIdJobTransactions[action.payload.tabId].jobTransactionCustomization
      tempTabIdJobTransactions[action.payload.tabId].message = ''
      if(action.payload.message) {
        tempTabIdJobTransactions[action.payload.tabId].message = action.payload.message
      }
      console.log(tempTabIdJobTransactions)
      return state.set('tabIdJobTransactions', tempTabIdJobTransactions)

    case SET_TABS_LIST:
      return state.set('tabsList', action.payload)
    
    case CLEAR_HOME_STATE:
      return state.set('tabIdJobTransactions',{})
                  .set('tabsList',[])
                  .set('isRefreshing',false)
    
    case SET_REFRESHING_TRUE:
      return state.set('isRefreshing',true)
                  .set('tabIdJobTransactions',{})

    case SET_TABS_TRANSACTIONS:
      console.log(action.payload)
      return state.set('tabIdJobTransactions',action.payload)               
  }
  return state
}