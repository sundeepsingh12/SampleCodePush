'use strict'

import React, { PureComponent } from 'react'

import {
    SELECT_TEMPLATE,
    SELECT_NUMBER
  } from '../lib/ContainerConstants'
import styles from '../themes/FeStyle'
import { Button, Icon, ActionSheet } from 'native-base'

export default class MessageButtonItem extends PureComponent {
    chatButtonPressed = () => {
        if (this.props.jobSwipableDetails.contactData.length > 1) {
          let contactData = this.props.jobSwipableDetails.contactData.map(contacts => ({ text: contacts, icon: "md-arrow-dropright", iconColor: "#000000" }))
          contactData.push({ text: "Cancel", icon: "close", iconColor: styles.bgDanger.backgroundColor })
          ActionSheet.show(
            {
              options: contactData,
              cancelButtonIndex: contactData.length - 1,
              title: SELECT_NUMBER
            },
            buttonIndex => {
              if (buttonIndex != contactData.length - 1 && buttonIndex >= 0) {
                this.showSmsTemplateList(this.props.jobSwipableDetails.contactData[buttonIndex])
              }
            }
          )
        }
        else {
          this.showSmsTemplateList(this.props.jobSwipableDetails.contactData[0])
        }
      }
      showSmsTemplateList = (contact) => {
        setTimeout(() => {
          if (this.props.jobSwipableDetails.smsTemplateData.length > 1) {
            let msgTitles = this.props.jobSwipableDetails.smsTemplateData.map(sms => ({ text: sms.title, icon: "md-arrow-dropright", iconColor: "#000000" }))
            msgTitles.push({ text: "Cancel", icon: "close", iconColor: styles.bgDanger.backgroundColor })
            ActionSheet.show(
              {
                options: msgTitles,
                cancelButtonIndex: msgTitles.length - 1,
                title: SELECT_TEMPLATE
              },
              buttonIndex => {
                if (buttonIndex != msgTitles.length - 1 && buttonIndex >= 0) {
                  this.props.sendMessageToContact(contact, this.props.jobSwipableDetails.smsTemplateData[buttonIndex])
                }
              }
            )
          }
          else {
            this.props.sendMessageToContact(contact, this.props.jobSwipableDetails.smsTemplateData[0])
          }
        }, 500)
      }

    render() {
        return (
            <Button transparent onPress={this.chatButtonPressed}>
                <Icon name="md-text" style={[styles.fontLg, styles.fontBlack]} />
            </Button>
        )
    }
}
