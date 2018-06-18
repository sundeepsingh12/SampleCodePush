'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Image, TouchableHighlight, ActivityIndicator, PushNotificationIOS, Animated, SectionList } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import Loader from '../components/Loader'
import PieChart from '../components/PieChart'
import renderIf from '../lib/renderIf'
import * as globalActions from '../modules/global/globalActions'
import * as homeActions from '../modules/home/homeActions'
import { checkForPaymentAtEnd } from '../modules/job-details/jobDetailsActions'
import { Container, Content, Header, Button, Text, List, ListItem, Separator, Left, Body, Right, Icon, Title, Footer, FooterTab, StyleProvider, Toast, ActionSheet } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import FareyeLogo from '../../images/fareye-default-iconset/fareyeLogoSm.png'
import { Platform } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { UNTITLED, TRANSACTION_SUCCESSFUL, PAYMENT_SUCCESSFUL, OK, CANCEL, DELETE_DRAFT } from '../lib/ContainerConstants'
import { Summary, PAGES_LOADING, CHECK_TRANSACTION_STATUS_NEW_JOB, SET_NEWJOB_DRAFT_INFO, SET_CHECK_TRANSACTION_AND_DRAFT } from '../lib/constants'
import DraftModal from '../components/DraftModal'
import TransactionAlert from '../components/TransactionAlert'
import FCM, { NotificationActionType, FCMEvent } from "react-native-fcm";
import SyncLoader from '../components/SyncLoader'
import { redirectToFormLayout } from '../modules/newJob/newJobActions'

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
    customErpPullActivated: state.home.customErpPullActivated
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions, ...homeActions, checkForPaymentAtEnd, redirectToFormLayout }, dispatch)
  }
}

class Home extends PureComponent {

  componentDidMount() {
    this.props.actions.fetchPagesAndPiechart();
    this.props.actions.performSyncService(this.props.customErpPullActivated == 'notActivated');
    this.props.actions.startTracking(this.props.trackingServiceStarted);
    this.props.actions.startFCM();
  }

  getPageView(page) {
    return (
      <ListItem button style={[style.moduleList]} key={page.id} onPress={() => this.props.actions.navigateToPage(page, this.props.navigation.navigate)}>
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


showCheckTransactionAlert(){
  return <TransactionAlert checkTransactionAlert={this.props.checkNewJobTransactionStatus} onCancelPress={() => this.props.actions.redirectToFormLayout({id : this.props.draftNewJobInfo.draft.statusId, name: this.props.draftNewJobInfo.draft.statusName} , -1, this.props.draftNewJobInfo.draft.jobMasterId, this.props.navigation.navigate,  true, CHECK_TRANSACTION_STATUS_NEW_JOB)} 
                        onOkPress = {() => this.props.actions.checkForPaymentAtEnd(this.props.draftNewJobInfo.draft, null, null, null, CHECK_TRANSACTION_STATUS_NEW_JOB, PAGES_LOADING, this.props.navigation.push ) }      onRequestClose={() => this.props.actions.setState(SET_CHECK_TRANSACTION_AND_DRAFT)} />
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
    this.props.actions.navigateToScene(Summary, null, this.props.navigation.navigate)
  }

  getNewJobDraftModal() {
    if (!_.isEmpty(this.props.draftNewJobInfo)) {
      return <DraftModal draftStatusInfo={this.props.draftNewJobInfo.draft} onOkPress={() => this.props.actions.restoreNewJobDraft(this.props.draftNewJobInfo, true, this.props.navigation.navigate)} onCancelPress={() => this.props.actions.restoreNewJobDraft(this.props.draftNewJobInfo, false, this.props.navigation.navigate)} onRequestClose={() => this.props.actions.setState(SET_NEWJOB_DRAFT_INFO, {})} />
    }
    return null
  }

  render() {
    const pieChartView = this.pieChartView()
    if (this.props.pagesLoading) {
      return (<Loader />)
    }
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container style={StyleSheet.flatten([styles.bgWhite])}>
          <SafeAreaView>
            <Header searchBar style={StyleSheet.flatten([styles.bgWhite])}>
              <Body>
                <View style={[styles.row, styles.width100, styles.justifySpaceBetween]}><View><View style={{ width: 90 }}>
                  <Image style={StyleSheet.flatten([styles.width100, { resizeMode: 'contain' }])} source={FareyeLogo} />
                </View></View></View>
              </Body>
            </Header>
          </SafeAreaView>
          <Content>
            {(this.props.moduleLoading) ? <SyncLoader moduleLoading={this.props.moduleLoading} /> : null}
            {pieChartView}
            {(this.props.checkNewJobTransactionStatus && this.props.checkNewJobTransactionStatus != TRANSACTION_SUCCESSFUL && this.props.checkNewJobTransactionStatus != DELETE_DRAFT) ? this.showCheckTransactionAlert() : this.getNewJobDraftModal()}
            <List>{this.getPageListItemsView()}</List>
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
}
});


export default connect(mapStateToProps, mapDispatchToProps)(Home)