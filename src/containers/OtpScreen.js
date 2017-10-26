'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal
} from 'react-native';
import { Button, Input } from 'native-base';
import feStyle from '../themes/FeStyle'
import feTheme from '../themes/feTheme'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'

function mapStateToProps(state) {
  return {
    otpNumber:state.preloader.otpNumber,
    isOtpScreenLogoutDisabled:state.preloader.isOtpScreenLogoutDisabled,
    isOtpVerificationButtonDisabled:state.preloader.isOtpVerificationButtonDisabled,
    mobileNumber:state.preloader.mobileNumber,
    otpDisplayMessage:state.preloader.otpDisplayMessage
  }
};

/*
 * Bind all the actions
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({  ...preloaderActions }, dispatch)
  }
}

class OtpScreen extends Component{

     onChangeOtp(otpNumber) {
        this.props.actions.onChangeOtp(otpNumber)
    }


    validateOtp(otpNumber) {
        this.props.actions.validateOtp(otpNumber)
    }

      invalidateSession() {
        this.props.actions.invalidateUserSession()
    }

    render(){
        return (
                 <Modal
                        animationType={"slide"}
                        transparent={false}
                        onRequestClose={() => null}
                    >
                        <View style={[feStyle.bgWhite, feStyle.flex1, feStyle.column, { paddingTop: 70 }]}>
                            <View style={[feStyle.alignCenter, feStyle.column]}>
                                <Text style={[feStyle.fontWeight500, feStyle.fontXxl, feStyle.fontBlack]}>Verify your mobile</Text>
                                <Text style={[feStyle.fontSm, feStyle.fontDarkGray, feStyle.marginTop10]}>OTP code has
                                   been sent to</Text>
                                <Text style={[feStyle.fontXl, feStyle.fontPrimary, feStyle.marginTop10]}>{this.props.mobileNumber}</Text>
                            </View>
                            <View style={[feStyle.alignCenter, feStyle.justifyCenter, feStyle.row, feStyle.margin30]}>
                                <View style={[feStyle.flexBasis70, { height: 50 }]}>
                                    <Input
                                        placeholder='OTP'
                                        style={StyleSheet.flatten([feStyle.fontCenter, feTheme.roundedInput])}
                                        value={this.props.otpNumber}
                                        keyboardType='numeric'
                                        maxLength={6}
                                        onChangeText={value => this.onChangeOtp(value)}
                                    />
                                </View>
                            </View>
                            <Text style={{ textAlign: 'center', color: '#333333', marginBottom: 10 }}>
                                {this.props.otpDisplayMessage}
                            </Text>
                            <View style={[feStyle.row, feStyle.justifyCenter, feStyle.marginTop15]}>
                                <Button onPress={() => this.validateOtp(this.props.otpNumber)} full rounded
                                    style={StyleSheet.flatten(feStyle.margin10)}
                                    disabled={this.props.isOtpVerificationButtonDisabled}>
                                    <Text style={[feStyle.fontWhite]}>Verify</Text>

                                </Button>
                                <Button onPress={() => this.invalidateSession()} full rounded danger
                                    disabled={this.props.isOtpScreenLogoutDisabled}
                                    style={StyleSheet.flatten(feStyle.margin10)}>
                                    <Text style={[feStyle.fontWhite]}>Close</Text>

                                </Button>
                            </View>

                        </View>
                    </Modal>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OtpScreen)