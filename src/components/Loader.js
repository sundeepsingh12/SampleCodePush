'use strict'

import React, { Component } from 'react'
import {
  View
} from 'react-native'
import { Spinner } from 'native-base'

export default class Loader extends Component {
    render() {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
               <Spinner color='#a3a3a3' size={'small'} />
            </View>
        )
    }
}