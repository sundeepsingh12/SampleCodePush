'use strict'

import React, { Component } from 'react'
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  FlatList,
  Animated
} from 'react-native'

import {Toast,StyleProvider,Container,Content,Header,Left,Body,Right,Button,Icon,ListItem} from 'native-base'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as bluetoothActions from '../modules/bluetooth/bluetoothActions'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import SearchBarV2 from '../components/SearchBarV2'
import BluetoothSerial from 'react-native-bluetooth-serial'


function mapStateToProps(state) {
  return {
    isScanRunning: state.bluetooth.isScanRunning,
    unpairedDevices:state.bluetooth.unpairedDevices,
    pairedDevices:state.bluetooth.pairedDevices
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...bluetoothActions}, dispatch)
  }
}

class BluetoothListing extends Component {

  componentWillMount () {
    this.props.actions.fetchUnpairedDevices()
  }

  renderData(device){
    return (
      <ListItem style={[style.jobListItem, styles.justifySpaceBetween]}
      onPress={() => this.pairDevice(device)}
      >
        <View style={[styles.column]}>
          <Text style={[styles.fontDefault, styles.fontWeight500]}>{device.name}</Text>
          <Text style={[styles.fontDefault]}>{device.id}</Text>
        </View>
      </ListItem>
    )
  }

  pairDevice(device){
    BluetoothSerial.connect(device.id)
    .then(paired => {
      if (paired) {
        Toast.show({text:`Device ${device.name} paired successfully`})
      } else {
        Toast.show({text:`Device ${device.name} pairing failed`})
      }
    })
    .catch((err) => Toast.show(err.message))
  }
  
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }
  
  renderHeadeView(){
    return (
      <Header searchBar style={[{backgroundColor : styles.bgPrimaryColor}, styles.header]}>
        <Body>
          <View>
          <View style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
            <TouchableOpacity style={[styles.profileHeaderLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
              <Icon name="md-close" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
            </TouchableOpacity>
            <View style={[styles.headerBody, styles.paddingTop15]}>
              <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Bluetooth</Text>
            </View>
            <View style={[styles.headerRight]}>
            </View>
            <View />
          </View>
          </View>
        </Body>
      </Header>
    )
  }

  showHeaderView(){
    return(
      <View style={[{backgroundColor : styles.bgPrimaryColor}, style.header]}>
              <View
                  style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                  <TouchableOpacity style={[style.headerLeft]} onPress={() => {
                      this.props.navigation.goBack(null)
                  }}>
                      <Icon name="md-close" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                  </TouchableOpacity>
                  <View style={[style.headerBody]}>
                      <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Bluetooth</Text>
                  </View>
                  <View style={[style.headerRight]}>
                  </View>
                  <View />
              </View>
              <SearchBarV2 placeholder="Search Device Name/Address" />
      </View>
    )
}

showPairedAndUnpairedDevices(){
  return (
    <Content style={[styles.marginTop15, styles.bgWhite]}>
      <View style={[styles.padding10, styles.borderBottomGray]}>
        <Text style={[{color : styles.fontPrimaryColor}, styles.paddingLeft5]}>My Devices</Text>
      </View>
      <FlatList
        data={this.props.pairedDevices}
        renderItem={({ item }) => this.renderData(item)}
        keyExtractor={item => item.id}
      />
      <View style={[styles.borderBottomGray, { height: 1 }]}></View>
      <View style={[styles.padding10, styles.borderBottomGray]}>
        <Text style={[{color : styles.fontPrimaryColor}, styles.paddingLeft5]}>Other Devices</Text>
      </View>
      <FlatList
        data={this.props.unpairedDevices}
        renderItem={({ item }) => this.renderData(item)}
        keyExtractor={item => item.id}
      />
    </Content>
  )
}

scanMoreDevice = () => {
  this.props.actions.fetchUnpairedDevices()
}

renderBluetoothListing(){
  return (
    <Container style={[styles.bgLightGray]}>
      {this.showHeaderView()}
      <Button full style={[styles.bgWhite, { height: 60 }]}
        onPress={this.scanMoreDevice}>
        <Text style={{color : styles.fontPrimaryColor}}>Scan More Devices</Text>
      </Button>
      {this.showPairedAndUnpairedDevices()}
    </Container>
  )
}

renderBluetoothScanningView(){
  return (
    <Container style={[styles.bgLightGray]}>
    {this.renderHeadeView()}
      <View style={[{ marginTop: 120 }]}>
        <Text style={[styles.fontLg, styles.fontBlack, styles.bold, styles.fontCenter]}>Searching for nearby Devices...</Text>
      </View>
      <View style={[styles.justifyCenter, styles.alignCenter]}>
      </View>
    </Container>
  )
}

  render () {
    if(this.props.isScanRunning){
      return (
        <StyleProvider style={getTheme(platform)}>
        {this.renderBluetoothScanningView()}
        </StyleProvider>
      )
    }
    else {
      return (
        <StyleProvider style={getTheme(platform)}>
         {this.renderBluetoothListing()}
        </StyleProvider >
      )
    }
  }
}

const style = StyleSheet.create({
  header: {
      borderBottomWidth: 0,
      height: 'auto',
      padding: 0,
      paddingRight: 0,
      paddingLeft: 0,
      paddingBottom: 10
  },
  headerLeft: {
      width: '15%',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10
  },
  headerBody: {
      width: '70%',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10
  },
  headerRight: {
      width: '15%',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10
  },
  headerSearch: {
      paddingLeft: 10,
      paddingRight: 30,
      backgroundColor: '#1260be',
      borderRadius: 2,
      height: 40,
      color: '#fff',
      fontSize: 14
  },
  headerQRButton: {
      position: 'absolute',
      right: 5,
      paddingLeft: 0,
      paddingRight: 0
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothListing)



