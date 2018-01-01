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
import Reactotron from 'reactotron-react-native'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

/**
* ## Reducer
* The reducer contains the 4 modules from
* device, global, login, profile
*/
import reducer from '../modules'
import { compose } from 'redux';

console.tron.log(Reactotron)

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });
/**
 * ## creatStoreWithMiddleware
 * Like the name...
 */
// const createStoreWithMiddleware = applyMiddleware(
//   thunk,
//   loggerMiddleware
// )(createStore)

/**
 * ## configureStore
 * @param {Object} the state with for keys:
 * device, global, login, profile
 *
 */
// export default function configureStore(initialState) {
//   return createStoreWithMiddleware(reducer, initialState)
// };

export default function configureStore(intialState) {
  return createStore(reducer,intialState,applyMiddleware(thunk,loggerMiddleware))
}
