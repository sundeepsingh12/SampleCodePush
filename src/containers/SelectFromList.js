//This class works for checkBox, RadioButton, DropDown.
'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as authActions from '../modules/login/loginActions'
import * as globalActions from '../modules/global/globalActions'

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  FlatList
}
  from 'react-native'

import { Container, Button, Picker, Title, List, ListItem, Form, Item, CheckBox, Radio, Content, Card } from 'native-base';
import * as selectFromListActions from '../modules/selectFromList/selectFromListActions'
import { CHECKBOX, RADIOBUTTON, DROPDOWN, OPTION_RADIO_FOR_MASTER} from '../lib/AttributeConstants'


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


function mapStateToProps(state) {
  return {
    selectFromListState: state.selectFromList.selectFromListState,
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...selectFromListActions }, dispatch)
  }
}

class SelectFromList extends Component {

  componentWillMount() {
    if(this.props.navigation.state.params.currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER )
      {
        this.props.actions.gettingDataForRadioMaster(this.props.navigation.state.params.currentElement.fieldAttributeMasterId,this.props.navigation.state.params.jobTransaction.jobId)
    }else{
        this.props.actions.gettingDataSelectFromList(this.props.navigation.state.params.currentElement.fieldAttributeMasterId)
      }
  }

  getViewOfFieldAttribute(id, isChecked) {
    if (this.props.navigation.state.params.currentElement.attributeTypeId == CHECKBOX) {
      return (
        <CheckBox checked={isChecked}
          onPress={() => {
            this.props.actions.setOrRemoveStates(this.props.selectFromListState,
              id, this.props.navigation.state.params.currentElement.attributeTypeId)
          }} />
      )
    }
    else if (this.props.navigation.state.params.currentElement.attributeTypeId == RADIOBUTTON || this.props.navigation.state.params.currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER) {
      return (
        <Radio selected={isChecked}
          onPress={() => {
            this.props.actions.setOrRemoveStates(this.props.selectFromListState,
              id, this.props.navigation.state.params.currentElement.attributeTypeId)
          }} />
      )
    }
  }

  render() {
    if (this.props.navigation.state.params.currentElement.attributeTypeId == CHECKBOX || this.props.navigation.state.params.currentElement.attributeTypeId == RADIOBUTTON ) {
      return (
        <Container>
          <View style={styles.container}>
            <FlatList
              data={(Object.values(this.props.selectFromListState)).sort((fieldData_1, fieldData_2) => fieldData_1.sequence - fieldData_2.sequence)}
              renderItem={({ item }) => {
                return (
                  <View>
                    <Content>
                      <Card style={{ flexDirection: 'row', height: 40 }}  >
                        {this.getViewOfFieldAttribute(item.id, item.isChecked)}
                        <Text>       {item.name}</Text>
                      </Card>
                    </Content>
                  </View>
                )
              }}
              keyExtractor={item => item.id}
            />
            <Button onPress={() => {
              this.props.actions.selectFromListButton(this.props.selectFromListState, this.props.navigation.state.params.currentElement, this.props.navigation.state.params.jobTransaction.id, this.props.navigation.state.params.latestPositionId, this.props.navigation.state.params.isSaveDisabled, this.props.navigation.state.params.formElements, this.props.navigation.state.params.nextEditable)
              this.props.navigation.goBack()
            }}>
              <Text> DONE </Text>
            </Button>
          </View>
        </Container>
      )
    }
    else if (this.props.navigation.state.params.currentElement.attributeTypeId == DROPDOWN) {
      return (
        <Container>
          <Content>
            <Form>
              <Picker mode="dropdown"
                onValueChange={value => this.props.actions.setOrRemoveStates(this.props.selectFromListState, value, this.props.navigation.state.params.currentElement.attributeTypeId)}
              >
                {Object.values(this.props.selectFromListState).sort((fieldData_1, fieldData_2) => fieldData_1.sequence - fieldData_2.sequence).map((object) => {
                  return (<Item label={object.name} value={object.id} key={object.id} />) //if you have a bunch of keys value pair
                })}
              </Picker>
            </Form>
          </Content>
          <View>
            <Button onPress={() => {
              this.props.actions.selectFromListButton(this.props.selectFromListState, this.props.navigation.state.params.currentElement, this.props.navigation.state.params.jobTransaction.id, this.props.navigation.state.params.latestPositionId, this.props.navigation.state.params.isSaveDisabled, this.props.navigation.state.params.formElements, this.props.navigation.state.params.nextEditable)
              this.props.navigation.goBack()
            }}>
              <Text> DONE </Text>
            </Button>
          </View>
        </Container>
      )
    }
     else if (this.props.navigation.state.params.currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER) {

    console.log("123",this.props.selectFromListState);
    const listData = (this.props.selectFromListState.selectFromListData != null && this.props.selectFromListState.selectFromListData != undefined ) ? this.props.selectFromListState.selectFromListData :this.props.selectFromListState
        return (
        <Container>
          <View style={styles.container}>
            <FlatList
              data={(Object.values(listData))}
              renderItem={({ item }) => {
                return (
                  <View>
                    <Content>
                      <Card style={{ flexDirection: 'row', height: 40 }}  >
                        {this.getViewOfFieldAttribute(item.id, item.isChecked)}
                        <Text>       {item.optionValue}</Text>
                      </Card>
                    </Content>
                  </View>
                )
              }}
              keyExtractor={item => item.id}
            />
            <Button onPress={() => {
              this.props.actions.selectFromListButton(this.props.selectFromListState, this.props.navigation.state.params.currentElement, this.props.navigation.state.params.jobTransaction.id, this.props.navigation.state.params.latestPositionId, this.props.navigation.state.params.isSaveDisabled, this.props.navigation.state.params.formElements, this.props.navigation.state.params.nextEditable)
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectFromList)