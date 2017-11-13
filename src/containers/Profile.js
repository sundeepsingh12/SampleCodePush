'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
}
  from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, Content, Tab, Tabs, Body, Header, Title, Left, Right, Button } from 'native-base';
import * as profileActions from '../modules/profile/profileActions'
import ProfileReset from './ProfileReset'
import * as globalActions from '../modules/global/globalActions'

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
})

function mapStateToProps(state) {
  return {
    name: state.profileReducer.name,
    contactNumber: state.profileReducer.contactNumber,
    email: state.profileReducer.email,
  }
};


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions, ...profileActions }, dispatch)
  }
}

class Profile extends Component {

  componentDidMount() {
    this.props.actions.fetchUserList()
  }


  _onResetButtonPress = () => {
    this.props.actions.navigateToScene('ProfileReset')
  }

  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.container}>
          <Text>
            Name:  {this.props.name}
          </Text>
          <Text>
            Contact Number: {this.props.contactNumber}
          </Text>
          <Text>
            Email-Id: {this.props.email}
          </Text>

          <Button onPress={this._onResetButtonPress}>
            <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>
              Reset Password
              </Text>
          </Button>
        </View>
      </Container>
    )
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
