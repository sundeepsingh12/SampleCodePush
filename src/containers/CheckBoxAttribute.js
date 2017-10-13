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

const {
    SET_VALUE_IN_CHECKBOX,
    SET_OR_REMOVE_FROM_STATE_ARRAY,
    CHECKBOX_BUTTON_CLICKED,
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
    checkBoxValues: state.checkBox.checkBoxValues
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...checkBoxActions }, dispatch)
  }
}

class CheckBoxAttribute extends Component {

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


  componentWillMount() {
    console.log("componentWillMount()")
    this.props.actions.getCheckBoxData()
  }

  renderData = (item) => {
    console.log(item)
    if (item.fieldAttributeMasterId == 43159) {
      return (
        <View>
          <Content>
            <Card style={{ flexDirection: 'row', height: 40 }}  >
              <CheckBox checked={item.isChecked} onPress={() => { this.props.actions.setOrRemoveStates(this.props.checkBoxValues,item.id) }} />
              <Text>     {item.name}</Text>
            </Card>
          </Content>
        </View>
      )
    }
    else {
      return (
        <View>
          <Content>
            <Card style={{ flexDirection: 'row', height: 40 }}  >
              <Radio selected={item.isChecked} onPress={() => { this.props.actions.setOrRemoveStates(this.props.checkBoxValues,item.id) }} />
              <Text>     {item.name}</Text>
            </Card>
          </Content>
        </View>
      )
    }
  }

  render() {
    console.log('renderprops',this.props)
    console.log('render')
    console.log("renderMethodCheckBox", this.props.checkBoxValues)
    return (
      <Container>
        <View style={styles.container}>
          <FlatList
            data={Object.values(this.props.checkBoxValues)}
            renderItem={({ item }) => this.renderData(item)}
            keyExtractor={item => item.id}
          />
          <Button onPress={() => { this.props.actions.checkBoxButtonDone(this.props.checkBoxValues) }}>
            <Text> DONE </Text>
          </Button>
        </View>
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckBoxAttribute)