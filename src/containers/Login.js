'use strict'
import React, { PureComponent } from 'react'
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
import { StyleProvider, Container, Content, Button, Input, Item, CheckBox, Spinner } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import sha256 from 'sha256';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authActions from '../modules/login/loginActions'
import renderIf from '../lib/renderIf'
import codePush from "react-native-code-push"
import { QrCodeScanner } from '../lib/constants'


var style = StyleSheet.create({
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
    marginBottom: 20
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


class Login extends PureComponent {

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

  // codepushSync = () => {
  //   codePush.sync({
  //     updateDialog: true,
  //     installMode: codePush.InstallMode.IMMEDIATE
  //   }, (status) => {
  //     console.log("====Code push update=====");
  //     console.log(status);
  //   });
  // }

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
          <StyleProvider style={getTheme(platform)}>
            <Container>
              <Content>
                <View style={style.container}>
                  <View style={style.logoContainer}>
                    {imageView}
                  </View>
                  <View style={[style.width70, styles.marginTop30]}>
                    <Item rounded style={[styles.marginBottom10]}>
                      <Input
                        value={this.props.auth.form.username}
                        autoCapitalize="none"
                        placeholder='Username'
                        onChangeText={this.onChangeUsername}
                        disabled={this.props.auth.form.isEditTextDisabled}
                        style={[styles.fontSm, styles.paddingLeft15, styles.paddingRight15, {height: 40}]}
                      />
                    </Item>
                    <Item rounded>
                      <Input
                        value={this.props.auth.form.password}
                        placeholder='Password'
                        secureTextEntry={true}
                        onChangeText={this.onChangePassword}
                        onSubmitEditing={this.loginButtonPress}
                        disabled={this.props.auth.form.isEditTextDisabled}
                        style={[styles.fontSm, styles.paddingLeft15, styles.paddingRight15, {height: 40}]}
                      />
                    </Item>

                    <Button
                      full rounded success
                      disabled={this.props.auth.form.isButtonDisabled}
                      onPress={this.loginButtonPress}
                      style={[styles.marginTop15]}
                    >
                      <Text style={[styles.fontWhite]}>Log In</Text>
                    </Button>

                    <View style={[styles.row, styles.flex1, styles.justifyStart, styles.marginTop15]}>
                      <CheckBox checked={this.props.auth.form.rememberMe}
                        onPress={this.rememberMe} />
                      <Text style={{ marginLeft: 20 }}>Remember Me</Text>
                    </View>

                    <View style={[styles.marginTop30]}>
                      <Text style={[styles.fontCenter, styles.fontDanger, styles.marginBottom10]}>
                        {this.props.auth.form.displayMessage}
                      </Text>
                      <Button
                        onPress={this.startScanner} full rounded>
                        <Text style={[styles.fontWhite]}>Scanner</Text>
                      </Button>
                    </View>
                    {/* <View style={{ marginTop: 15 }}>
                      <Button
                        onPress={this.codepushSync} rounded style={{ width: '100%', }}>
                        <Text style={{ textAlign: 'center', width: '100%', color: 'white' }}>Code Push Sync</Text>
                      </Button>
                    </View> */}
                  </View>
                </View>
              </Content>
            </Container>
          </StyleProvider>
    )
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)