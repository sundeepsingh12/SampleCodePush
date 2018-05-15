'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TextInput,
    Modal,
    TouchableOpacity,
    Image
} from 'react-native'

import {
    SET_MODAL_VIEW,
    SET_OTP_MODAL_VIEW,
    CHANGE_WALLET_MOBILE_NO,
    SET_ERROR_MESSAGE_FOR_WALLET,
    CHANGE_OTP_NUMBER,
    RESET_STATE_FOR_WALLET,
    SET_ERROR_FOR_OTP
} from '../lib/constants'

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
    OTP_NUMBER_CAN_NOT_BE_BLANK,
    MOBILE_NO_CAN_NOT_BE_BLANK,
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
        if (!this.props.walletList) this.props.actions.setWalletParametersAndGetWalletList(this.props.navigation.state.params.contactData[0])
    }

    // static navigationOptions = ({ navigation }) => {
    //     return { header: null }
    // }

    _showModalView = (modalStatus, checkForPayment) => {
        if (this.props.errorMessage && !checkForPayment) {
            if (modalStatus == 0) this.props.navigation.goBack()
            this.props.actions.setState(SET_ERROR_MESSAGE_FOR_WALLET, { errorMessage: null, isModalVisible: modalStatus })
        } else if (!this.props.isLoaderRunning && !checkForPayment) {
            (modalStatus == 1) ? this.props.navigation.goBack() : this.props.actions.setState(SET_MODAL_VIEW, modalStatus - 1)
        }
    }

    navigateToOtpDetails = (walletDetails) => {
        this.props.actions.setState(SET_OTP_MODAL_VIEW, {
            isModalVisible: 2,
            selectedWalletDetails: walletDetails
        })
    }

    setModal(isModalVisible, actualAmount) {
        switch (isModalVisible) {
            case 1: return <WalletListView walletListData={this.props.walletList} contactNumber={this.props.navigation.state.params.contactData} generateOtpNumber={this.navigateToOtpDetails} />
            case 2: return <OtpGeneratedView contactNumber={this.props.contactNumber} onChangeMobileNo={this.onChangeMobileNo} selectedWalletDetails={this.props.selectedWalletDetails} actualAmount={actualAmount} message={this.props.errorMessage} />
            case 3: return <OtpDetailView onResendOtp={this._hitOtpUrlApi} otpNumber={this.props.otpNumber} onChangeOtpNo={this.onChangeOtpNo} contactNumber={this.props.contactNumber} actualAmount={actualAmount} showModalView={this._showModalView} isModalShow={this.props.isModalVisible} message={this.props.errorMessage} />
        }
    }

    onChangeMobileNo = (value) => {
        this.props.actions.setState(CHANGE_WALLET_MOBILE_NO, value)
    }

    onChangeOtpNo = (value) => {
        this.props.actions.setState(CHANGE_OTP_NUMBER, value)
    }

    checkForOtpNumberForPaymentApi(actualAmount) {
        (this.props.otpNumber) && _.size(this.props.otpNumber) ?
            this.props.actions.hitPaymentUrlforPayment(this.props.contactNumber, this.props.walletParameters, this.props.selectedWalletDetails, actualAmount, this.props.navigation.state.params.jobTransaction, this.props.otpNumber, this.props.navigation.state.params)
            : this.props.actions.setState(SET_ERROR_FOR_OTP, OTP_NUMBER_CAN_NOT_BE_BLANK)
    }

    checkForMobileNumberForOtpApi(actualAmount) {
        (this.props.contactNumber) && _.size(this.props.contactNumber) ?
            this.props.actions.hitOtpUrlToGetOtp(this.props.contactNumber, this.props.walletParameters, this.props.selectedWalletDetails, actualAmount, this.props.navigation.state.params.jobTransaction)
            : this.props.actions.setState(SET_ERROR_FOR_OTP, MOBILE_NO_CAN_NOT_BE_BLANK)

    }

    _hitOtpUrlApi = (message, checkForPayment, actualAmount) => {
        if (checkForPayment) {
            _.isEqual(this.props.errorMessage, FAILED) ? this.props.actions.setState(SET_MODAL_VIEW, 1) : this.stateChangeOnBack()
        } else {
            (this.props.isModalVisible == 2 || _.isEqual(message, RESEND)) ? this.checkForMobileNumberForOtpApi(actualAmount) : this.checkForOtpNumberForPaymentApi(actualAmount)
        }
    }

    getFooterView(checkForPayment, actualAmount) {
        return (
            <Footer style={[style.footer]}>
                <FooterTab style={[styles.padding10]}>
                    <Button success full
                        onPress={() => this._hitOtpUrlApi(null, checkForPayment, actualAmount)}
                    >{checkForPayment ? <Text style={[styles.fontLg, styles.fontWhite]}>{_.isEqual(this.props.errorMessage, TRANSACTION_SUCCESSFUL) ? FINISH : RETRY_PAYMENT}</Text>
                        : <Text style={[styles.fontLg, styles.fontWhite]}>{this.props.isModalVisible == 2 ? SEND_OTP : SUBMIT}</Text>}
                    </Button>
                </FooterTab>
            </Footer>
        )
    }

    showErrorScreen() {
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

    stateChangeOnBack() {
        this.props.actions.setState(RESET_STATE_FOR_WALLET)
        this.props.navigation.goBack()
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
        return (
            <Content>
                <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
                    <Image
                        style={style.imageSync}
                        source={require('../../images/fareye-default-iconset/unable-to-sync.png')}
                    />
                    <Text style={[styles.fontLg, styles.fontBlack, styles.marginTop30]}>
                        {PAYMENT_FAILED}
                    </Text>
                </View>
            </Content>
        )
    }

    checkForModalToShow(errorMessage, actualAmount) {
        switch (errorMessage) {
            case OTP_NUMBER_CAN_NOT_BE_BLANK:
            case MOBILE_NO_CAN_NOT_BE_BLANK:
            case null: return this.setModal(this.props.isModalVisible, actualAmount)
            case TRANSACTION_SUCCESSFUL: return this.showPaymentSuccessfulScreen()
            case FAILED: return this.showPaymentFailedScreen()
            default: return this.showErrorScreen()
        }
    }

    _headerModal(checkForPayment) {
        return (
            <Header searchBar style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, style.header])}>
                <Body>
                    <View
                        style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                        {!checkForPayment ? <TouchableOpacity style={[style.headerLeft]} onPress={() => { this._showModalView(this.props.isModalVisible, checkForPayment) }}>
                            <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                        </TouchableOpacity> : null}
                        <View style={[style.headerBody]}>
                            {checkForPayment ? <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, { marginLeft: 100 }, styles.fontWeight500]}>{PAYMENT}</Text>
                                : <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter, styles.fontWeight500]}>{MOSAMBEE_WALLET}</Text>}
                        </View>
                        <View style={[style.headerRight]}>
                        </View>
                        <View />
                    </View>
                </Body>
            </Header>
        )
    }

    render() {
        const paymentAtEnd = this.props.navigation.state.params.paymentAtEnd
        const actualAmount = (paymentAtEnd && paymentAtEnd.currentElement && paymentAtEnd.currentElement.jobTransactionIdAmountMap && paymentAtEnd.currentElement.jobTransactionIdAmountMap.actualAmount) ? paymentAtEnd.currentElement.jobTransactionIdAmountMap.actualAmount : 0
        const viewModal = (this.props.isLoaderRunning) ? <Loader /> : this.checkForModalToShow(this.props.errorMessage, actualAmount)
        const checkForPayment = _.isEqual(this.props.errorMessage, TRANSACTION_SUCCESSFUL) || _.isEqual(this.props.errorMessage, FAILED)
        const footerView = (((this.props.isModalVisible == 2 || this.props.isModalVisible == 3) && !this.props.errorMessage) || checkForPayment) && !this.props.isLoaderRunning ? this.getFooterView(checkForPayment, actualAmount) : null
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