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

class Preloader extends PureComponent {

    componentDidMount() {
        this.props.saveSettingsAndValidateDevice(this.props.configDownloadService, this.props.configSaveService, this.props.deviceVerificationService)
    }
 
    startLoginScreenWithoutLogout = () => {
        this.props.startLoginScreenWithoutLogout()
    }

      invalidateSession = () => {
        this.props.invalidateUserSession()
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
                        onCancelPressed = {this.startLoginScreenWithoutLogout} />

                )}                    
                {renderIf(this.props.showMobileNumberScreen,
                    <MobileNoScreen invalidateUserSession = {this.invalidateSession} />
                  )}

                {renderIf(this.props.showOtpScreen,
                    <OtpScreen invalidateUserSession = {this.invalidateSession}/>
                )}
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

export default connect(mapStateToProps, preloaderActions)(Preloader)
