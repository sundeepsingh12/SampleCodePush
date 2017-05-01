/**
 * # ServiceStatusIcon.js
 * Returns icon based on the running status of the service
 * SERVICE_PENDING > Show pending icon
 * SERVICE_RUNNING > Show running icon
 * SERVICE_SUCCESS > Show success icon
 * SERVICE_FAILED > Show failed icon
 */
'use strict'

import React from 'react';
import feStyle from '../themes/FeStyle'
import { Spinner } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import
{
  StyleSheet,
  View
} from 'react-native'

const {
  SERVICE_PENDING,
  SERVICE_RUNNING,
  SERVICE_SUCCESS,
  SERVICE_FAILED
} = require('../lib/constants').default


var ServiceStatusIcon = React.createClass({

  getIconBasedOnState(status) {
    console.log(status);
    switch(status) {
      case SERVICE_PENDING:
        return <Ionicons name="ios-clock-outline" style={[feStyle.fontDarkGray, feStyle.fontXxl]} />
      case SERVICE_RUNNING:
        return <Spinner  size="small"/>;
      case SERVICE_SUCCESS:
        return <Ionicons name="ios-checkmark-outline" style={[feStyle.fontSuccess, feStyle.fontXxxl]} />;
      case SERVICE_FAILED:
        return <Ionicons name="ios-information-circle-outline" style={[feStyle.fontDanger, feStyle.fontXxl]} />;
    }
  },

  /**
   * ### render
   *
   * Display the Icon
   */
  render () {
    let icon = this.getIconBasedOnState(this.props.status);
    return (
      <View>
        {icon}
      </View>
    )
  }
})

module.exports = ServiceStatusIcon
