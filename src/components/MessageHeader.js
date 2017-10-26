'use strict'

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    FlatList,
    TouchableOpacity
} from 'react-native'
import { Container, Content, Footer, FooterTab, Card, CardItem, Button, Body, Header, Left, Right, Icon, List, ListItem } from 'native-base';
import styles from '../themes/FeStyle'

class MessageHeader extends Component {

    render() {
        return (
            <CardItem>
                <Body style={StyleSheet.flatten([styles.padding10])}>
                    <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])}>
                        <View style={StyleSheet.flatten([styles.marginRight15])}>
                            <Icon name='ios-mail-outline' style={StyleSheet.flatten([styles.fontXl, styles.textPrimary])} />
                        </View>
                        <View style={StyleSheet.flatten([styles.marginRightAuto, styles.column])}>
                            <View style={StyleSheet.flatten([styles.row, styles.alignStart, styles.justifySpaceBetween])}>
                                <Text style={StyleSheet.flatten([styles.fontXs, { color: '#ababab' }])}>Messages</Text>
                                <Text style={StyleSheet.flatten([styles.fontXs, styles.bold, styles.textPrimary])}>View</Text>
                            </View>
                            <Text style={StyleSheet.flatten([styles.fontSm, styles.marginTop5])}>Lorem Ipsum is simply dummy text of the printing and typesetting…</Text>
                            <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, styles.textPrimary])}>3 New Messages</Text>
                        </View>
                    </View>
                </Body>
            </CardItem>
        )
    }
}

export default MessageHeader