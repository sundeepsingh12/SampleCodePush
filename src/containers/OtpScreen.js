'use strict';
import React, { Component } from 'react'
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
import feStyle from '../themes/FeStyle';

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

class OtpScreen extends Component {

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
                                <Text style={[feStyle.fontWeight500, feStyle.fontXxl, feStyle.fontBlack]}>Verify your mobile</Text>
                                <Text style={[feStyle.fontSm, feStyle.fontDarkGray, feStyle.marginTop10]}>OTP code has
                                    been sent to</Text>
                                <Text style={[feStyle.fontXl, feStyle.fontPrimary, feStyle.marginTop10]}>{this.props.mobileNumber}</Text>
                            </View>
                            <View style={[styles.marginTop30]}>
                                <Item rounded>
                                    <Input
                                        placeholder='OTP'
                                        value={this.props.otpNumber}
                                        keyboardType='numeric'
                                        maxLength={6}
                                        onChangeText={this.onChangeOtp}
                                        style={[styles.fontSm, styles.paddingLeft15, styles.paddingRight15, { height: 40 }]}
                                    />
                                </Item>
                            </View>

                            <Text style={{ textAlign: 'center', color: '#333333', marginBottom: 10 }}>
                                {this.props.otpDisplayMessage}
                            </Text>
                            {/* <View style={[feStyle.row, feStyle.justifyCenter, feStyle.marginTop15]}>
                                    <Button onPress={this.validateOtp} full rounded
                                        style={StyleSheet.flatten(feStyle.margin10)}
                                        disabled={this.props.isOtpVerificationButtonDisabled}>
                                        <Text style={[feStyle.fontWhite]}>Verify</Text>

                                    </Button>
                                    <Button onPress={this.props.invalidateUserSession} full rounded danger
                                        disabled={this.props.isOtpScreenLogoutDisabled}
                                        style={StyleSheet.flatten(feStyle.margin10)}>
                                        <Text style={[feStyle.fontWhite]}>Close</Text>

                                    </Button>
                                </View> */}

                            <View style={[styles.justifyCenter]}>
                                <View style={[styles.marginBottom10]}>
                                    <Button onPress={this.validateOtp} full rounded
                                        disabled={this.props.isOtpVerificationButtonDisabled}>
                                        <Text style={[styles.fontWhite]}>Verify</Text>
                                    </Button>
                                </View>
                                <View>
                                    <Button onPress={this.props.invalidateUserSession} full rounded danger
                                        disabled={this.props.isOtpScreenLogoutDisabled}
                                        style={[styles.bgDanger]}>
                                        <Text style={[styles.fontWhite]}>Close</Text>
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