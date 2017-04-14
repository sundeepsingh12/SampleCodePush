/**
 * # Login.js
 *
 *  The container to display the Login form
 *
 */
'use strict'
/**
 * ## Imports
 *
 * Redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as authActions from '../reducers/login/loginActions'
import LoginRender from '../components/LoginRender'
import sha256 from 'sha256';

import
{
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
  View
}
from 'react-native'


import React from 'react'

const {
  LOGIN
} = require('../lib/constants').default

/**
 * ## Redux boilerplate
 */

function mapStateToProps (state) {
  return {
    auth: state.auth,
    global: state.global
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

function buttonPressHandler (login, username, password) {
  login(username, sha256(password))
}


let Login = React.createClass({

  render () {
    let onButtonPress = buttonPressHandler.bind(null,
                                                this.props.actions.login,
                                                this.props.auth.form.fields.username,
                                                this.props.auth.form.fields.password
                                               )

    return (
      <LoginRender
        formType={LOGIN}
        onButtonPress={onButtonPress}
        auth={this.props.auth}
        global={this.props.global}
      />
    )
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
