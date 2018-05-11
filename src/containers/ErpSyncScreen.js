'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Modal
} from 'react-native'

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
  SYNC,
  ERP_SYNC_OK_TEXT,
  CLOSE,
  DAYS_AGO,
  HOURS_AGO,
  MINUTES_AGO,
  SECONDS_AGO,
  RESYNC_IN,
  ERP_SYNC
} from '../lib/ContainerConstants'
import {
  ERP_SYNC_STATUS
} from '../lib/constants'
import ErpSyncIcon from '../svg_components/icons/ErpSyncIcon'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'
import moment from 'moment'

function mapStateToProps(state) {
  return {
    erpSyncStatus: state.home.erpSyncStatus,
    erpModalVisible: state.home.erpModalVisible,
    lastErpSyncTime: state.home.lastErpSyncTime
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...homeActions, ...globalActions }, dispatch)
  }
}

let x = undefined

class ErpSyncScreen extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      erpSyncTimer: null
    }
  }

  getErpSyncView(isErpDisable) {
    if (this.props.erpSyncStatus == 'Downloading') {
      return (
        <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
          <ErpSyncIcon />
          <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
            <View style={[styles.alignCenter, styles.justifyCenter]}>
              <Text>{DOWNLOADING}</Text>
            </View>
          </View>
        </View>
      )
    }
    else if (this.props.erpSyncStatus == 'INTERNALSERVERERROR') {
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
            <Button style={{backgroundColor : styles.bgPrimaryColor}} onPress={() => { this.props.actions.performSyncService(this.props.pieChart, true, null, true) }}>
              <Text> {RETRY} </Text>
            </Button>
          </View>
        </View>
      )
    }
    else if (this.props.erpSyncStatus == 'NOINTERNET') {
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
            <Button style={{backgroundColor : styles.bgPrimaryColor}} onPress={() => { this.props.actions.performSyncService(this.props.pieChart, true, null, true) }}>
              <Text> {RETRY} </Text>
            </Button>
          </View>
        </View>
      )
    } else if (this.props.erpSyncStatus == 'ERROR') {
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
            <Button style={{backgroundColor : styles.bgPrimaryColor}} onPress={() => { this.props.actions.performSyncService(this.props.pieChart, true, null, true) }}>
              <Text> {RETRY} </Text>
            </Button>
          </View>
        </View>
      )
    } else {
      return (
        <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
          <ErpSyncIcon />
          <View style={[styles.marginTop30]}>
            <Button
              style={!isErpDisable ? {backgroundColor : styles.bgPrimaryColor} : null}
              onPress={() => { this.props.actions.performSyncService(this.props.pieChart, true, null, true) }}
              disabled={isErpDisable}>
              <Text> {isErpDisable ? this.state.erpSyncTimer : SYNC} </Text>
            </Button>
          </View>
        </View>
      )
    }

  }

  calculateTimeForResyncButton = () => {
    if (!this.props.lastErpSyncTime) {
      clearInterval(x)
      this.setState({ erpSyncTimer: null })
    }
    let lastErpSyncTimeWithServer = moment(this.props.lastErpSyncTime, 'YYYY-MM-DD HH:mm:ss')
    let erySyncDiffTimeInSeconds = moment().diff(lastErpSyncTimeWithServer, 'seconds')
    let message = null
    if (erySyncDiffTimeInSeconds > 300) {
      clearInterval(x)
      x = null
      this.setState({ erpSyncTimer: null })
    } else {
      let erySyncDiffTimeInSecondsFinal = 300 - erySyncDiffTimeInSeconds
      let min = parseInt(erySyncDiffTimeInSecondsFinal / 60)
      let sec = parseInt(erySyncDiffTimeInSecondsFinal % 60)
      message = (min > 0)?`${RESYNC_IN} ${min} : ${sec}`:`${RESYNC_IN} ${sec}`
      this.setState({ erpSyncTimer: message })
    }

  }

  getErpModalView() {
    clearInterval(x)
    x = setInterval(this.calculateTimeForResyncButton, 1000)
    return (
      <Modal
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          this.props.actions.setState(ERP_SYNC_STATUS, { syncStatus: 'OK', lastErpSyncTime: this.props.lastErpSyncTime })
        }}
      >
        <View style={[styles.flex1, styles.justifyCenter, styles.alignCenter, { backgroundColor: 'rgba(0,0,0,.5)' }]}>
          <View style={[styles.bgWhite, styles.shadow, styles.padding20, styles.margin10, styles.alignCenter, styles.justifyCenter, { width: '80%', borderRadius: 8 }]}>
            <Image
              style={style.imageSync}
              source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
            />
            <Text style={[styles.fontLg, styles.fontBlack, styles.marginTop30]}>
              {ERP_SYNC_OK_TEXT}
            </Text>
            <View style={[styles.marginTop30]}>
              <Button transparent onPress={() => { this.props.actions.setState(ERP_SYNC_STATUS, { syncStatus: 'OK', lastErpSyncTime: this.props.lastErpSyncTime }) }} >
                <Text style={{color : styles.fontPrimaryColor}}> {CLOSE} </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal >
    )
  }

  calculateTimeDifference() {
    if (!this.props.lastErpSyncTime) {
      return {
        erpSyncDisable: false,
        erpSyncMessage: null
      }
    }
    let lastErpSyncTimeWithServer = moment(this.props.lastErpSyncTime, 'YYYY-MM-DD HH:mm:ss')
    let erySyncDiffTimeInDays = moment().diff(lastErpSyncTimeWithServer, 'days')
    if (erySyncDiffTimeInDays > 0) {
      return {
        erpSyncDisable: false,
        erpSyncMessage: `${erySyncDiffTimeInDays} ${DAYS_AGO}`
      }
    }
    let erySyncDiffTimeInHours = moment().diff(lastErpSyncTimeWithServer, 'hours')
    if (erySyncDiffTimeInHours > 0) {
      return {
        erpSyncDisable: false,
        erpSyncMessage: `${erySyncDiffTimeInHours} ${HOURS_AGO}`
      }
    }
    let erySyncDiffTimeInMin = moment().diff(lastErpSyncTimeWithServer, 'minutes')
    if (erySyncDiffTimeInMin >= 5) {
      return {
        erpSyncDisable: false,
        erpSyncMessage: `${erySyncDiffTimeInMin} ${MINUTES_AGO}`
      }
    } else if (erySyncDiffTimeInMin > 0) {
      return {
        erpSyncDisable: true,
        erpSyncMessage: `${erySyncDiffTimeInMin} ${MINUTES_AGO}`
      }
    }
    let erySyncDiffTimeInSec = moment().diff(lastErpSyncTimeWithServer, 'seconds')
    if (erySyncDiffTimeInSec > 0) {
      return {
        erpSyncDisable: true,
        erpSyncMessage: `${erySyncDiffTimeInSec} ${SECONDS_AGO}`,
      }
    }

    return {
      erpSyncDisable: false,
      erpSyncMessage: null,
    }

  }

  render() {
    const erpSyncObject = this.calculateTimeDifference()
    const syncView = this.getErpSyncView(erpSyncObject.erpSyncDisable)
    let erpModalView = null
    if (this.props.erpModalVisible) {
      erpModalView = this.getErpModalView()
    }
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header searchBar style={StyleSheet.flatten([styles.bgWhite, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontBlack, styles.fontLg, styles.alignCenter, styles.fontWeight500]}>{ERP_SYNC}</Text>
                  <Text style={[styles.fontCenter, styles.fontBlack, styles.fontSm, styles.alignCenter]}>{erpSyncObject.erpSyncMessage}</Text>
                </View>
                <View />
              </View>
            </Body>
          </Header>

          <Content style={[styles.bgLightGray]}>
            {syncView}
          </Content>
          {erpModalView}
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


export default connect(mapStateToProps, mapDispatchToProps)(ErpSyncScreen)
