'use strict'

import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Container, Content,Footer, FooterTab, Input, Button, Item,Icon, StyleProvider } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as paymentActions from '../modules/payment/paymentActions'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
     CHEQUE, DEMAND_DRAFT,
} from '../lib/AttributeConstants'
import { AMOUNT_TO_BE_COLLECTED, AMOUNT, PAYMENT, ADD_PAYMENT_MODE, NUMBER, SAVE } from '../lib/ContainerConstants'
import TitleHeader from '../components/TitleHeader'

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
        return { header: <TitleHeader pageName={navigation.state.params.currentElement.label} goBack={navigation.goBack} /> }
    }

    componentDidMount() {
        this.props.actions.getSplitPaymentModeList(this.props.navigation.state.params.selectedPaymentMode)
    }

    renderPaymentModeView(modeTypeId, paymentView, amount) {
        let titleText = this.props.navigation.state.params.renderPaymentModeId(modeTypeId)
        return (
            <View key={modeTypeId} style={[styles.bgWhite, styles.padding10, styles.marginBottom15]}>
                <View style={paymentView ? [styles.marginBottom10] : null}>
                    <Text style={[styles.fontLg, styles.width100, styles.fontCenter, styles.marginBottom10, styles.paddingTop5]}>
                        {titleText} {PAYMENT}
                    </Text>
                    <Text style={[{ color: styles.fontPrimaryColor }, styles.fontSm, styles.width100]}>
                        {AMOUNT}
                    </Text>
                    <Item>
                        <Input
                            style={[styles.paddingLeft0]}
                            placeholder=""
                            keyboardType="numeric"
                            KeyboardTypeIOS="number-pad"
                            returnKeyType='done'
                            editable={paymentView ? false : true}
                            onChangeText={value => this.props.actions.setPaymentAmount(modeTypeId, value, this.props.splitPaymentModeMap)}
                            value={amount && amount !== 0 ? amount + '' : null}
                        />
                    </Item>
                    {paymentView}
                </View>
                {paymentView ? <View style={[styles.marginTop5, styles.marginBottom15]}>
                    <Button bordered small onPress={() => { this.props.actions.changeChequeOrDDPaymentModeList(modeTypeId, this.props.splitPaymentModeMap) }}>
                        <Text style={{ color: styles.fontPrimaryColor }}>{ADD_PAYMENT_MODE}</Text>
                    </Button>
                </View> : null}
            </View>
        )
    }

    renderChequeOrDDView(modeTypeId, id, amount, transactionNumber) {
        let titleText = this.props.navigation.state.params.renderPaymentModeId(modeTypeId)
        return (
            <View key={`${id}${modeTypeId}`} style={[styles.row, styles.justifySpaceBetween, styles.marginTop10]}>
                <View style={[styles.justifySpaceBetween, { width: '50%' }]}>
                    <Text style={[{ color: styles.fontPrimaryColor }, styles.fontSm, styles.width100]}>
                        {titleText} {NUMBER}
                    </Text>
                    <Item>
                        <Input
                            style={[styles.paddingLeft0]}
                            placeholder=""
                            keyboardType="numeric"
                            KeyboardTypeIOS="number-pad"
                            returnKeyType='done'
                            onChangeText={value => { this.props.actions.setPaymentParameterForChequeOrDD(modeTypeId, id, this.props.splitPaymentModeMap, null, value) }}
                            value={transactionNumber && transactionNumber !== 0 ? transactionNumber + '' : null}
                        />
                    </Item>
                </View>
                <View style={[styles.justifySpaceBetween, { width: '35%' }]}>
                    <Text style={[{ color: styles.fontPrimaryColor }, styles.fontSm, styles.width100]}>
                        {titleText} {AMOUNT}
                    </Text>
                    <Item>
                        <Input
                            style={[styles.paddingLeft0]}
                            placeholder=""
                            keyboardType="numeric"
                            KeyboardTypeIOS="number-pad"
                            returnKeyType='done'
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

    render() {
        let paymentModeListView = this.renderPaymentModeListView(this.props.splitPaymentModeMap)
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
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
                                    returnKeyType='done'
                                    editable={false}
                                    value={this.props.navigation.state.params.actualAmount + ''}
                                />
                            </Item>
                        </View>
                        {paymentModeListView}
                    </Content>
                    <SafeAreaView style={[styles.bgWhite]}>
                        <Footer style={[styles.padding10, style.footer]}>
                            <FooterTab>
                                <Button success
                                    disabled={this.props.isSaveButtonDisabled}
                                    style={{ borderRadius: 0 }}
                                    onPress={() => {
                                        this.props.actions.saveMoneyCollectSplitObject(
                                            this.props.navigation.state.params.actualAmount,
                                            this.props.navigation.state.params.currentElement,
                                            this.props.navigation.state.params.formLayoutState,
                                            this.props.navigation.state.params.jobTransaction,
                                            this.props.navigation.state.params.moneyCollectMaster,
                                            this.props.navigation.state.params.originalAmount,
                                            this.props.splitPaymentModeMap,
                                            this.props.navigation.state.params.paymentContainerKey,
                                            this.props.navigation
                                        )
                                    }}
                                >
                                    <Text style={[styles.fontWhite]}>{SAVE}</Text>
                                </Button>
                            </FooterTab>
                        </Footer>
                    </SafeAreaView>
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