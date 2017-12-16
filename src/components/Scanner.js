/**
 * Created by Gaurav
 * Component which can Scan Barcode or QR code 
 * @param onBarCodeRead: Callback function which will receive the scanning result
 * @param onBackPress: Callback function which is called when user presses back buttton
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    Button
} from 'react-native';
import Camera from 'react-native-camera'

export default class Scanner extends Component {

    render() {
        return (
            <Camera
                ref="cam"
                style={stylesa.preview}
                aspect={Camera.constants.Aspect.fill}>
            </Camera>
        );
    }
}

const stylesa = StyleSheet.create({
    preview: {
        flex: 1,
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
