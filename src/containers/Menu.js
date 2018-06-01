
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity, Alert, SectionList, SafeAreaView } from 'react-native'
import Loader from '../components/Loader'
import { Container, Content, Header, Button, Text, Left, Body, Right, Icon, Footer, FooterTab, StyleProvider, Toast, Separator } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import renderIf from '../lib/renderIf'
import CustomAlert from '../components/CustomAlert'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PROFILE_ID, STATISTIC_ID, OFFLINEDATASTORE_ID, BACKUP_ID, BLUETOOTH_ID } from '../lib/AttributeConstants'
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
  BluetoothListing,
  IS_LOGGING_OUT
} from '../lib/constants'
import { OK, CANCEL, LOGOUT_UNSYNCED_TRANSACTIONS_TITLE, LOGOUT_UNSYNCED_TRANSACTIONS_MESSAGE, UNTITLED, APP, LOGOUT } from '../lib/ContainerConstants'

function mapStateToProps(state) {
  return {
    isLoggingOut: state.home.isLoggingOut,
    errorMessage_403_400_Logout: state.preloader.errorMessage_403_400_Logout,
    menu: state.home.menu,
    isUnsyncTransactionOnLogout: state.home.isUnsyncTransactionOnLogout,
    subMenuList: state.home.subMenuList
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions, ...preloaderActions, ...homeActions }, dispatch)
  }
}


class Menu extends PureComponent {

  startLoginScreenWithoutLogout = () => {
    this.props.actions.startLoginScreenWithoutLogout()
  }

  getUnsyncTransactionPresentAlert() {
    if (this.props.isUnsyncTransactionOnLogout) {
      
      return Alert.alert(LOGOUT_UNSYNCED_TRANSACTIONS_TITLE, LOGOUT_UNSYNCED_TRANSACTIONS_MESSAGE,
        [{ text: CANCEL, onPress: () => this.props.actions.setState(SET_UNSYNC_TRANSACTION_PRESENT, {isUnsyncTransactionOnLogout : false, isLoggingOut : false}), style: 'cancel' },
        {
          text: OK, onPress: () => {
            this.props.actions.setState(SET_UNSYNC_TRANSACTION_PRESENT, {isUnsyncTransactionOnLogout : false, isLoggingOut : true})
            this.props.actions.invalidateUserSession(false)
          }
        },],
        { cancelable: false })
    }
  }
  
  renderMenuHeader() {
    return (
      <SafeAreaView>
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
      </SafeAreaView>
    )
  }

  getPageView(page) {
    return (
      <TouchableOpacity key={page.id} onPress={() => this.props.actions.navigateToPage(page,this.props.navigation.navigate)}>
        <View style={[styles.bgWhite, styles.borderBottomGray]}>
          <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
            <View style={[style.listIcon, styles.marginTop15, styles.justifyCenter, styles.alignCenter]}>
              <MaterialIcons name={page.icon} style={[{ color: styles.fontPrimaryColor }, styles.fontLg]} />
            </View>
            <View style={[styles.justifySpaceBetween, styles.marginLeft10, styles.flex1]}>
              <View style={[styles.row, styles.paddingRight10, styles.paddingTop15, styles.paddingBottom15, styles.justifySpaceBetween, styles.alignCenter, { borderBottomColor: '#f3f3f3' }]}>
                <Text style={[styles.fontDefault]}> {page.name} </Text>
                <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontBlack]} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderGroupHeader = ({ section }) => {
    if (section.title == UNTITLED) {
      return null
    }
    return (
      <Separator style={[styles.bgLightGray]}>
        <Text style={[styles.fontBlack]}>{section.title}</Text>
      </Separator>
    );
  }

  getPageListItemsView() {
    return (
      <SectionList
        sections={this.props.subMenuList}
        renderItem={({ item }) => this.getPageView(item)}
        renderSectionHeader={this.renderGroupHeader}
        keyExtractor={item => item.id}
      />
    )
  }

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          {this.renderMenuHeader()}
          {(!_.isEmpty(this.props.errorMessage_403_400_Logout) &&
            <CustomAlert
              title="Unauthorised Device"
              message={this.props.errorMessage_403_400_Logout}
              onCancelPressed={this.startLoginScreenWithoutLogout} />
          )}
          {this.getUnsyncTransactionPresentAlert()}
          {((this.props.isLoggingOut && _.isEmpty(this.props.errorMessage_403_400_Logout)) ?  <Loader /> : 
            <Content style={[styles.flex1, styles.bgLightGray, styles.paddingTop10, styles.paddingBottom10]}>
              {this.getPageListItemsView()}
              {this.renderLogoutView()}
            </Content>)}
        </Container>
      </StyleProvider>
    )
  }

  renderLogoutView() {
    return (
      <View>
        <Separator style={[styles.bgLightGray]}>
          <Text style={[styles.fontBlack]}>{APP}</Text>
        </Separator>
        <TouchableOpacity style={[styles.bgWhite, styles.marginBottom10]} onPress={this.showLogoutAlert}>
          <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10]}>
            <View style={[styles.justifySpaceBetween, styles.flex1]}>
              <View style={[styles.row, styles.paddingRight10, styles.paddingTop15, styles.paddingBottom15, styles.justifySpaceBetween, styles.alignCenter]}>
                <Text style={[styles.fontDefault]}> {LOGOUT} </Text>
                <Icon name="ios-log-in" style={[styles.fontLg, { color: styles.fontPrimaryColor }]} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
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
