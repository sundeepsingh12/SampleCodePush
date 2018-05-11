'use strict'

import React, { PureComponent } from 'react'
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Text
} from 'react-native'
import styles from '../themes/FeStyle'

export default class SyncLoader extends PureComponent {
    render() {
        return (
            <Modal
            transparent={true}
            animationType={'none'}
            visible={this.props.moduleLoading}
            onRequestClose={() => {console.log('close modal')}}>
            <View style={style.modalBackground}>
              <View style={style.activityIndicatorWrapper}>
                <ActivityIndicator
                  animating={this.props.moduleLoading} />
                <Text>Sync In progress...</Text>
              </View>
            </View>
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