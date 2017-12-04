'use strict'

import InitialState from './homeInitialState'

const initialState = new InitialState()
import {
  HOME_LOADING,
  CHART_LOADING,
} from '../../lib/constants'


export default function homeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch (action.type) {
    case HOME_LOADING:
      return state.set('moduleLoading', action.payload.loading)

    case CHART_LOADING:
      return state.set('chartLoading', action.payload.loading)
                  .set('count', action.payload.count)
  }

  return state
}