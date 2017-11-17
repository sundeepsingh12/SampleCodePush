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
import { Container, Content, Card, CardItem, Button, Body, Header, Icon} from 'native-base'
import styles from '../themes/FeStyle'
import ExpandableDetailsList from './ExpandableDetailsList'
import renderIf from '../lib/renderIf'

class ExpandableHeader extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showDropDown: false
        }
    }

    render() {
        return (
            <View>
                <CardItem button onPress={() => { this.setState({ showDropDown: !this.state.showDropDown }) }}>
                    <Body style={StyleSheet.flatten([styles.padding10])}>
                        <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                            <View style={StyleSheet.flatten([styles.marginRight15])}>
                                <Icon name='ios-list-outline' style={StyleSheet.flatten([styles.fontXl, styles.fontPrimary])} />
                            </View>
                            <Text style={StyleSheet.flatten([styles.marginRightAuto, styles.fontLg])}>
                                {this.props.title}
                            </Text>
                            <View>
                                <Icon name={this.state.showDropDown ? 'ios-arrow-up-outline' : 'ios-arrow-down-outline'} style={StyleSheet.flatten([styles.fontXl, styles.fontPrimary, styles.justifyEnd])} />
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




