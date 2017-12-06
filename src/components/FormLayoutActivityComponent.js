'use strict'
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableHighlight,
} from 'react-native'
import { Container, Card, CardItem, Body, Icon, Right } from 'native-base'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import SearchIcon from '../../src/svg_components/icons/SearchIcon'
import CameraIcon from '../svg_components/icons/CameraIcon'
import CartIcon from '../svg_components/icons/CartIcon'
import StarIcon from '../svg_components/icons/StarIcon'
import PaperMoneyIcon from '../svg_components/icons/PaperMoneyIcon'
import QRIcon from '../svg_components/icons/QRIcon'
import BankCardIcon from '../svg_components/icons/BankCardIcon'
import {
    ARRAY,
    CASH_TENDERING,
    DATA_STORE,
    MONEY_COLLECT,
    MONEY_PAY,
    NPS_FEEDBACK,
    SIGNATURE,
    SIGNATURE_AND_FEEDBACK,
    SKU_ARRAY,
} from '../lib/AttributeConstants'

class FormLayoutActivityComponent extends Component {

    getIcon(attributeTypeId) {
        switch (attributeTypeId) {
            case ARRAY: return <QRIcon width={30} height={30} color={this.getComponentIconStyle(this.props.item.editable)} />
            case CASH_TENDERING: return <PaperMoneyIcon width={30} height={30} color={this.getComponentIconStyle(this.props.item.editable)} />
            case DATA_STORE: return <StarIcon width={30} height={30} color={this.getComponentIconStyle(this.props.item.editable)} />
            case MONEY_COLLECT:
            case MONEY_PAY: return <BankCardIcon width={26} height={19} color={this.getComponentIconStyle(this.props.item.editable)} />
            case NPS_FEEDBACK:
            case SIGNATURE:
            case SIGNATURE_AND_FEEDBACK: return <StarIcon width={30} height={30} color={this.getComponentIconStyle(this.props.item.editable)} />
            case SKU_ARRAY: return <CartIcon size={30} color={this.getComponentIconStyle(this.props.item.editable)} />
            default: return <QRIcon width={30} height={30} color={this.getComponentIconStyle(this.props.item.editable)} />
        }
    }

    getComponentLabelStyle(focus, editable) {
        return focus ? styles.fontPrimary : editable ? styles.fontBlack : styles.fontLowGray
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
        console.log('FormLayoutActivityComponent', this.props.item)
        return (
            <TouchableHighlight disabled={!this.props.item.editable} onPress={() => this.props.press(this.props.item)}>
                <View style={[style.formCard, this.props.item.focus ? styles.borderLeft4 : null]}>

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