'use strict'




import React, { Component } from 'react';
import { Text, TouchableOpacity, View,StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux'
import * as datePickerActions from '../modules/date-time-picker/dateTimePickerActions'
import { connect } from 'react-redux'
import styles from '../themes/FeStyle'
import { Container, Content, Footer, FooterTab, Card, CardItem, Button, Body, Header, Left, Right, Icon, List, ListItem } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';

 class DatePicker extends Component {
   _handleDatePicked = (date) => {
       console.log("sdcsc"+date);
    this.props.actions.handleDatePicker(date);
  };
  _hideDateTimePicker = () => {
      this.props.actions.hideDateTimePicker();
  }
    
      componentWillMount() {
this.props.actions.getDateTimePicker();
  }
  render () {
          return(
              <View>
              {/* <TouchableOpacity onPress={this._showDateTimePicker} >
              <View style={StyleSheet.flatten([styles.column, styles.bgWhite, styles.padding5, { borderTopWidth: 1, borderTopColor: '#d3d3d3' }])}>
                        <View style={StyleSheet.flatten([styles.row, styles.flexWrap, styles.justifyCenter, styles.alignCenter])}>
                            <Text style={{fontSize:20}}>Date picker</Text>
                        </View>
              </View>   
             </TouchableOpacity> */}
             <DateTimePicker 
              isVisible={this.props.isTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              /> 
             </View>
          )
      }
 }
function mapStateToProps(state) {
    return {
        isTimePickerVisible: state.timePicker.isComponentVisible,
        datevalue: state.timePicker.value,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...datePickerActions }, dispatch)
    }
}
/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(DatePicker)