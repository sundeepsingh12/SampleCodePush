
'use strict'

import React, { PureComponent } from 'react'

import {
    StyleSheet,
    View,
    Text,
    Platform,
    SegmentedControlIOS
}
    from 'react-native'
import { Icon} from 'native-base'
import styles from '../themes/FeStyle'

export default class PopOver extends PureComponent {
    render() {
        return (
            <View style={StyleSheet.flatten([styles.positionAbsolute, { top: 40, right: 0 }])}>
                <Icon size={12} name='md-arrow-dropup' style={StyleSheet.flatten([styles.positionAbsolute, styles.fontDanger, { top: -18, right: 6 }])} />
                <View style={StyleSheet.flatten([styles.bgDanger, styles.padding10, { borderRadius: 5, alignSelf: 'flex-end' }])}>
                    <Text style={StyleSheet.flatten([{ color: '#ffffff' }])}>
                        Error Message Goes Here
                    </Text>
                </View>
            </View>
        )
    }
}