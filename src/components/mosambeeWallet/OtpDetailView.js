
'use strict'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import {Content,Icon} from 'native-base'
import styles from '../../themes/FeStyle'
import { ENTER_OTP_SENT_TO_MOBILE_NO, CHANGE_MOBILE_NO, ENTER_OTP_SENT_TO_CUSTOMER, RESEND_OTP, RESEND, ENTER_OTP} from '../../lib/ContainerConstants'

export default class OtpGeneratedView extends PureComponent {

    render() {
        return (
            <Content style={[styles.flex1, styles.column, styles.paddingHorizontal10]}>
                <View style={[{ marginTop: 50 }]}>
                    <Text>{ENTER_OTP_SENT_TO_MOBILE_NO+this.props.contactNumber}</Text>
                    <TouchableOpacity style={[{ marginTop: 20, position: 'relative' }, styles.row]} onPress={() => this.props.showModalView(this.props.isModalShow)}>
                        <Icon name="md-create" style={[styles.fontLg, {color : styles.fontPrimaryColor}, styles.marginRight5]} />
                        <Text style={[{color : styles.fontPrimaryColor}, styles.fontSm, styles.fontWeight]} >{CHANGE_MOBILE_NO}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.bgWhite, { marginTop: 100 }]}>
                    <View style={{ marginTop: 50 }}>
                        <Text style={[{color : styles.fontPrimaryColor}, styles.fontSm]}>{ENTER_OTP_SENT_TO_CUSTOMER}</Text>
                    </View>
                    <TextInput
                        placeholder={ENTER_OTP}
                        value={this.props.otpNumber}
                        keyboardType='numeric'
                        editable={true}
                        returnKeyType='done'
                        onChangeText={this.props.onChangeOtpNo}
                        style={[styles.flexBasis75, styles.fontXl]}
                    />
                    <Text style={[styles.fontWeight100, styles.flex1, { right: 5, position: 'absolute', marginTop: 65, marginRight: 10 }, { color: styles.bgPrimaryColor }]} onPress={() => this.props.onResendOtp(RESEND)}>{RESEND_OTP}</Text>
                </View>
            </Content>
        )
    }
}

const style = StyleSheet.create({
    inputType: {
        height: 40,
        fontSize: 14
    }
})


