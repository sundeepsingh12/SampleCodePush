'use strict'
import React from 'react'
import {
    AppRegistry,
    StyleSheet,
    View,
    Text } from 'react-native'
/**
 * ### Router-Flux
 *
 * Necessary components from Router-Flux
 */
import { Router, Scene, Actions} from 'react-native-router-flux'

/**
 * ### Redux
 *
 * ```Provider``` will tie the React-Native to the Redux store
 */
import { Provider } from 'react-redux'
/**
 * ### configureStore
 *
 *  ```configureStore``` will connect the ```reducers```, the
 *
 */
import configureStore from './lib/configureStore'

/**
 * ### containers
 *
 * All the top level containers
 *
 */
import Application from './containers/Application'
import Login from './containers/Login'
import Logout from './containers/Logout'
// import Register from './containers/Register'
// import ForgotPassword from './containers/ForgotPassword'
// import Profile from './containers/Profile'
import Main from './containers/Main'
import Utilities from './containers/Utilities'
import Message from './containers/Message'
import Scanner from './components/Scanner'
// import Subview from './containers/Subview'

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
import {setPlatform, setVersion} from './reducers/device/deviceActions'
import {setStore} from './reducers/global/globalActions'

/**
 * ## States
 * Snowflake explicitly defines initial state
 *
 */
import AuthInitialState from './reducers/login/loginInitialState'
import DeviceInitialState from './reducers/device/deviceInitialState'
import GlobalInitialState from './reducers/global/globalInitialState'
// import ProfileInitialState from './reducers/profile/profileInitialState'

/**
 *  The version of the app but not  displayed yet
 */
import pack from '../package'
var VERSION = pack.version

/**
 *
 * ## Initial state
 * Create instances for the keys of each structure in snowflake
 * @returns {Object} object with 4 keys
 */
function getInitialState () {
  const _initState = {
    auth: new AuthInitialState(),
    device: (new DeviceInitialState()).set('isMobile', true),
    global: (new GlobalInitialState())
  }
  return _initState
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    borderTopWidth: 1,
    borderColor: '#d3d3d3',
    backgroundColor: '#ffffff'
  },

  mainHeader: {
    backgroundColor: 'white'
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'normal',
  }
})

/**
 * ## TabIcon
 *
 * Displays the icon for the tab w/ color dependent upon selection
 */
class TabIcon extends React.Component {
  render () {
    var color = this.props.selected ? '#0091EA' : '#878787'
    return (
      <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', alignSelf: 'center'}}>
        <Ionicons style={{color: color}} name={this.props.iconName} size={26} />
        <Text style={{color: color, fontSize: 12, marginTop: 3}}>{this.props.title}</Text>
      </View>
     )
  }
}

/**
 * ## Native
 *
 * ```configureStore``` with the ```initialState``` and set the
 * ```platform``` and ```version``` into the store by ```dispatch```.
 * *Note* the ```store``` itself is set into the ```store```.  This
 * will be used when doing hot loading
 */

export default function native (platform) {
  let Fareye = React.createClass({
    render () {
      const store = configureStore(getInitialState())

      // configureStore will combine reducers from FarEye and Main application
      // it will then create the store based on aggregate state from all reducers
      store.dispatch(setPlatform(platform))
      store.dispatch(setVersion(VERSION))
      store.dispatch(setStore(store))

      // setup the router table with App selected as the initial component
      // note: See https://github.com/aksonov/react-native-router-flux/issues/948
      return (

        <Provider store={store}>
          <Router sceneStyle={{ backgroundColor: 'white' }}>
            
            <Scene key='root'
              hideNavBar={false} >
              <Scene key='App'
                component={Application}
                hideNavBar
                type='replace'
                initial />

              <Scene key='InitialLoginForm'
                component={Login}
                hideNavBar
                type='replace' />

                <Scene key='Scanner'
                       title='Scanner'
                       component={Scanner} />

              <Scene key='Tabbar'
                tabs
                hideNavBar
                tabBarStyle={styles.tabBar}
                default='Main'>

                  <Scene key='Main'
                    title='Home'
                    iconName={"ios-home-outline"}
                    icon={TabIcon}
                    hideNavBar
                    component={Main}
                    initial />

                  <Scene key='ReSync'
                    title='Re-sync'
                    icon={TabIcon}
                    iconName={"ios-sync-outline"}
                    onPress={()=> {}}/>

                  <Scene key='Message'
                    title='Message'
                    icon={TabIcon}
                    iconName={"ios-chatboxes-outline"}
                    hideNavBar
                    component={Message}/>

                  <Scene key='<Utilitie></Utilitie>s'
                    title='Utilities'
                    icon={TabIcon}
                    hideNavBar
                    iconName={"ios-apps-outline"}
                    component={Utilities}/>

                  <Scene key='Logout'
                    title='Logout'
                    icon={TabIcon}
                    iconName={"ios-power-outline"}
                    hideNavBar
                    component={Logout} />
                </Scene>
            </Scene>
          </Router>
        </Provider>
      )
    }
  })
    /**
     * registerComponent to the AppRegistery and off we go....
     */

  AppRegistry.registerComponent('FareyeReact', () => Fareye)
}
