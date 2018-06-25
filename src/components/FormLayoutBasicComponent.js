'use strict'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, TouchableHighlight, ActivityIndicator, Modal, Keyboard, TouchableOpacity, } from 'react-native'
import { Input, Icon, Item, Label } from 'native-base'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import FormLayoutActivityComponent from '../components/FormLayoutActivityComponent'
import * as cashTenderingActions from '../modules/cashTendering/cashTenderingActions'
import MultipleOptionsAttribute from '../containers/MultipleOptionsAttribute'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DataStoreFilter from '../containers/DataStoreFilter'
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
    OPTION_RADIO_VALUE,
    QR_SCAN,
    CAMERA,
    CAMERA_HIGH,
    CAMERA_MEDIUM,
    SCAN_OR_TEXT,
    CONTACT_NUMBER,
    DATA_STORE_FILTER,
    ARRAY_SAROJ_FAREYE,
    OBJECT_SAROJ_FAREYE,
    BEFORE,
    AFTER,
    ADVANCE_DROPDOWN
} from '../lib/AttributeConstants'

import { CameraAttribute, Payment, SET_MODAL_FIELD_ATTRIBUTE } from '../lib/constants'
import { OPTIONAL, SELECTED } from '../lib/ContainerConstants'
import * as globalActions from '../modules/global/globalActions'
import NPSFeedback from '../components/NPSFeedback'
import TimePicker from '../components/TimePicker'
import { checkForNewJob } from '../modules/skulisting/skuListingActions'

function mapStateToProps(state) {
    return {
        formElement: state.formLayout.formElement,
        modalFieldAttributeMasterId: state.formLayout.modalFieldAttributeMasterId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...formLayoutActions, ...cashTenderingActions, ...globalActions, checkForNewJob }, dispatch)
    }
}
class BasicFormElement extends PureComponent {

    navigateToScene = (item) => {
        let screenName = ''
        if (item.attributeTypeId != DATA_STORE && item.attributeTypeId != EXTERNAL_DATA_STORE) {
            this.props.actions.fieldValidations(item, this.props.formLayoutState, BEFORE, this.props.jobTransaction)
        }
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
                this.props.actions.checkForCash({
                    currentElement: item,
                    jobTransaction: this.props.jobTransaction,
                    returnData: this._searchForReferenceValue.bind(this),
                    formLayoutState: this.props.formLayoutState
                },
            this.props.navigate)
                break
            }
            case SIGNATURE: {
                screenName = 'Signature'
                break
            }
            case SKU_ARRAY: {
                this.props.actions.checkForNewJob({
                    currentElement: item,
                    jobTransaction: this.props.jobTransaction,
                    returnData: this._searchForReferenceValue.bind(this),
                    formLayoutState: this.props.formLayoutState
                },
                this.props.navigate)
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
        if (screenName) {
            this.props.actions.navigateToScene(screenName,
                {
                    currentElement: item,
                    formLayoutState: this.props.formLayoutState,
                    jobTransaction: this.props.jobTransaction,
                    returnData: this._searchForReferenceValue.bind(this),
                },
                this.props.navigate
            )
        }
    }

    _searchForReferenceValue = (value) => {
        this.props.actions.checkUniqueValidationThenSave(this.props.item, this.props.formLayoutState, value, this.props.jobTransaction)
    }

    onFocusEvent(currentElement) {
        this.props.actions.fieldValidations(currentElement, this.props.formLayoutState, BEFORE, this.props.jobTransaction)
        if (currentElement && !currentElement.displayValue && currentElement.attributeTypeId == 62) {
            Keyboard.dismiss();
            this.props.actions.setSequenceDataAndNextFocus(currentElement, this.props.formLayoutState, currentElement.sequenceMasterId, this.props.jobTransaction)
        }
    }

    _onBlurEvent(currentElement) {
        if (currentElement.attributeTypeId == SCAN_OR_TEXT || currentElement.attributeTypeId == QR_SCAN) {
            this.props.actions.checkUniqueValidationThenSave(currentElement, this.props.formLayoutState, currentElement.displayValue, this.props.jobTransaction)
        }
        this.props.actions.fieldValidations(currentElement, this.props.formLayoutState, AFTER, this.props.jobTransaction)
    }

    _getNextFocusableElement(value) {
        if (value.length < 2 && this.props.formLayoutState.formElement[this.props.item.fieldAttributeMasterId].attributeTypeId != 62) {
            this.props.actions.getNextFocusableAndEditableElements(this.props.item.fieldAttributeMasterId, this.props.formLayoutState, value, null, this.props.jobTransaction);
        }
        else {
            this.props.actions.updateFieldData(this.props.item.fieldAttributeMasterId, value, this.props.formLayoutState, this.props.jobTransaction);
        }
    }

    onSaveDateTime = (value) => {
        this.props.actions.updateFieldDataWithChildData(this.props.item.fieldAttributeMasterId, this.props.formLayoutState, value + '', { latestPositionId: this.props.formLayoutState.latestPositionId }, this.props.jobTransaction, true)
    }

    onPressModal = () => {
        this.props.actions.setState(SET_MODAL_FIELD_ATTRIBUTE, this.props.item.fieldAttributeMasterId)
    }

    onCloseModal = () => {
        this.props.actions.setState(SET_MODAL_FIELD_ATTRIBUTE, null)
    }

    getComponentLabelStyle(focus, editable) {
        return focus ? { color: styles.fontPrimaryColor } : editable ? styles.fontBlack : styles.fontLowGray
    }

    getComponentSubLabelStyle(editable) {
        return editable ? styles.fontDarkGray : styles.fontLowGray
    }

    getModalView() {
        if (!this.props.modalFieldAttributeMasterId || this.props.modalFieldAttributeMasterId !== this.props.item.fieldAttributeMasterId) {
            return null
        }
        let attributeTypeId = this.props.formElement[this.props.modalFieldAttributeMasterId].attributeTypeId
        if (attributeTypeId == CHECKBOX || attributeTypeId == OPTION_RADIO_FOR_MASTER || attributeTypeId == RADIOBUTTON || attributeTypeId == DROPDOWN || attributeTypeId == ADVANCE_DROPDOWN) {
            return (
                <View>
                    <MultipleOptionsAttribute
                        currentElement={this.props.item}
                        formLayoutState={this.props.formLayoutState}
                        jobTransaction={this.props.jobTransaction}
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
                            style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]}
                            onPress={() => this.onCloseModal()}>
                            <TouchableHighlight style={{ backgroundColor: '#ffffff', flex: .2 }}>
                                <View>
                                    <Text style={[styles.alignStart, styles.fontLg, styles.padding10]}>
                                        Rating
                                    </Text>
                                    <View style={[styles.padding20, styles.justifyCenter]}>
                                        <NPSFeedback
                                            onSave={this.onSaveDateTime} onCancel={this.onCloseModal} item={this.props.item}
                                        />
                                    </View>
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

        if (attributeTypeId == DATA_STORE_FILTER) {
            return (
                <View>
                    <DataStoreFilter
                        currentElement={this.props.item}
                        formLayoutState={this.props.formLayoutState}
                        jobTransaction={this.props.jobTransaction}
                        onClose={this.onCloseModal}
                    />
                </View>
            )
        }
        return null
    }

    goToQRCode = () => {
        this.props.actions.navigateToScene('QrCodeScanner',
            {
                returnData: this._searchForReferenceValue.bind(this)
            },
        this.props.navigate)
    }

    getValueTextForMultipleOption() {
        if (!this.props.item.value) {
            return this.props.item.helpText
        }

        if (this.props.item.value == ARRAY_SAROJ_FAREYE && this.props.item.childDataList) {
            return this.props.item.childDataList.length + SELECTED
        }

        if (this.props.item.value == OBJECT_SAROJ_FAREYE && this.props.item.childDataList) {
            for (let index in this.props.item.childDataList) {
                if (this.props.item.childDataList[index].attributeTypeId == OPTION_RADIO_VALUE) {
                    return this.props.item.childDataList[index].value
                }
            }
        }

        if (this.props.item.value != ARRAY_SAROJ_FAREYE && this.props.item.value != OBJECT_SAROJ_FAREYE) {
            return this.props.item.containerValue ? this.props.item.containerValue : this.props.item.value
        }
        return null
    }

    getMultipleOptionCardView(modalView) {
        return (
            <TouchableOpacity
                style={[{ paddingVertical: 50 }, this.props.item.focus ? { borderLeftColor: styles.borderLeft4Color, borderLeftWidth: 4 } : null]}
                onPress={() => { this.props.actions.setState(SET_MODAL_FIELD_ATTRIBUTE, this.props.item.fieldAttributeMasterId) }}
                disabled={!this.props.item.editable || this.props.modalFieldAttributeMasterId ? true : false}
            >
                <View style={[styles.marginHorizontal10]}>
                    {modalView}
                    <View style={[styles.borderBottomGray, styles.relative]}>
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
                            {this.getValueTextForMultipleOption()}
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
                        <View style={[styles.bgWhite, styles.paddingLeft10, styles.paddingRight10, styles.relative, { paddingTop: 40, paddingBottom: 40 }, this.props.item.focus ? { borderLeftColor: styles.borderLeft4Color, borderLeftWidth: 4 } : null]}>
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
                                        returnKeyType='done'
                                        multiline={this.props.item.attributeTypeId == 2 ? true : false}
                                        onChangeText={value => this._getNextFocusableElement(value)}
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
                                            <MaterialCommunityIcons name='qrcode' style={[styles.fontXxl, styles.padding5]} color={this.getComponentLabelStyle(this.props.item.focus, this.props.item.editable).color} />
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
            case CHECKBOX:
            case RADIOBUTTON:
            case DROPDOWN:
            case OPTION_RADIO_FOR_MASTER:
            case ADVANCE_DROPDOWN:
                return (
                    <View>
                        {multipleOptionCardView}
                    </View>
                )
            case DATE:
            case RE_ATTEMPT_DATE:
            case TIME:
            case DATA_STORE_FILTER:
            case NPS_FEEDBACK:
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


