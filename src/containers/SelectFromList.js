//This class works for checkBox, RadioButton, DropDown.
'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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

import { Container, Button, Picker, List, ListItem, Form, Item, CheckBox, Radio, Content, Card,Footer,FooterTab,Right,Body,CardItem } from 'native-base'
import * as selectFromListActions from '../modules/selectFromList/selectFromListActions'
import { CHECKBOX, RADIOBUTTON, DROPDOWN } from '../lib/AttributeConstants'
import styles from '../themes/FeStyle'


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
    this.props.actions.gettingDataSelectFromList(this.props.navigation.state.params.currentElement.fieldAttributeMasterId)
  }

  renderListViewData(dataList){
       let view = []
       for (let index in dataList) {
               view.push(
                    this.listItemView(dataList[index])
                )
        }
        return view
  }

      listItemView = (item) => {
          let fieldAttributeView
          if (this.props.navigation.state.params.currentElement.attributeTypeId == CHECKBOX) {
            fieldAttributeView =  <CheckBox checked={item.isChecked}
         style={([styles.marginRight20])}
           />
          }
           else if (this.props.navigation.state.params.currentElement.attributeTypeId == RADIOBUTTON) {
       fieldAttributeView =  <Radio selected={item.isChecked}
        style={([styles.marginRight20])} 
          />
    }

        return (
            <ListItem
                key={item.id}
                icon style={StyleSheet.flatten([{ marginLeft: 0 }])}
                onPress={() =>  this.props.actions.setOrRemoveStates(this.props.selectFromListState,
              item.id, this.props.navigation.state.params.currentElement.attributeTypeId)}>
                <Body>
                    <Text>{item.name}</Text>
                </Body>
                <Right>
                   {fieldAttributeView}
                </Right>
            </ListItem>
        )
      }

  render() {
    if (this.props.navigation.state.params.currentElement.attributeTypeId == CHECKBOX || this.props.navigation.state.params.currentElement.attributeTypeId == RADIOBUTTON) {
      const radioButtonData = this.renderListViewData(this.props.selectFromListState)
      return (
        <Container>
        <Content style={StyleSheet.flatten([styles.padding10])}>
             <CardItem>
                     <Content>
                           <List>
                               {radioButtonData}
                                </List>
                            </Content>
                        </CardItem>
            </Content>
            <Footer>
                    <FooterTab>
            <Button success
             style={StyleSheet.flatten([{ borderRadius: 0 }])}
            onPress={() => {
              this.props.actions.selectFromListButton(this.props.selectFromListState, this.props.navigation.state.params.currentElement, this.props.navigation.state.params.jobTransaction.id, this.props.navigation.state.params.latestPositionId, this.props.navigation.state.params.isSaveDisabled, this.props.navigation.state.params.formElements, this.props.navigation.state.params.nextEditable)
              this.props.navigation.goBack()
            }}>
              <Text> DONE </Text>
            </Button>
            </FooterTab>
                </Footer>
        </Container>
      )
    }
    else if (this.props.navigation.state.params.currentElement.attributeTypeId == DROPDOWN) {
      console.log('inside drop down')
      console.log('data',this.props.selectFromListState)
      return (
        <Container>
          <Content>
            <Form>
              <Picker mode="dropdown"
                onValueChange={value => this.props.actions.setOrRemoveStates(this.props.selectFromListState, value, this.props.navigation.state.params.currentElement.attributeTypeId)}
              >
                {this.populateDropDown()}
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
  }

  populateDropDown(){
    return Object.values(this.props.selectFromListState).sort((fieldData_1, fieldData_2) => fieldData_1.sequence - fieldData_2.sequence).map((object) => {
                return (<Item label={object.name} value={object.id} key={object.id} />) 
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectFromList)
