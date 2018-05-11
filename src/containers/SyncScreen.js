'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


import Ionicons from 'react-native-vector-icons/Ionicons'
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'


import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native'

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

import {
  AUTHENTICATING,
  DOWNLOADING,
  INTERNAL_ERROR,
  INTERNAL_SERVER_ERROR,
  NO_INTERNET,
  RE_SYNC,
  RETRY,
  SYNC_OK_TEXT,
  UNSYNCED_TASKS,
  UPLOADING,
} from '../lib/ContainerConstants'

import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
  return {
    syncStatus: state.home.syncStatus,
    unsyncedTransactionList: state.home.unsyncedTransactionList,
    pieChart: state.home.pieChart,
    lastSyncTime: state.home.lastSyncTime,
    trackingServiceStarted: state.home.trackingServiceStarted,
    customErpPullActivated: state.home.customErpPullActivated,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...homeActions
    }, dispatch)
  }
}


class SyncScreen extends PureComponent {

  getTransactionView() {
    let transactionList = this.props.unsyncedTransactionList
    let transactionView = []
    for (let index in transactionList) {
      if (!transactionList[index]) {
        continue
      }
      transactionView.push(
        <Text key={transactionList[index].id} style={[styles.fontDefault, styles.paddingTop10, styles.paddingBottom10]}>
          {transactionList[index].referenceNumber}
        </Text>
      )
    }
    if (transactionView.length == 0) {
      return null
    }
    return (
      <View style={[styles.bgWhite, styles.padding15]}>
        <Text style={[styles.fontLg, styles.fontWeight500, styles.marginBottom10]}>
          {UNSYNCED_TASKS}
        </Text>
        {transactionView}
      </View>
    )
  }

  getSyncView() {
    if (this.props.syncStatus == 'Uploading') {
      return (
        <View style={[styles.bgWhite, styles.padding30, styles.margin10]}>
          <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
            <View style={[styles.alignCenter, styles.justifyCenter]}>
              <Text>{UPLOADING}</Text>
            </View>
          </View>
        </View>
      )
    }
    else if (this.props.syncStatus == 'Downloading') {
      return (
        <View style={[styles.bgWhite, styles.padding30, styles.margin10]}>
          <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
            <View style={[styles.alignCenter, styles.justifyCenter]}>
              <Text>{DOWNLOADING}</Text>
            </View>
          </View>
        </View>
      )
    }
    else if (this.props.syncStatus == 'OK') {
      return (
        <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
          <Image
            style={style.imageSync}
            source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
          />
          <Text style={[styles.fontLg, styles.fontBlack, styles.marginTop30]}>
            {SYNC_OK_TEXT}
          </Text>
          <View style={[styles.marginTop30]}>
            <Button style={{backgroundColor : styles.bgPrimaryColor}} onPress={() => { this.props.actions.performSyncService(this.props.pieChart, this.props.customErpPullActivated == 'notActivated') }}>
              <Text> {RE_SYNC} </Text>
            </Button>
          </View>
        </View>
      )
    } else if (this.props.syncStatus == 'INTERNALSERVERERROR') {
      return (
        <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
          <Image
            style={style.imageSync}
            source={require('../../images/fareye-default-iconset/syncscreen/Server_Error.png')}
          />
          <Text style={[styles.fontLg, styles.fontBlack, styles.marginTop30]}>
            {INTERNAL_SERVER_ERROR}
          </Text>
          <View style={[styles.marginTop30]}>
            <Button style={{backgroundColor : styles.bgPrimaryColor}} onPress={() => { this.props.actions.performSyncService(this.props.pieChart, this.props.customErpPullActivated == 'notActivated') }}>
              <Text> {RETRY} </Text>
            </Button>
          </View>
        </View>
      )
    }
    else if (this.props.syncStatus == 'NOINTERNET') {
      return (
        <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
          <Image
            style={style.imageSync}
            source={require('../../images/fareye-default-iconset/syncscreen/No_Internet.png')}
          />
          <Text style={[styles.fontLg, styles.fontBlack, styles.marginTop30]}>
            {NO_INTERNET}
          </Text>
          <View style={[styles.marginTop30]}>
            <Button style={{backgroundColor : styles.bgPrimaryColor}} onPress={() => { this.props.actions.performSyncService(this.props.pieChart, this.props.customErpPullActivated == 'notActivated') }}>
              <Text> {RETRY} </Text>
            </Button>
          </View>
        </View>
      )
    } else if (this.props.syncStatus == 'RE_AUTHENTICATING') {
      return (
        <View style={[styles.bgWhite, styles.padding30, styles.margin10]}>
          <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
            <View style={[styles.alignCenter, styles.justifyCenter]}>
              <Text>{AUTHENTICATING}</Text>
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
          <Image
            style={style.imageSync}
            source={require('../../images/fareye-default-iconset/syncscreen/Server_Error.png')}
          />
          <Text style={[styles.fontLg, styles.fontBlack, styles.marginTop30]}>
            {INTERNAL_ERROR}
          </Text>
          <View style={[styles.marginTop30]}>
            <Button style={{backgroundColor : styles.bgPrimaryColor}} onPress={() => { this.props.actions.performSyncService(this.props.pieChart, this.props.customErpPullActivated == 'notActivated') }}>
              <Text> {RETRY} </Text>
            </Button>
          </View>
        </View>
      )
    }

  }

  render() {

    if (this.props.syncStatus == 'LOADING') {
      return <Loader />
    }

    const syncView = this.getSyncView()
    const transactionView = this.getTransactionView()
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>

          <Header searchBar style={StyleSheet.flatten([styles.bgWhite, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontBlack, styles.fontLg, styles.alignCenter, styles.fontWeight500]}>Sync</Text>
                  <Text style={[styles.fontCenter, styles.fontBlack, styles.fontSm, styles.alignCenter]}>{this.props.lastSyncTime}</Text>
                </View>
                <View />
              </View>
            </Body>
          </Header>

          <Content style={[styles.bgLightGray]}>
            {syncView}
            {transactionView}
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
  headerBody: {
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
    width: 116,
    height: 116,
    resizeMode: 'contain'
  }

});


export default connect(mapStateToProps, mapDispatchToProps)(SyncScreen)
