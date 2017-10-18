/**
 * # Main.js
 *  This is the main app screen
 *
 */
'use strict'
/*
 * ## Imports
 *
 * Imports from redux
 */


/**
 * The actions we need
 */

/**
 * Router
 */
// import {Actions} from 'react-native-router-flux'

/**
 * The components needed from React
 */

/**
 *  Instead of including all app states via ...state
 *  One could explicitly enumerate only those which Main.js will depend on.
 *
 */


/**
 * ## App class
 */
import React, { Component } from 'react';
import { Text, TouchableOpacity, View,StyleSheet,Modal } from 'react-native';
import { bindActionCreators } from 'redux'
import * as timePickerActions from '../modules/date-time-picker/dateTimePickerActions'
import { connect } from 'react-redux'
import styles from '../themes/FeStyle'
import { Container, Content, Footer, FooterTab, Card, CardItem, Button, Body, Header, Left, Right, Icon, List, ListItem } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
const {
    SHOW_DATETIME_PICKER,
    HIDE_DATETIME_PICKER,
    HANDLE_TIME_PICKED,
} = require('../lib/constants').default

 class TimePicker extends Component {
   _handleDatePicked = (date) => {
    this.props.actions.dateTimeHandle(HANDLE_TIME_PICKED,date);
    this.props.navigation.goBack();
  };
  
  _hideDateTimePicker = () => {
      //this.props.actions.dateTimeHandle(HIDE_DATETIME_PICKER,null);
      this.props.navigation.goBack();
  }
    componentDidMount(){
        const attributeID = this.props.navigation.state.params.id;
        if(attributeID===3 || attributeID===5){
          this.props.actions.dateTimeHandle(SHOW_DATETIME_PICKER,null);
        }
    }
  render () {
      console.log('render time',this.props)
      const mode=(this.props.navigation.state.params.id===5) ?'time' :'date';
          return(
              <Modal 
              onRequestClose = {null}>
              <DateTimePicker 
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              mode={mode}
              isVisible={true}
              />
              </Modal>
          )
      }     
       }
function mapStateToProps(state) {
    return {
        isTimePickerVisible: state.timePicker.isComponentVisible,
        timevalue: state.timePicker.value,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...timePickerActions }, dispatch)
    }
}
/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(TimePicker)
