'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'

import {
    SET_UPI_PAYMENT_CUSTOMER_CONTACT,
} from '../lib/constants'

import { Container, Content, Footer, FooterTab, Input, Button} from 'native-base'
import styles from '../themes/FeStyle'
import * as payByLinkPaymentActions from '../modules/cardTypePaymentModules/payByLinkPayment/payByLinkPaymentActions'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

function mapStateToProps(state) {
    return {
        customerContact: state.payByLinkPayment.customerContact,
        payByLinkConfigJSON: state.payByLinkPayment.payByLinkConfigJSON
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...payByLinkPaymentActions, ...globalActions }, dispatch)
    }
}

class PayByLink extends PureComponent {

    componentWillMount() {
        this.props.actions.getPayByLinkPaymentParameters(this.props.navigation.state.params.contactData)
    }

    onTextChange(type, payload) {
        this.props.actions.setState(type, payload)
    }

    render() {
        return (
            <Container>
                <Content style={[styles.padding10]}>
                    <View>
                        <Text> Customer Contact </Text>
                        <View style={[styles.positionRelative, { zIndex: 1 }]} >
                            <Input
                                defaultValue={this.props.customerContact}
                                placeholder='Regular Textbox'
                                onChangeText={value => this.onTextChange(
                                    SET_UPI_PAYMENT_CUSTOMER_CONTACT,
                                    {
                                        customerContact: value
                                    }
                                )}
                                style={[styles.marginTop10, styles.fontSm, { borderWidth: 1, paddingRight: 30, height: 30, borderColor: '#BDBDBD', borderRadius: 4 }]}
                            />
                        </View>
                    </View>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button success
                            disabled={this.props.isSaveButtonDisabled}
                            style={[{ borderRadius: 0 }]}
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