'use strict'
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform
} from 'react-native'
import { Container, Card, CardItem, Body, Icon, Right } from 'native-base'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'

class FormLayoutActivityComponent extends Component {

    render() {
        console.log('props of FormLayoutActivityComponent', this.props)
        return (
            <Card>
                <CardItem style={this.props.item.focus ? { backgroundColor: 'blue' } : null} button={this.props.item.editable} onPress={() => this.props.press(this.props.item)}>
                    <Body style={StyleSheet.flatten([styles.padding0])}>
                        <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                            <View style={StyleSheet.flatten([{ flexBasis: '12%', paddingTop: 2 }])}>
                                <Icon name='md-create' style={StyleSheet.flatten([styles.fontXxl, styles.textPrimary, { marginTop: -5 }])} />
                            </View>
                            <View style={StyleSheet.flatten([styles.marginRightAuto, { flexBasis: '88%' }])}>
                                <View style={StyleSheet.flatten([styles.row])}>
                                    <View style={StyleSheet.flatten([{ flexBasis: '80%' }])}>
                                        <Text style={StyleSheet.flatten([styles.fontSm, styles.bold])}>
                                            {this.props.item.label}
                                        </Text>
                                        <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, { color: '#999999' }])}>
                                            {this.props.item.subLabel}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, { color: '#999999' }])}>
                                    {this.props.item.helpText}
                                </Text>
                            </View>
                        </View>
                    </Body>
                    <Right>{renderIf(this.props.item.showCheckMark,
                        <Icon name='ios-checkmark' style={StyleSheet.flatten([styles.fontXxxl, styles.fontSuccess, { marginTop: -5 }])} />
                    )}</Right>
                </CardItem>
            </Card>
        )
    }
}

export default FormLayoutActivityComponent