'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as bulkActions from '../modules/bulk/bulkActions'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'
import React, { PureComponent } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Container, Header, Button, Text, Body, Icon, Footer, StyleProvider, ActionSheet, Toast } from 'native-base'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import JobListItem from '../components/JobListItem'
import _ from 'lodash'
import { NEXT_POSSIBLE_STATUS, FILTER_REF_NO, OK, CANCEL, UPDATE_ALL_SELECTED, NO_JOBS_PRESENT, TOTAL_COUNT } from '../lib/ContainerConstants'
import { FormLayout, SET_BULK_SEARCH_TEXT, SET_BULK_ERROR_MESSAGE, QrCodeScanner, SET_BULK_TRANSACTION_PARAMETERS, SET_BULK_PARAMS_FOR_SELECTED_DATA, SET_BULK_CHECK_ALERT_VIEW } from '../lib/constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'
import { navigate } from '../modules/navigators/NavigationService';
import BulkUnselectJobAlert from '../components/BulkUnselectJobAlert'
import { fetchJobs } from '../modules/taskList/taskListActions'
function mapStateToProps(state) {
  return {
    jobTransactionCustomizationList: state.listing.jobTransactionCustomizationList,
    isLoaderRunning: state.bulk.isLoaderRunning,
    selectedItems: state.bulk.selectedItems,
    selectAllNone: state.bulk.selectAllNone,
    isSelectAllVisible: state.bulk.isSelectAllVisible,
    searchText: state.bulk.searchText,
    wantUnselectJob: state.bulk.wantUnselectJob,
    isManualSelectionAllowed: state.bulk.isManualSelectionAllowed,
    searchSelectionOnLine1Line2: state.bulk.searchSelectionOnLine1Line2,
    idToSeparatorMap: state.bulk.idToSeparatorMap,
    errorToastMessage: state.bulk.errorToastMessage,
    nextStatusList: state.bulk.nextStatusList,
    checkAlertView: state.bulk.checkAlertView,
    updatedTransactionListIds: state.listing.updatedTransactionListIds
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...bulkActions, ...globalActions, fetchJobs }, dispatch)
  }
}

class BulkListing extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }

  renderData = (item, bulkTransactionLength, selectedTransactionLength) => {
    if (_.isEmpty(item.jobExpiryData.value) || moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isBefore(item.jobExpiryData.value)) {
      return (
        <JobListItem data={item}
          onPressItem={() => this.onClickRowItem(item, bulkTransactionLength, selectedTransactionLength)}
        />
      )
    }

  }


  onClickRowItem(item, bulkTransactionLength, selectedTransactionLength) {
    if (this.props.isManualSelectionAllowed && !this.props.selectedItems[item.jobId].disabled) {
      if (!this.props.selectedItems[item.jobId].isChecked || this.props.checkAlertView) {
        this.props.actions.toggleMultipleTransactions([item], this.props.selectedItems, selectedTransactionLength, this.props.navigation.state.params.pageObject, this.props.checkAlertView, bulkTransactionLength)
      } else {
        this.props.actions.setState(SET_BULK_PARAMS_FOR_SELECTED_DATA, item)
      }
    }
  }

  selectAll = (bulkTransactionLength) => {
    this.props.actions.toggleAllItems(this.props.selectedItems, this.props.selectAllNone, this.props.navigation.state.params.pageObject, this.props.searchText, bulkTransactionLength)
  }

  componentDidMount() {
    this.props.actions.getBulkJobTransactions(this.props.navigation.state.params, this.props.jobTransactionCustomizationList, this.props.updatedTransactionListIds)
  }

  componentDidUpdate() {
    let pageObject = JSON.parse(JSON.stringify(this.props.navigation.state.params.pageObject))
    pageObject.additionalParams = JSON.parse(pageObject.additionalParams)
    pageObject.jobMasterIds = JSON.parse(pageObject.jobMasterIds)
    if (!this.props.isLoaderRunning && !_.isEmpty(this.props.updatedTransactionListIds) && this.checkForJobMasterIdsOfUpdatedJobs(this.props.updatedTransactionListIds, pageObject.additionalParams.statusId, pageObject.jobMasterIds[0])) {
      this.props.actions.getBulkUpdatedJobTransactions(Object.values(this.props.updatedTransactionListIds), this.props.jobTransactionCustomizationList, pageObject)
    }
    if (this.props.errorToastMessage && this.props.errorToastMessage != '') {
      Toast.show({
        text: this.props.errorToastMessage,
        position: 'bottom',
        buttonText: OK,
        duration: 5000
      })
      this.props.actions.setState(SET_BULK_ERROR_MESSAGE, '')
    }
  }

  checkForJobMasterIdsOfUpdatedJobs(updatedTransactionListIds, statusId, jobMasterId) {
    let updatedJobMasterStatusIdsList = updatedTransactionListIds[jobMasterId] ? Object.values(updatedTransactionListIds[jobMasterId]) : {}
    for (let item in updatedJobMasterStatusIdsList) {
      if (updatedJobMasterStatusIdsList[item].jobStatusId == statusId) {
        return true
      }
    }
    return false
  }


  _setQrValue = (selectedTransactionLength, value) => {
    if (value && value != '')
      this.props.actions.setSearchedItem(value, this.props.selectedItems, this.props.searchSelectionOnLine1Line2, this.props.idToSeparatorMap, selectedTransactionLength, this.props.navigation.state.params.pageObject, this.props.checkAlertView)
  }

  searchBarView(selectedTransactionLength) {
    return (
      <View style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.paddingLeft10, styles.paddingRight10]}>
        <View style={[styles.relative, { width: '85%', height: 30 }]}>
          <TextInput
            placeholder={FILTER_REF_NO}
            placeholderTextColor={'rgba(255,255,255,.6)'}
            selectionColor={'rgba(224, 224, 224,.5)'}
            style={[styles.headerSearch]}
            returnKeyType={"search"}
            keyboardAppearance={"dark"}
            underlineColorAndroid={'transparent'}
            onChangeText={(searchText) => {
              this.props.actions.setState(SET_BULK_SEARCH_TEXT, searchText)
            }}
            onSubmitEditing={() => {
              if (this.props.searchText && this.props.searchText != '')
                this.props.actions.setSearchedItem(this.props.searchText, this.props.selectedItems, this.props.searchSelectionOnLine1Line2, this.props.idToSeparatorMap, selectedTransactionLength, this.props.navigation.state.params.pageObject, this.props.checkAlertView)
            }}
            value={this.props.searchText} />
          <Button small transparent style={[styles.inputInnerBtn]} onPress={() => {
            if (this.props.searchText && this.props.searchText != '')
              this.props.actions.setSearchedItem(this.props.searchText, this.props.selectedItems, this.props.searchSelectionOnLine1Line2, this.props.idToSeparatorMap, selectedTransactionLength, this.props.navigation.state.params.pageObject, this.props.checkAlertView)
          }}>
            <Icon name="md-search" style={[styles.fontWhite, styles.fontXl]} />
          </Button>
        </View>
        <TouchableOpacity style={[{ width: '15%' }, styles.marginLeft15]} onPress={() => {
          this.props.navigation.navigate(QrCodeScanner, { returnData: this._setQrValue.bind(this, selectedTransactionLength) })
        }} >
          <MaterialCommunityIcons name='qrcode' style={[styles.fontXxl, styles.padding5]} color={styles.fontWhite.color} />
        </TouchableOpacity>
      </View>
    )
  }

  renderList() {
    let searchText = this.props.searchText
    let selectedTransactionLength = 0
    let jobTransactionArray = [], bulkTransactions = this.props.selectedItems
    // Function for filtering on basis of reference number, runsheet number, line1, line2, circleline1, circleline2
    for (let item in bulkTransactions) {
      let values = [bulkTransactions[item].runsheetNo, bulkTransactions[item].referenceNumber, bulkTransactions[item].line1, bulkTransactions[item].line2, bulkTransactions[item].circleLine1, bulkTransactions[item].circleLine2]
      if (bulkTransactions[item].isChecked && !bulkTransactions[item].disabled) {
        selectedTransactionLength++
      }
      if ((_.isEmpty(searchText))) {
        jobTransactionArray.push(bulkTransactions[item])
      } else if (_.some(values, (data) => _.includes(_.toLower(data), _.toLower(searchText)))) {
        jobTransactionArray.push(bulkTransactions[item])
      }
    }
    jobTransactionArray = _.sortBy(jobTransactionArray, ['disabled'])
    return { jobTransactionArray, selectedTransactionLength }
  }

  getBulkEmptyView() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }]}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[styles.headerLeft, styles.paddingTop10]} onPress={() => { this.props.navigation.goBack(null) }}>
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.pageObject.name}</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View />
              </View>
            </Body>
          </Header>

          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Text style={[styles.margin30, styles.fontDefault, styles.fontDarkGray]}>{NO_JOBS_PRESENT}</Text>
          </View>
        </Container>
      </StyleProvider>
    )
  }

  getBulkTransactionView() {
    let { jobTransactionArray, selectedTransactionLength } = this.renderList()
    const alertView = this.props.wantUnselectJob ? this.showAlertForUnselectTransaction(jobTransactionArray.length, selectedTransactionLength) : null
    let nextStatusNames = []
    this.props.nextStatusList.forEach(object => {
      nextStatusNames.push({
        text: object.name,
        icon: "md-arrow-dropright",
        iconColor: "#000000",
        transient: object.transient,
        saveActivated: object.saveActivated,
        id: object.id
      })
    })
    nextStatusNames.push({ text: CANCEL, icon: "close", iconColor: styles.bgDanger.backgroundColor })

    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <SafeAreaView style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
            <Header searchBar style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
              <Body>
                <View
                  style={[styles.row, styles.width100, styles.justifySpaceBetween,]}>
                  <TouchableOpacity style={[styles.headerLeft, styles.paddingTop10]} onPress={() => {
                    this.props.navigation.goBack(null)
                  }}>
                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                  </TouchableOpacity>
                  <View style={[style.headerBody]}>
                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>{(this.props.navigation.state.params.pageObject.groupId) ? this.props.navigation.state.params.pageObject.groupId : this.props.navigation.state.params.pageObject.name}</Text>
                  </View>
                  <View style={[style.headerRight]}>
                    {this.props.isSelectAllVisible ?
                      <Text
                        onPress={() => this.selectAll(jobTransactionArray.length)}
                        style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>{this.props.selectAllNone}</Text>
                      : null}
                  </View>
                  <View />
                </View>
                {this.searchBarView(selectedTransactionLength)}
              </Body>
            </Header>
          </SafeAreaView>
          {alertView}
          <FlatList
            data={jobTransactionArray}
            renderItem={({ item }) => this.renderData(item, jobTransactionArray.length, selectedTransactionLength)}
            keyExtractor={item => String(item.id)}
          />
          <SafeAreaView>
            <Footer style={[styles.column, style.footer, styles.padding10]}>
              <Text style={[styles.fontSm, styles.marginBottom10]}>{TOTAL_COUNT} {selectedTransactionLength}</Text>
              <Button
                onPress={() => {
                  (nextStatusNames.length > 2) ? ActionSheet.show({
                    options: nextStatusNames,
                    cancelButtonIndex: nextStatusNames.length - 1,
                    title: NEXT_POSSIBLE_STATUS
                  }, buttonIndex => {
                    if (buttonIndex >= 0 && buttonIndex != nextStatusNames.length - 1) {
                      this.goToFormLayout(nextStatusNames[buttonIndex].id, nextStatusNames[buttonIndex].text, nextStatusNames[buttonIndex].transient, nextStatusNames[buttonIndex].saveActivated)
                    }
                  }) : this.goToFormLayout(nextStatusNames[0].id, nextStatusNames[0].text, nextStatusNames[0].transient, nextStatusNames[0].saveActivated)
                }}
                success full
                disabled={selectedTransactionLength == 0 || (this.props.navigation.state.params.pageObject.groupId && !_.isEqual(jobTransactionArray.length, selectedTransactionLength))}
              >
                <Text style={[styles.fontLg, styles.fontWhite]}>{UPDATE_ALL_SELECTED}</Text>
              </Button>
            </Footer>
          </SafeAreaView>

        </Container>
      </StyleProvider>
    )
  }
  onPressSelectedJob = (bulkTransactionLength, selectedTransactionLength) => {
    if (this.props.wantUnselectJob) {
      if (this.props.wantUnselectJob.cloneSelectedItems) {
        this.props.actions.setState(SET_BULK_TRANSACTION_PARAMETERS, {
          selectedItems: this.props.wantUnselectJob.cloneSelectedItems,
          displayText: this.props.wantUnselectJob.displayText,
          searchText: '',
          selectAll: this.props.wantUnselectJob.selectAll,
        })
      } else {
        this.props.actions.toggleMultipleTransactions([this.props.wantUnselectJob], this.props.selectedItems, selectedTransactionLength, this.props.navigation.state.params.pageObject, this.props.checkAlertView, bulkTransactionLength)
      }
    }
  }

  onCancelPress = () => {
    this.props.actions.setState(SET_BULK_PARAMS_FOR_SELECTED_DATA, null)
  }

  onCheckItem = () => {
    this.props.actions.setState(SET_BULK_CHECK_ALERT_VIEW, !this.props.checkAlertView)
  }

  showAlertForUnselectTransaction(bulkTransactionLength, selectedTransactionLength) {
    return <BulkUnselectJobAlert onOkPress={() => this.onPressSelectedJob(bulkTransactionLength, selectedTransactionLength)} onCancelPress={() => this.onCancelPress()}
      onRequestClose={() => this.onCancelPress()} wantUnselectJob={this.props.wantUnselectJob} checked={this.props.checkAlertView} checkItem={() => this.onCheckItem()} />
  }

  render() {
    if (this.props.isLoaderRunning) {
      return <Loader />
    }
    else {
      if (_.isEmpty(this.props.selectedItems)) {
        return (
          this.getBulkEmptyView()
        )
      } else {
        return (
          this.getBulkTransactionView()
        )
      }
    }
  }

  goToFormLayout(statusId, statusName, transient, saveActivated) {
    let jobTransactionArray = this.prepareJobTransactionListForUpdate(this.props.selectedItems)
    navigate(FormLayout, {
      statusId,
      statusName,
      transient,
      saveActivated,
      jobMasterId: JSON.parse(this.props.navigation.state.params.pageObject.jobMasterIds)[0],
      jobTransaction: jobTransactionArray,
    })
  }
  prepareJobTransactionListForUpdate(JobTransactionMap) {
    let JobTransactionList = []
    for (let item in JobTransactionMap) {
      if (JobTransactionMap[item].isChecked) {
        JobTransactionList.push({ jobTransactionId: JobTransactionMap[item].id, jobId: JobTransactionMap[item].jobId, jobMasterId: JobTransactionMap[item].jobMasterId, referenceNumber: JobTransactionMap[item].referenceNumber })
      }
    }
    return JobTransactionList
  }
}
const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    padding: 0,
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: 10
  },

  headerBody: {
    width: '50%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerRight: {
    width: '35%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },

  headerQRButton: {
    position: 'absolute',
    right: 5,
    paddingLeft: 0,
    paddingRight: 0
  },
  footer: {
    height: 'auto',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BulkListing)