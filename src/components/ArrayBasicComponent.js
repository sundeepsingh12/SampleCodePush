'use strict'
import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    FlatList,
    TouchableHighlight,
    Modal,
    TouchableOpacity
}
    from 'react-native'
import { Container, Content, Footer, Thumbnail, FooterTab, Input, Card, CardItem, Button, Body, Header, Left, Right, Icon, TextInput, Item, Label } from 'native-base';
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as arrayActions from '../modules/array/arrayActions'
import FormLayoutActivityComponent from '../components/FormLayoutActivityComponent'
import {
    STRING,
    TEXT,
    NUMBER,
    DECIMAL,
    DATE,
    RE_ATTEMPT_DATE,
    TIME,
    NPS_FEEDBACK,
    CHECKBOX,
    RADIOBUTTON,
    DROPDOWN,
    OPTION_RADIO_FOR_MASTER,
    DATA_STORE,
    EXTERNAL_DATA_STORE,
    QR_SCAN,
    CAMERA,
    CAMERA_HIGH,
    CAMERA_MEDIUM,
    SCAN_OR_TEXT,
    SEQUENCE,
    PASSWORD,
    CONTACT_NUMBER,
    ARRAY_SAROJ_FAREYE,
    OBJECT_SAROJ_FAREYE,
    OPTION_RADIO_VALUE,
    AFTER,
    BEFORE,
    ADVANCE_DROPDOWN,
    DATA_STORE_FILTER,
} from '../lib/AttributeConstants'
import TimePicker from '../components/TimePicker'
import NPSFeedback from '../components/NPSFeedback'
import MultipleOptionsAttribute from '../containers/MultipleOptionsAttribute'
import * as globalActions from '../modules/global/globalActions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
    ON_BLUR,
    NEXT_FOCUS,
    CameraAttribute,
} from '../lib/constants'
import {
    OPTIONAL,
    SELECTED,
    REMOVE
} from '../lib/ContainerConstants'
import DataStoreFilter from '../containers/DataStoreFilter'

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...arrayActions, ...globalActions }, dispatch)
    }
}

class ArrayBasicComponent extends PureComponent {

    _searchForReferenceValue = (value, item) => {
        this.props.actions.fieldValidationsArray(item, this.props.arrayElements, AFTER, this.props.jobTransaction, this.props.arrayRow.rowId, this.props.isSaveDisabled, value, this.props.formLayoutState)
    }
    onFocusEvent(currentElement) {
        this.props.actions.fieldValidationsArray(currentElement, this.props.arrayElements, BEFORE, this.props.jobTransaction, this.props.arrayRow.rowId, this.props.isSaveDisabled, null, this.props.formLayoutState)
    }

    _onBlurEvent(currentElement) {
        this.props.actions.fieldValidationsArray(currentElement, this.props.arrayElements, AFTER, this.props.jobTransaction, this.props.arrayRow.rowId, this.props.isSaveDisabled, null, this.props.formLayoutState)
    }

    _getNextFocusableElement(fieldAttributeMasterId, isSaveDisabled, value, arrayElements, rowId) {
        this.props.actions.getNextFocusableForArrayWithoutChildDatalist(fieldAttributeMasterId, isSaveDisabled, value, arrayElements, rowId, null, this.props.formLayoutState);
    }

    _styleNextFocusable(isFocusable) {
        if (isFocusable) {
            return [styles.bgLightGray]
        }
    }

    onSaveDateTime = (value, item) => {
        this.props.actions.getNextFocusableAndEditableElement(item.fieldAttributeMasterId, this.props.isSaveDisabled, value, this.props.arrayElements, this.props.arrayRow.rowId, null, NEXT_FOCUS, 2, null, this.props.formLayoutState,this.props.goBack);
    }
    onPressModal = (fieldAttributeMasterId) => {
        this.props.actions.showOrDropModal(fieldAttributeMasterId, this.props.arrayElements, this.props.arrayRow.rowId, fieldAttributeMasterId, this.props.isSaveDisabled)
    }

    onCloseModal = (item) => {
        this.props.actions.showOrDropModal(item.fieldAttributeMasterId, this.props.arrayElements, this.props.arrayRow.rowId, null, this.props.isSaveDisabled)
    }

    getComponentLabelStyle(focus, editable) {
        return focus ? { color: styles.fontPrimaryColor } : editable ? styles.fontBlack : styles.fontLowGray
    }

    getComponentSubLabelStyle(editable) {
        return editable ? styles.fontDarkGray : styles.fontLowGray
    }
    goToQRCode = (item) => {
        this.props.actions.navigateToScene('QrCodeScanner',
            {
                currentElement: item,
                formLayoutState: this.props.formLayoutState,
                jobStatusId: this.props.jobStatusId,
                jobTransaction: this.props.jobTransaction,
                latestPositionId: this.props.latestPositionId,
                isSaveDisabled: this.props.isSaveDisabled,
                returnData: this._searchForReferenceValue.bind(this),
                calledFromArray: true
            },
        this.props.navigate)
    }
    getModalView(item) {
        if (!this.props.arrayRow.modalFieldAttributeMasterId || this.props.arrayRow.modalFieldAttributeMasterId !== item.fieldAttributeMasterId) {
            return null
        }
        let attributeTypeId = item.attributeTypeId
        if (attributeTypeId == CHECKBOX || attributeTypeId == OPTION_RADIO_FOR_MASTER || attributeTypeId == RADIOBUTTON || attributeTypeId == DROPDOWN || attributeTypeId == ADVANCE_DROPDOWN) {
            return (
                <View>
                    <MultipleOptionsAttribute
                        currentElement={item}
                        formLayoutState={this.props.formLayoutState}
                        jobTransaction={this.props.jobTransaction}
                        jobStatusId={this.props.jobStatusId}
                        calledFromArray={true}
                        rowId={this.props.arrayRow.rowId}
                        onCloseModal={() => this.onCloseModal(item)}
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
                        onRequestClose={() => this.onCloseModal(item)}>
                        <TouchableHighlight
                            style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]} onPress={() => this.onCloseModal(item)}>
                            <TouchableHighlight style={{ backgroundColor: '#ffffff', flex: .2 }}>
                                <View>
                                    <Text style={[styles.alignStart, styles.fontLg, styles.padding10]}>
                                        Rating
                                    </Text>
                                    <View style={[styles.padding20, styles.justifyCenter]}>
                                        <NPSFeedback
                                            onSave={this.onSaveDateTime} onCancel={() => this.onCloseModal(item)} item={item}
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
                <TimePicker onSave={this.onSaveDateTime} onCancel={() => this.onCloseModal(item)} item={item} />
            )
        }

        if (attributeTypeId == DATA_STORE_FILTER) {
            return (
                <View>
                    <DataStoreFilter
                        currentElement={item}
                        formLayoutState={this.props.formLayoutState}
                        isSaveDisabled={this.props.isSaveDisabled}
                        jobTransaction={this.props.jobTransaction}
                        latestPositionId={this.props.latestPositionId}
                        fieldAttributeMasterParentIdMap={this.props.fieldAttributeMasterParentIdMap}
                        onClose={this.onCloseModal}
                        calledFromArray={true}
                        rowId={this.props.arrayRow.rowId}
                        arrayFieldAttributeMasterId={this.props.arrayFieldAttributeMasterId}
                    />
                </View>
            )
        }
        return null
    }
    getValueTextForMultipleOption(item) {
        if (!item.value) {
            return item.helpText
        }

        if (item.value == ARRAY_SAROJ_FAREYE && item.childDataList) {
            return item.childDataList.length + SELECTED
        }

        if (item.value == OBJECT_SAROJ_FAREYE && item.childDataList) {
            for (let index in item.childDataList) {
                if (item.childDataList[index].attributeTypeId == OPTION_RADIO_VALUE) {
                    return item.childDataList[index].value
                }
            }
        }

        if (item.value != ARRAY_SAROJ_FAREYE && item.value != OBJECT_SAROJ_FAREYE) {
            return item.containerValue ? item.containerValue : item.value
        }
        return null
    }

    getMultipleOptionCardView(modalView, item) {
        return (
            <TouchableOpacity
                style={[{ paddingVertical: 50 }, item.focus ? { borderLeftColor: styles.borderLeft4Color, borderLeftWidth: 4 } : null]}
                onPress={() => this.props.actions.showOrDropModal(item.fieldAttributeMasterId, this.props.arrayElements, this.props.arrayRow.rowId, item.fieldAttributeMasterId, this.props.isSaveDisabled)
                }
                disabled={!item.editable || this.props.modalFieldAttributeMasterId ? true : false}
            >
                <View style={[styles.marginHorizontal10]}>
                    {modalView}
                    <View style={[styles.borderBottomBlack, styles.relative]}>
                        <Text style={[styles.marginBottom10, this.getComponentLabelStyle(item.focus, item.editable), styles.fontDefault]}>
                            {item.label}
                            {item.required ? null : <Text style={[styles.italic, styles.fontLowGray]}> {OPTIONAL}</Text>}
                        </Text>
                        {item.subLabel ?
                            <Text style={[styles.fontSm, styles.marginBottom10, this.getComponentSubLabelStyle(item.editable)]}>{item.subLabel}</Text>
                            : null}
                        {item.helpText ?
                            <Text style={[styles.fontSm, styles.marginBottom10, this.getComponentSubLabelStyle(item.editable)]}>{item.helpText}</Text>
                            : null}
                        <Text style={[this.getComponentLabelStyle(item.focus, item.editable), styles.fontLg, styles.marginBottom10]}>
                            {this.getValueTextForMultipleOption(item)}
                        </Text>
                        <Icon name="md-arrow-dropdown" style={[styles.absolute, styles.fontLg, this.getComponentLabelStyle(item.focus, item.editable), { bottom: 10, right: 0 }]} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    _renderData(item) {
        if (item.hidden) {
            return null
        }
        let modalView = this.getModalView(item)
        let multipleOptionCardView = this.getMultipleOptionCardView(modalView, item)
        switch (item.attributeTypeId) {
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
                        <View style={[styles.bgWhite, styles.paddingTop30, styles.paddingLeft10, styles.paddingRight10, item.focus ? { borderLeftColor: styles.primaryColor, borderLeftWidth: 5 } : null]}>
                            <Item stackedLabel>
                                {item.label ?
                                    <Label style={[styles.fontDefault, this.getComponentLabelStyle(item.focus, item.editable)]}>{item.label}
                                        {item.required ? null : <Text style={[styles.italic, styles.fontLowGray]}> (optional)</Text>}
                                    </Label>
                                    : null}
                                {item.subLabel ?
                                    <Label style={[styles.fontSm, this.getComponentSubLabelStyle(item.editable)]}>{item.subLabel}</Label>
                                    : null}
                                <Input
                                    autoCapitalize="none"
                                    placeholder={item.helpText}
                                    defaultValue={item.value}
                                    value={item.displayValue}
                                    keyboardType={(item.attributeTypeId == 6 || item.attributeTypeId == 13) ? 'numeric' : 'default'}
                                    editable={item.editable}
                                    returnKeyType='done'
                                    multiline={item.attributeTypeId == 2 ? true : false}
                                    onChangeText={value => this._getNextFocusableElement(item.fieldAttributeMasterId, this.props.isSaveDisabled, value, this.props.arrayElements, this.props.arrayRow.rowId)}
                                    onFocus={() => { this.onFocusEvent(item) }}
                                    onBlur={(e) => this._onBlurEvent(item)}
                                    secureTextEntry={item.attributeTypeId == 61 ? true : false}
                                />
                            </Item>
                            {(item.attributeTypeId == SCAN_OR_TEXT) ?
                                <TouchableHighlight
                                    style={[styles.absolute, { top: 40, right: 10 }]}
                                    onPress={() => this.goToQRCode(item)} >
                                    <View>
                                        <MaterialCommunityIcons name='qrcode' style={[styles.fontXxl, styles.padding5]} color={this.getComponentLabelStyle(item.focus, item.editable).color} />
                                    </View>
                                </TouchableHighlight> : null}
                            {item.alertMessage ?
                                <Label style={[styles.fontDanger, styles.fontSm, styles.paddingTop10]}>{item.alertMessage}</Label>
                                : null}
                        </View>
                    </View>
                )

            case DATE:
            case RE_ATTEMPT_DATE:
            case TIME:
                return (
                    <View>
                        {modalView}
                        <FormLayoutActivityComponent item={item} press={() => this.onPressModal(item.fieldAttributeMasterId)} />
                    </View>
                )
            case NPS_FEEDBACK:
                return <View>
                    {modalView}
                    <FormLayoutActivityComponent item={item} press={() => this.onPressModal(item.fieldAttributeMasterId)} />
                </View>
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
            case DATA_STORE:
            case EXTERNAL_DATA_STORE:
                return (
                    <View>
                        <FormLayoutActivityComponent item={item} press={
                            () => {
                                //this.props.actions.fieldValidationsArray(item, this.props.arrayElements, 'Before', this.props.jobTransaction, this.props.arrayRow.rowId, this.props.isSaveDisabled, null, this.props.formLayoutState)
                                this.props.actions.navigateToScene('DataStore',
                                    {
                                        currentElement: item,
                                        formLayoutState: this.props.formLayoutState,
                                        jobStatusId: this.props.jobStatusId,
                                        jobTransaction: this.props.jobTransaction,
                                        latestPositionId: this.props.latestPositionId,
                                        isSaveDisabled: this.props.isSaveDisabled,
                                        calledFromArray: true,
                                        rowId: this.props.arrayRow.rowId,
                                        fieldAttributeMasterParentIdMap: this.props.fieldAttributeMasterParentIdMap,
                                        arrayFieldAttributeMasterId: this.props.arrayFieldAttributeMasterId
                                    },
                                this.props.navigate)
                            }} />
                    </View>
                )
            case DATA_STORE_FILTER:
                return (
                    <View>
                        {modalView}
                        <FormLayoutActivityComponent item={item} press={() => this.onPressModal(item.fieldAttributeMasterId)} />
                    </View>
                )

            case QR_SCAN:
                return (
                    <View>
                        <FormLayoutActivityComponent item={item} press={
                            () => {
                                this.props.actions.fieldValidationsArray(item, this.props.arrayElements, 'Before', this.props.jobTransaction, this.props.arrayRow.rowId, this.props.arrayRow.isSaveDisabled, null, this.props.formLayoutState)
                                this.goToQRCode(item)
                            }} />
                    </View>
                )
            case CAMERA:
            case CAMERA_MEDIUM:
            case CAMERA_HIGH:
                return (<View>
                    <FormLayoutActivityComponent item={item} press={
                        () => {
                            this.props.actions.fieldValidationsArray(item, this.props.arrayElements, 'Before', this.props.jobTransaction, this.props.arrayRow.rowId, this.props.isSaveDisabled, null, this.props.formLayoutState)
                            this.props.actions.navigateToScene(CameraAttribute,
                                {
                                    currentElement: item,
                                    formLayoutState: this.props.formLayoutState,
                                    jobStatusId: this.props.jobStatusId,
                                    jobTransaction: this.props.jobTransaction,
                                    latestPositionId: this.props.latestPositionId,
                                    isSaveDisabled: this.props.isSaveDisabled,
                                    calledFromArray: true,
                                    rowId: this.props.arrayRow.rowId,
                                    fieldAttributeMasterParentIdMap: this.props.fieldAttributeMasterParentIdMap
                                },
                            this.props.navigate)
                        }} />
                </View>
                )
            default:
                return null
        }
    }

    _renderArrayData(){
        let formData  = []
        let sequenceWiseMasterIds = this.props.formLayoutState.sequenceWiseMasterIds
        for(let id in sequenceWiseMasterIds){
          formData.push(this.props.arrayRow.formLayoutObject[sequenceWiseMasterIds[id]])
        }
        return formData
      }
    render() {
        return (
            <View style={[style.card, styles.bgWhite]}>
                <View style={[styles.flexBasis90]}>
                    <FlatList
                        data={this._renderArrayData()}
                        renderItem={(item) => this._renderData(item.item)}
                        keyExtractor={item => String(item[0])}
                    />
                </View>
                <View style={[styles.flexBasis10, styles.alignCenter, styles.justifyCenter, styles.padding10]}>
                    <Button style={styles.bgGray} onPress={() => this.props.actions.deleteArrayRow(this.props.arrayElements, this.props.arrayRow.rowId, this.props.lastRowId)}>
                        <Text style={[styles.fontBlack, styles.fontDefault]}> {REMOVE} </Text>
                    </Button>
                </View>
            </View >
        );
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
    footer: {
        flexDirection: 'column',
        height: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
        padding: 10
    },
    card: {
        borderBottomWidth: 10,
        borderBottomColor: '#f3f3f3'
    },
    listLeft: {
        width: 50
    }

});
export default connect(null, mapDispatchToProps)(ArrayBasicComponent)


