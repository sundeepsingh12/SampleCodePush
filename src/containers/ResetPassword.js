
'use strict'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import React, {PureComponent} from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'

import {
  Container,
  Content,
  Header,
  Button,
  Left,
  Body,
  Right,
  Icon,
  Form, 
  Item, 
  Input, 
  Label,
  Footer,
  FooterTab,
  StyleProvider
} from 'native-base'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as globalActions from '../modules/global/globalActions'
import * as profileActions from '../modules/profile/profileActions'
import {
    CHECK_CURRENT_PASSWORD,
    SET_NEW_PASSWORD,
    SET_CONFIRM_NEW_PASSWORD,
    TOGGLE_SAVE_RESET_BUTTON,
} from '../lib/constants'
import Loader from '../components/Loader'

function mapStateToProps(state) {
    return {
        currentPassword: state.profileReducer.currentPassword,
        newPassword: state.profileReducer.newPassword,
        confirmNewPassword: state.profileReducer.confirmNewPassword,
        isSaveResetButtonDisabled: state.profileReducer.isSaveResetButtonDisabled,
        isLoaderInProfile: state.profileReducer.isLoaderInProfile,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions, ...profileActions }, dispatch)
    }
}


class ResetPassword extends PureComponent {

  static navigationOptions = ({navigation}) => {
    return {header: null}
  }

   _setCurrentPassword = (text) => {
        this.props.actions.setState(CHECK_CURRENT_PASSWORD, text)
        if (text && this.props.newPassword && this.props.confirmNewPassword) {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, false)
        } else {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, true)
        }
    }
    _setNewPassword = (text) => {
        this.props.actions.setState(SET_NEW_PASSWORD, text)
        if (this.props.currentPassword && text && this.props.confirmNewPassword) {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, false)
        } else {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, true)
        }
    }
    _setConfirmNewPassword = (text) => {
        this.props.actions.setState(SET_CONFIRM_NEW_PASSWORD, text)
        if (this.props.currentPassword && this.props.newPassword && text) {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, false)
        } else {
            this.props.actions.setState(TOGGLE_SAVE_RESET_BUTTON, true)
        }
    }
    _onResetPress = () => {
        this.props.actions.checkAndResetPassword(this.props.currentPassword, this.props.newPassword, this.props.confirmNewPassword, this.props.navigation)
    }

  render() {
    if (this.props.isLoaderInProfile) {
      return (<Loader />)
    } else {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>

          <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                  <Icon  name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]}/>
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Reset Password</Text>  
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View/>
              </View>
            </Body>
          </Header>

          <Content style={[styles.flex1, styles.bgWhite]}>
            {/*card 1*/}
            <View style={[styles.bgWhite, styles.padding10, styles.marginTop30]}>
                <Item stackedLabel style={[styles.marginBottom15]}>
                    <Label style={[styles.fontPrimary, styles.fontSm]}>Current Password</Label>
                    <Input style={[style.inputType]} secureTextEntry={true} onChangeText={this._setCurrentPassword} value={this.props.currentPassword}/>
                </Item>
                <Item stackedLabel style={[styles.marginBottom15]}>
                    <Label style={[styles.fontPrimary, styles.fontSm]}>New Password</Label>
                    <Label style={[styles.fontDarkGray, styles.fontXs]}>Min. 8 characters, include capital letter, symbol and number.</Label>
                    <Input style={[style.inputType]} secureTextEntry={true} onChangeText={this._setNewPassword} value={this.props.newPassword} />
                </Item>
                <Item stackedLabel style={[styles.marginBottom15]}>
                    <Label style={[styles.fontPrimary, styles.fontSm]}>Confirm New Password</Label>
                    <Input style={[style.inputType]} secureTextEntry={true} onChangeText={this._setConfirmNewPassword} value={this.props.confirmNewPassword}/>
                </Item>
            </View>

          </Content>
          <Footer style={[style.footer]}>
            <FooterTab style={[styles.padding10]}>
              <Button success full onPress={this._onResetPress} disabled={this.props.isSaveResetButtonDisabled}>
                <Text style={[styles.fontLg, styles.fontWhite]}>Reset Password</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>
      )
  }
  }
};

const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    padding: 0,
    paddingRight: 0, 
    paddingLeft: 0
  },
  headerLeft : {
    width: '15%', 
    padding: 15
  },
  headerBody : {
    width: '70%', 
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerRight : {
    width: '15%',
    padding: 15
  },
  footer: {
    height: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3'
  },
  inputType : {
    height: 50,
    fontSize: 14
  }
  
});


export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
