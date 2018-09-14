'use strict'
import React, { PureComponent } from 'react'
import { Alert, StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Modal, Keyboard } from 'react-native'
import { StyleProvider, Container, Content, Button, Item, CheckBox, Spinner, Icon as Iconimg, ActionSheet, Label, Footer } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import sha256 from 'sha256';
import { connect } from 'react-redux'
import * as authActions from '../modules/login/loginActions'
import { QrCodeScanner } from '../lib/constants'
import CONFIG from '../lib/config'
import { OK, CANCEL, CONFIRM_RESET, RESET_ACCOUNT_SETTINGS, REMEMBER_ME, NEW_PASSWORD, CONFIRM_NEW_PASSWORD, PASSWORD_EXPIRED_MESSAGE, RESET_PASSWORD, SAVE_AND_PROCEED } from '../lib/ContainerConstants'
import _ from 'lodash'
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
  }

})

function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

class Login extends PureComponent {
  _didFocusSubscription;

  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      confirmNewPassword: '',
      buttonDisabled: true
    }
  }

  componentDidMount() {
    this.props.checkRememberMe()
  }

  onChangeUsername = (value) => {
    this.props.onChangeUsername(value)
  }

  onChangePassword = (value) => {
    this.props.onChangePassword(value)
  }

  loginButtonPress = () => {
    const password = this.props.auth.form.password;
    if (password.length > 50) {
      this.props.authenticateUser(this.props.auth.form.username, this.props.auth.form.password, this.props.auth.form.rememberMe)
    } else {
      this.props.authenticateUser(this.props.auth.form.username, sha256(this.props.auth.form.password), this.props.auth.form.rememberMe)
    }
  }

  scaneerLongPressToChooseEnvironment = () => {
    let domainList = CONFIG.FAREYE.domain.map((domain) => domain.name)
    domainList.push(CANCEL)
    ActionSheet.show(
      {
        options: domainList,
        cancelButtonIndex: domainList.length - 1,
        title: 'SELECT DOMAIN'
      },
      buttonIndex => {
        if (buttonIndex != domainList.length - 1 && buttonIndex >= 0) {
          this.onScannerLongPress(CONFIG.FAREYE.domain[buttonIndex].url)
        }
      }
    )
  }
  onScannerLongPress = (url) => {
    this.props.onLongPressResetSettings(url)
  }

  _onBarCodeRead = (value) => {
    const username = value.split("/")[0]
    const password = value.split("/")[1]
    this.onChangeUsername(username)
    this.onChangePassword(password)
    this.props.authenticateUser(username, password, this.props.auth.form.rememberMe)
  }

  _onScaningCancelled = () => {
    this.props.stopScanner()
  }

  rememberMe = () => {
    this.props.toggleCheckbox()
  }

  getImageView() {
    if (this.props.auth.form.authenticationService || this.props.auth.form.isLongPress) {
      return <Spinner />
    }
    let sourceOptions;
    if (this.props.auth.form.logo) {
      sourceOptions = {
        
        isStatic: true,
        uri: 'data:image/jpeg;base64,' + this.props.auth.form.logo
      }
    } else {
      sourceOptions = require('../../images/fareye-logo.png')
    }
    if (!this.props.auth.form.authenticationService) {
      return (
        <TouchableOpacity style={[styles.width100, { height: 'auto' }]} onLongPress={this.onLongPress}>
          <Image
            resizeMode={'contain'}
            source={sourceOptions}
            style={[{ height: 100, width: 100 }]}
          />
        </TouchableOpacity>
      )
    }
  }

  onLongPress = () => {
    Alert.alert(
      CONFIRM_RESET,
      RESET_ACCOUNT_SETTINGS,
      [
        { text: CANCEL, style: 'cancel' },
        { text: OK, onPress: this.onLongPressResetSetting },
      ],
    )
  }

  onLongPressResetSetting = () => {
    this.props.onLongPressResetSettings()
  }

  startScanner = () => {
    this.props.navigation.navigate(QrCodeScanner, { returnData: this._onBarCodeRead.bind(this) })
  }

  showUsernameView() {
    return (
      <Item rounded style={[styles.marginBottom10]}>
        <TextInput
          value={this.props.auth.form.username}
          autoCapitalize="none"
          placeholder='Username'
          underlineColorAndroid='transparent'
          onChangeText={this.onChangeUsername}
          editable={this.props.auth.form.isEditTextEnabled}
          style={[styles.fontSm, styles.paddingLeft15, styles.paddingRight15, styles.width100, { height: 40 }]}
        />
      </Item>
    )
  }

  showPasswordView() {
    return (
      <Item rounded style={[styles.marginBottom10]}>
        <TextInput
          value={this.props.auth.form.password}
          placeholder='Password'
          underlineColorAndroid='transparent'
          secureTextEntry={true}
          onChangeText={this.onChangePassword}
          onSubmitEditing={this.loginButtonPress}
          editable={this.props.auth.form.isEditTextEnabled}
          style={[styles.fontSm, styles.paddingLeft15, styles.paddingRight15, styles.width100, { height: 40 }]}
        />
        {this.showForgetPasswordView()}
      </Item>
    )
  }

  showForgetPasswordView() {
    return (
      <Iconimg
        name='ios-help-circle-outline'
        onPress={() => {
          this.props.forgetPasswordRequest(this.props.auth.form.username)
        }
        }
        style={{ right: 5, position: 'absolute', color: 'black', backgroundColor: 'white' }} />
    )
  }

  showLoginButton() {
    return (
      <Button
        full rounded success
        disabled={this.props.auth.form.isButtonDisabled}
        onPress={this.loginButtonPress}
        style={[styles.marginTop15]}
      >
        <Text style={[styles.fontWhite]}>Log In</Text>
      </Button>
    )
  }

  showRememberMe() {
    return (
      <View style={[styles.row, styles.flex1, styles.justifyStart, styles.marginTop15]}>
        <CheckBox checked={this.props.auth.form.rememberMe}
          onPress={this.rememberMe} />
        <Text style={{ marginLeft: 20 }} onPress={this.rememberMe}>{REMEMBER_ME}</Text>
      </View>
    )
  }

  showDisplayMessageAndScanner() {
    return (
      <View style={[styles.marginTop30]}>
        <Text style={[styles.fontCenter, styles.fontDanger, styles.marginBottom10]}>
          {this.props.auth.form.displayMessage}
        </Text>
        <Button
          onPress={this.startScanner} full rounded
          onLongPress={this.scaneerLongPressToChooseEnvironment}
        >
          <Text style={[styles.fontWhite]}>Scanner</Text>
        </Button>
      </View>
    )
  }

  _setPassword(text, newPasswordOrConfirmPassword) {
    if (!_.isEmpty(this.props.auth.form.errorMessageResetPassword)) {
      this.props.setErrorMessageResetPassword('')
    }
    let buttonDisabled
    if (newPasswordOrConfirmPassword == 1) {
      if (this.state.confirmNewPassword != '' && text != '') {
        buttonDisabled = false
      } else {
        buttonDisabled = true
      }
    } else {
      if (this.state.newPassword != '' && text != '') {
        buttonDisabled = false
      } else {
        buttonDisabled = true
      }
    }
    if (newPasswordOrConfirmPassword == 1) {
      this.setState({ newPassword: text, buttonDisabled })
    } else {
      this.setState({ confirmNewPassword: text, buttonDisabled })
    }
  }

  closeModal() {
    this.props.setShowResetPassword(false)
    this.setState({ confirmNewPassword: '', newPassword: '', buttonDisabled: true })
  }

  showResetPasswordModal() {
    let view
    if (this.props.auth.form.showResetPassword) {
      view =
        <Modal animationType={"fade"}
          transparent={true}
          visible={this.props.auth.form.showResetPassword}
          onRequestClose={() => this.closeModal()}
          presentationStyle={"overFullScreen"}>
          <StyleProvider style={getTheme(platform)}>
            <Container style={[styles.bgWhite]}>
              <Content style={[styles.flexBasis90]} >
                <View >
                  <View style={[styles.paddingTop10, { top: 0, left: 0, height: 50, width: '100%' }, styles.paddingLeft15, styles.row]}>
                    <TouchableOpacity onPress={() => this.closeModal()}>
                      <Iconimg name="md-close" style={[styles.fontBlack, styles.fontXxl, styles.fontLeft]} />
                    </TouchableOpacity>
                    <View style={[styles.flex1, styles.alignCenter]}>
                      <Text style={[styles.fontBlack, styles.fontXl]}>{RESET_PASSWORD}</Text>
                    </View>
                  </View>

                  <View style={[styles.width100, { paddingTop: 50 }]} >
                    <Text style={[styles.fontLg, styles.fontCenter, styles.margin20]}>
                      {PASSWORD_EXPIRED_MESSAGE}
                    </Text>
                  </View>
                  <View style={[{ paddingTop: 80 }, styles.paddingLeft10, styles.paddingRight10]}>
                    {this.textInputForResetPassword(NEW_PASSWORD, 1, this.state.newPassword)}
                    {this.textInputForResetPassword(CONFIRM_NEW_PASSWORD, 2, this.state.confirmNewPassword)}
                  </View>
                  {(!_.isEmpty(this.props.auth.form.errorMessageResetPassword)) ? <View style={[styles.width100, { paddingTop: 30 }]} >
                    <Text style={[styles.fontLg, styles.fontCenter, styles.margin20, styles.fontDanger]}>
                      {this.props.auth.form.errorMessageResetPassword}
                    </Text>
                  </View> : null}
                  {_.isEmpty(this.props.auth.form.errorMessageResetPassword) && this.props.auth.form.showResetPasswordLoader ?
                    <Spinner />
                    : null
                  }
                </View>
              </Content>
              <View style={[styles.padding10]}>
                <Button
                  full success
                  disabled={this.state.buttonDisabled || this.props.auth.form.showResetPasswordLoader || !_.isEmpty(this.props.auth.form.errorMessageResetPassword)}
                  onPress={() => {
                    Keyboard.dismiss();
                    this.props.resetPassword(this.state.newPassword, this.state.confirmNewPassword, this.props.auth.form.username, this.props.auth.form.password)
                  }}
                  style={[styles.padding10, styles.width100, { height: 50 }]}
                >
                  <Text style={[styles.fontWhite, styles.fontLg]}>{SAVE_AND_PROCEED}</Text>
                </Button>
              </View>
            </Container>
          </StyleProvider>
        </Modal>
    }
    return view
  }

  textInputForResetPassword(displayLabel, newPasswordOrConfirmPassword, ref) {
    let view
    view =
      <Item stackedLabel>
        <Label style={[{ color: styles.fontPrimaryColor }, styles.fontRegular]}>{displayLabel}</Label>
        <TextInput
          value={ref}
          autoCapitalize="none"
          underlineColorAndroid='transparent'
          onChangeText={(text) => this._setPassword(text, newPasswordOrConfirmPassword)}
          secureTextEntry={true}
          style={[styles.fontLg, styles.paddingRight15, styles.width100, { height: 40 }]}
        />
      </Item>
    return view
  }

  render() {
    const imageView = this.getImageView()
    return (
        <Container>
          <Content>
            <View style={style.container}>
              <View style={style.logoContainer}>
                {imageView}
              </View>
              <View style={[style.width70, styles.marginTop30]}>
                {this.showUsernameView()}
                {this.showPasswordView()}
                {this.showLoginButton()}
                {this.showRememberMe()}
                {this.showDisplayMessageAndScanner()}
                {this.showResetPasswordModal()}
              </View>
            </View>
          </Content>
        </Container>

    )
  }
};

export default connect(mapStateToProps, authActions)(Login)