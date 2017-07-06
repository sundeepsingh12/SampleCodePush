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
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

/**
* ## Reducer
* The reducer contains the 4 modules from
* device, global, login, profile
*/
import reducer from '../modules'

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });
/**
 * ## creatStoreWithMiddleware
 * Like the name...
 */
const createStoreWithMiddleware = applyMiddleware(
  thunk,
  loggerMiddleware
)(createStore)

/**
 * ## configureStore
 * @param {Object} the state with for keys:
 * device, global, login, profile
 *
 */
export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState)
};
