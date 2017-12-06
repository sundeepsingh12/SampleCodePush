
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
  StyleProvider
} from 'native-base'

import getTheme from '../../native-base-theme/components'
import TaskListScreen from './TaskListScreen';
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as taskListActions from '../modules/taskList/taskListActions'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'

import {
  START,
  SEARCH_PLACEHOLDER
} from '../lib/AttributeConstants'

function mapStateToProps(state) {
  return {
    tabsList: state.taskList.tabsList,
    tabIdStatusIdMap: state.taskList.tabIdStatusIdMap,
    downloadingJobs: state.taskList.downloadingJobs,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...taskListActions,
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
            />
          </Tab>
        )
      }
    }
    return renderTabList
  }

  render() {
    const viewTabList = this.renderTabs()
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
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.appModule.displayText}</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
              </View>
              <SearchBarV2 placeholder={SEARCH_PLACEHOLDER} />
            </Body>
          </Header>
          <Tabs
            style={styles.bgPrimary}
            tabBarUnderlineStyle={[styles.bgWhite]}
            renderTabBar={() => <ScrollableTab />}>
            {viewTabList}
          </Tabs>
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
