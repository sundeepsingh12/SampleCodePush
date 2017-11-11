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
import renderIf from '../lib/renderIf'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as arrayActions from '../modules/array/arrayActions'
import FormLayoutActivityComponent from '../components/FormLayoutActivityComponent'
import {
    RE_ATTEMPT_DATE,
    DATE,
    FIXED_SKU,
    SIGNATURE,
    SKU_ARRAY,
    SIGNATURE_AND_NPS,
    STRING,
    TEXT,
    NUMBER,
    DECIMAL,
    PASSWORD,
    ARRAY
} from '../lib/AttributeConstants'


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...arrayActions }, dispatch)
    }
}

class ArrayBasicComponent extends Component {

    onFocusEvent(currentElement) {
        //  this.props.actions.fieldValidations(currentElement, this.props.formElement, 'Before')
    }

    _getNextFocusableElement(fieldAttributeMasterId, nextEditable, value, isSaveDisabled, arrayElements, rowId) {
        // then fire action to get next editable and focusable elements
        this.props.actions.getNextFocusableAndEditableElement(fieldAttributeMasterId, nextEditable, isSaveDisabled, value, arrayElements, rowId);
    }

    _styleNextFocusable(isFocusable) {
        if (isFocusable) {
            return {
                backgroundColor: 'grey'
            }
        }
    }
    _renderData(item) {
        switch (item.attributeTypeId) {
            case STRING:
            case TEXT:
            case NUMBER:
            case DECIMAL:
                return (
                    renderIf(!item.hidden,
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
                                                        {item.label}
                                                    </Text>
                                                    <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, { color: '#999999' }])}>
                                                        {item.subLabel}
                                                    </Text>
                                                </View>

                                                <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, { flexBasis: '20%' }])}>

                                                    {renderIf(item.showCheckMark,
                                                        <Icon name='ios-checkmark' style={StyleSheet.flatten([styles.fontXxxl, styles.fontSuccess, { marginTop: -5 }])} />
                                                    )}

                                                    {renderIf((item.helpText && item.helpText.length > 0),
                                                        <View>
                                                            <TouchableHighlight underlayColor='#e7e7e7' onPress={() => this._onPressHelpText(item.fieldAttributeMasterId)}>
                                                                <Icon name='ios-help-circle-outline' style={StyleSheet.flatten([styles.fontXl])} />
                                                            </TouchableHighlight>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                            <View style={this._styleNextFocusable(item.focus)}>
                                                <Input
                                                    keyboardType={(item.attributeTypeId == 6 || item.attributeTypeId == 13) ? 'numeric' : 'default'}
                                                    editable={item.editable}
                                                    multiline={item.attributeTypeId == 2 ? true : false}
                                                    placeholder='Regular Textbox'
                                                    onChangeText={value => this._getNextFocusableElement(item.fieldAttributeMasterId, this.props.arrayRow.nextEditable, value, this.props.arrayRow.isSaveDisabled, this.props.arrayElements, this.props.arrayRow.rowId)}
                                                    value={item.value}
                                                />
                                            </View>
                                            {
                                                renderIf(item.helpText && item.showHelpText,
                                                    <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, { color: '#999999' }])}>
                                                        {item.helpText} </Text>
                                                )}
                                        </View>
                                    </View>
                                </Body>
                            </CardItem>
                        </Card>
                    )
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
            <View>
                <Card>
                    <CardItem>
                        <FlatList
                            data={Array.from(this.props.arrayRow.formLayoutObject)}
                            extraData={this.state}
                            renderItem={(item) => this._renderData(item.item[1])}
                            keyExtractor={item => item.fieldAttributeMasterId}
                        />
                        <Button onPress={() => this.props.actions.deleteArrayRow(this.props.arrayElements, this.props.arrayRow.rowId, this.props.lastRowId, this.props.isSaveDisabled)}>
                            <Text> Delete </Text>
                        </Button>
                    </CardItem>
                </Card>
            </View>
        );
    }
}


export default connect(null, mapDispatchToProps)(ArrayBasicComponent)


