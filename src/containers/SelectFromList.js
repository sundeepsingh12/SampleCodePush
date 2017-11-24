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
  Modal,
  ScrollView
}
  from 'react-native'

import { Button, List, ListItem, Form, Item, Icon, Input, CheckBox, Radio, Content, Body, Toast } from 'native-base'
import * as selectFromListActions from '../modules/selectFromList/selectFromListActions'
import { CHECKBOX, RADIOBUTTON, DROPDOWN, OPTION_RADIO_FOR_MASTER } from '../lib/AttributeConstants'

import styles from '../themes/FeStyle'
import {
  SET_FILTERED_DATA_SELECTFROMLIST,
  INPUT_TEXT_VALUE,
} from '../lib/constants'

function mapStateToProps(state) {
  return {
    selectFromListState: state.selectFromList.selectFromListState,
    errorMessage: state.selectFromList.errorMessage,
    dropdownValue: state.selectFromList.dropdownValue,
    totalItemsInSelectFromList: state.selectFromList.totalItemsInSelectFromList,
    searchBarInputText: state.selectFromList.searchBarInputText,
    filteredDataSelectFromList: state.selectFromList.filteredDataSelectFromList,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...selectFromListActions, ...globalActions }, dispatch)
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
      this.props.actions.gettingDataSelectFromList(this.props.currentElement.fieldAttributeMasterId, this.props.formElements, this.props.currentElement.attributeTypeId)
    }
  }

  setModalVisible = (visible) => {
    this.setState(() => {
      return {
        modalVisible: visible,
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

  _dropModal = () => {
    this.setModalVisible(false)
    this.props.press()
    this.props.actions.setState(INPUT_TEXT_VALUE, '')    
  }

  _saveAndDropModal = () => {
    this.props.actions.selectFromListButton(this.props.selectFromListState, this.props.currentElement, this.props.jobTransaction.id, this.props.latestPositionId, this.props.isSaveDisabled, this.props.formElements, this.props.nextEditable)
    this.setModalVisible(false),
      this.props.press()
  }

  _setValueInInputText(valueOfInputText) {
    if (this.props.currentElement.attributeTypeId == DROPDOWN && this.props.totalItemsInSelectFromList == 1)
      this.props.actions.setState(INPUT_TEXT_VALUE, valueOfInputText)
  }

  searchBarView() {
    return (
     <View>
        <View searchBar style={[styles.padding5]}>
          <Item rounded style={{ height: 30, backgroundColor: '#ffffff' }}>
            <Input placeholder="Search"
              style={[styles.fontSm, styles.justifyCenter, { marginTop: 0, lineHeight: 10 }]}
              value={this.props.searchBarInputText}
              onChangeText={(searchText) => {
                this._setValueInInputText(searchText)
                this.props.actions.setFilteredDataInDropdown(this.props.selectFromListState, searchText)
              }}
            />
            <Icon style={[styles.fontSm]} name="md-close" />
          </Item>
        </View>
      </View>
    )
  }

  listItemView = (item) => {
    let fieldAttributeView = null
    if (this.props.currentElement.attributeTypeId == CHECKBOX) {
      fieldAttributeView = <CheckBox checked={item.isChecked}
      />


    }
    else if (this.props.currentElement.attributeTypeId == RADIOBUTTON || this.props.currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER || (this.props.currentElement.attributeTypeId == DROPDOWN && this.props.totalItemsInSelectFromList == 0)) {
      fieldAttributeView = <Radio selected={item.isChecked}
        style={([{ width: 20 }])}
      />
    }

    return (
      <ListItem
        button
        key={item.id}
        onPress={() => {
          this.props.actions.setOrRemoveStates(this.props.selectFromListState,
            item.id, this.props.currentElement.attributeTypeId)
          this._setValueInInputText(item.name)
          this.props.actions.setState(SET_FILTERED_DATA_SELECTFROMLIST, {})
        }}>
        {fieldAttributeView}
        <Body>
          <Text style={[styles.marginLeft10]}>{(this.props.currentElement.attributeTypeId == OPTION_RADIO_FOR_MASTER) ? item.optionKey : item.name}</Text>
          </Body>
      </ListItem>
    )
    // }
  }

  render() {
    if ((this.props.errorMessage != null && this.props.errorMessage != undefined && this.props.errorMessage.length != 0)) {
      Toast.show({
        text: this.props.errorMessage,
        position: 'bottom',
        buttonText: 'Okay'
      })
    }
    if ((this.props.currentElement.attributeTypeId == CHECKBOX || this.props.currentElement.attributeTypeId == RADIOBUTTON || this.props.currentElement.attributeTypeId == DROPDOWN) && this.state.modalVisible) {
      let radioButtonData
      let searchBarViewData
      if (this.props.currentElement.attributeTypeId == DROPDOWN && this.props.totalItemsInSelectFromList == 1) {
        searchBarViewData = this.searchBarView()
        radioButtonData = this.renderListViewData(this.props.filteredDataSelectFromList)
      }
      else {
        radioButtonData = this.renderListViewData(this.props.selectFromListState)
        searchBarViewData = null
      }
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this._dropModal}
        >
          <TouchableHighlight
            onPress={this._dropModal}
            style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]}>
            <TouchableHighlight style={{ backgroundColor: '#ffffff', flex: .6 }}>
              <View>
                <View style={[styles.bgLightGray]}>
                  <View style={[styles.row, styles.justifySpaceBetween, styles.bgLightGray]}>
                    <Text style={[styles.padding10]}>{this.props.currentElement.label}</Text>
                    <TouchableHighlight
                      onPress={this._saveAndDropModal}>
                      <Text style={[styles.fontInfo, styles.padding10]}> DONE </Text>
                    </TouchableHighlight>
                  </View>
                  {searchBarViewData}
                </View>
                <ScrollView style={[styles.paddingBottom30]}>
                  <View style={[styles.flexBasis100
                  ]}>
                    <List>
                      {radioButtonData}
                    </List>
                    {/*This view is empty because bottom sheet margin from bottom  */}
                    <View style={{ height: 80 }} />

                  </View>
                </ScrollView>
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
          onRequestClose={this._dropModal}
        >
          <TouchableHighlight
            onPress={this._dropModal}
            style={[styles.flex1, styles.column, styles.justifyEnd, { backgroundColor: 'rgba(0,0,0,.5)' }]}>
            <TouchableHighlight style={{ backgroundColor: '#ffffff', flex: .6 }}>
              <View>
                <View style={[styles.row, styles.justifySpaceBetween, styles.bgLightGray]}>
                  <Text style={[styles.padding10]}>{this.props.currentElement.label}</Text>

                  <TouchableHighlight
                    onPress={this._saveAndDropModal}>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectFromList)
