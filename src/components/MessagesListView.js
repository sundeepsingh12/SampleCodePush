'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    Text
} from 'react-native'
import styles from '../themes/FeStyle'

import {
    ARRAY_SAROJ_FAREYE
} from '../lib/AttributeConstants'

class MessagesListView extends PureComponent {


    renderData = (item) => {
        return (
            <View style={[styles.padding10]}>
                <Text style={[styles.fontDefault, styles.fontBlack]} >
                    {item.messageBody}
                </Text>
                <Text style={[styles.fontSm]} >
                    {item.dateTimeOfSending}
                </Text>
            </View>
        )
    }

    render() {
        return (
            <View style={StyleSheet.flatten([{ flex: 1, minHeight: '50%', maxHeight: '100%' }])}>
                <FlatList
                    data={this.props.dataList}
                    renderItem={({ item }) => this.renderData(item)}
                    keyExtractor={item => String(item.id)}
                />
            </View>
        )
    }
}

export default MessagesListView