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
import { applyMiddleware, createStore } from 'redux' //createStore to be removed
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
// const createStoreWithMiddleware = applyMiddleware(
//   thunk,
//   loggerMiddleware
// )(createStore)

/**
 * ## configureStore
 *
 * 
 *
 */
export default function configureStore(intialState) {
  return (__DEV__)?Reactotron.createStore(reducer,intialState,applyMiddleware(thunk,loggerMiddleware)) :createStore(reducer,intialState,applyMiddleware(thunk,loggerMiddleware)) //Redux logger not required But still working here
}

// export default function configureStore(initialState) {
//   return createStoreWithMiddleware(reducer, initialState)
// };
