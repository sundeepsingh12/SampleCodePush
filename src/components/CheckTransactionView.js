'use strict'

import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon, Content } from 'native-base';
import styles from '../themes/FeStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { NO_TRANSACTION_FOUND_UNABLE_TO_CONTACT_SERVER, CANCEL, CHECK_TRANSACTION_STATUS } from '../lib/ContainerConstants';
import { navigate } from '../modules/navigators/NavigationService';
import { BluetoothListing, Sorting } from '../lib/constants';

export default class CheckTransactionView extends PureComponent {

    render() {
        return (
            <Content >
                <View style={[styles.flex1, styles.column, styles.justifyCenter, styles.alignCenter]}>
                    <View style={[styles.justifyCenter, styles.alignCenter, { marginTop: 85 }]}>
                        <View style={[styles.borderRadius50, styles.justifyCenter, { borderColor: '#ff2d55', width: 100, height: 100, borderWidth: 2 }]}>
                            <MaterialIcons name='close' style={[styles.alignSelfCenter, styles.fontWhite, styles.padding5, { color: '#ff2d55', fontSize: 36 }]} onPress={() => { }}
                            />
                        </View>
                        <Text style={[{ fontSize: 18 }, styles.fontBlack, styles.marginTop15]}>{'Payment Failed'}</Text>
                        <Text style={[{ fontSize: 14 }, styles.marginTop15, styles.fontDarkGray, styles.fontCenter, { marginLeft: 62, marginRight: 70 }]}>{NO_TRANSACTION_FOUND_UNABLE_TO_CONTACT_SERVER}</Text>
                    </View>
                    <View>
                        <Button bordered style={[{ borderColor: '#EAEAEA', backgroundColor: '#F2F1FF', borderWidth: 1 }, { height: 50, width: 240 }, styles.alignCenter, styles.justifyCenter, { marginTop: 140 }]}
                            onPress={() => this.props.hitCheckTransactionApiForCheckingPayment()} >
                            <Text style={[{ color: '#000', lineHeight: 19 }, styles.fontWeight500, styles.fontLg]}>{CHECK_TRANSACTION_STATUS}</Text>
                        </Button>
                    </View>
                    <View>
                        <Text style={[{ fontSize: 16, color: '#727272' }, styles.marginTop25, styles.fontCenter]} onPress={() => this.props.onCancelAlert()}>{CANCEL}</Text>
                    </View>
                </View>
            </Content>
        )
    }
}