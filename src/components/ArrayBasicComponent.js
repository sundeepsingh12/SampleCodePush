'use strict' //Comment Review import
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    FlatList,
    TouchableHighlight,
    Modal
}
    from 'react-native'
import { Container, Content, Footer, Thumbnail, FooterTab, Input, Card, CardItem, Button, Body, Header, Left, Right, Icon, TextInput, Item } from 'native-base';
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
    EXTERNAL_DATA_STORE
} from '../lib/AttributeConstants'
import TimePicker from '../components/TimePicker'
import NPSFeedback from '../components/NPSFeedback'
import SelectFromList from '../containers/SelectFromList'
import * as globalActions from '../modules/global/globalActions'

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...arrayActions, ...globalActions }, dispatch)
    }
}

class ArrayBasicComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showDateTimePicker: false,
            showNPS: false,
            selectFromListEnable: false,
        };
    }

    onFocusEvent(currentElement) {
        this.props.actions.fieldValidations(currentElement, this.props.arrayRow.formLayoutObject, 'Before', this.props.jobTransaction)
    }

    _getNextFocusableElement(fieldAttributeMasterId, nextEditable, isSaveDisabled, value, arrayElements, rowId) {
        this.props.actions.getNextFocusableAndEditableElement(fieldAttributeMasterId, nextEditable, isSaveDisabled, value, arrayElements, rowId);
    }

    _styleNextFocusable(isFocusable) {
        if (isFocusable) {
            return [styles.bgLightGray]
        }
    }

    onSaveDateTime = (value, item) => {
        this._getNextFocusableElement(item.fieldAttributeMasterId, this.props.arrayRow.nextEditable, this.props.arrayRow.isSaveDisabled, value, this.props.arrayElements, this.props.arrayRow.rowId)
        this.setState({ showDateTimePicker: false, showNPS: false })
    }

    cancelDateTimePicker = () => {
        this.setState({ showDateTimePicker: false, showNPS: false })
    }
    _dropModal = () => {
        this.setModalVisible(false)
    }
    _inflateModal = () => {
        this.setState(previousState => {
            return {
                selectFromListEnable: !this.state.selectFromListEnable
            }
        })
    }
    _renderData(item) {
        if (this.state.selectFromListEnable) {
            return (
                <View>
                    <SelectFromList
                        currentElement={item}
                        nextEditable={this.props.arrayRow.nextEditable}
                        formElements={this.props.arrayElements}
                        isSaveDisabled={this.props.isSaveDisabled}
                        jobTransaction={this.props.jobTransaction}
                        jobStatusId={this.props.jobStatusId}
                        latestPositionId={this.props.latestPositionId}
                        press={this._inflateModal}
                        calledFromArray={true}
                        rowId={this.props.arrayRow.rowId}
                    />
                </View>
            )
        }
        switch (item.attributeTypeId) {
            case STRING:
            case TEXT:
            case NUMBER:
            case DECIMAL:
                return (
                    renderIf(!item.hidden,
                        <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                            <View style={[style.listLeft, styles.justifyCenter, styles.alignStart, { height: 35 }]}>
                                <Text style={[styles.fontSm]}>{item.label}</Text>
                            </View>
                            <View style={[styles.justifySpaceBetween, styles.marginLeft10, styles.flex1]}>
                                <View style={[styles.row, styles.paddingRight10, styles.justifySpaceBetween, styles.alignCenter]}>
                                    <Item style={this._styleNextFocusable(item.focus)}>
                                        <Input
                                            keyboardType={(item.attributeTypeId == NUMBER || item.attributeTypeId == DECIMAL) ? 'numeric' : 'default'}
                                            editable={item.editable}
                                            onFocus={() => { this.onFocusEvent(item) }}
                                            multiline={item.attributeTypeId == TEXT ? true : false}
                                            onChangeText={value => this._getNextFocusableElement(item.fieldAttributeMasterId, this.props.arrayRow.nextEditable, this.props.arrayRow.isSaveDisabled, value, this.props.arrayElements, this.props.arrayRow.rowId)}
                                            value={item.value}
                                        />
                                    </Item>
                                </View>
                            </View>
                        </View>
                    )
                )
            case DATE:
            case RE_ATTEMPT_DATE:
            case TIME:
                return (
                    <TouchableHighlight onPress={() => this.setState({ showDateTimePicker: true })}>
                        <View style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                            <View style={[style.listLeft, styles.justifyCenter, styles.alignStart, { height: 35 }]}>
                                <Text style={[styles.fontSm]} >{item.label}</Text>
                            </View>
                            {renderIf(this.state.showDateTimePicker,
                                <TimePicker onSave={this.onSaveDateTime} onCancel={this.cancelDateTimePicker} item={item} />
                            )}
                            <View style={[styles.justifySpaceBetween, styles.marginLeft10, styles.flex1]}>
                                <View style={[styles.row, styles.paddingRight10, styles.justifySpaceBetween, styles.alignCenter]}>
                                    <Text style={this._styleNextFocusable(item.focus)}>
                                        {item.value}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                )
            case NPS_FEEDBACK:
                return (
                    <TouchableHighlight onPress={() => this.setState({ showNPS: true })} style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                        <View>
                            <Text style={[styles.fontSm]} >{item.label}</Text>
                            {renderIf(this.state.showNPS,
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
                                                    onSave={this.onSaveDateTime} onCancel={this.cancelDateTimePicker} item={item}
                                                />
                                            </View>
                                        </TouchableHighlight>
                                    </TouchableHighlight>
                                </Modal>
                            )}
                            <Text style={this._styleNextFocusable(item.focus)}>
                                {item.value}
                            </Text>

                        </View>
                    </TouchableHighlight>
                )
            case CHECKBOX:
            case RADIOBUTTON:
            case DROPDOWN:
            case OPTION_RADIO_FOR_MASTER:
                return (
                    <TouchableHighlight onPress={this._inflateModal} style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                        <View>
                            <Text style={[styles.fontSm]} >{item.label}</Text>
                            <Text style={this._styleNextFocusable(item.focus)}>
                                {item.value}
                            </Text>
                        </View>
                    </TouchableHighlight>
                )
            case DATA_STORE:
            case EXTERNAL_DATA_STORE:
                return (
                    <TouchableHighlight onPress={
                        () =>
                            this.props.actions.navigateToScene('DataStore',
                                {
                                    currentElement: item,
                                    formElements: this.props.arrayElements,
                                    jobStatusId: this.props.jobStatusId,
                                    jobTransaction: this.props.jobTransaction,
                                    latestPositionId: this.props.latestPositionId,
                                    nextEditable: this.props.arrayRow.nextEditable,
                                    isSaveDisabled: this.props.isSaveDisabled,
                                    calledFromArray: true,
                                    rowId: this.props.arrayRow.rowId
                                })
                    } style={[styles.alignStart, styles.justifyCenter, styles.row, styles.paddingLeft10, styles.marginBottom10]}>
                        <View>
                            <Text style={[styles.fontSm]} >{item.label}</Text>
                            <Text style={this._styleNextFocusable(item.focus)}>
                                {item.value}
                            </Text>

                        </View>
                    </TouchableHighlight>
                )
            default:
                return (
                    <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, { color: '#999999' }])}>
                        Under construction  {item.label} - attributeTypeId {item.attributeTypeId}
                    </Text>
                )
        }
    }
    render() {
        return (
            <View style={[style.card, styles.row, styles.bgWhite, styles.padding10]}>
                <View style={[styles.flexBasis90]}>
                    <FlatList style={[styles.flexBasis90]}
                        data={Array.from(this.props.arrayRow.formLayoutObject)}
                        renderItem={(item) => this._renderData(item.item[1])}
                        keyExtractor={item => item[0]}
                    />
                </View>
                <View style={[styles.flexBasis10, styles.alignCenter, styles.justifyCenter]}>
                    <Icon name="md-remove-circle" style={[styles.fontDanger, styles.fontXxl, styles.fontLeft]}
                        onPress={() => this.props.actions.deleteArrayRow(this.props.arrayElements, this.props.arrayRow.rowId, this.props.lastRowId)} />
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


