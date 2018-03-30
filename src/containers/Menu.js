
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native'
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
  OFFLINEDATASTORE_ID,
  BACKUP_ID,
  BLUETOOTH_ID
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
  BLUETOOTH,
  OfflineDS,
  Backup,
  SET_UNSYNC_TRANSACTION_PRESENT,
  ERROR_400_403_LOGOUT_FAILURE,
  BluetoothListing
} from '../lib/constants'

import {
  OK,
  CANCEL,
  LOGOUT_UNSYNCED_TRANSACTIONS_TITLE,
  LOGOUT_UNSYNCED_TRANSACTIONS_MESSAGE,
  CONFIRM_LOGOUT,
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
  return {
    loading: state.home.loading,
    errorMessage_403_400_Logout: state.preloader.errorMessage_403_400_Logout,
    isErrorType_403_400_Logout: state.preloader.isErrorType_403_400_Logout,
    menu: state.home.menu,
    isLoggingOut: state.home.isLoggingOut,
    isUnsyncTransactionOnLogout: state.home.isUnsyncTransactionOnLogout
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
    switch (appModule.appModuleId) {
      case PROFILE_ID: {
        this.props.actions.navigateToScene(ProfileView)
        break
      }

      case STATISTIC_ID: {
        this.props.actions.navigateToScene(Statistics)
        break
      }

      case OFFLINEDATASTORE_ID: {
        this.props.actions.navigateToScene(OfflineDS, { displayName: this.props.menu.OFFLINEDATASTORE.displayName })
        break
      }

      case BACKUP_ID: {
        this.props.actions.navigateToScene(Backup, { displayName: this.props.menu.BACKUP.displayName })
        break
      }

      case BLUETOOTH_ID: {
        this.props.actions.navigateToScene(BluetoothListing, { displayName: this.props.menu.BACKUP.displayName })
        break
      }
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

  getUnsyncTransactionPresentAlert() {
    if (this.props.isUnsyncTransactionOnLogout) {
      return Alert.alert(LOGOUT_UNSYNCED_TRANSACTIONS_TITLE,
        LOGOUT_UNSYNCED_TRANSACTIONS_MESSAGE,
        [{ text: CANCEL, onPress: () => this.props.actions.setState(SET_UNSYNC_TRANSACTION_PRESENT, false), style: 'cancel' },
        {
          text: OK, onPress: () => {
            this.props.actions.setState(SET_UNSYNC_TRANSACTION_PRESENT, false)
            this.props.actions.invalidateUserSessionWhenLogoutPressed(true)
          }
        },],
        { cancelable: false })
    }
  }

  renderMenuHeader() {
    return (
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
    )
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          {this.renderMenuHeader()}
          {(this.props.isErrorType_403_400_Logout &&
            <CustomAlert
              title="Unauthorised Device"
              message={this.props.errorMessage_403_400_Logout.message}
              onCancelPressed={this.startLoginScreenWithoutLogout} />
          )}

          {renderIf(this.props.isLoggingOut, <Loader />)}

          {this.getUnsyncTransactionPresentAlert()}

          {renderIf(!this.props.isLoggingOut, <Content style={[styles.flex1, styles.bgLightGray, styles.paddingTop10, styles.paddingBottom10]}>
            <View style={[styles.bgWhite, styles.marginBottom10]}>
              {this.renderModuleView([this.props.menu[PROFILE], this.props.menu[STATISTIC]], 1)}
            </View>

            <View style={[styles.bgWhite, styles.marginBottom10]}>
              {this.renderModuleView([this.props.menu[BACKUP], this.props.menu[OFFLINEDATASTORE], this.props.menu[BLUETOOTH]], 3)}
            </View>

            {this.renderLogoutView()}
          </Content>)}
        </Container>
      </StyleProvider>

    )
  }

  renderLogoutView() {
    return (
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
    )
  }

  showLogoutAlert = () => {
    Alert.alert(
      "Logout",
      `Are you sure you want to Logout?`,
      [
        { text: CANCEL, style: 'cancel' },
        { text: OK, onPress: this.logoutButtonPressed },
      ],
    )
  }

  logoutButtonPressed = () => {
    this.props.actions.checkForUnsyncTransactionAndLogout()
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
