'use strict'

import React, { PureComponent } from 'react'
import {
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity
} from 'react-native'

import styles from '../themes/FeStyle'
import { StyleProvider} from 'native-base'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import { UPDATE_FAILED, NO_INTERNET_CONNECTIVITY } from '../lib/ContainerConstants'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class UpdateDataModal extends PureComponent {
    render() {
        return (
            <Modal animationType={"fade"}
                transparent={true}
                visible={this.props.data == 'UPDATING_JOBDATA'}
                onRequestClose={() => null}
                presentationStyle={"overFullScreen"}>
                <View style={[styles.relative, styles.alignCenter, styles.justifyCenter, { height: '100%' }]}>
                    <View style={[styles.absolute, { height: '100%', left: 0, right: 0, backgroundColor: 'rgba(52,52,52,.8)' }]}>
                    </View>
                    <View style={[styles.bgWhite, styles.shadow, styles.borderRadius3, { width: '90%' }, styles.padding5]}>
                        <View style={[styles.row, styles.padding10, styles.marginBottom10, styles.marginTop10, styles.alignCenter, styles.justifyCenter]}>
                        <MaterialIcons
                        name={'sync'}
                        style={[styles.fontXl, styles.fontBlack]}
                    />
                            <Text style={[styles.fontCenter,styles.marginLeft5, styles.fontBlack, styles.fontLg]}>{'Updating Details…'}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

}