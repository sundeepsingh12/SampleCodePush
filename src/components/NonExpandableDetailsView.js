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

export default class NonExpandableDetailsView extends Component {
    render() {
        return (
            <View style={StyleSheet.flatten([styles.column, { backgroundColor: '#F2F2F2' }])}>
                <View style={StyleSheet.flatten([styles.row, styles.padding10, { borderTopWidth: .5, borderColor: '#C5C5C5' }])}>
                    <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.bold, styles.fontSm])} >
                            {this.props.label}
                        </Text>
                    </View>
                    <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.fontSm])}>
                            {this.props.value}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}
