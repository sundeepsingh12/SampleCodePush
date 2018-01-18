'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform
} from 'react-native'
import { Card, CardItem, Button, Body, Header, Left, Right, Icon } from 'native-base'
import styles from '../themes/FeStyle'

class MessageHeader extends PureComponent {

    render() {
        return (
            <CardItem>
                <Body style={StyleSheet.flatten([styles.padding10])}>
                    <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])}>
                        <View style={StyleSheet.flatten([styles.marginRight15])}>
                            <Icon name='ios-mail-outline' style={StyleSheet.flatten([styles.fontXl, styles.fontPrimary])} />
                        </View>
                        <View style={StyleSheet.flatten([styles.marginRightAuto, styles.column])}>
                            <View style={StyleSheet.flatten([styles.row, styles.alignStart, styles.justifySpaceBetween])}>
                                <Text style={StyleSheet.flatten([styles.fontXs, { color: '#ababab' }])}>Messages</Text>
                                <Text style={StyleSheet.flatten([styles.fontXs, styles.bold, styles.fontPrimary])}>View</Text>
                            </View>
                            <Text style={StyleSheet.flatten([styles.fontSm, styles.marginTop5])}>Lorem Ipsum is simply dummy text of the printing and typesetting…</Text>
                            <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, styles.fontPrimary])}>3 New Messages</Text>
                        </View>
                    </View>
                </Body>
            </CardItem>
        )
    }
}

export default MessageHeader