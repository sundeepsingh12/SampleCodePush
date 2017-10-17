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
import { Text, TouchableOpacity, View,StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux'
import * as timePickerActions from '../modules/date-time-picker/dateTimePickerActions'
import { connect } from 'react-redux'
import styles from '../themes/FeStyle'
import { Container, Content, Footer, FooterTab, Card, CardItem, Button, Body, Header, Left, Right, Icon, List, ListItem } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';

 class TimePicker extends Component {
   _handleDatePicked = (date) => {
    this.props.actions.handleTimePicker(date);
    this.props.navigation.goBack();
  };
//    lapsList() {

//     this.props.timevalue.split(' ').map((data) => {
//       return (
//         <View><Text>{data}</Text></View>
//       )
//     })

// }
  
  _hideDateTimePicker = () => {
      this.props.actions.hideDateTimePicker();
      this.props.navigation.goBack();
  }
    componentDidMount(){
        const attributeID = this.props.navigation.state.params.id;
        if(attributeID===3 || attributeID===5){
          this.props.actions.getDateTimePicker();
        }
    }
  render () {
      const l=this.props.timevalue;
    //   const {goBack} = this.props.navigation;
      console.log("suisfif",l);
      const m=(this.props.navigation.state.params.id===5) ?'time' :'date';
          return(
              <View>
              <DateTimePicker 
              isVisible={this.props.isTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              mode={m}
              />
               {/* <View>{this.lapsList()}</View>  */}
             
              </View>
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
