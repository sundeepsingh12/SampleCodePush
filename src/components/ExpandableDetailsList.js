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
import ChildDetails from './ChildDetails'
import renderIf from '../lib/renderIf'
import ExpandableDetailsView from './ExpandableDetailsView'
import NonExpandableDetailsView from './NonExpandableDetailsView'

class ExpandableDetailsList extends Component {

    renderChildList(dataList) {
        let childListView = []
        for (let index in dataList) {
            childListView.push(
                <NonExpandableDetailsView
                    key={dataList[index].data.id}
                    label={dataList[index].label}
                    value={dataList[index].data.value} />
            )
        }
        return childListView
    }

    renderData = (item) => {
        if (item.data.value == 'ArraySarojFareye' && item.childDataList) {
            return (
                <ExpandableDetailsView
                    key={item.data.id}
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
                    key={item.data.id}
                    label={item.label}
                    value={item.data.value} />
            )
        }
    }

    render() {
        return (
            <Content style={StyleSheet.flatten([{ flex: 1, maxHeight: '100%' }])}>
                <List>
                    <FlatList
                        data={this.props.dataList}
                        renderItem={({ item }) => this.renderData(item)}
                        keyExtractor={item => item.data.id}
                    />
                </List>
            </Content>
        )
    }
}

export default ExpandableDetailsList