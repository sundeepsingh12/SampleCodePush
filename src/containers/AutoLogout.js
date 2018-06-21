'use strict'
import React, { PureComponent } from 'react';
import Loader from '../components/Loader'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { checkForUnsyncTransactionAndLogout } from '../modules/pre-loader/preloaderActions'
import {
    StyleSheet,
    View,
    Text,
}
    from 'react-native'
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ checkForUnsyncTransactionAndLogout }, dispatch)
    }
}
class AutoLogout extends PureComponent {
    componentDidMount() {
        this.props.actions.checkForUnsyncTransactionAndLogout(true)
    }
    render() {
        return (
            <View>
                <View style={styles.container}>
                    <Text style={styles.summary}>Auto Logout...</Text>
                </View>
                <Loader />
            </View>
        )
    }

}
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
export default connect(null, mapDispatchToProps)(AutoLogout)