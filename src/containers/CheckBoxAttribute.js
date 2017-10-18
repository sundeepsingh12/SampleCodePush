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
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * The actions we need
 */
import * as authActions from '../modules/login/loginActions'
import * as globalActions from '../modules/global/globalActions'
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from 'react-native-modal-datetime-picker'


/**
 * Router
 */
// import {Actions} from 'react-native-router-flux'

/**
 * The components needed from React
 */
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  FlatList
}
  from 'react-native'

import { Container, Button, Picker, Title, Option, List, ListItem, Icon, Form, Item, CheckBox, Radio, Content, Card } from 'native-base';
import * as checkBoxActions from '../modules/checkBox/checkBoxActions'

const {
  SET_VALUE_IN_CHECKBOX,
  SET_OR_REMOVE_FROM_STATE_ARRAY,
  CHECKBOX_BUTTON_CLICKED,
  SHOW_DATETIME_PICKER,
  HIDE_DATETIME_PICKER,
  HANDLE_TIME_PICKED,
} = require('../lib/constants').default

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 60,
    backgroundColor: '#f7f7f7'
  },
  summary: {
    fontFamily: 'BodoniSvtyTwoITCTT-Book',
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#FF3366',
    borderColor: '#FF3366',
    marginLeft: 10,
    marginRight: 10
  }

})

/**
 * ## App class
 */

function mapStateToProps(state) {
  console.log("mapStateToProps")
  console.log(state.checkBox.checkBoxValues)
  return {
    checkBoxValues: state.checkBox.checkBoxValues,
    isTimePickerVisible: state.checkBox.isComponentVisible,
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...checkBoxActions }, dispatch)
  }
}

class CheckBoxAttribute extends Component {

  constructor(props) {
    super(props);
    this.params = Object.values(Object.values(this.props.navigation.state)[0])[0]
    this.latestPositionId = Object.values(Object.values(this.props.navigation.state)[0])[1]
    this.jobTransactionId = Object.values(Object.values(this.props.navigation.state)[0])[2]
    console.log("helloparamslatestPositionId", this.latestPositionId)
    console.log("helloparamsjobTransactionId", this.jobTransactionId)
    console.log("helloparams", this.params)
  }

  // headerRightFunction() {
  //   console.log("headerRightFunction")
  //   this.props.actions.actionDispatch(CHECKBOX_BUTTON_CLICKED,{})
  // }


  // static navigationOptions = (props) => {
  //   return {
  //     title: 'Check',
  //     headerRight: (
  //       <Button onPress={() => console.log(props)}>
  //         <Text> DONE </Text>
  //       </Button>
  //     )
  //   }
  // };
  _handleDatePicked = (date) => {
    this.props.actions.actionDispatch(HANDLE_TIME_PICKED,date);
    this.props.navigation.goBack();
  };
  
  _hideDateTimePicker = () => {
      this.props.actions.actionDispatch(HIDE_DATETIME_PICKER,null);
      this.props.navigation.goBack();
  }

  componentWillMount() {
    console.log("componentWillMount()")
    console.log(this.params)
    const attributeID = this.params.attributeTypeId;
        if(attributeID===3 || attributeID===5){
          this.props.actions.actionDispatch(SHOW_DATETIME_PICKER,null);
        }
        else{
          this.props.actions.getCheckBoxData(this.params.fieldAttributeMasterId)
        }
  }

  renderDataCheckBox = (item) => {
    console.log("renderData")
    console.log(this.params)
    console.log(item)
    return (
      <View>
        <Content>
          <Card style={{ flexDirection: 'row', height: 40 }}  >
            <CheckBox checked={item.isChecked} onPress={() => { this.props.actions.setOrRemoveStates(this.props.checkBoxValues, item.id, this.params.attributeTypeId) }} />
            <Text>     {item.name}</Text>
          </Card>
        </Content>
      </View>
    )
  }

  renderDataRadioButton = (item) => {
    return (
      <View>
        <Content>
          <Card style={{ flexDirection: 'row', height: 40 }}  >
            <Radio selected={item.isChecked} onPress={() => { this.props.actions.setOrRemoveStates(this.props.checkBoxValues, item.id, this.params.attributeTypeId) }} />
            <Text>     {item.name}</Text>
          </Card>
        </Content>
      </View>
    )
  }


  render() {
    console.log('renderprops', this.props)
    console.log('render')
    console.log("renderMethodCheckBox", this.props.checkBoxValues)
    //Todo
    //Add loader &constant instead of 8
    if (this.params.attributeTypeId === 8) {
      return (
        <Container>
          <View style={styles.container}>
            <FlatList
              data={Object.values(this.props.checkBoxValues)}
              renderItem={({ item }) => this.renderDataCheckBox(item)}
              keyExtractor={item => item.id}
            />
            <Button onPress={() => { this.props.actions.checkBoxButtonDone(this.props.checkBoxValues, this.params, this.jobTransactionId, this.latestPositionId) }}>
              <Text> DONE </Text>
            </Button>
          </View>
        </Container>
      )
    } else if(this.params.attributeTypeId === 9) {
      return (
        <Container>
          <View style={styles.container}>
            <FlatList
              data={Object.values(this.props.checkBoxValues)}
              renderItem={({ item }) => this.renderDataRadioButton(item)}
              keyExtractor={item => item.id}
            />
            <Button onPress={() => { this.props.actions.checkBoxButtonDone(this.props.checkBoxValues, this.params, this.jobTransactionId, this.latestPositionId) }}>
              <Text> DONE </Text>
            </Button>
          </View>
        </Container>
      )
    }
    else{
      const mode=(this.params.attributeTypeId===5) ?'time' :'date';
          return(
              <View>
              <DateTimePicker 
              isVisible={this.props.isTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              mode={mode}
              />
              </View>
          )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckBoxAttribute)