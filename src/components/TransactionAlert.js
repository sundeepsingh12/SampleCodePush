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
export default class TransactionAlert extends PureComponent {

    _returnModalView() {
        return (
            <View style={[styles.bgWhite, styles.shadow, styles.borderRadius3, { width: '70%' }, styles.padding5]}>
                <View>
                    <View style={[styles.padding5]}>
                        <Text style={[styles.alignCenter, styles.justifyCenter, styles.fontCenter, styles.fontWeight500, styles.fontXl]}>Transaction Alert</Text>
                    </View>
                    <View style={[styles.row, { borderTopColor: '#d3d3d3', borderTopWidth: 1 }, styles.padding5]} />
                    <View style={[styles.alignCenter, styles.justifyCenter]}>
                        <Image style={[{ width: 80, height: 80, resizeMode: 'contain' }]}
                            source={require('../../images/fareye-default-iconset/checkTransactionError.png')} />
                    </View>
                </View>
                <View style={[styles.padding10, styles.marginTop10]}>
                    <Text style={[styles.fontCenter, styles.marginBottom5, styles.fontBlack, styles.fontLg]}>{this.props.checkTransactionAlert}</Text>
                </View>
                <View style={[{ borderTopColor: '#d3d3d3', borderTopWidth: 1, backgroundColor: '#007AFF' }]}>
                    <Button transparent full onPress={() => this.props.onOkPress()}
                        onLongPress={() => this.props.onCancelPress()}  >
                        <Text style={[styles.fontWhite, styles.fontWeight500, styles.fontRegular]}>{'Check Transaction'}</Text>
                    </Button>
                </View>
            </View>
        )
    }

    render() {
        return (
            <Modal animationType={"fade"}
                transparent={true}
                onRequestClose={this.props.onRequestClose}
                presentationStyle={"overFullScreen"}>
                <View style={[styles.relative, styles.alignCenter, styles.justifyCenter, { height: '100%' }]}>
                    <View style={[styles.absolute, { height: '100%', left: 0, right: 0, backgroundColor: 'rgba(52,52,52,.8)' }]}>
                    </View>
                    {this._returnModalView()}
                </View>
            </Modal>
        )
    }
}
