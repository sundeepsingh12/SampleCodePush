import React, { PureComponent } from 'react'
import { StyleSheet, View, Image, TouchableHighlight, Alert } from 'react-native'
import styles from '../themes/FeStyle'

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
  Title,
  Footer,
  FooterTab,
  ActionSheet,
  StyleProvider
} from 'native-base'
import moment from 'moment'
import renderIf from '../lib/renderIf'
import CallIcon from '../svg_components/icons/CallIcon'
import {
  SELECT_NUMBER,
  SELECT_TEMPLATE,
  SELECT_NUMBER_FOR_CALL,
  CONFIRMATION,
  CALL_CONFIRM,
} from '../lib/AttributeConstants'
import {
  OK,
  CANCEL,
} from '../lib/ContainerConstants'
import Communications from 'react-native-communications'
import getDirections from 'react-native-google-maps-directions'
import _ from 'lodash'

export default class JobListItem extends PureComponent {

  callButtonPressed = () => {
    if (this.props.data.jobSwipableDetails.contactData.length > 1) {
      let contactData = this.props.data.jobSwipableDetails.contactData.map(contacts => ({ text: contacts, icon: "md-arrow-dropright", iconColor: "#000000" }))
      contactData.push( { text: "Cancel", icon: "close", iconColor: styles.bgDanger.backgroundColor })
      ActionSheet.show(
        {
          options: contactData,
          cancelButtonIndex: contactData.length - 1,
          title: SELECT_NUMBER_FOR_CALL
        },
        buttonIndex => {
          if (buttonIndex != contactData.length - 1 && buttonIndex >= 0) {
            this.callContact(this.props.data.jobSwipableDetails.contactData[buttonIndex])
          }
        }
      )
    }
    else {
      Alert.alert(CONFIRMATION + this.props.data.jobSwipableDetails.contactData[0], CALL_CONFIRM,
        [{ text: CANCEL, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: OK, onPress: () => this.callContact(this.props.data.jobSwipableDetails.contactData[0]) },],
        { cancelable: false })
    }
  }
  callContact = (contact) => {
    Communications.phonecall(contact, false)
  }
  customerCareButtonPressed = () => {
    let customerCareTitles = this.props.data.jobSwipableDetails.customerCareData.map(customerCare => ({ text: customerCare.name, icon: "md-arrow-dropright", iconColor: "#000000" }))
    customerCareTitles.push( { text: "Cancel", icon: "close", iconColor: styles.bgDanger.backgroundColor })
    ActionSheet.show(
      {
        options: customerCareTitles,
        cancelButtonIndex: customerCareTitles.length - 1,
        title: SELECT_NUMBER_FOR_CALL
      },
      buttonIndex => {
        if (buttonIndex != customerCareTitles.length - 1 && buttonIndex >= 0) {
          this.callContact(this.props.data.jobSwipableDetails.customerCareData[buttonIndex].mobileNumber)
        }
      }
    )
  }

  navigationButtonPressed = () => {
    const addressDatas = this.props.data.jobSwipableDetails.addressData
    const latitude = this.props.data.jobLatitude
    const longitude = this.props.data.jobLongitude
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
      addressArray.push( { text: "Cancel", icon: "close", iconColor: styles.bgDanger.backgroundColor })
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

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPressItem}
        onLongPress={this.props.onLongPressItem}
        underlayColor={'#eee'} {...this.props.sortHandlers}>
        <View style={[style.seqCard, this.props.data.isChecked ? { backgroundColor: '#d3d3d3' } : { backgroundColor: '#ffffff' }]}>
        {this.props.lastId != null ? <View style={{position: 'absolute', width: 3, backgroundColor: '#d9d9d9', height: (this.props.lastId != this.props.data.id) ? '100%' : '50%',top:0, left: 36, zIndex: 1}}></View> : null}
          <View style={[style.seqCircle, styles.relative, { backgroundColor: this.props.data.identifierColor, zIndex: 3 }]}>
            <Text style={[styles.fontWhite, styles.fontCenter, styles.fontLg]}>
              {this.props.data.jobMasterIdentifier}
            </Text>
            {this.props.data.isChecked ? <View style={[styles.absolute, styles.bgSuccess, styles.justifyCenter, styles.alignCenter, style.selectedItemCircle]}>
              <Icon name="ios-checkmark" style={[styles.bgTransparent, styles.fontWhite]} />
            </View> : null}

          </View>
          <View style={style.seqCardDetail}>

            {this.renderJobListItemDetails()}

            {this.props.callingActivity == 'Sequence' ? <View
              style={{
                width: 30,
                alignSelf: 'center',
                flexBasis: '10%'
              }} >
              <Icon
                name="ios-menu"
                style={[
                  styles.fontXl, {
                    color: '#c9c9c9'
                  }
                ]} />
            </View> : <View />}


          </View>

          {/* {this.props.jobEndTime ?
            <Text style={[styles.bgWarning, styles.flexBasis50,styles.fontWhite]}>
              {
                (moment(this.props.jobEndTime, "HH:mm:ss")).hours() + ' hours ' +
                (moment(this.props.jobEndTime, "HH:mm:ss")).minutes() + ' minutes' +
                (moment(this.props.jobEndTime, "HH:mm:ss")).seconds() + ' seconds left'

              }
            </Text> : <View />} */}
        </View>
      </TouchableHighlight>
    )
  }

  /**
   * 
   * @param {*} data 
   * this method is use in case previous sequence(i.e seqActual) is different from new sequence(i.e seqSelected)
   */
  previousAndCurrentSequenceView(data) {
    if (_.includes(data.line1, 'Sequence') || _.includes(data.line2, 'Sequence') || _.includes(data.circleLine1, 'Sequence') || _.includes(data.circleLine2, 'Sequence')) {
      if (data.seqActual && data.seqActual < data.seqSelected) {
        return (
          <View style={[styles.row]}>
            <Icon name="md-arrow-dropdown" style={[styles.fontXl, styles.fontDanger, styles.marginTop5, styles.marginBottom5, styles.marginLeft5]} />
            <Text style={[styles.fontDefault, styles.fontDanger, styles.italic, styles.margin5]}>
              was {data.seqActual}
            </Text>
          </View>
        )
      }
      else if (data.seqActual && data.seqActual > data.seqSelected) {
        return (
          <View style={[styles.row]}>
            <Icon name="md-arrow-dropup" style={[styles.fontXl, styles.fontSuccess, styles.marginTop5, styles.marginBottom5, styles.marginLeft5]} />
            <Text style={[styles.fontDefault, styles.italic, styles.fontSuccess, styles.margin5]}>
              was {data.seqActual}
            </Text>
          </View>
        )
      }
    }
  }

  /**This function shows Line1,Line2,Circle Line1,Circle Line 2
   * 
   */
  renderJobListItemDetails() {
    let previousAndCurrentSequenceView = this.previousAndCurrentSequenceView(this.props.data)
    return (
      <View style={[styles.flexBasis90]}>
        <View>
          {this.props.data.line1 ?
            <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25]}>
              {this.props.data.line1}
            </Text>
            : null
          }
          {this.props.data.line2 ?
            <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
              {this.props.data.line2}
            </Text>
            : null
          }
          {this.props.data.circleLine1 || this.props.data.circleLine2 ?
            <Text
              style={[styles.fontSm, styles.italic, styles.fontWeight300, styles.lineHeight20]}>
              {this.props.data.circleLine1} . {this.props.data.circleLine2}
            </Text>
            : null
          }
          {previousAndCurrentSequenceView}
        </View>
        {this.props.jobEndTime ?
          <View style={[styles.marginTop10, styles.bgBlack, styles.bgWarning, styles.padding5, { borderRadius: 5 }]}>
            <Text style={[styles.fontWhite, styles.fontDefault, styles.fontCenter]}>
              {(moment(this.props.jobEndTime, "HH:mm:ss")).hours() + ' hours ' +
                (moment(this.props.jobEndTime, "HH:mm:ss")).minutes() + ' minutes ' +
                (moment(this.props.jobEndTime, "HH:mm:ss")).seconds() + ' seconds left'}
            </Text>
          </View> : null}

        {/* action buttons section */}
        <View style={[styles.row, {marginLeft: -10}]}>

          {renderIf(this.props.data.jobSwipableDetails.contactData && this.props.data.jobSwipableDetails.contactData.length > 0 && this.props.showIconsInJobListing,
            <Button transparent onPress={this.callButtonPressed}>
              <Icon name="md-call" style={[styles.fontLg, styles.fontBlack]} />
            </Button>
          )}

          {renderIf((!_.isEmpty(this.props.data.jobSwipableDetails.addressData) ||
            (this.props.data.jobLatitude && this.props.data.jobLongitude)) && this.props.showIconsInJobListing,
            <Button transparent onPress={this.navigationButtonPressed}>
              <Icon name="md-map" style={[styles.fontLg, styles.fontBlack]} />
            </Button>)}


          {renderIf(this.props.data.jobSwipableDetails.customerCareData && this.props.data.jobSwipableDetails.customerCareData.length > 0 && this.props.showIconsInJobListing,
            <Button transparent onPress={this.customerCareButtonPressed}>
              <CallIcon />
            </Button>)}
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  headerIcon: {
    fontSize: 18
  },
  seqCard: {
    minHeight: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10
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
    borderBottomColor: '#e4e4e4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  selectedItemCircle: {
    width: 24,
    bottom: 0,
    right: 0,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff'
  }

})