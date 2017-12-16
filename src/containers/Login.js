'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableHighlight,
  Image,
  NetInfo

}
  from 'react-native'
import Scanner from "../components/Scanner"
import { Container, Button, Input, Item, CheckBox, Spinner, Content } from 'native-base'

import feStyle from '../themes/FeStyle';
import sha256 from 'sha256';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authActions from '../modules/login/loginActions'
import renderIf from '../lib/renderIf'
import codePush from "react-native-code-push"
import { QrCodeScanner } from '../lib/constants'


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  width70: {
    width: '70%'
  },

  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },

  logoContainer: {
    marginTop: 70,
    flexBasis: '20%',
    justifyContent: 'flex-start',
  },

  logoStyle: {
    width: 94,
    resizeMode: 'contain'
  }

})


function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...authActions }, dispatch)
  }
}


class Login extends Component {

  componentDidMount() {
    this.props.actions.checkRememberMe()
  }

  onChangeUsername = (value) => {
    this.props.actions.onChangeUsername(value)
  }

  onChangePassword = (value) => {
    this.props.actions.onChangePassword(value)
  }

  loginButtonPress = () => {
    const password = this.props.auth.form.password;
    if (password.length > 50) {
      this.props.actions.authenticateUser(this.props.auth.form.username, this.props.auth.form.password, this.props.auth.form.rememberMe)
    } else {
      this.props.actions.authenticateUser(this.props.auth.form.username, sha256(this.props.auth.form.password), this.props.auth.form.rememberMe)
    }
  }

  _onBarCodeRead = (value) => {
    const username = value.split("/")[0]
    const password = value.split("/")[1]
    this.onChangeUsername(username)
    this.onChangePassword(password)
    this.props.actions.authenticateUser(this.props.auth.form.username, this.props.auth.form.password, this.props.auth.form.rememberMe)
  }

  _onScaningCancelled = () => {
    this.props.actions.stopScanner()
  }

  rememberMe = () => {
    this.props.actions.toggleCheckbox()
  }

  codepushSync = () => {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE
    }, (status) => {
      console.log("====Code push update=====");
      console.log(status);
    });
  }

  getImageView() {
    if (!this.props.auth.form.authenticationService) {
      return (
        <Image
          style={styles.logoStyle}
          source={require('../../images/fareye-logo.png')}
        />
      )
    }
    if (this.props.auth.form.authenticationService) {
      return <Spinner />
    }
  }

  startScanner = () => {
    this.props.navigation.navigate(QrCodeScanner, { returnData: this._onBarCodeRead.bind(this) })
  }

  render() {
    const imageView = this.getImageView()
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          {imageView}
        </View>
        <View style={styles.width70}>
          <Item style={{ borderWidth: 0 }}>
            <Input
              value={this.props.auth.form.username}
              autoCapitalize="none"
              placeholder='Username'
              onChangeText={this.onChangeUsername}
              disabled={this.props.auth.form.isEditTextDisabled}
            />
          </Item>
          <Item style={{ borderWidth: 0, marginTop: 15 }}>
            <Input
              value={this.props.auth.form.password}
              placeholder='Password'
              secureTextEntry={true}
              onChangeText={this.onChangePassword}
              disabled={this.props.auth.form.isEditTextDisabled}
            />
          </Item>

          <Button
            rounded success style={{ width: '100%', marginTop: 15 }}
            disabled={this.props.auth.form.isButtonDisabled}
            onPress={this.loginButtonPress}
          >
            <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>Log In</Text>
          </Button>

          <View style={{ flexDirection: 'row', flexGrow: 1, justifyContent: 'flex-start', marginTop: 15 }}>
            <CheckBox checked={this.props.auth.form.rememberMe}
              onPress={this.rememberMe} />
            <Text style={{ marginLeft: 20 }}>Remember Me</Text>
          </View>

          <View style={{ marginTop: 35 }}>
            <Text style={{ textAlign: 'center', color: '#CC3333', marginBottom: 10 }}>
              {this.props.auth.form.displayMessage}
            </Text>
            <Button
              onPress={this.startScanner} rounded style={{ width: '100%', }}>
              <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>Scanner</Text>
            </Button>
          </View>
          <View style={{ marginTop: 15 }}>
            <Button
              onPress={this.codepushSync} rounded style={{ width: '100%', }}>
              <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>Code Push Sync</Text>
            </Button>
          </View>
        </View>
      </View>
    )
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)