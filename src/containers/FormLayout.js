'use strict'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, Platform, FlatList, TouchableOpacity, KeyboardAvoidingView, SafeAreaView } from 'react-native'
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
import { NET_BANKING, NET_BANKING_LINK, NET_BANKING_CARD_LINK, NET_BANKING_UPI_LINK, UPI, MOSAMBEE_WALLET } from '../lib/AttributeConstants'
import { SET_UPDATE_DRAFT, ERROR_MESSAGE, SET_FORM_TO_INVALID, RESET_STATE_FOR_WALLET, SET_NO_FIELD_ATTRIBUTE_MAPPED } from '../lib/constants'
import CustomAlert from "../components/CustomAlert"
import { ALERT, INVALID_FORM_ALERT, OK } from '../lib/ContainerConstants'
import TitleHeader from '../components/TitleHeader'

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
    updateDraft: state.formLayout.updateDraft,
    isFormValid: state.formLayout.isFormValid,
    dataStoreFilterReverseMap: state.formLayout.dataStoreFilterReverseMap,
    fieldAttributeMasterParentIdMap: state.formLayout.fieldAttributeMasterParentIdMap,
    noFieldAttributeMappedWithStatus: state.formLayout.noFieldAttributeMappedWithStatus,
    arrayReverseDataStoreFilterMap: state.formLayout.arrayReverseDataStoreFilterMap,
    jobAndFieldAttributesList: state.formLayout.jobAndFieldAttributesList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...formLayoutActions, ...globalActions }, dispatch)
  }
}

class FormLayout extends PureComponent {

  static navigationOptions = ({ navigation, props }) => {
    return { header: <TitleHeader pageName={navigation.state.params.statusName} goBack={navigation.goBack} /> }
  }

  componentDidUpdate() {
    if (this.props.errorMessage && this.props.errorMessage != '') {
      Toast.show({
        text: this.props.errorMessage,
        position: "bottom" | "center",
        buttonText: OK,
        type: 'danger',
        duration: 10000
      })
      this.props.actions.setState(ERROR_MESSAGE, '')
    }
  }

  componentWillUnmount() {
    if (this.props.noFieldAttributeMappedWithStatus) {
      this.props.actions.setState(SET_NO_FIELD_ATTRIBUTE_MAPPED, false)
    }
  }

  componentDidMount() {
    if (!this.props.navigation.state.params.isDraftRestore) {
      this.props.actions.restoreDraftOrRedirectToFormLayout(this.props.navigation.state.params.editableFormLayoutState, this.props.navigation.state.params.isDraftRestore, this.props.navigation.state.params.statusId, this.props.navigation.state.params.statusName, this.props.navigation.state.params.jobTransactionId, this.props.navigation.state.params.jobMasterId, this.props.navigation.state.params.jobTransaction, this.props.navigation.state.params.latestPositionId)
      if (this.props.navigation.state.params.jobTransaction.length || this.props.navigation.state.params.editableFormLayoutState || this.props.navigation.state.params.saveActivatedStatusData) { //Draft should not be saved for bulk and save activated edit and checkout state
        this.props.actions.setState(SET_UPDATE_DRAFT, false)
      }
    }
  }

  renderData = (item) => {
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
      dataStoreFilterReverseMap: this.props.dataStoreFilterReverseMap,
      fieldAttributeMasterParentIdMap: this.props.fieldAttributeMasterParentIdMap,
      updateDraft: this.props.updateDraft,
      arrayReverseDataStoreFilterMap: this.props.arrayReverseDataStoreFilterMap,
      jobMasterId: this.props.navigation.state.params.jobMasterId,
      jobAndFieldAttributesList: this.props.jobAndFieldAttributesList
    }
    return (
      <BasicFormElement
        item={item}
        jobTransaction={this.props.navigation.state.params.jobTransaction}
        jobStatusId={this.props.navigation.state.params.statusId}
        formLayoutState={formLayoutState}
        navigate = {this.props.navigation.navigate}
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
      case MOSAMBEE_WALLET.id: return 'MosamBeeWalletPayment'
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
      fieldAttributeMasterParentIdMap: this.props.fieldAttributeMasterParentIdMap
    }

    let taskListScreenDetails = {
      jobDetailsScreenKey: this.props.navigation.state.params.jobDetailsScreenKey,
      pageObjectAdditionalParams: this.props.navigation.state.params.pageObjectAdditionalParams
    }

    if (this.props.paymentAtEnd && this.props.paymentAtEnd.isCardPayment) {
      this.props.actions.navigateToScene(this.paymentSceneFromModeTypeId(this.props.paymentAtEnd.modeTypeId),
        {
          contactData: this.props.navigation.state.params.contactData,
          formElement: this.props.formElement,
          jobTransaction: this.props.navigation.state.params.jobTransaction,
          paymentAtEnd: this.props.paymentAtEnd,
          formLayoutState,
          jobMasterId: this.props.navigation.state.params.jobMasterId,
          navigationFormLayoutStates: this.props.navigation.state.params.navigationFormLayoutStates,
          saveActivatedStatusData: this.props.navigation.state.params.saveActivatedStatusData,
          pieChart: this.props.pieChart,
          taskListScreenDetails
        },
      this.props.navigation.navigate)
    } else {
      this.props.actions.saveJobTransaction(
        formLayoutState,
        this.props.navigation.state.params.jobMasterId,
        this.props.navigation.state.params.contactData,
        this.props.navigation.state.params.jobTransaction,
        this.props.navigation.state.params.navigationFormLayoutStates,
        this.props.navigation.state.params.saveActivatedStatusData,
        this.props.pieChart,
        taskListScreenDetails,
        this.props.navigation.navigate,
        this.props.navigation.goBack
      )
    }
  }

  _keyExtractor = (item, index) => String(item[1].key);

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

  getFooterView() {
    return (
      <SafeAreaView>
        <Footer style={[style.footer]}>
          <FooterTab style={[styles.padding10]}>
            <Button success full
              onPress={() => this.saveJobTransaction()}
              disabled={this.props.isSaveDisabled}>
              <Text style={[styles.fontLg, styles.fontWhite]}>{!_.isEmpty(this.props.paymentAtEnd) ? this.props.paymentAtEnd.isCardPayment ? 'Proceed To Payment' : this.props.statusName : this.props.statusName}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </SafeAreaView>
    )
  }

  /**
   * When a status doesn't have any visible attribute mapped then show this view
   */
  emptyFieldAttributeForStatusView() {
    if (this.props.noFieldAttributeMappedWithStatus) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <Text style={[styles.margin30, styles.fontDefault, styles.fontDarkGray]}> No visible attribute mapped</Text>
        </View>
      )
    }
  }

  render() {
    const invalidFormAlert = (!this.props.isFormValid) ? this.showInvalidFormAlert() : null
    let emptyFieldAttributeForStatusView = this.emptyFieldAttributeForStatusView()
    let formView = null
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
    const footerView = this.getFooterView()
    if (Platform.OS == 'ios') {
      formView = <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        {invalidFormAlert}
        {emptyFieldAttributeForStatusView}
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
        {footerView}
      </KeyboardAvoidingView >
    } else {
      formView = <Container>
        {invalidFormAlert}
        {emptyFieldAttributeForStatusView}
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
        {footerView}
      </Container >
    }
    return (
      <StyleProvider style={getTheme(platform)}>
        {formView}
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
