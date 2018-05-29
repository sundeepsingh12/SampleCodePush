import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TextInput,
    Platform,
    TouchableOpacity,
} from 'react-native'
import Loader from '../components/Loader'
import { Content, Button, StyleProvider, Item, Icon, Spinner } from 'native-base';
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setState } from '../modules/global/globalActions'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import {
    ENTER_MOBILE,
    CLOSE,
    SEND_OTP,
    ENTER_OTP,
    OTP_CODE_SENT,
    PROCEED,
    EDIT,
    RESEND_OTP_NO,
    DID_NOT_RECEIVE_OTP,
    ONE_TIME_PASSOWRD_WILL_BE_SENT_TO_MOBILE_NO,
    SHOW_MOBILE_SCREEN,
    SHOW_OTP
} from '../lib/ContainerConstants'

import {
    ON_MOBILE_NO_CHANGE,
    ON_OTP_CHANGE,
    SHOW_MOBILE_NUMBER_SCREEN
} from '../lib/constants'

function mapStateToProps(state) {
    return {
        mobileOtpDisplayMessage: state.preloader.mobileOtpDisplayMessage,
        mobileNumber: state.preloader.mobileNumber,
        otpNumber: state.preloader.otpNumber
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...preloaderActions, setState }, dispatch)
    }
}

class MobileOtpScreen extends PureComponent {

    getOtp = () => {
        this.props.actions.generateOtp(this.props.mobileNumber)
    }
    onShowMobileNoScreen = () => {
        this.props.actions.setState(SHOW_MOBILE_NUMBER_SCREEN, SHOW_MOBILE_SCREEN)
    }
    onChangeMobileNo = (value) => {
        this.props.actions.setState(ON_MOBILE_NO_CHANGE, value)
    }

    onChangeOtp = (value) => {
        this.props.actions.setState(ON_OTP_CHANGE, value)
    }


    validateOtp = () => {
        this.props.actions.validateOtp(this.props.otpNumber)
    }

    renderMobileNoView() {
        const borderBottomColor = this.props.mobileOtpDisplayMessage ? styles.fontDanger.color : '#007AFF'
        return (
            <View style={[styles.bgWhite, styles.alignCenter, styles.justifyCenter, styles.marginBottom30]}>
                <View style={[styles.marginTop30, { width: 150 }]}>
                    <TextInput
                        placeholder={'0000000000'}
                        placeholderTextColor={'#E5E5E5'}
                        value={this.props.mobileNumber}
                        keyboardType={'numeric'}
                        editable={!(this.props.mobileOtpDisplayMessage === false)}
                        returnKeyType={'done'}
                        underlineColorAndroid='transparent'

                        onChangeText={this.onChangeMobileNo}
                        style={[styles.fontXxl, { borderBottomWidth: 1, borderBottomColor }]}
                    />
                </View>
                {this.mobileButtonView()}
            </View>
        )
    }
    mobileButtonView() {
        const checkForGetOtpButton = (_.size(this.props.mobileNumber) == 0 || (this.props.mobileOtpDisplayMessage === false))
        return (
            <View style = {[styles.alignCenter, styles.justifyCenter]}>
                {this.errorLoaderView()}
                <View>
                    <Button onPress={this.getOtp} full
                        style={[{ width: 150 }, styles.justifyCenter, styles.alignCenter, styles.marginTop5]}
                        disabled={checkForGetOtpButton}>
                        <Text style={[styles.fontWhite, styles.fontWeight500]}>{SEND_OTP}</Text>
                    </Button>
                </View>
            </View>
        )
    }
    showOtpContent() {
        return (
            <Content style={[styles.paddingTop0, styles.paddingLeft5]}>
                {this.showCloseButton()}
                <View style={[styles.bgWhite, styles.column, styles.justifyCenter, styles.alignCenter, styles.paddingTop30]}>
                    <View style={[styles.alignCenter, styles.column, styles.justifyCenter, { width: 240 }]}>
                        <Text style={[styles.fontWeight500, styles.fontLg, styles.fontBlack, styles.lineHeight25]}>{ENTER_OTP}</Text>
                        <Text style={[styles.fontDefault, styles.fontMediumGray, styles.marginTop10]}>{OTP_CODE_SENT}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.fontDefault, styles.fontWeight600, { color: '#909090' }]}>{_.trim(this.props.mobileNumber)}</Text>
                            <TouchableOpacity disabled={(this.props.mobileOtpDisplayMessage === false)} onPress={this.onShowMobileNoScreen}>
                                <Text style={[styles.fontDefault, styles.fontWeight500, { marginLeft: 8 }, styles.fontBlack]}>{EDIT}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.showOtpInputView()}
                </View>
            </Content>
        )
    }
    showOtpInputView() {
        const borderBottomColor = this.props.mobileOtpDisplayMessage ? styles.fontDanger.color : '#007AFF'
        return (
            <View style={[styles.bgWhite, styles.alignCenter, styles.justifyCenter, styles.marginBottom30]}>
                <View style={[styles.marginTop30, { width: 100 }]}>
                    <TextInput
                        placeholder='000000'
                        value={this.props.otpNumber}
                        placeholderTextColor={'#E5E5E5'}
                        keyboardType='numeric'
                        editable={!(this.props.mobileOtpDisplayMessage === false)}
                        returnKeyType='done'
                        underlineColorAndroid='transparent'
                        onChangeText={this.onChangeOtp}
                        style={[styles.fontXxl, { borderBottomWidth: 1, borderBottomColor }]}
                    />
                </View>
                {this.otpButtonView()}
            </View>
        )
    }
    otpButtonView() {
        let checkForProceed = _.size(this.props.otpNumber) == 0 || ((this.props.mobileOtpDisplayMessage === false))
        return (
            <View style = {[styles.alignCenter, styles.justifyCenter,]}>
                {this.errorLoaderView()}
                <View>
                    <Button onPress={this.validateOtp} full
                        style={[{ width: 100 }, styles.marginTop10]}
                        disabled={checkForProceed}>
                        <Text style={[styles.fontWhite, styles.fontWeight500, styles.fontRegular]}>{PROCEED}</Text>
                    </Button>
                </View>
                <Text style={[styles.marginTop20, styles.fontCenter, styles.fontDefault, styles.fontMediumGray]}>{DID_NOT_RECEIVE_OTP}</Text>
                <TouchableOpacity onPress={this.getOtp} disabled={(this.props.mobileOtpDisplayMessage === false)}>
                    <Text style={[styles.fontDefault, styles.marginLeft5, styles.fontBlack, styles.alignCenter, styles.justifyCenter, styles.fontWeight600]}>{RESEND_OTP_NO}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    errorLoaderView() {
        return (
            <View style={{ height: 40 }}>
                {!(this.props.mobileOtpDisplayMessage === false) ? <Text style={[styles.fontCenter, styles.fontDanger, styles.paddingTop10]}>
                    {this.props.mobileOtpDisplayMessage}
                </Text> :
                    <View style={[styles.justifyCenter, styles.alignCenter, styles.marginBottom20]}>
                        <Spinner color={'#007AFF'} size={'small'} />
                    </View>}
            </View>
        )
    }
    showCloseButton() {
        return (
            <View style={[{ left: 10, height: 60 }, Platform.OS === 'ios' ? styles.marginTop30 : styles.marginTop10]}>
                <TouchableOpacity style={[styles.padding10]} onPress={this.props.invalidateUserSession} disabled={(this.props.mobileOtpDisplayMessage === false)}>
                    <Icon
                        name="md-close"
                        style={[styles.fontXl]} />
                </TouchableOpacity>
            </View>
        )
    }

    showMobileContent() {
        return (
            <Content style={[styles.paddingTop0, styles.paddingLeft5]}>
                {this.showCloseButton()}
                <View style={[styles.bgWhite, styles.column, styles.justifyCenter, styles.alignCenter, styles.paddingTop30]}>
                    <View style={[styles.alignCenter, styles.column, styles.justifyCenter, { width: 280 }]}>
                        <Text style={[styles.fontWeight600, styles.fontLg, styles.fontBlack, styles.lineHeight25]}>{ENTER_MOBILE}</Text>
                        <Text style={[styles.marginTop10, styles.fontCenter, styles.fontDefault, styles.fontMediumGray]}>{ONE_TIME_PASSOWRD_WILL_BE_SENT_TO_MOBILE_NO}</Text>
                    </View>
                    {this.renderMobileNoView()}
                </View>
            </Content>
        )
    }

    render() {
        let showContent = this.props.isMobileScreen == SHOW_MOBILE_SCREEN ? this.showMobileContent() : this.showOtpContent()
        return (
            <StyleProvider style={getTheme(platform)}>
                {showContent}
            </StyleProvider>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileOtpScreen)