
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Container, Content, Header, Button, Body, Icon, Item, Input, Label, Footer, FooterTab} from 'native-base'
import styles from '../themes/FeStyle'
import * as globalActions from '../modules/global/globalActions'
import * as profileActions from '../modules/profile/profileActions'
import { CHECK_CURRENT_PASSWORD, SET_NEW_PASSWORD, SET_CONFIRM_NEW_PASSWORD, TOGGLE_SAVE_RESET_BUTTON, } from '../lib/constants'
import Loader from '../components/Loader'
import { RESET_PASSWORD, CURRENT_PASSWORD, NEW_PASSWORD, CONFIRM_NEW_PASSWORD, MINIMUM_REQUIREMENT_FOR_PASSWORD, } from '../lib/ContainerConstants'

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

  static navigationOptions = ({ navigation }) => {
    return { header: null }
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
    this.props.actions.checkAndResetPassword(this.props.currentPassword, this.props.newPassword, this.props.confirmNewPassword)
  }

  _getHeaderView() {
    return (
        <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }, styles.header]}>
          <Body>
            <View style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
              <TouchableOpacity style={[styles.profileHeaderLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
              </TouchableOpacity>
              <View style={[styles.headerBody, styles.paddingTop15]}>
                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{RESET_PASSWORD}</Text>
              </View>
              <View style={[styles.headerRight]}>
              </View>
              <View />
            </View>
          </Body>
        </Header>
    )
  }

  _getPasswordDetails() {
    return <Content style={[styles.flex1, styles.bgWhite]}>
      <View style={[styles.bgWhite, styles.padding10, styles.marginTop30]}>
        <Item stackedLabel style={[styles.marginBottom15]}>
          <Label style={[{ color: styles.fontPrimaryColor }, styles.fontSm]}>{CURRENT_PASSWORD}</Label>
          <Input style={[styles.inputType]} secureTextEntry={true} onChangeText={this._setCurrentPassword} value={this.props.currentPassword} />
        </Item>
        <Item stackedLabel style={[styles.marginBottom15]}>
          <Label style={[{ color: styles.fontPrimaryColor }, styles.fontSm]}>{NEW_PASSWORD}</Label>
          <Label style={[styles.fontDarkGray, styles.fontXs]}>{MINIMUM_REQUIREMENT_FOR_PASSWORD}</Label>
          <Input style={[styles.inputType]} secureTextEntry={true} onChangeText={this._setNewPassword} value={this.props.newPassword} />
        </Item>
        <Item stackedLabel style={[styles.marginBottom15]}>
          <Label style={[{ color: styles.fontPrimaryColor }, styles.fontSm]}>{CONFIRM_NEW_PASSWORD}</Label>
          <Input style={[styles.inputType]} secureTextEntry={true} onChangeText={this._setConfirmNewPassword} value={this.props.confirmNewPassword} />
        </Item>
      </View>
    </Content>
  }

  _getFooterView() {
    return (
        <Footer style={[styles.footer]}>
          <FooterTab style={[styles.padding10]}>
            <Button success full onPress={this._onResetPress} disabled={this.props.isSaveResetButtonDisabled}>
              <Text style={[styles.fontLg, styles.fontWhite]}>{RESET_PASSWORD}</Text>
            </Button>
          </FooterTab>
        </Footer>
    )
  }

  render() {
    if (this.props.isLoaderInProfile) {
      return (<Loader />)
    } else {
      return (
          <Container>
            {this._getHeaderView()}
            {this._getPasswordDetails()}
            {this._getFooterView()}
          </Container>
      )
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)