'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import {
  OK,
  REVERT_NOT_ALLOWED_AFTER_COLLECTING_AMOUNT,
  REVERT_STATUS_TO,
  REVERT_NOT_ALLOWED_INCASE_OF_SYNCING,
  PRESS_OK_TO_CONFIRM_REVERT_TO,
  CANCEL,
  CONFIRM_REVERT,
  UPDATE_GROUP,
  JOB_EXPIRED,
  DETAILS,
  SELECT_NUMBER,
  SELECT_TEMPLATE,
  SELECT_NUMBER_FOR_CALL,
  CONFIRMATION,
  CALL_CONFIRM,
  YOU_ARE_NOT_AT_LOCATION_WANT_TO_CONTINUE,
  SELECT_ADDRESS_NAVIGATION,
  REVERT_STATUS,
  MORE,
  PAYMENT_SUCCESSFUL,
  TRANSACTION_SUCCESSFUL
} from '../lib/ContainerConstants'

import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity, Alert, Image } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Container, Content, Header, Button, Text, Right, Icon, StyleProvider, ListItem, Footer, FooterTab, ActionSheet, Toast } from 'native-base'
import * as globalActions from '../modules/global/globalActions'
import * as jobDetailsActions from '../modules/job-details/jobDetailsActions'
import Loader from '../components/Loader'
import ExpandableHeader from '../components/ExpandableHeader'
import {
  IS_MISMATCHING_LOCATION,
  DataStoreDetails,
  ImageDetailsView,
  RESET_STATE_FOR_JOBDETAIL,
  SHOW_DROPDOWN,
  SET_JOBDETAILS_DRAFT_INFO,
  SET_LOADER_FOR_SYNC_IN_JOBDETAIL,
  SET_CHECK_TRANSACTION_STATUS,
  JOB_DETAILS_FETCHING_START,
  RESET_CHECK_TRANSACTION_AND_DRAFT
} from '../lib/constants'
import renderIf from '../lib/renderIf'
import CustomAlert from "../components/CustomAlert"
import Communications from 'react-native-communications'
import getDirections from 'react-native-google-maps-directions'
import _ from 'lodash'
import EtaCountDownTimer from '../components/EtaCountDownTimer'
import moment from 'moment'
import { restoreDraftAndNavigateToFormLayout } from '../modules/form-layout/formLayoutActions'
import { startSyncAndNavigateToContainer } from '../modules/home/homeActions'
import DraftModal from '../components/DraftModal'
import Line1Line2View from '../components/Line1Line2View'
import SyncLoader from '../components/SyncLoader'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { navigate } from '../modules/navigators/NavigationService';
import MessageButtonItem from '../components/MessageButtonItem'

function mapStateToProps(state) {
  return {
    addressList: state.jobDetails.addressList,
    customerCareList: state.jobDetails.customerCareList,
    currentStatus: state.jobDetails.currentStatus,
    fieldDataList: state.jobDetails.fieldDataList,
    jobDetailsLoading: state.jobDetails.jobDetailsLoading,
    jobDataList: state.jobDetails.jobDataList,
    jobTransaction: state.jobDetails.jobTransaction,
    messageList: state.jobDetails.messageList,
    smsTemplateList: state.jobDetails.smsTemplateList,
    errorMessage: state.jobDetails.errorMessage,
    statusList: state.jobDetails.statusList,
    statusRevertList: state.jobDetails.statusRevertList,
    draftStatusInfo: state.jobDetails.draftStatusInfo,
    isEtaTimerShow: state.jobDetails.isEtaTimerShow,
    isShowDropdown: state.jobDetails.isShowDropdown,
    jobExpiryTime: state.jobDetails.jobExpiryTime,
    syncLoading: state.jobDetails.syncLoading,
    checkTransactionStatus: state.jobDetails.checkTransactionStatus
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions, ...jobDetailsActions, restoreDraftAndNavigateToFormLayout, startSyncAndNavigateToContainer }, dispatch)
  }
}

class JobDetailsV2 extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  componentDidMount() {
    this.props.actions.getJobDetails(this.props.navigation.state.params, this.props.navigation.state.key)
  }

  componentWillUnmount() {
    if (this.props.errorMessage || !_.isEmpty(this.props.draftStatusInfo)) {
      this.props.actions.setState(RESET_STATE_FOR_JOBDETAIL)
    }
    // reset dropdown state only when required
    if (this.props.checkTransactionStatus) {
      this.props.actions.setState(SET_CHECK_TRANSACTION_STATUS, null)
    }
    if (this.props.isShowDropdown) {
      this.props.actions.setState(SHOW_DROPDOWN, null)
    }
  }

  navigateToDataStoreDetails = (navigationParam) => {
    navigate(DataStoreDetails, navigationParam)
  }
  
  navigateToCameraDetails = (navigationParam) => {
    navigate(ImageDetailsView, navigationParam)
  }

  statusDataItem(statusList, index, minIndexDropDown) {
    if ((index < minIndexDropDown) || (this.props.isShowDropdown)) {
      return (
        <ListItem
          key={statusList[index].id}
          style={[style.jobListItem, styles.justifySpaceBetween]}
          onPress={() => this._onCheckLocationMismatch(statusList[index], this.props.jobTransaction)}
        >
          <View style={[styles.row, styles.alignCenter]}>
            <View style={[style.statusCircle, { backgroundColor: statusList[index].buttonColor }]}></View>
            <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>{statusList[index].name}</Text>
          </View>
          <Right>
            <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontLightGray]} />
          </Right>
        </ListItem>
      )
    }
  }
  renderStatusForGroup(groupId) {
    return (
      <TouchableOpacity style={[styles.marginTop5, styles.bgWhite, styles.paddingBottom15]} onPress={() => this.updateTransactionForGroupId(groupId)} key={groupId}>
        <View style={[styles.marginLeft15, styles.marginRight15, styles.marginTop15]}>
          <View style={[styles.row, styles.alignCenter]}>
            <View style={[styles.marginTop12]}>
              <MaterialIcons name='playlist-play' style={[styles.fontXxl]} color={styles.fontBlack.color} />
            </View>
            <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]} >{UPDATE_GROUP}</Text>
            <Right>
              <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontLightGray]} />
            </Right>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderDropDownStatus(length, minIndexDropDown) {
    return (
      <ListItem
        key={1}
        style={[style.jobListItem, styles.justifySpaceBetween]}
        onPress={() => { this.props.actions.setState(SHOW_DROPDOWN, !this.props.isShowDropdown) }}
      >
        <View style={[styles.row, styles.alignCenter]}>
          <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft20]}>{length - minIndexDropDown} {MORE}</Text>
          <Icon name={!this.props.isShowDropdown ? 'ios-arrow-down' : 'ios-arrow-up'} style={[styles.fontLg, styles.fontLightGray, styles.marginLeft15]} />
        </View>
      </ListItem>
    )
  }

  renderStatusList(statusList) {
    let statusView = []
    if (this.props.jobTransaction.id < 0 && this.props.jobTransaction.jobId < 0 && this.props.jobDataList.length < 1) {//In case of new job which is not synced with server do not show status button
      return statusView
    }
    let groupId = this.props.navigation.state.params.groupId ? this.props.navigation.state.params.groupId : null
    if (groupId && statusList.length > 0) {
      statusView.push(
        this.renderStatusForGroup(groupId)
      )
      return statusView
    }
    let minIndexDropDown = (this.props.statusRevertList && this.props.statusRevertList.length > 0) ? 3 : 4
    for (let index in statusList) {
      statusView.push(
        this.statusDataItem(statusList, index, minIndexDropDown)
      )
      if (index == minIndexDropDown - 1 && statusList.length > minIndexDropDown) {
        statusView.push(
          this.renderDropDownStatus(statusList.length, minIndexDropDown)
        )
      }
    }
    return statusView
  }

  _onGoToNextStatus = () => {
    this.props.actions.checkForInternetAndStartSyncAndNavigateToFormLayout({
      contactData: this.props.navigation.state.params.jobSwipableDetails.contactData,
      jobTransactionId: this.props.jobTransaction.id,
      jobTransaction: this.props.jobTransaction,
      statusId: this.props.statusList.id,
      statusName: this.props.statusList.name,
      jobMasterId: this.props.jobTransaction.jobMasterId,
      pageObjectAdditionalParams: this.props.navigation.state.params.pageObjectAdditionalParams,
      jobDetailsScreenKey: this.props.navigation.state.key
    })
    this._onCancel()
  }

  _onCancel = () => {
    this.props.actions.setState(IS_MISMATCHING_LOCATION, null)
  }

  _onCheckLocationMismatch = (statusList, jobTransaction) => {
    if ((this.props.jobExpiryTime != null) && moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isAfter(this.props.jobExpiryTime)) {
      Alert.alert(
        DETAILS,
        JOB_EXPIRED,
        [
          { text: OK, style: CANCEL },
        ],
      )
    }
    else {
      const FormLayoutObject = {
        contactData: this.props.navigation.state.params.jobSwipableDetails.contactData,
        jobTransaction,
        statusList,
        pageObjectAdditionalParams: this.props.navigation.state.params.pageObjectAdditionalParams,
        jobDetailsScreenKey: this.props.navigation.state.key
      }
      this.props.actions.checkForLocationMismatch(FormLayoutObject, this.props.currentStatus.statusCategory)
    }
  }

  sendMessageToContact = (contact, smsTemplate) => {
    this.props.actions.setSmsBodyAndSendMessage(contact, smsTemplate, this.props.jobTransaction, this.props.jobDataList, this.props.fieldDataList)
  }

  callButtonPressed = () => {
    if (this.props.navigation.state.params.jobSwipableDetails.contactData.length == 0)
      return
    if (this.props.navigation.state.params.jobSwipableDetails.contactData.length > 1) {
      let contactData = this.props.navigation.state.params.jobSwipableDetails.contactData.map(contacts => ({ text: contacts, icon: "md-arrow-dropright", iconColor: "#000000" }))
      contactData.push({ text: "Cancel", icon: "close", iconColor: styles.bgDanger.backgroundColor })
      ActionSheet.show(
        {
          options: contactData,
          cancelButtonIndex: contactData.length - 1,
          title: SELECT_NUMBER_FOR_CALL
        },
        buttonIndex => {
          if (buttonIndex != contactData.length - 1 && buttonIndex >= 0) {
            this.callContact(this.props.navigation.state.params.jobSwipableDetails.contactData[buttonIndex])
          }
        }
      )
    }
    else {
      Alert.alert(CONFIRMATION + this.props.navigation.state.params.jobSwipableDetails.contactData[0], CALL_CONFIRM,
        [{ text: CANCEL, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: OK, onPress: () => this.callContact(this.props.navigation.state.params.jobSwipableDetails.contactData[0]) },],
        { cancelable: false })
    }
  }

  callContact = (contact) => {
    Communications.phonecall(contact, false)
  }

  customerCareButtonPressed = () => {
    let customerCareTitles = this.props.navigation.state.params.jobSwipableDetails.customerCareData.map(customerCare => ({ text: customerCare.name, icon: "md-arrow-dropright", iconColor: "#000000" }))
    customerCareTitles.push({ text: "Cancel", icon: "close", iconColor: styles.bgDanger.backgroundColor })
    ActionSheet.show(
      {
        options: customerCareTitles,
        cancelButtonIndex: customerCareTitles.length - 1,
        title: SELECT_NUMBER_FOR_CALL
      },
      buttonIndex => {
        if (buttonIndex != customerCareTitles.length - 1 && buttonIndex >= 0) {
          this.callContact(this.props.navigation.state.params.jobSwipableDetails.customerCareData[buttonIndex].mobileNumber)
        }
      }
    )
  }

  navigationButtonPressed = () => {
    const addressDatas = this.props.navigation.state.params.jobSwipableDetails.addressData
    const latitude = this.props.navigation.state.params.jobTransaction.jobLatitude
    const longitude = this.props.navigation.state.params.jobTransaction.jobLongitude
    let data

    if (latitude && longitude) {
      data = {
        source: {},
        destination: {
          latitude,
          longitude
        },
      }
      getDirections(data)
    }
    else {
      let addressArray = []
      Object.values(addressDatas).forEach(object => {
        addressArray.push({ text: Object.values(object).join(), icon: "md-arrow-dropright", iconColor: "#000000" })
      })
      addressArray.push({ text: "Cancel", icon: "close", iconColor: styles.bgDanger.backgroundColor })
      if (_.size(addressArray) > 2) {
        ActionSheet.show(
          {
            options: addressArray,
            cancelButtonIndex: addressArray.length - 1,
            title: SELECT_ADDRESS_NAVIGATION
          },
          buttonIndex => {
            if (buttonIndex != addressArray.length - 1 && buttonIndex >= 0) {
              data = {
                source: {},
                destination: {},
                params: [
                  {
                    key: 'q',
                    value: addressArray[buttonIndex].text
                  }
                ]
              }
              getDirections(data)
            }
          }
        )
      } else {
        data = {
          source: {},
          destination: {},
          params: [
            {
              key: 'q',
              value: addressArray[0].text
            }
          ]
        }
        getDirections(data)
      }
    }
  }

  alertForStatusRevert(statusData) {
    Alert.alert(
      CONFIRM_REVERT,
      PRESS_OK_TO_CONFIRM_REVERT_TO + statusData[1],
      [
        { text: CANCEL, style: CANCEL },
        { text: OK, onPress: () => this._onGoToPreviousStatus(statusData) }
      ],
    )
  }

  updateTransactionForGroupId(groupId) {
    this.props.actions.startSyncAndNavigateToContainer({
      jobMasterIds: JSON.stringify([this.props.jobTransaction.jobMasterId]),
      additionalParams: JSON.stringify({ statusId: this.props.currentStatus.id }),
      groupId: groupId
    }, true, SET_LOADER_FOR_SYNC_IN_JOBDETAIL, this.props.navigation)
  }

  selectStatusToRevert = () => {
    if (this.props.statusRevertList[0] == 1) {
      { Toast.show({ text: REVERT_NOT_ALLOWED_INCASE_OF_SYNCING, position: 'bottom', buttonText: OK, type: 'danger', duration: 5000 }) }
    }
    else if (this.props.jobTransaction.actualAmount && this.props.jobTransaction.actualAmount != 0.0 && this.props.jobTransaction.moneyTransactionType) {
      { Toast.show({ text: REVERT_NOT_ALLOWED_AFTER_COLLECTING_AMOUNT, position: 'bottom', buttonText: OK, type: 'danger', duration: 5000 }) }
    }
    else {
      this.props.statusRevertList.length == 1 ? this.alertForStatusRevert(this.props.statusRevertList[0]) : this.statusRevertSelection(this.props.statusRevertList)
    }
  }

  _onGoToPreviousStatus = (statusData) => {
    this.props.actions.setAllDataOnRevert(this.props.jobTransaction, statusData, this.props.navigation.state.params.pageObjectAdditionalParams)
  }

  statusRevertSelection(statusList) {
    let BUTTONS = statusList.map(list => list[1])
    BUTTONS.push(CANCEL)
    ActionSheet.show(
      {
        options: BUTTONS,
        title: REVERT_STATUS_TO,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 1
      },
      buttonIndex => {
        (buttonIndex > -1 && buttonIndex < (BUTTONS.length - 1)) ? this.alertForStatusRevert(statusList[buttonIndex]) : null
      }
    )
  }
 
  showDraftAlert() {
    return <DraftModal draftStatusInfo={this.props.draftStatusInfo} onOkPress={() => this._goToFormLayoutWithDraft()} onCancelPress={() => this.props.actions.setState(SET_JOBDETAILS_DRAFT_INFO, {})} onRequestClose={() => this.props.actions.setState(SET_JOBDETAILS_DRAFT_INFO, {})} />
  }

  showLocationMisMatchAlert() {
    return (
      <CustomAlert
        title={DETAILS}
        message={YOU_ARE_NOT_AT_LOCATION_WANT_TO_CONTINUE}
        onOkPressed={this._onGoToNextStatus}
        onCancelPressed={this._onCancel} />
    )
  }

  showJobMasterIdentifier() {
    return (
      <View style={[style.seqCircle, { backgroundColor: this.props.navigation.state.params.jobTransaction.identifierColor }]}>
        <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
          {this.props.navigation.state.params.jobTransaction.jobMasterIdentifier}
        </Text>
      </View>
    )
  }
  showTransactionView() {
    return (
      <View>
        <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25]}>
          {this.props.navigation.state.params.jobTransaction.line1}
        </Text>
        <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
          {this.props.navigation.state.params.jobTransaction.line2}
        </Text>
        <Text
          style={[styles.fontSm, styles.italic, styles.fontWeight300, styles.lineHeight20]}>
          {this.props.navigation.state.params.jobTransaction.circleLine1}
        </Text>
      </View>
    )
  }

  showHeaderView() {
    return (
      <SafeAreaView style={[style.header]}>
        <Header style={[style.header]}>
          <View style={style.seqCard}>
            {this.showJobMasterIdentifier()}
            <Line1Line2View data={this.props.navigation.state.params.jobTransaction} />
            {this.showCloseIcon()}
          </View>
        </Header>
      </SafeAreaView>
    )
  }

  showCloseIcon() {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} >
        <View
          style={{
            width: 40,
            alignSelf: 'flex-start',
            alignItems: 'center',
            paddingTop: 10,
            flex: 1
          }}>
          <Icon
            name="md-close"
            style={[styles.fontXl, styles.fontBlack, styles.fontXxl]} />
        </View>
      </TouchableOpacity>
    )
  }

  showRevertView() {
    return (
      <TouchableOpacity style={[styles.marginTop5, styles.bgWhite, styles.paddingBottom15]} onPress={this.selectStatusToRevert}>
        <View style={[styles.marginLeft15, styles.marginRight15, styles.marginTop15]}>
          <View style={[styles.row, styles.alignCenter]}>
            <View>
              <MaterialIcons name='rotate-left' style={[styles.fontXxl]} color={styles.fontBlack.color} />
            </View>
            <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]} >{REVERT_STATUS}</Text>
            <Right>
              <Icon name="ios-arrow-forward" style={[styles.fontLg, styles.fontLightGray]} />
            </Right>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  showContentView() {
    const statusView = this.props.currentStatus && !this.props.errorMessage ? this.renderStatusList(this.props.currentStatus.nextStatusList) : null
    const etaTimer = this.etaUpdateTimer()
    return (
      <Content>
        {!this.props.errorMessage && this.props.statusRevertList && this.props.statusRevertList.length > 0 ?
          this.showRevertView() : null}

        <View style={[styles.marginTop5, styles.bgWhite]}>
          {this.props.errorMessage ? <View style={StyleSheet.flatten([styles.column, { padding: 12, backgroundColor: 'white' }])}>
            <Text style={StyleSheet.flatten([styles.bold, styles.fontCenter, styles.fontSm, styles.fontWarning])}>
              {this.props.errorMessage}
            </Text>
          </View> : null}
          {etaTimer}
          {statusView}
        </View>
        {this.showMessages()}
        {/*Basic Details*/}
        {this.showJobDetails()}

        {/*Field Details*/}
        {this.showFieldDetails()}
      </Content>
    )
  }
  showMessages() {
    if (!_.isEmpty(this.props.messageList)) {
      return (
        <View style={[styles.bgWhite, styles.marginTop10, styles.paddingTop5, styles.paddingBottom5]}>
          <ExpandableHeader
            title={'Messages'}
            dataList={this.props.messageList}
          />
        </View>
      )
    }
  }
  showJobDetails() {
    return (
      <View style={[styles.bgWhite, styles.marginTop10, styles.paddingTop5, styles.paddingBottom5]}>
        <ExpandableHeader
          title={'Basic Details'}
          navigateToDataStoreDetails={this.navigateToDataStoreDetails}
          dataList={this.props.jobDataList}
          showDetailsList={true}
        />
      </View>
    )
  }
  showPaymentSuccessfulScreen() {
    return (
      <Content>
        <View style={[styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
          <Image
            style={style.imageSync}
            source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
          />
          <Text style={[styles.fontLg, styles.fontBlack, styles.marginTop30]}>
            {PAYMENT_SUCCESSFUL}
          </Text>
        </View>
      </Content>
    )
  }

  showFieldDetails() {
    return (
      <View style={[styles.bgWhite, styles.marginTop10, styles.paddingTop5, styles.paddingBottom5]}>
        <ExpandableHeader
          title={'Field Details'}
          dataList={this.props.fieldDataList}
          navigateToDataStoreDetails={this.navigateToDataStoreDetails}
          navigateToCameraDetails={this.navigateToCameraDetails}
          showDetailsList={true} />
      </View>
    )
  }

  showFooterView() {
    return (
      <SafeAreaView style={[styles.bgWhite]}>
        <Footer style={[style.footer]}>
          {renderIf(this.props.navigation.state.params.jobSwipableDetails.contactData && this.props.navigation.state.params.jobSwipableDetails.contactData.length > 0 && this.props.navigation.state.params.jobSwipableDetails.smsTemplateData && this.props.navigation.state.params.jobSwipableDetails.smsTemplateData.length > 0,
            <FooterTab>
            <MessageButtonItem sendMessageToContact = {this.sendMessageToContact} jobSwipableDetails = {this.props.navigation.state.params.jobSwipableDetails}/>
            </FooterTab>
          )}
          {renderIf(this.props.navigation.state.params.jobSwipableDetails.contactData && this.props.navigation.state.params.jobSwipableDetails.contactData.length > 0,
            <FooterTab>
              <Button full style={[styles.bgWhite]} onPress={this.callButtonPressed}>
                <Icon name="md-call" style={[styles.fontLg, styles.fontBlack]} />
              </Button>
            </FooterTab>
          )}
          {renderIf(!_.isEmpty(this.props.navigation.state.params.jobSwipableDetails.addressData) || (this.props.navigation.state.params.jobTransaction.jobLatitude && this.props.navigation.state.params.jobTransaction.jobLongitude),
            <FooterTab>
              <Button full onPress={this.navigationButtonPressed}>
                <Icon name="md-map" style={[styles.fontLg, styles.fontBlack]} />
              </Button>
            </FooterTab>)}
          {renderIf(this.props.navigation.state.params.jobSwipableDetails.customerCareData && this.props.navigation.state.params.jobSwipableDetails.customerCareData.length > 0,
            <FooterTab>
              <Button full style={[styles.bgWhite]} onPress={this.customerCareButtonPressed}>
                <SimpleLineIcons name="call-out" style={[styles.fontLg, styles.fontBlack]} />
              </Button>
            </FooterTab>)}
        </Footer>
      </SafeAreaView>
    )
  }

  etaUpdateTimer() {
    if (this.props.jobTransaction && this.props.jobTransaction.jobEtaTime && this.props.jobTransaction.startTime && this.props.isEtaTimerShow) {
      let etaStartTime = ((moment().format('YYYY-MM-DD ')).concat(this.props.jobTransaction.startTime)).concat(":00")
      if (moment(this.props.jobTransaction.jobEtaTime).format('HH:mm') != this.props.jobTransaction.endTime) {
        etaStartTime = moment((moment(etaStartTime).unix() + moment(this.props.jobTransaction.jobEtaTime).unix() - moment(((moment().format('YYYY-MM-DD ')).concat(this.props.jobTransaction.endTime)).concat(":00")).unix()) * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
      return <EtaCountDownTimer endTime={this.props.jobTransaction.jobEtaTime} startTime={etaStartTime} />
    }
    return null
  }

  showPaymentFailedScreen() {
    const { draftStatusInfo, jobTransaction } = this.props
    const { params, key } = this.props.navigation.state
    return (
      <Content>
        <View style={[styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
          <View style={[styles.padding30]}>
            <Image
              style={style.imageSync}
              source={require('../../images/fareye-default-iconset/checkTransactionError.png')}
            />
          </View>
          <Text style={[styles.fontLg, styles.fontBlack, { marginTop: 27 }]}>
            {this.props.checkTransactionStatus}
          </Text>
          <View>
            <Button bordered style={[{ borderColor: '#EAEAEA', backgroundColor: '#007AFF', borderWidth: 1 }, { height: 50, width: 200 }, styles.alignCenter, styles.justifyCenter, { marginTop: 183 }]}
              onPress={() => { this.props.actions.checkForPaymentAtEnd(draftStatusInfo, jobTransaction, params, key, SET_CHECK_TRANSACTION_STATUS, JOB_DETAILS_FETCHING_START) }}
              onLongPress={() => { this._goToFormLayoutWithoutDraft() }} >
              <Text style={[{ color: '#FFFFFF', lineHeight: 19 }, styles.fontWeight500, styles.fontRegular]}> {'Check Transaction'}</Text>
            </Button>
          </View>
        </View>
      </Content>
    )
  }

  _goToFormLayoutWithoutDraft = () => {
    this.props.actions.deleteDraftAndNavigateToFormLayout({
      contactData: this.props.navigation.state.params.jobSwipableDetails.contactData,
      jobTransactionId: this.props.jobTransaction.id,
      jobTransaction: this.props.jobTransaction,
      statusId: this.props.draftStatusInfo.statusId,
      statusName: this.props.draftStatusInfo.statusName,
      jobMasterId: this.props.jobTransaction.jobMasterId,
      pageObjectAdditionalParams: this.props.navigation.state.params.pageObjectAdditionalParams,
      jobDetailsScreenKey: this.props.navigation.state.key
    })
    this.props.actions.setState(RESET_CHECK_TRANSACTION_AND_DRAFT)
  }

  _goToFormLayoutWithDraft = () => {
    this.props.actions.restoreDraftAndNavigateToFormLayout(
      this.props.navigation.state.params.jobSwipableDetails.contactData,
      this.props.jobTransaction,
      this.props.draftStatusInfo,
      null,
      this.props.navigation.state.params.pageObjectAdditionalParams,
      this.props.navigation.state.key
    )
    this.props.actions.setState(SET_JOBDETAILS_DRAFT_INFO, {})
  }

  renderView(checkTransactionStatus) {
    switch (checkTransactionStatus) {
      case null: {
        return this.detailsContainerView()
      }
      case TRANSACTION_SUCCESSFUL: {
        return this.showPaymentSuccessfulScreen()
      }
      default: {
        return this.showPaymentFailedScreen()
      }
    }
  }

  detailsContainerView() {
    const draftAlert = (!_.isEmpty(this.props.draftStatusInfo) && this.props.isShowDropdown == null && this.props.checkTransactionStatus == null && !this.props.syncLoading && !this.props.statusList && !this.props.errorMessage) ? this.showDraftAlert() : null
    const mismatchAlert = this.props.statusList ? this.showLocationMisMatchAlert() : null
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container style={[styles.bgLightGray]}>
          {(this.props.syncLoading) ? <SyncLoader moduleLoading={this.props.syncLoading} /> : null}
          {draftAlert}
          {mismatchAlert}
          {this.showHeaderView()}
          {this.showContentView()}
          {this.showFooterView()}
        </Container>
      </StyleProvider>
    )
  }

  render() {
    if (this.props.jobDetailsLoading) {
      return <Loader />
    }
    return this.renderView(this.props.checkTransactionStatus)
  }
}

const style = StyleSheet.create({
  header: {
    flexDirection: 'column',
    paddingLeft: 0,
    paddingRight: 0,
    height: 'auto',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
    backgroundColor: '#ffffff'
  },
  headerIcon: {
    fontSize: 18
  },
  seqCard: {
    minHeight: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
    backgroundColor: '#ffffff'
  },
  seqCircle: {
    width: 56,
    height: 56,
    marginTop: 12,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  seqCardDetail: {
    flex: 1,
    minHeight: 70,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  jobListItem: {
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5
  },

  footer: {
    height: 'auto',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3',
  },
  imageSync: {
    paddingTop: 30,
    width: 116,
    height: 116,
    resizeMode: 'contain'
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(JobDetailsV2)
