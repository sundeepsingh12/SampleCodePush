'use strict'

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import { Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Loader extends Component {
    render() {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
               <Spinner color='#a3a3a3' size={'small'} />
            </View>
        )
    }
}