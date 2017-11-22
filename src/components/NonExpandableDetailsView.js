'use strict'

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Linking
} from 'react-native'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import { Icon } from 'native-base'
import {
    IMAGE_LOADING_ERROR,
    VIEW_TEXT_LABEL,
    IMAGE_URL
} from '../lib/AttributeConstants'

export default class NonExpandableDetailsView extends Component {

    _openURL(url) {
        Linking.openURL(url).
            catch(error =>
                console.error(IMAGE_LOADING_ERROR, error));
    }

    render() {
        return (
            <View style={StyleSheet.flatten([styles.column, { backgroundColor: '#F2F2F2' }])}>
                <View style={StyleSheet.flatten([styles.row, styles.padding10, { borderTopWidth: .5, borderColor: '#C5C5C5' }])}>
                    <View style={StyleSheet.flatten([styles.row, styles.justifyStart, styles.alignCenter, { flex: .5 }])}>
                        <Text style={StyleSheet.flatten([styles.bold, styles.fontSm])} >
                            {this.props.label}
                        </Text>
                    </View>
                    <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, styles.alignCenter, { flex: .5 }])}>
                        {renderIf(this.props.attributeTypeId == IMAGE_URL,
                            <TouchableOpacity onPress={() => this._openURL(this.props.value)}>
                                <View style={[styles.row]}>
                                    <Icon name={'ios-image'} style={StyleSheet.flatten([styles.alignSelfEnd, styles.fontBlack, styles.fontXl, styles.fontPrimary])} />
                                    <Text style={StyleSheet.flatten([styles.fontSm, styles.paddingLeft5, styles.fontPrimary])}>
                                        {VIEW_TEXT_LABEL}
                                    </Text>
                                </View>
                            </TouchableOpacity>)}
                        {renderIf(this.props.attributeTypeId != IMAGE_URL,
                            <Text style={StyleSheet.flatten([styles.fontSm])}>
                                {this.props.value}
                            </Text>)}
                    </View>
                </View>
            </View>
        )
    }
}
