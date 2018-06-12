import React from 'react'
import { connect } from 'react-redux'
import { addNavigationHelpers, createStackNavigator } from 'react-navigation'
import { BackHandler } from 'react-native'
import Login from '../../containers/Login'
import Preloader from '../../containers/Preloader'
import Application from '../../containers/Application'
import QrCodeScanner from '../../containers/QrCodeScanner'
import { Container, Content, Footer, FooterTab, Card, CardItem, Button, Body, Header, Left, Right, Icon, List, ListItem, Root, } from 'native-base'
import styles from '../../themes/FeStyle'
import { NavigationActions } from 'react-navigation'
import AutoLogout from '../../containers/AutoLogout'
import UnsyncBackupUpload from '../../containers/UnsyncBackupUpload'
import HomeTabNavigator from '../../containers/HomeTabNavigator'
import { ApplicationScreen, HardwareBackPress, HomeScreen, HomeTabNavigatorScreen, LoginScreen, PreloaderScreen, SHOW_DISCARD_ALERT, RETURN_TO_HOME, SET_TRANSIENT_BACK_PRESSED, SET_SEQUENCE_BACK_ENABLED } from '../../lib/constants'
import { createReduxBoundAddListener, createReactNavigationReduxMiddleware, initializeListeners } from 'react-navigation-redux-helpers'
import { setState } from '../global/globalActions'
import PropTypes from 'prop-types'


class AppWithNavigationState extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

  componentDidMount() {
    initializeListeners('root', this.props.nav);
    BackHandler.addEventListener(HardwareBackPress, this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props
    let route = nav.routes[nav.index]
    if (nav.index === 0) {
      return false
    }
    switch (route.routeName) {
      case 'SaveActivated': {
        dispatch(setState(SHOW_DISCARD_ALERT, true))
        return true
      }
      case 'CheckoutDetails': {
        dispatch(setState(RETURN_TO_HOME, true))
        return true
      }
      case 'Transient': {
        dispatch(setState(SET_TRANSIENT_BACK_PRESSED, true))
        return true
      }
      case 'Sequence': {
        dispatch(setState(SET_SEQUENCE_BACK_ENABLED, true))
        return true
      }
      case ApplicationScreen:
      case LoginScreen:
      case 'UnsyncBackupUpload':
      case PreloaderScreen:
      case HomeTabNavigatorScreen:
        return false
    }
    dispatch(NavigationActions.back());
    return true
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(HardwareBackPress, this.onBackPress);
  }

  render() {
    const { dispatch, nav } = this.props;
    const navigation = {
      dispatch,
      state: nav,
      addListener: createReduxBoundAddListener('root'),
    };
    return (
      <Root>
        <AppNavigator navigation={navigation}
        />
      </Root>
    )
  }
}

export const AppNavigator = createStackNavigator({
  ApplicationScreen: {
    screen: Application,
    navigationOptions: {
      header: null
    }
  },
  LoginScreen: {
    screen: Login,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    },
  },
  PreloaderScreen: {
    screen: Preloader,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  AutoLogoutScreen: {
    screen: AutoLogout,
    navigationOptions: {
      header: null
    }
  },
  QrCodeScanner: {
    screen: QrCodeScanner,
    navigationOptions: {
      title: 'Scanner',
      header: null,
    }
  },
  HomeTabNavigatorScreen: {
    screen: HomeTabNavigator,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  UnsyncBackupUpload: {
    screen: UnsyncBackupUpload,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
},
  {
    cardStyle: {
      backgroundColor: 'white'
    }
  });

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav
);


const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState)