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

class ExpandableDetails extends Component {
    render() {
        return (
            <View>
                <TouchableOpacity style={StyleSheet.flatten([styles.row, styles.padding10, { borderTopWidth: .5, borderColor: '#C5C5C5' }])} onPress={() => { console.log('details') }}>
                    <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.bold, styles.fontSm])} >
                            Parent List
                        </Text>
                    </View>
                    <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.fontSm])}>
                            String Content
                        </Text>
                        <Text>
                            <Icon name='md-arrow-dropdown' style={StyleSheet.flatten([styles.alignSelfEnd, styles.fontBlack, styles.fontXl])} />
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default ExpandableDetails