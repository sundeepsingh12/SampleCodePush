'use strict'
import React, { PureComponent } from 'react'
import { StyleSheet, Platform, View, Image, Text, } from 'react-native'
import CustomAlert from "../components/CustomAlert"
import styles from '../themes/FeStyle'
import { Container, Button } from 'native-base'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ServiceStatusIcon from "../components/ServiceStatusIcon"
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import renderIf from '../lib/renderIf'
import OtpScreen from './OtpScreen'
import MobileNoScreen from './MobileNoScreen'
import InitialSetup from './InitialSetup'
import { ERROR_400_403_LOGOUT_FAILURE } from '../lib/constants'
import * as globalActions from '../modules/global/globalActions'
import RNFS from 'react-native-fs'
import ApkInstaller from 'react-native-apk-installer'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import DownloadProgressBar from '../components/DownloadProgressBar'
import ErrorScreen from '../components/ErrorScreen'
import * as appDownloadActions from '../modules/appDownload/appDownloadActions'
import AppOutdated from '../components/AppOutdated'
import { LATEST_APK_PATH } from '../lib/AttributeConstants'
import CodePushUpdate from './CodePushUpdate'

function mapStateToProps(state) {
    return {
        showMobileNumberScreen: state.preloader.showMobileNumberScreen,
        errorMessage_403_400_Logout: state.preloader.errorMessage_403_400_Logout,
        isErrorType_403_400_Logout: state.preloader.isErrorType_403_400_Logout,
        showOtpScreen: state.preloader.showOtpScreen,
        downloadLatestAppMessage: state.preloader.downloadLatestAppMessage,
        androidDownloadUrl: state.preloader.androidDownloadUrl,
        isAppUpdatedThroughCodePush: state.preloader.isAppUpdatedThroughCodePush,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...preloaderActions, ...globalActions, ...appDownloadActions }, dispatch)
    }
}

class Preloader extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            progressBarStatus: 0,
            showDownloadProgressBar: false,
            errorInDownload: false,
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

    //Downloading Latest App programatically in Android 
    //Code written in container and not action/service  because local state is changing
    downloadLatestApplicationForAndroid() {
        try {
            //Path where new Apk will be downloaded
            const filePath = RNFS.CachesDirectoryPath + LATEST_APK_PATH
            const download = RNFS.downloadFile({
                fromUrl: this.props.androidDownloadUrl,
                toFile: filePath,
                progress: res => {
                    this.setState({
                        progressBarStatus: 100 * ((res.bytesWritten / res.contentLength).toFixed(2))
                    })
                },
                progressDivider: 1
            });
            download.promise.then(result => {
                if (result.statusCode == 200) {
                    ApkInstaller.install(filePath)
                } else {
                    this.setState({ error: true, showDownloadProgressBar: false })
                }
            })
        }
        catch (error) {
            this.setState({ error: true, showDownloadProgressBar: false })
        }
    }

    downloadLatestApk = () => {
        // this.props.actions.resetApp()
        this.setState({ showDownloadProgressBar: true })
        //In ios open Web View
        if (Platform.OS === 'ios') {
            this.props.actions.getIOSDownloadUrl()
        } else {
            this.downloadLatestApplicationForAndroid()
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
                    <MobileNoScreen invalidateUserSession={this.invalidateSession} />
                )}

                {renderIf(this.props.showOtpScreen,
                    <OtpScreen invalidateUserSession={this.invalidateSession} />
                )}
                {renderIf(this.props.downloadLatestAppMessage,
                    <AppOutdated downloadLatestApk={this.downloadLatestApk} />
                )}

                {renderIf(this.state.showDownloadProgressBar,
                    <DownloadProgressBar progressBarStatus={this.state.progressBarStatus} />
                )}

                {renderIf(this.state.errorInDownload,
                    <ErrorScreen downloadLatestApk={this.downloadLatestApk} invalidateUserSession={this.invalidateSession} />
                )}
                {renderIf(this.props.isAppUpdatedThroughCodePush,
                    <CodePushUpdate />
                )}

            </Container>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preloader)
