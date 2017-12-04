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
            showRadioButton: false,
            showDropdown: false,
            showCheckbox: false,
            showRadioMaster: false
        };
    }

    onFocusEvent(currentElement) {
        this.props.actions.fieldValidations(currentElement, this.props.arrayElements, 'Before', this.props.jobTransaction, this.props.arrayRow.rowId)
    }

    _onBlurEvent(currentElement) {
        this.props.actions.fieldValidations(currentElement, this.props.arrayElements, 'After', this.props.jobTransaction, this.props.arrayRow.rowId)
    }

    _getNextFocusableElement(fieldAttributeMasterId, isSaveDisabled, value, arrayElements, rowId) {
        this.props.actions.getNextFocusableAndEditableElement(fieldAttributeMasterId, isSaveDisabled, value, arrayElements, rowId);
    }

    _styleNextFocusable(isFocusable) {
        if (isFocusable) {
            return [styles.bgLightGray]
        }
    }

    onSaveDateTime = (value, item) => {
        this._getNextFocusableElement(item.fieldAttributeMasterId, this.props.arrayRow.isSaveDisabled, value, this.props.arrayElements, this.props.arrayRow.rowId)
        this.setState({ showDateTimePicker: false, showNPS: false })
    }

    cancelDateTimePicker = () => {
        this.setState({ showDateTimePicker: false, showNPS: false })
    }
    _dropModal = () => {
        this.setModalVisible(false)
    }
    _inflateModal = (item) => {
        this.setState(previousState => {
            return {
                selectFromListEnable: !this.state.selectFromListEnable
            }
        })
    }
    _renderData(item) {
        switch (item.attributeTypeId) {
            case STRING:
            case TEXT:
            case NUMBER:
            case DECIMAL:
                return (
                    renderIf(!item.hidden,
                        <View style={[styles.bgWhite, styles.paddingTop30, styles.paddingLeft10, styles.paddingRight10, item.focus ? { borderLeftColor: styles.primaryColor, borderLeftWidth: 5 } : null]}>
                            <View style={[styles.marginBottom15]}>
                                <Item stackedLabel>
                                    <Label style={[styles.fontPrimary]}>{item.label}</Label>
                                    <Input
                                        autoCapitalize="none"
                                        placeholder="help text"
                                        defaultValue={item.value}
                                        value={item.value}
                                        keyboardType={(item.attributeTypeId == 6 || item.attributeTypeId == 13) ? 'numeric' : 'default'}
                                        editable={item.editable}
                                        multiline={item.attributeTypeId == 2 ? true : false}
                                        onChangeText={value => this._getNextFocusableElement(item.fieldAttributeMasterId, this.props.arrayRow.isSaveDisabled, value, this.props.arrayElements, this.props.arrayRow.rowId)}
                                        onFocus={() => { this.onFocusEvent(item) }}
                                        onBlur={(e) => this._onBlurEvent(item)}
                                    />
                                </Item>
                            </View>
                        </View>
                    ))
            case DATE:
            case RE_ATTEMPT_DATE:
            case TIME:
                return (
                    <View>
                        <FormLayoutActivityComponent item={item} press={() => this.setState({ showDateTimePicker: true })} />
                        {renderIf(this.state.showDateTimePicker,
                            <TimePicker onSave={this.onSaveDateTime} onCancel={this.cancelDateTimePicker} item={item} />
                        )}

                    </View>)
            case NPS_FEEDBACK:
                return (
                    <View>
                        <FormLayoutActivityComponent item={item} press={() => this.setState({ showNPS: true })} />
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
                    </View>
                )
            case CHECKBOX:
                return (
                    <View>{
                        renderIf(this.state.showCheckbox,
                            <SelectFromList
                                currentElement={item}
                                formElements={this.props.arrayElements}
                                isSaveDisabled={this.props.isSaveDisabled}
                                jobTransaction={this.props.jobTransaction}
                                jobStatusId={this.props.jobStatusId}
                                latestPositionId={this.props.latestPositionId}
                                press={this._inflateModal}
                                calledFromArray={true}
                                rowId={this.props.arrayRow.rowId}
                            />
                        )}

                        <FormLayoutActivityComponent item={item} press={() => this.setState({ showCheckbox: true })} />
                    </View>
                )
            case RADIOBUTTON:
                return (
                    <View>{
                        renderIf(this.state.showRadioButton,
                            <SelectFromList
                                currentElement={item}
                                formElements={this.props.arrayElements}
                                isSaveDisabled={this.props.isSaveDisabled}
                                jobTransaction={this.props.jobTransaction}
                                jobStatusId={this.props.jobStatusId}
                                latestPositionId={this.props.latestPositionId}
                                press={this._inflateModal}
                                calledFromArray={true}
                                rowId={this.props.arrayRow.rowId}
                            />
                        )}

                        <FormLayoutActivityComponent item={item} press={() => this.setState({ showRadioButton: true })} />
                    </View>
                )
            case DROPDOWN:
                return (
                    <View>{
                        renderIf(this.state.showDropdown,
                            <SelectFromList
                                currentElement={item}
                                formElements={this.props.arrayElements}
                                isSaveDisabled={this.props.isSaveDisabled}
                                jobTransaction={this.props.jobTransaction}
                                jobStatusId={this.props.jobStatusId}
                                latestPositionId={this.props.latestPositionId}
                                press={this._inflateModal}
                                calledFromArray={true}
                                rowId={this.props.arrayRow.rowId}
                            />
                        )}

                        <FormLayoutActivityComponent item={item} press={() => this.setState({ showDropdown: true })} />
                    </View>
                )
            case OPTION_RADIO_FOR_MASTER:
                return (
                    <View>{
                        renderIf(this.state.showRadioMaster,
                            <SelectFromList
                                currentElement={item}
                                formElements={this.props.arrayElements}
                                isSaveDisabled={this.props.isSaveDisabled}
                                jobTransaction={this.props.jobTransaction}
                                jobStatusId={this.props.jobStatusId}
                                latestPositionId={this.props.latestPositionId}
                                press={this._inflateModal}
                                calledFromArray={true}
                                rowId={this.props.arrayRow.rowId}
                            />
                        )}
                        <FormLayoutActivityComponent item={item} press={() => this.setState({ showRadioMaster: true })} />
                    </View>
                )
            case DATA_STORE:
            case EXTERNAL_DATA_STORE:
                return (
                    <FormLayoutActivityComponent item={item} press={
                        () =>
                            this.props.actions.navigateToScene('DataStore',
                                {
                                    currentElement: item,
                                    formElements: this.props.arrayElements,
                                    jobStatusId: this.props.jobStatusId,
                                    jobTransaction: this.props.jobTransaction,
                                    latestPositionId: this.props.latestPositionId,
                                    isSaveDisabled: this.props.isSaveDisabled,
                                    calledFromArray: true,
                                    rowId: this.props.arrayRow.rowId
                                })
                    } />
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
            <View style={[style.card, styles.bgWhite, styles.padding10]}>
                <View style={[styles.flexBasis90]}>
                    <FlatList style={[styles.flexBasis90]}
                        data={Array.from(this.props.arrayRow.formLayoutObject)}
                        renderItem={(item) => this._renderData(item.item[1])}
                        keyExtractor={item => item[0]}
                    />
                </View>
                <View style={[styles.flexBasis10, styles.alignCenter, styles.justifyCenter, styles.padding10]}>
                    <Button style={styles.bgGray} onPress={() => this.props.actions.deleteArrayRow(this.props.arrayElements, this.props.arrayRow.rowId, this.props.lastRowId)}>
                        <Text style={[styles.fontBlack, styles.fontDefault]}> Remove </Text>
                    </Button>
                    {/* <Icon name="md-remove-circle" style={[styles.fontDanger, styles.fontXxl, styles.fontLeft]}
                        onPress={() => this.props.actions.deleteArrayRow(this.props.arrayElements, this.props.arrayRow.rowId, this.props.lastRowId)} /> */}
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


