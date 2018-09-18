'use strict'
import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, Platform, FlatList, KeyboardAvoidingView, BackHandler } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Container, Button, Toast, Footer, FooterTab, StyleProvider } from 'native-base'
import styles from '../themes/FeStyle'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import * as formLayoutActions from '../modules/form-layout/formLayoutActions.js'
import * as globalActions from '../modules/global/globalActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import BasicFormElement from '../components/FormLayoutBasicComponent.js'
import Loader from '../components/Loader'
import { NET_BANKING, NET_BANKING_LINK, NET_BANKING_CARD_LINK, NET_BANKING_UPI_LINK, UPI, MOSAMBEE_WALLET, MOSAMBEE } from '../lib/AttributeConstants'
import { SET_UPDATE_DRAFT, ERROR_MESSAGE, SET_FORM_TO_INVALID, SET_FORM_LAYOUT_STATE, JobDetailsV2 } from '../lib/constants'
import CustomAlert from "../components/CustomAlert"
import { ALERT, INVALID_FORM_ALERT, OK } from '../lib/ContainerConstants'
import TitleHeader from '../components/TitleHeader'
import { navigate, navDispatch } from '../modules/navigators/NavigationService'
import isEmpty from 'lodash/isEmpty'


function mapStateToProps(state) {
  return {
    formElement: state.formLayout.formElement,
    isSaveDisabled: state.formLayout.isSaveDisabled,
    statusName: state.formLayout.statusName,
    statusId: state.formLayout.statusId,
    latestPositionId: state.formLayout.latestPositionId,
    paymentAtEnd: state.formLayout.paymentAtEnd,
    isLoading: state.formLayout.isLoading,
    errorMessage: state.formLayout.errorMessage,
    updateDraft: state.formLayout.updateDraft,
    isFormValid: state.formLayout.isFormValid,
    sequenceWiseFieldAttributeMasterIds: state.formLayout.sequenceWiseFieldAttributeMasterIds,
    dataStoreFilterReverseMap: state.formLayout.dataStoreFilterReverseMap,
    fieldAttributeMasterParentIdMap: state.formLayout.fieldAttributeMasterParentIdMap,
    noFieldAttributeMappedWithStatus: state.formLayout.noFieldAttributeMappedWithStatus,
    arrayReverseDataStoreFilterMap: state.formLayout.arrayReverseDataStoreFilterMap,
    jobAndFieldAttributesList: state.formLayout.jobAndFieldAttributesList,
    updatedTransactionListIds: state.listing.updatedTransactionListIds
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...formLayoutActions, ...globalActions }, dispatch)
  }
}

class FormLayout extends PureComponent {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = ({ navigation, props }) => {
    return { header: null }
  }

  constructor(props) {
    super(props);
    this.state = {
      updatingData: null
    }
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  componentDidUpdate() {
    if (this.props.errorMessage && this.props.errorMessage != '') {
      Toast.show({
        text: this.props.errorMessage,
        position: "bottom",
        buttonText: OK,
        type: 'danger',
        duration: 10000
      })
      this.props.actions.setState(ERROR_MESSAGE, '')
    }
    let transactionList = this.props.navigation.state.params.jobTransaction && !isEmpty(this.props.updatedTransactionListIds) && !isEmpty(this.props.updatedTransactionListIds[this.props.navigation.state.params.jobMasterId]) ? this.props.jobTransaction.id ? [this.props.navigation.state.params.jobTransaction] : this.props.navigation.state.params.jobTransaction : null
    if (transactionList && this.checkForUpdatedTransactionList(transactionList, this.props.updatedTransactionListIds[this.props.navigation.state.params.jobMasterId])) {
      this.setState({ updatingData: this.props.updatedTransactionListIds[this.props.navigation.state.params.jobMasterId] })
    }
  }

  checkForUpdatedTransactionList(transactionList, updatedTransactionListIds) {
    for (let item in transactionList) {
      if (updatedTransactionListIds[transactionList[item].jobId]) {
        return true
      }
    }
    return false
  }

  headerView() {
    if (!this.state.updatingData) {
      return <TitleHeader pageName={this.props.navigation.state.params.statusName} goBack={this.props.navigation.state.params.backForTransient} />
    }
  }

  deletedTransactionView() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container style={[styles.bgWhite]}>
          <View style={[styles.justifyCenter, styles.alignCenter, styles.column, styles.flex1]}>
            <Text style={[{ paddingLeft: 70, paddingRight: 72 }, styles.fontCenter, styles.fontDarkGray, styles.marginTop10]}>Some changes were made from the server. Please go to the details page and start again.</Text>
            <View style={[{ width: 100, marginTop: 50 }, styles.alignCenter, styles.justifyCenter]}>
              <Button success
                onPress={() => this.resetBackToUpdatedView()}>
                <Text style={[styles.fontLg, styles.fontWhite]}>Refresh</Text>
              </Button>
            </View>
          </View>

        </Container>
      </StyleProvider>
    )
  }

  resetBackToUpdatedView() {
    this.props.actions.deleteDraftForTransactions(this.props.navigation.state.params.jobTransaction, this.state.updatingData)
    this.setState({ updatingData: null })
    this.props.navigation.goBack(null)
  }

  componentDidMount() {
    this.props.navigation.setParams({ backForTransient: this._goBack });
    if (!this.props.navigation.state.params.isDraftRestore) {
      let { statusId, statusName } = this.props.navigation.state.params
      const statusData = { statusId, statusName }
      this.props.actions.restoreDraftOrRedirectToFormLayout(this.props.navigation.state.params.editableFormLayoutState, this.props.navigation.state.params.jobTransaction, this.props.navigation.state.params.latestPositionId, statusData, this.props.navigation.state.params.navigationFormLayoutStates)
      if (this.props.navigation.state.params.jobTransaction.length || this.props.navigation.state.params.editableFormLayoutState || this.props.navigation.state.params.saveActivatedStatusData) { //Draft should not be saved for bulk and save activated edit and checkout state
        this.props.actions.setState(SET_UPDATE_DRAFT, false)
      }
    }

    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
    if (this.props.navigation.state.params.saveActivatedParcelCount) {
      this.props.navigation.setParams({ statusName: this.props.navigation.state.params.statusName + '(' + this.props.navigation.state.params.saveActivatedParcelCount + ')' });
    }
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this._goBack();
    return true;
  };

  _goBack = () => {
    //Set previous status form layout state in case of transient single status
    if (this.props.navigation.state.params.navigationFormLayoutStates && this.props.navigation.state.params.previousStatus) {
      this.props.actions.setState(SET_FORM_LAYOUT_STATE, {
        editableFormLayoutState: this.props.navigation.state.params.navigationFormLayoutStates[this.props.navigation.state.params.previousStatus.id],
        statusName: this.props.navigation.state.params.previousStatus.name
      })
    }
    this.props.navigation.pop(1)
  }
  renderData = (item) => {
    let formLayoutState = {
      formElement: this.props.formElement,
      isSaveDisabled: this.props.isSaveDisabled,
      statusName: this.props.statusName,
      jobTransactionId: this.props.navigation.state.params.jobTransaction.id,
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
      jobAndFieldAttributesList: this.props.jobAndFieldAttributesList,
      sequenceWiseFieldAttributeMasterIds: this.props.sequenceWiseFieldAttributeMasterIds,
      transientFormLayoutState: this.props.navigation.state.params.navigationFormLayoutStates
    }
    return (
      <BasicFormElement
        item={item.item}
        jobTransaction={this.props.navigation.state.params.jobTransaction}
        jobStatusId={this.props.navigation.state.params.statusId}
        formLayoutState={formLayoutState}
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
      case MOSAMBEE.id: return 'MosambeePayment'
    }

    return null
  }

  saveJobTransaction() {
    let formLayoutState = {
      formElement: this.props.formElement,
      isSaveDisabled: this.props.isSaveDisabled,
      statusName: this.props.statusName,
      jobTransactionId: this.props.navigation.state.params.jobTransaction.id,
      statusId: this.props.statusId,
      latestPositionId: this.props.latestPositionId,
      paymentAtEnd: this.props.paymentAtEnd,
      isLoading: this.props.isLoading,
      errorMessage: this.props.errorMessage,
      currentElement: this.props.currentElement,
      fieldAttributeMasterParentIdMap: this.props.fieldAttributeMasterParentIdMap,
      noFieldAttributeMappedWithStatus: this.props.noFieldAttributeMappedWithStatus,
      jobAndFieldAttributesList: this.props.jobAndFieldAttributesList,
      sequenceWiseFieldAttributeMasterIds: this.props.sequenceWiseFieldAttributeMasterIds,
      dataStoreFilterReverseMap: this.props.dataStoreFilterReverseMap,
      transientFormLayoutState: this.props.navigation.state.params.navigationFormLayoutStates
    }

    let taskListScreenDetails = {
      jobDetailsScreenKey: this.props.navigation.state.params.jobDetailsScreenKey,
      pageObjectAdditionalParams: this.props.navigation.state.params.pageObjectAdditionalParams
    }
    if (this.props.paymentAtEnd && this.props.paymentAtEnd.isCardPayment) {
      navigate(this.paymentSceneFromModeTypeId(this.props.paymentAtEnd.modeTypeId),
        {
          contactData: this.props.navigation.state.params.contactData,
          formElement: this.props.formElement,
          jobTransaction: this.props.navigation.state.params.jobTransaction,
          paymentAtEnd: this.props.paymentAtEnd,
          formLayoutState,
          jobMasterId: this.props.navigation.state.params.jobMasterId,
          navigationFormLayoutStates: this.props.navigation.state.params.navigationFormLayoutStates,
          saveActivatedStatusData: this.props.navigation.state.params.saveActivatedStatusData,
          taskListScreenDetails
        },
      )
    } else {
      this.props.actions.saveJobTransaction(
        formLayoutState,
        this.props.navigation.state.params.jobMasterId,
        this.props.navigation.state.params.contactData,
        this.props.navigation.state.params.jobTransaction,
        this.props.navigation.state.params.navigationFormLayoutStates,
        this.props.navigation.state.params.saveActivatedStatusData,
        taskListScreenDetails,
      )
    }
  }

  _keyExtractor = (item, index) => String(item.key);

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

  getFooterView(transient, saveActivated) {
    return (
      <SafeAreaView style={[styles.bgWhite]}>
        <Footer style={[style.footer]}>
          <FooterTab style={[styles.padding10]}>
            <Button success full
              onPress={() => this.saveJobTransaction()}
              disabled={this.props.isSaveDisabled}>
              <Text style={[styles.fontLg, styles.fontWhite]}>{!isEmpty(this.props.paymentAtEnd) ? (this.props.paymentAtEnd.isCardPayment ? 'Proceed To Payment' : (saveActivated || transient) ? 'Continue' : this.props.statusName) : (saveActivated || transient) ? 'Continue' : this.props.statusName}</Text>
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
        <View style={[{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }]}>
          <Text style={[styles.margin30, styles.fontDefault, styles.fontDarkGray]}> No visible attribute mapped</Text>
        </View>
      )
    }
  }

  _renderFormData() {
    let formData = []
    for (let id in this.props.sequenceWiseFieldAttributeMasterIds) {
      formData.push(this.props.formElement[this.props.sequenceWiseFieldAttributeMasterIds[id]])
    }
    return formData
  }

  renderFormLayoutView() {
    return (
      <View style={[styles.flex1, styles.bgWhite]}>
        <View style={[styles.paddingTop10, styles.paddingBottom10]}>
          <FlatList
            data={this._renderFormData()}
            extraData={this.state}
            renderItem={(item) => this.renderData(item)} //item[1] contains the formLayoutObject as Array.from on map makes it array with 0 index containing key and 1st index containing object
            keyExtractor={this._keyExtractor}>
          </FlatList>
        </View>
      </View>
    )
  }

  render() {
    const { saveActivated, transient } = this.props.navigation.state.params
    const invalidFormAlert = (!this.props.isFormValid) ? this.showInvalidFormAlert() : null
    let emptyFieldAttributeForStatusView = this.emptyFieldAttributeForStatusView()
    const footerView = this.getFooterView(transient, saveActivated)
    let formView = null
    if (this.props.isLoading) { return <Loader /> }
    if (this.state.updatingData) { return this.deletedTransactionView() }
    if (this.props.formElement && this.props.formElement.length == 0) {
      <SafeAreaView style={[styles.bgWhite]}>
        {this.headerView()}
        <Footer style={[style.footer]}>
          <FooterTab style={[styles.padding10]}>
            <Button success full
              onPress={() => this.saveJobTransaction(this.props.formElement, this.props.jobTransaction.id, this.props.statusId)}
              disabled={this.props.isSaveDisabled}>
              <Text style={[styles.fontLg, styles.fontWhite]}>{(this.props.paymentAtEnd.isCardPayment ? 'Proceed To Payment' : (saveActivated || transient) ? 'Continue' : this.props.statusName)}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </SafeAreaView>
    }
    if (Platform.OS == 'ios') {
      formView = <KeyboardAvoidingView style={[{ flex: 1 }, styles.bgWhite]} behavior="padding">
        {this.headerView()}
        {invalidFormAlert}
        {emptyFieldAttributeForStatusView}
        {this.renderFormLayoutView()}
        {footerView}
      </KeyboardAvoidingView >
    } else {
      formView = <Container>
        {this.headerView()}
        {invalidFormAlert}
        {emptyFieldAttributeForStatusView}
        {this.renderFormLayoutView()}
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
