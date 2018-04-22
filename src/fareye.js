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

/**
 * ### icons
 *
 * Add icon support for use in Tabbar
 *
 */
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';




/**
 *  The version of the app but not  displayed yet
 */
import pack from '../package'
import AppWithNavigationState from './modules/navigators/AppNavigator'

var VERSION = pack.version



/**
 * ## Native
 *
 * ```configureStore``` with the ```initialState``` and set the
 * ```platform``` and ```version``` into the store by ```dispatch```.
 * *Note* the ```store``` itself is set into the ```store```.  This
 * will be used when doing hot loading
 */

export default function native(platform) {
  // configureStore will combine modules from FarEye and Main application
  // it will then create the store based on aggregate state from all modules
  const store = configureStore({})

  // store.dispatch(setPlatform(platform))
  // store.dispatch(setVersion(VERSION))
  // store.dispatch(setStore(store))

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
