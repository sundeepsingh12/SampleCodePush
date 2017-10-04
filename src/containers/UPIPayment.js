'use strict'

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TextInput,
} from 'react-native'

const {
    SET_UPI_PAYMENT_CUSTOMER_CONTACT,
    SET_UPI_PAYMENT_CUSTOMER_NAME,
    SET_UPI_PAYMENT_PAYER_VPA,
} = require('../lib/constants').default

import { Container, Content, Footer, FooterTab, Input, Button, Card, CardItem, Icon, Left, Right, List, ListItem, Radio, Body, CheckBox } from 'native-base';
import styles from '../themes/FeStyle'
import theme from '../themes/feTheme'
import PopOver from '../components/PopOver'
import * as upiPaymentActions from '../modules/cardTypePaymentModules/upiPayment/upiPaymentActions'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

function mapStateToProps(state) {
    console.log(state)
    return {
        customerContact: state.upiPayment.customerContact,
        customerName: state.upiPayment.customerName,
        payerVPA: state.upiPayment.payerVPA,
        upiConfigJSON: state.upiPayment.upiConfigJSON,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...upiPaymentActions, ...globalActions }, dispatch)
    }
}

class UPIPayment extends Component {

    componentWillMount() {
        this.props.actions.getUPIPaymentParameters(this.props.navigation.state.params.jobMasterId, this.props.navigation.state.params.jobId)
    }

    onTextChange(type, payload) {
        this.props.actions.setState(type, payload)
    }

    render() {
        console.log('UPIPayment props', this.props)
        return (
            <Container>
                <Content style={StyleSheet.flatten([styles.padding10])}>
                    <View>
                        <Text> Customer Name </Text>
                        <View style={StyleSheet.flatten([styles.positionRelative, { zIndex: 1 }])} >
                            <Input
                                placeholder='Regular Textbox'
                                onChangeText={value => this.onTextChange(
                                    SET_UPI_PAYMENT_CUSTOMER_NAME,
                                    {
                                        customerName: value
                                    }
                                )}
                                style={StyleSheet.flatten([styles.marginTop10, styles.fontSm, { borderWidth: 1, paddingRight: 30, height: 30, borderColor: '#BDBDBD', borderRadius: 4 }])}
                                defaultValue={this.props.customerName}
                            />
                            {/* <Icon size={12} name='ios-information-circle-outline' style={StyleSheet.flatten([styles.positionAbsolute, styles.fontDanger, styles.fontLg, { right: 8, top: 17 }])} onPress={() => { alert('hello') }} />
                    <PopOver visible={this.checkValidation()} /> */}
                        </View>
                        <Text> Customer Contact </Text>
                        <View style={StyleSheet.flatten([styles.positionRelative, { zIndex: 1 }])} >
                            <Input
                                placeholder='Regular Textbox'
                                onChangeText={value => this.onTextChange(
                                    SET_UPI_PAYMENT_CUSTOMER_CONTACT,
                                    {
                                        customerContact: value
                                    }
                                )}
                                style={StyleSheet.flatten([styles.marginTop10, styles.fontSm, { borderWidth: 1, paddingRight: 30, height: 30, borderColor: '#BDBDBD', borderRadius: 4 }])}
                            />
                            {/* <Icon size={12} name='ios-information-circle-outline' style={StyleSheet.flatten([styles.positionAbsolute, styles.fontDanger, styles.fontLg, { right: 8, top: 17 }])} onPress={() => { alert('hello') }} />
                    <PopOver visible={this.checkValidation()} /> */}
                        </View>
                        <Text> Payer VPA </Text>
                        <View style={StyleSheet.flatten([styles.positionRelative, { zIndex: 1 }])} >
                            <Input
                                placeholder='Regular Textbox'
                                onChangeText={value => this.onTextChange(
                                    SET_UPI_PAYMENT_PAYER_VPA,
                                    {
                                        payerVPA: value
                                    }
                                )}
                                style={StyleSheet.flatten([styles.marginTop10, styles.fontSm, { borderWidth: 1, paddingRight: 30, height: 30, borderColor: '#BDBDBD', borderRadius: 4 }])}
                            />
                            {/* <Icon size={12} name='ios-information-circle-outline' style={StyleSheet.flatten([styles.positionAbsolute, styles.fontDanger, styles.fontLg, { right: 8, top: 17 }])} onPress={() => { alert('hello') }} />
                    <PopOver visible={this.checkValidation()} /> */}
                        </View>
                    </View>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button success
                            disabled={this.props.isSaveButtonDisabled}
                            style={StyleSheet.flatten([{ borderRadius: 0 }])}
                            onPress={() => {
                                this.props.actions.approveTransactionAPIRequest(
                                    this.props.customerName,
                                    this.props.customerContact,
                                    this.props.payerVPA,
                                    this.props.upiConfigJSON
                                )
                            }}
                        >
                            <Text>Proceed</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UPIPayment)