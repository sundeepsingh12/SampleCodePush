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
            showDropDown: true
        }
    }

    render() {
        return (
            <View>
                <CardItem button onPress={() => { this.setState({ showDropDown: !this.state.showDropDown }) }}>
                        <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                            <Text style={[styles.fontLg, styles.fontBlack, styles.bold]}>
                                {this.props.title}
                            </Text>
                            <View>
                                <Icon name={this.state.showDropDown ? 'ios-arrow-up-outline' : 'ios-arrow-down-outline'} style={StyleSheet.flatten([styles.fontXl, styles.fontPrimary, styles.justifyEnd])} />
                            </View>
                        </View>
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




