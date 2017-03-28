/**
 * # LoginForm.js
 *
 * This class utilizes the ```tcomb-form-native``` library and just
 * sets up the options required for the 3 states of Login, namely
 * Login, Register or Reset Password
 *
 */
'use strict'
/**
 * ## Import
 *
 * React
 */
import React from 'react'
import {StyleSheet, Text, View, TouchableHighlight } from 'react-native';
/**
 * States of login display
 */
const {
  LOGIN
} = require('../lib/constants').default

/**
 *  The fantastic little form library
 */
const t = require('tcomb-form-native')
let Form = t.form.Form

var _ = require('lodash');

const stylesheet = _.cloneDeep(Form.stylesheet);
// console.log(Form.stylesheet);
// Form.stylesheet.textbox.normal.backgroundColor = 'green'
// console.log(Form.stylesheet);

stylesheet.textbox.normal.backgroundColor = '#F7F8FA';
stylesheet.textbox.normal.height = 50;
stylesheet.textbox.normal.borderRadius = 25;
stylesheet.textbox.normal.borderWidth = 1;
stylesheet.textbox.normal.borderColor = '#D4DCE1';
stylesheet.textbox.normal.paddingLeft = 20;
stylesheet.textbox.normal.paddingRight = 20;

stylesheet.textbox.error.borderColor = '#D4DCE1';



var LoginForm = React.createClass({
  /**
   * ## render
   *
   * setup all the fields using the props and default messages
   *
   */
  render () {
    let options = {
      auto: 'placeholders',
      stylesheet: stylesheet,
      fields: {
      }
    }

    let username = {
      maxLength: 12,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.usernameHasError,
      error: this.props.form.fields.usernameErrorMsg,
    }

    let secureTextEntry = !this.props.form.fields.showPassword

    let password = {
      maxLength: 12,
      secureTextEntry: secureTextEntry,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.passwordHasError,
      error: this.props.form.fields.passwordErrorMsg
    }

    options.fields['username'] = username
    options.fields['username'].placeholder = "your username"
    options.fields['username'].autoCapitalize = 'none'
    options.fields['password'] = password
    options.fields['password'].placeholder = "your password"


    let loginForm = t.struct({
      username: t.String,
      password: t.String
    })

    /**
     * ### Return
     * returns the Form component with the correct structures
     */
    return (
      <Form
        ref="form"
        type={loginForm}
        options={options}
        value={this.props.value}
        onChange={this.props.onChange}
      />

    )
  }
})

module.exports = LoginForm
