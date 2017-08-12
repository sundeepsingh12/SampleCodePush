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
import theme from '../themes/feTheme'
import ExpandableDetails from './ExpandableDetails'

class ExpandableHeader extends Component {

    render() {
        return (
            <View>
                <CardItem button onPress={() => { console.log('asda') }}>
                    <Body style={StyleSheet.flatten([styles.padding10])}>
                        <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                            <View style={StyleSheet.flatten([styles.marginRight15])}>
                                <Icon name='ios-list-outline' style={StyleSheet.flatten([styles.fontXl, theme.textPrimary])} />
                            </View>
                            <Text style={StyleSheet.flatten([styles.marginRightAuto, styles.fontLg])}>
                                Job Details
                            </Text>
                            <View>
                                <Icon name='ios-arrow-up-outline' style={StyleSheet.flatten([styles.fontXl, theme.textPrimary, styles.justifyEnd])} />
                            </View>
                        </View>
                    </Body>
                </CardItem>
                <ExpandableDetails/>
            </View>

        )
    }
}

export default ExpandableHeader




