'use strict'

import React, { PureComponent } from 'react'
import {
    View,
    Text,
    Modal,
    Image
} from 'react-native'
import styles from '../themes/FeStyle'

import {
    Button
} from 'native-base';
import { DRAFT_RESTORE_MESSAGE, OK, CANCEL } from '../lib/ContainerConstants'
export default class TransactionAlert extends PureComponent {

    render() {
        return (
            <Modal animationType={"fade"}
                transparent={true}
                onRequestClose={this.props.onRequestClose}
                presentationStyle={"overFullScreen"}>
                <View style={[styles.relative, styles.alignCenter, styles.justifyCenter, { height: '100%' }]}>
                    <View style={[styles.absolute, { height: '100%', left: 0, right: 0, backgroundColor: 'rgba(52,52,52,.8)' }]}>
                    </View>
                    <View style={[styles.bgWhite, styles.shadow, styles.borderRadius3, { width: '90%' }, styles.padding5]}>
                        <View>
                            <View style={[styles.padding5]}>
                                <Text style={[styles.alignCenter, styles.justifyCenter, styles.fontCenter, styles.fontWeight500, styles.fontXl]}>Transaction Alert </Text>
                            </View>
                            <View style={[styles.row, { borderTopColor: '#d3d3d3', borderTopWidth: 1 }, styles.padding5]} />
                            <View style={[styles.alignCenter, styles.justifyCenter]}>
                                <Image
                                    style={[{ width: 80, height: 80, resizeMode: 'contain' }]}
                                    source={require('../../images/fareye-default-iconset/checkTransactionError.png')}
                                />
                            </View>
                        </View>
                        <View style={[styles.padding10, styles.marginBottom10, styles.marginTop10]}>
                            <Text style={[styles.fontCenter, styles.marginBottom10, styles.fontBlack, styles.fontLg]}>{this.props.checkTransactionAlert}</Text>
                        </View>
                        <View style={[styles.row, { borderTopColor: '#d3d3d3', borderTopWidth: 1 }]}>
                            <View style={{ width: '50%' }}>
                                <Button transparent full
                                    onPress={() => this.props.onOkPress()} >
                                    <Text style={[{ color: styles.fontPrimaryColor }, styles.fontDefault]}>{'Check Transaction'}</Text>
                                </Button>
                            </View>
                            <View style={{ width: '50%', borderLeftColor: '#d3d3d3', borderLeftWidth: 1 }}>
                                <Button transparent full
                                    onPress={() => this.props.onCancelPress()}>
                                    <Text style={[{ color: styles.fontPrimaryColor }, styles.fontDefault]}>{CANCEL}</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
