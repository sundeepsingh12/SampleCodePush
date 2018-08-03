'use strict'

import React, { PureComponent } from 'react'
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Text
} from 'react-native'
import { UNABLE_TO_SYNC_WITH_SERVER_PLEASE_CHECK_YOUR_INTERNET } from '../lib/ContainerConstants'
import {
  Button
} from 'native-base';
import styles from '../themes/FeStyle'


export default class SyncLoader extends PureComponent {
  _returnModalView() {
    return (
      <View style={[styles.bgWhite, styles.shadow, styles.borderRadius3, { width: '70%' }, styles.padding5]}>
        <View>
          <View style={[styles.padding5]}>
            <Text style={[styles.alignCenter, styles.justifyCenter, styles.fontCenter, styles.fontWeight500, styles.fontXl]}>Error</Text>
          </View>
          <View style={[styles.row, { borderTopColor: '#d3d3d3', borderTopWidth: 1 }, styles.padding5]} />
        </View>
        <View style={[styles.padding5]}>
          <Text style={[styles.fontCenter, styles.marginBottom5, styles.fontBlack, styles.fontLg]}>{UNABLE_TO_SYNC_WITH_SERVER_PLEASE_CHECK_YOUR_INTERNET}</Text>
        </View>
        <View style={[{ borderTopColor: '#d3d3d3', borderTopWidth: 1 }]}>
          <Button transparent full onPress={() => this.props.cancelModal()} >
            <Text style={[ styles.fontWeight500, styles.fontXl]}>{'Ok'}</Text>
          </Button>
        </View>
      </View>
    )
  }
  render() {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.moduleLoading}
        onRequestClose={() => { console.log('close modal') }}>
        {this.props.moduleLoading == 'error' ?
          <View style={[styles.relative, styles.alignCenter, styles.justifyCenter, { height: '100%' }]}>
            <View style={[styles.absolute, { height: '100%', left: 0, right: 0, backgroundColor: 'rgba(52,52,52,.8)' }]}>
            </View>
            {this._returnModalView()}
          </View>
          :
          <View style={style.modalBackground}>
            <View style={style.activityIndicatorWrapper}>
              <ActivityIndicator
                animating={this.props.moduleLoading} />
              <Text>Sync In progress...</Text>
            </View>
          </View>
        }
      </Modal>
    )
  }
}

const style = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 60,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});