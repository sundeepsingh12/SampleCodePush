'use strict'

import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, Platform, TextInput, Modal, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { SET_MODAL_VIEW, SET_OTP_MODAL_VIEW, CHANGE_WALLET_MOBILE_NO, SET_ERROR_MESSAGE_FOR_WALLET, CHANGE_OTP_NUMBER, RESET_STATE_FOR_WALLET, SET_ERROR_FOR_OTP } from '../lib/constants'
import { Container, Content, Footer, FooterTab, Button, Icon, Body, Header, Toast, StyleProvider } from 'native-base';
import styles from '../themes/FeStyle'
import * as mosambeeWalletActions from '../modules/cardTypePaymentModules/mosambeeWalletPayment/mosambeeWalletActions'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import WalletListView from '../components/mosambeeWallet/WalletListView'
import OtpGeneratedView from '../components/mosambeeWallet/OtpGeneratedView'
import OtpDetailView from '../components/mosambeeWallet/OtpDetailView'
import Loader from '../components/Loader'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import {
    FAILED,
    TRANSACTION_SUCCESSFUL,
    PAYMENT_FAILED,
    PAYMENT_SUCCESSFUL,
    RETRY_PAYMENT,
    FINISH,
    SUBMIT,
    SEND_OTP,
    RESEND,
    CLOSE,
    MOSAMBEE_WALLET,
    PAYMENT
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        isLoaderRunning: state.mosambeeWalletPayment.isLoaderRunning,
        isModalVisible: state.mosambeeWalletPayment.isModalVisible,
        walletParameters: state.mosambeeWalletPayment.walletParameters,
        walletList: state.mosambeeWalletPayment.walletList,
        errorMessage: state.mosambeeWalletPayment.errorMessage,
        selectedWalletDetails: state.mosambeeWalletPayment.selectedWalletDetails,
        contactNumber: state.mosambeeWalletPayment.contactNumber,
        otpNumber: state.mosambeeWalletPayment.otpNumber
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...mosambeeWalletActions, ...globalActions }, dispatch)
    }
}

class MosambeeWalletPayment extends PureComponent {

    componentDidMount() { 
        const contactNumber  = this.props.navigation.state.params.contactData ? this.props.navigation.state.params.contactData[0] : ''
        this.props.actions.setWalletParametersAndGetWalletList(contactNumber, this.props.navigation.state.params.jobTransaction ,this.props.navigation.state.params.paymentAtEnd.currentElement.jobTransactionIdAmountMap)
    }
    componentWillUnmount() {
        this.props.actions.setState(RESET_STATE_FOR_WALLET)
    }

    _showModalView = (modalStatus, checkForPayment) => {
        if (modalStatus <= 4 && !this.props.isLoaderRunning && !checkForPayment) {
            (modalStatus == 1) ? this.props.navigation.goBack() : this.props.actions.setState(SET_MODAL_VIEW, modalStatus - 1)
        }
    }

    navigateToOtpDetails = (walletDetails) => {
        this.props.actions.setState(SET_OTP_MODAL_VIEW, {
            isModalVisible: 2,
            selectedWalletDetails: walletDetails
        })
    }

    setModal(isModalVisible) {
        switch (isModalVisible) {
            case 1: return <WalletListView walletListData={this.props.walletList} contactNumber={this.props.navigation.state.params.contactData} generateOtpNumber={this.navigateToOtpDetails} />
            case 2: return <OtpGeneratedView contactNumber={this.props.contactNumber} onChangeMobileNo={this.onChangeMobileNo} selectedWalletDetails={this.props.selectedWalletDetails} actualAmount={this.props.walletParameters.actualAmount} />
            case 3: return <OtpDetailView onResendOtp={this._hitOtpUrlApi} otpNumber={this.props.otpNumber} onChangeOtpNo={this.onChangeOtpNo} contactNumber={this.props.contactNumber} showModalView={this._showModalView} isModalShow={this.props.isModalVisible} />
        }
    }

    onChangeMobileNo = (value) => {
        this.props.actions.setState(CHANGE_WALLET_MOBILE_NO, value)
    }

    onChangeOtpNo = (value) => {
        this.props.actions.setState(CHANGE_OTP_NUMBER, value)
    }

    checkTransactionStatusApi() {
        this.props.actions.hitCheckTransactionStatusApi("20", this.props.walletParameters)
    }

    _hitOtpUrlApi = (message) => {
        if (this.props.isModalVisible == 2 || _.isEqual(message, RESEND)) {
            this.props.actions.hitOtpUrlToGetOtp(this.props.contactNumber, this.props.walletParameters, this.props.selectedWalletDetails, this.props.navigation.state.params)
        } else {
            this.props.actions.hitPaymentUrlforPayment(this.props.contactNumber, this.props.walletParameters, this.props.selectedWalletDetails, this.props.otpNumber, this.props.navigation.state.params, this.props.navigation.push, this.props.navigation.goBack, this.props.navigation.state.key)
        }
    }

    getFooterView() {
        return (
            <SafeAreaView>
                <Footer style={[style.footer]}>
                    <FooterTab style={[styles.padding10]}>
                        <Button success full
                            disabled={!_.size(_.trim(this.props.contactNumber)) || (this.props.isModalVisible == 3 && !_.size(_.trim(this.props.otpNumber)))}
                            onPress={() => this._hitOtpUrlApi()}>
                            <Text style={[styles.fontLg, styles.fontWhite]}>{this.props.isModalVisible == 2 ? SEND_OTP : SUBMIT}</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </SafeAreaView>
        )
    }

    showErrorScreen() {
        if (this.props.isModalVisible == 5 || this.props.isModalVisible == 6) {
            return this.showPaymentFailedScreen()
        } else {
            return this.dafaultErrorScreen()
        }
    }

    dafaultErrorScreen() {
        return (
            <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                    <Image
                        style={[style.imageSync]}
                        source={require('../../images/fareye-default-iconset/error.png')}
                    />
                    <Text style={[styles.fontBlack, styles.marginTop30]}>
                        {this.props.errorMessage}
                    </Text>
                </View>
                <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>

                    <View style={[styles.marginTop30, styles.alignCenter]}>
                        <Button bordered style={{ borderColor: styles.bgPrimaryColor }}
                            onPress={() => { this._showModalView(this.props.isModalVisible) }}  >
                            <Text style={[{ color: styles.fontPrimaryColor }]}>{CLOSE}</Text>
                        </Button>
                    </View>
                </View>
            </View>
        )
    }

    showPaymentSuccessfulScreen() {
        return (
            <Content>
                <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
                    <Image
                        style={style.imageSync}
                        source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
                    />
                    <Text style={[styles.fontLg, styles.fontBlack, styles.marginTop30]}>
                        {PAYMENT_SUCCESSFUL}
                    </Text>
                </View>
            </Content>
        )
    }
    transactionStatusButtonView() {
        let checkForRetryButtonView = _.isEqual(this.props.errorMessage, FAILED)
        return (
            <View>
                <Button bordered style={[{ borderColor: '#EAEAEA', backgroundColor: checkForRetryButtonView ? '#F2F1FF' : '#007AFF', borderWidth: 1 }, { height: 50, width: checkForRetryButtonView ? 200 : 126 }, styles.alignCenter, styles.justifyCenter, { marginTop: 183 }]}
                    onPress={() => { this.checkTransactionStatusApi() }}  >
                    <Text style={[{ color: checkForRetryButtonView ? '#212121' : '#FFFFFF', lineHeight: 19 }, styles.fontWeight500, styles.fontLg]}> {checkForRetryButtonView ? 'Transaction Status' : 'Try Again'}</Text>
                </Button>
            </View>
        )
    }
    retryButtonView() {
        const contactNumber  = this.props.navigation.state.params.contactData ? this.props.navigation.state.params.contactData[0] : ''
        return (
            <View>
                <Button bordered style={[{ borderColor: '#EAEAEA', backgroundColor: '#007AFF', borderWidth: 1 }, { height: 50, width: 150 }, styles.alignCenter, styles.justifyCenter, { marginTop: 183 }]}
                    onPress={() => { this.props.actions.setWalletParametersAndGetWalletList(contactNumber, this.props.navigation.state.params.jobTransaction ,this.props.navigation.state.params.paymentAtEnd.currentElement.jobTransactionIdAmountMap) }}  >
                    <Text style={[{ color: '#FFFFFF', lineHeight: 19 }, styles.fontWeight500, styles.fontLg]}>Retry Payment</Text>
                </Button>
            </View>
        )
    }
    showPaymentSuccessfulScreen() {
        return (
            <Content>
                <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
                    <Image
                        style={style.imageSync}
                        source={require('../../images/fareye-default-iconset/syncscreen/All_Done.png')}
                    />
                    <Text style={[styles.fontLg, styles.fontBlack, styles.marginTop30]}>
                        {PAYMENT_SUCCESSFUL}
                    </Text>
                </View>
            </Content>
        )
    }

    showPaymentFailedScreen() {
        let buttonView = (this.props.isModalVisible == 5) ? this.retryButtonView() : this.transactionStatusButtonView()
        return (
            <Content>
                <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
                    <Image
                        style={style.imageSync}
                        source={(this.props.isModalVisible == 4) ? require('../../images/fareye-default-iconset/checkTransactionError.png') : require('../../images/fareye-default-iconset/unable-to-sync.png')}
                    />
                    <Text style={[styles.fontLg, styles.fontBlack, { marginTop: 27 }]}>
                        {(_.isEqual(this.props.errorMessage, FAILED)) ? PAYMENT_FAILED : this.props.errorMessage}
                    </Text>
                    {buttonView}
                    <Text style={[{ color: '#007AFF', lineHeight: 19, height: 19, width: 53 }, styles.fontWeight500, styles.fontLg, { marginTop: 54 }]}
                        onPress={() => this.props.navigation.goBack()} >
                        Cancel
                    </Text>
                </View>
            </Content>
        )
    }

    checkForModalToShow(errorMessage) {
        switch (errorMessage) {
            case null: return this.setModal(this.props.isModalVisible)
            case TRANSACTION_SUCCESSFUL: return this.showPaymentSuccessfulScreen()
            case FAILED: return this.showPaymentFailedScreen()
            default: return this.showErrorScreen()
        }
    }

    _headerModal(checkForPayment) {
        return (
            <SafeAreaView style={{ backgroundColor: styles.bgPrimaryColor }}>
                <Header searchBar style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, style.header])}>
                    <Body>
                        <View
                            style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                            {this.props.isModalVisible < 3 && _.isEqual(this.props.errorMessage, null) ? <TouchableOpacity style={[style.headerLeft]} onPress={() => { this._showModalView(this.props.isModalVisible, checkForPayment) }}>
                                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                            </TouchableOpacity> : null}
                            <View style={[style.headerBody]}>
                                {this.props.isModalVisible > 3 ? <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, { marginLeft: 100 }, styles.fontWeight500]}>{PAYMENT}</Text>
                                    : <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter, styles.fontWeight500,  checkForPayment ? { marginLeft: 100 } : null]}>{MOSAMBEE_WALLET}</Text>}
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

    render() {
        const viewModal = (this.props.isLoaderRunning) ? <Loader /> : this.checkForModalToShow(this.props.errorMessage)
        const checkForPayment = !_.isEqual(this.props.errorMessage, null) || this.props.isModalVisible == 3
        const footerView = (((this.props.isModalVisible == 2 || this.props.isModalVisible == 3) && !this.props.errorMessage)) && !this.props.isLoaderRunning ? this.getFooterView() : null
        const headerView = this._headerModal(checkForPayment)
        return (
            <Modal
                animationType="fade"
                onRequestClose={() => this._showModalView(this.props.isModalVisible, checkForPayment)}>
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        {headerView}
                        {viewModal}
                        {footerView}
                    </Container>
                </StyleProvider>
            </Modal>
        )
    }
}

const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
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
});

export default connect(mapStateToProps, mapDispatchToProps)(MosambeeWalletPayment)