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
import { Container, Body, InputGroup, Button, Input, Item, ListItem, CheckBox } from 'native-base';

import feTheme from '../themes/feTheme';
import sha256 from 'sha256';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authActions from '../modules/login/loginActions'
// import * as globalActions from '../modules/global/globalActions'
import renderIf from '../lib/renderIf';

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
    // global: state.global,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...authActions }, dispatch)
  }
}


class Login extends Component {

  constructor(props) {
    super(props);
  }

  onChangeUsername(username) {
    this.props.actions.onChangeUsername(username)
  }

  onChangePassword(password) {
    this.props.actions.onChangePassword(password)
  }

  loginButtonPress() {
    const password = this.props.auth.form.password;
    console.log(password.length)
    /*if (password.length<64) {
      this.onChangePassword(sha256(password));
    }*/

    this.props.actions.authenticateUser(this.props.auth.form.username, sha256(this.props.auth.form.password));
  }

  _onBarCodeRead(result) {
    const username = result.data.split("/")[0];
    const password = result.data.split("/")[1];
    this.props.actions.stopScanner();
    this.onChangeUsername(username);
    this.onChangePassword(password);
    this.props.actions.authenticateUser(this.props.auth.form.username, this.props.auth.form.password);
  }

  _onScaningCancelled() {
    this.props.actions.stopScanner();
  }

  render() {
    return (
      <Container>
        {renderIf(!this.props.auth.form.isCameraScannerActive,
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logoStyle}
                source={require('../../images/fareye-logo.png')}
              />
            </View>
            <View style={styles.width70}>
              <Item style={{ borderWidth: 0 }}>
                <Input
                  value={this.props.auth.form.username}
                  placeholder='Username'
                  style={feTheme.roundedInput}
                  onChangeText={value =>  this.onChangeUsername(value) } />
              </Item>
              <Item style={{ borderWidth: 0, marginTop: 15 }}>
                <Input
                  value={this.props.auth.form.password}
                  placeholder='Password'
                  style={feTheme.roundedInput}
                  secureTextEntry={true}
                  onChangeText={value =>  this.onChangePassword(value) }

                />
              </Item>

              <Button
                onPress={() => this.loginButtonPress()} rounded success style={{ width: '100%', marginTop: 15 }}
                disabled={this.props.auth.form.isButtonDisabled}
              >
                <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>Log In</Text>
              </Button>

              <View style={{ flexDirection: 'row', flexGrow: 1, justifyContent: 'flex-start', marginTop: 15 }}>
                <CheckBox checked={false} />
                <Text style={{ marginLeft: 20 }}>Remember Me</Text>
              </View>

              <View style={{ marginTop: 35 }}>
                <Text style={{ textAlign: 'center', color: '#d3d3d3', marginBottom: 10 }}>
                  {this.props.auth.form.displayMessage}...
                  </Text>
                <Button 
                  onPress={() => this.props.actions.startScanner()} rounded style={{ width: '100%', }}>
                  <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>Scanner</Text>
                </Button>
              </View>
            </View>
          </View>
        )}
        {renderIf(this.props.auth.form.isCameraScannerActive,
          <Scanner onBarCodeRead={this._onBarCodeRead.bind(this)} onBackPress={this._onScaningCancelled.bind(this)} />
        )}
      </Container>
    )
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)