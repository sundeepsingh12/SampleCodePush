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

import * as authActions from '../modules/login/loginActions'
import LoginRender from '../components/LoginRender'
import sha256 from 'sha256';
import {Actions} from 'react-native-router-flux';
import React from 'react';

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

function performLoginUsingScan(login,username,password){
    login(username, password)
}


function scanPressHandler() {
    Actions.Scanner();
}

let Login = React.createClass({

  render () {
    let onButtonPress = buttonPressHandler.bind(null,
                                                this.props.actions.login,
                                                this.props.auth.form.fields.username,
                                                this.props.auth.form.fields.password
                                               );
      let onScanPress = scanPressHandler.bind();

    return (
      <LoginRender
        formType={LOGIN}
        onButtonPress={onButtonPress}
        onScanPress = {onScanPress}
        auth={this.props.auth}
        global={this.props.global}
      />
    )
  },
    componentDidMount(){
        const details = this.props.details;
        if(details!==null && details!==undefined){
            performLoginUsingScan(this.props.actions.login,details.username,details.password);
        }
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Login)
