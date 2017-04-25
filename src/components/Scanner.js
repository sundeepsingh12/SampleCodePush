/**
 * Created by udbhav on 20/4/17.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet
} from 'react-native';
import Camera from 'react-native-camera';
import Login from '../containers/Login';

class Scanner extends Component {

    constructor() {
        super();
        this.state = {
            showCamera: true,
            cameraType: Camera.constants.Type.back,
            username:'',
            password:''
        };
    }

    render() {
        return (
            this.renderCamera()
        );
    }

    renderCamera() {
        if (this.state.showCamera) {
            return (
                <Camera
                    ref="cam"
                    style={styles.container}
                    onBarCodeRead={this._onBarCodeRead.bind(this)}
                    type={this.state.cameraType}>
                </Camera>
            );
        }
        else {
            const details = {
                username : this.state.username,
                password : this.state.password
            };

            return (
                <Login details = {details} />
            )
        }
    }

    _onBarCodeRead(e) {
        const username = e.data.split("/")[0];
        const password = e.data.split("/")[1];
        this.setState({showCamera: false,username,password});
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    }
});
module.exports = Scanner