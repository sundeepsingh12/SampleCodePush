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
import renderIf from '../lib/renderIf'
import ExpandableDetailsView from './ExpandableDetailsView'
import NonExpandableDetailsView from './NonExpandableDetailsView'

import {
    ARRAYSAROJFAREYE,
} from '../lib/AttributeConstants'

class ExpandableDetailsList extends Component {

    renderChildList(dataList) {
        let childListView = []
        for (let index in dataList) {
            childListView.push(this.renderData(dataList[index]))
        }
        return childListView
    }

    renderData = (item) => {
        if (item.data.value == ARRAYSAROJFAREYE && item.childDataList) {
            return (
                <ExpandableDetailsView
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    value={item.data.value}
                    childDataList={item.childDataList} />
            )
        } else if (item.childDataList) {
            let childListView = this.renderChildList(item.childDataList)
            return childListView
        } else {
            return (
                <NonExpandableDetailsView
                    key={item.id}
                    label={item.label}
                    value={item.data.value} />
            )
        }
    }

    render() {
        return (
            <View style={StyleSheet.flatten([{ flex: 1,minHeight:'50%', maxHeight: '100%' }])}>
                <List>
                    <FlatList
                        data={this.props.dataList}
                        renderItem={({ item }) => this.renderData(item)}
                        keyExtractor={item => item.id}
                    />
                </List>
            </View>
        )
    }
}

export default ExpandableDetailsList