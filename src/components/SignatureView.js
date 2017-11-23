'use strict'
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
}
    from 'react-native'
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import {
    Icon,
} from 'native-base';
import SignatureCapture from 'react-native-signature-capture';

class SignatureView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLandscape: 'landscape'
        };
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: "column" }}>
                <SignatureCapture
                    style={[{ flex: 1 }, styles.signature]}
                    ref="sign"
                    onSaveEvent={this.onSaveEvent}
                    onDragEvent={this.onDragEvent}
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    viewMode={this.state.isLandscape} />
                    {/* <TouchableHighlight style={[style.fabButton, styles.bgPrimary]}
                        onPress={() => { this.saveSign() }} >
                        <Icon name="md-checkmark" style={[styles.fontWhite, styles.fontXl]} />
                    </TouchableHighlight> */}

                    {/* <TouchableHighlight style={[style.buttonStyle]}
                        onPress={() => { this.resetSign() }} >
                        <Text>Reset</Text>
                    </TouchableHighlight> */}
            </View>
        );
    }


    saveSign = () => {
        this.refs["sign"].saveImage();
        this.refs["sign"].resetImage();
    }

    resetSign = () => {
        this.refs["sign"].resetImage();
    }

    onSaveEvent = (result) => {
        this.props.onSaveEvent(result)
        this.setState({ isLandscape: 'portrait' })
    }
    onDragEvent() {
        console.log("dragged");
    }
}

const style = StyleSheet.create({
    signature: {
        flex: 1,
        borderColor: '#000033',
        borderWidth: 1,
    },
    buttonStyle: {
        flex: 2, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    },
    fabButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center'
    }

});
export default SignatureView