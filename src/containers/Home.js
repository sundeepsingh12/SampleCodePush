'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Image, Platform, ActivityIndicator, SectionList, Modal, TouchableOpacity, FlatList, TouchableHighlight, Linking } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import Loader from '../components/Loader'
import PieChart from '../components/PieChart'
import * as globalActions from '../modules/global/globalActions'
import * as homeActions from '../modules/home/homeActions'
import { checkForPaymentAtEnd } from '../modules/job-details/jobDetailsActions'
import { Container, Content, Header, Text, List, ListItem, Body, Right, Icon, StyleProvider } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import FareyeLogo from '../../images/fareye-default-iconset/fareyeLogoSm.png'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { UNTITLED, TRANSACTION_SUCCESSFUL, DELETE_DRAFT } from '../lib/ContainerConstants'
import { Summary, PAGES_LOADING, CHECK_TRANSACTION_STATUS_NEW_JOB, SET_NEWJOB_DRAFT_INFO, SET_CHECK_TRANSACTION_AND_DRAFT, LOADER_FOR_SYNCING, SET_CALLER_ID_POPUP } from '../lib/constants'
import DraftModal from '../components/DraftModal'
import TransactionAlert from '../components/TransactionAlert'
import SyncLoader from '../components/SyncLoader'
import { redirectToFormLayout } from '../modules/newJob/newJobActions'
import { navigate } from '../modules/navigators/NavigationService'
import _ from 'lodash'
import { navigateToLiveJob } from '../modules/liveJob/liveJobActions'

function mapStateToProps(state) {
  return {
    newJobModules: state.home.newJobModules,
    modules: state.home.modules,
    pieChart: state.home.pieChart,
    menu: state.home.menu,
    moduleLoading: state.home.moduleLoading,
    chartLoading: state.home.chartLoading,
    draftNewJobInfo: state.home.draftNewJobInfo,
    mainMenuList: state.home.mainMenuList,
    utilities: state.home.utilities,
    pagesLoading: state.home.pagesLoading,
    pieChartSummaryCount: state.home.pieChartSummaryCount,
    trackingServiceStarted: state.home.trackingServiceStarted,
    checkNewJobTransactionStatus: state.home.checkNewJobTransactionStatus,
    customErpPullActivated: state.home.customErpPullActivated,
    logo: state.home.logo,
    callerIdDisplayData: state.home.callerIdDisplayData
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions, ...homeActions, checkForPaymentAtEnd, redirectToFormLayout, navigateToLiveJob }, dispatch)
  }
}

class Home extends PureComponent {


  componentDidMount() {
    this.props.actions.fetchPagesAndPiechart();
    this.props.actions.performSyncService(this.props.customErpPullActivated == 'notActivated');
    this.props.actions.startTracking(this.props.trackingServiceStarted);
    this.props.actions.startFCM();
    if (Platform.OS === 'android') {
      this.props.actions.registerCallReceiver()
      Linking.getInitialURL().then(url => {
        if (url) {
          this.navigate(url)
        }
        console.log('url', url)
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }
  handleOpenURL = (event) => {
    if (event.url) {
      this.navigate(event.url)
    }
  }
  
  navigate(url) {
    this.props.actions.navigateToLiveJob(url)
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  getPageView(page) {
    return (
      <ListItem button style={[style.moduleList]} key={page.id} onPress={() => this.props.actions.navigateToPage(page)}>
        <MaterialIcons name={page.icon} style={[styles.fontLg, styles.fontWeight500, style.moduleListIcon, { backgroundColor: styles.primaryColor }]} />
        <Body><Text style={[styles.fontWeight500, styles.fontLg]}>{page.name}</Text></Body>
        <Right><Icon name="ios-arrow-forward" /></Right>
      </ListItem>
    )
  }

  renderGroupHeader = ({ section }) => {
    if (_.size(this.props.mainMenuList) == 1 && section.title == UNTITLED) {
      return null
    }
    return (
      <View style={[styles.bgWhite, styles.padding10]}>
        <Text style={[styles.fontLg, styles.fontDarkGray, styles.paddingVertical10]}>{section.title}</Text>
      </View>
    );
  }

  getPageListItemsView() {
    return (
      <SectionList
        sections={this.props.mainMenuList}
        renderItem={({ item }) => this.getPageView(item)}
        renderSectionHeader={this.renderGroupHeader}
        keyExtractor={item => item.id}
      />
    )
  }

  showCheckTransactionAlert() {
    return <TransactionAlert checkTransactionAlert={this.props.checkNewJobTransactionStatus} onCancelPress={() => this.props.actions.redirectToFormLayout({ id: this.props.draftNewJobInfo.draft.statusId, name: this.props.draftNewJobInfo.draft.statusName }, -1, this.props.draftNewJobInfo.draft.jobMasterId, true, CHECK_TRANSACTION_STATUS_NEW_JOB)}
      onOkPress={() => this.props.actions.checkForPaymentAtEnd(this.props.draftNewJobInfo.draft, null, null, null, CHECK_TRANSACTION_STATUS_NEW_JOB, PAGES_LOADING)} onRequestClose={() => this.props.actions.setState(SET_CHECK_TRANSACTION_AND_DRAFT)} />
  }
  pieChartView() {
    if (!this.props.utilities.pieChartEnabled) {
      return null
    }

    if (this.props.chartLoading) {
      return (
        <ActivityIndicator animating={this.props.chartLoading}
          style={StyleSheet.flatten([{ marginTop: 10 }])} size="small" color={styles.bgPrimaryColor} />
      )
    }

    if (this.props.pieChartSummaryCount) {
      return (<PieChart count={this.props.pieChartSummaryCount} press={this._onPieChartPress} />)
    }
    return null
  }
  _onPieChartPress = () => {
    navigate(Summary, null)
  }

  getNewJobDraftModal() {
    if (!_.isEmpty(this.props.draftNewJobInfo)) {
      return <DraftModal draftStatusInfo={this.props.draftNewJobInfo.draft} onOkPress={() => this.props.actions.restoreNewJobDraft(this.props.draftNewJobInfo, true)} onCancelPress={() => this.props.actions.restoreNewJobDraft(this.props.draftNewJobInfo, false)} onRequestClose={() => this.props.actions.setState(SET_NEWJOB_DRAFT_INFO, {})} />
    }
    return null
  }
  onCancelPress = () => {
    this.props.actions.setState(LOADER_FOR_SYNCING, false)
  }

  renderCallerDisplayData(item) {
    return (
      <View style={[styles.row]}>
        <Text style={[styles.paddingHorizontal10, styles.paddingVertical5, styles.fontDefault, { width: '40%' }]}>
          {item.jobAttributeLabel}
        </Text>
        <Text style={[styles.paddingHorizontal10, styles.paddingVertical5, styles.fontDefault, { width: '60%' }]}>
          {item.value}
        </Text>
      </View>
    )
  }

  showCallerPopupWindow() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Modal animationType={"fade"}
          transparent={true}
          visible={true}
          presentationStyle={"overFullScreen"}
          onRequestClose={() => { }}
        >
          <View style={[styles.flex1, styles.row, styles.justifyCenter, styles.alignCenter, { backgroundColor: 'rgba(225,225,225,.8)' }]}>

            <View style={[{ backgroundColor: 'white', borderRadius: 6 }]}>
              <View style={{ height: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: '#1478f6' }}></View>
              <View style={[styles.bgPrimary, styles.width100, styles.row, { backgroundColor: '#1478f6' }]}>
                <View style={[styles.paddingHorizontal10, styles.flexBasis80, styles.paddingVertical5, styles.paddingBottom10]}>
                  <Text style={[styles.fontWhite]}>{this.props.callerIdDisplayData.referenceNumber}</Text>
                  <View style={[styles.row, styles.alignCenter]}>
                    <Icon name="md-call" style={[styles.fontWhite, styles.fontDefault]} />
                    <Text style={[styles.fontWhite, styles.marginLeft5]}>{this.props.callerIdDisplayData.incomingNumber}</Text>
                  </View>

                </View>
                <TouchableHighlight onPress={this.dismissCallerPopup} style={[styles.flexBasis20, styles.justifyStart, styles.alignEnd]}>
                  <Icon name="md-close" style={[styles.fontWhite, styles.padding25, styles.paddingTop5, styles.fontDefault]} />
                </TouchableHighlight>

              </View>

              <View style={[styles.paddingTop5]}>
                <FlatList
                  data={this.props.callerIdDisplayData.callerIdDisplayList}
                  renderItem={({ item }) => this.renderCallerDisplayData(item)}
                  keyExtractor={item => String(item.id)}
                />
                <View style={{ height: 10, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }}></View>
              </View>
            </View>
          </View>
        </Modal>
      </StyleProvider>

    )
  }

  dismissCallerPopup = () => {
    this.props.actions.setState(SET_CALLER_ID_POPUP, {
      showCallerIdPopup: false,
    })
  }

  render() {
    const pieChartView = this.pieChartView()
    if (this.props.pagesLoading) {
      return (<Loader />)
    }
    let sourceOptions
    if (this.props.logo) {
      sourceOptions = {
        isStatic: true,
        uri: 'data:image/jpeg;base64,' + this.props.logo
      }
    } else {
      sourceOptions = FareyeLogo
    }

    return (
      <StyleProvider style={getTheme(platform)}>
        <Container style={[styles.bgWhite]}>
          <SafeAreaView>
            <Header style={[styles.bgWhite, styles.paddingTop0]}>
              <View style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <View style={[styles.paddingVertical5, { flexDirection: 'row', flex: .5 }]}>
                  <Image resizeMode={'contain'} style={[{ flex: 1, height: null, width: null }]} source={sourceOptions} />
                  {/* <Image source={{ uri: 'https://s3-us-west-2.amazonaws.com/fareye.development/images.jpeg' }} style={{ flex: 1, height: null, width: null }} resizeMode='contain' /> */}
                </View>
              </View>
            </Header>
          </SafeAreaView>
          <Content>
            {(this.props.moduleLoading) ? <SyncLoader moduleLoading={this.props.moduleLoading} cancelModal={this.onCancelPress} /> : null}
            {pieChartView}
            {(this.props.checkNewJobTransactionStatus && this.props.checkNewJobTransactionStatus != TRANSACTION_SUCCESSFUL && this.props.checkNewJobTransactionStatus != DELETE_DRAFT) ? this.showCheckTransactionAlert() : this.getNewJobDraftModal()}
            <List>{this.getPageListItemsView()}</List>
            {(this.props.callerIdDisplayData.showCallerIdPopup) ? this.showCallerPopupWindow() : null}
          </Content>
        </Container>
      </StyleProvider>
    )
  }

}

const style = StyleSheet.create({
  moduleList: {
    height: 70
  },
  moduleListIcon: {
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#d6d7da',
    padding: 5,
  },
  imageSync: {
    width: 116,
    height: 116,
    resizeMode: 'contain'
  },
  headerRight: {
    width: '35%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerBody: {
    width: '50%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(Home)