'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    Platform,
    View,
    Text,
    Modal
}from 'react-native'
    import styles from '../themes/FeStyle'
import { Container, Right,StyleProvider,Content } from 'native-base'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'

export default class DownloadProgressbar extends PureComponent {

    render(){
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                onRequestClose={() => null}>
                <StyleProvider style={getTheme(platform)}>
                    <View style={[styles.flex1, styles.justifySpaceBetween, styles.paddingHorizontal10]}>
                        <View style={[styles.justifyCenter, styles.flexBasis100, styles.padding10]}>
                            <View style={[styles.row, styles.justifySpaceBetween, styles.marginBottom10]}>
                                <Text style={[styles.fontBlack]}>
                                    Downloading...
                            </Text>
                                <Text style={[styles.fontDarkGray]}>
                                    {this.props.progressBarStatus}%
                            </Text>
                            </View>
                            <View style={{ width: '100%', borderRadius: 8, height: 10, backgroundColor: styles.bgGray.backgroundColor }}>
                                <View style={{ width: String(this.props.progressBarStatus + "%"), borderRadius: 8, height: 10, backgroundColor: styles.bgPrimary.backgroundColor }}>
                                </View>
                            </View>
                        </View>
                    </View>
                </StyleProvider>
            </Modal>
        )
    }

}