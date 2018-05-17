'use strict'
import React, { PureComponent } from 'react'
import {
    StyleSheet
}
    from 'react-native'
import CustomAlert from "../components/CustomAlert"
import feStyle from '../themes/FeStyle'
import { Container, Right } from 'native-base'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ServiceStatusIcon from "../components/ServiceStatusIcon"
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import renderIf from '../lib/renderIf'
import MobileNoScreen from './MobileNoScreen'
import InitialSetup from './InitialSetup'
import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
    return {
        showMobileOtpNumberScreen: state.preloader.showMobileOtpNumberScreen,
        errorMessage_403_400_Logout: state.preloader.errorMessage_403_400_Logout,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...preloaderActions, ...globalActions }, dispatch)
    }
}

class Preloader extends PureComponent {

    componentDidMount() {
        this.props.actions.saveSettingsAndValidateDevice(this.props.configDownloadService, this.props.configSaveService, this.props.deviceVerificationService)
    }

    startLoginScreenWithoutLogout = () => {
        this.props.actions.startLoginScreenWithoutLogout()
    }

    invalidateSession = () => {
        this.props.actions.invalidateUserSession()
    }

    render() {
        return (
            <Container>
                {(_.isEmpty(this.props.showMobileOtpNumberScreen) ? <InitialSetup /> : null)}
                {(!_.isEmpty(this.props.errorMessage_403_400_Logout) &&
                    <CustomAlert
                        title="Unauthorised Device"
                        message={this.props.errorMessage_403_400_Logout}
                        onCancelPressed={this.startLoginScreenWithoutLogout} />
                )}
                {(!_.isEmpty(this.props.showMobileOtpNumberScreen) ? <MobileNoScreen invalidateUserSession={this.invalidateSession} isMobileScreen={this.props.showMobileOtpNumberScreen} /> : null)}
            </Container>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#f7f7f7'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Preloader)
