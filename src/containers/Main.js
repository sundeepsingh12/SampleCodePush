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
import * as authActions from '../reducers/auth/authActions'
import * as globalActions from '../reducers/global/globalActions'
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * Router
 */
import {Actions} from 'react-native-router-flux'

/**
 * The components needed from React
 */
import React, {Component} from 'react'
import
{
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

import { Container, Content, Tab, Tabs,Body, Header, Title, Left, Right,ScrollableTab, Icon, Fab, Button } from 'native-base';
import Jobs from './Jobs';
/**
 * The platform neutral button
 */
// const Button = require('apsl-react-native-button')

/**
 *  Instead of including all app states via ...state
 *  One could explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps (state) {
  return {
    auth: {
      form: {
        isFetching: state.auth.form.isFetching
      }
    },
    global: {
      currentState: state.global.currentState,
      showState: state.global.showState
    }
  }
};

/*
 * Bind all the actions
 */
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...globalActions }, dispatch)
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

  render() {
    return (
      <Container>
      <Header hasTabs>
          <Left/>
          <Body>
              <Title>Home</Title>
          </Body>
          <Right>
            <TouchableHighlight underlayColor='#e7e7e7' onPress={()=>this.toggleStatus()}>
              <Text>Cancel</Text>
            </TouchableHighlight>
          </Right>
      </Header>
      <Tabs renderTabBar={()=> <ScrollableTab />}>
          <Tab heading="All">
              <Jobs />
          </Tab>
          <Tab heading="Pending">
              <Jobs />
          </Tab>
          <Tab heading="Seen">
              <Jobs />
          </Tab>
          <Tab heading="Success">
              <Jobs />
          </Tab>
          <Tab heading="Failed">
              <Jobs />
          </Tab>
      </Tabs>
      <Fab
          active={this.state.active}
          direction="up"
          style={{ backgroundColor: '#5067FF'}}
          position="bottomRight"
          containerStyle={{bottom: 125}}
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