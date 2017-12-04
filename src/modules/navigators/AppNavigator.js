import React from 'react'
import moment from 'moment'
import {
  connect
} from 'react-redux'
import {
  addNavigationHelpers,
  StackNavigator,
  TabNavigator
} from 'react-navigation'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  TouchableOpacity,
  BackHandler
} from 'react-native'

import Login from '../../containers/Login'
import Preloader from '../../containers/Preloader'
import Application from '../../containers/Application'
import Message from '../../containers/Message'
import Utilties from '../../containers/Utilities'
import Logout from '../../containers/Logout'
import JobDetails from '../../containers/JobDetails'
import HomeUI from '../../containers/HomeUI'
import Home from '../../containers/Home'
import Sequence from '../../containers/Sequence'
import SkuDetails from '../../containers/SkuDetails'
import Menu from '../../containers/Menu'
import ProfileView from '../../containers/ProfileView'
import ResetPassword from '../../containers/ResetPassword'
import SyncScreen from '../../containers/SyncScreen'
import TabScreen from '../../containers/TabScreen'
import TaskListScreen from '../../containers/TaskListScreen'
import NewJob from '../../containers/NewJob'
import NewJobStatus from '../../containers/NewJobStatus'
import DataStore from '../../containers/DataStore'
import BulkListing from '../../containers/BulkListing'
import BulkConfiguration from '../../containers/BulkConfiguration'
import FormDetailsV2 from '../../containers/FormDetailsV2'
import UIViews from '../../containers/UIViews'
import JobDetailsV2 from '../../containers/JobDetailsV2'
import LiveJobListing from '../../containers/LiveJobListing'
import LiveJob from '../../containers/LiveJob'
import CustomApp from '../../containers/CustomApp'
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Card,
  CardItem,
  Button,
  Body,
  Header,
  Left,
  Right,
  Icon,
  List,
  ListItem,
  Root,
} from 'native-base'
import styles from '../../themes/FeStyle'
import Payment from '../../containers/Payment'
import UPIPayment from '../../containers/UPIPayment'
import PayByLink from '../../containers/PayByLink'
import FixedSKUListing from '../../containers/FixedSKUListing'
import Signature from '../../containers/Signature'
import FormLayout from '../../containers/FormLayout'
import SkuListing from '../../containers/SkuListing'
import OverlayAttributes from '../../containers/OverlayAttributes'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArrayFieldAttribute from '../../containers/ArrayFieldAttribute'
import DataStoreItemDetails from '../../components/DataStoreItemDetails'
import SignatureAndNps from '../../containers/SignatureAndNps'
import SelectFromList from '../../containers/SelectFromList'
import CashTendering from '../../containers/CashTendering'
import HomeFooter from '../../containers/HomeFooter'
import Statistics from '../../containers/Statistics'
import Sorting from '../../containers/Sorting'
import { NavigationActions } from 'react-navigation'
import {
  ApplicationScreen,
  HardwareBackPress,
  HomeScreen,
  HomeTabNavigatorScreen,
  LoginScreen,
  PreloaderScreen,
} from '../../lib/constants'

class AppWithNavigationState extends React.Component {

  componentDidMount() {
    BackHandler.addEventListener(HardwareBackPress, this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props
    let route = nav.routes[nav.index]
    if (nav.index === 0) {
      return false
    }
    switch (route.routeName) {
      case ApplicationScreen:
      case LoginScreen:
      case PreloaderScreen: return false
      case HomeTabNavigatorScreen: {
        if (route.routes[route.index].routeName == HomeScreen) {
          return false
        }
      }
    }
    dispatch(NavigationActions.back());
    return true
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(HardwareBackPress, this.onBackPress);
  }

  render() {
    return (
      <Root>
        <AppNavigator navigation={
          addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.nav
          })
        }
        />
      </Root>
    )
  }
}

export const HomeTabNavigator = TabNavigator({
  HomeScreen: {
    screen: Home,
    navigationOptions: {
      header: null,
      title: 'Home',
      tabBarIcon: <Icon name='ios-home' style={{ fontSize: 18 }}></Icon>
    }
  },
  SyncScreen: {
    screen: SyncScreen,
    navigationOptions: {
      header: null,
      title: 'Sync',
      tabBarIcon: <Icon name='ios-sync' style={{ fontSize: 18 }}></Icon>
    }
  },
  MenuScreen: {
    screen: Menu,
    navigationOptions: {
      header: null,
      title: 'Menu',
      tabBarIcon: <Icon name='ios-menu' style={{ fontSize: 18 }}></Icon>
    }
  }
},
  {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
      showIcon: true,
      activeTintColor: '#000000',
      inactiveTintColor: '#000000',
      style: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3'
      },
      labelStyle: {
        fontSize: 12
      },
      tabStyle: {
        alignItems: 'center',
        height: 50,
        paddingTop: 5,
        paddingBottom: 5
      },
      indicatorStyle: {
        height: 0
      }

    }
  }
);

export const AppNavigator = StackNavigator({
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
    },
  },
  PreloaderScreen: {
    screen: Preloader,
    navigationOptions: {
      header: null
    }
  },
  Message: {
    screen: Message
  },
  Utilties: {
    screen: Utilties,
  },
  Payment: {
    screen: Payment
  },
  UIViews: {
    screen: UIViews
  },
  JobDetailsV2: {
    screen: JobDetailsV2,
    header: null
  },
  Logout: {
    screen: Logout,
  },
  JobDetails: {
    screen: JobDetails,
  },
  SelectFromList: {
    screen: SelectFromList,
  },
  Statistics: {
    screen: Statistics,
    navigationOptions: {
      title: 'STATISTICS : ' + moment(new Date()).format('DD-MM-YYYY'),
    }
  },
  Sorting: {
    screen: Sorting,
    navigationOptions: {
      title: 'Sorting',
      header: null,
    }
  },
  HomeUI: {
    screen: HomeUI
  },
  HomeTabNavigatorScreen: {
    screen: HomeTabNavigator
  },
  Sequence: {
    screen: Sequence,
  },
  Menu: {
    screen: Menu
  },
  ProfileView: {
    screen: ProfileView
  },
  SyncScreen: {
    screen: SyncScreen
  },
  ResetPassword: {
    screen: ResetPassword
  },
  TabScreen: {
    screen: TabScreen
  },
  ResetPassword: {
    screen: ResetPassword
  },
  SkuDetails: {
    screen: SkuDetails
  },
  NewJob: {
    screen: NewJob
  },
  NewJobStatus: {
    screen: NewJobStatus
  },
  SkuListing: {
    screen: SkuListing,
    navigationOptions: {
      title: 'SKU Listing',
    }
  },
  UPIPayment: {
    screen: UPIPayment
  },
  PayByLink: {
    screen: PayByLink
  },
  CustomApp: {
    screen: CustomApp
  },
  FixedSKUListing: {
    screen: FixedSKUListing,
    navigationOptions: {
      title: 'FixedSKU',
    }
  },
  Signature: {
    screen: Signature,
    navigationOptions: {
      header: null
    }
  },
  FormLayout: {
    screen: FormLayout,
    navigationOptions: {
      header: null
    }
  },
  OverlayAttributes: {
    screen: OverlayAttributes,
  },
  SignatureAndNps: {
    screen: SignatureAndNps
  },
  ArrayFieldAttribute: {
    screen: ArrayFieldAttribute
  }
  ,
  DataStore: {
    screen: DataStore,
  },
  DataStoreItemDetails: {
    screen: DataStoreItemDetails
  },
  SignatureAndNps: {
    screen: SignatureAndNps
  },
  BulkConfiguration: {
    screen: BulkConfiguration
  },
  BulkListing: {
    screen: BulkListing
  },
  CashTendering: {
    screen: CashTendering,
    navigationOptions: {
      title: 'Collect Cash',
    }
  },
  TaskListScreen: {
    screen: TaskListScreen
  },
  LiveJobs: {
    screen: LiveJobListing
  },
  LiveJob: {
    screen: LiveJob
  },
  FormDetailsV2: {
    screen: FormDetailsV2
  },
},
  {
    cardStyle: {
      backgroundColor: 'white'
    }
  });

// const AppWithNavigationState = ({ dispatch, nav }) => (
//   <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
// );

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState)