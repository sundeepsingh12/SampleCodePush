
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'
import SearchBarV2 from '../components/SearchBarV2'
import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Container, Content, Header, Button, Text, Input, Body, Icon, Footer, Tab, Tabs, ScrollableTab, StyleProvider, FooterTab } from 'native-base'
import getTheme from '../../native-base-theme/components'
import TaskListScreen from './TaskListScreen';
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as taskListActions from '../modules/taskList/taskListActions'
import * as globalActions from '../modules/global/globalActions'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import { FILTER_REF_NO, ALL_TASKS, NO_TAB_PRESENT } from '../lib/ContainerConstants'
import { START, IS_CALENDAR_VISIBLE, LISTING_SEARCH_VALUE, SEARCH_TAP, JobDetailsV2, SET_LANDING_TAB, SET_SELECTED_DATE } from '../lib/constants'
import TaskListCalender from '../components/TaskListCalender'
import TitleHeader from '../components/TitleHeader'
import SyncLoader from '../components/SyncLoader'

function mapStateToProps(state) {
  return {
    tabsLoading: state.taskList.tabsLoading,
    tabsList: state.taskList.tabsList,
    tabIdStatusIdMap: state.taskList.tabIdStatusIdMap,
    isFutureRunsheetEnabled: state.taskList.isFutureRunsheetEnabled,
    searchText: state.taskList.searchText,
    landingTabId: state.taskList.landingTabId,
    syncLoadingInTaskList: state.taskList.syncLoadingInTaskList
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...taskListActions, ...globalActions, }, dispatch)
  }
}

class TabScreen extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    const pageName = navigation.state.params.pageObject.name ? navigation.state.params.pageObject.name : ALL_TASKS
    return { header: <TitleHeader pageName={pageName} goBack={navigation.goBack} /> }
  }

  componentDidMount() {
    this.props.actions.fetchTabs()
  }

  setSelectedDate = (date) => {
    this.props.actions.setState(SET_SELECTED_DATE, { selectedDate: date })
  }

  setCalendarState = (isCalendarVisible) => {
    this.props.actions.setState(IS_CALENDAR_VISIBLE, isCalendarVisible)
  }

  renderTabs() {
    const tabs = this.props.tabsList
    const renderTabList = []
    for (let index in tabs) {
      if (this.props.tabIdStatusIdMap[tabs[index].id]) {
        renderTabList.push(
          <Tab
            key={tabs[index].id}
            tabStyle={{ backgroundColor: styles.bgPrimaryColor }}
            activeTabStyle={{ backgroundColor: styles.bgPrimaryColor }}
            textStyle={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}
            activeTextStyle={[styles.fontWhite, styles.fontDefault]}
            heading={tabs[index].name}>
            <TaskListScreen
              tabId={tabs[index].id}
              statusIdList={this.props.tabIdStatusIdMap[tabs[index].id]}
              searchText={this.props.searchText}
              pageObject={this.props.navigation.state.params.pageObject}
              isFutureRunsheetEnabled={this.props.isFutureRunsheetEnabled}
              navigationProps = {this.props.navigation.navigate}
            />
          </Tab>
        )
      }
    }
    return renderTabList
  }

  landingIndex(tabId) {
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
  renderCalendar = () => {
    if (!this.props.isFutureRunsheetEnabled) {
      return null
    }
    return (
      <TaskListCalender
        isFutureRunsheetEnabled={this.props.isFutureRunsheetEnabled}
        isCalendarVisible={this.props.isCalendarVisible}
        setSelectedDate={this.setSelectedDate}
        setCalendarState={this.setCalendarState} />
    )
  }

  render() {
    if (this.props.tabsLoading) {
      return (
        <Container>
          <Loader />
        </Container>
      )
    } else if (_.size(this.props.tabsList) == 0) {
      return (
        <StyleProvider style={getTheme(platform)}>
          <Container>
            <Text> {NO_TAB_PRESENT} </Text>
          </Container>
        </StyleProvider>
      )
    } else {
      let scrollableTabView;
      const searchTextValue = (this.props.searchText) ? this.props.searchText.searchText : '';
      const viewTabList = this.renderTabs();
      const calendarView = this.renderCalendar();
      return (
        <StyleProvider style={getTheme(platform)}>
          <Container>
            <View style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, styles.header])}>
              <SearchBarV2 placeholder={FILTER_REF_NO} setSearchText={this.fetchDataForListing} searchText={searchTextValue} navigation={this.props.navigation} returnValue={this.fetchDataForScanner.bind(this)} onPress={this.fetchDataForScanner.bind(this)} />
              {this.props.syncLoadingInTaskList ? <SyncLoader moduleLoading={this.props.syncLoadingInTaskList} /> : null}
            </View>
            <Tabs
              tabBarBackgroundColor={styles.bgPrimaryColor}
              page={this.landingIndex(this.props.landingTabId)}
              onChangeTab={(position) => {
                this.props.actions.setState(SET_LANDING_TAB, { landingTabId: this.props.tabsList[position.i].id })
              }}
              tabBarUnderlineStyle={[styles.bgWhite]}
              renderTabBar={() => <ScrollableTab />}>
              {viewTabList}
            </Tabs>
            {this.props.isFutureRunsheetEnabled ? <TaskListCalender /> : null}
          </Container>
        </StyleProvider >
      )
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TabScreen)
