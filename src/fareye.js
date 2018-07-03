'use strict'
import React, { PureComponent } from 'react'
import {
  AppRegistry,
} from 'react-native'

/**
 * ### Redux
 *
 * ```Provider``` will tie the React-Native to the Redux store
 */
import { Provider } from 'react-redux'
/**
 * ### configureStore
 *
 *  ```configureStore``` will connect the ```modules```, the
 *
 */
import configureStore from './lib/configureStore'

import AppWithNavigationState from './modules/navigators/AppNavigator'

/**
 * ## Native
 *
 * ```configureStore``` with the ```initialState``` and set the
 * ```platform``` and ```version``` into the store by ```dispatch```.
 * *Note* the ```store``` itself is set into the ```store```.  This
 * will be used when doing hot loading
 */

export default function native() {
  // configureStore will combine modules from FarEye and Main application
  // it will then create the store based on aggregate state from all modules
  const store = configureStore({})

  class Fareye extends PureComponent {

    render() {
      return (
        <Provider store={store}>
          <AppWithNavigationState />
        </Provider>
      );
    }
  }

  /**
   * registerComponent to the AppRegistery and off we go....
   */

  AppRegistry.registerComponent('Fareye', () => Fareye)
}
