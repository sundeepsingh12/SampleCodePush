'use strict'

import React, { PureComponent } from 'react'
import { View, Text, TextInput, Input } from 'react-native'
import { connect } from 'react-redux'
import { Content, Card, CardItem, Toast } from 'native-base'
import {
    NUMBER, DECIMAL, STRING,
} from '../lib/AttributeConstants'
import * as cashTenderingActions from '../modules/cashTendering/cashTenderingActions'
import { bindActionCreators } from 'redux'
import styles from '../themes/FeStyle'

import {
    QUANTITY_NOT_A_NUMBER,
    OK
} from '../lib/ContainerConstants'

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...cashTenderingActions }, dispatch)
    }
}

function mapStateToProps(state) {
    return {
        cashTenderingList: state.cashTenderingReducer.cashTenderingList,
        totalAmount: state.cashTenderingReducer.totalAmount,
        isReceive: state.cashTenderingReducer.isReceive,
        totalAmountReturn: state.cashTenderingReducer.totalAmountReturn,
        cashTenderingListReturn: state.cashTenderingReducer.cashTenderingListReturn,
    }
}

class CashTenderingView extends PureComponent {
    render() {
        return (
            <View style={[styles.bgWhite, styles.row, styles.justifySpaceBetween, styles.alignCenter, styles.padding10, styles.borderBottomLightGray]}>
                <View >
                    <Text style={[styles.fontLg]}>{this.props.item.view}</Text>
                </View>
                <View >
                    <Text style={[styles.fontLg]}>  -  </Text>
                </View>
                <View>
                    <TextInput style={[styles.flexBasis20, styles.fontLg, { borderColor: '#00796B', borderWidth: 1, height: 40, width: 70 }]}
                        editable={true}
                        placeholder={'0'}
                        keyboardType={'numeric'}
                        value={this._checkValueOfDenominations(this.props.item)}
                        onChangeText={this._onChangeText}
                    />
                </View>
            </View>
        )
    }

    _checkValueOfDenominations = (item) => {
        return (item.childDataList[NUMBER].value == 0) ? '' : (item.childDataList[NUMBER].value).toString()
    }

    _onChangeText = (quantity) => {
        if (quantity && !parseInt(quantity) && parseInt(quantity) != 0) {
            { Toast.show({ text: QUANTITY_NOT_A_NUMBER + quantity, position: "bottom" | "center", buttonText: OK, duration: 3000 }) }
            return
        }
        {
            let payload = {
                id: this.props.item.id,
                quantity
            }
            if (this.props.isReceive) {
                this.props.actions.onChangeQuantity(this.props.cashTenderingList, this.props.totalAmount, payload, this.props.isReceive)
            } else {
                this.props.actions.onChangeQuantity(this.props.cashTenderingListReturn, this.props.totalAmountReturn, payload, this.props.isReceive)
            }
        }
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(CashTenderingView)