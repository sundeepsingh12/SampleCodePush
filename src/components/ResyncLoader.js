'use strict'

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux'
import { Spinner } from 'native-base';

function mapStateToProps(state) {
    return {
        downloadingJobs: state.home.downloadingJobs
    }
};

class ResyncLoader extends Component {
    render() {
        return (
            <View>
                <View style={{width: 64, height: 64, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    {this.props.downloadingJobs ? <Spinner size="small" color={'#0091EA'} style={StyleSheet.flatten([{height: 32, marginTop: -5}])}/> : <Ionicons style={{ color: '#878787', marginTop: -5, height: 32 }} name={'ios-sync-outline'} size={26} />}
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#878787'}}>
                        Re-Sync
                    </Text>

                </View>
           </View>
        )
    }
}

export default connect(mapStateToProps, null)(ResyncLoader)

