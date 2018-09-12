'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    BackHandler
} from 'react-native'
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
    RESET_STATE_FOR_MOSAMBEE
} from '../lib/constants'

import {
    TRANSACTION_PENDING,
    NO_TRANSACTION_FOUND_UNABLE_TO_CONTACT_SERVER
} from '../lib/ContainerConstants'
import { isEmpty } from 'lodash'
import CheckTransactionView from '../components/CheckTransactionView'

function mapStateToProps(state) {
    return {
        mosambeeLoader: state.mosambeePayment.mosambeeLoader,
        mosambeeParameters: state.mosambeePayment.mosambeeParameters,
        mosambeeMessage: state.mosambeePayment.mosambeeMessage
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...mosambeeActions, ...globalActions }, dispatch)
    }
}

class MosambeePayment extends PureComponent {

    componentDidMount() {
        const contactNumber = isEmpty(this.props.navigation.state.params.contactData) && this.props.navigation.state.params.contactData.length ? this.props.navigation.state.params.contactData[0] : ''
        this.props.actions.getParameterForMosambee(this.props.navigation.state.params, this.props.navigation.state.params.paymentAtEnd.currentElement.jobTransactionIdAmountMap, contactNumber)
        this.nativeEventListener = DeviceEventEmitter.addListener('showResult',
            (e) => {
                let data = JSON.parse(e.jsonObject)
                this.props.actions.saveTransactionAfterPayment(data, this.props.navigation.state.params)
                this.nativeEventListener.remove();
            })
        this.backHandler = DeviceEventEmitter.addListener('backHandler', (e) => { this.props.navigation.goBack(null) })
        this.checkTransactionStatus = DeviceEventEmitter.addListener('checkTransactionStatus',
            (e) => {
                this.props.actions.hitCheckTransactionApiForCheckingPaymentInMosambee(this.props.mosambeeParameters, this.props.navigation.state.params)
                this.checkTransactionStatus.remove();
            })
        this._didFocusSubscription = this.props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    componentWillUnmount() {
        this.props.actions.setState(RESET_STATE_FOR_MOSAMBEE)
        this.backHandler.remove()
        this.nativeEventListener.remove();
        this.checkTransactionStatus.remove();
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    onBackButtonPressAndroid = () => {
        return true
    }

    _headerModal() {
        return (
            <SafeAreaView style={{ backgroundColor: styles.bgPrimaryColor }}>
                <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                    <Body>
                        <View style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
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
    _onCancelAlert = () => {
        this.props.navigation.goBack(null)
    }

    render() {
        if (this.props.mosambeeLoader == true) return <Loader />
        else {
            return (
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        {this._headerModal()}
                        {this.props.mosambeeMessage ? <CheckTransactionView hitCheckTransactionApiForCheckingPayment={() => { this.props.actions.hitCheckTransactionApiForCheckingPaymentInMosambee(this.props.mosambeeParameters, this.props.navigation.state.params) }} 
                               onCancelAlert={() => { this._onCancelAlert() }} errorMessage = {this.props.mosambeeMessage == TRANSACTION_PENDING ? NO_TRANSACTION_FOUND_UNABLE_TO_CONTACT_SERVER : this.props.mosambeeMessage }/>
                            : this.props.mosambeeLoader == 'START_MOSAMBEE' ? <MosambeeNativeView mosambeeParameters={this.props.mosambeeParameters} /> : null}
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
        width: '100%',
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