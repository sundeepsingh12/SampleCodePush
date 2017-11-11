
'use strict'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'
import styles from '../themes/FeStyle'
import ResyncLoader from '../components/ResyncLoader'


import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
  ListView,
  Platform,
  TouchableHighlight
} from 'react-native'

import {
  Container,
  Content,
  Tab,
  Tabs,
  Body,
  Header,
  Title,
  Left,
  Right,
  ScrollableTab,
  Icon,
  Fab,
  Button,
  Footer,
  FooterTab
} from 'native-base';
import Jobs from './Jobs';
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'
import renderIf from '../lib/renderIf';
import TitleHeader from '../components/TitleHeader'

function mapStateToProps(state) {
  return {}
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...globalActions,
      ...homeActions
    }, dispatch)
  }
}

/**
 * ## App class
 */
class HomeUI extends Component {
  static navigationOptions = ({navigation}) => {
    return {}
  }
  render() {
    return (
      <View>
        <Button success onPress= {() => this.props.actions.navigateToScene('JobDetailsV2')}>
          <Text>JobDetailsV2
          </Text>
        </Button>
        <Button success onPress= {() => this.props.actions.navigateToScene('Sequence')}>
          <Text>Sequence
          </Text>
        </Button>
        <Button success onPress= {() => this.props.actions.navigateToScene('SkuDetails')}>
          <Text>SkuDetails
          </Text>
        </Button>
        <Button success onPress= {() => this.props.actions.navigateToScene('NewJob')}>
          <Text>NewJob
          </Text> 
        </Button>
        <Button success onPress= {() => this.props.actions.navigateToScene('SortingResults')}>
          <Text>SortingResults
          </Text> 
        </Button>
        <Button success onPress= {() => this.props.actions.navigateToScene('Profile')}>
          <Text>Profile
          </Text> 
        </Button>
        <Button success onPress= {() => this.props.actions.navigateToScene('ProfileView')}>
          <Text>ProfileView
          </Text> 
        </Button>
        <Button success onPress= {() => this.props.actions.navigateToScene('ResetPassword')}>
          <Text>ResetPassword
          </Text>  
        </Button>
        <Button success onPress= {() => this.props.actions.navigateToScene('ArrayScreen')}>
          <Text>ArrayScreen
          </Text>  
        </Button>
      </View>
    )
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(HomeUI)
