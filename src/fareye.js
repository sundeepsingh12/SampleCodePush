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
 * ### containers
 *
 * All the top level containers
 *
 */
import ResyncLoader from './components/ResyncLoader'
import FormLayout from './containers/FormLayout'
/**
 * ### icons
 *
 * Add icon support for use in Tabbar
 *
 */
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * ## Actions
 *  The necessary actions for dispatching our bootstrap values
 */
import { setPlatform, setVersion } from './modules/device/deviceActions'
import { setStore } from './modules/global/globalActions'
import { onResyncPress } from './modules/home/homeActions'

/**
 * ## States
 * Snowflake explicitly defines initial state
 *
 */
import AuthInitialState from './modules/login/loginInitialState'
import DeviceInitialState from './modules/device/deviceInitialState'
import GlobalInitialState from './modules/global/globalInitialState'
import PreloaderInitiaState from './modules/pre-loader/preloaderInitialState'
import HomeInititalState from './modules/home/homeInitialState'
import ListingInitialState from './modules/listing/listingInitialState'
import SkuListingInitialState from './modules/skulisting/skuListingInitialState'
import FormLayoutInitialState from './modules/form-layout/formLayoutInitialState'
import SequenceInitialState from './modules/sequence/sequenceInitialState'
import NewJobInitialState from './modules/newJob/newJobInitialState'
import SaveActivatedState from './modules/saveActivated/saveActivatedInitialState'
import TransientStatusState from './modules/transientStatus/transientInitialState'
import BulkInitialState from './modules/bulk/bulkInitialState'
// import ProfileInitialState from './modules/profile/profileInitialState'


/**
 *  The version of the app but not  displayed yet
 */
import pack from '../package'
import AppWithNavigationState from './modules/navigators/AppNavigator'
 
var VERSION = pack.version

/**
 *
 * ## Initial state
 * Create instances for the keys of each structure in snowflake
 * @returns {Object} object with 4 keys
 */
function getInitialState() {
  const _initState = {
    auth: new AuthInitialState(),
    device: (new DeviceInitialState()).set('isMobile', true),
    global: (new GlobalInitialState()),
    preloader: (new PreloaderInitiaState()),
    home: (new HomeInititalState()),
    listing: (new ListingInitialState()),
    skuListing: new SkuListingInitialState(),
    formLayout : new FormLayoutInitialState(),
    sequence: new SequenceInitialState(),
    newJob : new NewJobInitialState(),
    transientStatus : new TransientStatusState(),
    saveActivated : new SaveActivatedState(),
    bulk:new BulkInitialState(),
  }
  return _initState
}

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
      const store = configureStore(getInitialState())

      store.dispatch(setPlatform(platform))
      store.dispatch(setVersion(VERSION))
      store.dispatch(setStore(store))

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

  AppRegistry.registerComponent('FareyeReact', () => Fareye)
}
