'use strict'
import React, { PureComponent } from 'react'
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableHighlight,
  Image,
  TouchableOpacity
}
  from 'react-native'
import { StyleProvider, Container, Content, Button, Input,  Spinner ,Header,Left,Icon,Body,Right} from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as bluetoothActions from '../modules/bluetooth/bluetoothActions'

function mapStateToProps(state) {
  return {
  }
}

class BluetoothListing extends PureComponent {

  componentDidMount() {
  }

  static navigationOptions = ({ navigation }) => {
    return {
        header: null
    }
}

renderHeader(){
    return (
        <Header style={StyleSheet.flatten([styles.bgPrimary])}>
            <Left>
                <Button transparent onPress={() => {
                    this.props.navigation.goBack(null)
                }}>
                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} />
                </Button>
            </Left>
            <Body>
                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>Bluetooth</Text>
            </Body>
            <Right />
        </Header>
    )
}

  render() {
    return (
          <StyleProvider style={getTheme(platform)}>
            <Container>
          {this.renderHeader()}

          
            </Container>
            
          </StyleProvider>
    )
  }
};

export default connect(mapStateToProps, bluetoothActions)(BluetoothListing)