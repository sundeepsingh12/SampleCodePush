'use strict'

import React, { PureComponent } from 'react'
import { View, Text, Slider, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { Content, Card, CardItem } from 'native-base'
import {
    FIXED_SKU_QUANTITY, FIXED_SKU_UNIT_PRICE, FIXED_SKU_CODE,
} from '../lib/AttributeConstants'
import * as fixedSKUActions from '../modules/fixedSKU/fixedSKUActions'
import { bindActionCreators } from 'redux'


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
    render() {
        return (
            <View>
                <Content>
                    <Card>
                        <CardItem >
                            <Text>{this.props.item.childDataList[FIXED_SKU_CODE].label} : {this.props.item.childDataList[FIXED_SKU_CODE].value}</Text>
                        </CardItem>
                        <CardItem >
                            <Text>{this.props.item.childDataList[FIXED_SKU_UNIT_PRICE].label} : {this.props.item.childDataList[FIXED_SKU_UNIT_PRICE].value}</Text>
                        </CardItem>
                        <CardItem>
                            <Slider style={{
                                width: 300, flex: 9,
                                flexDirection: 'column',
                            }}
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
                            <TextInput style={{ flex: 1 }}
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
                                    this.props.actions.onChangeQuantity(this.props.fixedSKUList, this.props.totalQuantity, payload)
                                }}
                            />
                        </CardItem>
                    </Card>
                </Content>
            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FixedSKUListItem)