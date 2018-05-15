
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Body,
    Right,
    Icon,
    Form,
    Item,
    Input,
    Label,
    Footer,
    FooterTab,
    StyleProvider
} from 'native-base'

import styles from '../../themes/FeStyle'



export default class errorScreen extends PureComponent {

    resendOtpButtonView() {
        return (
            <TouchableOpacity onPress={() => this.props.onResendOtp()}> <Text style={[styles.fontWeight100, { color: styles.bgPrimaryColor }]}>Resend OTP</Text> </TouchableOpacity>
        )
    }
    render() {
        return (
             <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50]}>
                    <Image
                        style={[style.imageSync]}
                        source={require('../../../images/fareye-default-iconset/error.png')}
                    />
                    <Text style={[styles.fontBlack, styles.marginTop30]}>
                        {this.props.errorMessage}
                    </Text>
                </View>
                <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>

                    <View style={[styles.marginTop30, styles.alignCenter]}>
                        <Button bordered style={{ borderColor: styles.bgPrimaryColor }}
                            onPress={() => { this.props.goBack() }}  >
                            <Text style={{color : styles.fontPrimaryColor}}>{CLOSE}</Text>
                        </Button>
                    </View>
                </View>
            </View>
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
    imageSync: {
        width: 116,
        height: 116,
        resizeMode: 'contain'
    }
})


