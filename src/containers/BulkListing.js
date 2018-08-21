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
import { NEXT_POSSIBLE_STATUS, FILTER_REF_NO, OK, CANCEL, UPDATE_ALL_SELECTED,  NO_JOBS_PRESENT, TOTAL_COUNT } from '../lib/ContainerConstants'
import { FormLayout, SET_BULK_SEARCH_TEXT, SET_BULK_ERROR_MESSAGE, QrCodeScanner, SET_BULK_TRANSACTION_PARAMETERS, SET_BULK_PARAMS_FOR_SELECTED_DATA, SET_BULK_CHECK_ALERT_VIEW } from '../lib/constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'
import { navigate } from '../modules/navigators/NavigationService';
import BulkUnselectJobAlert from '../components/BulkUnselectJobAlert'
function mapStateToProps(state) {
  return {
    bulkTransactionList: state.bulk.bulkTransactionList,
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
    checkAlertView: state.bulk.checkAlertView
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...bulkActions, ...globalActions }, dispatch)
  }
}

class BulkListing extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }

  renderData = (item) => {
    if(_.isEmpty(item.jobExpiryData.value) ||  moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isBefore(item.jobExpiryData.value)){
      return (
        <JobListItem data={item}
          onPressItem={() => this.onClickRowItem(item)}
        />
      )
    }
    
  }

  componentDidUpdate() {
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

  onClickRowItem(item) {
    if (this.props.isManualSelectionAllowed) {
      this.props.actions.toggleMultipleTransactions([item], this.props.bulkTransactionList, this.props.selectedItems, this.props.navigation.state.params.pageObject, this.props.checkAlertView)
    }
  }

  selectAll = () => {
    this.props.actions.toggleAllItems(this.props.bulkTransactionList, this.props.selectAllNone, this.props.selectedItems, this.props.navigation.state.params.pageObject, this.props.searchText)
  }

  componentDidMount() {
    this.props.actions.getBulkJobTransactions(this.props.navigation.state.params)
  }

  _setQrValue = (value) => {
    if (value && value != '')
      this.props.actions.setSearchedItem(value, this.props.bulkTransactionList, this.props.searchSelectionOnLine1Line2, this.props.idToSeparatorMap, this.props.selectedItems, this.props.navigation.state.params.pageObject, this.props.checkAlertView)
  }

  searchBarView() {
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
                this.props.actions.setSearchedItem(this.props.searchText, this.props.bulkTransactionList, this.props.searchSelectionOnLine1Line2, this.props.idToSeparatorMap, this.props.selectedItems, this.props.navigation.state.params.pageObject, this.props.checkAlertView)
            }}
            value={this.props.searchText} />
          <Button small transparent style={[styles.inputInnerBtn]} onPress={() => {
            if (this.props.searchText && this.props.searchText != '')
              this.props.actions.setSearchedItem(this.props.searchText, this.props.bulkTransactionList, this.props.searchSelectionOnLine1Line2, this.props.idToSeparatorMap, this.props.selectedItems, this.props.navigation.state.params.pageObject, this.props.checkAlertView)
          }}>
            <Icon name="md-search" style={[styles.fontWhite, styles.fontXl]} />
          </Button>
        </View>
        <TouchableOpacity style={[{ width: '15%' }, styles.marginLeft15]} onPress={() => {
          this.props.navigation.navigate(QrCodeScanner, { returnData: this._setQrValue.bind(this) })
        }} >
          <MaterialCommunityIcons name='qrcode' style={[styles.fontXxl, styles.padding5]} color={styles.fontWhite.color} />
        </TouchableOpacity>
      </View>
    )
  }

  renderList() {
    let jobTransactionArray = []
    if (!this.props.searchText || this.props.searchText == '') {
      jobTransactionArray = Object.values(this.props.bulkTransactionList)
    }
    else {
      
      let searchText = this.props.searchText
      // Function for filtering on basis of reference number, runsheet number, line1, line2, circleline1, circleline2
      _.forEach(this.props.bulkTransactionList, function (value) {
        let values = [value.runsheetNo, value.referenceNumber, value.line1, value.line2, value.circleLine1, value.circleLine2]
        if (_.some(values, (data) => _.includes(_.toLower(data), _.toLower(searchText)))) {
          jobTransactionArray.push(value)
        }
      })
    }
    jobTransactionArray = _.sortBy(jobTransactionArray, ['disabled'])
    return jobTransactionArray
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
    const  alertView = this.props.wantUnselectJob ? this.showAlertForUnselectTransaction() : null
    let nextStatusNames = []
    this.props.nextStatusList.forEach(object => {
        nextStatusNames.push({
          text: object.name,
          icon: "md-arrow-dropright",
          iconColor: "#000000",
          transient:object.transient,
          saveActivated:object.saveActivated,
          id:object.id
        })
        })
    nextStatusNames.push({ text: CANCEL, icon: "close", iconColor: styles.bgDanger.backgroundColor })

    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <SafeAreaView style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
            <View style={[{ backgroundColor: styles.bgPrimaryColor }, style.header]}>
                <View
                  style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
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
                        onPress={this.selectAll}
                        style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>{this.props.selectAllNone}</Text>
                      : null}
                  </View>
                  <View />
                </View>
                {this.searchBarView()}
            </View>
          </SafeAreaView>
          {alertView}
          <FlatList
            data={this.renderList()}
            renderItem={({ item }) => this.renderData(item)}
            keyExtractor={item => String(item.id)}
          />

          <SafeAreaView>
            <Footer style={[ styles.column,style.footer,styles.padding10]}>
              <Text style={[styles.fontSm, styles.marginBottom10]}>{TOTAL_COUNT} {_.size(this.props.selectedItems)}</Text>
              <Button
                onPress={() => {
                  (nextStatusNames.length > 2) ? ActionSheet.show({
                    options: nextStatusNames,
                    cancelButtonIndex: nextStatusNames.length - 1,
                    title: NEXT_POSSIBLE_STATUS
                  }, buttonIndex => {
                    if (buttonIndex >= 0 && buttonIndex != nextStatusNames.length - 1) {
                      this.goToFormLayout( nextStatusNames[buttonIndex].id, nextStatusNames[buttonIndex].text,nextStatusNames[buttonIndex].transient,nextStatusNames[buttonIndex].saveActivated)
                    }
                  }) : this.goToFormLayout(nextStatusNames[0].id, nextStatusNames[0].text,nextStatusNames[0].transient,nextStatusNames[0].saveActivated)
                }}
                success full
                disabled={_.isEmpty(this.props.selectedItems) || (this.props.navigation.state.params.pageObject.groupId && !_.isEqual(_.size(this.props.bulkTransactionList), _.size(this.props.selectedItems)))}
              >
                <Text style={[styles.fontLg, styles.fontWhite]}>{UPDATE_ALL_SELECTED}</Text>
              </Button>
            </Footer>
          </SafeAreaView>

        </Container>
      </StyleProvider>
    )
  }
  onPressSelectedJob = () => {
    this.props.actions.setState(SET_BULK_TRANSACTION_PARAMETERS, {
      selectedItems: this.props.wantUnselectJob.cloneSelectedItems,
      bulkTransactions: this.props.wantUnselectJob.cloneBulkTransactions,
      displayText: this.props.wantUnselectJob.displayText,
      searchText: '',
      selectAll: this.props.wantUnselectJob.selectAll,
  })
  }

  onCancelPress = () => {
    this.props.actions.setState(SET_BULK_PARAMS_FOR_SELECTED_DATA, null)
  }

  onCheckItem = () => {
    this.props.actions.setState(SET_BULK_CHECK_ALERT_VIEW, !this.props.checkAlertView)
  }

  showAlertForUnselectTransaction(){
      return <BulkUnselectJobAlert onOkPress = {() => this.onPressSelectedJob()} onCancelPress = {() => this.onCancelPress()} 
      onRequestClose = {() => this.onCancelPress()} wantUnselectJob = {this.props.wantUnselectJob} checked = {this.props.checkAlertView} checkItem = {() => this.onCheckItem()}/> 
  }

  render() {
    if (this.props.isLoaderRunning) {
      return <Loader />
    }
    else {
      if (_.isEmpty(this.props.bulkTransactionList)) {
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

  goToFormLayout(statusId, statusName,transient,saveActivated) {
    navigate(FormLayout, {
      statusId,
      statusName,
      transient,
      saveActivated,
      jobMasterId: JSON.parse(this.props.navigation.state.params.pageObject.jobMasterIds)[0],
      jobTransaction: Object.values(this.props.selectedItems),
    })
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
  footer:{
    height: 'auto',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BulkListing)