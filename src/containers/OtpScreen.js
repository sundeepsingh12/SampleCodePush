'use strict';
import React, { PureComponent } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Modal
} from 'react-native'
import { Content, Button, Input, StyleProvider, Item } from 'native-base';
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import feStyle from '../themes/FeStyle'
import {
    VERIFY_MOBILE,
    OTP_CODE_SENT,
    CLOSE,
    VERIFY
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        otpNumber: state.preloader.otpNumber,
        isOtpScreenLogoutDisabled: state.preloader.isOtpScreenLogoutDisabled,
        isOtpVerificationButtonDisabled: state.preloader.isOtpVerificationButtonDisabled,
        mobileNumber: state.preloader.mobileNumber,
        otpDisplayMessage: state.preloader.otpDisplayMessage
    }
};


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...preloaderActions }, dispatch)
    }
}

class OtpScreen extends PureComponent{

    onChangeOtp = (value) => {
        this.props.actions.onChangeOtp(value)
    }


    validateOtp = () => {
        this.props.actions.validateOtp(this.props.otpNumber)
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                onRequestClose={() => null}
            >
                <StyleProvider style={getTheme(platform)}>
                    <Content style={[styles.marginLeft30, styles.marginRight30]}>
                        <View style={[feStyle.bgWhite, feStyle.flex1, feStyle.column, { paddingTop: 70 }]}>
                            <View style={[feStyle.alignCenter, feStyle.column]}>
                                <Text style={[feStyle.fontWeight500, feStyle.fontXxl, feStyle.fontBlack]}>{VERIFY_MOBILE}</Text>
                                <Text style={[feStyle.fontSm, feStyle.fontDarkGray, feStyle.marginTop10]}>{OTP_CODE_SENT}</Text>
                                <Text style={[feStyle.fontXl, feStyle.fontPrimary, feStyle.marginTop10]}>{this.props.mobileNumber}</Text>
                            </View>
                            <View style={[styles.marginTop30]}>
                                <Item rounded>
                                    <Input
                                        placeholder='OTP'
                                        value={this.props.otpNumber}
                                        keyboardType='numeric'
                                        returnKeyType='done'
                                        maxLength={6}
                                        onChangeText={this.onChangeOtp}
                                        style={[styles.fontSm, styles.paddingLeft15, styles.paddingRight15, { height: 40 }]}
                                    />
                                </Item>
                            </View>

                            <Text style={{ textAlign: 'center', color: '#333333', marginBottom: 10 }}>
                                {this.props.otpDisplayMessage}
                            </Text>
                            <View style={[styles.justifyCenter]}>
                                <View style={[styles.marginBottom10]}>
                                    <Button onPress={this.validateOtp} full rounded
                                        disabled={this.props.isOtpVerificationButtonDisabled}>
                                        <Text style={[styles.fontWhite]}>{VERIFY}</Text>
                                    </Button>
                                </View>
                                <View>
                                    <Button onPress={this.props.invalidateUserSession} full rounded danger
                                        disabled={this.props.isOtpScreenLogoutDisabled}
                                        style={[styles.bgDanger]}>
                                        <Text style={[styles.fontWhite]}>{CLOSE}</Text>
                                    </Button>
                                </View>
                            </View>

                        </View>
                    </Content>
                </StyleProvider>
            </Modal>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OtpScreen)