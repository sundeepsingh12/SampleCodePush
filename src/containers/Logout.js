/**
 * # Logout.js
 *
 *
 *
 */
'use strict'
/**
 * ## Imports
 *
 * Redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * The actions we need
 */
import * as authActions from '../modules/login/loginActions'
import * as globalActions from '../modules/global/globalActions'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'


import { Button, Spinner } from 'native-base';

/**
 * The necessary React components
 */
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import { Container, Content, Tab, Tabs, Body, Header, Title, Left, Right } from 'native-base';

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 15
  },
})
/**
 * ## Redux boilerplate
 */

function mapStateToProps(state) {
  return {
    auth: {
      form: {
        isFetching: state.auth.form.isFetching,
        isValid: state.auth.form.isValid
      }
    },
    global: {
      currentState: state.global.currentState,
      showState: state.global.showState
    }
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...globalActions, ...preloaderActions }, dispatch)
  }
}

class Logout extends Component {

  /**
   * ### render
   * Setup some default presentations and render
   */
  render() {
    let self = this

    let onButtonPress = () => {
      this.props.actions.invalidateUserSession()
    }

    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Logout</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.container}>
          <Button success onPress={() => this.onButtonPress()}>
            <Text style={{ textAlign: 'center', width: '100%', color:'white' }}>Logout</Text>
          </Button>
        </View>
      </Container>

    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Logout)
