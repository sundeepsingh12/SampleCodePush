'use strict'

import React, { PureComponent } from 'react'
import {
    StyleSheet,
    Platform,
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity
} from 'react-native'

import styles from '../themes/FeStyle'
import { Container, Right, StyleProvider, Content, Button } from 'native-base'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import { UPDATE_FAILED, NO_INTERNET_CONNECTIVITY } from '../lib/ContainerConstants'

export default class ErrorScreen extends PureComponent {

    render() {
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
                                source={require('../../images/fareye-default-iconset/error.png')}
                            />
                            <Text style={[styles.fontBlack, styles.marginTop30, styles.fontLg, styles.bold]}>
                                {UPDATE_FAILED}
                            </Text>
                            <Text style={[styles.fontBlack, styles.marginTop15, styles.fontLg, styles.fontDarkGray, styles.fontCenter, { width: '60%' }]}>
                                {NO_INTERNET_CONNECTIVITY}
                            </Text>
                        </View>
                        <View style={[styles.flexBasis40, styles.alignCenter, styles.justifyCenter]}>
                            <View style={[styles.marginTop30, styles.alignCenter]}>
                                <TouchableOpacity style={[styles.bgWhite, styles.padding30]}
                                    onPress={this.props.downloadLatestApk}  >
                                    <Text style={[styles.fontPrimary, styles.bold, styles.fontLg]}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.marginTop30, styles.alignCenter]}>
                                <TouchableOpacity style={[styles.bgWhite, styles.padding30]}
                                    onPress={this.props.invalidateUserSession}  >
                                    <Text style={[styles.fontPrimary, styles.bold, styles.fontLg]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </StyleProvider>
            </Modal>
        )
    }

}