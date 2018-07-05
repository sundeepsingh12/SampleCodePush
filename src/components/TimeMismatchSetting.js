'use strict'

import React, { PureComponent } from 'react'
import {
    View,
    Text,
    Modal,
    Image,
    Platform,
    Linking,
    StyleSheet,
    TouchableOpacity,

} from 'react-native'

import styles from '../themes/FeStyle'
import { StyleProvider, Content, Button, Container, Header, Icon, Left, Spinner } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import DeviceSettings from 'react-native-device-settings';
import {
    TIME_MISMATCH_ERROR,
    GO_TO_SETTINGS,
    TIME_MISMATCH
} from '../lib/ContainerConstants'
import Loader from '../components/Loader'



export default class TimeMismatchSetting extends PureComponent {
    goToSettings() {
        if (Platform.OS == 'android') {
            DeviceSettings.open("ACTION_DATE_SETTINGS)");
        } else {
            Linking.canOpenURL("App-Prefs:root=General&path=DATE_AND_TIME").then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL("App-Prefs:root=General&path=DATE_AND_TIME");
                }
            }).catch(err => console.log('An error occurred', err));
            // Linking.openURL("App-Prefs:root=General&path=DATE_AND_TIME");
        }
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
            <Container>
                    <Content>
                    <TouchableOpacity style={[styles.paddingVertical10, styles.paddingHorizontal15]}>
                                    <Icon
                                        name="md-close"
                                        style={[styles.fontXxxl, styles.fontBlack]}
                                        onPress={() => {
                                            this.props.invalidateSession('Time_Mismatch')
                                        }} />
                            </TouchableOpacity>
                    <View style = {[styles.justifySpaceBetween, styles.alignCenter]}>
                                                      
                     <View>
                                <Image
                                    style={[style.imageSync]}
                                    source={require('../../images/fareye-default-iconset/TimeMismatchIcon.png')}
                                />
                            </View>
                            <View style={[ {marginTop: 54}]}>
                            <Text style={[{ color: '#000000', lineHeight: 19 }, styles.fontWeight500, styles.fontRegular]}> {TIME_MISMATCH} </Text>
                            </View>
                            <View style={[ styles.alignCenter, {paddingLeft: 25, paddingRight: 25, paddingTop: 10}]}>
                            <Text style={[{ color: 	'#737373', lineHeight: 19 }, styles.fontRegular, {textAlign: 'center'}]}> {TIME_MISMATCH_ERROR} </Text>
                            </View>
                            <View style={{ height: 60 }}>
                            {this.props.error == 'mismatchLoading' ?  <Spinner color={'#007AFF'} size={'large'} /> : null}
                            </View>
                            <View >
                                <Button bordered style={[{ borderColor: '#EAEAEA', backgroundColor: '#007AFF', borderWidth: 1 }, { height: 45, width: 155 }, styles.alignCenter, styles.justifyCenter,{ marginTop: 85 }]}
                                    onPress={() => { this.goToSettings() }} >
                                    <Text style={[{ color: '#FFFFFF', lineHeight: 19 }, styles.fontWeight600, styles.fontRegular]}> {GO_TO_SETTINGS} </Text>
                                </Button>
                            </View>
                            <View >
                                <Text style={[{ color: '#007AFF', lineHeight: 19, height: 19, width: 53 }, styles.fontWeight500, styles.fontLg, { marginTop: 36 }]}
                                    onPress={() => this.props.retry()} >
                                    Retry
                            </Text>
                            </View>
                            </View>
                    </Content>
                      </Container>
            </StyleProvider>
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