'use strict';
import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'
import styles from '../themes/FeStyle'
import {
    SKU_ORIGINAL_QUANTITY,
    SKU_ACTUAL_QUANTITY,
    SKU_REASON,
    SKU_PHOTO,
    REASON,
    NA
} from '../lib/AttributeConstants'
import { CheckBox, Picker, Content, Icon } from 'native-base'
import _ from 'lodash'
import {
    CameraAttribute,
} from '../lib/constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
    SELECT_ANY_REASON,
    OPEN_CAMERA,
} from '../lib/ContainerConstants'
import { Platform } from 'react-native'
const Item = Picker.Item;

class SkuListItem extends PureComponent {

    changeSkuActualQuantity(selectedValue, rowItem) {
        //Call parent component using callback
        this.props.updateSkuActualQuantity(selectedValue, rowItem)
    }

    changeQuantityForCheckBox(rowItem, selectedValue) {
        const newValue = (selectedValue == 0) ? 1 : 0
        this.props.updateSkuActualQuantity(newValue, rowItem)
    }

    _populateItems(value) {
        return _.range(++value).map(number => {
            return <Item label={number + ""} value={number + ''} key={number + ""} />
        });
    }

    _populateSkuItems(reasonsList) {
        return reasonsList.map(reason => {
            return <Item label={reason.name + ""} value={reason.code + ''} key={reason.id + ""} />
        })
    }

    _getViewOfHeader(rowItem) {
        if (rowItem.attributeTypeId == SKU_PHOTO) {
            return <Icon name="ios-camera" style={[styles.flexBasis40, styles.fontDefault, styles.fontXxl, styles.paddingTop10]} />
        } else {
            return <Text style={[styles.flexBasis40, styles.fontSm, styles.justifyCenter, styles.paddingTop10]} >
                {rowItem.label}
            </Text>
        }
    }

    _getIconForImageAlreadyCaptured(rowItem) {
        return (rowItem.value != OPEN_CAMERA) ? <Icon name="ios-checkmark-circle" style={[styles.fontXl, styles.fontSuccess, styles.fontXxl, styles.paddingTop10]} /> : null
    }

    _displaySkuItems(rowItem, originalQuantityValue) {
        if (!_.isNull(rowItem.value) && rowItem.attributeTypeId == SKU_REASON) {
            let reasonList = _.cloneDeep(this.props.reasonsList)
            if (Platform.OS === 'ios') {
                reasonList.splice(0, 1)
            }
            return (
                <View style={[{ flexBasis: '60%', height: 40 }]}>
                    <Picker
                        mode="dropdown"
                        placeholder={SELECT_ANY_REASON}
                        selectedValue={rowItem.value}
                        onValueChange={(value) => this.changeSkuActualQuantity(value, rowItem)}>
                        {/* <Item label={SELECT_ANY_REASON} value={SELECT_ANY_REASON} key={-987654321} /> */}
                        {this._populateSkuItems(reasonList)}
                    </Picker>
                </View>)
        } else if (!_.isNull(rowItem.value) && rowItem.attributeTypeId == SKU_PHOTO) {
            return (
                <View style={[styles.row, styles.justifyCenter]}>
                    <Text style={[styles.flexBasis30, styles.fontDefault, styles.padding10]}
                        onPress={() => { this.props.navigateToScene('CameraAttribute', { currentElement: rowItem, changeSkuActualQuantity: this.changeSkuActualQuantity.bind(this) }) }}>
                        {OPEN_CAMERA}
                    </Text>
                    {this._getIconForImageAlreadyCaptured(rowItem)}
                </View>)

        } else if (rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY) {
            let quantitySelector
            if (originalQuantityValue <= 1) {
                quantitySelector =
                    <View>
                        <CheckBox style={[style.cardCheckbox]} checked={rowItem.value != 0} onPress={() => this.changeQuantityForCheckBox(rowItem, rowItem.value)} />
                    </View>
            }
            else if (originalQuantityValue > 1 && originalQuantityValue <= 1000) {

                quantitySelector = <Picker
                    mode="dropdown"
                    selectedValue={rowItem.value}
                    onValueChange={(value) => this.changeSkuActualQuantity(value, rowItem)} >
                    {this._populateItems(originalQuantityValue)}
                </Picker>
            }
            return (
                <View style={[{ flexBasis: '60%', height: 40 }]}>
                    {quantitySelector}
                </View>
            )
        } else {
            return (
                <Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10]}>
                    {(rowItem.attributeTypeId == SKU_REASON || rowItem.attributeTypeId == SKU_PHOTO) ? NA : rowItem.value}
                </Text>
            )
        }
    }

    renderListRow(rowItem, originalQuantityValue) {
        if (rowItem.attributeTypeId != SKU_ORIGINAL_QUANTITY) {
            return (
                <View key={rowItem.autoIncrementId} style={[styles.row, styles.borderBottomLightGray, styles.paddingHorizontal5, { height: 50 }]}>
                    <View style={[styles.row]}>
                        {this._getViewOfHeader(rowItem)}
                        {this._displaySkuItems(rowItem, originalQuantityValue)}
                    </View>
                </View>
            )
        }
    }
    render() {
        const originalQuantityValue = this.props.item.filter(object => object.attributeTypeId == SKU_ORIGINAL_QUANTITY).map(item => item.value)
        return (
            <Content style={[styles.bgLightGray]}>
                <View style={[style.card]} >
                    {this.props.item.map(object => this.renderListRow(object, originalQuantityValue))}
                </View>
            </Content>
        )
    }
}
const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        paddingTop: 10,
        paddingBottom: 10
    },
    headerIcon: {
        width: 24
    },
    headerSearch: {
        paddingLeft: 10,
        paddingRight: 30,
        backgroundColor: '#1260be',
        borderRadius: 2,
        height: 30,
        color: '#fff',
        fontSize: 10
    },
    headerQRButton: {
        position: 'absolute',
        right: 5,
        paddingLeft: 0,
        paddingRight: 0
    },
    card: {
        marginBottom: 10,
        backgroundColor: '#ffffff',
        elevation: 1,
        shadowColor: '#d3d3d3',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    cardLeftTopRow: {
        flexDirection: 'row',
        borderBottomColor: '#f3f3f3',
        borderBottomWidth: 1
    },
    cardRight: {
        width: 40,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardCheckbox: {
        backgroundColor: 'green',
        borderRadius: 0,
    }

});

export default SkuListItem