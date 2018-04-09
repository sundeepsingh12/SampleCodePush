'use strict'
import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  ListView,
  Platform,
  TouchableHighlight,
  FlatList,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
  Text
}
  from 'react-native'

import { Form, Item, Input, Container, Content, ListItem, CheckBox, List, Body, Left, Right, Header, Separator, Icon, Footer, FooterTab, Button, Toast } from 'native-base';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as taskListActions from '../modules/taskList/taskListActions'
import * as globalActions from '../modules/global/globalActions'
import _ from 'lodash'
import renderIf from '../lib/renderIf'
import Loader from '../components/Loader'
import styles from '../themes/FeStyle'
import {
  JobDetails,
  TABLE_RUNSHEET,
  TABLE_JOB_TRANSACTION,
  SEARCH_TAP,
  LISTING_SEARCH_VALUE,
  BulkListing,
  JobDetailsV2
} from '../lib/constants'
import JobListItem from '../components/JobListItem'
import {
  NO_NEXT_STATUS,
  OK
} from '../lib/ContainerConstants'
function mapStateToProps(state) {
  return {
    jobTransactionCustomizationList: state.listing.jobTransactionCustomizationList,
    isRefreshing: state.listing.isRefreshing,
    statusNextStatusListMap: state.listing.statusNextStatusListMap
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...taskListActions, ...globalActions }, dispatch)
  }
}

class TaskListScreen extends PureComponent {

  componentDidMount() {
    this.props.actions.shouldFetchJobsOrNot(this.props.jobTransactionCustomizationList, this.props.pageObject)
  }

  navigateToScene = (item, groupId) => {
    this.props.actions.navigateToScene(JobDetailsV2,
      {
        jobSwipableDetails: item.jobSwipableDetails,
        jobTransaction: item,
        groupId
      }
    )
  }
  /**It renders each job transaction item
    * 
    * @param {*} item 
    * @param {*} lastId 
    * @param {*} groupId 
    */
  renderData = (item, lastId, groupId) => {
    return (
      <JobListItem
        data={item}
        showIconsInJobListing={true}
        onPressItem={() => { this.navigateToScene(item, groupId) }}
        lastId={lastId}
      />
    )
  }

  /**It performs filter and search on a list of job transactions
   * and returns filtered array. It also navigates to a job if only one
   * transaction is searched.
   * 
   * @param {*} listArray 
   * @param {*} searchText text to be searched
   * @param {*} scanner boolean variable that distinguishes between search and filter
   * @param {*} groupId groupId in case of multipart assignment
   */
  performFilteringAndSearch(listArray, searchText, scanner, groupId) {
    let trimmedSearchText = _.trim(searchText)
    let jobTransactionArray = [], isEqualMatchFound
    for (let value of listArray) {
      let values = [value.referenceNumber, value.runsheetNo, value.line1, value.line2, value.circleLine1, value.circleLine2]
      if (_.isEqual(_.toLower(value.referenceNumber), trimmedSearchText) || _.isEqual(_.toLower(value.runsheetNo), trimmedSearchText)) {
        jobTransactionArray.push(value)
        isEqualMatchFound = true
      } else if (_.some(values, (data) => _.includes(_.toLower(data), trimmedSearchText))) {
        jobTransactionArray.push(value)
      }
    }
    // Navigate to job details page when single transaction is searched
    if (_.size(jobTransactionArray) == 1 && scanner && isEqualMatchFound) {
      this.navigateToScene(jobTransactionArray[0], groupId)
    } else if (scanner) {
      this.props.actions.setState(LISTING_SEARCH_VALUE, { searchText, scanner: false })
    }
    return jobTransactionArray
  }

  /**It returns section list according to dates for calender selection.
   */
  renderListForCalender() {
    let scanner = (this.props.searchText.scanner) ? true : false
    let searchText = _.toLower(this.props.searchText.searchText)
    let sectionList = []
    let listObject = this.props.jobTransactionCustomizationList
    for (let selectedDateObject in listObject) {
      let statusIdFilteredArray = listObject[selectedDateObject].filter(arrayItem => this.props.statusIdList.includes(arrayItem.statusId))
      let jobTransactionArray = this.performFilteringAndSearch(statusIdFilteredArray, searchText, scanner)
      if (!_.isEmpty(jobTransactionArray)) {
        sectionList.push({
          data: jobTransactionArray,
          key: selectedDateObject,
        })
      }
    }
    return sectionList
  }

  /**Function to render transactions based on group id.
   * 
   * @param {*} groupTransactionsArray 
   */
  renderSearchListForGroupId(groupTransactionsArray) {
    let scanner = (this.props.searchText.scanner) ? true : false
    let searchText = _.toLower(this.props.searchText.searchText)
    let jobTransactionArray = [], transactionList = []
    for (let value of groupTransactionsArray) {
      let transactionList = this.performFilteringAndSearch(value.jobTransactions, searchText, scanner, value.groupId);
      if (transactionList && transactionList.length > 0) {
        value.total = transactionList.length
        value.jobTransactions = transactionList
        value.seqSelected = value.jobTransactions[0].seqSelected
        jobTransactionArray.push(value)
      }
    }
    return jobTransactionArray;
  }
  /**Function to render transactions without group id and calender date
    * 
    * @param {*} groupTransactionsArray 
    */
  renderList() {
    let list = this.props.jobTransactionCustomizationList ? this.props.jobTransactionCustomizationList.filter(transactionCustomizationObject => this.props.statusIdList.includes(transactionCustomizationObject.statusId)) : []
    let scanner = (this.props.searchText.scanner) ? true : false
    let searchText = _.toLower(this.props.searchText.searchText)
    let jobTransactionArray = this.performFilteringAndSearch(list, searchText, scanner);

    // Sort transaction list by order of sequence selected
    jobTransactionArray.sort(function (transaction1, transaction2) {
      return transaction1.seqSelected - transaction2.seqSelected
    })
    return jobTransactionArray
  }

  renderItem = (row) => {
    return (
      <JobListItem
        data={row.item}
        onPressItem={() => { this.navigateToScene(row.item) }}
      />
    )
  }

  // Function to render headers in calender section list
  renderSectionHeader = (row) => {
    return (
      <Separator bordered>
        <Text>{row.section.key}</Text>
      </Separator>
    );
  }
  /**Renders flatlist for list of job transactions
    *  
    */
  flatlist() {
    return (
      <FlatList
        data={this.renderList()}
        renderItem={({ item }) => this.renderData(item)}
        keyExtractor={item => String(item.id)}
      />
    )
  }
  /**Renders flatlist for list of job transactions with group id
    *  
    */
  flatlistForGroupTransactions() {
    return (
      <FlatList
        data={this.getGroupWiseTransactions(this.props.jobTransactionCustomizationList, this.props.tabId)}
        renderItem={({ item }) => {
          return (
            <View>
              {(item.groupId && item.jobTransactions.length > 1) ? <TouchableOpacity style={[styles.row, styles.padding10, styles.justifyStart, styles.alignCenter, { height: 70 }]} onPress={() => this.updateTransactionForGroupId(item)}>
                <View style={{ position: 'absolute', width: 3, backgroundColor: '#d9d9d9', height: 40, top: 40, left: 36 }}></View>
                <View style={[styles.borderRadius50, { backgroundColor: item.color, width: 16, height: 16, marginLeft: 20 }]}>
                </View>
                <View style={{ marginLeft: 34, marginTop: 12 }}>
                  <Text style={[styles.fontLg, styles.fontWeight500, styles.fontBlack]}> {item.groupId}</Text>
                  <Text style={[styles.fontSm, styles.fontDarkGray]}>Total : {item.total} </Text>
                </View>
                <Icon name="ios-arrow-forward" style={{ marginLeft: 'auto', color: '#a3a3a3' }} />

              </TouchableOpacity> : null}
              {this.renderGroupTransactions(item)}
            </View>
          )
        }}
        keyExtractor={item => String(item.key)}
      />
    )
  }

  renderGroupTransactions(items) {
    let jobTransactions = items.jobTransactions.sort(function (transaction1, transaction2) {
      return transaction1.seqSelected - transaction2.seqSelected
    })
    let groupId = null, lastId = null
    if (items.groupId && items.total > 1) {
      lastId = jobTransactions[items.jobTransactions.length - 1]['id']
      groupId = items.groupId
    }
    return (
      <FlatList
        data={jobTransactions}
        renderItem={({ item }) => this.renderData(item, lastId, groupId)}
        legacyImplementation={true}
        keyExtractor={item => String(item.id)}
      />
    )
  }

  /**Navigate to bulk update when selecting a group of transactions
    *  
    */
  updateTransactionForGroupId(item) {
    let jobTransaction = item.jobTransactions[0]
    if (this.props.statusNextStatusListMap[jobTransaction.statusId].length > 0) {
      this.props.actions.navigateToScene(BulkListing, {pageObject : {
        jobMasterIds: [jobTransaction.jobMasterId],
        additionalParams: {statusId : jobTransaction.statusId},
        groupId: item.groupId
      }})
    } else {
      Toast.show({
        text: NO_NEXT_STATUS, position: 'bottom', buttonText: OK
      })
    }
  }

  getGroupWiseTransactions(jobTransactionCustomizationList, tabId) {
    let list = Object.values(jobTransactionCustomizationList[tabId])
    let groupTransactionsArray = (_.trim(this.props.searchText)) ? this.renderSearchListForGroupId(_.cloneDeep(list)) : list
    groupTransactionsArray.sort(function (transaction1, transaction2) {
      return transaction1.seqSelected - transaction2.seqSelected
    })
    return groupTransactionsArray
  }

  /**Renders section list for transactions divided date wise
    *  
    */
  sectionlist() {
    return (
      <SectionList
        sections={this.renderListForCalender()}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        keyExtractor={item => String(item.id)}
      />
    )
  }

  render() {
    if (this.props.isRefreshing) {
      return <Loader />
    } else {
      let joblist = (!Array.isArray(this.props.jobTransactionCustomizationList) && this.props.jobTransactionCustomizationList) ? this.props.jobTransactionCustomizationList['isGrouping'] ?
        this.flatlistForGroupTransactions() : this.sectionlist() : this.flatlist()
      return (
        <Container>
          <Content>
            <List>
              {joblist}
            </List>
          </Content>
        </Container>
      )
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskListScreen)
