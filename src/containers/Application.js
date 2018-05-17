/**
 * # Application.js
 *  Display startup screen and
 *  getSessionTokenAtStartup which will navigate upon completion
 */
'use strict'
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { APP_VERSION_NUMBER } from '../lib/AttributeConstants'


import * as authActions from '../modules/login/loginActions'

import {
    StyleSheet,
    View,
    Text
}
    from 'react-native'

var package_json = require('../../package.json')

var styles = StyleSheet.create({
    container: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        marginTop: 80,
        padding: 10
    },
    summary: {
        fontSize: 18,
        fontWeight: 'bold'
    }
})

/**
 * ## Application class
 */
// var reactMixin = require('react-mixin')
// import TimerMixin from 'react-timer-mixin'

class Application extends PureComponent {

    componentDidMount() {
        // Use a timer so Application screen is displayed
        setTimeout(
            () => {
                this.props.getSessionToken()
            },
            1000 //change 100 to 2500
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.summary}>FarEye Version : {APP_VERSION_NUMBER}</Text>
            </View>
        )
    }

}
// Since we're using ES6 classes, have to define the TimerMixin
// reactMixin(Application.prototype, TimerMixin)
/**
 * Connect the properties
 */
export default connect(null, authActions)(Application)
