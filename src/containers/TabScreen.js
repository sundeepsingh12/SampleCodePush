
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


import Ionicons from 'react-native-vector-icons/Ionicons'
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'
import SearchBarV2 from '../components/SearchBarV2'

import React, { PureComponent } from 'react'
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
  FILTER_REF_NO
} from '../lib/ContainerConstants'
import {
  START,
  IS_CALENDAR_VISIBLE,
  LISTING_SEARCH_VALUE,
  SEARCH_TAP,
  JobDetailsV2,
  SET_LANDING_TAB
} from '../lib/constants'
import TaskListCalender from '../components/TaskListCalender'

function mapStateToProps(state) {
  return {
    tabsList: state.taskList.tabsList,
    tabIdStatusIdMap: state.taskList.tabIdStatusIdMap,
    downloadingJobs: state.taskList.downloadingJobs,
    isFutureRunsheetEnabled: state.taskList.isFutureRunsheetEnabled,
    selectedDate: state.taskList.selectedDate,
    isCalendarVisible: state.taskList.isCalendarVisible,
    searchText: state.taskList.searchText,
    modules: state.home.modules,
    landingTabId: state.taskList.landingTabId
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...taskListActions, ...globalActions, }, dispatch)
  }
}


class TabScreen extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  componentDidMount() {
    // fetch all tabs
    this.props.actions.fetchTabs()
  }
  componentWillUnmount() {
    this.props.actions.setState(LISTING_SEARCH_VALUE, "")
  }

  // On cancel press of calender,hide calender
  _onCancel = () => {
    this.props.actions.setState(IS_CALENDAR_VISIBLE, false)
  }

  // set selected date in calender
  _onConfirm = (date) => {
    this.props.actions.setState(IS_CALENDAR_VISIBLE, false)
    const formattedDate = moment(date).format('YYYY-MM-DD')
    this.props.actions.fetchJobs(formattedDate)
  }

  _transactionsForTodayDate = () => {
    // fetch all jobs for today's date
    this.props.actions.fetchJobs(moment().format('YYYY-MM-DD'))
  }

  _showAllJobTransactions = () => {
    //fetch all jobs for all dates when user selects ALL option in calender
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
              pageObject={this.props.navigation.state.params.pageObject}
            />
          </Tab>
        )
      }
    }
    return renderTabList
  }

  _landingIndex(tabId) {
    //get index for landing tab id
    const tabs = this.props.tabsList
    let index
    for (let id in tabs) {
      if (tabs[id].id == tabId) {
        index = id
        break
      }
    }
    return Number(index)
  }

  // call back method to set search text for filtering
  fetchDataForListing = (searchText) => {
    this.props.actions.setState(LISTING_SEARCH_VALUE, { searchText })
  }

  //method to set search text and scanner for navigating if match found
  fetchDataForScanner = (searchText) => {
    this.props.actions.setState(LISTING_SEARCH_VALUE, {
      searchText: (!searchText) ? this.props.searchText.searchText : searchText, scanner: true
    })
  }

  //Renders calender component TaskListCalender
  _renderCalendar = () => {
    //Return no calender view if future runsheet is not enabled
    if (!this.props.isFutureRunsheetEnabled) {
      return null
    }
    return (
      <TaskListCalender isFutureRunsheetEnabled={this.props.isFutureRunsheetEnabled} isCalendarVisible={this.props.isCalendarVisible} setState={this.props.actions.setState} _showAllJobTransactions={this._showAllJobTransactions} selectedDate={this.props.selectedDate} _transactionsForTodayDate={this._transactionsForTodayDate}
        _onConfirm={this._onConfirm} _onCancel={this._onCancel} />
    )
  }

  render() {
    let landingValue = this.props.landingTabId ? this._landingIndex(this.props.landingTabId) : 0
    const viewTabList = this.renderTabs()
    const calendarView = this._renderCalendar()
    const pageName = this.props.navigation.state.params.pageObject.name ? this.props.navigation.state.params.pageObject.name : 'All Tasks'
    const searchTextValue = (this.props.searchText) ? this.props.searchText.searchText : ''
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
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{pageName}</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
              </View>
              <SearchBarV2 placeholder={FILTER_REF_NO} setSearchText={this.fetchDataForListing} searchText={searchTextValue} navigation={this.props.navigation} returnValue={this.fetchDataForScanner.bind(this)} onPress={this.fetchDataForScanner.bind(this)} />
            </Body>
          </Header>
          <Tabs
            tabBarBackgroundColor={styles.bgPrimary.backgroundColor}
            page={landingValue}
            onChangeTab={(position) => {
              console.log('position', position)
              this.props.actions.setState(SET_LANDING_TAB, { landingTabId: this.props.tabsList[position.i].id })
            }
            }
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
});


export default connect(mapStateToProps, mapDispatchToProps)(TabScreen)
