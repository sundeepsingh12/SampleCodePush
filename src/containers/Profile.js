'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform
}
  from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, Content, Tab, Tabs, Body, Header, Title, Left, Right, Button } from 'native-base';
import * as profileActions from '../modules/profile/profileActions'


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
    actions: bindActionCreators({ ...profileActions }, dispatch)
  }
}

class Profile extends Component {

  componentDidMount() {
    console.log("saroj")
    this.props.actions.fetchUserList()
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
          <Text> Name:  {this.props.name}

            Contact Number: {this.props.contactNumber}

            Email-Id: {this.props.email}

          </Text>

        </View>
      </Container>
    )
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
