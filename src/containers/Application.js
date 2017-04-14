/**
 * # Application.js
 *  Display startup screen and
 *  getSessionTokenAtStartup which will navigate upon completion
 */
'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * Project actions
 */
import * as authActions from '../reducers/login/loginActions'
// import * as deviceActions from '../reducers/device/deviceActions'
import * as globalActions from '../reducers/global/globalActions'

/**
 * The components we need from ReactNative
 */
import React from 'react'
import
{
    StyleSheet,
    View,
    Text
}
from 'react-native'

/**
 *  Save that state
 */
function mapStateToProps (state) {
  return {
    deviceVersion: state.device.version,
    auth: {
      form: {
        isFetching: state.auth.form.isFetching
      }
    },
    global: {
      currentState: state.global.currentState,
      showState: state.global.showState
    }
  }
};

/**
 * Bind all the actions from authActions and globalActions
 */
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...globalActions }, dispatch)
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

/**
 * ## Application class
 */
var reactMixin = require('react-mixin')
import TimerMixin from 'react-timer-mixin'

let Application = React.createClass({
    /**
     * See if there's a sessionToken from a previous login
     *
     */
  componentDidMount () {
        // Use a timer so Application screen is displayed
    this.setTimeout(
            () => {
              this.props.actions.getSessionToken()
            },
            100 //change 100 to 2500
        )
  },

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.summary}>FarEye Version : {this.props.deviceVersion}</Text>
      </View>
    )
  }
})
// Since we're using ES6 classes, have to define the TimerMixin
reactMixin(Application.prototype, TimerMixin)
/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Application)
