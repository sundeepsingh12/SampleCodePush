/**
 * # Main.js
 *  This is the main app screen
 *
 */
'use strict'
/*
 * ## Imports
 *
 * Imports from redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * The actions we need
 */
import * as globalActions from '../modules/global/globalActions'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'
import styles from '../themes/FeStyle'
import theme from '../themes/feTheme'
import ResyncLoader from '../components/ResyncLoader'


/**
 * The components needed from React
 */
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
  ListView,
  Platform,
  TouchableHighlight
}
  from 'react-native'

import { Container, Content, Tab, Tabs, Body, Header, Title, Left, Right, ScrollableTab, Icon, Fab, Button, Footer, FooterTab } from 'native-base';
import Jobs from './Jobs';
import * as homeActions from '../modules/home/homeActions'
import renderIf from '../lib/renderIf';
import TitleHeader from '../components/TitleHeader'


/**
 *  Instead of including all app states via ...state
 *  One could explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps(state) {
  return {
    tabsList: state.home.tabsList,
    tabIdStatusIdMap: state.home.tabIdStatusIdMap,
    downloadingJobs: state.home.downloadingJobs
  }
};

/*
 * Bind all the actions
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions, ...homeActions, ...preloaderActions }, dispatch)
  }
}



/**
 * ## App class
 */
class Main extends Component {

  constructor() {
    super();
    this.state = {
      active: false
    };
  }

  componentDidMount() {
    this.props.actions.syncService()
    this.props.actions.fetchTabs()

  }

  renderTabs() {
    const tabs = this.props.tabsList
    const renderTabList = []
    tabs.forEach(tab => {
      if (this.props.tabIdStatusIdMap[tab.id]) {
        renderTabList.push(
          <Tab
            key={tab.id}
            heading={tab.name}
            tabStyle={{ backgroundColor: '#ffffff' }}
            activeTabStyle={{ backgroundColor: '#ffffff' }}

            textStyle={{ color: '#a0a0a0' }}
            activeTextStyle={styles.fontPrimary}

          >
            <Jobs
              tabId={tab.id}
              statusIdList={this.props.tabIdStatusIdMap[tab.id]}
            />
          </Tab>
        )
      }
    })
    return renderTabList
  }


  render() {
    const viewTabList = this.renderTabs()
    if (viewTabList.length > 0) {
      return (
        <Container>
          <Tabs locked
            tabBarUnderlineStyle={styles.bgPrimary}
            renderTabBar={() => <ScrollableTab />}
          >
            {viewTabList}
          </Tabs>

          <Footer>
            <FooterTab style={{ backgroundColor: 'white' }}>
              <Button vertical>
                <Icon name={"ios-home-outline"} />
                <Text>Home</Text>
              </Button>
              <Button
                disabled = {this.props.downloadingJobs}
                onPress={() => { this.props.actions.onResyncPress() }}
                vertical>
                <ResyncLoader
                downloadingJobs = {this.props.downloadingJobs} />
              </Button>
              <Button vertical>
                <Icon name={"ios-chatboxes-outline"} />
                <Text>Message</Text>
              </Button>
              <Button onPress={() => { this.props.actions.navigateToScene('Signature',{}) }} vertical>
                <Icon name={"ios-apps-outline"} />
                <Text>Utilities</Text>
              </Button>
              <Button onPress={() => { this.props.actions.invalidateUserSession() }} vertical>
                <Icon name={"ios-power-outline"} />
                <Text>Logout</Text>
              </Button>
            </FooterTab>
          </Footer>
          <Fab
            active={this.state.active}
            direction="up"
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            containerStyle={{ bottom: 125 }}
            onPress={() => this.setState({ active: !this.state.active })}>
            <Ionicons name="md-add" />
            <Button style={{ backgroundColor: '#34A34F' }}>
              <Icon name="logo-whatsapp" />
            </Button>
            <Button style={{ backgroundColor: '#3B5998' }}>
              <Icon name="logo-facebook" />
            </Button>
            <Button disabled style={{ backgroundColor: '#DD5144' }}>
              <Icon name="mail" />
            </Button>
          </Fab>

        </Container>
      );

    } else {
      return (
        <Container>
          <Loader />
        </Container>
      )
    }
  }


};

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Main)
