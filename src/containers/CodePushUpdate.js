'use strict'

import React, { PureComponent } from 'react'
import { StyleSheet, Platform, View, Text, Modal, Image, TouchableOpacity } from 'react-native'
import styles from '../themes/FeStyle'
import { Container, Right, StyleProvider, Content, Button } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { DOWNLOAD_LATEST_APP_VERSION, NEW_VERSION_AVAILABLE, DOWNLOAD } from '../lib/ContainerConstants'

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
        actions: bindActionCreators({ ...preloaderActions, ...globalActions }, dispatch)
    }
}

class CodePushUpdate extends PureComponent {

    render() {
        console.log('this.props', this.props)
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                onRequestClose={() => null}>
                <StyleProvider style={getTheme(platform)}>
                    <View style={[styles.flex1, styles.justifySpaceBetween]}>
                        <View style={[styles.alignCenter, styles.justifyCenter, styles.flexBasis50, styles.marginTop30]}>
                            <Image
                                style={[styles.imageSync]}
                                source={require('../../images/fareye-default-iconset/appDownload/app-update.png')}
                            />
                            <Text style={[styles.fontBlack, styles.marginTop30, styles.fontLg, styles.bold]}>
                                {NEW_VERSION_AVAILABLE}
                            </Text>
                            <Text style={[styles.fontBlack, styles.marginTop15, styles.fontLg, styles.fontDarkGray, styles.fontCenter, { width: '60%' }]}>
                                {DOWNLOAD_LATEST_APP_VERSION}
                            </Text>
                        </View>
                        <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>
                            <View style={[styles.marginTop30, styles.alignCenter]}>
                                <TouchableOpacity style={[styles.bgWhite, styles.padding30]}
                                    onPress={this.props.downloadLatestApk}  >
                                    <Text style={[styles.fontPrimary, styles.bold, styles.fontLg]}>{DOWNLOAD}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </StyleProvider>
            </Modal>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(CodePushUpdate)