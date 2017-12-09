
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


import Ionicons from 'react-native-vector-icons/Ionicons'
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'
import ResyncLoader from '../components/ResyncLoader'
import SearchBarV2 from '../components/SearchBarV2'

import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  Input,
  Body,
  Icon,
  Footer,
  Tab,
  Tabs,
  ScrollableTab,
  StyleProvider,
  FooterTab
} from 'native-base'

import getTheme from '../../native-base-theme/components'
import TaskListScreen from './TaskListScreen';
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as taskListActions from '../modules/taskList/taskListActions'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'

import {
  START,
  SEARCH_PLACEHOLDER
} from '../lib/AttributeConstants'
import {
  IS_CALENDAR_VISIBLE,
  LISTING_SEARCH_VALUE
} from '../lib/constants'

function mapStateToProps(state) {
  return {
    tabsList: state.taskList.tabsList,
    tabIdStatusIdMap: state.taskList.tabIdStatusIdMap,
    downloadingJobs: state.taskList.downloadingJobs,
    isFutureRunsheetEnabled: state.taskList.isFutureRunsheetEnabled,
    selectedDate: state.taskList.selectedDate,
    isCalendarVisible: state.taskList.isCalendarVisible,
    searchText: state.taskList.searchText,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...taskListActions,
      ...globalActions,
    }, dispatch)
  }
}


class TabScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  componentDidMount() {
    this.props.actions.fetchTabs()
  }

  _onCancel = () => {
    this.props.actions.setState(IS_CALENDAR_VISIBLE, false)
  }

  _onConfirm = (date) => {
    this.props.actions.setState(IS_CALENDAR_VISIBLE, false)
    const formattedDate = moment(date).format('YYYY-MM-DD')
    this.props.actions.fetchJobs(formattedDate)
  }

  _transactionsForTodayDate = () => {
    this.props.actions.fetchJobs(moment(new Date()).format('YYYY-MM-DD'))
  }

  _showAllJobTransactions = () => {
    this.props.actions.fetchJobs("All")
  }

  renderTabs() {
    const tabs = this.props.tabsList
    const renderTabList = []
    for (let index in tabs) {
      if (this.props.tabIdStatusIdMap[tabs[index].id]) {
        renderTabList.push(
          <Tab
            key={tabs[index].id}
            tabStyle={[styles.bgPrimary]}
            activeTabStyle={[styles.bgPrimary]}
            textStyle={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}
            activeTextStyle={[styles.fontWhite, styles.fontDefault]}
            heading={tabs[index].name}>
            <TaskListScreen
              tabId={tabs[index].id}
              statusIdList={this.props.tabIdStatusIdMap[tabs[index].id]}
              searchText={this.props.searchText}
            />
          </Tab>
        )
      }
    }
    return renderTabList
  }

  fetchDataForListing = (searchText) =>{
    this.props.actions.setState(LISTING_SEARCH_VALUE,searchText) 
  }

  _renderCalendar = () => {
    if (!this.props.isFutureRunsheetEnabled) {
      return null
    }
    return (
      <Footer style={[styles.bgWhite, { borderTopWidth: 1, borderTopColor: '#f3f3f3' }]}>
        <FooterTab style={[styles.flexBasis20]}>
          <Button transparent
            onPress={this._transactionsForTodayDate}
            style={[styles.alignStart]}>
            <Text style={[styles.fontPrimary, styles.fontSm]}>Today</Text>
          </Button>
        </FooterTab>
        <FooterTab style={[styles.flexBasis60]}>
          <DateTimePicker
            isVisible={this.props.isCalendarVisible}
            onConfirm={this._onConfirm}
            onCancel={this._onCancel}
            mode='date'
            datePickerModeAndroid='spinner'
          />
          <Button transparent
            onPress={() => { this.props.actions.setState(IS_CALENDAR_VISIBLE, true) }}
            style={[styles.row]}>
            <Text style={[styles.fontBlack, styles.fontWeight500, styles.fontSm]}>{this._renderCalendarButtonText()}</Text>
            <Icon name='ios-arrow-down' style={[styles.fontBlack, styles.fontSm]} />
          </Button>
        </FooterTab>
        <FooterTab style={[styles.flexBasis20]}>
          <Button transparent
            onPress={this._showAllJobTransactions}
            style={[styles.alignEnd]}>
            <Text style={[styles.fontPrimary, styles.fontSm]}>All</Text>
          </Button>
        </FooterTab>

      </Footer>
    )
  }

  _renderCalendarButtonText() {
    if ((this.props.selectedDate == "All")) {
      return <Text style={[styles.fontBlack, styles.fontWeight500, styles.fontSm]}>All</Text>
    } else {
      return <Text style={[styles.fontBlack, styles.fontWeight500, styles.fontSm]}>{moment(this.props.selectedDate).format('ddd, DD MMM, YYYY')}</Text>
    }
  }
  onPress = () =>{ //implement for search

  }

  render() {
    console.log("render123")
    const viewTabList = this.renderTabs()
    const calendarView = this._renderCalendar()
    if (viewTabList.length == 0) {
      return (
        <Container>
          <Loader />
        </Container>
      )
    }
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])} hasTabs>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{START.displayName}</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
              </View>
              <SearchBarV2 placeholder={SEARCH_PLACEHOLDER} fetchDataForListing = {this.fetchDataForListing} searchText = {this.props.searchText} navigation = {this.props.navigation} returnValue = {this.fetchDataForListing.bind(this)} onPress = {this.onPress} />
            </Body>
          </Header>
          <Tabs
            style={styles.bgPrimary}
            tabBarUnderlineStyle={[styles.bgWhite]}
            renderTabBar={() => <ScrollableTab />}>
            {viewTabList}
          </Tabs>
            {calendarView}
        </Container>
      </StyleProvider>
    )
  }

};

const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    padding: 0,
    paddingRight: 0,
    paddingLeft: 0
  },
  headerLeft: {
    width: '15%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerBody: {
    width: '70%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerRight: {
    width: '15%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerIcon: {
    width: 24
  },
  headerSearch: {
    paddingLeft: 10,
    paddingRight: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderRadius: 2,
    height: 55,
    color: '#fff',
    fontSize: 11
  },
  inputInnerBtn: {
    position: 'absolute',
    top: 0,
    right: 5,
    paddingLeft: 0,
    paddingRight: 0
  },
  seqCard: {
    minHeight: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10
  },
  seqCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffcc00',
    justifyContent: 'center',
    alignItems: 'center'
  },
  seqCardDetail: {
    flex: 1,
    minHeight: 70,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
    borderBottomColor: '#e4e4e4',
    borderBottomWidth: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(TabScreen)
