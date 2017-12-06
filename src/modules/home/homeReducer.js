'use strict'

import InitialState from './homeInitialState'

const initialState = new InitialState()
import {
  HOME_LOADING,
  SET_MODULES
} from '../../lib/constants'


export default function homeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch (action.type) {
    case HOME_LOADING:
      return state.set('loading', action.payload.loading)
    case SET_MODULES:
      return state.set('modules', action.payload.modules)
        .set('pieChart', action.payload.pieChart)
        .set('menu', action.payload.menu)
        .set('loading', action.payload.loading)
  }

  return state
}