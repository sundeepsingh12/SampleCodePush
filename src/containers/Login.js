'use strict'
import React, { PureComponent } from 'react'
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  TextInput
}
  from 'react-native'
import { StyleProvider, Container, Content, Button, Item, CheckBox, Spinner, Icon as Iconimg, ActionSheet } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import sha256 from 'sha256';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authActions from '../modules/login/loginActions'
import renderIf from '../lib/renderIf'
import { QrCodeScanner } from '../lib/constants'
import Icon from '../../native-base-theme/components/Icon'
import CONFIG from '../lib/config'
import {
  OK,
  CANCEL,
  CONFIRM_RESET,
  RESET_ACCOUNT_SETTINGS,
  REMEMBER_ME
} from '../lib/ContainerConstants'
import { keyValueDBService } from '../services/classes/KeyValueDBService';


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

class Login extends PureComponent {

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
  onScannerLongPress = (url ) => {
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
    if (!this.props.auth.form.authenticationService) {
      return (
        <TouchableOpacity onLongPress={this.onLongPress}>
          <Image
            style={styles.logoStyle}
            source={require('../../images/fareye-logo.png')}
          />
        </TouchableOpacity >
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
          disabled={this.props.auth.form.isEditTextDisabled}
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
          disabled={this.props.auth.form.isEditTextDisabled}
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

  showCodePush(){
    return (
      <Button
        full rounded success
        onPress={this.codepushSync}
        style={[styles.marginTop15]}
      >
        <Text style={[styles.fontWhite]}>Code Push</Text>
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
          onLongPress = {this.scaneerLongPressToChooseEnvironment}
          >
          <Text style={[styles.fontWhite]}>Scanner</Text>
        </Button>
      </View>
    )
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
                {this.showUsernameView()}
                {this.showPasswordView()}
                {this.showLoginButton()}
                {/* {this.showCodePush()} */}
                {this.showRememberMe()}
                {this.showDisplayMessageAndScanner()}

              </View>
            </View>
          </Content>
        </Container>

      </StyleProvider>
    )
  }
};

export default connect(mapStateToProps, authActions)(Login)