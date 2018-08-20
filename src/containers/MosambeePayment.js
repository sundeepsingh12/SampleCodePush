'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native'

import {
    SET_UPI_PAYMENT_CUSTOMER_CONTACT,
} from '../lib/constants'

import { Container, Content, Footer, FooterTab, Input, Button, StyleProvider, Header, Body, Icon } from 'native-base'
import styles from '../themes/FeStyle'
import * as mosambeeActions from '../modules/cardTypePaymentModules/mosambeePayment/mosambeeAction'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loader from '../components/Loader';
import { SafeAreaView } from 'react-navigation'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform'
import MosambeeNativeView from '../components/MosambeeNativeView'
import {
    SET_LOADER_FOR_MOSAMBEE
} from '../lib/constants'
import {isEmpty} from 'lodash'

function mapStateToProps(state) {
    return {
        mosambeeLoader: state.mosambeePayment.mosambeeLoader,
        mosambeeParameters: state.mosambeePayment.mosambeeParameters,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...mosambeeActions, ...globalActions }, dispatch)
    }
}

class MosambeePayment extends PureComponent {

    componentDidMount() {
        const contactNumber  = isEmpty(this.props.navigation.state.params.contactData) && this.props.navigation.state.params.contactData.length ? this.props.navigation.state.params.contactData[0] : ''
        this.props.actions.getParameterForMosambee(this.props.navigation.state.params.jobTransaction, this.props.navigation.state.params.paymentAtEnd.currentElement.jobTransactionIdAmountMap, contactNumber)
        this.nativeEventListener = DeviceEventEmitter.addListener('showResult',
            (e) => {
                let data = JSON.parse(e.jsonObject)
                this.props.actions.saveTransactionAfterPayment(data, this.props.navigation.state.params)
                this.nativeEventListener.remove();
            })
        this.backHandler = DeviceEventEmitter.addListener('backHandler', (e) => {this.props.navigation.goBack(null)} )
    }

    componentWillUnmount() {
        this.props.actions.setState(SET_LOADER_FOR_MOSAMBEE, false)
        this.backHandler.remove()
        this.nativeEventListener.remove();
    }

    _headerModal() {
        return (
            <SafeAreaView style={{ backgroundColor: styles.bgPrimaryColor }}>
                <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                    <Body>
                        <View
                            style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                            <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                            </TouchableOpacity>
                            <View style={[style.headerBody]}>
                                <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter, styles.fontWeight500]}>Mosambee</Text>
                            </View>
                            <View style={[style.headerRight]}>
                            </View>
                            <View />
                        </View>
                    </Body>
                </Header>
            </SafeAreaView>
        )
    }

    render() {
        if (this.props.mosambeeLoader == true) return <Loader />
        else {
            return (
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        {this._headerModal()}
                        {this.props.mosambeeLoader == 'startMosambee' ? <MosambeeNativeView mosambeeParameters={this.props.mosambeeParameters} /> : null}
                    </Container>
                </StyleProvider>
            )
        }
    }
}
const style = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0,
        elevation: 0
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
})
export default connect(mapStateToProps, mapDispatchToProps)(MosambeePayment)