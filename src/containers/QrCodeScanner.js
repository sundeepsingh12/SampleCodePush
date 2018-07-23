'use strict';
import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation'
import { Container, Header,Body, Icon,StyleProvider } from 'native-base';
import { RNCamera } from 'react-native-camera'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as globalActions from '../modules/global/globalActions'
import { SCANNING } from '../lib/constants'
import styles from '../themes/FeStyle'
import platform from '../../native-base-theme/variables/platform'
import getTheme from '../../native-base-theme/components'


function mapStateToProps(state) {
    return {
        scanning: state.qrCodeReducer.scanning
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...globalActions }, dispatch)
    }
}

class QrCodeScanner extends PureComponent {

    componentDidMount() {
        this.props.actions.setState(SCANNING, true)
    }

    _handleQrCodeRead(e) {
        this.props.actions.setState(SCANNING, false)
        this.props.navigation.goBack(null)
        if (this.props.navigation.state.params.calledFromArray) {
            this.props.navigation.state.params.returnData(e.data, this.props.navigation.state.params.currentElement)
        } else {
            this.props.navigation.state.params.returnData(e.data)
        }
    }

    render() {
        if (this.props.scanning) {
            return (
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        <SafeAreaView style={{ backgroundColor: styles.bgPrimaryColor }}>
                            <Header searchBar style={StyleSheet.flatten([{ backgroundColor: styles.bgPrimaryColor }, style.header])}>
                                <Body>
                                    <View
                                        style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                                        <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                                            <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                                        </TouchableOpacity>
                                        <View style={[style.headerBody]}>
                                            <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter, styles.fontWeight500]}>Scanner</Text>
                                        </View>
                                        <View style={[style.headerRight]} />
                                    </View>
                                </Body>
                            </Header>
                        </SafeAreaView>
                        <View style={{flex: 1}}>
                            <RNCamera style={style.camera}
                                type={RNCamera.Constants.Type.back}
                                onBarCodeRead={this._handleQrCodeRead.bind(this)}>
                                <View style={style.rectangleContainer}>
                                    <View style={{backgroundColor: 'rgba(0,0,0,0.7)',flex: 1}} />
                                    <View style={{flexDirection: 'row',justifyContent: 'center', height: 248}}>
                                        <View style={{backgroundColor: 'rgba(0,0,0,0.7)',flex: 1}} />
                                        <View style={style.rectangle} />
                                        <View style={{backgroundColor: 'rgba(0,0,0,0.7)',flex: 1}} />
                                    </View>
                                    <View style={{backgroundColor: 'rgba(0,0,0,0.7)',flex: 1}} />
                                </View>
                            </RNCamera>
                        </View>
                    </Container>
                </StyleProvider>
            );
        } else {
            return null;
        }
    }
}

const style = StyleSheet.create({
    camera: {
        flex: 1,
    },
    rectangleContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    rectangle: {
        height: 250,
        width: 250,
        backgroundColor: 'transparent',
    },
    header: {
        borderBottomWidth: 0,
        height: 'auto',
        padding: 0,
        paddingRight: 0,
        paddingLeft: 0,
        elevation: 0
    },
    headerLeft: {
        width: '15%',
        padding: 15
    },
    headerBody: {
        width: '70%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10
    },
    headerRight: {
        width: '15%',
        padding: 15
    },
});


export default connect(mapStateToProps, mapDispatchToProps)(QrCodeScanner)