'use strict'
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    FlatList,
    TouchableHighlight
}
    from 'react-native'
import { Container, Content, Footer, Thumbnail, FooterTab, Input, Card, CardItem, Button, Body, Header, Left, Right, Icon, TextInput } from 'native-base';
import styles from '../themes/FeStyle'
import imageFile from '../../images/fareye-logo.png'
import renderIf from '../lib/renderIf'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import FormLayoutActivityComponent from '../components/FormLayoutActivityComponent'
import {
    MONEY_COLLECT,
    MONEY_PAY,
    CHECKBOX,
    RADIOBUTTON,
    NPS_FEEDBACK,
    TIME,
    RE_ATTEMPT_DATE,
    DATE,
    FIXED_SKU,
    SIGNATURE,
    STRING,
    TEXT,
    NUMBER,
    DECIMAL,
    SKU_ARRAY
} from '../lib/AttributeConstants'

import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
    return {
        formElement: state.formLayout.formElement
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...formLayoutActions, ...globalActions }, dispatch)
    }
}

class BasicFormElement extends Component {
    constructor(props) {
        super(props);
        this.formElementValue = {}
    }

    navigateToScene = (item) => {
        let screenName = ''
        console.log("attrrrr",item.attributeTypeId)
        switch (item.attributeTypeId) {
            case MONEY_PAY:
            case MONEY_COLLECT: {
                screenName = 'Payment'
                break
            }
            case CHECKBOX: {
                screenName = 'SelectFromList'
                break
            }
            case RADIOBUTTON: {
                screenName = 'SelectFromList'
                break
            }
            case FIXED_SKU: {
                screenName = 'FixedSKUListing'
                break
            }
            case SIGNATURE: {
                screenName = 'Signature'
                break
            }
            case SKU_ARRAY:{
                screenName='SkuListing'
                break
            }
            default: {
                screenName = 'OverlayAttributes'
            }
        }

        this.props.actions.navigateToScene(screenName,
            {
                currentElement: item,
                formElements: this.props.formElement,
                jobStatusId: this.props.jobStatusId,
                jobTransaction: this.props.jobTransaction,
                latestPositionId: this.props.latestPositionId,
                nextEditable: this.props.nextEditable,
                isSaveDisabled: this.props.isSaveDisabled
            }
        )

    }

    onFocusEvent(currentElement) {
        this.props.actions.fieldValidations(currentElement,this.props.formElement,'Before')          
    }
        

    _onBlurEvent(attributeId) {
        this.props.actions.updateFieldData(attributeId, this.formElementValue[attributeId], this.props.formElement);
    }

    _getNextFocusableElement(fieldAttributeMasterId, formElement, nextEditable, value, isSaveDisabled) {
        this.formElementValue[fieldAttributeMasterId] = value;
        if (value && value.length == 1) {
            // then fire action to get next editable and focusable elements
            this.props.actions.getNextFocusableAndEditableElements(fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, value);
        }
        if (value.length == 0) {
            this.props.actions.disableSaveIfRequired(fieldAttributeMasterId, isSaveDisabled, formElement, value);
        }
    }

    _onPressHelpText(fieldAttributeMasterId) {
        this.props.actions.toogleHelpText(fieldAttributeMasterId, this.props.formElement);
    }

    _styleNextFocusable(isFocusable) {
        if (isFocusable) {
            return {
                backgroundColor: 'blue'
            }
        }
    }

    render() {
        switch (this.props.item.attributeTypeId) {
            case STRING:
            case TEXT:
            case NUMBER:
            case DECIMAL:
                return (
                    renderIf(!this.props.item.hidden,
                        <Card>
                            <CardItem>
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

                                                <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, { flexBasis: '20%' }])}>

                                                    {renderIf(this.props.item.showCheckMark,
                                                        <Icon name='ios-checkmark' style={StyleSheet.flatten([styles.fontXxxl, styles.fontSuccess, { marginTop: -5 }])} />
                                                    )}

                                                    {renderIf((this.props.item.helpText && this.props.item.helpText.length > 0),
                                                        <View>
                                                            <TouchableHighlight underlayColor='#e7e7e7' onPress={() => this._onPressHelpText(this.props.item.fieldAttributeMasterId)}>
                                                                <Icon name='ios-help-circle-outline' style={StyleSheet.flatten([styles.fontXl])} />
                                                            </TouchableHighlight>
                                                        </View>
                                                    )}


                                                </View>
                                            </View>
                                            <View style={this._styleNextFocusable(this.props.item.focus)}>
                                                <Input
                                                    keyboardType={(this.props.item.attributeTypeId == 6 || this.props.item.attributeTypeId == 13) ? 'numeric' : 'default'}
                                                    editable={this.props.item.editable}
                                                    multiline={this.props.item.attributeTypeId == 2 ? true : false}
                                                    placeholder='Regular Textbox'
                                                    onChangeText={value => this._getNextFocusableElement(this.props.item.fieldAttributeMasterId, this.props.formElement, this.props.nextEditable, value, this.props.isSaveDisabled)}
                                                    onBlur={(e) => this._onBlurEvent(this.props.item.fieldAttributeMasterId)}

                                                />
                                            </View>
                                            {
                                                renderIf(this.props.item.helpText && this.props.item.showHelpText,
                                                    <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, { color: '#999999' }])}>
                                                        {this.props.item.helpText} </Text>
                                                )}
                                        </View>
                                    </View>
                                </Body>
                            </CardItem>
                        </Card>
                    )
                )

            case FIXED_SKU:
            case SIGNATURE:
            case MONEY_PAY:
            case SKU_ARRAY:
            case MONEY_COLLECT: 
            case NPS_FEEDBACK:
            case TIME:
            case RE_ATTEMPT_DATE:
            case DATE:
                return (
                    <FormLayoutActivityComponent item={this.props.item} press={this.navigateToScene} />
                )

            default: console.log("FormLayoutActivityComponent")
                return (
                     <FormLayoutActivityComponent item={this.props.item} press={this.navigateToScene} />
                )
                     break;
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BasicFormElement)


