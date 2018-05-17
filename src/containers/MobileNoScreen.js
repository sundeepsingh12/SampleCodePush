import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity
} from 'react-native'
import Loader from '../components/Loader'
import { Content, Button, StyleProvider, Item, Icon, Spinner } from 'native-base';
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import {
    ENTER_MOBILE,
    CLOSE,
    SEND_OTP,
    ENTER_OTP,
    OTP_CODE_SENT,
    PROCEED,
    EDIT,
    RESEND,
    DID_NOT_RECEIVE_OTP,
    ONE_TIME_PASSOWRD_WILL_BE_SENT_TO_MOBILE_NO,
    SHOW_MOBILE_SCREEN,
    SHOW_OTP
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        mobileOtpDisplayMessage: state.preloader.mobileOtpDisplayMessage,
        mobileNumber: state.preloader.mobileNumber,
        otpNumber: state.preloader.otpNumber,
        isLoggingOut: state.home.isLoggingOut,
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...preloaderActions }, dispatch)
    }
}

class MobileNoScreen extends PureComponent {
    componentDidMount() {
        if (this.props.isMobileScreen == SHOW_OTP && !this.props.mobileNumber) this.onShowMobileNoScreen()
    }

    getOtp = () => {
        this.props.actions.generateOtp(this.props.mobileNumber)
    }
    onShowMobileNoScreen = () => {
        this.props.actions.showMobileNumber()
    }
    onChangeMobileNo = (value) => {
        this.props.actions.onChangeMobileNumber(value)
    }

    onChangeOtp = (value) => {
        this.props.actions.onChangeOtp(value)
    }


    validateOtp = () => {
        this.props.actions.validateOtp(this.props.otpNumber)
    }

    renderMobileNoView() {
        return (
            <View style={[styles.bgWhite, styles.alignCenter, styles.justifyCenter, styles.marginBottom30]}>
                <View style={[styles.marginTop30, { width: 150 }]}>
                    <TextInput
                        placeholder={'0000000000'}
                        value={this.props.mobileNumber}
                        keyboardType={'numeric'}
                        editable={true}
                        returnKeyType={'done'}
                        onChangeText={this.onChangeMobileNo}
                        style={[styles.fontXxl]}
                    />
                </View>
                <View style={{ height: 40 }}>
                    {!(this.props.mobileOtpDisplayMessage === false) ? <Text style={[styles.fontCenter, styles.fontDanger]}>
                        {this.props.mobileOtpDisplayMessage}
                    </Text> :
                        <View style={[styles.justifyCenter, styles.alignCenter, styles.marginBottom5]}>
                            <Spinner color={styles.bgBlack.backgroundColor} size={'small'} />
                        </View>}
                </View>
                <View>
                    <Button onPress={this.getOtp} full
                        style={[{ width: 150 }, styles.marginLeft5, styles.justifyCenter, styles.alignCenter, styles.marginTop5]}
                        disabled={_.size(this.props.mobileNumber) == 0}>
                        <Text style={[styles.fontWhite]}>{SEND_OTP}</Text>
                    </Button>
                </View>
            </View>
        )
    }

    showOtpContent() {
        return (
            <Content style={[styles.paddingTop0]}>
                {this.showCloseButton()}
                <View style={[styles.bgWhite, styles.column, styles.justifyCenter, styles.alignCenter, styles.paddingTop30]}>
                    <View style={[styles.alignCenter, styles.column, styles.justifyCenter, { width: 240 }]}>
                        <Text style={[styles.fontWeight500, styles.fontXxl, styles.fontBlack]}>{ENTER_OTP}</Text>
                        <Text style={[styles.fontDefault, styles.fontDarkGray, styles.marginTop10]}>{OTP_CODE_SENT}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.fontDefault, styles.fontDarkGray]}>{this.props.mobileNumber}</Text>
                            <TouchableOpacity onPress={this.onShowMobileNoScreen}>
                                <Text style={[styles.fontDefault, styles.marginLeft5, styles.fontBlack]}>{EDIT}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.showOtpInputView()}
                </View>
            </Content>
        )
    }
    showOtpInputView() {
        return (
            <View style={[styles.bgWhite, styles.alignCenter, styles.justifyCenter, styles.marginBottom30]}>
                <View style={[styles.marginTop30, { width: 100 }]}>
                    <TextInput
                        placeholder='000000'
                        value={this.props.otpNumber}
                        keyboardType='numeric'
                        editable={true}
                        returnKeyType='done'
                        onChangeText={this.onChangeOtp}
                        style={[styles.fontXxl]}
                    />
                </View>
                <View style={{ height: 40 }}>
                    {!(this.props.mobileOtpDisplayMessage === false) ? <Text style={[styles.fontDanger]}>
                        {this.props.mobileOtpDisplayMessage}
                    </Text> :
                        <View style={[styles.justifyCenter, styles.alignCenter, styles.marginBottom20]}>
                            <Spinner color={styles.bgBlack.backgroundColor} size={'small'} />
                        </View>}
                </View>
                <View>
                    <Button onPress={this.validateOtp} full
                        style={[{ width: 100 }, styles.marginLeft5, styles.marginTop10]}
                        disabled={_.size(this.props.otpNumber) == 0}>
                        <Text style={[styles.fontWhite]}>{PROCEED}</Text>
                    </Button>
                </View>
                <Text style={[styles.marginTop20, styles.fontCenter, styles.fontDefault, styles.fontDarkGray]}>{DID_NOT_RECEIVE_OTP}</Text>
                <TouchableOpacity onPress={this.getOtp}>
                    <Text style={[styles.fontDefault, styles.marginLeft5, styles.fontBlack, styles.alignCenter, styles.justifyCenter]}>{RESEND}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    showCloseButton() {
        return (
            <View style={[{ top: 10, left: 0, height: 60, }]}>
                <Button transparent disabled={this.props.isLoggingOut}>
                    <Icon
                        name="md-close"
                        style={[styles.fontXxxl, styles.fontBlack]}
                        onPress={this.props.invalidateUserSession} />
                </Button>
            </View>
        )
    }

    showMobileContent() {
        return (
            <Content style={[styles.paddingTop0, styles.paddingLeft5]}>
                {this.showCloseButton()}
                <View style={[styles.bgWhite, styles.column, styles.justifyCenter, styles.alignCenter, styles.paddingTop30]}>
                    <View style={[styles.alignCenter, styles.column, styles.justifyCenter, { width: 280 }]}>
                        <Text style={[styles.bold, styles.fontXxl, styles.fontBlack]}>{ENTER_MOBILE}</Text>
                        <Text style={[styles.marginTop10, styles.fontCenter, styles.fontDefault, styles.fontDarkGray]}>{ONE_TIME_PASSOWRD_WILL_BE_SENT_TO_MOBILE_NO}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(MobileNoScreen)