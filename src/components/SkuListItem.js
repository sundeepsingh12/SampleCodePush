'use strict';
import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Slider,
    TextInput
} from 'react-native'
import styles from '../themes/FeStyle'
import {
    SKU_ORIGINAL_QUANTITY,
    SKU_ACTUAL_QUANTITY,
    SKU_REASON,
    SKU_PHOTO,
    NA
} from '../lib/AttributeConstants'
import { CheckBox, Picker, Icon, Toast } from 'native-base'
import _ from 'lodash'
import {
    CameraAttribute,
} from '../lib/constants'
import {
    SELECT_ANY_REASON,
    OPEN_CAMERA,
    OK,
    ACTUAL_QUANTITY_INPUT_ERROR,
} from '../lib/ContainerConstants'
import { Platform } from 'react-native'
import { navigate } from '../modules/navigators/NavigationService';
const Item = Picker.Item;

class SkuListItem extends PureComponent {

    changeSkuActualQuantity(selectedValue, rowItem) {
        //Call parent component using callback
        this.props.updateSkuActualQuantity(selectedValue, rowItem, this.props.title)
    }

    changeQuantityForCheckBox(rowItem, selectedValue, title) {
        const newValue = (selectedValue == 0) ? 1 : 0
        this.props.updateSkuActualQuantity(newValue, rowItem, title)
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

    _getViewOfHeader(rowItem, originalQuantityValue) {
        if (rowItem.attributeTypeId == SKU_PHOTO) {
            return <Icon name="ios-camera" style={[styles.flexBasis50, styles.fontDefault, styles.fontXxl, styles.marginTop15, {color : styles.fontPrimaryColor}]} />
        } else if (!(rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY && originalQuantityValue > 1)) {
            return <View style={[styles.flexBasis50, styles.column, styles.justifyCenter, { height: 60 }]}>
                <Text style={[styles.fontSm]}>
                    {rowItem.label}
                </Text></View>
        }
    }

    _getIconForImageAlreadyCaptured(rowItem) {
        return (rowItem.value != OPEN_CAMERA) ? <Icon name="ios-checkmark-circle" style={[styles.fontXl, styles.fontSuccess, styles.fontXxl]} /> : null
    }

    checkForProperActualQuantityInput(value, rowItem, originalQuantityValue) {
        if (isNaN(value) || value.includes('.') || parseInt(value) < 0 || parseInt(originalQuantityValue[0]) < parseInt(value)) {
            Toast.show({
                text: ACTUAL_QUANTITY_INPUT_ERROR,
                position: 'bottom',
                buttonText: OK,
                type: 'danger',
            })
            return
        }
        if (_.isEmpty(_.trim(value))) {
            value = 0
        }
        this.changeSkuActualQuantity(value, rowItem)
    }

    renderQuantitySelectorForLargeQuantity(rowItem,originalQuantityValue){
        return (
            <View style={[styles.flex1, styles.row, styles.paddingTop10]}>
                    <View style={[styles.flexBasis80, styles.paddingTop10]}>
                        <Slider
                            step = {1}
                            thumbTintColor='#00796B'
                            maximumTrackTintColor='#00796B'
                            minimumTrackTintColor='#00796B'
                            value={parseInt(rowItem.value)}
                            maximumValue={parseInt(originalQuantityValue[0])}
                            minimumValue={0}
                            onSlidingComplete={(value) => this.changeSkuActualQuantity(value, rowItem)}
                        />
                    </View>
                    <TextInput
                        style={[styles.flexBasis20, styles.marginTop5, { borderColor: '#00796B', borderWidth: 1, height: 33, paddingTop: 0, paddingBottom: 0 }]}
                        editable={true}
                        maxLength={4}
                        keyboardType={'numeric'}
                        underlineColorAndroid='transparent'
                        returnKeyType='done'
                        value={parseInt(rowItem.value).toString()}
                        onChangeText={(value) => this.checkForProperActualQuantityInput(value, rowItem, originalQuantityValue)}
                    />
                </View>
        )
    }

    _displaySkuItems(rowItem, originalQuantityValue) {
        if (!_.isEmpty(this.props.skuValidationForImageAndReason) && !_.isNull(rowItem.value) && rowItem.attributeTypeId == SKU_REASON) {
            let reasonList = JSON.parse(JSON.stringify(this.props.reasonsList))
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
                        {this._populateSkuItems(reasonList)}
                    </Picker>
                </View>)
        } else if (!_.isEmpty(this.props.skuValidationForImageAndReason) && !_.isNull(rowItem.value) && rowItem.attributeTypeId == SKU_PHOTO) {
            return (
                <View style={[styles.row, styles.flexBasis50, styles.alignCenter, styles.marginTop15]}>
                    <Text style={[styles.fontDefault, styles.padding10, styles.paddingLeft0, {color : styles.fontPrimaryColor}]}
                        onPress={() => { navigate('CameraAttribute', { currentElement: rowItem, changeSkuActualQuantity: this.changeSkuActualQuantity.bind(this) }) }}>
                        {OPEN_CAMERA}
                    </Text>
                    {this._getIconForImageAlreadyCaptured(rowItem)}
                </View>)

        } else if (rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY) {
            let quantitySelector
            if (originalQuantityValue <= 1) {
                quantitySelector =
                    <View style={[styles.paddingTop20]}>
                        <CheckBox color={ styles.bgPrimaryColor } style={[style.cardCheckbox]} checked={rowItem.value != 0} onPress={() => this.changeQuantityForCheckBox(rowItem, rowItem.value, this.props.title)} />
                    </View>
            }
            else if (originalQuantityValue > 1) {
                quantitySelector = this.renderQuantitySelectorForLargeQuantity(rowItem,originalQuantityValue)
            }
            return (
                <View style={[{ flexBasis: '60%', height: 40 }]}>
                    {quantitySelector}
                </View>
            )
        } else {
            return (
                <View style={[styles.column, styles.justifyCenter, styles.flex1]}>
                    <Text style={[styles.fontDefault]}>
                        {(rowItem.attributeTypeId == SKU_REASON || rowItem.attributeTypeId == SKU_PHOTO) ? NA : rowItem.value}
                    </Text>
                </View>
            )
        }
    }

    renderListRow(rowItem, originalQuantityValue) {
        if (rowItem.attributeTypeId != SKU_ORIGINAL_QUANTITY) {
            return (
                <View key = {rowItem.autoIncrementId} style={[styles.row, styles.borderBottomLightGray, styles.paddingHorizontal10, { height: 'auto' }]}>
                    <View style={[styles.row]}>
                        {this._getViewOfHeader(rowItem, originalQuantityValue)}
                        <View style={[styles.width100, { height: 60 }]}>
                            {this._displaySkuItems(rowItem, originalQuantityValue)}
                        </View>
                    </View>
                </View>
            )
        }
    }

    render() {
        const originalQuantityValue = this.props.item.filter(object => object.attributeTypeId == SKU_ORIGINAL_QUANTITY).map(item => item.value)
        return (
                <View style={[style.card]} >
                    {this.props.item.map(object => this.renderListRow(object, originalQuantityValue))}
                </View>
        )
    }
}
const style = StyleSheet.create({
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
    }

});

export default SkuListItem