'use strict'
import React, { PureComponent } from 'react'
import {
    StyleSheet,
    Platform,
}
    from 'react-native'
import CustomAlert from "../components/CustomAlert"
import styles from '../themes/FeStyle'
import { Container} from 'native-base'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ServiceStatusIcon from "../components/ServiceStatusIcon"
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import renderIf from '../lib/renderIf'
import OtpScreen from './OtpScreen'
import MobileNoScreen from './MobileNoScreen'
import InitialSetup from './InitialSetup'
import {
    ERROR_400_403_LOGOUT_FAILURE,
  } from '../lib/constants'
import * as globalActions from '../modules/global/globalActions'
import RNFS from 'react-native-fs'
import ApkInstaller from 'react-native-apk-installer'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import DownloadProgressBar from '../components/DownloadProgressBar'
  
function mapStateToProps(state) {
    return {
        showMobileNumberScreen: state.preloader.showMobileNumberScreen,
        errorMessage_403_400_Logout:state.preloader.errorMessage_403_400_Logout,
        isErrorType_403_400_Logout:state.preloader.isErrorType_403_400_Logout,
        showOtpScreen:state.preloader.showOtpScreen,
        downloadLatestAppMessage:state.preloader.downloadLatestAppMessage,
        downloadUrl:state.preloader.downloadUrl
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...preloaderActions, ...globalActions }, dispatch)
    }
}

class Preloader extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            progressBarStatus: 0,
            showDownloadProgressBar:false
        }
    }

    componentDidMount() {
        this.props.actions.saveSettingsAndValidateDevice(this.props.configDownloadService, this.props.configSaveService, this.props.deviceVerificationService)
    }
 
    startLoginScreenWithoutLogout = () => {
        this.props.actions.startLoginScreenWithoutLogout()
    }

      invalidateSession = () => {
        this.props.actions.invalidateUserSession()
    }

    downloadLatestApp = () => {
        if (Platform.OS === 'ios') {
            this.props.actions.startLoginScreenWithoutLogout()
        } else {
            this.setState({
                showDownloadProgressBar: true
            });
            this.props.actions.resetApp()
            this.downloadLatestApplicationForAndroid()
        }
    }

    //Downloading Latest App programatically in Android 
    //Code written in container and not action/service  because local state is changing
    downloadLatestApplicationForAndroid() {
        try {
            const filePath = RNFS.CachesDirectoryPath + '/fareye_latest1.apk'
            const download = RNFS.downloadFile({
                fromUrl:this.props.downloadUrl,
                // fromUrl: 'https://staging.fareye.co/img/clear_session_and_download_apk/428/biker_gama/14f6d848-72e8-4f1f-a10a-61dba1b8fb2a',
                toFile: filePath,
                progress: res => {
                    this.setState({
                        progressBarStatus: 100 * ((res.bytesWritten / res.contentLength).toFixed(2))
                    });
                },
                progressDivider: 1
            });
            download.promise.then(result => {
                if (result.statusCode == 200) {
                    ApkInstaller.install(filePath);
                }else{
                    this.setState({
                        progressBarStatus: 0,
                        showDownloadProgressBar:false
                    });
                }
            });
        }
        catch (error) {
            this.setState({
                progressBarStatus: 0,
                showDownloadProgressBar:false
            });
        }
    }

    render() {
        return (
            <Container>
                {renderIf(!this.props.showMobileNumberScreen,
                    <InitialSetup />
                )}
                {(this.props.isErrorType_403_400_Logout &&
                    <CustomAlert
                        title="Unauthorised Device"
                        message={this.props.errorMessage_403_400_Logout.message}
                        onOkPressed={this.startLoginScreenWithoutLogout} />
                )}                   
                {renderIf(this.props.showMobileNumberScreen,
                    <MobileNoScreen invalidateUserSession = {this.invalidateSession} />
                  )}

                {renderIf(this.props.showOtpScreen,
                    <OtpScreen invalidateUserSession = {this.invalidateSession}/>
                )}
                {renderIf(this.props.downloadLatestAppMessage, 
                    <CustomAlert
                    title="Outdated App"
                    message={this.props.downloadLatestAppMessage}
                    onOkPressed={this.downloadLatestApp} />
                )}

                {renderIf(this.state.showDownloadProgressBar,
                    <DownloadProgressBar progressBarStatus = {this.state.progressBarStatus} />
                )}
                   
            </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preloader)
