import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, Modal } from 'react-native'
import { Content, Button, Input, StyleProvider, Item } from 'native-base';
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import { ENTER_MOBILE, CLOSE, SEND_OTP } from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        mobileDisplayMessage: state.preloader.mobileDisplayMessage,
        isGenerateOtpButtonDisabled: state.preloader.isGenerateOtpButtonDisabled,
        isMobileScreenLogoutDisabled: state.preloader.isMobileScreenLogoutDisabled,
        mobileNumber: state.preloader.mobileNumber
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...preloaderActions }, dispatch)
    }
}

class MobileNoScreen extends PureComponent {

    getOtp = () => {
        this.props.actions.generateOtp(this.props.mobileNumber)
    }

    onChangeMobileNo = (value) => {
        this.props.actions.onChangeMobileNumber(value)
    }

    renderMobileNoView() {
        return (
            <View style={[styles.marginTop30]}>
                <Item rounded>
                    <Input
                        placeholder='Mobile Number'
                        value={this.props.mobileNumber}
                        keyboardType='numeric'
                        returnKeyType='done'
                        onChangeText={this.onChangeMobileNo}
                        style={[styles.fontSm, styles.paddingLeft15, styles.paddingRight15, { height: 40 }]}
                    />
                </Item>
            </View>
        )
    }

    renderOtpButton() {
        return (
            <View style={[styles.marginBottom10]}>
                <Button onPress={this.getOtp} full rounded
                    disabled={this.props.isGenerateOtpButtonDisabled}>
                    <Text style={[styles.fontWhite]}>{SEND_OTP}</Text>
                </Button>
            </View>
        )
    }

    renderCloseButton() {
        return (
            <View>
                <Button onPress={this.props.invalidateUserSession} full rounded danger
                    disabled={this.props.isMobileScreenLogoutDisabled}
                    style={[styles.bgDanger]}>
                    <Text style={[styles.fontWhite]}>{CLOSE}</Text>
                </Button>
            </View>
        )
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                onRequestClose={() => null}>
                <StyleProvider style={getTheme(platform)}>
                    <Content style={[styles.marginLeft30, styles.marginRight30]}>
                        <View style={[styles.bgWhite, styles.flex1, styles.column, { paddingTop: 70 }]}>
                            <View style={[styles.alignCenter, styles.column]}>
                                <Text style={[styles.fontWeight500, styles.fontXxl, styles.fontBlack]}>{ENTER_MOBILE}</Text>
                            </View>
                            {this.renderMobileNoView()}
                            <Text style={[styles.fontCenter, styles.marginTop15, styles.marginBottom15, styles.lineHeight25]}>
                                {this.props.mobileDisplayMessage}
                            </Text>
                            <View style={[styles.justifyCenter]}>
                                {this.renderOtpButton()}
                                {this.renderCloseButton()}

                            </View>

                        </View>
                    </Content>
                </StyleProvider>
            </Modal>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileNoScreen)