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
  BulkListing
} from '../lib/constants'
import JobListItem from '../components/JobListItem'

function mapStateToProps(state) {
  return {
    jobTransactionCustomizationList: state.listing.jobTransactionCustomizationList,
    isRefreshing: state.listing.isRefreshing,
    statusNextStatusListMap : state.listing.statusNextStatusListMap
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...taskListActions, ...globalActions }, dispatch)
  }
}

class TaskListScreen extends PureComponent {

  componentDidMount() {
    this.props.actions.shouldFetchJobsOrNot(this.props.jobTransactionCustomizationList)
  }

  navigateToScene = (item,groupId) => {
    this.props.actions.navigateToScene('JobDetailsV2',
      {
        jobSwipableDetails: item.jobSwipableDetails,
        jobTransaction: item,
        groupId
      }
    )
  }

  renderData = (item,lastId,groupId) => {
    return (
      <JobListItem
        data={item}
        showIconsInJobListing = {true}
        onPressItem={() => { this.navigateToScene(item,groupId) }}
        lastId = {lastId}
      />
    )
  }

  renderListForAll() {
    let sectionList = []
    let listObject = _.clone(this.props.jobTransactionCustomizationList)  
    let statusIdlistObject = {}  
    for(let selectedDateObject in listObject){
      let statusIdFilteredArray = []
      statusIdFilteredArray = listObject[selectedDateObject].filter(arrayItem => this.props.statusIdList.includes(arrayItem.statusId))
      if(!_.isEmpty(statusIdFilteredArray)){
        statusIdlistObject[selectedDateObject] = statusIdFilteredArray
    }
  }
      if (!_.isEmpty(statusIdlistObject)) {
      for (let key in statusIdlistObject) {
        let sectionListObject = {
          data: statusIdlistObject[key],
          key: key,
        }
        sectionList.push(sectionListObject)
      }
    }
    return sectionList
  }

  renderSearchList(searchTextValue, listArray) {
    let scanner = (searchTextValue.scanner) ? true : false
    let searchText = _.toLower(searchTextValue.searchText)
    let jobTransactionArray = []
    for(let value of listArray) {
      let values = [value.referenceNumber, value.runsheetNo, value.line1, value.line2, value.circleLine1, value.circleLine2]
      if (_.isEqual(_.toLower(value.referenceNumber), searchText) || _.isEqual(_.toLower(value.runsheetNo), searchText)){
        jobTransactionArray = []
        jobTransactionArray.push(value)
        break
      }
      if (_.some(values, (data) => _.includes(_.toLower(data), searchText))) {
        jobTransactionArray.push(value)
      }
    }
    (jobTransactionArray.length == 1) ? 
      this.props.actions.setState(SEARCH_TAP,{jobTransaction : jobTransactionArray[0],scanner}) : this.props.actions.setState(SEARCH_TAP,null) 
    return jobTransactionArray;
  }
  renderSearchListForGroupId(searchTextValue, groupTransactionsArray) {
    let searchText = _.toLower(searchTextValue.searchText)
    let jobTransactionArray = [],transactionList = []
    for(let value of groupTransactionsArray) {
      transactionList = []
      for(let transaction of value.jobTransactions){
        let values = [transaction.referenceNumber, transaction.runsheetNo, transaction.line1, transaction.line2, transaction.circleLine1, transaction.circleLine2]
        if (_.some(values, (data) => _.includes(_.toLower(data), searchText))) {
          transactionList.push(transaction)
        }
      }
      if(transactionList.length > 0){
      value.jobTransactions = transactionList
      value.seqSelected = value.jobTransactions[0].seqSelected
      jobTransactionArray.push(value)
      }
    }
    return jobTransactionArray;
  }

  renderList() {
    let list = this.props.jobTransactionCustomizationList ? this.props.jobTransactionCustomizationList.filter(transactionCustomizationObject => this.props.statusIdList.includes(transactionCustomizationObject.statusId)) : []
    let jobTransactionArray = (_.trim(this.props.searchText)) ? this.renderSearchList(this.props.searchText, list) : list
    jobTransactionArray.sort(function (transaction1, transaction2) {
      return transaction1.seqSelected - transaction2.seqSelected
    })
    return jobTransactionArray
  }

  renderSectionHeader = (row) => {
    return (
      <Separator bordered>
        <Text>{row.section.key}</Text>
      </Separator>
    );
  }

  flatlist() {
    return (
      <FlatList
        data={this.renderList()}
        renderItem={({ item }) => this.renderData(item)}
        keyExtractor={item => String(item.id)}
      />
    )
  }

  flatlistForGroupTransactions() {
    return (
      <FlatList
        data={this.getGroupWiseTransactions(this.props.jobTransactionCustomizationList,this.props.tabId)}
        renderItem={({ item }) => {
          return(
            <View>
              {(item.groupId && item.jobTransactions.length > 1) ? <TouchableOpacity style={[styles.row, styles.padding10, styles.justifyStart, styles.alignCenter, {height: 70}]}   onPress={() => this.updateTransactionForGroupId(item)}>
                <View style={{position: 'absolute', width: 3, backgroundColor: '#d9d9d9', height: 40,top:40, left: 36}}></View>
                  <View style={[styles.borderRadius50,{backgroundColor : item.color,width: 16, height: 16, marginLeft: 20}]}>
                  </View>
                  <View style={{marginLeft: 34,marginTop: 12}}>
                    <Text style={[styles.fontLg, styles.fontWeight500, styles.fontBlack]}> {item.groupId}</Text>
                    <Text style={[styles.fontSm, styles.fontDarkGray]}>Total : {item.total} </Text>
                  </View>
                  <Icon name="ios-arrow-forward" style={{marginLeft: 'auto',color: '#a3a3a3'}}/>

              </TouchableOpacity> : null}
              {this.renderGroupTransactions(item)}
              </View>
          )
        }}
        keyExtractor={item => String(item.key)}
      />
    )
  }
  renderGroupTransactions(items){
    let jobTransactions = items.jobTransactions.sort(function (transaction1, transaction2) {
      return transaction1.seqSelected - transaction2.seqSelected
    })
    let groupId = null,lastId = null
    if(items.groupId && items.total > 1){
      lastId = jobTransactions[items.jobTransactions.length-1]['id']
      groupId = items.groupId
    }
    return (
      <FlatList
        data={jobTransactions}
        renderItem={({ item }) => this.renderData(item,lastId,groupId)}
        legacyImplementation = {true}
        keyExtractor={item => String(item.id)}
      />
    )  
  } 

  updateTransactionForGroupId (item){
    let jobTransaction = item.jobTransactions[0]
    if(this.props.statusNextStatusListMap[jobTransaction.statusId].length > 0){
    this.props.actions.navigateToScene(BulkListing, {
      jobMasterId: jobTransaction.jobMasterId,      
      statusId: jobTransaction.statusId,
      nextStatusList : this.props.statusNextStatusListMap[jobTransaction.statusId],
      groupId: item.groupId
    }) }else{
      Toast.show({
        text: 'No NextStatus Available',  position: 'bottom', buttonText: 'Ok'
      })
    }

  }
  getGroupWiseTransactions(jobTransactionCustomizationList,tabId) {
    let list = Object.values(jobTransactionCustomizationList[tabId])
    let groupTransactionsArray = (_.trim(this.props.searchText)) ? this.renderSearchListForGroupId(this.props.searchText, _.cloneDeep(list)) : list
    groupTransactionsArray.sort(function (transaction1, transaction2) {
      return transaction1.seqSelected - transaction2.seqSelected
    })
    return groupTransactionsArray
  }

  sectionlist() {
    return (
      <SectionList
        sections={this.renderListForAll()}
        renderItem={({ item }) => this.renderData(item)}
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
                   this.flatlistForGroupTransactions() : this.sectionlist()  : this.flatlist()
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
