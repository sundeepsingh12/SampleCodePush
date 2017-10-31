import React from 'react';
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
  TouchableOpacity
} from 'react-native'

import Login from '../../containers/Login'
import Preloader from '../../containers/Preloader'
import Application from '../../containers/Application'
import Home from '../../containers/Home'
import Message from '../../containers/Message'
import Utilties from '../../containers/Utilities'
import Logout from '../../containers/Logout'
import JobDetails from '../../containers/JobDetails'
import HomeUI from '../../containers/HomeUI'
import JobDetailsV2 from '../../containers/JobDetailsV2'
import Sequence from '../../containers/Sequence'
import SkuDetails from '../../containers/SkuDetails'
import NewJob from '../../containers/NewJob'
import NewJobStatus from '../../containers/NewJobStatus'
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
  ListItem
} from 'native-base';
import styles from '../../themes/FeStyle'
import Payment from '../../containers/Payment'
import UPIPayment from '../../containers/UPIPayment'
import PayByLink from '../../containers/PayByLink'
import FixedSKUListing from '../../containers/FixedSKUListing'
import Signature from '../../containers/Signature'
import FormLayout from '../../containers/FormLayout'
import SkuListing from '../../containers/SkuListing'
import SignatureAndNps from '../../containers/SignatureAndNps'
import OverlayAttributes from '../../containers/OverlayAttributes'
import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectFromList from '../../containers/SelectFromList';

class AppWithNavigationState extends React.Component {
  render() {
    return ( <
      AppNavigator navigation = {
        addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })
      }
      />
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
    navigationOptions: {
      header: null
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      title: 'Home',
      headerLeft: null,
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
  Logout: {
    screen: Logout,
  },
  JobDetails: {
    screen: JobDetails,
     },
  SelectFromList: {
    screen: SelectFromList,
  },
  HomeUI: {
    screen: HomeUI
  },
  JobDetailsV2: {
    screen: JobDetailsV2
  },
  Sequence: {
    screen: Sequence
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
  FixedSKUListing: {
    screen: FixedSKUListing,
    navigationOptions: {
      title: 'FixedSKU',
    }
  },
  Signature: {
    screen: Signature,
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
  }
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

export default connect(mapStateToProps)(AppWithNavigationState);