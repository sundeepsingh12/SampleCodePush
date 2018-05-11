'use strict'

import React, { PureComponent } from 'react'
import { StyleSheet, Platform, View, Text, Modal, Image, WebView } from 'react-native'
import styles from '../themes/FeStyle'
import { Container, Right, StyleProvider, Content } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import { DOWNLOADING_LATEST_VERSION } from '../lib/ContainerConstants'
export default class DownloadProgressbar extends PureComponent {

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                onRequestClose={() => null}>
                <StyleProvider style={getTheme(platform)}>
                    {(Platform.OS == 'android') ? this.renderProgressBarForAndroid() : this.openWebView()}
                </StyleProvider>
            </Modal>

        )
    }


    renderProgressBarForAndroid() {
        return (
            <View style={[styles.flex1, styles.justifySpaceBetween]}>
                <View style={[styles.alignCenter, styles.justifyCenter, { marginTop: 120 }]}>
                    <Image
                        style={[styles.imageSync]}
                        source={require('../../images/fareye-default-iconset/appDownload/lightning.png')}
                    />
                    <Text style={[styles.fontBlack, styles.fontLg, styles.fontCenter, styles.marginTop30, { width: '60%' }]}>
                        {DOWNLOADING_LATEST_VERSION}
                    </Text>
                    <View style={[{ width: '80%', marginTop: 70 }]}>
                        <View style={{ width: '100%', borderRadius: 8, height: 10, backgroundColor: styles.bgGray.backgroundColor }}>
                            <View style={{ width: String(this.props.progressBarStatus + "%"), borderRadius: 8, height: 10, backgroundColor: styles.bgPrimary.backgroundColor }}></View>
                        </View>
                        <Text style={[styles.fontBlack, styles.fontCenter, styles.marginTop15, styles.fontLg]}>
                            {this.props.progressBarStatus}%
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    openWebView() {
        return (
            <WebView
                style={styles.WebViewStyle}
                source={{ uri: 'https://Google.com' }}
                javaScriptEnabled={true}
                domStorageEnabled={true} />
        )
    }

}