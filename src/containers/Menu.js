
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity,Alert } from 'react-native'

import Loader from '../components/Loader'

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
  StyleProvider,
  Toast
} from 'native-base'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import renderIf from '../lib/renderIf'
import CustomAlert from '../components/CustomAlert'
import {
  PROFILE_ID,
  STATISTIC_ID,
} from '../lib/AttributeConstants'

import {
  ProfileView,
  Statistics,
  PROFILE,
  EZETAP,
  MSWIPE,
  STATISTIC,
  OFFLINEDATASTORE,
  BACKUP,
  BLUETOOTH
} from '../lib/constants'

function mapStateToProps(state) {
  return {
    loading: state.home.loading,
    errorMessage_403_400_Logout: state.preloader.errorMessage_403_400_Logout,
    isErrorType_403_400_Logout: state.preloader.isErrorType_403_400_Logout,
    menu: state.home.menu,
    isLoggingOut:state.home.isLoggingOut
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...globalActions,
      ...preloaderActions
    }, dispatch)
  }
}


class Menu extends PureComponent {

  renderTextView(text, key, isLast, icon) {
    return (
      <View key={key} style={[styles.justifySpaceBetween, icon ? styles.marginLeft10 : null, styles.flex1]}>
        <View style={[styles.row, styles.paddingRight10, styles.paddingTop15, styles.paddingBottom15, styles.justifySpaceBetween, styles.alignCenter, { borderBottomWidth: isLast ? 0 : 1, borderBottomColor: '#f3f3f3' }]}>
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
      <View key={key} style={[style.listIcon, styles.marginTop15, styles.justifyCenter, styles.alignCenter]}>
        <Icon name={icon} style={[styles.fontPrimary, styles.fontLg]} />
      </View>
    )
  }

  renderCardView(view, key, moduleIndex) {
    return (
      <TouchableOpacity key={key} onPress={() => this.navigateToScene(moduleIndex)}>
        <View style={[styles.bgWhite]}>
          <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
            {view}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  navigateToScene = (appModule) => {
    console.log('modulename', appModule)
    switch (appModule.appModuleId) {
      case PROFILE_ID: {
        this.props.actions.navigateToScene(ProfileView)
        break
      }

      case STATISTIC_ID: {
        this.props.actions.navigateToScene(Statistics)
        break
      }
      // default:
      //   Toast.show({
      //     text: `Under development!Coming Soon`,
      //     position: 'bottom',
      //     buttonText: 'OK'
      //   })
    }
  }

  renderModuleView(moduleList, key) {
    let moduleView, rowView = []
    for (let index in moduleList) {
      moduleView = []
      if (!moduleList[index].enabled) {
        continue
      }
      if (moduleList[index].icon) {
        moduleView.push(
          this.renderIconView(moduleList[index].icon, key * (index + 1) * 100)
        )
      }
      moduleView.push(
        this.renderTextView(moduleList[index].displayName, key * (index + 1) * 1000, (index == moduleList.length - 1), moduleList[index].icon)
      )
      rowView.push(this.renderCardView(moduleView, key * (index + 1) * 10000, moduleList[index]))
    }
    return rowView
  }

  startLoginScreenWithoutLogout = () => {
    this.props.actions.startLoginScreenWithoutLogout()
  }


  render() {
    let profileView = this.renderModuleView([this.props.menu[PROFILE], this.props.menu[STATISTIC]], 1)
    let paymentView = this.renderModuleView([this.props.menu[EZETAP], this.props.menu[MSWIPE]], 2)
    let deviceView = this.renderModuleView([this.props.menu[BACKUP], this.props.menu[OFFLINEDATASTORE], this.props.menu[BLUETOOTH]], 3)
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
          {renderIf(this.props.isErrorType_403_400_Logout,
            <CustomAlert
              title="Unauthorised Device"
              message={this.props.errorMessage_403_400_Logout}
              onCancelPressed={this.startLoginScreenWithoutLogout} />
          )}

          {renderIf(this.props.isLoggingOut,<Loader />)}


          {renderIf(!this.props.isLoggingOut, <Content style={[styles.flex1, styles.bgLightGray, styles.paddingTop10, styles.paddingBottom10]}>
            {/*card 1*/}
            <View style={[styles.bgWhite, styles.marginBottom10]}>
              {profileView}
            </View>

            {/*Card 2*/}
            {/* <View style={[styles.bgWhite, paymentView.length ? styles.marginBottom10 : null]}>
              {paymentView}
            </View> */}

            {/*Card 3*/}
            <View style={[styles.bgWhite, styles.marginBottom10]}>
              {deviceView}
            </View>

            {/*Card 4*/}
            {/* <View style={[styles.bgWhite, styles.marginBottom10]}>
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
            </View> */}

            {/* only for UI Components */}
            {/* <TouchableOpacity style={[styles.bgWhite, styles.marginBottom10]} onPress={() => { this.props.actions.navigateToScene('UIViews') }}>
              <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
                <View style={[styles.justifySpaceBetween, styles.flex1]}>
                  <View style={[styles.row, styles.paddingRight10, styles.paddingTop15, styles.paddingBottom15, styles.justifySpaceBetween, styles.alignCenter]}>
                    <Text style={[styles.fontDefault]}>
                      UI
                    </Text>
                    <Icon name="ios-log-in" style={[styles.fontLg, styles.fontPrimary]} />
                  </View>
                </View>
              </View>
            </TouchableOpacity> */}

            {/*Card 5*/}
            <TouchableOpacity style={[styles.bgWhite, styles.marginBottom10]} onPress={this.showLogoutAlert}>
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
          </Content>)}
         
          {/* <Footer style={[style.footer]}>
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
          </Footer> */}
        </Container>
      </StyleProvider>

    )
  }

  showLogoutAlert = () => {
    Alert.alert(
      "Logout",
      `Are you sure you want to Logout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: this.logoutButtonPressed },
      ],
    )
  }

  logoutButtonPressed = () => {
    this.props.actions.invalidateUserSession()
  }

}

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

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
