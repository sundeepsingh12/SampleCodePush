
'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as sequenceActions from '../modules/sequence/sequenceActions'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'
import React, { PureComponent } from 'react'
import {
  StyleSheet, View, Alert, TouchableOpacity, Modal
} from 'react-native'
import { ROUTE_OPTIMIZATION, FILTER_REF_NO } from '../lib/AttributeConstants'
import {
  UPDATE_SEQUENCE, SAVE,
  WARNING_FOR_BACK, WARNING,
  CLOSE, OK, JOB_NOT_PRESENT, CANCEL,
  CURRENT_SEQUENCE_NUMBER, NEW_SEQUENCE_NUMBER_MESSAGE,
  JUMP_SEQUENCE,
  BLANK_NEW_SEQUENCE,
  SAME_SEQUENCE_ERROR,
  NOT_A_NUMBER,
  AUTO_ROUTING_MESSAGE,
  AUTO_ROUTING_EXTRA_MESSAGE
} from '../lib/ContainerConstants'
import {
  Container,
  Header,
  Button,
  Text,
  Body,
  Icon,
  Footer,
  Item,
  Input,
  FooterTab,
  StyleProvider,
  Toast,
  Label
} from 'native-base'
import {
  SET_RESPONSE_MESSAGE,
  SET_REFERENCE_NO,
  SET_SEQUENCE_LIST_ITEM,
  SET_SEQ_INITIAL_STATE_EXCEPT_RUNSHEET_LIST,
  SET_SEQUENCE_BACK_ENABLED
} from '../lib/constants'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import SortableListView from 'react-native-sortable-listview'
import JobListItem from '../components/JobListItem'
import _ from 'lodash'
import SearchBarV2 from '../components/SearchBarV2'

function mapStateToProps(state) {
  return {
    isSequenceScreenLoading: state.sequence.isSequenceScreenLoading,
    sequenceList: state.sequence.sequenceList,
    isResequencingDisabled: state.sequence.isResequencingDisabled,
    responseMessage: state.sequence.responseMessage,
    transactionsWithChangedSeqeunceMap: state.sequence.transactionsWithChangedSeqeunceMap,
    searchText: state.sequence.searchText,
    currentSequenceListItemSeleceted: state.sequence.currentSequenceListItemSeleceted,
    jobMasterSeperatorMap: state.sequence.jobMasterSeperatorMap,
    backEnabledFromAppNavigator: state.sequence.backEnabledFromAppNavigator,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...sequenceActions,
      ...globalActions
    }, dispatch)
  }
}

class Sequence extends PureComponent {

  //newSequenceNumber :- used for new sequence entered by the user in input
  //alertMessage :- alert message used when user enter wrong sequence in input
  state = {
    newSequenceNumber: '',
    alertMessage: ''
  }

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  componentDidMount() {
    this.props.actions.prepareListForSequenceModule(this.props.navigation.state.params.runsheetNumber)
  }

  /** 
   * When we set some response message this method get triggered and show a toast and it will also check if hardware back is pressed or not if pressed call goBack()
  */
  componentDidUpdate() {
    if (this.props.responseMessage) {
      this.showToast()
    }
    if (this.props.backEnabledFromAppNavigator) {
      this.goBack()
      this.props.actions.setState(SET_SEQUENCE_BACK_ENABLED, false)
    }
  }

  /** 
   * This method will sort list of trasaction according to seqSelected and will return it to SortableListView
  */
  renderList() {
    const list = this.props.sequenceList.sort((transaction1, transaction2) =>
      transaction1.seqSelected - transaction2.seqSelected
    )
    return list
  }

  /**
   * This method is called when user drag and drop a list item of SortableListView
   * @param {*Object} rowParam //it contains index of list item before and after drop, it also contains list item which is moved
   */
  onRowMoved(rowParam) {
    this.props.actions.rowMoved(rowParam, this.props.sequenceList, this.props.transactionsWithChangedSeqeunceMap, this.props.jobMasterSeperatorMap)
  }

  /**
   * Change state and set alertMessage
   * @param {*} alertMessage
   */
  setAlertMessage(alertMessage) {
    this.setState({ alertMessage })
    return
  }

  /**
   * when jump Sequence button is pressed we check the input if it is appropriate or not 
   * if appropriate we change the sequence of job transaction
   * @param {*String} newSequenceNumber 
   */
  onJumpSequencePressed(newSequenceNumber) {
    // new seqeunce number should not be empty or an empty string
    if (_.size(_.trim(newSequenceNumber)) == 0) {
      return this.setAlertMessage(BLANK_NEW_SEQUENCE)
    }
    //new sequence number should not include '.' or ',' or '-' or a negative number
    else if (isNaN(newSequenceNumber) || newSequenceNumber.includes('.') || parseInt(newSequenceNumber) < 1) {
      return this.setAlertMessage(NOT_A_NUMBER)
    }
    //previous sequence number should not be equal to new sequence number entered by the user
    else if (_.isEqual(this.props.currentSequenceListItemSeleceted.seqSelected, parseInt(newSequenceNumber))) {
      return this.setAlertMessage(SAME_SEQUENCE_ERROR)
    }
    this.props.actions.jumpSequence(_.indexOf(this.props.sequenceList, this.props.currentSequenceListItemSeleceted), parseInt(newSequenceNumber), this.props.sequenceList, this.props.transactionsWithChangedSeqeunceMap, this.props.jobMasterSeperatorMap)
    //close the modal
    this.setModalView({})
  }

  /**
   * After changing the sequence save button gets activated and on pressing save button this method is called
   */
  savePressed = () => {
    this.props.actions.saveSequencedJobTransactions(this.props.transactionsWithChangedSeqeunceMap)
  }

  /**
   * This method is called when user enter reference number and search all job Trnasaction according to reference number by pressing search icon
   */
  searchIconPressed = () => {
    if (this.props.searchText) {
      this.props.actions.searchReferenceNumber(this.props.searchText, this.props.sequenceList)
    }
  }

  /**
   * If sequence is changed by user or auto sequence takes place then save get activated by the below method,
   * if there is no change in sequence then update sequence from server get activated
   */
  getButtonView() {
    return _.isEmpty(this.props.transactionsWithChangedSeqeunceMap) ? <Button
      style={[styles.bgPrimary]}
      onPress={this.showAlert}
      disabled={this.props.isResequencingDisabled}
      full>
      <Text style={[styles.fontLg, styles.fontWhite, styles.padding5]}>{UPDATE_SEQUENCE}</Text>
    </Button>
      : <Button
        onPress={this.savePressed}
        success full>
        <Text style={[styles.fontLg, styles.fontWhite, styles.padding5]}>{SAVE}</Text>
      </Button>
  }

  /**
   * Shows a alert if save is activated and user presses back button
   */
  showWarningForBack = () => {
    Alert.alert(
      WARNING,
      WARNING_FOR_BACK,
      [
        {
          text: CLOSE, style: 'cancel', onPress: () => {
            this.clearStateAndGoBack()
          }
        },
        { text: OK },
      ],
    )
  }

  /**
   * It will go back and clear state except runsheet list which is used by SequenceRunsheetList container
   */
  clearStateAndGoBack() {
    this.props.actions.setState(SET_SEQ_INITIAL_STATE_EXCEPT_RUNSHEET_LIST)
    this.props.navigation.goBack()
  }

  /**
   * when user presses back button this method gets triggered
   */
  goBack = () => {
    !_.isEmpty(this.props.transactionsWithChangedSeqeunceMap) ? this.showWarningForBack() : this.clearStateAndGoBack()
  }

  /**
   * Set modal visible for an item which is clicked and close modal when required
   * @param {*} item 
   */
  setModalView(item) {
    this.props.actions.setState(SET_SEQUENCE_LIST_ITEM, item)
    this.setState({ newSequenceNumber: '', alertMessage: '' })
  }

  /**
   * set search text from search bar component
   */
  setSearchText = (searchText) => {
    this.props.actions.setState(SET_REFERENCE_NO, searchText)
  }

  /**
   * used for setting search text but in this case search text is set by QR Scanner
   */
  returnValue = (searchText) => {
    this.setSearchText(searchText)
    this.props.actions.searchReferenceNumber(searchText, this.props.sequenceList)
  }

  /**
   * inflate modal when SortableListView item is pressed
   */
  modalDialogView() {
    return <Modal animationType={"fade"}
      transparent={true}
      visible={!_.isEmpty(this.props.currentSequenceListItemSeleceted)}
      onRequestClose={() => this.setModalView({})}
      presentationStyle={"overFullScreen"}>
      <View style={[styles.relative, styles.alignCenter, styles.justifyCenter, { height: '100%' }]}>
        <View style={[styles.absolute, { height: '100%', left: 0, right: 0, backgroundColor: 'rgba(0,0,0,.6)' }]}>
        </View>
        <View style={[styles.bgWhite, styles.shadow, styles.borderRadius3, { width: '90%' }]}>
          <View style={[styles.padding10, styles.marginBottom10]}>
            <Text style={[styles.fontCenter, styles.bold, styles.marginBottom10]}>{CURRENT_SEQUENCE_NUMBER}{this.props.currentSequenceListItemSeleceted.seqSelected}</Text>
            <Text style={[styles.fontCenter, styles.marginBottom10]}>
              {NEW_SEQUENCE_NUMBER_MESSAGE}
            </Text>
            <Item regular>
              <Input
                onChangeText={(sequenceNumber) =>
                  this.setState({ newSequenceNumber: sequenceNumber, alertMessage: '' })}
                style={{ height: 40, fontSize: 13 }}
                keyboardType="numeric"
                returnKeyType='done' />
            </Item>
            {this.state.alertMessage ?
              <Label style={[styles.fontDanger, styles.fontSm, styles.paddingTop10, styles.marginLeft5]}>{this.state.alertMessage}</Label>
              : null}
          </View>
          <View style={[styles.row, { borderTopColor: '#d3d3d3', borderTopWidth: 1 }]}>
            <View style={{ width: '50%' }}>
              <Button transparent full
                onPress={() => this.setModalView({})} >
                <Text style={[styles.fontPrimary]}>{CANCEL}</Text>
              </Button>
            </View>
            <View style={{ width: '50%', borderLeftColor: '#d3d3d3', borderLeftWidth: 1 }}>
              <Button transparent full
                onPress={() => this.onJumpSequencePressed(this.state.newSequenceNumber)}>
                <Text style={[styles.fontPrimary]}>{JUMP_SEQUENCE}</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  }

  /**
   * inflate header view
   */
  headerView() {
    return <Header style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
      <Body>
        <View
          style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
          <TouchableOpacity style={[style.headerLeft]}
            onPress={this.goBack}>
            <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
          </TouchableOpacity>
          <View style={[style.headerBody]}>
            <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.runsheetNumber}</Text>
          </View>
          <View style={[style.headerRight]}>
          </View>
        </View>
        {!_.isEmpty(this.props.sequenceList) && !this.props.isSequenceScreenLoading ? <SearchBarV2 placeholder={FILTER_REF_NO} setSearchText={this.setSearchText} navigation={this.props.navigation} returnValue={this.returnValue} onPress={this.searchIconPressed} searchText={this.props.searchText} /> : null}
      </Body>
    </Header>
  }

  /**
   * view for loader will be shown when isSequenceScreenLoading is enabled
   */
  loaderView() {
    return (this.props.isSequenceScreenLoading) ? <Loader /> : null
  }

  /**
   * if no jobs are present then show a message
   */
  viewForNoJobPresent() {
    return (!this.props.isSequenceScreenLoading) ? <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
      <Text style={[styles.margin30, styles.fontDefault, styles.fontDarkGray]}>{JOB_NOT_PRESENT}</Text>
    </View> : null
  }

  render() {
    let modalDialogView = this.modalDialogView()
    let buttonView = this.getButtonView()
    let headerView = this.headerView()
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          {headerView}
          {modalDialogView}
          {this.loaderView()}
          {!_.isEmpty(this.props.sequenceList) && !this.props.isSequenceScreenLoading ?
            <View style={[styles.flex1, styles.bgWhite]}>
              <SortableListView
                style={{ flex: 1 }}
                data={this.renderList()}
                onRowMoved={rowParam => {
                  this.onRowMoved(rowParam)
                }}
                activeOpacity={1}
                sortRowStyle={style.sortableListStyle}
                renderRow={row => <JobListItem data={row} callingActivity='Sequence' onPressItem={() => this.setModalView(row)} />} />
              <Footer style={{
                height: 'auto'
              }}>
                <FooterTab style={StyleSheet.flatten([styles.padding10])}>
                  {buttonView}
                </FooterTab>
              </Footer>
            </View>
            : this.viewForNoJobPresent()}
        </Container>
      </StyleProvider>
    )
  }

  /**
   * It will show alert when update sequence is pressed
   */
  showAlert = () => {
    Alert.alert(
      ROUTE_OPTIMIZATION,
      AUTO_ROUTING_MESSAGE + _.size(this.props.sequenceList) + AUTO_ROUTING_EXTRA_MESSAGE,
      [
        { text: CANCEL, style: 'cancel' },
        { text: OK, onPress: this.OnOkButtonPressed },
      ],
    )
  }

  /**
   * It will show toast 
   */
  showToast() {
    Toast.show({
      text: `${this.props.responseMessage}`,
      duration: 5000,
      position: 'bottom',
      buttonText: OK,
    })
    this.props.actions.setState(SET_RESPONSE_MESSAGE, '')
  }

  /**
   * When user want to run optimization from server i.e. resequencing of jobs takes place from server
   */
  OnOkButtonPressed = () => {
    const requestBody = this.props.actions.resequenceJobsFromServer(this.props.sequenceList)
  }
}

const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    padding: 0,
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: 10
  },
  headerLeft: {
    width: '15%',
    padding: 15
  },
  headerBody: {
    width: '70%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerRight: {
    width: '15%',
    padding: 15
  },
  sortableListStyle: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#f4f4f4',
    elevation: 2,
    shadowOffset: { width: 3, height: 4, },
    shadowColor: '#d3d3d3',
    shadowOpacity: .5,
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(Sequence)
