'use strict'

import React, { PureComponent } from 'react'
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
    IMAGE_URL,
    DATA_STORE,
    COUNT_DOWN_TIMER,
    SIGNATURE,
    CAMERA,
    CAMERA_HIGH,
    CAMERA_MEDIUM,
    SIGNATURE_AND_FEEDBACK
} from '../lib/AttributeConstants'
import CountDownTimer from './CountDownTimer'
export default class NonExpandableDetailsView extends PureComponent {

    _openURL(url) {
        Linking.openURL(url).
            catch(error =>
                console.error(IMAGE_LOADING_ERROR, error));
    }

    render() {
        return (
            <View style={[styles.row, styles.paddingLeft10, styles.paddingRight10]}>

                <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                    <Text style={[styles.fontDefault]} >
                        {this.props.label}
                    </Text>
                </View>

                <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                    {renderIf(this.props.attributeTypeId == IMAGE_URL,
                        <TouchableOpacity onPress={() => this._openURL(this.props.value)}>
                            <View style={[styles.row]}>
                                <Icon name={'ios-image'} style={StyleSheet.flatten([styles.alignSelfEnd, styles.fontBlack, styles.fontXl, styles.fontPrimary])} />
                                <Text style={StyleSheet.flatten([styles.fontSm, styles.paddingLeft5, styles.fontPrimary])}>
                                    {VIEW_TEXT_LABEL}
                                </Text>
                            </View>
                        </TouchableOpacity>)}

                    {renderIf(this.props.attributeTypeId == DATA_STORE,
                        <Text style={[styles.fontDefault, styles.fontPrimary, styles.textUnderline]}
                            onPress={() => this.props.navigateToDataStoreDetails({
                                value: this.props.value,
                                fieldAttributeMasterId: this.props.fieldAttributeMasterId
                            })}>
                            {this.props.value}
                        </Text>)}
                    {renderIf(this.props.attributeTypeId == COUNT_DOWN_TIMER,
                        <CountDownTimer value={this.props.value} />)}
                    {renderIf(this.props.attributeTypeId == CAMERA || this.props.attributeTypeId == CAMERA_HIGH || this.props.attributeTypeId == CAMERA_MEDIUM || this.props.attributeTypeId == SIGNATURE,
                        <Text style={[styles.fontDefault, styles.fontPrimary, styles.textUnderline]}
                            onPress={() => this.props.navigateToCameraDetails({
                                value: this.props.value,
                            })}>
                            Tap to View
                        </Text>)}
                    {renderIf(this.props.attributeTypeId != IMAGE_URL && this.props.attributeTypeId != COUNT_DOWN_TIMER && this.props.attributeTypeId != DATA_STORE &&
                        this.props.attributeTypeId != CAMERA && this.props.attributeTypeId != CAMERA_HIGH && this.props.attributeTypeId != CAMERA_MEDIUM && this.props.attributeTypeId != SIGNATURE,
                        <Text style={[styles.fontDefault, styles.fontBlack]}>
                            {this.props.value}
                        </Text>)}
                </View>
            </View>
        )
    }
}
