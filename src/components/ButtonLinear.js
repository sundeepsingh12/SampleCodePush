/**
 * # FormButton.js
 *
 * Display a button that responds to onPress and is colored appropriately
 */
'use strict'
/**
 * ## Imports
 *
 * React
 */
import React from 'react'
import
{
  StyleSheet,
  View
} from 'react-native'

/**
 * The platform neutral button
 */
const Button = require('apsl-react-native-button')

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0091EA',
    borderRadius: 25,
    height: 50,
  }


})

var ButtonLinear = React.createClass({
  /**
   * ### render
   *
   * Display the Button
   */
  render () {
    return (
      <View>
        <Button style={styles.button}
          textStyle={{fontSize: 16, color: '#0091EA'}}>
          {this.props.buttonText}
        </Button>
      </View>
    )
  }
})

module.exports = ButtonLinear
