
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'

import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  Left,
  Body,
  Right,
  Icon,
  StyleProvider
} from 'native-base'

import * as profileActions from '../modules/profile/profileActions'
import * as globalActions from '../modules/global/globalActions'
import {
  RESET_PASSWORD,
  CONTACT_NUMBER,
  EMAIL,
  PROFILE,
} from '../lib/ContainerConstants'

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
    this.props.actions.navigateToScene('ResetPassword')
  }

  _getHeaderView() {
    return <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
      <Body>
        <View
          style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
          <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
            <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
          </TouchableOpacity>
          <View style={[style.headerBody]}>
            <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{PROFILE}</Text>
          </View>
          <View style={[style.headerRight]}>
          </View>
          <View />
        </View>
      </Body>
    </Header>
  }

  _getResetPasswordView() {
    return <View style={[styles.bgWhite, styles.padding20, { borderBottomWidth: 25, borderBottomColor: '#f3f3f3' }]}>
      <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
        <View style={[styles.alignCenter, styles.justifyCenter, style.profilePic, styles.bgPrimary]}>
          <Icon name="md-person" style={[styles.alignStart, styles.justifyCenter, styles.fontWhite, styles.fontXxxl, styles.fontLeft]} />
        </View>
      </View>
      <View style={[styles.alignCenter, styles.justifyCenter, styles.paddingTop10, styles.paddingBottom10]}>
        <Text style={[styles.fontLg, styles.fontBlack]}>
          {this.props.name}
        </Text>
        <Text style={[styles.fontLg, styles.fontPrimary, styles.fontWeight500, styles.marginTop10]} onPress={this._onResetButtonPress}>
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
    let headerView = this._getHeaderView()
    let resetPasswordView = this._getResetPasswordView()
    let contactDetails = this._getContactDetails()
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          {headerView}
          <Content style={[styles.flex1, styles.bgWhite]}>
            {resetPasswordView}
            {contactDetails}
          </Content>
        </Container>
      </StyleProvider>
    )
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
  headerLeft: {
    width: '15%',
    padding: 15
  },
  headerBody: {
    width: '70%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerRight: {
    width: '15%',
    padding: 15
  },
  profilePic: {
    width: 72,
    height: 72,
    borderRadius: 36,
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)
