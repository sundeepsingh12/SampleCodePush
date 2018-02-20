'use strict'

import React, { PureComponent } from 'react'
import { View, Text, Slider, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Content, Input } from 'native-base'
import {
    FIXED_SKU_QUANTITY, FIXED_SKU_UNIT_PRICE, FIXED_SKU_CODE,
} from '../lib/AttributeConstants'
import {
    QUANTITY_NOT_A_NUMBER
} from '../lib/ContainerConstants'
import * as fixedSKUActions from '../modules/fixedSKU/fixedSKUActions'
import { bindActionCreators } from 'redux'
import styles from '../themes/FeStyle'


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...fixedSKUActions }, dispatch)
    }
}

function mapStateToProps(state) {
    return {
        fixedSKUList: state.fixedSKU.fixedSKUList,
        totalQuantity: state.fixedSKU.totalQuantity,
    }
};

class FixedSKUListItem extends PureComponent {


    onChangeQuantity(payload) {
        if (payload.quantity && !parseInt(payload.quantity) && parseInt(payload.quantity) != 0) {
            this.props.showToast(QUANTITY_NOT_A_NUMBER + payload.quantity)
            return
        }
        this.props.actions.onChangeQuantity(this.props.fixedSKUList, this.props.totalQuantity, payload)
    }

    render() {
        return (
            <Content style={[styles.flex1, styles.marginTop10, styles.marginLeft5, styles.marginRight5, styles.bgGray]}>
                <View style={[style.card, styles.padding10]}>
                    <View style={[styles.row]}>
                        <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                            <Text style={[styles.fontDefault]}>{this.props.item.childDataList[FIXED_SKU_CODE].label}</Text>
                        </View>
                        <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                            <Text style={[styles.fontDefault]}> {this.props.item.childDataList[FIXED_SKU_CODE].value}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5, marginBottom: 5, height: 1, backgroundColor: '#f2f2f2' }} />
                    <View style={[styles.row]}>
                        <View style={[styles.flexBasis60, styles.paddingTop10, styles.paddingBottom10]}>
                            <Text style={[styles.fontDefault]}>{this.props.item.childDataList[FIXED_SKU_UNIT_PRICE].label}</Text>
                        </View>
                        <View style={[styles.flexBasis40, styles.paddingTop10, styles.paddingBottom10]}>
                            <Text style={[styles.fontDefault]}> {this.props.item.childDataList[FIXED_SKU_UNIT_PRICE].value}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5, marginBottom: 5, height: 1, backgroundColor: '#f2f2f2' }} />
                    <View style={[styles.flex1, styles.row, styles.paddingBottom5]}>
                        <Slider style={[styles.flexBasis80, {
                            width: 300,
                            flexDirection: 'column',
                        }]}
                            value={parseInt(this.props.item.childDataList[FIXED_SKU_QUANTITY].value)}
                            maximumValue={9999}
                            minimumValue={0}
                            onSlidingComplete={(quantity) => {
                                let payload = {
                                    id: this.props.item.id,
                                    quantity: quantity
                                }
                                this.props.actions.onChangeQuantity(this.props.fixedSKUList, this.props.totalQuantity, payload)
                            }}
                        />
                        <Input
                            style={[styles.flexBasis20, { borderColor: '#00796B', borderWidth: 1, height: 40 }]}
                            editable={true}
                            maxLength={4}
                            placeholder={'0'}
                            keyboardType={'numeric'}
                            value={(this.props.item.childDataList[FIXED_SKU_QUANTITY].value == 0) ? '' : (this.props.item.childDataList[FIXED_SKU_QUANTITY].value).toString()}
                            onChangeText={(quantity) => {
                                let payload = {
                                    id: this.props.item.id,
                                    quantity: quantity
                                }
                                this.onChangeQuantity(payload)
                            }}
                        />
                    </View>
                </View>
            </Content>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FixedSKUListItem)


const style = StyleSheet.create({
    card: {
        paddingLeft: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#d3d3d3',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 2
    }
});
