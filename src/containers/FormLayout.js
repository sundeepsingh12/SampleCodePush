'use strict'
import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView
}
  from 'react-native'
import { Container, Content, Card, Button, Body, Header, Right, Icon, Toast, Footer, FooterTab, StyleProvider } from 'native-base'
import styles from '../themes/FeStyle'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform';
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import BasicFormElement from '../components/FormLayoutBasicComponent.js'
import Loader from '../components/Loader'
import renderIf from '../lib/renderIf.js'
import {
  NET_BANKING,
  NET_BANKING_LINK,
  NET_BANKING_CARD_LINK,
  NET_BANKING_UPI_LINK,
  UPI,
} from '../lib/AttributeConstants'

import {
  SET_FORM_LAYOUT_STATE,
  SET_DRAFT,
  SET_UPDATE_DRAFT,
  ERROR_MESSAGE,
  SET_FORM_TO_INVALID
} from '../lib/constants'
import CustomAlert from "../components/CustomAlert"
import {
  ALERT,
  INVALID_FORM_ALERT
} from '../lib/ContainerConstants'

function mapStateToProps(state) {
  return {
    formElement: state.formLayout.formElement,
    isSaveDisabled: state.formLayout.isSaveDisabled,
    statusName: state.formLayout.statusName,
    jobTransactionId: state.formLayout.jobTransactionId,
    statusId: state.formLayout.statusId,
    latestPositionId: state.formLayout.latestPositionId,
    paymentAtEnd: state.formLayout.paymentAtEnd,
    isLoading: state.formLayout.isLoading,
    errorMessage: state.formLayout.errorMessage,
    currentElement: state.formLayout.currentElement,
    pieChart: state.home.pieChart,
    draftStatusId: state.formLayout.draftStatusId,
    updateDraft: state.formLayout.updateDraft,
    isFormValid: state.formLayout.isFormValid
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...formLayoutActions, ...globalActions }, dispatch)
  }
}

class FormLayout extends PureComponent {
  componentDidUpdate() {
    if (this.props.updateDraft && !this.props.navigation.state.params.jobTransaction.length) { //Draft should not be saved for bulk
      this.saveDraft()
      this.props.actions.setState(SET_UPDATE_DRAFT, false)
    }
    if (this.props.errorMessage && this.props.errorMessage != '') {
      Toast.show({
        text: this.props.errorMessage,
        position: "bottom" | "center",
        buttonText: 'Okay',
        type: 'danger',
        duration: 10000
      })
      this.props.actions.setState(ERROR_MESSAGE, '')
    }
  }

  saveDraft = () => {
    if (this.props.jobTransactionId != 0) {
      let formLayoutState = {
        formElement: this.props.formElement,
        isSaveDisabled: this.props.isSaveDisabled,
        statusName: this.props.statusName,
        jobTransactionId: this.props.jobTransactionId,
        statusId: this.props.statusId,
        latestPositionId: this.props.latestPositionId,
        paymentAtEnd: this.props.paymentAtEnd,
        isLoading: this.props.isLoading,
        errorMessage: this.props.errorMessage,
        currentElement: this.props.currentElement,
      }
      this.props.actions.saveDraftInDb(formLayoutState, this.props.navigation.state.params.jobMasterId)
    }
  }
  showDraftAlert() {
    let draftMessage = 'Do you want to restore draft for ' + this.props.statusName + '?'
    let view =
      <CustomAlert
        title="Draft"
        message={draftMessage}
        onOkPressed={() => this._goToFormLayoutWithDraft()}
        onCancelPressed={() => this._onCancel()} />
    return view
  }
  _onCancel = () => {
    this.props.actions.setState(SET_DRAFT, null)
  }
  _goToFormLayoutWithDraft = () => {
    this.props.actions.setState(SET_DRAFT, null)
    this.props.actions.restoreDraft(this.props.jobTransactionId, this.props.statusId, this.props.navigation.state.params.jobMasterId)
  }
  componentDidMount() {
    this.props.actions.restoreDraftOrRedirectToFormLayout(this.props.navigation.state.params.editableFormLayoutState, this.props.navigation.state.params.isDraftRestore, this.props.navigation.state.params.statusId, this.props.navigation.state.params.statusName, this.props.navigation.state.params.jobTransactionId, this.props.navigation.state.params.jobMasterId, this.props.navigation.state.params.jobTransaction)
  }

  renderData = (item) => {
    return (
      <BasicFormElement
        item={item}
        formElement={this.props.formElement}
        isSaveDisabled={this.props.isSaveDisabled}
        jobTransaction={this.props.navigation.state.params.jobTransaction}
        jobStatusId={this.props.navigation.state.params.statusId}
        latestPositionId={this.props.latestPositionId}
      />
    )
  }

  paymentSceneFromModeTypeId(modeTypeId) {
    if (!modeTypeId) {
      return null
    }
    switch (modeTypeId) {
      case NET_BANKING.id:
      case NET_BANKING_LINK.id:
      case NET_BANKING_CARD_LINK.id:
      case NET_BANKING_UPI_LINK.id: return 'PayByLink'
      case UPI.id: return 'UPIPayment'
    }

    return null
  }



  saveJobTransaction() {
    let formLayoutState = {
      formElement: this.props.formElement,
      nextEditable: this.props.nextEditable,
      isSaveDisabled: this.props.isSaveDisabled,
      statusName: this.props.statusName,
      jobTransactionId: this.props.jobTransactionId,
      statusId: this.props.statusId,
      latestPositionId: this.props.latestPositionId,
      paymentAtEnd: this.props.paymentAtEnd,
      isLoading: this.props.isLoading,
      errorMessage: this.props.errorMessage,
      currentElement: this.props.currentElement,
    }
    if (this.props.paymentAtEnd && this.props.paymentAtEnd.isCardPayment) {
      this.props.actions.navigateToScene(this.paymentSceneFromModeTypeId(this.props.paymentAtEnd.modeTypeId),
        {
          contactData: this.props.navigation.state.params.contactData,
          formElement: this.props.formElement,
          jobTransaction: this.props.navigation.state.params.jobTransaction,
          paymentAtEnd: this.props.paymentAtEnd,
        })
    } else {
      this.props.actions.saveJobTransaction(
        formLayoutState,
        this.props.navigation.state.params.jobMasterId,
        this.props.navigation.state.params.contactData,
        this.props.navigation.state.params.jobTransaction,
        this.props.navigation.state.params.navigationFormLayoutStates,
        this.props.navigation.state.params.saveActivatedStatusData,
        this.props.pieChart
      )
    }
  }

  _keyExtractor = (item, index) => item[1].key;

  showInvalidFormAlert() {
    let draftMessage = INVALID_FORM_ALERT
    let view =
      <CustomAlert
        title={ALERT}
        message={draftMessage}
        onOkPressed={() => this.props.actions.setState(SET_FORM_TO_INVALID, {
          isLoading: false,
          isFormValid: true
        })}
      />
    return view
  }

  render() {
    const draftAlert = (this.props.draftStatusId) ? this.showDraftAlert() : null
    const invalidFormAlert = (!this.props.isFormValid) ? this.showInvalidFormAlert() : null
    if (this.props.isLoading) { return <Loader /> }
    if (this.props.formElement && this.props.formElement.length == 0) {
      <Footer style={[style.footer]}>
        <FooterTab style={[styles.padding10]}>
          <Button success full
            onPress={() => this.saveJobTransaction(this.props.formElement, this.props.jobTransactionId, this.props.statusId)}
            disabled={this.props.isSaveDisabled}>
            <Text style={[styles.fontLg, styles.fontWhite]}>{this.props.paymentAtEnd ? this.props.paymentAtEnd.isCardPayment ? 'Proceed To Payment' : this.props.statusName : this.props.statusName}</Text>
          </Button>
        </FooterTab>
      </Footer>
    }
    return (
      <StyleProvider style={getTheme(platform)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
          {draftAlert}
          {invalidFormAlert}
          <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.statusName}</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View />
              </View>
            </Body>
          </Header>

          <View style={[styles.flex1, styles.bgWhite]}>
            <View style={[styles.paddingTop10, styles.paddingBottom10]}>
              <FlatList
                data={Array.from(this.props.formElement)}
                extraData={this.state}
                renderItem={(item) => this.renderData(item.item[1])} //item[1] contains the formLayoutObject as Array.from on map makes it array with 0 index containing key and 1st index containing object
                keyExtractor={this._keyExtractor}>
              </FlatList>
            </View>
          </View>


          <Footer style={[style.footer]}>
            <FooterTab style={[styles.padding10]}>
              <Button success full
                onPress={() => this.saveJobTransaction()}
                disabled={this.props.isSaveDisabled}>
                <Text style={[styles.fontLg, styles.fontWhite]}>{this.props.paymentAtEnd ? this.props.paymentAtEnd.isCardPayment ? 'Proceed To Payment' : this.props.statusName : this.props.statusName}</Text>
              </Button>
            </FooterTab>
          </Footer>
        </KeyboardAvoidingView >
      </StyleProvider >
    )
  }
}

const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    padding: 0,
    paddingRight: 0,
    paddingLeft: 0
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
  footer: {
    height: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f3f3f3'
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FormLayout)
