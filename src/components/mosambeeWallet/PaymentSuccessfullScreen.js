
'use strict'

import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Content } from 'native-base'
import styles from '../../themes/FeStyle'
import { PAYMENT_SUCCESSFUL } from '../../lib/ContainerConstants'

export default class PaymentSuccessfullScreen extends PureComponent {
    render() {
        return (
            <Content>
                <View style={[styles.bgWhite, styles.padding30, styles.margin10, styles.alignCenter, styles.justifyCenter]}>
                    <Image
                        style={style.imageSync}
                        source={require('../../../images/fareye-default-iconset/syncscreen/All_Done.png')}
                    />
                    <Text style={[styles.fontLg, styles.fontBlack, styles.marginTop30]}>
                        {PAYMENT_SUCCESSFUL}
                    </Text>
                </View>
            </Content>
        )
    }
}
const style = StyleSheet.create({
    imageSync: {
        width: 116,
        height: 116,
        resizeMode: 'contain'
    }
})