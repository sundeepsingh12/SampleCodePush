'use strict'

import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { Button, Icon } from 'native-base';
import styles from '../themes/FeStyle';
import { NO_DEVICE_CONNECTED, FIND_DEVICES } from '../lib/AttributeConstants';
import { navigate } from '../modules/navigators/NavigationService';
import { BluetoothListing, Sorting } from '../lib/constants';

class BluetoothSorting extends PureComponent {

    render() {
        return (
            <View style={[styles.flex1, styles.column, styles.alignCenter, { paddingTop: 130 }]}>
                <View style={[styles.justifyCenter, styles.alignCenter, { width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: "#727272" }]}>
                    <Icon name="ios-bluetooth-outline" style={[{ color: '#727272' }, styles.fontXl]} />
                </View>
                <View style={[styles.alignCenter, styles.column, styles.justifyCenter, styles.paddingTop10, { width: 280 }]}>
                    <Text style={[styles.fontCenter, styles.bold, styles.padding10]}>{NO_DEVICE_CONNECTED}</Text>
                </View>
                <View style={[{ marginTop: 'auto', marginBottom: 200 }]}>
                    <Button onPress={() => { navigate(BluetoothListing, { screenName: Sorting }) }} full style={[{ width: 150, backgroundColor: styles.bgPrimaryColor }, styles.justifyCenter, styles.alignCenter, styles.marginTop5]}>
                        <Text style={[styles.fontWhite]}>{FIND_DEVICES}</Text>
                    </Button>
                </View>
            </View>
        )
    }
}

export default BluetoothSorting