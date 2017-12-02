
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'

import React, { Component } from 'react'
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


class ProfileView extends Component {

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  componentDidMount() {
    this.props.actions.fetchUserList()
  }

  _onResetButtonPress = () => {
    this.props.actions.navigateToScene('ResetPassword')
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>

          <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Profile</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View />
              </View>
            </Body>
          </Header>

          <Content style={[styles.flex1, styles.bgWhite]}>
            {/* card 1 */}
            <View style={[styles.bgWhite, styles.padding20, { borderBottomWidth: 25, borderBottomColor: '#f3f3f3' }]}>
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
                  Reset Password
                </Text>
              </View>
            </View>

            {/*card 2*/}
            <View style={[styles.bgWhite, styles.marginBottom10, styles.padding10]}>
              <View style={[styles.marginBottom5]}>
                <Text style={[styles.fontXs, styles.fontDarkGray, styles.fontWeight300, styles.lineHeight20]}>
                  Contact Number
                </Text>
                <Text
                  style={[styles.fontDefault, styles.fontWeight300, styles.lineHeight20]}>
                  {this.props.contactNumber}
                </Text>
              </View>
              <View style={[styles.marginBottom5]}>
                <Text style={[styles.fontXs, styles.fontDarkGray, styles.fontWeight300, styles.lineHeight20]}>
                  Email
                </Text>
                <Text
                  style={[styles.fontDefault, styles.fontWeight300, styles.lineHeight20]}>
                  {this.props.email}
                </Text>
              </View>
            </View>
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
