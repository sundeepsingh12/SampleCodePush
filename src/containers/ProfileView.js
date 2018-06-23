
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Container, Content, Header, Button, Text,  Body, Right, Icon, StyleProvider } from 'native-base'
import * as profileActions from '../modules/profile/profileActions'
import * as globalActions from '../modules/global/globalActions'
import { RESET_PASSWORD, CONTACT_NUMBER, EMAIL, PROFILE, } from '../lib/ContainerConstants'

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


class ProfileView extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  componentDidMount() {
    this.props.actions.fetchUserList()
  }

  _onResetButtonPress = () => {
    this.props.actions.navigateToScene('ResetPassword',null,this.props.navigation.navigate)
  }

  _getHeaderView() {
    return (
      <SafeAreaView style={{ backgroundColor: styles.bgPrimaryColor }}>
        <Header searchBar style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, styles.header])}>
          <Body>
            <View
              style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
              <TouchableOpacity style={[styles.profileHeaderLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
              </TouchableOpacity>
              <View style={[styles.headerBody, styles.paddingTop15]}>
                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.displayName}</Text>
              </View>
              <View style={[styles.headerRight]}>
              </View>
              <View />
            </View>
          </Body>
        </Header>
      </SafeAreaView>
    )
  }

  _getResetPasswordView() {
    return <View style={[styles.bgWhite, styles.padding20, { borderBottomWidth: 25, borderBottomColor: '#f3f3f3' }]}>
      <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
        <View style={[styles.alignCenter, styles.justifyCenter, styles.profilePic, { backgroundColor: styles.bgPrimaryColor }]}>
          <Icon name="md-person" style={[styles.alignStart, styles.justifyCenter, styles.fontWhite, styles.fontXxxl, styles.fontLeft]} />
        </View>
      </View>
      <View style={[styles.alignCenter, styles.justifyCenter, styles.paddingTop10, styles.paddingBottom10]}>
        <Text style={[styles.fontLg, styles.fontBlack]}>
          {this.props.name}
        </Text>
        <Text style={[styles.fontLg, { color: styles.fontPrimaryColor }, styles.fontWeight500, styles.marginTop10]} onPress={this._onResetButtonPress}>
          {RESET_PASSWORD}
        </Text>
      </View>
    </View>
  }

  _getContactDetails() {
    return <View style={[styles.bgWhite, styles.marginBottom10, styles.padding10]}>
      <View style={[styles.marginBottom5]}>
        <Text style={[styles.fontXs, styles.fontDarkGray, styles.fontWeight300, styles.lineHeight20]}>
          {CONTACT_NUMBER}
        </Text>
        <Text
          style={[styles.fontDefault, styles.fontWeight300, styles.lineHeight20]}>
          {this.props.contactNumber}
        </Text>
      </View>
      <View style={[styles.marginBottom5]}>
        <Text style={[styles.fontXs, styles.fontDarkGray, styles.fontWeight300, styles.lineHeight20]}>
          {EMAIL}
        </Text>
        <Text
          style={[styles.fontDefault, styles.fontWeight300, styles.lineHeight20]}>
          {this.props.email}
        </Text>
      </View>
    </View>
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          {this._getHeaderView()}
          <Content style={[styles.flex1, styles.bgWhite]}>
            {this._getResetPasswordView()}
            {this._getContactDetails()}
          </Content>
        </Container>
      </StyleProvider>
    )
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)
