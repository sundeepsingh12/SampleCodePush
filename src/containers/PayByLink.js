'use strict'

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Platform,
    TextInput,
    Modal,
} from 'react-native'

const {
    SET_UPI_APPROVAL,
    SET_UPI_PAYMENT_CUSTOMER_CONTACT,
    SET_UPI_PAYMENT_CUSTOMER_NAME,
    SET_UPI_PAYMENT_PAYER_VPA,
} = require('../lib/constants').default

import { Container, Content, Footer, FooterTab, Input, Button, Card, CardItem, Icon, Left, Right, List, ListItem, Radio, Body, CheckBox } from 'native-base';
import styles from '../themes/FeStyle'
import theme from '../themes/feTheme'
import PopOver from '../components/PopOver'
import * as payByLinkPaymentActions from '../modules/cardTypePaymentModules/payByLinkPayment/payByLinkPaymentActions'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

function mapStateToProps(state) {
    return {
        payByLinkConfigJSON: state.payByLinkPayment.payByLinkConfigJSON
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...payByLinkPaymentActions, ...globalActions }, dispatch)
    }
}

class PayByLink extends Component {

    componentWillMount() {
        this.props.actions.getPayByLinkPaymentParameters()
    }

    onTextChange(type, payload) {
        this.props.actions.setState(type, payload)
    }

    render() {
        console.log('PayByLink props', this.props)
        return (
            <Container>
                {/* <Modal animationType={"slide"}
                    transparent={false}
                    onRequestClose={() => { }}
                    visible={false}
                >
                    <View style={[styles.bgWhite, styles.flex1, styles.column, { paddingTop: 70 }]}>
                        <View style={[styles.alignCenter, styles.column]}>
                            <Text style={[styles.fontWeight500, styles.fontXxl, styles.fontBlack]}>
                                Payment Collection request initiated
                                Ask Customer to approve request
                            </Text>
                        </View>
                        <View style={[styles.row, styles.justifyCenter, styles.marginTop30]}>
                            <Button onPress={() => console.log()}
                                full rounded style={StyleSheet.flatten(styles.margin10)}
                            >
                                <Text style={[styles.fontWhite]}>Proceed</Text>
                            </Button>
                            <Button
                                onPress={() => this.props.actions.setState(
                                    SET_UPI_APPROVAL,
                                    {
                                        upiApproval: false
                                    }
                                )}
                                full rounded danger
                                style={StyleSheet.flatten(styles.margin10, styles.bgDanger)}>
                                <Text style={[styles.fontWhite]}>Cancel</Text>
                            </Button>
                        </View>
                    </View>
                </Modal> */}
                <Content style={StyleSheet.flatten([styles.padding10])}>
                    <View>
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
                        <ListItem
                            key={1}
                            icon style={StyleSheet.flatten([{ marginLeft: 0 }])}
                            onPress={() => { }}>
                            <Body>
                                <Text>{this.props.payByLinkConfigJSON ? this.props.payByLinkConfigJSON.cardCustomName && this.props.payByLinkConfigJSON.cardCustomName.trim() !== '' ? this.props.payByLinkConfigJSON.cardCustomName : 'Card Link' : 'Card Link'}</Text>
                            </Body>
                        </ListItem>
                        <ListItem
                            key={2}
                            icon style={StyleSheet.flatten([{ marginLeft: 0 }])}
                            onPress={() => { }}>
                            <Body>
                                <Text>{this.props.payByLinkConfigJSON ? this.props.payByLinkConfigJSON.netBankingCustomName && this.props.payByLinkConfigJSON.netBankingCustomName.trim() !== '' ? this.props.payByLinkConfigJSON.netBankingCustomName : 'Net Banking Link' : 'Net Banking Link'}</Text>
                            </Body>
                        </ListItem>
                        <ListItem
                            key={3}
                            icon style={StyleSheet.flatten([{ marginLeft: 0 }])}
                            onPress={() => { }}>
                            <Body>
                                <Text>{this.props.payByLinkConfigJSON ? this.props.payByLinkConfigJSON.upiCustomName && this.props.payByLinkConfigJSON.upiCustomName.trim() !== '' ? this.props.payByLinkConfigJSON.upiCustomName : 'UPI Link' : 'UPI Link'}</Text>
                            </Body>
                        </ListItem>
                    </View>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button success
                            disabled={this.props.isSaveButtonDisabled}
                            style={StyleSheet.flatten([{ borderRadius: 0 }])}
                            onPress={() => {
                                this.props.actions.approveTransactionAPIRequest(
                                    this.props.navigation.state.params.actualAmount,
                                    this.props.customerName,
                                    this.props.customerContact,
                                    this.props.payerVPA,
                                    null,
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

export default connect(mapStateToProps, mapDispatchToProps)(PayByLink)