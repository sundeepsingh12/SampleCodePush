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
import ExpandableDetailsList from './ExpandableDetailsList'
import renderIf from '../lib/renderIf'

class ExpandableHeader extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showDropDown: false
        }
    }

    renderDetailsView() {
        let detailsView = []
        this.props.dataList.forEach((data) => {
            if (data.childDataList) {
                detailsView.push(
                    <ExpandableDetails
                        key={data.data.id}
                        label={data.label}
                        value={data.data.value} />
                )
            } else {
                detailsView.push(
                    <NonExpandableDetails
                        key={data.data.id}
                        label={data.label}
                        value={data.data.value} />
                )
            }
        })
        return detailsView
    }

    render() {
        return (
            <View>
                <CardItem button onPress={() => { this.setState({ showDropDown: !this.state.showDropDown }) }}>
                    <Body style={StyleSheet.flatten([styles.padding10])}>
                        <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                            <View style={StyleSheet.flatten([styles.marginRight15])}>
                                <Icon name='ios-list-outline' style={StyleSheet.flatten([styles.fontXl, theme.textPrimary])} />
                            </View>
                            <Text style={StyleSheet.flatten([styles.marginRightAuto, styles.fontLg])}>
                                {this.props.title}
                            </Text>
                            <View>
                                <Icon name={this.state.showDropDown ? 'ios-arrow-up-outline' : 'ios-arrow-down-outline'} style={StyleSheet.flatten([styles.fontXl, theme.textPrimary, styles.justifyEnd])} />
                            </View>
                        </View>
                    </Body>
                </CardItem>
                {renderIf(this.state.showDropDown,
                    <ExpandableDetailsList
                        dataList = {this.props.dataList} />
                )}

            </View>

        )
    }
}

export default ExpandableHeader




