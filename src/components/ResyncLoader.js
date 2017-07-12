'use strict'

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ResyncLoader extends Component {
    render() {
        return (
            <View>
                <Ionicons style={{ color: 'green' }} name={'ios-home-outline'} size={26} />
                <Text style={{ textAlign: 'center', color: '#CC3333' }}>
                    Re-Sync
                </Text>
            </View>
        )
    }
}