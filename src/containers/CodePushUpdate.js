'use strict'

import React, { PureComponent } from 'react'
import { StyleSheet, Platform, View, Text, Modal, Image, TouchableOpacity } from 'react-native'
import styles from '../themes/FeStyle'
import { Container, Right, StyleProvider, Content, Button } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
    return {
        codePushUpdateStatus: state.preloader.codePushUpdateStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions }, dispatch)
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
                                {this.props.codePushUpdateStatus}
                            </Text>
                        </View>
                    </View>
                </StyleProvider>
            </Modal>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(CodePushUpdate)