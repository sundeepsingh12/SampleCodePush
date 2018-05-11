'use strict'
import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
} from 'react-native'
import { Container, Card, CardItem, Body, Icon, Right } from 'native-base'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import {
    ARRAY,
    CASH_TENDERING,
    DATA_STORE,
    DATE,
    MONEY_COLLECT,
    MONEY_PAY,
    NPS_FEEDBACK,
    SIGNATURE,
    SIGNATURE_AND_FEEDBACK,
    SKU_ARRAY,
    TIME,
    RE_ATTEMPT_DATE,
    ARRAY_SAROJ_FAREYE,
    OBJECT_SAROJ_FAREYE,
    CAMERA,
    CAMERA_HIGH,
    CAMERA_MEDIUM,
    RADIOBUTTON
} from '../lib/AttributeConstants'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

class FormLayoutActivityComponent extends PureComponent {

    getIcon(attributeTypeId) {
        switch (attributeTypeId) {
            case ARRAY: return <MaterialIcons name='format-list-numbered' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
            case CASH_TENDERING: return <MaterialCommunityIcons name='cash-multiple' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
            case DATA_STORE: <MaterialCommunityIcons name='database-search' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
            case MONEY_COLLECT:
            case MONEY_PAY: return <MaterialIcons name='account-balance-wallet' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
            case SIGNATURE: return <MaterialCommunityIcons name='pen' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
            case NPS_FEEDBACK:
            case SIGNATURE_AND_FEEDBACK: return <MaterialIcons name='star' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
            case SKU_ARRAY: return <MaterialIcons name='shopping-cart' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
            case DATE:
            case RE_ATTEMPT_DATE:
                return <MaterialIcons name='date-range' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
            case TIME:
                return <MaterialIcons name='access-time' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
            case RADIOBUTTON: return <MaterialIcons name='radio-button-checked' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
            case CAMERA_HIGH:
            case CAMERA_MEDIUM:
            case CAMERA: return <MaterialIcons name='photo-camera' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
            default: return <MaterialCommunityIcons name='qrcode' style={[styles.fontXxl, styles.padding5]} color={this.getComponentIconStyle(this.props.item.editable).color} />
        }
    }

    getComponentLabelStyle(focus, editable) {
        return focus ? {color : styles.fontPrimaryColor} : editable ? styles.fontBlack : styles.fontLowGray
    }

    getComponentSubLabelStyle(editable) {
        return editable ? styles.fontDarkGray : styles.fontLowGray
    }

    getComponentHelpTextStyle(editable) {
        return editable ? styles.fontDarkGray : styles.fontLowGray
    }

    getComponentIconStyle(editable) {
        return editable ? styles.fontBlack : styles.fontLowGray
    }

    render() {
        const icon = this.getIcon(this.props.item.attributeTypeId)
        return (
            <TouchableHighlight disabled={!this.props.item.editable} onPress={() => this.props.press(this.props.item)}>
                <View style={[style.formCard, this.props.item.focus ? {borderLeftColor : styles.borderLeft4Color, borderLeftWidth: 4} : null]}>

                    <View style={style.formCardDetail}>
                        <View>
                            {this.props.item.label ?
                                <Text style={[styles.fontDefault, styles.lineHeight25, this.getComponentLabelStyle(this.props.item.focus, this.props.item.editable)]}>
                                    {this.props.item.label}
                                    {this.props.item.required ? null : <Text style={[styles.italic, styles.fontLowGray]}> (optional)</Text>}
                                </Text> : null
                            }
                            {this.props.item.subLabel ?
                                <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20, this.getComponentSubLabelStyle(this.props.item.editable)]}>
                                    {this.props.item.subLabel}
                                </Text> : null}
                            {this.props.item.helpText ?
                                <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20, styles.italic, this.getComponentHelpTextStyle(this.props.item.editable)]}>
                                    {this.props.item.helpText}
                                </Text> : null}
                            {this.props.item.value
                                && this.props.item.value != ARRAY_SAROJ_FAREYE
                                && this.props.item.value != OBJECT_SAROJ_FAREYE
                                && this.props.item.attributeTypeId != SIGNATURE
                                && this.props.item.attributeTypeId != CAMERA
                                && this.props.item.attributeTypeId != CAMERA_HIGH
                                && this.props.item.attributeTypeId != CAMERA_MEDIUM
                                ?
                                <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20, this.getComponentLabelStyle(this.props.item.editable)]}>
                                    {this.props.item.value}
                                </Text> : null}
                            {this.props.item.alertMessage ?
                                <Text style={[styles.fontDanger, styles.fontSm, styles.paddingTop5]}>{this.props.item.alertMessage}</Text>
                                : null}
                        </View>
                    </View>
                    <View style={style.iconContainer}>
                        {this.props.item.value || this.props.item.value === 0 ?
                            <View style={[styles.marginRight10]}>
                                <Icon name="ios-checkmark-circle" style={[styles.fontXl, styles.fontSuccess, styles.fontXxl]} />
                            </View>
                            : null}
                        {icon}
                        <Icon name="ios-arrow-forward" style={[styles.fontBlack, styles.fontLg, styles.marginLeft10, this.getComponentSubLabelStyle(this.props.item.editable)]} />
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0
    },
    headerLeft: {
        width: '15%',
        padding: 15
    },
    headerBody: {
        width: '70%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerRight: {
        width: '15%',
        padding: 15
    },
    dropDown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#d3d3d3'
    },
    listIcon: {
        width: 50,
        height: 50,
        backgroundColor: 'green',
        borderRadius: 3,
    },
    formCard: {
        minHeight: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingTop: 40,
        paddingBottom: 40,
        backgroundColor: '#ffffff'
    },
    iconContainer: {
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    formCardDetail: {
        flex: 1,
        paddingRight: 10,
        flexDirection: 'row',
    },
    footer: {
        height: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3'
    },

});

export default FormLayoutActivityComponent