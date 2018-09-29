import React from 'react'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import Login from '../../containers/Login'
import Application from '../../containers/Application'
import { setTopLevelNavigator } from './NavigationService';

class AppWithNavigationState extends React.PureComponent {
  render() {
    return (
        <AppNavigator 
          ref= {
            navigatorRef => {
              setTopLevelNavigator(navigatorRef);
            }
          }
        />
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
  },{
    headerMode: 'none',
    cardStyle: {
      backgroundColor: 'white'
    },
  }),
},{
  initialRouteName: 'ApplicationScreen',
  backBehavior: 'none',
  resetOnBlur: true
});

export default AppWithNavigationState;
