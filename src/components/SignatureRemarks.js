'use strict'
import React, { PureComponent } from 'react'
import {
    FlatList,
    View,
    Text
} from 'react-native'
import {
    StyleProvider
} from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
class SignatureRemarks extends PureComponent {

    renderData = (item) => {
        return (
            <View style={{borderBottomColor: '#f3f3f3', borderBottomWidth: 1}}>
                <Text style={[styles.fontPrimary]}>{item.label}</Text>
                <Text style={[styles.fontDefault, styles.fontBlack]}>{item.value}</Text>
            </View>
        )
    }

    render() {
        return (
            <StyleProvider>
                <View style={[styles.padding10]}>
                    <FlatList
                        data={this.props.fieldDataList}
                        renderItem={({ item }) => this.renderData(item)}
                        keyExtractor={item => item.fieldAttributeMasterId}
                    />
                </View>
            </StyleProvider>
        )
    }
}

export default SignatureRemarks
