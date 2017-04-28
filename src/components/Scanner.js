/**
 * Created by udbhav on 20/4/17.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Camera from 'react-native-camera';
import Login from '../containers/Login';
import {Actions} from 'react-native-router-flux';


class Scanner extends Component {

    // constructor() {
    //     super();
    //     this.state = {
    //         showCamera: true,
    //         cameraType: Camera.constants.Type.back,
    //     };
    // }

    render() {
        return (
            this.renderCamera()
        );
    }

    renderCamera() {
        if (this.state.showCamera) {
            return (
                    <View style={styles.container}>
                        <Camera
                            ref="cam"
                            onBarCodeRead={this._onBarCodeRead.bind(this)}
                            style={styles.preview}
                            aspect={Camera.constants.Aspect.fill}>
                            <Text style={styles.capture} onPress={this.goBack.bind(this)}>BACK</Text>
                        </Camera>
                    </View>
            );
        }
        else {
            const credentials = {
                username : this.state.username,
                password : this.state.password
            };

            return (
                <Login credentials = {credentials} />
            )
        }
    }

    _onBarCodeRead(e) {
        const username = e.data.split("/")[0];
        const password = e.data.split("/")[1];
        // this.setState({showCamera: false,username,password});
        dispatch()
    }

    goBack(){
        Actions.pop()
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
