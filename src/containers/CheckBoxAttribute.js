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
import { CHECKBOX, RADIOBUTTON } from '../lib/AttributeConstants'



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
    console.log("navigatioooo",this.props.navigation.state)
    this.params = this.props.navigation.state.params.currentElement
    this.latestPositionId = this.props.navigation.state.params.latestPositionId
    this.jobTransactionId = this.props.navigation.state.params.jobTransaction.id
    this.isSaveDisabled = this.props.navigation.state.params.isSaveDisabled
    this.formElement = this.props.navigation.state.params.formElements
    this.nextEditable = this.props.navigation.state.params.nextEditable
    console.log("helloparams", this.params)
  }

  // headerRightFunction() {
  //   console.log("headerRightFunction")
  //   this.props.actions.actionDispatch({})
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

  componentWillMount() {
    console.log("componentWillMount()")
    console.log(this.params)
    this.props.actions.getCheckBoxData(this.params.fieldAttributeMasterId)
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
    if (this.params.attributeTypeId == CHECKBOX) {
      return (
        <Container>
          <View style={styles.container}>
            <FlatList
              data={Object.values(this.props.checkBoxValues)}
              renderItem={({ item }) => this.renderDataCheckBox(item)}
              keyExtractor={item => item.id}
            />
            <Button onPress={() => {
              this.props.actions.checkBoxButtonDone(this.props.checkBoxValues, this.params, this.jobTransactionId, this.latestPositionId, this.isSaveDisabled, this.formElement, this.nextEditable)
              this.props.navigation.goBack()
            }}>
              <Text> DONE </Text>
            </Button>
          </View>
        </Container>
      )
    } else if (this.params.attributeTypeId == RADIOBUTTON) {
      return (
        <Container>
          <View style={styles.container}>
            <FlatList
              data={Object.values(this.props.checkBoxValues)}
              renderItem={({ item }) => this.renderDataRadioButton(item)}
              keyExtractor={item => item.id}
            />
            <Button onPress={() => {
              this.props.actions.checkBoxButtonDone(this.props.checkBoxValues, this.params, this.jobTransactionId, this.latestPositionId, this.isSaveDisabled, this.formElement, this.nextEditable)
              this.props.navigation.goBack()
            }}>
              <Text> DONE </Text>
            </Button>
          </View>
        </Container>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckBoxAttribute)