'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Image, TouchableHighlight, ActivityIndicator, PushNotificationIOS, Animated, SectionList } from 'react-native'
import Loader from '../components/Loader'
import PieChart from '../components/PieChart'
import renderIf from '../lib/renderIf'
import * as globalActions from '../modules/global/globalActions'
import * as homeActions from '../modules/home/homeActions'
import { Container, Content, Header, Button, Text, List, ListItem, Separator, Left, Body, Right, Icon, Title, Footer, FooterTab, StyleProvider, Toast, ActionSheet } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import FareyeLogo from '../../images/fareye-default-iconset/fareyeLogoSm.png'
import { Platform } from 'react-native'
import PushNotification from 'react-native-push-notification'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { UNTITLED } from '../lib/ContainerConstants'
import { Summary }from '../lib/constants'
import DraftModal from '../components/DraftModal'

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
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions, ...homeActions }, dispatch)
  }
}

class Home extends PureComponent {

  componentDidMount() {
    if (Platform.OS === 'ios') {
      PushNotification.configure({
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
          Toast.show({
            text: `${notification.message}`,
            position: 'top',
            buttonText: 'OK',
            duration: 10000
          })
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      })
    }
    this.props.actions.fetchPagesAndPiechart();
    this.props.actions.startMqttService(this.props.pieChart);
    this.props.actions.performSyncService(this.props.pieChart, this.props.customErpPullActivated == 'notActivated');
    this.props.actions.startTracking(this.props.trackingServiceStarted);
  }

  getPageView(page) {
    return (
      <ListItem button style={[style.moduleList]} key={page.id} onPress={() => this.props.actions.navigateToPage(page)}>
        <MaterialIcons name={page.icon} style={[styles.fontLg, styles.fontWeight500, style.moduleListIcon]} />
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
  pieChartView() {
    if (!this.props.utilities.pieChartEnabled) {
      return null
    }

    if (this.props.chartLoading) {
      return (
        <ActivityIndicator animating={this.props.chartLoading}
          style={StyleSheet.flatten([{ marginTop: 10 }])} size="small" color="green" />
      )
    }

    if (this.props.pieChartSummaryCount) {
      return (<PieChart count={this.props.pieChartSummaryCount} press={this._onPieChartPress} />)
    }
    return null
  }
  _onPieChartPress = () => {
      this.props.actions.navigateToScene(Summary)
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
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container style={StyleSheet.flatten([styles.bgWhite])}>
          <Header searchBar style={StyleSheet.flatten([styles.bgWhite, style.header])}>
            <Body>
              <View style={[styles.row, styles.width100, styles.justifySpaceBetween]}><View style={[style.headerBody]}><View style={{ width: 90 }}>
                <Image style={StyleSheet.flatten([styles.width100, { resizeMode: 'contain' }])} source={FareyeLogo} />
              </View></View></View>
            </Body>
          </Header>
          <Content>
            {pieChartView}
            {this.getNewJobDraftModal()}
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
    backgroundColor: styles.primaryColor
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(Home)