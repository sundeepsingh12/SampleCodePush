/**
 * # Application.js
 *  Display startup screen and
 *  getSessionTokenAtStartup which will navigate upon completion
 */
'use strict'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { APP_VERSION_NUMBER } from '../lib/AttributeConstants'

console.disableYellowBox = false;

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

export default connect(null, { ...initialLoadActions})(Application)
