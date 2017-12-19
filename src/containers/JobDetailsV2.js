'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
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
  StyleProvider,
  List,
  ListItem,
  Footer,
  FooterTab,
  Card,
  ActionSheet
} from 'native-base'

import * as globalActions from '../modules/global/globalActions'
import * as jobDetailsActions from '../modules/job-details/jobDetailsActions'
import Loader from '../components/Loader'
import ExpandableHeader from '../components/ExpandableHeader'
import {
  IS_MISMATCHING_LOCATION,
  DataStoreDetails,
  ImageDetailsView,
  RESET_STATE_FOR_JOBDETAIL
} from '../lib/constants'
import renderIf from '../lib/renderIf'
import CustomAlert from "../components/CustomAlert"
import {
  SELECT_NUMBER,
  CANCEL,
  SELECT_TEMPLATE,
  SELECT_NUMBER_FOR_CALL,
  CONFIRMATION,
  OK,
  CALL_CONFIRM,
  LANDMARK,
  PINCODE,
  ADDRESS_LINE_1,
  ADDRESS_LINE_2
} from '../lib/AttributeConstants'
import Communications from 'react-native-communications'
import CallIcon from '../svg_components/icons/CallIcon'
import getDirections from 'react-native-google-maps-directions'
import _ from 'lodash'

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
    statusList: state.jobDetails.statusList
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions, ...jobDetailsActions }, dispatch)
  }
}

class JobDetailsV2 extends Component {
  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  componentDidMount() {
    this.props.actions.getJobDetails(this.props.navigation.state.params.jobTransaction.id)
  }

  componentWillUnmount(){
    if(this.props.errorMessage){
      this.props.actions.setState(RESET_STATE_FOR_JOBDETAIL)
    }
  }

  navigateToDataStoreDetails = (navigationParam) => {
    this.props.actions.navigateToScene(DataStoreDetails, navigationParam)
  }
  navigateToCameraDetails = (navigationParam) => {
    this.props.actions.navigateToScene(ImageDetailsView, navigationParam)
  }
  renderStatusList(statusList) {
    let statusView = []
    for (let index in statusList) {
      statusView.push(
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
    return statusView
  }

  _onGoToNextStatus = () => {
    this.props.actions.navigateToScene('FormLayout', {
      contactData: this.props.navigation.state.params.jobSwipableDetails.contactData,
      jobTransactionId: this.props.jobTransaction.id,
      jobTransaction: this.props.jobTransaction,
      statusId: this.props.statusList.id,
      statusName: this.props.statusList.name,
      jobMasterId: this.props.jobTransaction.jobMasterId
    }
    )
    this._onCancel()
  }
  _onCancel = () => {
    this.props.actions.setState(IS_MISMATCHING_LOCATION, null)
  }

  _onCheckLocationMismatch = (statusList, jobTransaction) => {
    const FormLayoutObject = {
      contactData: this.props.navigation.state.params.jobSwipableDetails.contactData,
      jobTransaction,
      statusList
    }
    this.props.actions.checkForLocationMismatch(FormLayoutObject, this.props.currentStatus.statusCategory)
  }
  chatButtonPressed = () => {
    if (this.props.navigation.state.params.jobSwipableDetails.contactData.length == 0)
      return
    if (this.props.navigation.state.params.jobSwipableDetails.contactData.length > 1) {
      let contactData = this.props.navigation.state.params.jobSwipableDetails.contactData.slice(0)
      contactData.push(CANCEL)
      ActionSheet.show(
        {
          options: contactData,
          cancelButtonIndex: contactData.length - 1,
          title: SELECT_NUMBER
        },
        buttonIndex => {
          if (buttonIndex != contactData.length - 1 && buttonIndex >= 0) {
            this.showSmsTemplateList(this.props.navigation.state.params.jobSwipableDetails.contactData[buttonIndex])
          }
        }
      )
    }
    else {
      this.showSmsTemplateList(this.props.navigation.state.params.jobSwipableDetails.contactData[0])
    }
  }
  showSmsTemplateList = (contact) => {
    setTimeout(() => {
      if (this.props.navigation.state.params.jobSwipableDetails.smsTemplateData.length > 1) {
        let msgTitles = this.props.navigation.state.params.jobSwipableDetails.smsTemplateData.map(sms => sms.title)
        msgTitles.push(CANCEL)
        ActionSheet.show(
          {
            options: msgTitles,
            cancelButtonIndex: msgTitles.length - 1,
            title: SELECT_TEMPLATE
          },
          buttonIndex => {
            if (buttonIndex != msgTitles.length - 1 && buttonIndex >= 0) {
              this.sendMessageToContact(contact, this.props.navigation.state.params.jobSwipableDetails.smsTemplateData[buttonIndex])
            }
          }
        )
      }
      else {
        this.sendMessageToContact(contact, this.props.navigation.state.params.jobSwipableDetails.smsTemplateData[0])
      }
    }, 500)
  }

  sendMessageToContact = (contact, smsTemplate) => {
    this.props.actions.setSmsBodyAndSendMessage(contact, smsTemplate, this.props.jobTransaction, this.props.jobDataList, this.props.fieldDataList)
  }

  callButtonPressed = () => {
    if (this.props.navigation.state.params.jobSwipableDetails.contactData.length == 0)
      return
    if (this.props.navigation.state.params.jobSwipableDetails.contactData.length > 1) {
      let contactData = this.props.navigation.state.params.jobSwipableDetails.contactData.slice(0)
      contactData.push(CANCEL)
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
    let customerCareTitles = this.props.navigation.state.params.jobSwipableDetails.customerCareData.map(customerCare => customerCare.name)
    customerCareTitles.push(CANCEL)
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
        addressArray.push(Object.values(object).join())
      })
      addressArray.push(CANCEL)
      if (_.size(addressArray) > 2) {
        ActionSheet.show(
          {
            options: addressArray,
            cancelButtonIndex: addressArray.length - 1,
            title: 'Select address for navigation'
          },
          buttonIndex => {
            if (buttonIndex != addressArray.length - 1 && buttonIndex >= 0) {
              data = {
                source: {},
                destination: {},
                params: [
                  {
                    key: 'q',
                    value: addressArray[buttonIndex]
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
              value: addressArray[0]
            }
          ]
        }
        getDirections(data)
      }
    }


  }

  render() {
    if (this.props.jobDetailsLoading) {
      return (
        <Loader />
      )
    }
    else {
      const statusView = this.props.currentStatus && !this.props.errorMessage ? this.renderStatusList(this.props.currentStatus.nextStatusList) : null
      return (
        <StyleProvider style={getTheme(platform)}>
          <Container style={[styles.bgLightGray]}>
            <View>
              {renderIf(this.props.statusList,
                <CustomAlert
                  title="Details"
                  message="You are not at location. Do you want to continue?"
                  onOkPressed={this._onGoToNextStatus}
                  onCancelPressed={this._onCancel} />)}
            </View>
            <Header style={[style.header]}>
              <View style={style.seqCard}>
                <View style={[style.seqCircle,{backgroundColor: this.props.navigation.state.params.jobTransaction.identifierColor}]}>
                  <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
                    {this.props.navigation.state.params.jobTransaction.jobMasterIdentifier}
                  </Text>
                </View>
                <View style={style.seqCardDetail}>
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
                </View>
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
                </TouchableOpacity >
              </View>
            </Header>
            <Content>

              <View style={[styles.marginTop5, styles.bgWhite]}>
                {this.props.errorMessage ? <View style={StyleSheet.flatten([styles.column, { padding: 12, backgroundColor: 'white' }])}>
                  <Text style={StyleSheet.flatten([styles.bold, styles.fontCenter, styles.fontSm, styles.fontWarning])}>
                    {this.props.errorMessage}
                  </Text>
                </View> : null}

                {statusView}
              </View>

              {/*Basic Details*/}
              <View style={[styles.bgWhite, styles.marginTop10, styles.paddingTop5, styles.paddingBottom5]}>
                <ExpandableHeader
                  title={'Basic Details'}
                  dataList={this.props.jobDataList}
                />
              </View>

              {/*Payment Details*/}
              <View style={[styles.bgWhite, styles.marginTop10, styles.paddingTop5, styles.paddingBottom5]}>
                <ExpandableHeader
                  title={'Field Details'}
                  dataList={this.props.fieldDataList}
                  navigateToDataStoreDetails={this.navigateToDataStoreDetails}
                  navigateToCameraDetails={this.navigateToCameraDetails} />
              </View>
            </Content>
            <Footer style={[style.footer]}>
              {renderIf(this.props.navigation.state.params.jobSwipableDetails.contactData
                && this.props.navigation.state.params.jobSwipableDetails.contactData.length > 0
                && this.props.navigation.state.params.jobSwipableDetails.smsTemplateData
                && this.props.navigation.state.params.jobSwipableDetails.smsTemplateData.length > 0,
                <FooterTab>
                  <Button full style={[styles.bgWhite]} onPress={this.chatButtonPressed}>
                    <Icon name="md-text" style={[styles.fontLg, styles.fontBlack]} />
                  </Button>
                </FooterTab>
              )}
              
                {renderIf(this.props.navigation.state.params.jobSwipableDetails.contactData && this.props.navigation.state.params.jobSwipableDetails.contactData.length > 0,
                <FooterTab>
                  <Button full style={[styles.bgWhite]} onPress={this.callButtonPressed}>
                    <Icon name="md-call" style={[styles.fontLg, styles.fontBlack]} />
                  </Button>
                </FooterTab>
                )}

                {renderIf(!_.isEmpty(this.props.navigation.state.params.jobSwipableDetails.addressData) ||
                (this.props.navigation.state.params.jobTransaction.jobLatitude && this.props.navigation.state.params.jobTransaction.jobLongitude),
                <FooterTab>
                  <Button full onPress={this.navigationButtonPressed}>
                    <Icon name="md-map" style={[styles.fontLg, styles.fontBlack]} />
                  </Button>
                </FooterTab>)}


              {renderIf(this.props.navigation.state.params.jobSwipableDetails.customerCareData && this.props.navigation.state.params.jobSwipableDetails.customerCareData.length > 0,
                <FooterTab>
                  <Button full style={[styles.bgWhite]} onPress={this.customerCareButtonPressed}>
                    <CallIcon />
                  </Button>
                </FooterTab>)}

            </Footer>
          </Container>
        </StyleProvider>
      )
    }
  }
}


const style = StyleSheet.create({
  //  styles.column, styles.paddingLeft0, styles.paddingRight0, {height: 'auto'}
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
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: '#ffffff'
  },
  seqCircle: {
    width: 56,
    height: 56,
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
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(JobDetailsV2)
