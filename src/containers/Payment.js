'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TextInput
} from 'react-native'
import { Container, Content, Footer, FooterTab, Input, Button, Card, CardItem, Icon, Left, Right, List, ListItem, Radio, Body, CheckBox } from 'native-base'
import styles from '../themes/FeStyle'
import PopOver from '../components/PopOver'
import * as paymentActions from '../modules/payment/paymentActions'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
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
    NET_BANKING_LINK,
    NET_BANKING_CARD_LINK,
    NET_BANKING_UPI_LINK,
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
} from '../lib/AttributeConstants'

import {
    SET_PAYMENT_CHANGED_PARAMETERS,
} from '../lib/constants'

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
        actions: bindActionCreators({ ...paymentActions, ...globalActions }, dispatch)
    }
}

class Payment extends PureComponent {

    componentWillMount() {
        this.props.actions.getPaymentParameters(this.props.navigation.state.params.jobTransaction.jobMasterId, this.props.navigation.state.params.jobTransaction.jobId, this.props.navigation.state.params.currentElement.fieldAttributeMasterId, this.props.navigation.state.params.formElements, this.props.navigation.state.params.jobStatusId)
    }

    renderPaymentModeId(modeId, type) {
        switch (modeId) {
            case CASH.id: return CASH.displayName
            case CHEQUE.id: return CHEQUE.displayName
            case DEMAND_DRAFT.id: return DEMAND_DRAFT.displayName
            case DISCOUNT.id: return DISCOUNT.displayName
            case EZE_TAP.id: return EZE_TAP.displayName
            case MOSAMBEE.id: return MOSAMBEE.displayName
            case MOSAMBEE_WALLET.id: return MOSAMBEE_WALLET.displayName
            case MPAY.id: return MPAY.displayName
            case M_SWIPE.id: return M_SWIPE.displayName
            case NET_BANKING.id: {
                switch (type) {
                    case NET_BANKING_LINK.id: return NET_BANKING_LINK.displayName
                    case NET_BANKING_CARD_LINK.id: return NET_BANKING_CARD_LINK.displayName
                    case NET_BANKING_UPI_LINK.id: return NET_BANKING_UPI_LINK.displayName
                }
            }
            case NOT_PAID.id: return NOT_PAID.displayName
            case PAYNEAR.id: return PAYNEAR.displayName
            case PAYO.id: return PAYO.displayName
            case PAYTM.id: return PAYTM.displayName
            case POS.id: return POS.displayName
            case RAZOR_PAY.id: return RAZOR_PAY.displayName
            case SODEXO.id: return SODEXO.displayName
            case SPLIT.id: return SPLIT.displayName
            case TICKET_RESTAURANT.id: return TICKET_RESTAURANT.displayName
            case UPI.id: return UPI.displayName
        }
    }

    onTextChange(type, payload) {
        this.props.actions.setState(SET_PAYMENT_CHANGED_PARAMETERS, payload)
    }

    renderChequeOrDD(type){
        return (
            <View>
                <Text> {type} </Text>
                <View style={StyleSheet.flatten([styles.positionRelative, { zIndex: 1 }])} >
                    <Input
                        keyboardType="numeric"
                        KeyboardTypeIOS="number-pad"
                        defaultValue={this.props.transactionNumber}
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
                    
                </View>
            </View>
        )
    }

    renderPaymentModeSelected(modeId) {
        let paymentModeSelectedView = null
        switch (modeId) {
            case CASH.id: paymentModeSelectedView = null
                break
            case CHEQUE.id: paymentModeSelectedView = this.renderChequeOrDD('Cheque Number')
                break
            case DEMAND_DRAFT.id: paymentModeSelectedView = this.renderChequeOrDD('DD Number')
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

    paymentItemView = (actualAmount, id, moneyTransactionModeId, selectedIndex, transactionNumber, type) => {
        return (
            <ListItem
                key={id}
                icon style={StyleSheet.flatten([{ marginLeft: 0 }])}
                onPress={() => {
                    selectedIndex !== moneyTransactionModeId ?
                        this.props.actions.setState(
                            SET_PAYMENT_CHANGED_PARAMETERS,
                            {
                                actualAmount,
                                selectedIndex: type ? type : moneyTransactionModeId,
                                transactionNumber
                            }
                        ) : null
                }}>
                <Body>
                    <Text>{this.renderPaymentModeId(moneyTransactionModeId, type)}</Text>
                </Body>
                <Right>
                    <Radio selected={selectedIndex == (type ? type : moneyTransactionModeId)} style={([styles.marginRight20])} />
                </Right>
            </ListItem>
        )
    }

    renderPaymentModeList(paymentModeList) {
        let paymentModeView = []
        for (let index in paymentModeList) {
            if (paymentModeList[index].moneyTransactionModeId == NET_BANKING.id) {
                for (let type = 97; type < 100; type++) {
                    paymentModeView.push(
                        this.paymentItemView(this.props.actualAmount, type, paymentModeList[index].moneyTransactionModeId, this.props.selectedIndex, null, type)
                    )
                }
            } else {
                paymentModeView.push(
                    this.paymentItemView(this.props.actualAmount, paymentModeList[index].id, paymentModeList[index].moneyTransactionModeId, this.props.selectedIndex, null)
                )
            }
        }
        return paymentModeView
    }

    renderAmountToBeCollected() {
        if (this.props.isAmountEditable) {
            return (
                <View style={StyleSheet.flatten([styles.positionRelative, { zIndex: 1 }])} >
                    <Input
                        keyboardType="numeric"
                        KeyboardTypeIOS="number-pad"
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
                        value={this.props.actualAmount != null && this.props.actualAmount != undefined ? '' + this.props.actualAmount : null}
                    />
                  
                </View>
            )
        } else {
            return (
                <Text> {this.props.actualAmount} </Text>
            )
        }
    }

    render() {
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
                                    this.props.navigation.state.params.currentElement,
                                    this.props.navigation.state.params.formElements,
                                    this.props.navigation.state.params.jobTransaction.jobMasterId,
                                    this.props.navigation.state.params.jobTransaction.jobId,
                                    this.props.navigation.state.params.jobTransaction.id,
                                    this.props.navigation.state.params.latestPositionId,
                                    this.props.moneyCollectMaster,
                                    this.props.navigation.state.params.isSaveDisabled,
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