import React, { Component } from 'react'
import renderIf from '../lib/renderIf'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
    Header,
    Button,
    Text,
    Input,
    Body,
    Icon,
} from 'native-base';
import styles from '../themes/FeStyle'

export default class SearchBarV2 extends Component {
    render() {
        return (
            <View style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingLeft10, styles.paddingRight10]}>
                <View style={[styles.relative, { width: '85%', height: 30 }]}>
                    <Input
                        placeholder={this.props.placeholder}
                        placeholderTextColor={'rgba(255,255,255,.6)'}
                        style={[style.headerSearch]} />
                    <Button small transparent style={[style.inputInnerBtn]}>
                        <Icon name="md-search" style={[styles.fontWhite, styles.fontXl]} />
                    </Button>
                </View>
                <TouchableOpacity small transparent style={{ width: '15%' }}>
                    <Icon name="md-qr-scanner" style={[styles.fontWhite, styles.fontXxl, styles.fontRight]} onPress={() => { this.props.navigation.goBack(null) }} />
                </TouchableOpacity>
            </View>
        )
    }
}
const style = StyleSheet.create({
    headerSearch: {
        paddingLeft: 10,
        paddingRight: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.20)',
        borderRadius: 2,
        lineHeight: 10,
        paddingTop: 0,
        paddingBottom: 0,
        height: 30,
        color: '#fff',
        fontSize: 11
    },
    inputInnerBtn: {
        position: 'absolute',
        top: 0,
        right: 5,
        paddingLeft: 0,
        paddingRight: 0
      },
});