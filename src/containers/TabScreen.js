
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loader from '../components/Loader'
import SearchBarV2 from '../components/SearchBarV2'
import React, { PureComponent } from 'react'
import {  View } from 'react-native'
import { Container, Text, Tab, Tabs, ScrollableTab } from 'native-base'
import TaskListScreen from './TaskListScreen';
import styles from '../themes/FeStyle'
import * as taskListActions from '../modules/taskList/taskListActions'
import * as globalActions from '../modules/global/globalActions'
import { FILTER_REF_NO, ALL_TASKS } from '../lib/ContainerConstants'
import { IS_CALENDAR_VISIBLE, LISTING_SEARCH_VALUE, SET_LANDING_TAB, SET_SELECTED_DATE, TASKLIST_LOADER_FOR_SYNC } from '../lib/constants'
import TaskListCalender from '../components/TaskListCalender'
import TitleHeader from '../components/TitleHeader'
import SyncLoader from '../components/SyncLoader'
import size from 'lodash/size'

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

  renderTabs(tabListForPage) {
    const tabs = this.props.tabsList
    const renderTabList = []
    for (let index in tabs) {
      if (size(tabListForPage) > 0 && !tabListForPage.includes(tabs[index].id)) {
        continue
      }
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
  onCancelPress = () => {
    this.props.actions.setState(TASKLIST_LOADER_FOR_SYNC, false)
  }

  render() {
    if (this.props.tabsLoading) {
      return (
        <Container>
          <Loader />
        </Container>
      )
    } else if (size(this.props.tabsList) == 0) {
      return (
          <Container>
            <View></View>
          </Container>
      )
    } else {
      let tabListForPage = this.props.navigation.state.params.pageObject.additionalParams ? JSON.parse(this.props.navigation.state.params.pageObject.additionalParams).tabids : []
      const searchTextValue = (this.props.searchText) ? this.props.searchText.searchText : '';
      const viewTabList = this.renderTabs(tabListForPage)
      return (
          <Container>
            <View style={[{ backgroundColor: styles.bgPrimaryColor }, styles.header]}>
              <SearchBarV2 placeholder={FILTER_REF_NO} setSearchText={this.fetchDataForListing} searchText={searchTextValue} navigation={this.props.navigation} returnValue={this.fetchDataForScanner.bind(this)} onPress={this.fetchDataForScanner.bind(this)} />
              {this.props.syncLoadingInTaskList ? <SyncLoader moduleLoading={this.props.syncLoadingInTaskList} cancelModal={this.onCancelPress} /> : null}
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
      )
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TabScreen)
