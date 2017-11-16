'use strict' //Comment Review import
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

    _getNextFocusableElement(fieldAttributeMasterId, nextEditable, isSaveDisabled, value, arrayElements, rowId) {
        // then fire action to get next editable and focusable elements
        this.props.actions.getNextFocusableAndEditableElement(fieldAttributeMasterId, nextEditable, isSaveDisabled, value, arrayElements, rowId);
    }

    _styleNextFocusable(isFocusable) {
        if (isFocusable) {
            return [styles.bgLightGray]
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


