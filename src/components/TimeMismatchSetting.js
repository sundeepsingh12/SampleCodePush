'use strict'

import React, { PureComponent } from 'react'
import {
    View,
    Text,
    Image,
    Platform,
    Linking,
    StyleSheet,
    TouchableOpacity,

} from 'react-native'

import styles from '../themes/FeStyle'
import { Content, Button, Container, Icon, Spinner } from 'native-base'
import {
    TIME_MISMATCH_ERROR,
    GO_TO_SETTINGS,
    TIME_MISMATCH,
    TIMEMISMATCH,
    RETRY
} from '../lib/ContainerConstants'
let openDateTimeSettings = require('../wrapper/OpenSettings');



export default class TimeMismatchSetting extends PureComponent {
    goToSettings() {
        if (Platform.OS == 'android') {
            openDateTimeSettings.dateTimeSettings();
        } else {
            Linking.canOpenURL("App-Prefs:root=General&path=DATE_AND_TIME").then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ');
                } else {
                    return Linking.openURL("App-Prefs:root=General&path=DATE_AND_TIME");
                }
            }).catch(err => console.log('An error occurred', err));
            // Linking.openURL("App-Prefs:root=General&path=DATE_AND_TIME");
        }
    }
    _renderButtons() {
        return (
            <View>
                <View >
                    <Button bordered style={[{ borderColor: '#EAEAEA', backgroundColor: '#007AFF', borderWidth: 1 }, { height: 45, width: 155 }, styles.alignCenter, styles.justifyCenter, { marginTop: 55 }]}
                        onPress={() => { this.goToSettings() }} >
                        <Text style={[{ color: '#FFFFFF', lineHeight: 19 }, styles.fontWeight600, styles.fontRegular]}> {GO_TO_SETTINGS} </Text>
                    </Button>
                </View>
                <View style={[styles.justifyCenter, styles.alignCenter]}>
                    <Text style={[{ color: '#007AFF', lineHeight: 19, height: 19 }, styles.fontWeight500, styles.fontLg, { marginTop: 36 }]}
                        onPress={() => this.props.retry()} >
                        {RETRY}
                    </Text>
                </View>
            </View>
        )
    }
    _renderView() {
        return (
            <View style={[styles.justifyCenter, styles.alignCenter, { marginTop: 40 }]}>
                <View>
                    <Image
                        style={[style.imageSync]}
                        source={require('../../images/fareye-default-iconset/TimeMismatchIcon.png')}
                    />
                </View>
                <View style={[{ marginTop: 54 }]}>
                    <Text style={[{ color: '#000000', lineHeight: 19 }, styles.fontWeight500, styles.fontRegular]}> {TIME_MISMATCH} </Text>
                </View>
                <View style={[styles.alignCenter, { paddingLeft: 35, paddingRight: 35, paddingTop: 10 }]}>
                    <Text style={[{ color: '#737373', lineHeight: 19 }, styles.fontRegular, { textAlign: 'center' }]}> {TIME_MISMATCH_ERROR} </Text>
                </View>
                <View style={{ height: 60 }}>
                    {this.props.error == 'mismatchLoading' ? <Spinner color={'#007AFF'} size={'large'} /> : null}
                </View>
                {this._renderButtons()}
            </View>
        )
    }
    render() {
        return (
                <Container>
                    <Content>
                        <TouchableOpacity style={[styles.paddingVertical10, styles.paddingHorizontal15]}>
                            <Icon
                                name="md-close"
                                style={[styles.fontXxxl, styles.fontBlack]}
                                onPress={() => {
                                    this.props.invalidateSession(TIMEMISMATCH)
                                }} />
                        </TouchableOpacity>
                        {this._renderView()}
                    </Content>
                </Container>
        )
    }
}
const style = StyleSheet.create({
    imageSync: {
        width: 107,
        height: 107,
        resizeMode: 'contain'
    }
})