'use strict'
import React, { PureComponent } from 'react'
import { StyleSheet, Platform, View, Image, Text, WebView } from 'react-native'
import CustomAlert from "../components/CustomAlert"
import styles from '../themes/FeStyle'
import { Container, Button } from 'native-base'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ServiceStatusIcon from "../components/ServiceStatusIcon"
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import renderIf from '../lib/renderIf'
import MobileOtpScreen from './MobileOtpScreen'
import InitialSetup from './InitialSetup'
import * as globalActions from '../modules/global/globalActions'
import RNFS from 'react-native-fs'
import ApkInstaller from 'react-native-apk-installer'
import getTheme from '../../native-base-theme/components'
import DownloadProgressBar from '../components/DownloadProgressBar'
import ErrorScreen from '../components/ErrorScreen'
import * as appDownloadActions from '../modules/appDownload/appDownloadActions'
import AppOutdated from '../components/AppOutdated'
import { LATEST_APK_PATH } from '../lib/AttributeConstants'
import CodePushUpdate from './CodePushUpdate'
import Loader from '../components/Loader'
import { DOWNLOADING_LATEST_VERSION, HANG_ON, PLEASE_WAIT_FOR_IOS_LINK_URL } from '../lib/ContainerConstants'

function mapStateToProps(state) {
    return {
        showMobileOtpNumberScreen: state.preloader.showMobileOtpNumberScreen,
        errorMessage_403_400_Logout: state.preloader.errorMessage_403_400_Logout,
        downloadLatestAppMessage: state.preloader.downloadLatestAppMessage,
        downloadUrl: state.preloader.downloadUrl,
        isAppUpdatedThroughCodePush: state.preloader.isAppUpdatedThroughCodePush,
        iosDownloadScreen: state.preloader.iosDownloadScreen
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
        this.props.actions.saveSettingsAndValidateDevice(this.props.configDownloadService, this.props.configSaveService, this.props.deviceVerificationService, this.props.showMobileOtpNumberScreen)
    }

    startLoginScreenWithoutLogout = () => {
        this.props.actions.startLoginScreenWithoutLogout()
    }

    invalidateSession = () => {
        this.setState({errorInDownload:false})
        this.props.actions.invalidateUserSession(true)
    }

    //Downloading Latest App programatically in Android 
    //Code written in container and not action/service  because local state is changing
    downloadLatestApplicationForAndroid() {
        try {
            //Path where new Apk will be downloaded
            const filePath = RNFS.CachesDirectoryPath + LATEST_APK_PATH
            const download = RNFS.downloadFile({
                fromUrl: this.props.downloadUrl,
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
                    this.props.actions.resetApp()
                    ApkInstaller.install(filePath)
                } else {
                    this.setState({ errorInDownload: true, showDownloadProgressBar: false })
                }
            })
        }
        catch (error) {
            this.setState({ errorInDownload: true, showDownloadProgressBar: false })
        }
    }

    downloadLatestApk = () => {
        if (Platform.OS === 'ios') {
            this.props.actions.getIOSDownloadUrl()
        } else {
            this.setState({ showDownloadProgressBar: true })
            this.downloadLatestApplicationForAndroid()
        }
    }

    renderIOSAppLinkView() {
        return (
            <View style={[styles.alignCenter, styles.justifyCenter, { marginTop: 120 }]}>
                <Loader />
                <Text style={[styles.fontBlack, styles.fontLg, styles.fontCenter, styles.marginTop30, { width: '60%' }]}>
                    {HANG_ON}
                </Text>
                <Text style={[styles.fontDarkGray, styles.fontLg, styles.fontCenter, styles.marginTop30, { width: '60%' }]}>
                    {PLEASE_WAIT_FOR_IOS_LINK_URL}
                </Text>
            </View>
        )
    }

    render() {
        if (this.props.iosDownloadScreen == 'Loading') {
            return (
                <View style={[styles.flex1, styles.justifySpaceBetween]}>
                    {this.renderIOSAppLinkView()}
                </View>
            )
        } else if (this.props.iosDownloadScreen == 'Failed') {
            return <ErrorScreen downloadLatestApk={this.downloadLatestApk} invalidateUserSession={this.invalidateSession} />
        } else if (this.props.iosDownloadScreen == 'Webview') {
            return (
                <WebView
                    style={styles.WebViewStyle}
                    source={{ uri: this.props.downloadUrl }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true} />
            )
        } else {
            return (
                <Container>
                    {(_.isEmpty(this.props.showMobileOtpNumberScreen) ? <InitialSetup showMobileOtpNumberScreen = {this.props.showMobileOtpNumberScreen}  /> : null)}
                    {(!_.isEmpty(this.props.errorMessage_403_400_Logout) &&
                        <CustomAlert
                            title="Unauthorised Device"
                            message={this.props.errorMessage_403_400_Logout}
                            onCancelPressed={this.startLoginScreenWithoutLogout} />
                    )}
                    {(!_.isEmpty(this.props.showMobileOtpNumberScreen) ? <MobileOtpScreen invalidateUserSession={this.invalidateSession} isMobileScreen={this.props.showMobileOtpNumberScreen} /> : null)}
                    
                    {renderIf(this.props.downloadLatestAppMessage,
                        <AppOutdated downloadLatestApk={this.downloadLatestApk} />
                    )}

                    {renderIf(this.state.showDownloadProgressBar,
                        <DownloadProgressBar progressBarStatus={this.state.progressBarStatus} downloadUrl={this.props.downloadUrl} iosDownloadScreen={this.props.iosDownloadScreen} />
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Preloader)
