import React from 'react';
import { connect } from 'react-redux'
import { addNavigationHelpers, StackNavigator,TabNavigator } from 'react-navigation'

import Login from '../../containers/Login'
import Preloader from '../../containers/Preloader'
import Application from '../../containers/Application'
import Main from '../../containers/Main'
import Message from '../../containers/Message'
import Utilties from '../../containers/Utilities'
import Logout from '../../containers/Logout'

import Ionicons from 'react-native-vector-icons/Ionicons';

// const TabNav = TabNavigator(
//   {
//     Home: {
//       screen: Main,
//       navigationOptions: {
//         tabBarLabel: 'Home',
//       },
//     },
//     Resync: {
//       screen: Main,
//      tabBarLabel: 'Re-sync',
//       navigationOptions:{
//          header: null,
//          tabBarIcon: ({ tintColor }) => <Ionicons name='ios-home-outline' size={26} style={{ color: tintColor }} />
//         },
//       },
//       Message:{
//           screen: Message,
//      tabBarLabel: 'Message',
//        navigationOptions:{
//          header: null,
//          tabBarIcon: ({ tintColor }) => <Ionicons name='ios-chatboxes-outline' size={26} style={{ color: tintColor }} />
//         },
//       },
//       Utilties:{
//               screen: Utilties,
//      tabBarLabel: 'Utilities',
//      navigationOptions:{
//        header: null,
//        tabBarIcon: ({ tintColor }) => <Ionicons name='ios-apps-outline' size={26} style={{ color: tintColor }} />
//       },
//       },
//       Logout:{
//          screen: Logout,
//      tabBarLabel: 'Logout',
//      navigationOptions:{
//        header: null,
//         tabBarIcon: ({ tintColor }) => <Ionicons name='ios-power-outline' size={26} style={{ color: tintColor }} />
//       },
//       }
//   },
//   {
//     tabBarPosition: 'bottom',
//     animationEnabled: false,
//     swipeEnabled: false,
//      tabBarOptions : {
//         activeTintColor: '#000000',
//         inactiveTintColor: '#000000',
//         showIcon: 'true',
//     style: {
//       backgroundColor: 'white',
//     }
//   }
//   }
// );

export const AppNavigator = StackNavigator({
  Application: {
    screen: Application,
    navigationOptions: {
      header: null
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    },
  },
  Preloader: {
    screen: Preloader,
    navigationOptions: { header: null }
  },
  Main: {
    screen: Main,
    navigationOptions: {
      title: 'Home',
      headerLeft: null
    }
  },
  Message: {
    screen: Message
  },
  Utilties: {
    screen: Utilties,
  },
  Logout: {
    screen: Logout,
  }
},
  {
    cardStyle: {
      backgroundColor: 'white'
    }
  });

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);