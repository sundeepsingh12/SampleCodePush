'use strict'
import React, {Component} from 'react'
import 
{
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  TouchableHighlight
}
from 'react-native'
import { Container, Content,Footer, Thumbnail, FooterTab,Input, Card, CardItem, Button, Body, Header, Left, Right, Icon, TextInput} from 'native-base';
import styles from '../themes/FeStyle'
import theme from '../themes/feTheme'
import imageFile from '../../images/fareye-logo.png'
import renderIf from '../lib/renderIf'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import * as globalActions from '../modules/global/globalActions'
import TimePicker,{payloadElement} from '../components/TimePicker'
const {
    SHOW_DATETIME_PICKER,
} = require('../lib/constants').default


function mapStateToProps(state){
    return{
      formElement : state.formLayout.formElement
    }
  }
  
  function mapDispatchToProps(dispatch){
    return {
      actions : bindActionCreators({ ...formLayoutActions,...globalActions}, dispatch)
    }
  }

class BasicFormElement extends Component {
    constructor(props) {
        super(props);
        this.formElementValue = {}
        this.STRING = 1;
        this.TEXT = 2;
        this.NUMBER = 6;
        this.DECIMAL = 13;

    }

    _onBlurEvent(attributeId){
        this.props.actions.updateFieldData(attributeId, this.formElementValue[attributeId] , this.props.formElement);
    }

    _getNextFocusableElement(fieldAttributeMasterId, formElement, nextEditable, value, isSaveDisabled){
        this.formElementValue[fieldAttributeMasterId] = value;
        if(value && value.length == 1){
            // then fire action to get next editable and focusable elements
            this.props.actions.getNextFocusableAndEditableElements(fieldAttributeMasterId,formElement,nextEditable,isSaveDisabled,value);
        }
        if(value.length == 0){
            this.props.actions.disableSaveIfRequired(fieldAttributeMasterId,isSaveDisabled,formElement,value);
        }
    }

    _onPressHelpText(fieldAttributeMasterId){
       this.props.actions.toogleHelpText(fieldAttributeMasterId, this.props.formElement);
    }

    _styleNextFocusable(isFocusable){
        if(isFocusable){
            return {
                backgroundColor: 'blue'
              }
        }
    }
   
    render(){
        switch(this.props.item.attributeTypeId){
            case this.STRING : 
            case this.TEXT :
            case this.NUMBER :
            case this.DECIMAL :
            return (
                renderIf (!this.props.item.hidden, 
                    <Card>
                    <CardItem onPress={()=> this.props.actions.setVisible(SHOW_DATETIME_PICKER,Id,this.props.formElement)}>
                        <Body style={StyleSheet.flatten([styles.padding0])}>
                        <View style={StyleSheet.flatten([styles.width100, styles.row, styles.justifySpaceBetween])} >
                            <View style={StyleSheet.flatten([{flexBasis: '12%', paddingTop: 2}])}>
                            <Icon name='md-create' style={StyleSheet.flatten([styles.fontXxl, theme.textPrimary, {marginTop: -5}])}/>
                            </View>
                            <View style={StyleSheet.flatten([styles.marginRightAuto, {flexBasis: '88%'}])}>
                            <View  style={StyleSheet.flatten([styles.row])}>
                                <View style={StyleSheet.flatten([{flexBasis: '80%'}])}>
                                    <Text style={StyleSheet.flatten([styles.fontSm, styles.bold])}>
                                        {this.props.item.label}
                                    </Text>
                                    <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, {color: '#999999'}])}>
                                        {this.props.item.subLabel}
                                    </Text>
                                    
                                </View>

                                <View style={StyleSheet.flatten([styles.row, styles.justifySpaceBetween, {flexBasis: '20%'}])}>
                                
                                    {renderIf(this.props.item.showCheckMark,
                                        <Icon name='ios-checkmark' style={StyleSheet.flatten([styles.fontXxxl, styles.fontSuccess, {marginTop: -5}])}/>
                                    )} 

                                    {renderIf((this.props.item.helpText && this.props.item.helpText.length > 0),
                                            <View>
                                                <TouchableHighlight underlayColor='#e7e7e7' onPress={()=>this._onPressHelpText(this.props.item.fieldAttributeMasterId)}>
                                                    <Icon name='ios-help-circle-outline' style={StyleSheet.flatten([styles.fontXl])}/>
                                                </TouchableHighlight>
                                            </View>
                                    )} 

                                    
                                </View>
                            </View>
                            <View style={this._styleNextFocusable(this.props.item.focus)}>
                                <Input 
                                    keyboardType={(this.props.item.attributeTypeId == 6 || this.props.item.attributeTypeId == 13)? 'numeric' : 'default'} 
                                    editable = {this.props.item.editable}
                                    multiline={this.props.item.attributeTypeId == 2 ? true : false} 
                                    placeholder='Regular Textbox' 
                                    onChangeText = {value => this._getNextFocusableElement(this.props.item.fieldAttributeMasterId,this.props.formElement,this.props.nextEditable,value,this.props.isSaveDisabled)}
                                    onBlur = {(e) => this._onBlurEvent(this.props.item.fieldAttributeMasterId)}
                                    
                                />
                            </View>
                            <View>
                                <TimePicker  item= {this.props.item} element ={this.props.formElement}/>
                            </View>
                        </View>
                        </View>
                        </Body>
                    </CardItem>
                </Card>
                )
            )

            default :
            console.log("fsvjfs",this.props.item)
            console.log("hfv",this.props.formElement)
            return (
                renderIf((this.props.item.attributeTypeId == 3 || this.props.item.attributeTypeId == 5 || this.props.item.attributeTypeId == 33),
                <View>
                    <View  style={StyleSheet.flatten([styles.row])}>
                            <View style={StyleSheet.flatten([{flexBasis: '80%'}])}>
                                <Text style={StyleSheet.flatten([styles.fontSm, styles.bold])}  onPress={()=> this.props.actions.actionDispatch(SHOW_DATETIME_PICKER, payloadElement(this.props.item.fieldAttributeMasterId,this.props.formElement))} >
                                    {this.props.item.label}
                                </Text>
                                <Text style={StyleSheet.flatten([styles.fontXs, styles.marginTop5, {color: '#999999'}])}>
                                    {this.props.item.subLabel}
                                </Text>
                                
                            </View>
                    </View>
                     <View>
                        <TimePicker  item= {this.props.item} element ={this.props.formElement}/>
                    </View>
                </View>
                )
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (BasicFormElement)


