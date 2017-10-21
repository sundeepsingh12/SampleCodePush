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
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import * as globalActions from '../modules/global/globalActions'
import { connect } from 'react-redux'
import { DatePickerAndroid, TimePickerAndroid } from 'react-native';
import styles from '../themes/FeStyle'
import { Container, Content, Footer, FooterTab, Card, CardItem, Button, Body, Header, Left, Right, Icon, List, ListItem } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {setVisible} from '../modules/form-layout/formLayoutActions';
import {getNextFocusableAndEditableElements} from '../modules/form-layout/formLayoutActions'
const {
    SHOW_DATETIME_PICKER,
    HIDE_DATETIME_PICKER,
    HANDLE_TIME_PICKED,
} = require('../lib/constants').default


function mapStateToProps(state) {
   return {
     elements : state.formLayout.formElement
   }
}

function mapDispatchToProps(dispatch) {
    return {
       actions :bindActionCreators({ ...formLayoutActions, ...globalActions}, dispatch)
    }
}
export const cloneFormElement = function deepClone( obj ) {
            if( !obj || true == obj ) //this also handles boolean as true and false
                        return obj;
                    let objType = typeof( obj );
                    if( "number" == objType || "string" == objType ) // add your immutables here
                        return obj;
                    let result = Array.isArray( obj ) ? [] : !obj.constructor ? {} : new obj.constructor();
                    if( obj instanceof Map )
                        for( let key of obj.keys() )
                            result.set( key, deepClone( obj.get( key ) ) );
                    for( let key in obj )
                        if( obj.hasOwnProperty( key ) )
                            result[key] = deepClone( obj[ key ] );
                    return result;
}
export const payloadElement = (attributeMasterId,formElement) => {  
        const elements = cloneFormElement(formElement)
        if(!attributeMasterId || !elements){
            return;
        }else{
            elements.get(attributeMasterId).isVisible = !elements.get(attributeMasterId).isVisible;
            return elements;
        }
}

 class TimePicker extends Component {
 
  
 _hideDateTimePicker = () => {
        const payload = payloadElement(this.props.item.fieldAttributeMasterId,this.props.elements);
        this.props.actions.actionDispatch(HIDE_DATETIME_PICKER,payload);
  }

 _handleDatePicked = (date) => {
        const payload = payloadElement(this.props.item.fieldAttributeMasterId,this.props.element);
        this.props.actions.actionDispatch(HIDE_DATETIME_PICKER,payload);
        this.props.actions.getNextFocusableAndEditableElements(this.props.item.fieldAttributeMasterId,this.props.element,this.props.element.nextEditable,this.props.element.isSaveDisabled,date.toString());    
  }

 _minimumDate = () => {
    const leftValidation = (!this.props.item.validation) ? null : this.props.item.validation[0].leftKey
    let date = (leftValidation) ? new Date() : undefined;
       if(leftValidation && date){
           let leftKey = leftValidation.split(',')
           if(leftKey[1] == "+"){
               date.setDate(date.getDate() + parseInt(leftKey[2]));
           }else{
               date.setDate(date.getDate() - parseInt(leftKey[2]));
           }
       }
    return date;
    }

 _maximumDate = () => {
    const leftValidation = (!this.props.item.validation) ? null : this.props.item.validation[0].rightKey
    let date = (leftValidation) ? new Date() : undefined;
      if(leftValidation && date){
          let leftKey = leftValidation.split(',')
          if(leftKey[1] == "+"){
               date.setDate(date.getDate() + parseInt(leftKey[2]));
          }else{
               date.setDate(date.getDate() - parseInt(leftKey[2]));
            }
        }
    return date;
    }


  render () {
      console.log('render time',this.props.item)
      const mode = (this.props.item.attributeTypeId == 5) ?'time' :'date';
      const minimum = (this.props.item.isVisible) ? this._minimumDate() : undefined ;
      const maximum = (this.props.item.isVisible) ? this._maximumDate() : undefined ;
      return(
        <DateTimePicker 
        isVisible = {this.props.item.isVisible}
        onConfirm = {this._handleDatePicked}
        onCancel = {this._hideDateTimePicker}
        mode = {mode}
        minimumDate = { minimum}
        maximumDate = { maximum}
        />
        )
      }     
       }
/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps) (TimePicker)
