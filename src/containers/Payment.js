'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import {
    Container, Content, Header, Footer, FooterTab, Input, Button, Item, Card,
    CardItem, Icon, Left, Right, List, ListItem, Radio, Body, CheckBox, StyleProvider
} from 'native-base'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import PopOver from '../components/PopOver'
import * as paymentActions from '../modules/payment/paymentActions'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
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
    SET_SPLIT_PAYMENT,
    SplitPayment
} from '../lib/constants'

import {
    AMOUNT_TO_BE_COLLECTED,
    YES,
    NO,
    SPLIT_PAYMENT,
    SELECT_PAYMENT_METHOD,
    SELECT_PAYMENT_METHOD_TO_SPLIT,
    ENTER_SPLIT_DETAILS,
    SAVE,
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        actualAmount: state.payment.actualAmount,
        isAmountEditable: state.payment.isAmountEditable,
        isSaveButtonDisabled: state.payment.isSaveButtonDisabled,
        moneyCollectMaster: state.payment.moneyCollectMaster,
        originalAmount: state.payment.originalAmount,
        paymentModeList: state.payment.paymentModeList,
        selectedPaymentMode: state.payment.selectedPaymentMode,
        transactionNumber: state.payment.transactionNumber,
        splitPaymentMode: state.payment.splitPaymentMode,
        jobTransactionIdAmountMap: state.payment.jobTransactionIdAmountMap
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...paymentActions, ...globalActions }, dispatch)
    }
}

class Payment extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidMount() {
        this.props.actions.getPaymentParameters(this.props.navigation.state.params.jobTransaction, this.props.navigation.state.params.currentElement.fieldAttributeMasterId, this.props.navigation.state.params.formElements, this.props.navigation.state.params.jobStatusId)
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

    renderChequeOrDD(type) {
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
                                selectedPaymentMode: this.props.selectedPaymentMode,
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
            case CHEQUE.id: paymentModeSelectedView = this.renderChequeOrDD('Cheque Number')
                break
            case DEMAND_DRAFT.id: paymentModeSelectedView = this.renderChequeOrDD('DD Number')
                break
            case CASH.id:
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

    getPaymentModeSelectedResult(moneyTransactionModeId) {
        if (!this.props.selectedPaymentMode) {
            return false
        }
        if (this.props.splitPaymentMode != YES) {
            return (this.props.selectedPaymentMode == moneyTransactionModeId)
        }
        return ((this.props.selectedPaymentMode.otherPaymentModeList && this.props.selectedPaymentMode.otherPaymentModeList[moneyTransactionModeId]) || this.props.selectedPaymentMode.cardPaymentMode == moneyTransactionModeId)
    }

    paymentItemView = (actualAmount, id, moneyTransactionModeId, selectedPaymentMode, transactionNumber, type, disabled) => {
        let paymentSelectedResult = this.getPaymentModeSelectedResult(moneyTransactionModeId)
        return (
            <TouchableOpacity key={id}
                style={[styles.row, styles.alignCenter, { borderColor: paymentSelectedResult ? styles.primaryColor : '#ECECEC' }, this.props.splitPaymentMode == YES ? style.paymentCard : style.paymentList]}
                disabled={disabled}
                onPress={() => { this.props.actions.paymentModeSelect(this.props.selectedPaymentMode, this.props.splitPaymentMode, moneyTransactionModeId, this.props.actualAmount, this.props.transactionNumber) }}
            >
                <Text style={disabled ? [styles.fontDarkGray, { width: '80%' }] : [styles.fontBlack, { width: '80%' }]}>
                    {this.renderPaymentModeId(moneyTransactionModeId, type)}
                </Text>
                <View style={[styles.justifyCenter, styles.row, { width: '20%' }]}>
                    <CheckBox onPress={() => { this.props.actions.paymentModeSelect(this.props.selectedPaymentMode, this.props.splitPaymentMode, moneyTransactionModeId, this.props.actualAmount, this.props.transactionNumber) }} color={disabled ? styles.fontDarkGray.color : styles.primaryColor} style={{ borderRadius: 15 }} checked={paymentSelectedResult} />
                </View>
            </TouchableOpacity>
        )
    }

    renderPaymentModeList(paymentModeList) {
        let finalPaymentView = []
        let paymentModeView = []
        paymentModeView.push(
            <Text key='PaymentText' style={[styles.fontPrimary, styles.fontSm, styles.width100, styles.marginBottom10]}>
                {this.props.splitPaymentMode == YES ? SELECT_PAYMENT_METHOD_TO_SPLIT : SELECT_PAYMENT_METHOD}
            </Text>
        )
        for (let index in paymentModeList.otherPaymentModeList) {
            if (paymentModeList.otherPaymentModeList[index].moneyTransactionModeId == DISCOUNT.id && this.props.splitPaymentMode != YES) {
                continue
            }
            paymentModeView.push(
                this.paymentItemView(this.props.actualAmount, paymentModeList.otherPaymentModeList[index].id, paymentModeList.otherPaymentModeList[index].moneyTransactionModeId, this.props.selectedPaymentMode, null, null, false)
            )
        }
        for (let index in paymentModeList.endPaymentModeList) {
            let cardPaymentMode = false
            if (this.props.splitPaymentMode == YES && this.props.selectedPaymentMode && this.props.selectedPaymentMode.cardPaymentMode) {
                cardPaymentMode = this.props.selectedPaymentMode.cardPaymentMode
            }
            if (paymentModeList.endPaymentModeList[index].moneyTransactionModeId == NET_BANKING.id) {
                for (let type = 97; type < 100; type++) {
                    paymentModeView.push(
                        this.paymentItemView(this.props.actualAmount, type, paymentModeList.endPaymentModeList[index].moneyTransactionModeId, this.props.selectedPaymentMode, null, type, cardPaymentMode ? cardPaymentMode == paymentModeList.endPaymentModeList[index].moneyTransactionModeId ? false : true : false)
                    )
                }
            } else {
                paymentModeView.push(
                    this.paymentItemView(this.props.actualAmount, paymentModeList.endPaymentModeList[index].id, paymentModeList.endPaymentModeList[index].moneyTransactionModeId, this.props.selectedPaymentMode, null, null, cardPaymentMode ? cardPaymentMode == paymentModeList.endPaymentModeList[index].moneyTransactionModeId ? false : true : false)
                )
            }
        }
        finalPaymentView.push(
            <View key='PaymentView' style={[styles.row, styles.marginTop10, styles.flexWrap, styles.justifySpaceBetween]}>
                {paymentModeView}
            </View>
        )

        return finalPaymentView
    }

    renderSplitView() {
        if (!this.props.splitPaymentMode) {
            return null
        }
        return (
            <View style={[styles.marginBottom15]}>
                <Text style={[styles.fontPrimary, styles.fontSm]}>
                    {SPLIT_PAYMENT}
                </Text>
                <View style={[styles.row, styles.marginTop10]}>
                    <TouchableOpacity onPress={() => { this.props.splitPaymentMode != YES ? this.props.actions.setState(SET_SPLIT_PAYMENT, YES) : null }}>
                        <View style={[styles.row, styles.alignCenter]}>
                            <CheckBox onPress={() => { this.props.splitPaymentMode != YES ? this.props.actions.setState(SET_SPLIT_PAYMENT, YES) : null }} color={styles.primaryColor} style={{ borderRadius: 15 }} checked={this.props.splitPaymentMode == YES} />
                            <Text style={[styles.marginLeft20]}>
                                {YES}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.splitPaymentMode != NO ? this.props.actions.setState(SET_SPLIT_PAYMENT, NO) : null }}>
                        <View style={[styles.row, styles.marginLeft15, styles.alignCenter]}>
                            <CheckBox onPress={() => { this.props.splitPaymentMode != NO ? this.props.actions.setState(SET_SPLIT_PAYMENT, NO) : null }} color={styles.primaryColor} style={{ borderRadius: 15 }} checked={this.props.splitPaymentMode == NO} />
                            <Text style={[styles.marginLeft20]}>
                                {NO}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderAmountToBeCollected() {
        return (
            <View style={[styles.marginBottom10]}>
                <Text style={[styles.fontDarkGray, styles.fontSm]}>
                    {AMOUNT_TO_BE_COLLECTED}
                </Text>
                <Item>
                    <Input
                        style={[styles.paddingLeft0]}
                        placeholder="Enter Amount"
                        editable={this.props.isAmountEditable}
                        keyboardType="numeric"
                        KeyboardTypeIOS="decimal-pad"
                        onChangeText={value => this.onTextChange(
                            'SET_ACTUAL_AMOUNT',
                            {
                                actualAmount: value,
                                selectedPaymentMode: this.props.selectedPaymentMode,
                                transactionNumber: this.props.transactionNumber
                            }
                        )}
                        value={this.props.actualAmount && this.props.actualAmount !== 0 ? '' + this.props.actualAmount : null}
                    />
                </Item>
            </View>
        )
    }

    moveToSplitOrSavePayment() {
        if (this.props.splitPaymentMode == YES) {
            this.props.actions.navigateToScene(SplitPayment, {
                selectedPaymentMode: this.props.selectedPaymentMode,
                actualAmount: this.props.actualAmount,
                originalAmount: this.props.originalAmount,
                currentElement: this.props.navigation.state.params.currentElement,
                formElements: this.props.navigation.state.params.formElements,
                jobTransaction: this.props.navigation.state.params.jobTransaction,
                moneyCollectMaster: this.props.moneyCollectMaster,
                isSaveDisabled: this.props.navigation.state.params.isSaveDisabled,
                latestPositionId: this.props.navigation.state.params.latestPositionId,
                paymentContainerKey: this.props.navigation.state.key
            })
        } else {
            this.props.actions.saveMoneyCollectObject(
                this.props.actualAmount,
                this.props.navigation.state.params.currentElement,
                this.props.navigation.state.params.formElements,
                this.props.navigation.state.params.jobTransaction.jobMasterId,
                this.props.navigation.state.params.jobTransaction.jobId,
                this.props.navigation.state.params.jobTransaction,
                this.props.navigation.state.params.latestPositionId,
                this.props.moneyCollectMaster,
                this.props.navigation.state.params.isSaveDisabled,
                this.props.originalAmount,
                this.props.selectedPaymentMode,
                this.props.transactionNumber,
                null,
                null,
                this.props.jobTransactionIdAmountMap
            )
        }
    }

    render() {
        const amountTobeCollectedView = this.renderAmountToBeCollected()
        const paymentModeView = this.renderPaymentModeList(this.props.paymentModeList)
        const paymentModeSelectedView = this.renderPaymentModeSelected(this.props.selectedPaymentMode)
        const splitView = this.renderSplitView()
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, styles.header])}>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingTop5]}>
                                <TouchableOpacity style={[styles.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                </TouchableOpacity>
                                <View style={[styles.headerBody]}>
                                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Status</Text>
                                </View>
                                <View style={[styles.headerRight]}>
                                </View>
                                <View />
                            </View>
                        </Body>
                    </Header>

                    <Content style={[styles.flex1, styles.bgWhite, styles.padding10]}>
                        {amountTobeCollectedView}
                        {splitView}
                        <View style={[styles.marginBottom15]}>
                            {paymentModeView}
                        </View>
                        <View style={StyleSheet.flatten([styles.marginTop20, styles.marginBottom20])} >
                            {paymentModeSelectedView}
                        </View>
                    </Content>
                    <Footer style={[styles.padding10, style.footer]}>
                        <FooterTab>
                            <Button success
                                disabled={this.props.isSaveButtonDisabled}
                                style={StyleSheet.flatten([{ borderRadius: 0 }])}
                                onPress={() => {
                                    this.moveToSplitOrSavePayment()
                                }}
                            >
                                <Text style={[styles.fontWhite]}>{this.props.splitPaymentMode == YES ? ENTER_SPLIT_DETAILS : SAVE}</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </StyleProvider>
        )
    }
}

const style = StyleSheet.create({

    paymentCard: {
        width: '49%',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        marginBottom: 5,
        justifyContent: 'space-between'
    },
    paymentList: {
        borderBottomColor: '#ECECEC',
        borderBottomWidth: 1,
        paddingVertical: 15,
        width: '100%',
        justifyContent: 'space-between'
    },
    footer: {
        height: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3'
    },

});
export default connect(mapStateToProps, mapDispatchToProps)(Payment)