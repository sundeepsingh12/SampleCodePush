'use strict'
import React, { Component } from 'react'
import {
    StyleSheet 
}
    from 'react-native'
import CustomAlert from "../components/CustomAlert"
import feStyle from '../themes/FeStyle'
import { Container, Right } from 'native-base';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ServiceStatusIcon from "../components/ServiceStatusIcon"
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import renderIf from '../lib/renderIf';
import OtpScreen from './OtpScreen'
import MobileNoScreen from './MobileNoScreen'
import InitialSetup from './InitialSetup'

function mapStateToProps(state) {
    return {
        showMobileNumberScreen: state.preloader.showMobileNumberScreen,
        errorMessage_403_400_Logout:state.preloader.errorMessage_403_400_Logout,
        isErrorType_403_400_Logout:state.preloader.isErrorType_403_400_Logout,
        showOtpScreen:state.preloader.showOtpScreen
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...preloaderActions }, dispatch)
    }
}

class Preloader extends Component {

    componentDidMount() {
        this.props.actions.saveSettingsAndValidateDevice(this.props.configDownloadService, this.props.configSaveService, this.props.deviceVerificationService)
    }
 
    startLoginScreenWithoutLogout() {
        this.props.actions.startLoginScreenWithoutLogout()
    }

    render() {
        return (
            <Container>
                {renderIf(!this.props.showMobileNumberScreen,
                    <InitialSetup />
                    )}
                {renderIf(this.props.isErrorType_403_400_Logout, 
                    <CustomAlert
                        title = "Unauthorised Device" 
                        message = {this.props.errorMessage_403_400_Logout} 
                        onCancelPressed = {this.startLoginScreenWithoutLogout.bind(this)} />

                )}                    
                {renderIf(this.props.showMobileNumberScreen,
                    <MobileNoScreen />
                  )}

                {renderIf(this.props.showOtpScreen,
                    <OtpScreen />
                )}
            </Container>
        )
    }
};

var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#f7f7f7'
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(Preloader)
