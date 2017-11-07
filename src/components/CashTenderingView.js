'use strict'

import React, { Component } from 'react'
import { View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { Content, Card, CardItem } from 'native-base';
import {
    NUMBER, DECIMAL, STRING,
} from '../lib/AttributeConstants'
import * as cashTenderingActions from '../modules/cashTendering/cashTenderingActions'
import { bindActionCreators } from 'redux'


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
};

class CashTenderingView extends Component {
    render() {
        return (
            <View>
                <Content>
                    <Card style = {{flexDirection: 'row'}}>
                        <CardItem >
                            <Text>{this.props.item.view}  -  </Text>
                        </CardItem>
                        <CardItem>
                            <TextInput style={{justifyContent:'flex-end', alignItems:'flex-end'}}
                                editable={true}
                                maxLength={4}
                                placeholder={'0'}
                                keyboardType={'numeric'}
                                value= {this._checkValueOfDenominations(this.props.item)}
                                onChangeText={(quantity) => {
                                    let payload = {
                                        id: this.props.item.id,
                                        quantity: quantity
                                    }
                                    if(this.props.isReceive == true){
                                    this.props.actions.onChangeQuantity(this.props.cashTenderingList, this.props.totalAmount, payload, this.props.isReceive)
                                    }else {
                                    this.props.actions.onChangeQuantity(this.props.cashTenderingListReturn, this.props.totalAmountReturn, payload, this.props.isReceive)                                    
                                    }
                                }}
                            />
                        </CardItem>
                    </Card>
                </Content>
            </View>
        )
    }

    _checkValueOfDenominations = (item) => {
        return (this.props.item.childDataList[NUMBER].value == 0) ? '' : (this.props.item.childDataList[NUMBER].value).toString() 
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(CashTenderingView)