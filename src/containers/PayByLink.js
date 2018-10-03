'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    BackHandler,
    Image
} from 'react-native'

import {
    ON_CHANGE_PAYBYLINK_MOBILE_NO,
    SET_PAY_BY_LINK_MESSAGE,
    CLEAR_STATE_FOR_PAY_BY_LINK
} from '../lib/constants'

import { Container, Content, Footer, FooterTab, Button, Icon, Body, Header, StyleProvider } from 'native-base';
import styles from '../themes/FeStyle'
import * as payByLinkPaymentActions from '../modules/cardTypePaymentModules/payByLinkPayment/payByLinkPaymentActions'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loader from '../components/Loader'
import { SafeAreaView } from 'react-navigation'
import getTheme from '../../native-base-theme/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import platform from '../../native-base-theme/variables/platform';
import {
    TOTAL_AMOUNT_FOR_WALLET,
    ENTER_CUSTOMER,
    MOBILE_NUMBER,
    TRANSACTION_PENDING,
    TRANSACTION_SUCCESSFUL,
    SMS_LINK_SENT_SUCCESSFULLY,
    RESEND_SMS,
    TRANSACTION_CONFIRMATION,
    TRANSACTION_IS_IN_PENDING_WANT_TO_CANCEL_IT,
    CANCEL,
    SURE_WANT_TO_SEND_SMS_AGAIN,
    NET_BANKING,
    CUSTOMER_APPROVAL,
    LINK_IS_SENT_TO_CUSTOMER_ASK_TO_INTIATE_PAYMENT,
    YES_SEND,
    SEND_SMS,
    NO,
    YES_CANCEL,
    NO_TRANSACTION_FOUND_UNABLE_TO_CONTACT_SERVER,
    CHECK_TRANSACTION_STATUS
} from '../lib/ContainerConstants'
import { isEmpty, size, trim } from 'lodash'
import PaymentSuccessfullScreen from '../components/mosambeeWallet/PaymentSuccessfullScreen'
import CheckTransactionView from '../components/CheckTransactionView'


function mapStateToProps(state) {
    return {
        customerContact: state.payByLinkPayment.customerContact,
        payByLinkConfigJSON: state.payByLinkPayment.payByLinkConfigJSON,
        payByLinkScreenLoader: state.payByLinkPayment.payByLinkScreenLoader,
        payByLinkMessage: state.payByLinkPayment.payByLinkMessage
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...payByLinkPaymentActions, ...globalActions }, dispatch)
    }
}

class PayByLink extends PureComponent {

    componentDidMount() {
        const contactNumber = this.props.navigation.state.params.contactData ? this.props.navigation.state.params.contactData[0] : ''
        this.props.actions.getPayByLinkPaymentParameters(contactNumber, this.props.navigation.state.params.jobTransaction, this.props.navigation.state.params.paymentAtEnd.currentElement.jobTransactionIdAmountMap, this.props.navigation.state.params.paymentAtEnd.modeTypeId)
        this._didFocusSubscription = this.props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    onBackButtonPressAndroid = () => {
        return !isEmpty(this.props.payByLinkMessage) || this.props.payByLinkScreenLoader
    }

    componentWillUnmount() {
        this.props.actions.setState(CLEAR_STATE_FOR_PAY_BY_LINK)
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    onNoChange(number) {
        this.props.actions.setState(ON_CHANGE_PAYBYLINK_MOBILE_NO, number)
    }

    _headerModal() {
        return (
                <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                    <Body>
                        <View
                            style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                            {!this.props.payByLinkMessage && !this.props.payByLinkScreenLoader ? <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                            </TouchableOpacity> : null}
                            <View style={[style.headerBody]}>
                                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter, styles.fontWeight500, (this.props.payByLinkMessage || this.props.payByLinkScreenLoader) ? { marginLeft: 110 } : null]}>{NET_BANKING}</Text>
                            </View>
                            <View style={[style.headerRight]}>
                            </View>
                            <View />
                        </View>
                    </Body>
                </Header>
        )
    }

    _switchModal(message) {
        switch (message) {
            case null: return this._mobileScreenView()
            case SMS_LINK_SENT_SUCCESSFULLY: return this._sendSmsView()
            case RESEND_SMS: return this._reSendLinkView()
            case TRANSACTION_PENDING: return <CheckTransactionView hitCheckTransactionApiForCheckingPayment = {() => {this.props.actions.hitCheckTransactionApiForCheckingPayment(this.props.payByLinkConfigJSON, this.props.navigation.state.params) }} 
                                                                   onCancelAlert = {() => {this._onCancelAlert()}}  errorMessage = {NO_TRANSACTION_FOUND_UNABLE_TO_CONTACT_SERVER}/>
            case TRANSACTION_SUCCESSFUL: return <PaymentSuccessfullScreen/>
            default: return this.showSmsFailedScreen()
        }
    }

    _mobileInputView() {
        return (
            <Content >
                <View style={[styles.flex1, styles.column]}>
                    <View style={[styles.bgLightGray, styles.justifyCenter, styles.alignCenter, { height: 200 }]}>
                        <Text style={[{ fontSize: 52 }]}>{this.props.payByLinkConfigJSON.actualAmount}</Text>
                        <Text>{TOTAL_AMOUNT_FOR_WALLET}</Text>
                    </View>
                    <View>
                        <View style={{ marginTop: 50 }}>
                            <Text style={[{ color: styles.fontPrimaryColor }, styles.paddingHorizontal10, styles.fontSm]}>{ENTER_CUSTOMER + ' ' + MOBILE_NUMBER}</Text>
                        </View>
                        <View>
                            <TextInput
                                placeholder={MOBILE_NUMBER}
                                value={this.props.customerContact}
                                keyboardType='numeric'
                                editable={true}
                                returnKeyType='done'
                                onChangeText={(number) => this.onNoChange(number)}
                                style={[styles.fontXxxl, styles.padding10]}
                            />
                        </View>
                    </View>
                </View>
            </Content>
        )
    }

    _sendSmsView() {
        return (
            <Content >
                <View style={[styles.flex1, styles.column, styles.justifyCenter, styles.alignCenter]}>
                    <View style={[styles.justifyCenter, styles.alignCenter, { marginTop: 165 }]}>
                        <Text style={[{ fontSize: 18 }, styles.fontBlack]}>{CUSTOMER_APPROVAL}</Text>
                        <Text style={[{ fontSize: 14 }, styles.marginTop15, styles.fontDarkGray, styles.fontCenter, { marginLeft: 62, marginRight: 70 }]}>{LINK_IS_SENT_TO_CUSTOMER_ASK_TO_INTIATE_PAYMENT}</Text>
                    </View>
                    <View style={{ marginTop: 130 }}>
                        <View style={[styles.borderRadius50, styles.justifyCenter, { backgroundColor: '#1214CF', width: 64, height: 64 }]}>
                            <MaterialIcons name='arrow-forward' style={[styles.fontXxxl, styles.alignSelfCenter, styles.fontWhite, styles.padding5]} onPress={() => { this.props.actions.hitCheckTransactionApiForCheckingPayment(this.props.payByLinkConfigJSON, this.props.navigation.state.params) }}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={[{ fontSize: 16, color: '#007AFF' }, styles.marginTop25, styles.fontCenter]} onPress={() => { this.props.actions.setState(SET_PAY_BY_LINK_MESSAGE, RESEND_SMS) }}>{RESEND_SMS}</Text>
                    </View>
                </View>
            </Content>
        )
    }

    _reSendLinkView() {
        return (
            <Content >
                <View style={[styles.flex1, styles.column, styles.justifyCenter, styles.alignCenter]}>
                    <View style={[styles.justifyCenter, styles.alignCenter, { marginTop: 170 }]}>
                        <Text style={[{ fontSize: 16, color: '#212121' }, styles.marginTop15, styles.fontCenter, { marginLeft: 62, marginRight: 70 }]}>{SURE_WANT_TO_SEND_SMS_AGAIN}</Text>
                    </View>
                    <View>
                        <Button bordered style={[{ borderColor: '#EAEAEA', backgroundColor: '#007AFF', borderWidth: 1 }, { height: 50, width: 120 }, styles.alignCenter, styles.justifyCenter, { marginTop: 153 }]}
                            onPress={() => { this.props.actions.hitPayByLinkApiForPayment(this.props.customerContact, this.props.payByLinkConfigJSON, this.props.navigation.state.params.paymentAtEnd.modeTypeId, this.props.navigation.state.params) }}>
                            <Text style={[{ color: '#FFFFFF', lineHeight: 19 }, styles.fontWeight500, styles.fontLg]}>{YES_SEND}</Text>
                        </Button>
                    </View>
                    <View>
                        <Text style={[{ fontSize: 16, color: '#727272' }, styles.marginTop25, styles.fontCenter]} onPress={() => { this.props.actions.setState(SET_PAY_BY_LINK_MESSAGE, SMS_LINK_SENT_SUCCESSFULLY) }} >{CANCEL}</Text>
                    </View>
                </View>
            </Content>
        )
    }

    _mobileScreenView() {
        if (this.props.payByLinkConfigJSON) {
            return (
                <Container>
                    {this._mobileInputView()}
                    {this._footerView()}
                </Container>
            )
        }
    }

    showSmsFailedScreen() {
        let buttonView = this.retrySmsView()
        return (
            <Content>
                <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
                    <Image
                        style={style.imageSync}
                        source={require('../../images/fareye-default-iconset/checkTransactionError.png')}
                    />
                    <Text style={[styles.fontLg, styles.fontBlack, { marginTop: 27 }]}>
                        {this.props.payByLinkMessage}
                    </Text>
                    {buttonView}
                    <Text style={[{ color: '#007AFF', lineHeight: 19, height: 19, width: 53 }, styles.fontWeight500, styles.fontLg, { marginTop: 54 }]}
                        onPress={() => this.props.navigation.goBack(null)} >
                        {CANCEL}
                    </Text>
                </View>
            </Content>
        )
    }

    retrySmsView() {
        return (
            <View>
                <Button bordered style={[{ borderColor: '#EAEAEA', backgroundColor: '#007AFF', borderWidth: 1 }, { height: 50, width: 150 }, styles.alignCenter, styles.justifyCenter, { marginTop: 183 }]}
                    onPress={() => { this.props.actions.hitPayByLinkApiForPayment(this.props.customerContact, this.props.payByLinkConfigJSON, this.props.navigation.state.params.paymentAtEnd.modeTypeId, this.props.navigation.state.params) }}  >
                    <Text style={[{ color: '#FFFFFF', lineHeight: 19 }, styles.fontWeight500, styles.fontLg]}>{RESEND_SMS}</Text>
                </Button>
            </View>
        )
    }

    _onCancelAlert = () => {
        Alert.alert(
            TRANSACTION_CONFIRMATION,
            TRANSACTION_IS_IN_PENDING_WANT_TO_CANCEL_IT,
            [
                { text: NO, style: 'cancel' },
                { text: YES_CANCEL, onPress: this.onAlertPress },
            ],
            { cancelable: false }
        )
    }

    onAlertPress = () => {
        this.props.navigation.goBack(null)
    }

    _footerView() {
        return (
            <SafeAreaView>
                <Footer style={[style.footer,styles.autoHeightFooter]}>
                    <FooterTab style={[styles.padding10]}>
                        <Button success full
                            disabled={!size(trim(this.props.customerContact))}
                            onPress={() => { this.props.actions.hitPayByLinkApiForPayment(this.props.customerContact, this.props.payByLinkConfigJSON, this.props.navigation.state.params.paymentAtEnd.modeTypeId, this.props.navigation.state.params) }}>
                            <Text style={[styles.fontLg, styles.fontWhite]}>{SEND_SMS}</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </SafeAreaView>
        )
    }

    render() {
        const headerView = this._headerModal()
        const viewModal = (this.props.payByLinkScreenLoader) ? <Loader /> : this._switchModal(this.props.payByLinkMessage)
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container style={{ backgroundColor: '#fff' }}>
                    {headerView}
                    {viewModal}
                </Container>
            </StyleProvider>
        )
    }
}

const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0
    },
    headerLeft: {
        width: '15%',
        padding: 15
    },
    headerBody: {
        width: '70%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerRight: {
        width: '15%',
        padding: 15
    },
    footer: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',
        paddingTop: 4,
        paddingBottom: 4
    },
    imageSync: {
        width: 116,
        height: 116,
        resizeMode: 'contain'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(PayByLink)