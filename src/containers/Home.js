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
import * as authActions from '../modules/login/loginActions'
import * as globalActions from '../modules/global/globalActions'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Preloader from '../containers/Preloader'

/**
 * Router
 */
import { Actions } from 'react-native-router-flux'

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

import { Container, Content, Tab, Tabs, Body, Header, Title, Left, Right, ScrollableTab, Icon, Fab, Button } from 'native-base';
import Jobs from '../components/Jobs';
import * as homeActions from '../modules/home/homeActions'
import renderIf from '../lib/renderIf';

/**
 *  Instead of including all app states via ...state
 *  One could explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps(state) {
  return {
    tabsList: state.home.tabsList,
    tabIdStatusIdMap: state.home.tabIdStatusIdMap
  }
};

/*
 * Bind all the actions
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...globalActions, ...homeActions }, dispatch)
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
    this.props.actions.onResyncPress()
    this.props.actions.fetchTabs()
  }

  renderTabs() {
    console.log('render tabs home container')
    console.log(this.props)
    const tabs = this.props.tabsList
    const renderTabList = []
    tabs.forEach(tab => {
      renderTabList.push(
        <Tab
          key={tab.id}
          heading={tab.name}>
          <Jobs
            tabId={tab.id}
            statusIdList={this.props.tabIdStatusIdMap[tab.id]}
          />
        </Tab>
      )
    })
    return renderTabList
  }

  render() {
    const viewTabList = this.renderTabs()
    return (
      <Container>
        <Header hasTabs>
          <Left />
          <Body>
            <Title>Home</Title>
          </Body>
          <Right>

            <TouchableHighlight underlayColor='#e7e7e7' onPress={Actions.Preloader}>
              <Text>Cancel</Text>
            </TouchableHighlight>
          </Right>
      </Header>
      
      <Tabs locked
      renderTabBar={()=> <ScrollableTab />}
      >
        {viewTabList}
      </Tabs>
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
  }


};

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Main)
