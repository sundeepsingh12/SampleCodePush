'use strict'
import React, { PureComponent } from 'react'
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet

} from 'react-native'

import codePush from "react-native-code-push"

export default function native() {

  class Fareye extends PureComponent {

    constructor(props){
      super(props)
      this.state = {
        text :'Inital Text 1'
      }
    }

    testCodePush = () => {
      codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
      deploymentKey: 'oFk0-SJCZqp30txXWUsv57dcOpvbfa6cce67-4548-4405-8a0c-2ace10925777', //this key is hardcoded for testing purpose
    }, (status) => {
      switch (status) {
        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({text:'Checking For Update'})
          break;
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({text:'Downloading Package'})
          break;
        case codePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({text:'Installling Update'})
          break;
        case codePush.SyncStatus.UP_TO_DATE:
        this.setState({text:'Up to date'})
          break;
        case codePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({text:'Update installed'})
          break;
        case codePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({text:'Awaiting user action'})
          break;
        case codePush.SyncStatus.SYNC_IN_PROGRESS:
        this.setState({text:'Sync in progress'})
          break;
        default:
        this.setState({text:'Something went wrong'})
      }
    })
    }

    render() {
      return (
          <View>
            <View style={[style.width70, style.marginTop30]}>
            <Text style={[ style.paddingLeft15, style.paddingRight15, style.width100, { height: 40 }]} >
          Test Code Push in RN 0.57.1
          </Text>
          <Button
          title = "Click Me"
          color="#841584"
          onPress = {this.testCodePush}
        >
        </Button>
            </View>
            <Text style = {[ style.marginTop30]}> {this.state.text}</Text>
          </View>
      );
    }
  }

  AppRegistry.registerComponent('Fareye', () => Fareye)
}

var style = StyleSheet.create({
  width70: {
    width: '70%'
  },
  marginTop30: {
    marginTop: 30
},
paddingLeft15: {
  paddingLeft: 15
},
paddingRight15: {
  paddingRight: 15
},
width100: {
  width: '100%'
},
fontWhite: {
  color: '#ffffff'
},
marginTop15: {
  marginTop: 15
},
})
