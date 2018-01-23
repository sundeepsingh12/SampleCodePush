'use strict'

import React, { Component } from 'react'
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
} from '../lib/constants'

import {
    AMOUNT_TO_BE_COLLECTED,
    AMOUNT,
    PAYMENT,
    ADD_PAYMENT_MODE,
    YES,
    NO,
    SPLIT_PAYMENT,
    SELECT_PAYMENT_METHOD,
    SELECT_PAYMENT_METHOD_TO_SPLIT,
    NUMBER,
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        splitPaymentModeMap: state.payment.splitPaymentModeMap
    }
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...paymentActions, ...globalActions }, dispatch)
    }
}

class SplitPayment extends Component {

    static navigationOptions = ({ navigation }) => {
        return { header: null }
    }

    componentDidMount() {
        this.props.actions.getSplitPaymentModeList(this.props.navigation.state.params.selectedPaymentMode)
    }

    renderPaymentModeView(modeTypeId, paymentView, amount) {
        let titleText = this.renderPaymentModeId(modeTypeId)
        return (
            <View key={modeTypeId} style={[styles.bgWhite, styles.padding10, styles.marginBottom15]}>
                <View style={paymentView ? [styles.marginBottom10] : null}>
                    <Text style={[styles.fontLg, styles.width100, styles.fontCenter, styles.marginBottom10, styles.paddingTop5]}>
                        {titleText} {PAYMENT}
                    </Text>
                    <Text style={[styles.fontPrimary, styles.fontSm, styles.width100]}>
                        {AMOUNT}
                    </Text>
                    <Item>
                        <Input
                            style={[styles.paddingLeft0]}
                            placeholder=""
                            keyboardType="numeric"
                            KeyboardTypeIOS="number-pad"
                            editable={paymentView ? false : true}
                            onChangeText={value => this.props.actions.setPaymentAmount(modeTypeId, value, this.props.splitPaymentModeMap)}
                            value={amount && amount !== 0 ? amount + '' : null}
                        />
                    </Item>
                    {paymentView}
                </View>
                {paymentView ? <View style={[styles.marginTop5, styles.marginBottom15]}>
                    <Button bordered small onPress={() => { this.props.actions.changeChequeOrDDPaymentModeList(modeTypeId, this.props.splitPaymentModeMap) }}>
                        <Text style={[styles.fontPrimary]}>{ADD_PAYMENT_MODE}</Text>
                    </Button>
                </View> : null}
            </View>
        )
    }

    renderChequeOrDDView(modeTypeId, id, amount, transactionNumber) {
        let titleText = this.renderPaymentModeId(modeTypeId)
        return (
            <View key={`${id}${modeTypeId}`} style={[styles.row, styles.justifySpaceBetween, styles.marginTop10]}>
                <View style={[styles.justifySpaceBetween, { width: '50%' }]}>
                    <Text style={[styles.fontPrimary, styles.fontSm, styles.width100]}>
                        {titleText} {NUMBER}
                    </Text>
                    <Item>
                        <Input
                            style={[styles.paddingLeft0]}
                            placeholder=""
                            keyboardType="numeric"
                            KeyboardTypeIOS="number-pad"
                            onChangeText={value => { this.props.actions.setPaymentParameterForChequeOrDD(modeTypeId, id, this.props.splitPaymentModeMap, null, value) }}
                            value={transactionNumber && transactionNumber !== 0 ? transactionNumber + '' : null}
                        />
                    </Item>
                </View>
                <View style={[styles.justifySpaceBetween, { width: '35%' }]}>
                    <Text style={[styles.fontPrimary, styles.fontSm, styles.width100]}>
                        {titleText} {AMOUNT}
                    </Text>
                    <Item>
                        <Input
                            style={[styles.paddingLeft0]}
                            placeholder=""
                            keyboardType="numeric"
                            KeyboardTypeIOS="number-pad"
                            onChangeText={value => { this.props.actions.setPaymentParameterForChequeOrDD(modeTypeId, id, this.props.splitPaymentModeMap, value, null) }}
                            value={amount && amount !== 0 ? amount + '' : null}
                        />
                    </Item>
                </View>
                <TouchableOpacity onPress={() => { this.props.actions.changeChequeOrDDPaymentModeList(modeTypeId, this.props.splitPaymentModeMap, id) }} style={{ width: '10%', paddingTop: 30 }}>
                    <Icon style={[styles.fontDanger]} name='md-remove-circle' />
                </TouchableOpacity>
            </View>
        )
    }

    renderPaymentModeListView(splitPaymentModeMap) {
        let paymentModeListView = [], paymentModeView
        for (let index in splitPaymentModeMap) {
            paymentModeView = null
            if (parseInt(index) == CHEQUE.id || parseInt(index) == DEMAND_DRAFT.id) {
                paymentModeView = []
                for (let splitPaymentMode in splitPaymentModeMap[index].list) {
                    paymentModeView.push(this.renderChequeOrDDView(parseInt(index), splitPaymentMode, splitPaymentModeMap[index].list[splitPaymentMode].amount, splitPaymentModeMap[index].list[splitPaymentMode].transactionNumber))
                }
            }
            paymentModeListView.push(this.renderPaymentModeView(parseInt(index), paymentModeView, splitPaymentModeMap[index].amount))
        }
        return paymentModeListView
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

    render() {
        let paymentModeListView = this.renderPaymentModeListView(this.props.splitPaymentModeMap)
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, styles.header])}>
                        <Body>
                            <View
                                style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingTop5]}>
                                <TouchableOpacity style={[styles.headerLeft]} onPress={() => { this.props.navigation.goBack() }}>
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

                    <Content style={{ backgroundColor: '#f4f4f4' }}>

                        <View style={[styles.bgWhite, styles.padding10, styles.marginBottom15]}>
                            <Text style={[styles.fontDarkGray, styles.fontSm, styles.width100]}>
                                {AMOUNT_TO_BE_COLLECTED}
                            </Text>
                            <Item>
                                <Input
                                    style={[styles.paddingLeft0]}
                                    placeholder=""
                                    keyboardType="numeric"
                                    KeyboardTypeIOS="number-pad"
                                    editable={false}
                                    value={this.props.navigation.state.params.actualAmount + ''}
                                />
                            </Item>
                        </View>
                        {paymentModeListView}
                    </Content>
                    <Footer style={[styles.padding10, style.footer]}>
                        <FooterTab>
                            <Button success
                                disabled={this.props.isSaveButtonDisabled}
                                style={{ borderRadius: 0 }}
                                onPress={() => {
                                    this.props.actions.saveMoneyCollectSplitObject(
                                        this.props.navigation.state.params.actualAmount,
                                        this.props.navigation.state.params.currentElement,
                                        this.props.navigation.state.params.formElements,
                                        this.props.navigation.state.params.jobTransaction,
                                        this.props.navigation.state.params.latestPositionId,
                                        this.props.navigation.state.params.moneyCollectMaster,
                                        this.props.navigation.state.params.isSaveDisabled,
                                        this.props.navigation.state.params.originalAmount,
                                        this.props.splitPaymentModeMap,
                                        this.props.navigation.state.params.paymentContainerKey
                                    )
                                }}
                            >
                                <Text style={[styles.fontWhite]}>Save</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(SplitPayment)