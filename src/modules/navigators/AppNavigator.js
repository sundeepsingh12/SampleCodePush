import React from 'react'
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
import Home from '../../containers/Home'
import Sequence from '../../containers/Sequence'
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
import JobDetailsV2 from '../../containers/JobDetailsV2'
import LiveJobListing from '../../containers/LiveJobListing'
import LiveJob from '../../containers/LiveJob'
import Summary from '../../containers/Summary'
import CustomApp from '../../containers/CustomApp'
import QrCodeScanner from '../../containers/QrCodeScanner'
import CameraFieldAttribute from '../../containers/CameraFieldAttribute'
import SequenceRunsheetList from '../../containers/SequenceRunsheetList'
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
import ArrayFieldAttribute from '../../containers/ArrayFieldAttribute'
import DataStoreItemDetails from '../../components/DataStoreItemDetails'
import SignatureAndNps from '../../containers/SignatureAndNps'
import SaveActivated from '../../containers/SaveActivated'
import Transient from '../../containers/Transient'
import CheckoutDetails from '../../containers/CheckoutDetails'
import CashTendering from '../../containers/CashTendering'
import Statistics from '../../containers/Statistics'
import Sorting from '../../containers/Sorting'
import DataStoreDetails from '../../containers/DataStoreDetails'
import OfflineDS from '../../containers/OfflineDS'
import ImageDetailsView from '../../containers/ImageDetailsView'
import { NavigationActions } from 'react-navigation'
import PostAssignmentScanner from '../../containers/PostAssignmentScanner'
import JobMaster from '../../containers/JobMaster'
import AutoLogout from '../../containers/AutoLogout'
import Backup from '../../containers/Backup'
import UnsyncBackupUpload from '../../containers/UnsyncBackupUpload'
import HomeTabNavigator from '../../containers/HomeTabNavigator'
import {
  ApplicationScreen,
  HardwareBackPress,
  HomeScreen,
  HomeTabNavigatorScreen,
  LoginScreen,
  PreloaderScreen,
  SHOW_DISCARD_ALERT,
  RETURN_TO_HOME,
  SET_TRANSIENT_BACK_PRESSED
} from '../../lib/constants'
import SplitPayment from '../../containers/SplitPayment'
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import { setState } from '../global/globalActions'
import BluetoothListing from '../../containers/BluetoothListing'


class AppWithNavigationState extends React.PureComponent {

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
    return (
      <Root>
        <AppNavigator navigation={
          addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.nav,
            addListener
          })
        }
        />
      </Root>
    )
  }
}

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
  Payment: {
    screen: Payment
  },
  JobDetailsV2: {
    screen: JobDetailsV2,
    header: null
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
  Statistics: {
    screen: Statistics,
    navigationOptions: {
      header: null,
    }
  },
  Sorting: {
    screen: Sorting,
    navigationOptions: {
      title: 'Sorting',
      header: null,
    }
  },
  HomeTabNavigatorScreen: {
    screen: HomeTabNavigator,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Sequence: {
    screen: Sequence,
  },
  Summary: {
    screen: Summary,
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
      header: null
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
  SaveActivated: {
    screen: SaveActivated,
    navigationOptions: {
      gesturesEnabled: false,
    }
  },
  Transient: {
    screen: Transient,
    navigationOptions: {
      gesturesEnabled: false,
    }
  },
  CheckoutDetails: {
    screen: CheckoutDetails,
    navigationOptions: {
      gesturesEnabled: false,
    }
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
      header: null
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
  PostAssignmentScanner: {
    screen: PostAssignmentScanner
  },
  JobMasterListScreen: {
    screen: JobMaster
  },
  DataStoreDetails: {
    screen: DataStoreDetails
  },
  OfflineDS: {
    screen: OfflineDS
  },
  CameraAttribute: {
    screen: CameraFieldAttribute,
  },
  ImageDetailsView: {
    screen: ImageDetailsView,
  },
  Backup: {
    screen: Backup,
  },
  SplitPayment: {
    screen: SplitPayment,
  },
  SequenceRunsheetList: {
    screen: SequenceRunsheetList
  },
  UnsyncBackupUpload: {
    screen: UnsyncBackupUpload,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  
  BluetoothListing:{
    screen:BluetoothListing
  }
},
  {
    cardStyle: {
      backgroundColor: 'white'
    }
  });

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);
const addListener = createReduxBoundAddListener("root");
// end for react-navigation 1.0.0-beta.30

// const AppWithNavigationState = ({ dispatch, nav }) => (
//   <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
// );

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState)