'use strict'

import InitialState from './homeInitialState'

const initialState = new InitialState()
import {
  HOME_LOADING,
  SYNC_ERROR,
  SYNC_STATUS
} from '../../lib/constants'


export default function homeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch (action.type) {
    case HOME_LOADING:
      return state.set('loading', action.payload.loading)
    case SYNC_STATUS:
      return state.set('unsyncedTransactionList', action.payload.unsyncedTransactionList)
        .set('syncStatus', action.payload.syncStatus)

  }

  return state
}