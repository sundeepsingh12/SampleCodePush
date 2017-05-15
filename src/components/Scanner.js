/**
 * Created by Gaurav
 * Component which can Scan Barcode or QR code 
 * @param onBarCodeRead: Callback function which will receive the scanning result
 * @param onBackPress: Callback function which is called when user presses back buttton
 */
'use strict';
import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Camera from 'react-native-camera';


class Scanner extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Camera
                    ref="cam"
                    onBarCodeRead={this.props.onBarCodeRead}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}>
                    <Text style={styles.capture} onPress={this.props.onBackPress}>BACK</Text>
                </Camera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    }
});
module.exports = Scanner
