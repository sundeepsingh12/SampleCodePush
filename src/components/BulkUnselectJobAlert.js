'use strict'
import React, { PureComponent } from 'react'
import {
    View,
    Text,
    Modal,
} from 'react-native'
import styles from '../themes/FeStyle'

import { Button, CheckBox } from 'native-base'
import { DRAFT_RESTORE_MESSAGE, OK, CANCEL } from '../lib/ContainerConstants'

export default class BulkUnselectJobAlert extends PureComponent {

    _returnModalView() {
        return (
            <View style={[styles.bgWhite, styles.shadow, styles.borderRadius3, { width: '85%' }, styles.padding5]}>
                <View>
                    <View style={[styles.padding5]}>
                        <Text style={[styles.alignCenter, styles.justifyCenter, styles.fontCenter, styles.fontWeight500, styles.fontXl]}>Un-Select Item</Text>
                    </View>
                    <View style={[styles.row, { borderTopColor: '#d3d3d3', borderTopWidth: 1 }]} />
                </View>
                <View>
                    <Text style={[styles.fontCenter, styles.marginBottom5, styles.fontBlack, styles.fontLg]}>{'Are you sure you want to un-select ' + this.props.wantUnselectJob.referenceNumber + ' item'}</Text>
                    <View style={[styles.row, styles.marginLeft25, styles.marginTop10]}>
                        <CheckBox checked={this.props.checked}
                            onPress={() => this.props.checkItem()} />
                        <Text style={{ marginLeft: 5 }} onPress={this.props.checkItem}>{'Do not show again'}</Text>
                    </View>
                </View>
                <View style={[styles.row, { borderTopColor: '#d3d3d3', borderTopWidth: 1 }, styles.marginTop10]}>
                    <View style={{ width: '50%' }}>
                        <Button transparent full
                            onPress={() => this.props.onOkPress()} >
                            <Text style={[{ color: styles.fontPrimaryColor }, styles.fontDefault]}>{OK}</Text>
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
        )
    }
    render() {
        return (
            <Modal animationType={"fade"}
                transparent={true}
                visible={this.props.wantUnselectJob}
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
