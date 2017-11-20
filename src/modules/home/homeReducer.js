'use strict'

import InitialState from './homeInitialState'

const initialState = new InitialState()
import {
  HOME_LOADING,
} from '../../lib/constants'


export default function homeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch (action.type) {
    case HOME_LOADING:
      return state.set('loading', action.payload.loading)
  }

  return state
}