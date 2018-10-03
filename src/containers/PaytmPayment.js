'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image
} from 'react-native'

import {
    SET_OTP,
    SET_CONTACT
} from '../lib/constants'

import { Container, Content, Footer, FooterTab, Button, StyleProvider, Header, Body, Icon } from 'native-base'
import styles from '../themes/FeStyle'
import * as paytmPaymentActions from '../modules/paytmPayment/paytmPaymentActions'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loader from '../components/Loader';
import { SafeAreaView } from 'react-navigation'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform'
import _ from 'lodash'
import {
    TOTAL_AMOUNT_FOR_WALLET,
    CUSTOMER_NUMBER,
    ENTER_CUSTOMER_OTP,
    SUBMIT,
    CHECK_TRANSACTION_STATUS,
    TRY_AGAIN,
    COULD_NOT_CONNECT_SERVER
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        paytmLoader: state.paytmReducer.paytmLoader,
        paytmConfigObject: state.paytmReducer.paytmConfigObject,
        contactNumber: state.paytmReducer.contactNumber,
        otp: state.paytmReducer.otp,
        actualAmount: state.paytmReducer.actualAmount,
        showCheckTransaction: state.paytmReducer.showCheckTransaction
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...paytmPaymentActions, ...globalActions }, dispatch)
    }
}

class PaytmPayment extends PureComponent {

    componentDidMount() {
        const contactNumber = !_.isEmpty(this.props.navigation.state.params.contactData) && this.props.navigation.state.params.contactData.length ? this.props.navigation.state.params.contactData[0] : ''
        this.props.actions.getPaytmParameters(contactNumber, this.props.navigation.state.params.jobTransaction, this.props.navigation.state.params.paymentAtEnd.currentElement.jobTransactionIdAmountMap, this.props.navigation.state.params.formLayoutState.jobAndFieldAttributesList)
    }

    _headerModal() {
        return (
            <SafeAreaView style={{ backgroundColor: styles.bgPrimaryColor }}>
                <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                    <Body>
                        <View
                            style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                            <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                            </TouchableOpacity>
                            <View style={[style.headerBody]}>
                                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter, styles.fontWeight500]}>Paytm</Text>
                            </View>
                            <View style={[style.headerRight]}>
                            </View>
                            <View />
                        </View>
                    </Body>
                </Header>
            </SafeAreaView>
        )
    }
    showContactAndOtpScreen() {
        if (this.props.paytmConfigObject && !this.props.paytmConfigObject.isQrCodeTypePaytmPayment && !this.props.showCheckTransaction) {
            return <Content style={[styles.bgWhite]} >
                <View style={[styles.flex1, styles.column]}>
                    <View style={[styles.bgLightGray, styles.justifyCenter, styles.alignCenter, { height: 200 }]}>
                        <Text style={[{ fontSize: 52 }]}>{this.props.actualAmount}</Text>
                        <Text>{TOTAL_AMOUNT_FOR_WALLET}</Text>
                    </View>
                    <View>
                        <View style={{ marginTop: 50 }}>
                            <Text style={[{ color: styles.fontPrimaryColor }, styles.paddingHorizontal10, styles.fontSm]}>{CUSTOMER_NUMBER}</Text>
                        </View>
                        <View>
                            <TextInput
                                placeholder=''
                                value={this.props.contactNumber}
                                keyboardType='numeric'
                                editable={true}
                                returnKeyType='done'
                                onChangeText={(text) => this.props.actions.setState(SET_CONTACT, text)}
                                style={[styles.fontXxl, styles.padding10]}
                            />
                        </View>
                        <View style={{ marginTop: 50 }}>
                            <Text style={[{ color: styles.fontPrimaryColor }, styles.paddingHorizontal10, styles.fontSm]}>{ENTER_CUSTOMER_OTP}</Text>
                        </View>
                        <View>
                            <TextInput
                                placeholder=''
                                value={this.props.otp}
                                keyboardType='numeric'
                                editable={true}
                                returnKeyType='done'
                                onChangeText={(text) => this.props.actions.setState(SET_OTP, text)}
                                style={[styles.fontXxl, styles.padding10]}
                            />
                        </View>
                    </View>
                </View>
            </Content>
        }
    }

    getFooterView() {
        if (this.props.paytmConfigObject && !this.props.paytmConfigObject.isQrCodeTypePaytmPayment) {
            return (
                <SafeAreaView>
                    <Footer style={[style.footer]}>
                        <FooterTab style={[styles.padding10]}>
                            <Button success full
                                disabled={!_.size(_.trim(this.props.contactNumber)) || !_.size(_.trim(this.props.otp))}
                                onPress={() => this.props.actions.initiatePaytmPayment(this.props.paytmConfigObject, this.props.actualAmount, this.props.contactNumber, this.props.otp, this.props.navigation.state.params.formLayoutState.jobAndFieldAttributesList)}>
                                <Text style={[styles.fontLg, styles.fontWhite]}>{SUBMIT}</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </SafeAreaView >
            )
        } else if (this.props.paytmConfigObject && this.props.paytmConfigObject.isQrCodeTypePaytmPayment && !_.isEmpty(this.props.paytmConfigObject.qrCodeData) && !this.props.showCheckTransaction) {
            return (
                <SafeAreaView>
                    <Footer style={[style.footer]}>
                        <FooterTab style={[styles.padding10]}>
                            <Button success full
                                disabled={_.isEmpty(this.props.paytmConfigObject.qrCodeData)}
                                onPress={() => this.props.actions.checkPaytmTransaction(this.props.paytmConfigObject, this.props.navigation.state.params, this.props.actualAmount, this.props.navigation.state.params.paymentAtEnd.currentElement.jobTransactionIdAmountMap, this.props.navigation.state.params.formLayoutState.jobAndFieldAttributesList)}>
                                <Text style={[styles.fontLg, styles.fontWhite]}>CHECK PAYMENT</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </SafeAreaView >
            )
        }
    }
    showQrCode() {
        if (this.props.paytmConfigObject && this.props.paytmConfigObject.isQrCodeTypePaytmPayment && !_.isEmpty(this.props.paytmConfigObject.qrCodeData) && !this.props.showCheckTransaction) {
            return <Image
                resizeMethod={'resize'}
                resizeMode={'contain'}
                source={{ uri: 'data:image/png;base64,' + this.props.paytmConfigObject.qrCodeData }}
                style={[{ height: '100%', width: '100%' }, styles.flex1]}
            />
        } else if (this.props.showCheckTransaction) {
            return (
                <Content style={[styles.bgWhite, styles.padding30]}>
                    <View style={[styles.heightAuto, styles.widthAuto, styles.alignCenter, styles.justifyCenter]}>
                        <Image
                            style={style.imageSync}
                            source={require('../../images/fareye-default-iconset/checkTransactionError.png')}
                        />
                        <Text style={[styles.fontLg, styles.fontBlack, { marginTop: 27 }, styles.padding10]}>
                            Payment response could not be confirmed. Please check transaction again..
                            </Text>
                        <View>
                            <Button bordered style={[{ borderColor: '#EAEAEA', backgroundColor: '#007AFF', borderWidth: 1 }, styles.heightAuto, styles.widthAuto, styles.alignCenter, styles.justifyCenter, { marginTop: 120 }]}
                                onPress={() => { this.props.actions.checkPaytmTransaction(this.props.paytmConfigObject, this.props.navigation.state.params, this.props.actualAmount, this.props.navigation.state.params.paymentAtEnd.currentElement.jobTransactionIdAmountMap, this.props.navigation.state.params.formLayoutState.jobAndFieldAttributesList) }}  >
                                <Text style={[{ color: '#FFFFFF', lineHeight: 25 }, styles.fontWeight500, styles.fontLg]}>{CHECK_TRANSACTION_STATUS}</Text>
                            </Button>
                        </View>
                        <Text style={[{ color: '#007AFF', lineHeight: 22, height: 19, width: 53 }, styles.fontWeight500, styles.fontLg, { marginTop: 40 }]}
                            onPress={() => this.props.navigation.goBack()} >
                            Cancel
                            </Text>
                    </View>
                </Content>
            )
        } else if (this.props.paytmConfigObject && this.props.paytmConfigObject.isQrCodeTypePaytmPayment && _.isEmpty(this.props.paytmConfigObject.qrCodeData)) {
            return (<Content style={[styles.bgWhite, styles.padding30]}>
                <View style={[styles.heightAuto, styles.widthAuto, styles.alignCenter, styles.justifyCenter]}>
                    <Image
                        style={style.imageSync}
                        source={require('../../images/fareye-default-iconset/unable-to-sync.png')}
                    />
                    <Text style={[styles.fontLg, styles.fontBlack, { marginTop: 27 }, styles.padding10]}>
                        {COULD_NOT_CONNECT_SERVER}
                    </Text>
                    <View>
                        <Button bordered style={[{ borderColor: '#EAEAEA', backgroundColor: '#007AFF', borderWidth: 1 }, styles.heightAuto, styles.widthAuto, styles.alignCenter, styles.justifyCenter, { marginTop: 120 }]}
                            onPress={() => { this.props.actions.initiatePaytmPayment(this.props.paytmConfigObject, this.props.actualAmount, null, null, this.props.navigation.state.params.formLayoutState.jobAndFieldAttributesList) }}  >
                            <Text style={[{ color: '#FFFFFF', lineHeight: 25 }, styles.fontWeight500, styles.fontLg]}>{TRY_AGAIN}</Text>
                        </Button>
                    </View>
                </View>
            </Content>
            )
        }
    }
    render() {
        if (this.props.paytmLoader) return <Loader />
        else {
            return (
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        {this._headerModal()}
                        {this.showContactAndOtpScreen()}
                        {this.showQrCode()}
                        {this.getFooterView()}
                    </Container>
                </StyleProvider>
            )
        }
    }
}
const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0,
        elevation: 0
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
        height: 'auto',
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
export default connect(mapStateToProps, mapDispatchToProps)(PaytmPayment)