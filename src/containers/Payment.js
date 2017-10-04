'use strict'

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TextInput,
} from 'react-native'
import { Container, Content, Footer, FooterTab, Input, Button, Card, CardItem, Icon, Left, Right, List, ListItem, Radio, Body, CheckBox } from 'native-base';
import styles from '../themes/FeStyle'
import theme from '../themes/feTheme'
import PopOver from '../components/PopOver'
import * as paymentActions from '../modules/payment/paymentActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const {
    CASH,
    CHEQUE,
    DEMAND_DRAFT,
    DISCOUNT,
    EZE_TAP,
    MOSAMBEE,
    MOSAMBEE_WALLET,
    MPAY,
    M_SWIPE,
    NET_BANKING,
    NOT_PAID,
    PAYNEAR,
    PAYO,
    PAYTM,
    POS,
    RAZOR_PAY,
    SODEXO,
    SPLIT,
    TICKET_RESTAURANT,
    UPI,
} = require('../lib/AttributeConstants')

const {
    SET_PAYMENT_CHANGED_PARAMETERS,
} = require('../lib/constants').default

function mapStateToProps(state) {
    return {
        actualAmount: state.payment.actualAmount,
        isAmountEditable: state.payment.isAmountEditable,
        isSaveButtonDisabled: state.payment.isSaveButtonDisabled,
        moneyCollectMaster: state.payment.moneyCollectMaster,
        originalAmount: state.payment.originalAmount,
        paymentModeList: state.payment.paymentModeList,
        selectedIndex: state.payment.selectedIndex,
        transactionNumber: state.payment.transactionNumber,
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...paymentActions }, dispatch)
    }
}

class Payment extends Component {

    componentWillMount() {
        this.props.actions.getPaymentParameters(this.props.navigation.state.params.jobMasterId, this.props.navigation.state.params.jobId)
    }

    renderPaymentModeId(modeId) {
        switch (modeId) {
            case CASH.id: return 'Cash'
            case CHEQUE.id: return 'Cheque'
            case DEMAND_DRAFT.id: return 'Demand-Draft'
            case DISCOUNT.id: return 'Discount'
            case EZE_TAP.id: return 'Eze-Tap'
            case MOSAMBEE.id: return 'Mosambee'
            case MOSAMBEE_WALLET.id: return 'Mosambee Wallet'
            case MPAY.id: return 'MPAY'
            case M_SWIPE.id: return 'M-Swipe '
            case NET_BANKING.id: return 'Net Banking'
            case NOT_PAID.id: return 'Not paid'
            case PAYNEAR.id: return 'PayNear'
            case PAYO.id: return 'PAYO'
            case PAYTM.id: return 'PAYTM'
            case POS.id: return 'POS device payment'
            case RAZOR_PAY.id: return 'Razor pay'
            case SODEXO.id: return 'Sodexo'
            case SPLIT.id: return 'Split'
            case TICKET_RESTAURANT.id: return 'Ticket Restaurant'
            case UPI.id: return 'UPI'
        }
    }

    onTextChange(type,payload) {
        this.props.actions.setPaymentState(type, payload)
    }

    renderPaymentModeSelected(modeId) {
        let paymentModeSelectedView = null
        switch (modeId) {
            case CASH.id: paymentModeSelectedView = null
                break
            case CHEQUE.id: paymentModeSelectedView = <View>
                <Text> Cheque Number </Text>
                <View style={StyleSheet.flatten([styles.positionRelative, { zIndex: 1 }])} >
                    <Input
                        placeholder='Regular Textbox'
                        onChangeText={value => this.onTextChange(
                            SET_PAYMENT_CHANGED_PARAMETERS,
                            {
                                actualAmount: this.props.actualAmount,
                                selectedIndex: this.props.selectedIndex,
                                transactionNumber: value
                            }
                        )}
                        style={StyleSheet.flatten([styles.marginTop10, styles.fontSm, { borderWidth: 1, paddingRight: 30, height: 30, borderColor: '#BDBDBD', borderRadius: 4 }])} />
                    {/* <Icon size={12} name='ios-information-circle-outline' style={StyleSheet.flatten([styles.positionAbsolute, styles.fontDanger, styles.fontLg, { right: 8, top: 17 }])} onPress={() => { alert('hello') }} />
                <PopOver visible={this.checkValidation()} /> */}
                </View>
            </View>
                break
            case DEMAND_DRAFT.id: paymentModeSelectedView = <View>
                <Text> DD Number </Text>
                <View style={StyleSheet.flatten([styles.positionRelative, { zIndex: 1 }])} >
                    <Input
                        placeholder='Regular Textbox'
                        onChangeText={value => this.onTextChange(
                            SET_PAYMENT_CHANGED_PARAMETERS,
                            {
                                actualAmount: this.props.actualAmount,
                                selectedIndex: this.props.selectedIndex,
                                transactionNumber: value
                            }
                        )}
                        style={StyleSheet.flatten([styles.marginTop10, styles.fontSm, { borderWidth: 1, paddingRight: 30, height: 30, borderColor: '#BDBDBD', borderRadius: 4 }])}
                    />
                    {/* <Icon size={12} name='ios-information-circle-outline' style={StyleSheet.flatten([styles.positionAbsolute, styles.fontDanger, styles.fontLg, { right: 8, top: 17 }])} onPress={() => { alert('hello') }} />
                <PopOver visible={this.checkValidation()} /> */}
                </View>
            </View>
                break
            case DISCOUNT.id:
            case EZE_TAP.id:
            case MOSAMBEE.id:
            case MOSAMBEE_WALLET.id:
            case MPAY.id:
            case M_SWIPE.id:
            case NET_BANKING.id:
            case NOT_PAID.id:
            case PAYNEAR.id:
            case PAYO.id:
            case PAYTM.id:
            case POS.id:
            case RAZOR_PAY.id:
            case SODEXO.id:
            case SPLIT.id:
            case TICKET_RESTAURANT.id:
            case UPI.id: paymentModeSelectedView = null
                break
        }
        return paymentModeSelectedView
    }

    renderPaymentModeList(paymentModeList) {
        let paymentModeView = []
        for (let index in paymentModeList) {
            paymentModeView.push(
                <ListItem
                    key={paymentModeList[index].id}
                    icon style={StyleSheet.flatten([{ marginLeft: 0 }])}
                    onPress={() => {
                        this.props.actions.setPaymentState(
                            SET_PAYMENT_CHANGED_PARAMETERS,
                            {
                                actualAmount: this.props.actualAmount,
                                selectedIndex: paymentModeList[index].moneyTransactionModeId,
                                transactionNumber: this.props.transactionNumber
                            }
                        )
                    }}>
                    <Body>
                        <Text>{this.renderPaymentModeId(paymentModeList[index].moneyTransactionModeId)}</Text>
                    </Body>
                    <Right>
                        <Radio selected={this.props.selectedIndex == paymentModeList[index].moneyTransactionModeId} style={([styles.marginRight20])} />
                    </Right>
                </ListItem>
            )
        }
        return paymentModeView
    }

    renderAmountToBeCollected() {
        if (this.props.isAmountEditable) {
            return (
                <View style={StyleSheet.flatten([styles.positionRelative, { zIndex: 1 }])} >
                    <TextInput
                        keyboardType='numeric'
                        placeholder='Regular Textbox'
                        onChangeText={value => this.onTextChange(
                            'SET_ACTUAL_AMOUNT',
                            {
                                actualAmount: value,
                                selectedIndex: this.props.selectedIndex,
                                transactionNumber: this.props.transactionNumber
                            }
                        )}
                        style={StyleSheet.flatten([styles.marginTop10, styles.fontSm, { borderWidth: 1, paddingRight: 30, height: 30, borderColor: '#BDBDBD', borderRadius: 4 }])}
                    />
                    {/* <Icon size={12} name='ios-information-circle-outline' style={StyleSheet.flatten([styles.positionAbsolute, styles.fontDanger, styles.fontLg, { right: 8, top: 17 }])} onPress={() => { alert('hello') }} />
                    <PopOver visible={this.checkValidation()} /> */}
                </View>
            )
        } else {
            return (
                <Text> {this.props.actualAmount} </Text>
            )
        }
    }

    render() {
        console.log('props', this.props)
        const amountTobeCollectedView = this.renderAmountToBeCollected()
        const paymentModeView = this.renderPaymentModeList(this.props.paymentModeList)
        const paymentModeSelectedView = this.renderPaymentModeSelected(this.props.selectedIndex)
        return (
            <Container>
                <Content style={StyleSheet.flatten([styles.padding10])}>
                    <Text>
                        Amount to be collected
                    </Text>
                    {amountTobeCollectedView}
                    <Card>
                        <CardItem header>
                            <Text style={StyleSheet.flatten([styles.fontLg, styles.bold])}>Payment Method</Text>
                        </CardItem>
                        <CardItem>
                            <Content>
                                <List>
                                    {paymentModeView}
                                </List>
                            </Content>
                        </CardItem>
                    </Card>
                    <View style={StyleSheet.flatten([styles.marginTop20, styles.marginBottom20])} >
                        {paymentModeSelectedView}
                    </View>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button success
                            disabled={this.props.isSaveButtonDisabled}
                            style={StyleSheet.flatten([{ borderRadius: 0 }])}
                            onPress={() => {
                                this.props.actions.saveMoneyCollectObject(
                                    this.props.actualAmount,
                                    this.props.navigation.state.params.jobMasterId,
                                    this.props.navigation.state.params.jobId,
                                    this.props.navigation.state.params.jobTransactionId,
                                    0,
                                    this.props.moneyCollectMaster,
                                    this.props.originalAmount,
                                    this.props.selectedIndex,
                                    this.props.transactionNumber,
                                    null,
                                    null,
                                )
                            }}
                        >
                            <Text>Save</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment)