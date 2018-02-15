'use strict';
import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import styles from '../themes/FeStyle'
import {
    SKU_ORIGINAL_QUANTITY,
    SKU_ACTUAL_QUANTITY,
    SKU_REASON,
    SKU_PHOTO,
    OPEN_CAMERA,
    REASON,
    NA    
} from '../lib/AttributeConstants'
import { CheckBox, Picker, Content } from 'native-base'
import _ from 'lodash'
import * as globalActions from '../modules/global/globalActions'
import {
    CameraAttribute,
} from '../lib/constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
    SELECT_ANY_REASON,
} from '../lib/ContainerConstants'
const Item = Picker.Item;

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions }, dispatch)
    }
}

class SkuListItem extends PureComponent {

    checkSkuItemQuantity(rowItem, originalQuantityValue) {
        let quantitySelector
        if (originalQuantityValue <= 1) {
            quantitySelector = <CheckBox style={[style.cardCheckbox]} checked={rowItem.value != 0} onPress={() => this.changeQuantityForCheckBox(rowItem, rowItem.value)} />
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
            <View>
                {quantitySelector}
            </View>
        )
    }
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
    _displaySkuItems(rowItem, originalQuantityValue) {
        if (!_.isEmpty(rowItem.value) && rowItem.attributeTypeId == SKU_REASON) {
            return (
            <View style={[{flexBasis: '60%', height: 40}]}>
                <Picker 
                    mode="dropdown"
                    selectedValue={rowItem.value}
                    onValueChange={(value) => this.changeSkuActualQuantity(value, rowItem)}>
                    <Item label={SELECT_ANY_REASON} value={SELECT_ANY_REASON} key={987654321} />
                    {this._populateSkuItems(this.props.reasonsList)}
                </Picker>
            </View>)
        } else if (!_.isEmpty(rowItem.value) && rowItem.attributeTypeId == SKU_PHOTO) {
                return (<Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10]}
                        onPress={() => {this.props.actions.navigateToScene('CameraAttribute', { currentElement: rowItem, changeSkuActualQuantity: this.changeSkuActualQuantity.bind(this) })}}>
                        {OPEN_CAMERA}
                    </Text>)
            
        } else if(rowItem.attributeTypeId == SKU_ACTUAL_QUANTITY){
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
                <View style={[{flexBasis: '60%', height: 40}]}>
                    {quantitySelector}
                </View>
            )
        }else {
            return (
                <Text style={[styles.flexBasis60, styles.fontDefault, styles.padding10]}>
                    {(rowItem.attributeTypeId == SKU_REASON || rowItem.attributeTypeId == SKU_PHOTO) ? NA :rowItem.value}
                </Text>
            )
        }
    }

    renderListRow(rowItem, originalQuantityValue) {
        if (rowItem.attributeTypeId != SKU_ORIGINAL_QUANTITY) {
            return (
                <View key={rowItem.autoIncrementId} style={[styles.row, styles.borderBottomLightGray, styles.paddingHorizontal5, {height: 50}]}>
                        <View style={[styles.row]}>
                            <Text style={[styles.flexBasis40, styles.fontSm, styles.justifyCenter]} >
                                {rowItem.label}
                            </Text>
                            {this._displaySkuItems(rowItem, originalQuantityValue)}
                        </View> 
                </View>
            )
        }
    }
    render() {
        const originalQuantityValue = this.props.item.filter(object => object.attributeTypeId == SKU_ORIGINAL_QUANTITY).map(item => item.value)
        return (
            <Content style={[styles.flex1,styles.bgLightGray]}>
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
        shadowRadius: 2
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

export default connect(null, mapDispatchToProps)(SkuListItem)
