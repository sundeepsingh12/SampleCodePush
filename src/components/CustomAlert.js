/**
 * Created by Gaurav
 * PureComponent to show alert dailog with max. 2 buttons
 * @param title: Title of alert dailog
 * @param message: Body of alert message
 * @param onOkPressed: Optional - Callback function which is called when user presses OK buttton
 * @param onCancelPressed: Optional - Callback function which is called when user presses Cancel buttton
 */
'use strict'

import React, { PureComponent } from 'react'
import {
    View,
    Alert
}
from 'react-native'

class CustomAlert extends PureComponent {

    render() {
        var _buttons = new Array();
        if (this.props.onOkPressed) {
            _buttons.push({ text: 'OK', onPress: this.props.onOkPressed });
        }
        if (this.props.onCancelPressed) {
            _buttons.push({ text: 'Cancel', onPress: this.props.onCancelPressed, style: 'cancel' });
        }
        if (_buttons.length==0) {
            _buttons.push({ text: 'OK' });
        }
        
        return (
            <View>
                {Alert.alert(
                    this.props.title,
                    this.props.message,
                    _buttons,
                    { cancelable: false }
                )}
            </View>
        );
    }
}

module.exports = CustomAlert

