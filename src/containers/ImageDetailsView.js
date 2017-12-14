
'use strict';
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import RNFS from 'react-native-fs';
import {
    PATH_TEMP
} from '../lib/AttributeConstants'

class ImageDetailsView extends Component {
    componentDidMount() {

    }
    async getImageData() {
        // let result = await RNFS.readFile(PATH_TEMP + this.props.navigation.state.params.value, 'base64');
        // return result
       let result = await RNFS.readdir(PATH_TEMP)
        console.log('image data', result)
    }
    render() {
        let x = this.getImageData()
        return (
            <View style={styles.container}>
                <Image
                    source={{
                        isStatic: true,
                        uri: 'data:image/jpeg;base64,' + x,
                    }}
                    style={{ height: '100%', width: '100%' }}
                />
                {/* <Image source={this.props.navigation.state.params.value} /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
});
export default ImageDetailsView
