'use strict';
import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Right,
    Icon,
    Footer,
    StyleProvider
} from 'native-base';

import Camera from 'react-native-camera';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as globalActions from '../modules/global/globalActions'
import { SCANNING } from '../lib/constants'
import styles from '../themes/FeStyle'
import platform from '../../native-base-theme/variables/platform'
import getTheme from '../../native-base-theme/components';


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

class QrCodeScanner extends Component {

    componentDidMount() {
        this.props.actions.setState(SCANNING, true)
    }

    _handleQrCodeRead(e) {
        this.props.actions.setState(SCANNING, false)
        if (this.props.navigation.state.params.calledFromArray) {
            this.props.navigation.state.params.returnData(e.data, this.props.navigation.state.params.currentElement)
        } else {
            this.props.navigation.state.params.returnData(e.data)
        }
        this.props.navigation.goBack(null)
    }

    render() {
        if (this.props.scanning) {
            return (
                <StyleProvider style={getTheme(platform)}>
                    <Container>
                        <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
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
                        <View style={style.rectangleContainer}>
                            <Camera style={style.camera}
                                type={Camera.constants.Type.back}
                                playSoundOnCapture={true}
                                onBarCodeRead={this._handleQrCodeRead.bind(this)}>
                                <View style={style.rectangleContainer}>
                                    <View style={style.rectangle} />
                                </View>
                            </Camera>
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
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').width,
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    rectangle: {
        height: 250,
        width: 250,
        borderWidth: 2,
        borderColor: '#00FF00',
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