import React from 'react';
import { connect } from 'react-redux'
import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  TouchableOpacity
} from 'react-native'

import Login from '../../containers/Login'
import Preloader from '../../containers/Preloader'
import Application from '../../containers/Application'
import Home from '../../containers/Home'
import Message from '../../containers/Message'
import Utilties from '../../containers/Utilities'
import TimePicker from '../../containers/TimePicker'
import DatePicker from '../../containers/DatePicker'
import Logout from '../../containers/Logout'
import JobDetails from '../../containers/JobDetails'
import FormLayout from '../../containers/FormLayout'
import { Container, Content, Footer, FooterTab, Card, CardItem, Button, Body, Header, Left, Right, Icon, List, ListItem } from 'native-base';
import styles from '../../themes/FeStyle'
import theme from '../../themes/feTheme'

import Ionicons from 'react-native-vector-icons/Ionicons';


class AppWithNavigationState extends React.Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({ dispatch : this.props.dispatch, state: this.props.nav })} />
    )
  }
}

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
  Home: {
    screen: Home,
    navigationOptions: {
      title: 'Home',
      headerLeft: null,
      headerBackTitle: null
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
  },
  JobDetails: {
    screen: JobDetails,
  },
  TimePicker: {
    screen: TimePicker,
  },
  DatePicker:{
    screen: DatePicker,
  },
  FormLayout: {
    screen: FormLayout
   },
    // cardStyle: {
    //   backgroundColor: 'white'
    // },
  });

// const AppWithNavigationState = ({ dispatch, nav }) => (
//   <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
// );

const mapStateToProps = state => (
  {
    nav: state.nav,
  });

export default connect(mapStateToProps)(AppWithNavigationState);