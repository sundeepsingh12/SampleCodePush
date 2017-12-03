'use strict'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


import Ionicons from 'react-native-vector-icons/Ionicons'
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'
import ResyncLoader from '../components/ResyncLoader'


import React, {Component} from 'react'
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native'

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  Left,
  Body,
  Right,
  Icon,
  Footer,
  FooterTab,
  StyleProvider
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'

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


class SyncScreen extends Component {

  componentDidMount() {
    this.props.actions.startMqttService()
    this.props.actions.performSyncService(true)
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>

          <Header searchBar style={StyleSheet.flatten([styles.bgWhite, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontBlack, styles.fontLg, styles.alignCenter, styles.fontWeight500]}>Sync</Text>  
                  <Text style={[styles.fontCenter, styles.fontBlack, styles.fontSm, styles.alignCenter]}>Last Synced 20 Minutes ago</Text>  
                </View>
                <View/>
              </View>
            </Body>
          </Header>

          <Content style={[styles.flex1, styles.bgLightGray]}>
            {/*card 1*/}
              <View style={[styles.bgWhite, styles.padding30, styles.margin10]}>
                <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
                  <View style={[styles.alignCenter, styles.justifyCenter]}>
                      <Image
                        style={styles.imageSync}
                        source={require('../../images/fareye-default-iconset/unable-to-sync.png')}
                      />
                  </View>
                </View>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.paddingTop10, styles.paddingBottom10]}>
                  <Text style={[styles.fontLg, styles.fontBlack]}>
                      Can’t Connect to the internet
                  </Text>
                  <View style={[styles.paddingTop15]}>
                    <Button onPress = {() => {this.props.actions.onResyncPress()}}  style={StyleSheet.flatten([styles.bgPrimary])} >
                      <Text> Retry </Text>
                    </Button>
                  </View>
                </View>
              </View>

              <View style={[styles.bgWhite, styles.padding15]}>
                 <Text style={[styles.fontLg, styles.fontWeight500, styles.marginBottom10]}>
                      Unsynced Tasks
                  </Text>
                  <Text style={[styles.fontDefault, styles.paddingTop10, styles.paddingBottom10]}>
                      REF32546223 / Josh Smith
                  </Text>
                  <Text style={[styles.fontDefault, styles.paddingTop10, styles.paddingBottom10]}>
                      REF32546223 / Josh Smith
                  </Text>
                  <Text style={[styles.fontDefault, styles.paddingTop10, styles.paddingBottom10]}>
                      REF32546223 / Josh Smith
                  </Text>
              </View>
          </Content>
        </Container>
      </StyleProvider>

      )
  }

};

const style = StyleSheet.create({
  header: {
    height: 'auto',
    padding: 0,
    paddingRight: 0, 
    paddingLeft: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3'
  },
  headerBody : {
    width: '100%', 
    paddingTop: 5,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10
  },
  
  footer: {
    height: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3'
  },
  imageSync: {
    width: 84,
    resizeMode: 'contain'
  }
  
});


export default connect(mapStateToProps, mapDispatchToProps)(SyncScreen)
