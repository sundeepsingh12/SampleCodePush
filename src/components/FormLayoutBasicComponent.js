'use strict'
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    FlatList,
    TouchableHighlight,
    ActivityIndicator
}
    from 'react-native'
import { Container, Content, Input, Card, CardItem, Button, Body, Header, Left, Right, Icon, TextInput, Toast } from 'native-base'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import FormLayoutActivityComponent from '../components/FormLayoutActivityComponent'
import * as cashTenderingActions from '../modules/cashTendering/cashTenderingActions'

import {
    MONEY_COLLECT,
    MONEY_PAY,
    CHECKBOX,
    RADIOBUTTON,
    DROPDOWN,
    NPS_FEEDBACK,
    TIME,
    RE_ATTEMPT_DATE,
    DATE,
    FIXED_SKU,
    SIGNATURE,
    SIGNATURE_AND_NPS,
    STRING,
    TEXT,
    NUMBER,
    DECIMAL,
    SKU_ARRAY,
    DATA_STORE,
    EXTERNAL_DATA_STORE,
    SEQUENCE,
    PASSWORD,
    ARRAY,
    CASH_TENDERING,
    ARRAY,
    OBJECT,
    CASH,
    OPTION_RADIO_FOR_MASTER,
} from '../lib/AttributeConstants'

import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
    return {
        formElement: state.formLayout.formElement
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...formLayoutActions, ...cashTenderingActions, ...globalActions }, dispatch)
    }
}

class BasicFormElement extends Component {
    constructor(props) {
        super(props);
        //TODO this object can be removed if fieldData on updation is removed
        this.formElementValue = {}
    }
    componentWillMount = () => {
        if (this.props.item.attributeTypeId == 62 && (this.props.item.showCheckMark == undefined) && this.props.item.focus == true && !this.props.item.value) {
            this.props.item.isLoading = true
            this.props.actions.setSequenceDataAndNextFocus(this.props.item.fieldAttributeMasterId, this.props.formElement, this.props.nextEditable,
                this.props.isSaveDisabled, this.props.item.sequenceMasterId)
        }
    }


    navigateToScene = (item) => {
        let screenName = ''
        let cash = 0
        console.log("attrrrr", item.attributeTypeId)
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
            case DROPDOWN: {
                screenName = 'SelectFromList'
                break
            }
            case OPTION_RADIO_FOR_MASTER: {
                screenName = 'SelectFromList'
                break
            }
            case FIXED_SKU: {
                screenName = 'FixedSKUListing'
                break
            }
            case CASH_TENDERING: {
                cash = this.props.actions.checkForCash(this.props.formElement, this.props.item)
                if (cash > 0) {
                    screenName = 'CashTendering'
                } else {
                    screenName = null
                    { Toast.show({ text: "NOT REQUIRED", position: 'bottom', buttonText: 'Okay' }) }
                }
                break
            }
            case SIGNATURE: {
                screenName = 'Signature'
                break
            }
            case SKU_ARRAY: {
                screenName = 'SkuListing'
                break
            }
            case EXTERNAL_DATA_STORE:
            case DATA_STORE: {
                screenName = 'DataStore'
                break
            }
            case SIGNATURE_AND_NPS: {
                screenName = 'SignatureAndNps'
                break
            }
            case ARRAY: {
                screenName = 'ArrayFieldAttribute'
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
                isSaveDisabled: this.props.isSaveDisabled,
                cash: cash
            }
        )
    }

    onFocusEvent(currentElement) {
        this.props.actions.fieldValidations(currentElement, this.props.formElement, 'Before', this.props.jobTransaction)
    }


    _onBlurEvent(attributeId) {
        //TODo remove the below code to update field data if performance remains fine on updation of value on onChangeText
        this.props.actions.updateFieldData(attributeId, this.formElementValue[attributeId], this.props.formElement);
        const nextEditableElement = this.props.nextEditable[attributeId];
        if (nextEditableElement != null && nextEditableElement.length != 0) {
            nextEditableElement.forEach((nextElement) => {
                if ((typeof (nextElement) == 'string')) {
                    nextElement = this.props.formElement.get(Number(nextElement.split('$$')[1]));
                    if (nextElement && !nextElement.value && nextElement.attributeTypeId == 62) {
                        nextElement.isLoading = true;
                        this.props.actions.setSequenceDataAndNextFocus(nextElement.fieldAttributeMasterId, this.props.formElement, this.props.nextEditable,
                            this.props.isSaveDisabled, nextElement.sequenceMasterId)
                    }
                }
            })
        }
    }

    _getNextFocusableElement(fieldAttributeMasterId, formElement, nextEditable, value, isSaveDisabled) {
        this.formElementValue[fieldAttributeMasterId] = value;
        //TODO remove commented code, if performance with new code is fine
        /*
        if (value && value.length == 1) {
            // then fire action to get next editable and focusable elements and update the value in store
            this.props.actions.getNextFocusableAndEditableElements(fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, value);
        }
        */
        if (value) {
            // then fire action to get next editable and focusable elements and update the value in state
            this.props.actions.getNextFocusableAndEditableElements(fieldAttributeMasterId, formElement, nextEditable, isSaveDisabled, value);
        }
        if (value.length == 0) {
            this.props.actions.disableSaveIfRequired(fieldAttributeMasterId, isSaveDisabled, formElement, value);
            this.props.actions.updateFieldData(fieldAttributeMasterId, this.formElementValue[fieldAttributeMasterId], formElement);
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
            case SEQUENCE:
            case PASSWORD:
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

                                                    {renderIf(this.props.item.showCheckMark || (this.props.item.attributeTypeId == 62 && this.props.item.isLoading !== undefined && this.props.item.isLoading),
                                                        this.props.item.showCheckMark ?
                                                            <Icon name='ios-checkmark' style={StyleSheet.flatten([styles.fontXxxl, styles.fontSuccess, { marginTop: -5 }])} /> :
                                                            (this.props.item.isLoading !== undefined && this.props.item.isLoading) ?
                                                                <ActivityIndicator animating={this.props.item.isLoading} style={StyleSheet.flatten([{ marginTop: -20 }])} size="small" color="green" /> : null
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
                                                    autoCapitalize="none"
                                                    keyboardType={(this.props.item.attributeTypeId == 6 || this.props.item.attributeTypeId == 13) ? 'numeric' : 'default'}
                                                    editable={this.props.item.editable}
                                                    multiline={this.props.item.attributeTypeId == 2 ? true : false}
                                                    placeholder='Regular Textbox'
                                                    onChangeText={value => this._getNextFocusableElement(this.props.item.fieldAttributeMasterId, this.props.formElement, this.props.nextEditable, value, this.props.isSaveDisabled)}
                                                    onFocus={() => { this.onFocusEvent(this.props.item) }}
                                                    onBlur={(e) => this._onBlurEvent(this.props.item.fieldAttributeMasterId)}
                                                    secureTextEntry={this.props.item.attributeTypeId == 61 ? true : false}
                                                    value={this.props.item.value}
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
            case CASH_TENDERING:
            case SIGNATURE_AND_NPS:
            case ARRAY:
            case EXTERNAL_DATA_STORE:
            case DATA_STORE:
                return <FormLayoutActivityComponent item={this.props.item} press={this.navigateToScene} />

            default:
                return (
                    <FormLayoutActivityComponent item={this.props.item} press={this.navigateToScene} />
                )
                break;
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BasicFormElement)


