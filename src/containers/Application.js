/**
 * # Application.js
 *  Display startup screen and
 *  getSessionTokenAtStartup which will navigate upon completion
 */
'use strict'
import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { APP_VERSION_NUMBER } from '../lib/AttributeConstants'

console.disableYellowBox = true;

import * as authActions from '../modules/login/loginActions'
import * as initialLoadActions from '../modules/intialLoad/initialLoadActions'

import {
    StyleSheet,
    View,
    Text
}
    from 'react-native'

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
        this.props.initialLoadAction()
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
export default connect(null, {...authActions, ...initialLoadActions})(Application)
