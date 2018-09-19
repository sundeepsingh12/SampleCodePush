'use strict'

import React, { PureComponent } from 'react'
import {
    Alert,
    StyleSheet,
    View
} from 'react-native'
import styles from '../themes/FeStyle'
import { Button, Icon, Footer, FooterTab, ActionSheet } from 'native-base'
import Communications from 'react-native-communications'
import getDirections from 'react-native-google-maps-directions'
import {
    OK,
    CANCEL,
    SELECT_NUMBER_FOR_CALL,
    CONFIRMATION,
    CALL_CONFIRM,
    SELECT_ADDRESS_NAVIGATION,
} from '../lib/ContainerConstants'
import MessageButtonItem from './MessageButtonItem'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import _ from 'lodash'



class MessagingCallingSmsButtonView extends PureComponent {


    renderIcon(iconName, action) {
        if (this.props.isCalledFrom == 'JobDetailsV2') {
            return (
                <FooterTab>{this.renderButton(iconName, action)}</FooterTab>
            )
        }
        return (
            this.renderButton(iconName, action)
        )
    }

    renderButton(iconName, action) {
        return (
            <Button transparent full onPress={() => action(this.props.jobTransaction)}>
                {iconName == 'call-out' ? <SimpleLineIcons name={iconName} style={[styles.fontLg, styles.fontBlack]} />
                    : <Icon name={iconName} style={[styles.fontLg, styles.fontBlack]} />}
            </Button>
        )
    }

    callButtonPressed = (jobTransaction) => {
        if (jobTransaction.jobSwipableDetails.contactData.length == 0)
            return
        if (jobTransaction.jobSwipableDetails.contactData.length > 1) {
            let contactData = jobTransaction.jobSwipableDetails.contactData.map(contacts => ({ text: contacts, icon: "md-arrow-dropright", iconColor: "#000000" }))
            contactData.push({ text: "Cancel", icon: "close", iconColor: styles.bgDanger.backgroundColor })
            ActionSheet.show(
                {
                    options: contactData,
                    cancelButtonIndex: contactData.length - 1,
                    title: SELECT_NUMBER_FOR_CALL
                },
                buttonIndex => {
                    if (buttonIndex != contactData.length - 1 && buttonIndex >= 0) {
                        this.callContact(jobTransaction.jobSwipableDetails.contactData[buttonIndex])
                    }
                }
            )
        }
        else {
            Alert.alert(CONFIRMATION + jobTransaction.jobSwipableDetails.contactData[0], CALL_CONFIRM,
                [{ text: CANCEL, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: OK, onPress: () => this.callContact(jobTransaction.jobSwipableDetails.contactData[0]) },],
                { cancelable: false })
        }
    }

    callContact = (contact) => {
        Communications.phonecall(contact, false)
    }

    customerCareButtonPressed = (jobTransaction) => {
        let customerCareTitles = jobTransaction.jobSwipableDetails.customerCareData.map(customerCare => ({ text: customerCare.name, icon: "md-arrow-dropright", iconColor: "#000000" }))
        customerCareTitles.push({ text: "Cancel", icon: "close", iconColor: styles.bgDanger.backgroundColor })
        ActionSheet.show(
            {
                options: customerCareTitles,
                cancelButtonIndex: customerCareTitles.length - 1,
                title: SELECT_NUMBER_FOR_CALL
            },
            buttonIndex => {
                if (buttonIndex != customerCareTitles.length - 1 && buttonIndex >= 0) {
                    this.callContact(jobTransaction.jobSwipableDetails.customerCareData[buttonIndex].mobileNumber)
                }
            }
        )
    }

    navigationButtonPressed = (jobTransaction) => {
        const addressDatas = jobTransaction.jobSwipableDetails.addressData
        const latitude = jobTransaction.jobLatitude
        const longitude = jobTransaction.jobLongitude
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

    render() {
        return (
            <View style={[styles.row, styles.width100, styles.marginLeft5]}>
                {this.props.jobTransaction.jobSwipableDetails && this.props.jobTransaction.jobSwipableDetails.contactData && this.props.jobTransaction.jobSwipableDetails.contactData.length > 0 && this.props.jobTransaction.jobSwipableDetails.smsTemplateData && this.props.jobTransaction.jobSwipableDetails.smsTemplateData.length > 0 &&
                    <MessageButtonItem sendMessageToContact={this.props.sendMessageToContact} jobSwipableDetails={this.props.jobTransaction.jobSwipableDetails} />
                }
                {(this.props.jobTransaction.jobSwipableDetails && this.props.jobTransaction.jobSwipableDetails.contactData && this.props.jobTransaction.jobSwipableDetails.contactData.length > 0) ?
                    this.renderIcon('md-call', this.callButtonPressed) : null
                }
                {(((this.props.jobTransaction.jobSwipableDetails && !_.isEmpty(this.props.jobTransaction.jobSwipableDetails.addressData)) || (this.props.jobTransaction.jobLatitude || this.props.jobTransaction.jobLongitude))) ?
                    this.renderIcon('md-map', this.navigationButtonPressed) : null
                }
                {(this.props.jobTransaction.jobSwipableDetails && this.props.jobTransaction.jobSwipableDetails.customerCareData && this.props.jobTransaction.jobSwipableDetails.customerCareData.length > 0) ?
                    this.renderIcon('call-out', this.customerCareButtonPressed) : null
                }
            </View>
        )
    }

}

const style = StyleSheet.create({
    footer: {
        height: 'auto',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
    }
});

export default MessagingCallingSmsButtonView