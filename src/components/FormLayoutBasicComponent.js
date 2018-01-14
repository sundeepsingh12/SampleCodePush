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
    Keyboard
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
    CONTACT_NUMBER
} from '../lib/AttributeConstants'

import {
    NEXT_FOCUS,
    CameraAttribute
} from '../lib/constants'
import * as globalActions from '../modules/global/globalActions'
import NPSFeedback from '../components/NPSFeedback'
import TimePicker from '../components/TimePicker'

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
class BasicFormElement extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectFromListEnable: false,
            showNPS: false,
            showDateTimePicker: false,
        }
    }
    navigateToScene = (item) => {
        let screenName = ''
        let cash = 0
        this.props.actions.fieldValidations(item, this.props.formElement, 'Before', this.props.jobTransaction, this.props.isSaveDisabled)
        switch (item.attributeTypeId) {
            case MONEY_PAY:
            case MONEY_COLLECT: {
                screenName = 'Payment'
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
                returnData: this._searchForReferenceValue.bind(this)
            }
        )
    }

    _searchForReferenceValue = (value) => {
        this.props.actions.checkUniqueValidationThenSave(this.props.item, this.props.formElement, this.props.isSaveDisabled, value, { latestPositionId: this.props.latestPositionId }, this.props.jobTransaction)
    }

    onFocusEvent(currentElement) {
        this.props.actions.fieldValidations(currentElement, this.props.formElement, 'Before', this.props.jobTransaction, this.props.isSaveDisabled)
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
        this.props.actions.fieldValidations(currentElement, this.props.formElement, 'After', this.props.jobTransaction)
    }

    _getNextFocusableElement(fieldAttributeMasterId, formElement, value, isSaveDisabled) {
        if (value.length < 2 && formElement.get(fieldAttributeMasterId).attributeTypeId != 62) {
            this.props.actions.getNextFocusableAndEditableElements(fieldAttributeMasterId, formElement, isSaveDisabled, value, null, this.props.jobTransaction);
        }
        else {
            this.props.actions.updateFieldData(fieldAttributeMasterId, value, formElement);
        }
    }

    _inflateModal = () => {
        this.setState(previousState => {
            return {
                selectFromListEnable: !this.state.selectFromListEnable
            }
        })
    }
    onSaveDateTime = (value) => {
        this.props.actions.updateFieldDataWithChildData(this.props.item.fieldAttributeMasterId, this.props.formElement, this.props.isSaveDisabled, value + '', { latestPositionId: this.props.latestPositionId }, this.props.jobTransaction);
        this.setState({ showDateTimePicker: false, showNPS: false })
        //  this.props.actions.fieldValidations(currentElement, this.props.formElement, 'After', this.props.jobTransaction, this.props.isSaveDisabled)
    }

    cancelDateTimePicker = () => {
        this.setState({ showDateTimePicker: false, showNPS: false })
    }
    _dropModal = () => {
        this.setModalVisible(false)
    }
    setModalVisible = (visible) => {
        this.setState(() => {
            return {
                showNPS: visible,
            }
        })
    }
    _showNPS = () => {
        this.setState(previousState => {
            return {
                showNPS: true
            }
        })
        this.props.actions.fieldValidations(this.props.item, this.props.formElement, 'Before', this.props.jobTransaction, this.props.isSaveDisabled)
    }
    _showDateTime = () => {
        this.setState({ showDateTimePicker: true })
        this.props.actions.fieldValidations(this.props.item, this.props.formElement, 'Before', this.props.jobTransaction, this.props.isSaveDisabled)
    }

    getComponentLabelStyle(focus, editable) {
        return focus ? styles.fontPrimary : editable ? styles.fontBlack : styles.fontLowGray
    }

    getComponentSubLabelStyle(editable) {
        return editable ? styles.fontDarkGray : styles.fontLowGray
    }

    getModalView() {
        if (this.state.selectFromListEnable) {
            return (
                <View>
                    <SelectFromList
                        currentElement={this.props.item}
                        formElements={this.props.formElement}
                        isSaveDisabled={this.props.isSaveDisabled}
                        jobTransaction={this.props.jobTransaction}
                        jobStatusId={this.props.jobStatusId}
                        latestPositionId={this.props.latestPositionId}
                        press={this._inflateModal}
                    />
                </View>
            )
        }
        if (this.state.showNPS) {
            return (
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.showNPS}
                        onRequestClose={this._dropModal}>
                        <TouchableHighlight
                            style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]}>
                            <TouchableHighlight style={{ backgroundColor: '#ffffff', flex: .6 }}>
                                <View>
                                    < NPSFeedback
                                        onSave={this.onSaveDateTime} onCancel={this.cancelDateTimePicker} item={this.props.item}
                                    />
                                </View>
                            </TouchableHighlight>
                        </TouchableHighlight>
                    </Modal>
                </View>
            )
        }
        if (this.state.showDateTimePicker) {
            return (
                <TimePicker onSave={this.onSaveDateTime} onCancel={this.cancelDateTimePicker} item={this.props.item} />
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

    render() {
        let modalView = this.getModalView()
        if(this.props.item.hidden) {
            return null
        }
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
                        {renderIf(!this.props.item.hidden,
                            <View style={[styles.bgWhite, styles.paddingLeft10, styles.paddingRight10, styles.relative, { paddingTop: 40, paddingBottom: 40 }, this.props.item.focus ? styles.borderLeft4 : null]}>
                                {this.props.item.label ?
                                    <Label style={[styles.fontDefault, this.getComponentLabelStyle(this.props.item.focus, this.props.item.editable)]}>{this.props.item.label}
                                        {this.props.item.required ? null : <Text style={[styles.italic, styles.fontLowGray]}> (optional)</Text>}
                                    </Label>
                                    : null}
                                {this.props.item.subLabel ?
                                    <Label style={[styles.fontSm, this.getComponentSubLabelStyle(this.props.item.editable)]}>{this.props.item.subLabel}</Label>
                                    : null}
                                <View>
                                {renderIf((this.props.item.attributeTypeId == 62 ),
                                                        this.props.item.displayValue ?
                                                            <Icon name='ios-checkmark' style={StyleSheet.flatten([styles.fontXxxl,styles.marginRight20,styles.absolute, { top: 10, right: 10 }, styles.fontSuccess, { marginTop: -10 }])} /> :
                                                            ( this.props.item.isLoading) ?
                                                                <ActivityIndicator animating={true} style={StyleSheet.flatten([styles.absolute,styles.marginRight20, { top: 10, right: 10 },{ marginTop: -10 }])} size="small" color="green" /> : null
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
                                {/* <View style={[styles.row, styles.jus, styles.alignCenter, styles.paddingTop10, styles.paddingBottom5]}>
                                <Icon name="md-information-circle" style={[styles.fontDanger, styles.fontLg]} />
                                <Text style={[styles.fontSm, styles.fontDanger, styles.marginLeft5]}>error Message</Text>
                            </View> */}
                            </View>

                        )}
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
                return (
                    renderIf(!this.props.item.hidden,
                        <FormLayoutActivityComponent item={this.props.item} press={this.navigateToScene} />)
                )
            case NPS_FEEDBACK:
                return (<View>
                    {modalView}
                    {renderIf(!this.props.item.hidden,
                        <FormLayoutActivityComponent item={this.props.item} press={this._showNPS} />)}
                </View>)
            case CHECKBOX:
            case RADIOBUTTON:
            case DROPDOWN:
            case OPTION_RADIO_FOR_MASTER:
                return (
                    <View>
                        {modalView}
                        {renderIf(!this.props.item.hidden,
                            <FormLayoutActivityComponent item={this.props.item} press={this._inflateModal} />)}
                    </View>
                )
            case DATE:
            case RE_ATTEMPT_DATE:
            case TIME:
                return (
                    <View>
                        {modalView}
                        {renderIf(!this.props.item.hidden,
                            <FormLayoutActivityComponent item={this.props.item} press={this._showDateTime} />)}
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


