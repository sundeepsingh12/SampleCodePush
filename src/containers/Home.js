'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Image, TouchableHighlight, ActivityIndicator, SectionList } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import Loader from '../components/Loader'
import PieChart from '../components/PieChart'
import * as globalActions from '../modules/global/globalActions'
import * as homeActions from '../modules/home/homeActions'
import { checkForPaymentAtEnd } from '../modules/job-details/jobDetailsActions'
import { Container, Content, Header, Button, Text, List, ListItem, Body, Right, Icon, StyleProvider } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import FareyeLogo from '../../images/fareye-default-iconset/fareyeLogoSm.png'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { UNTITLED, TRANSACTION_SUCCESSFUL, DELETE_DRAFT } from '../lib/ContainerConstants'
import { Summary, PAGES_LOADING, CHECK_TRANSACTION_STATUS_NEW_JOB, SET_NEWJOB_DRAFT_INFO, SET_CHECK_TRANSACTION_AND_DRAFT } from '../lib/constants'
import DraftModal from '../components/DraftModal'
import TransactionAlert from '../components/TransactionAlert'
import SyncLoader from '../components/SyncLoader'
import { redirectToFormLayout } from '../modules/newJob/newJobActions'
import { navigate } from '../modules/navigators/NavigationService';


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
    logo: state.home.logo
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions, ...homeActions, checkForPaymentAtEnd, redirectToFormLayout }, dispatch)
  }
}

class Home extends PureComponent {

  componentDidMount() {
    console.log('componentDidMount home', this.props);
    this.props.actions.fetchPagesAndPiechart();
    this.props.actions.performSyncService(this.props.customErpPullActivated == 'notActivated');
    this.props.actions.startTracking(this.props.trackingServiceStarted);
    this.props.actions.startFCM();
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