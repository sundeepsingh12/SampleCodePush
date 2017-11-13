
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
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
  Footer,
  FooterTab,
  StyleProvider
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import {
  BACKUP,
  BLUETOOTH,
  EZE_TAP,
  M_SWIPE,
  OFFLINEDATASTORE,
  PROFILE,
  STATISTIC,
} from '../lib/AttributeConstants'

function mapStateToProps(state) {
  return {}
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...globalActions,
      ...preloaderActions
    }, dispatch)
  }
}


class Profile extends Component {

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  renderModuleView(modulesList) {
    let moduleView = []
    for (let index in modulesList) {
      moduleView.push(
        <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
          <View style={[style.listIcon, styles.marginTop15, styles.justifyCenter, styles.alignCenter, styles.bgPrimary]}>
            <Icon name="md-person" style={[styles.fontWhite, styles.fontXl]} />
          </View>
          <View style={[styles.justifySpaceBetween, styles.marginLeft10, styles.flex1]}>
            <View style={[styles.row, styles.paddingRight10, styles.paddingTop15, styles.paddingBottom15, styles.justifySpaceBetween, styles.alignCenter, { borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }]}>
              <Text style={[styles.fontDefault]}>
                Profile
            </Text>
              <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontLightGray]} />
            </View>
          </View>
        </View>
      )
    }
    return moduleView
  }

  renderTextView(text, key) {
    return (
      <View key={key} style={[styles.justifySpaceBetween, styles.marginLeft10, styles.flex1]}>
        <View style={[styles.row, styles.paddingRight10, styles.paddingTop15, styles.paddingBottom15, styles.justifySpaceBetween, styles.alignCenter, { borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }]}>
          <Text style={[styles.fontDefault]}>
            {text}
          </Text>
          <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontLightGray]} />
        </View>
      </View>
    )
  }

  renderIconView(icon, key) {
    return (
      <View key={key} style={[style.listIcon, styles.marginTop15, styles.justifyCenter, styles.alignCenter, styles.bgPrimary]}>
        <Icon name={icon} style={[styles.fontWhite, styles.fontXl]} />
      </View>
    )
  }

  renderCardView(view, key) {
    return (
      <View key={key} style={[styles.bgWhite, styles.marginBottom10]}>
        <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
          {view}
        </View>
      </View>
    )
  }

  renderModuleView(moduleList, key) {
    let moduleView, rowView = []
    for (let index in moduleList) {
      moduleView = []
      if (moduleList[index].icon) {
        moduleView.push(
          this.renderIconView(moduleList[index].icon, key * (index + 1) * 100)
        )
      }
      moduleView.push(
        this.renderTextView(moduleList[index].displayName, key * (index + 1) * 1000)
      )
      rowView.push(this.renderCardView(moduleView, key * (index + 1) * 10000))
    }
    return rowView
  }


  render() {
    let profileView = this.renderModuleView([PROFILE, STATISTIC], 1)
    let paymentView = this.renderModuleView([EZE_TAP, M_SWIPE], 2)
    let deviceView = this.renderModuleView([BACKUP, OFFLINEDATASTORE, BLUETOOTH], 3)
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header searchBar style={StyleSheet.flatten([styles.bgWhite, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontBlack, styles.fontLg, styles.alignCenter, styles.fontWeight500]}>Menu</Text>
                </View>
                <View />
              </View>
            </Body>
          </Header>

          <Content style={[styles.flex1, styles.bgLightGray, styles.paddingTop10, styles.paddingBottom10]}>
            {/*card 1*/}
            <View style={[styles.bgWhite, styles.marginBottom10]}>
              {profileView}
            </View>

            {/*Card 2*/}
            <View style={[styles.bgWhite, styles.marginBottom10]}>
              {paymentView}
            </View>

            {/*Card 3*/}
            <View style={[styles.bgWhite, styles.marginBottom10]}>
              {deviceView}
            </View>

            {/*Card 4*/}
            <View style={[styles.bgWhite, styles.marginBottom10]}>
              <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
                <View style={[styles.justifySpaceBetween, styles.flex1]}>
                  <View style={[styles.row, styles.paddingRight10, styles.paddingTop15, styles.paddingBottom15, styles.justifySpaceBetween, styles.alignCenter, { borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }]}>
                    <Text style={[styles.fontDefault]}>
                      Contact Support
                    </Text>
                    <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontLightGray]} />
                  </View>
                </View>
              </View>

              <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
                <View style={[styles.justifySpaceBetween, styles.flex1]}>
                  <View style={[styles.row, styles.paddingRight10, styles.paddingTop15, styles.paddingBottom15, styles.justifySpaceBetween, styles.alignCenter]}>
                    <Text style={[styles.fontDefault]}>
                      Help &amp; Documentation
                    </Text>
                    <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontLightGray]} />
                  </View>
                </View>
              </View>
            </View>

            {/*Card 5*/}
            <TouchableOpacity style={[styles.bgWhite, styles.marginBottom10]} onPress={() => { this.props.actions.invalidateUserSession() }}>
              <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
                <View style={[styles.justifySpaceBetween, styles.flex1]}>
                  <View style={[styles.row, styles.paddingRight10, styles.paddingTop15, styles.paddingBottom15, styles.justifySpaceBetween, styles.alignCenter]}>
                    <Text style={[styles.fontDefault]}>
                      Logout
                    </Text>
                    <Icon name="ios-log-in" style={[styles.fontLg, styles.fontPrimary]} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Content>
          <Footer style={[style.footer]}>
            <FooterTab>
              <Button onPress={() => { this.props.actions.navigateToScene('JobDetailsV2') }}>
                <Icon name="ios-home" />
                <Text>Home</Text>
              </Button>
              <Button>
                <Icon name="ios-sync" />
                <Text>Sync</Text>
              </Button>
              <Button active>
                <Icon name="ios-menu" />
                <Text>Menu</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>

    )
  }

};

const style = StyleSheet.create({
  header: {
    height: 'auto',
    padding: 0,
    paddingRight: 0,
    paddingLeft: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3'
  },
  headerBody: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  listIcon: {
    width: 22,
    height: 22,
    borderRadius: 3,
  },
  footer: {
    height: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3'
  }

});


export default connect(mapStateToProps, mapDispatchToProps)(Profile)
