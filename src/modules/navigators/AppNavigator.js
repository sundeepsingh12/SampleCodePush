import React from 'react'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import Login from '../../containers/Login'
import Preloader from '../../containers/Preloader'
import Application from '../../containers/Application'
import QrCodeScanner from '../../containers/QrCodeScanner'
import {  Root } from 'native-base'
import AutoLogout from '../../containers/AutoLogout'
import UnsyncBackupUpload from '../../containers/UnsyncBackupUpload'
import { HomeErpTab, HomeTab} from '../../containers/HomeTabNavigators'
import { setTopLevelNavigator } from './NavigationService';

class AppWithNavigationState extends React.PureComponent {
  render() {
    return (
      <Root>
        <AppNavigator 
          ref= {
            navigatorRef => {
              setTopLevelNavigator(navigatorRef);
            }
          }
        />
      </Root>
    )
  }
}

const AppNavigator = createSwitchNavigator({
  ApplicationScreen: Application,
  AuthRoute: createStackNavigator({
    LoginScreen: {
      screen: Login,
      navigationOptions: {
        gesturesEnabled: false
      },
    },
    PreloaderScreen: {
      screen: Preloader,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    QrCodeScanner: {
      screen: QrCodeScanner,
      navigationOptions: {
        title: 'Scanner',
      }
    }
  },{
    headerMode: 'none',
    cardStyle: {
      backgroundColor: 'white'
    },
  }),
  LoggedIn: HomeTab,
  LoggedInERP: HomeErpTab,
  UnsyncBackupUpload: {
    screen: UnsyncBackupUpload,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  AutoLogoutScreen: {
    screen: AutoLogout,
  }
},{
  initialRouteName: 'ApplicationScreen',
  backBehavior: 'none',
  resetOnBlur: true
});

export default AppWithNavigationState;
