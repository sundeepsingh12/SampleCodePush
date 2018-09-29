/**
 * # configureStore.js
 *
 * A Redux boilerplate setup
 *
 */
'use strict'

/**
 * ## Imports
 *
 * redux functions
 */
import { applyMiddleware, createStore } from 'redux' //createStore to be removed
import { createLogger } from 'redux-logger'

/**
* ## Reducer
* The reducer contains the 4 modules from
* device, global, login, profile
*/
import reducer from '../modules'

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

const createStoreWithMiddleware = applyMiddleware(
  null,
  loggerMiddleware
)(createStore)


export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState)
};
