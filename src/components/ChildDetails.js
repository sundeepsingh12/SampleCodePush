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

class ChildDetails extends Component {

    renderList() {
        let list = []
        for (var i = 0; i < 100; i++) {
            let obj = {
                id: i,
                name: 'xyz'
            }
            list.push(obj)
        }
        console.log(list)
        return list
    }
    
    renderData = (item) => {
        return (
            <View style={StyleSheet.flatten([styles.row, styles.padding10, styles.bgWhite, { borderTopWidth: .5, borderColor: '#C5C5C5' }])}>
                <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                    <Text style={StyleSheet.flatten([styles.bold, styles.fontSm])}>
                        Child List
                    </Text>
                </View>
                <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                    <Text style={StyleSheet.flatten([styles.fontSm])}>
                        Child String Content
                    </Text>
                </View>
            </View>
        )
    }

    render() {
        return (
        <Content style={StyleSheet.flatten([{ flex: 1, height: 100 }])}>
        <List>
            <FlatList
                data={this.renderList()}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => item.id}
            />
        </List>
    </Content>
        )
    }
}

export default ChildDetails