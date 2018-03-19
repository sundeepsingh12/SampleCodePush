
'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as sequenceActions from '../modules/sequence/sequenceActions'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'
import React, { PureComponent } from 'react'
import {
  StyleSheet, View, Alert, TouchableOpacity, Modal, BackHandler
} from 'react-native'
import { ROUTE_OPTIMIZATION, FILTER_REF_NO } from '../lib/AttributeConstants'
import {
  UPDATE_SEQUENCE, SAVE,
  WARNING_FOR_BACK, WARNING,
  CLOSE, OK, JOB_NOT_PRESENT, CANCEL,
  CURRENT_SEQUENCE_NUMBER, NEW_SEQUENCE_NUMBER_MESSAGE,
  JUMP_SEQUENCE,
  BLANK_NEW_SEQUENCE,
  SEQUENCE_NOT_AN_INT,
  SAME_SEQUENCE_ERROR,
  NOT_A_NUMBER,
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
  HardwareBackPress,
  SET_REFERENCE_NO,
  SET_SEQUENCE_LIST_ITEM
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
    jobMasterSeperatorMap: state.sequence.jobMasterSeperatorMap
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

  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  constructor(props) {
    super(props)
    this.state = {
      newSequenceNumber: '',
      alertMessage: ''
    }
  }

  componentDidMount() {
    this.props.actions.prepareListForSequenceModule(this.props.navigation.state.params.runsheetNumber)
    BackHandler.addEventListener(HardwareBackPress, this.goBack)
  }

  componentDidUpdate() {
    if (this.props.responseMessage) {
      this.showToast()
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(HardwareBackPress, this.goBack)
  }

  renderList() {
    const list = this.props.sequenceList.sort((transaction1, transaction2) =>
      transaction1.seqSelected - transaction2.seqSelected
    )
    return list
  }

  onRowMoved(rowParam) {
    this.props.actions.rowMoved(rowParam, this.props.sequenceList, this.props.transactionsWithChangedSeqeunceMap, this.props.jobMasterSeperatorMap)
  }

  setAlertMessage(alertMessage) {
    this.setState(() => {
      return {
        alertMessage: alertMessage
      }
    })
  }

  onJumpSequencePressed(newSequenceNumber) {
    if (_.size(_.trim(newSequenceNumber)) == 0) {
      this.setAlertMessage(BLANK_NEW_SEQUENCE)
      return
    }
    else if (newSequenceNumber.includes('.') || newSequenceNumber.includes(',') || newSequenceNumber.includes('-')) {
      this.setAlertMessage(NOT_A_NUMBER)
      return
    }
    else if (parseInt(newSequenceNumber) < 1) {
      this.setAlertMessage(SEQUENCE_NOT_AN_INT + newSequenceNumber)
      return
    }
    newSequenceNumber = parseInt(newSequenceNumber)
    if (_.isEqual(this.props.currentSequenceListItemSeleceted.seqSelected, newSequenceNumber)) {
      this.setAlertMessage(SAME_SEQUENCE_ERROR)
      return
    }
    this.props.actions.jumpSequence(_.indexOf(this.props.sequenceList, this.props.currentSequenceListItemSeleceted), newSequenceNumber, this.props.sequenceList, this.props.transactionsWithChangedSeqeunceMap, this.props.jobMasterSeperatorMap)
    this.setModalView({})
  }

  savePressed = () => {
    this.props.actions.saveSequencedJobTransactions(this.props.transactionsWithChangedSeqeunceMap)
  }

  searchIconPressed = () => {
    if (this.props.searchText) {
      this.props.actions.searchReferenceNumber(this.props.searchText, this.props.sequenceList)
    }
  }

  getButtonView() {
    if (_.isEmpty(this.props.transactionsWithChangedSeqeunceMap)) {
      return <Button
        style={[styles.bgPrimary]}
        onPress={this.showAlert}
        disabled={this.props.isResequencingDisabled}
        full>
        <Text style={[styles.fontLg, styles.fontWhite, styles.padding5]}>{UPDATE_SEQUENCE}</Text>
      </Button>
    } else {
      return <Button
        onPress={this.savePressed}
        success full>
        <Text style={[styles.fontLg, styles.fontWhite, styles.padding5]}>{SAVE}</Text>
      </Button>
    }
  }

  showWarningForBack = () => {
    Alert.alert(
      WARNING,
      WARNING_FOR_BACK,
      [
        {
          text: CLOSE, style: 'cancel', onPress: () => {
            this.props.navigation.goBack(null)
            this.props.actions.setState(SET_REFERENCE_NO, '')
          }
        },
        { text: OK },
      ],
    )
  }

  goBack = () => {
    if (!_.isEmpty(this.props.transactionsWithChangedSeqeunceMap)) {
      this.showWarningForBack()
    } else {
      this.props.navigation.goBack(null)
    }
    return true
  }

  setModalView(item) {
    this.props.actions.setState(SET_SEQUENCE_LIST_ITEM, item)
    this.props.actions.setState(SET_REFERENCE_NO, '')
    this.setState(() => {
      return {
        newSequenceNumber: '',
        alertMessage: ''
      }
    })
  }

  setSearchText = (searchText) => {
    this.props.actions.setState(SET_REFERENCE_NO, searchText)
  }

  returnValue = (searchText) => {
    this.setSearchText(searchText)
    this.props.actions.searchReferenceNumber(searchText, this.props.sequenceList)
  }


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
                  this.setState(() => { return { newSequenceNumber: sequenceNumber, alertMessage: '' } })}
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
        <SearchBarV2 placeholder={FILTER_REF_NO} setSearchText={this.setSearchText} navigation={this.props.navigation} returnValue={this.returnValue} onPress={this.searchIconPressed} searchText={this.props.searchText} />
      </Body>
    </Header>
  }

  render() {
    let modalDialogView = this.modalDialogView()
    let buttonView = this.getButtonView()
    let headerView = this.headerView()
    if (this.props.isSequenceScreenLoading) {
      return <Loader />
    }
    else {
      if (!_.isEmpty(this.props.sequenceList)) {
        return (
          <StyleProvider style={getTheme(platform)}>
            <Container>
              {modalDialogView}
              {headerView}
              <View style={[styles.flex1, styles.bgWhite]}>

                <SortableListView
                  style={{
                    flex: 1
                  }}
                  data={this.renderList()}
                  onRowMoved={rowParam => {
                    this.onRowMoved(rowParam)
                  }}

                  activeOpacity={1}
                  sortRowStyle={{
                    backgroundColor: '#000000',
                    borderWidth: 1,
                    borderColor: '#f4f4f4',
                    elevation: 2,
                    shadowOffset: { width: 3, height: 4, },
                    shadowColor: '#d3d3d3',
                    shadowOpacity: .5,

                  }}
                  renderRow={row => <JobListItem data={row} callingActivity='Sequence' onPressItem={() => this.setModalView(row)} />} />
              </View>
              <Footer style={{
                height: 'auto'
              }}>
                <FooterTab style={StyleSheet.flatten([styles.padding10])}>
                  {buttonView}
                </FooterTab>
              </Footer>
            </Container>
          </StyleProvider>

        )
      }
      else {
        return (
          <StyleProvider style={getTheme(platform)}>
            <Container>
              {headerView}
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <Text style={[styles.margin30, styles.fontDefault, styles.fontDarkGray]}>{JOB_NOT_PRESENT}</Text>
              </View>
            </Container>
          </StyleProvider>
        )
      }
    }

  }

  showAlert = () => {
    Alert.alert(
      ROUTE_OPTIMIZATION,
      `This will run route optimization for ${_.size(this.props.sequenceList)} job transactions`,
      [
        { text: CANCEL, style: 'cancel' },
        { text: OK, onPress: this.OnOkButtonPressed },
      ],
    )
  }

  showToast() {
    Toast.show({
      text: (this.props.responseMessage.message) ? this.props.responseMessage.message  : this.props.responseMessage ,
      duration: (this.props.responseMessage.message) ? Number.MAX_SAFE_INTEGER : 5000,
      position: 'bottom',
      buttonText: OK,
    })
    this.props.actions.setState(SET_RESPONSE_MESSAGE, '')
  }

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
});


export default connect(mapStateToProps, mapDispatchToProps)(Sequence)
