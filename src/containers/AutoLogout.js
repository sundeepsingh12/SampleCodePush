'use strict'
import React, {PureComponent} from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Loader from '../components/Loader'
import
{
    StyleSheet,
    View,
    Text
}
    from 'react-native'


    function mapStateToProps(state) {
        return {
          isLoaderRunning:state.autoLogout.isLoaderRunning,
        }
      }


class AutoLogout extends PureComponent {


    render() {
        return (
            <View>
            <View style={styles.container}>
                <Text style={styles.summary}>Auto Logout...</Text>
            </View>
            <Loader/>
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
// Since we're using ES6 classes, have to define the TimerMixin
// reactMixin(Application.prototype, TimerMixin)
/**
 * Connect the properties
 */
export default connect(mapStateToProps, null)(AutoLogout)