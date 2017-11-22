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
  FlatList,
  Modal
}
  from 'react-native'

import { Container, Button, Picker, List, ListItem, Header, Form, Item, CheckBox, Radio, Content, Card, Footer, FooterTab, Right, Body, CardItem, Toast } from 'native-base'
import * as selectFromListActions from '../modules/selectFromList/selectFromListActions'
import { CHECKBOX, RADIOBUTTON, DROPDOWN,OPTION_RADIO_FOR_MASTER } from '../lib/AttributeConstants'
import styles from '../themes/FeStyle'


function mapStateToProps(state) {
  return {
    selectFromListState: state.selectFromList.selectFromListState,
    errorMessage: state.selectFromList.errorMessage,
    dropdownValue: state.selectFromList.dropdownValue,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...selectFromListActions }, dispatch)
  }
}

class SelectFromList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
    }
  }

  componentDidMount() {
    if (this.props.currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER) {
      this.props.actions.gettingDataForRadioMaster(this.props.currentElement, this.props.jobTransaction.jobId)
    } else {
      this.props.actions.gettingDataSelectFromList(this.props.currentElement.fieldAttributeMasterId, this.props.formElements)
    }
  }

  setModalVisible = (visible) => {
    this.setState(() => {
      return {
        modalVisible: visible
      }
    })
  }

  renderListViewData(dataList) {
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
    if (this.props.currentElement.attributeTypeId == CHECKBOX) {
      fieldAttributeView = <CheckBox checked={item.isChecked}
      />


    }
    else if (this.props.currentElement.attributeTypeId == RADIOBUTTON || this.props.currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER) {
      fieldAttributeView = <Radio selected={item.isChecked}
        style={([{ width: 20 }])}
      />
    }

    if (this.props.currentElement.attributeTypeId == RADIOBUTTON || this.props.currentElement.attributeTypeId == CHECKBOX) {
      return (
        <ListItem
          key={item.id}
          icon
          onPress={() => this.props.actions.setOrRemoveStates(this.props.selectFromListState,
            item.id, this.props.currentElement.attributeTypeId)}>
          {fieldAttributeView}
          <Body>
            <Text style={[styles.marginLeft10]}>{item.name}</Text>
          </Body>
        </ListItem>
      )
    }
    else if (this.props.currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER) {
      return (
        <ListItem
          key={item.id}
          icon
          onPress={() => this.props.actions.setOrRemoveStates(this.props.selectFromListState,
            item.id, this.props.currentElement.attributeTypeId)}>
          {fieldAttributeView}
          <Body>
            <Text style={[styles.marginLeft10]}>{item.optionKey}</Text>
          </Body>
        </ListItem>
      )
    }
  }

  render() {
    if ((this.props.errorMessage != null && this.props.errorMessage != undefined && this.props.errorMessage.length != 0)) {
      Toast.show({
        text: this.props.errorMessage,
        position: 'bottom',
        buttonText: 'Okay'
      })
    }
    if (this.props.currentElement.attributeTypeId == CHECKBOX || this.props.currentElement.attributeTypeId == RADIOBUTTON && this.state.modalVisible) {
      const radioButtonData = this.renderListViewData(this.props.selectFromListState)
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          backdropPressToClose
          onRequestClose={() => {
            this.setModalVisible(false)
            this.props.press()
          }}
        >
          <TouchableHighlight
            onPress={() => {
              this.setModalVisible(false),
                this.props.press()
            }}
            style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]}>
            <TouchableHighlight style={{ backgroundColor: '#ffffff', flex: .6 }}>
              <View>
                <View style={[styles.row, styles.justifySpaceBetween, styles.bgLightGray]}>
                  <Text style={[styles.padding10]}>{this.props.currentElement.label}</Text>

                  <TouchableHighlight
                    onPress={() => {
                      this.props.actions.selectFromListButton(this.props.selectFromListState, this.props.currentElement, this.props.jobTransaction.id, this.props.latestPositionId, this.props.isSaveDisabled, this.props.formElements, this.props.nextEditable)
                      this.setModalVisible(false),
                        this.props.press()
                    }}>
                    <Text style={[styles.fontInfo, styles.padding10]}> DONE </Text>
                  </TouchableHighlight>
                </View>
                <View style={[styles.paddingBottom30]}>
                  <Content style={[styles.flexBasis100
                  ]}>
                    <List>
                      {radioButtonData}
                    </List>
                    {/*This view is empty because bottom sheet margin from bottom  */}
                    <View style={{ height: 40 }} />

                  </Content>
                </View>
              </View>
            </TouchableHighlight>
          </TouchableHighlight>
        </Modal>
      )
    }

    else if (this.props.currentElement.attributeTypeId == DROPDOWN) {
      console.log("dropdownss", this.props.dropdownValue)
      const listData = (!this.props.selectFromListState.selectListData) ? this.props.selectFromListState : {}
      return (

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          backdropPressToClose
          onRequestClose={() => {
            this.setModalVisible(false)
            this.props.press()
          }}
        >
          <TouchableHighlight
            onPress={() => {
              this.setModalVisible(false),
                this.props.press()
            }}
            style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]}>
            <TouchableHighlight style={{ backgroundColor: '#ffffff', flex: .6 }}>
              <View>
                <View style={[styles.row, styles.justifySpaceBetween, styles.bgLightGray]}>
                  <Text style={[styles.padding10]}>{this.props.currentElement.label}</Text>
                </View>

                <Form>
                  <Picker mode="dropdown"
                    selectedValue={this.props.dropdownValue}
                    onValueChange={(value) => {
                      this.props.actions.setOrRemoveStates(listData, value, this.props.currentElement.attributeTypeId),
                      this.props.actions.selectFromListButton(listData, this.props.currentElement, this.props.jobTransaction.id, this.props.latestPositionId, this.props.isSaveDisabled, this.props.formElements, this.props.nextEditable)
                      this.setModalVisible(false),
                        this.props.press()
                    }}
                  >
                    {this.populateDropDown()}
                  </Picker>
                </Form>
              </View>
            </TouchableHighlight>
          </TouchableHighlight>
        </Modal>
      )
    }
    else if (this.props.currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER) {
      const listData = (this.props.selectFromListState.selectListData != null && this.props.selectFromListState.selectListData != undefined) ? this.props.selectFromListState.selectListData : {}
      const optionRadioForMasterData = this.renderListViewData(listData)
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          backdropPressToClose
          onRequestClose={() => {
            this.setModalVisible(false)
            this.props.press()
          }}
        >
          <TouchableHighlight
            onPress={() => {
              this.setModalVisible(false),
                this.props.press()
            }}
            style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]}>
            <TouchableHighlight style={{ backgroundColor: '#ffffff', flex: .6 }}>
              <View>
                <View style={[styles.row, styles.justifySpaceBetween, styles.bgLightGray]}>
                  <Text style={[styles.padding10]}>{this.props.currentElement.label}</Text>

                  <TouchableHighlight
                    onPress={() => {
                      this.props.actions.selectFromListButton(this.props.selectFromListState, this.props.currentElement, this.props.jobTransaction.id, this.props.latestPositionId, this.props.isSaveDisabled, this.props.formElements, this.props.nextEditable)
                      this.setModalVisible(false),
                        this.props.press()
                    }}>
                    <Text style={[styles.fontInfo, styles.padding10]}> DONE </Text>
                  </TouchableHighlight>
                </View>
                <View style={[styles.paddingBottom30]}>
                  <Content style={[styles.flexBasis100
                  ]}>
                    <List>
                      {optionRadioForMasterData}
                    </List>
                    {/*This view is empty because bottom sheet margin from bottom  */}
                    <View style={{ height: 40 }} />

                  </Content>
                </View>
              </View>
            </TouchableHighlight>
          </TouchableHighlight>
        </Modal>
      )
    }
    return null
  }

  populateDropDown() {
    return Object.values(this.props.selectFromListState).sort((fieldData_1, fieldData_2) => fieldData_1.sequence - fieldData_2.sequence).map((object) => {
      return (<Item label={object.name} value={object.id} key={object.id} />)
    })
  }
}

var style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    padding: 0,
    paddingRight: 0,
    paddingLeft: 0
  },
  headerBody: {
    width: '800%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerRight: {
    width: '20%',
    padding: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 66
  },
  button: {
    padding: 8,
  },
  loginButton: {
    position: 'absolute',
    bottom: 0,
    height: 40,
    backgroundColor: 'blue',
    justifyContent: 'center',
    width: 40
  },
  buttonText: {
    fontSize: 17,
    color: "#007AFF"
  },
  subView: {
    flex: 1,
    backgroundColor: "green",

  },
  containerStyle: {
    backgroundColor: 'green',
    borderRadius: 6,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 100,
    elevation: 5

  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectFromList)
