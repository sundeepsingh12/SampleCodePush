'use strict'
import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    FlatList,
    TouchableHighlight,
    ActivityIndicator,
    Modal,
    Keyboard,
    TouchableOpacity
}
    from 'react-native'
import { Container, Content, Input, Card, CardItem, Button, Body, Header, Left, Right, Icon, Toast, Item, Label } from 'native-base'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import FormLayoutActivityComponent from '../components/FormLayoutActivityComponent'
import * as cashTenderingActions from '../modules/cashTendering/cashTenderingActions'
import SelectFromList from '../containers/SelectFromList'
import MultipleOptionsAttribute from '../containers/MultipleOptionsAttribute'
import QRIcon from '../svg_components/icons/QRIcon'

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
    SIGNATURE_AND_FEEDBACK,
    STRING,
    TEXT,
    NUMBER,
    DECIMAL,
    SKU_ARRAY,
    DATA_STORE,
    EXTERNAL_DATA_STORE,
    SEQUENCE,
    PASSWORD,
    CASH_TENDERING,
    ARRAY,
    OBJECT,
    CASH,
    OPTION_RADIO_FOR_MASTER,
    QR_SCAN,
    CAMERA,
    CAMERA_HIGH,
    CAMERA_MEDIUM,
    SCAN_OR_TEXT,
    CONTACT_NUMBER,
    ARRAY_SAROJ_FAREYE,
    OBJECT_SAROJ_FAREYE,
    BEFORE,
    AFTER
} from '../lib/AttributeConstants'

import {
    NEXT_FOCUS,
    CameraAttribute,
    Payment,
    SET_MODAL_FIELD_ATTRIBUTE
} from '../lib/constants'
import {
    OPTIONAL,
    SELECTED
} from '../lib/ContainerConstants'
import * as globalActions from '../modules/global/globalActions'
import NPSFeedback from '../components/NPSFeedback'
import TimePicker from '../components/TimePicker'

function mapStateToProps(state) {
    return {
        formElement: state.formLayout.formElement,
        modalFieldAttributeMasterId: state.formLayout.modalFieldAttributeMasterId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...formLayoutActions, ...cashTenderingActions, ...globalActions }, dispatch)
    }
}
class BasicFormElement extends PureComponent {

    navigateToScene = (item) => {
        let screenName = ''
        let cash = 0
        this.props.actions.fieldValidations(item, this.props.formElement, BEFORE, this.props.jobTransaction, this.props.isSaveDisabled, this.props.fieldAttributeMasterParentIdMap)
        switch (item.attributeTypeId) {
            case MONEY_PAY:
            case MONEY_COLLECT: {
                screenName = Payment
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
            case SIGNATURE_AND_FEEDBACK: {
                screenName = 'SignatureAndNps'
                break
            }
            case ARRAY: {
                screenName = 'ArrayFieldAttribute'
                break
            }
            case QR_SCAN: {
                screenName = 'QrCodeScanner'
                break
            }
            case CAMERA:
            case CAMERA_MEDIUM:
            case CAMERA_HIGH: {
                screenName = CameraAttribute
                break
            }
            default: {
                break
            }
        }

        this.props.actions.navigateToScene(screenName,
            {
                currentElement: item,
                formElements: this.props.formElement,
                jobStatusId: this.props.jobStatusId,
                jobTransaction: this.props.jobTransaction,
                latestPositionId: this.props.latestPositionId,
                isSaveDisabled: this.props.isSaveDisabled,
                cash: cash,
                returnData: this._searchForReferenceValue.bind(this),
                fieldAttributeMasterParentIdMap: this.props.fieldAttributeMasterParentIdMap,
            }
        )
    }

    _searchForReferenceValue = (value) => {
        this.props.actions.checkUniqueValidationThenSave(this.props.item, this.props.formElement, this.props.isSaveDisabled, value, { latestPositionId: this.props.latestPositionId }, this.props.jobTransaction)
    }

    onFocusEvent(currentElement) {
        this.props.actions.fieldValidations(currentElement, this.props.formElement, BEFORE, this.props.jobTransaction, this.props.isSaveDisabled, this.props.fieldAttributeMasterParentIdMap)
        if (currentElement && !currentElement.displayValue && currentElement.attributeTypeId == 62) {
            currentElement.editable = false
            Keyboard.dismiss();
            this.props.actions.setSequenceDataAndNextFocus(currentElement.fieldAttributeMasterId, this.props.formElement, this.props.isSaveDisabled, currentElement.sequenceMasterId, this.props.jobTransaction)
        }
    }

    _onBlurEvent(currentElement) {
        if (currentElement.attributeTypeId == SCAN_OR_TEXT || currentElement.attributeTypeId == QR_SCAN) {
            this.props.actions.checkUniqueValidationThenSave(currentElement, this.props.formElement, this.props.isSaveDisabled, currentElement.displayValue, { latestPositionId: this.props.latestPositionId }, this.props.jobTransaction)
        }
        this.props.actions.fieldValidations(currentElement, this.props.formElement, AFTER, this.props.jobTransaction, this.props.fieldAttributeMasterParentIdMap)
    }

    _getNextFocusableElement(fieldAttributeMasterId, formElement, value, isSaveDisabled) {
        if (value.length < 2 && formElement.get(fieldAttributeMasterId).attributeTypeId != 62) {
            this.props.actions.getNextFocusableAndEditableElements(fieldAttributeMasterId, formElement, isSaveDisabled, value, null, this.props.jobTransaction, this.props.fieldAttributeMasterParentIdMap);
        }
        else {
            this.props.actions.updateFieldData(fieldAttributeMasterId, value, formElement);
        }
    }

    onSaveDateTime = (value) => {
        this.props.actions.updateFieldDataWithChildData(this.props.item.fieldAttributeMasterId, this.props.formElement, this.props.isSaveDisabled, value + '', { latestPositionId: this.props.latestPositionId }, this.props.jobTransaction, this.props.fieldAttributeMasterParentIdMap, true)
    }

    onPressModal = () => {
        this.props.actions.setState(SET_MODAL_FIELD_ATTRIBUTE, this.props.item.fieldAttributeMasterId)
    }

    onCloseModal = () => {
        this.props.actions.setState(SET_MODAL_FIELD_ATTRIBUTE, null)
    }

    getComponentLabelStyle(focus, editable) {
        return focus ? styles.fontPrimary : editable ? styles.fontBlack : styles.fontLowGray
    }

    getComponentSubLabelStyle(editable) {
        return editable ? styles.fontDarkGray : styles.fontLowGray
    }

    getModalView() {
        if (!this.props.modalFieldAttributeMasterId || this.props.modalFieldAttributeMasterId !== this.props.item.fieldAttributeMasterId) {
            return null
        }
        let attributeTypeId = this.props.formElement.get(this.props.modalFieldAttributeMasterId).attributeTypeId
        console.log(attributeTypeId)
        if (attributeTypeId == CHECKBOX || attributeTypeId == OPTION_RADIO_FOR_MASTER || attributeTypeId == RADIOBUTTON || attributeTypeId == DROPDOWN) {
            return (
                <View>
                    <MultipleOptionsAttribute
                        currentElement={this.props.item}
                        formElements={this.props.formElement}
                        isSaveDisabled={this.props.isSaveDisabled}
                        jobTransaction={this.props.jobTransaction}
                        jobStatusId={this.props.jobStatusId}
                        latestPositionId={this.props.latestPositionId}
                        fieldAttributeMasterParentIdMap={this.props.fieldAttributeMasterParentIdMap}
                    />
                </View>
            )
        }
        if (attributeTypeId == NPS_FEEDBACK) {
            return (
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        onRequestClose={this.onCloseModal}>
                        <TouchableHighlight
                            style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]}>
                            <TouchableHighlight style={{ backgroundColor: '#ffffff', flex: .6 }}>
                                <View>
                                    <NPSFeedback
                                        onSave={this.onSaveDateTime} onCancel={this.onCloseModal} item={this.props.item}
                                    />
                                </View>
                            </TouchableHighlight>
                        </TouchableHighlight>
                    </Modal>
                </View>
            )
        }
        if (attributeTypeId == TIME || attributeTypeId == DATE || attributeTypeId == RE_ATTEMPT_DATE) {
            return (
                <TimePicker onSave={this.onSaveDateTime} onCancel={this.onCloseModal} item={this.props.item} />
            )
        }
        return null
    }

    goToQRCode = () => {
        this.props.actions.navigateToScene('QrCodeScanner',
            {
                formElements: this.props.formElement,
                jobStatusId: this.props.jobStatusId,
                jobTransaction: this.props.jobTransaction,
                latestPositionId: this.props.latestPositionId,
                isSaveDisabled: this.props.isSaveDisabled,
                returnData: this._searchForReferenceValue.bind(this)
            })
    }

    getMultipleOptionCardView(modalView) {
        return (
            <TouchableOpacity
                style={[{ paddingVertical: 50 }, this.props.item.focus ? styles.borderLeft4 : null]}
                onPress={() => { this.props.actions.setState(SET_MODAL_FIELD_ATTRIBUTE, this.props.item.fieldAttributeMasterId) }}
                disabled={this.props.modalFieldAttributeMasterId ? true : false}
            >
                <View style={[styles.marginHorizontal10]}>
                    {modalView}
                    <View style={[styles.borderBottomBlack, styles.relative]}>
                        <Text style={[styles.marginBottom10, this.getComponentLabelStyle(this.props.item.focus, this.props.item.editable), styles.fontDefault]}>
                            {this.props.item.label}
                            {this.props.item.required ? null : <Text style={[styles.italic, styles.fontLowGray]}> {OPTIONAL}</Text>}
                        </Text>
                        {this.props.item.subLabel ?
                            <Text style={[styles.fontSm, styles.marginBottom10, this.getComponentSubLabelStyle(this.props.item.editable)]}>{this.props.item.subLabel}</Text>
                            : null}
                        {this.props.item.helpText ?
                            <Text style={[styles.fontSm, styles.marginBottom10, this.getComponentSubLabelStyle(this.props.item.editable)]}>{this.props.item.helpText}</Text>
                            : null}
                        <Text style={[this.getComponentLabelStyle(this.props.item.focus, this.props.item.editable), styles.fontLg, styles.marginBottom10]}>
                            {this.props.item.value ? (this.props.item.value == ARRAY_SAROJ_FAREYE || this.props.item.value == OBJECT_SAROJ_FAREYE) ? this.props.item.childDataList ? this.props.item.childDataList.length + SELECTED : null : this.props.item.value : this.props.item.helpText}
                        </Text>
                        <Icon name="md-arrow-dropdown" style={[styles.absolute, styles.fontLg, this.getComponentLabelStyle(this.props.item.focus, this.props.item.editable), { bottom: 10, right: 0 }]} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        if (this.props.item.hidden) {
            return null
        }
        let modalView = this.getModalView()
        let multipleOptionCardView = this.getMultipleOptionCardView(modalView)

        switch (this.props.item.attributeTypeId) {
            case STRING:
            case TEXT:
            case NUMBER:
            case DECIMAL:
            case SEQUENCE:
            case PASSWORD:
            case SCAN_OR_TEXT:
            case CONTACT_NUMBER:
                return (
                    <View>
                        <View style={[styles.bgWhite, styles.paddingLeft10, styles.paddingRight10, styles.relative, { paddingTop: 40, paddingBottom: 40 }, this.props.item.focus ? styles.borderLeft4 : null]}>
                            {this.props.item.label ?
                                <Label style={[styles.fontDefault, this.getComponentLabelStyle(this.props.item.focus, this.props.item.editable)]}>{this.props.item.label}
                                    {this.props.item.required ? null : <Text style={[styles.italic, styles.fontLowGray]}> {OPTIONAL}</Text>}
                                </Label>
                                : null}
                            {this.props.item.subLabel ?
                                <Label style={[styles.fontSm, this.getComponentSubLabelStyle(this.props.item.editable)]}>{this.props.item.subLabel}</Label>
                                : null}
                            <View>
                                {renderIf((this.props.item.attributeTypeId == 62),
                                    this.props.item.displayValue ?
                                        <Icon name='ios-checkmark' style={StyleSheet.flatten([styles.fontXxxl, styles.marginRight20, styles.absolute, { top: 10, right: 10 }, styles.fontSuccess, { marginTop: -10 }])} /> :
                                        (this.props.item.isLoading) ?
                                            <ActivityIndicator animating={true} style={StyleSheet.flatten([styles.absolute, styles.marginRight20, { top: 10, right: 10 }, { marginTop: -10 }])} size="small" color="green" /> : null
                                )}
                                <Item stackedLabel>
                                    <Input
                                        autoCapitalize="none"
                                        placeholder={this.props.item.helpText}
                                        placeholderTextColor={styles.fontLowGray.color}
                                        defaultValue={this.props.item.displayValue}
                                        style={[styles.paddingLeft0, (this.props.item.attributeTypeId == SCAN_OR_TEXT) ? { paddingRight: 45 } : null]}
                                        value={this.props.item.displayValue}
                                        keyboardType={(this.props.item.attributeTypeId == 6 || this.props.item.attributeTypeId == 13 || this.props.item.attributeTypeId == CONTACT_NUMBER) ? 'numeric' : 'default'}
                                        editable={this.props.item.editable}
                                        multiline={this.props.item.attributeTypeId == 2 ? true : false}
                                        onChangeText={value => this._getNextFocusableElement(this.props.item.fieldAttributeMasterId, this.props.formElement, value, this.props.isSaveDisabled)}
                                        onFocus={() => { this.onFocusEvent(this.props.item) }}
                                        onEndEditing={(e) => this._onBlurEvent(this.props.item)}
                                        secureTextEntry={this.props.item.attributeTypeId == 61 ? true : false}
                                    />
                                </Item>
                                {(this.props.item.attributeTypeId == SCAN_OR_TEXT) ?
                                    <TouchableHighlight
                                        style={[styles.absolute, { top: 10, right: 10 }]}
                                        onPress={this.goToQRCode}
                                    >
                                        <View>
                                            <QRIcon width={30} height={30} color={this.getComponentLabelStyle(this.props.item.focus, this.props.item.editable)} />
                                        </View>
                                    </TouchableHighlight> : null}
                            </View>
                            {this.props.item.alertMessage ?
                                <Label style={[styles.fontDanger, styles.fontSm, styles.paddingTop10]}>{this.props.item.alertMessage}</Label>
                                : null}
                        </View>
                    </View>
                )

            case FIXED_SKU:
            case SIGNATURE:
            case MONEY_PAY:
            case SKU_ARRAY:
            case MONEY_COLLECT:
            case CASH_TENDERING:
            case SIGNATURE_AND_FEEDBACK:
            case ARRAY:
            case DATA_STORE:
            case EXTERNAL_DATA_STORE:
            case QR_SCAN:
            case CAMERA:
            case CAMERA_HIGH:
            case CAMERA_MEDIUM:
                return <FormLayoutActivityComponent item={this.props.item} press={this.navigateToScene} />
            case NPS_FEEDBACK:
                return <View>
                    {modalView}
                    <FormLayoutActivityComponent item={this.props.item} press={this.onPressModal} />
                </View>
            case CHECKBOX:
            case RADIOBUTTON:
            case DROPDOWN:
            case OPTION_RADIO_FOR_MASTER:
                return (
                    <View>
                        {multipleOptionCardView}
                    </View>
                )
            case DATE:
            case RE_ATTEMPT_DATE:
            case TIME:
                return (
                    <View>
                        {modalView}
                        <FormLayoutActivityComponent item={this.props.item} press={this.onPressModal} />
                    </View>
                )
            default:
                return (
                    <FormLayoutActivityComponent item={this.props.item} press={this.navigateToScene} />
                )
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BasicFormElement)


