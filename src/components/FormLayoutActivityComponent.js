'use strict'
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableHighlight
} from 'react-native'
import { Container, Card, CardItem, Body, Icon } from 'native-base'
import styles from '../themes/FeStyle'
import theme from '../themes/feTheme'

class FormLayoutActivityComponent extends Component {

    render() {
        console.log('props of FormLayoutActivityComponent', this.props)
        return (
            <Card>
                <CardItem button onPress = {() => this.props.press(this.props.item)}>
                    <Body style={StyleSheet.flatten([styles.padding0])}>
                        <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                            <View style={StyleSheet.flatten([{ flexBasis: '12%', paddingTop: 2 }])}>
                                <Icon name='md-create' style={StyleSheet.flatten([styles.fontXxl, theme.textPrimary, { marginTop: -5 }])} />
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
                </CardItem>
            </Card>
        )
    }
}

export default FormLayoutActivityComponent