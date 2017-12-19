'use strict'

import React, { Component } from 'react'
import {
  View
} from 'react-native'
import { Spinner } from 'native-base'
import styles from '../themes/FeStyle'

export default class Loader extends Component {
    render() {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
               <Spinner color={styles.bgPrimary.backgroundColor} size={'small'} />
            </View>
        )
    }
}