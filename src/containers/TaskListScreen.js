'use strict'
import React, { PureComponent } from 'react';
import { StyleSheet, View, ScrollView, Image, Dimensions, ListView, Platform, TouchableHighlight, FlatList, SectionList, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Form, Item, Input, Container, Content, ListItem, CheckBox, List, Body, Left, Right, Header, Separator, Icon, Footer, FooterTab, Button, Toast } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as taskListActions from '../modules/taskList/taskListActions';
import * as globalActions from '../modules/global/globalActions';
import { startSyncAndNavigateToContainer } from '../modules/home/homeActions'
import _ from 'lodash';
import renderIf from '../lib/renderIf';
import Loader from '../components/Loader';
import styles from '../themes/FeStyle';
import { JobDetails, TABLE_RUNSHEET, TABLE_JOB_TRANSACTION, SEARCH_TAP, LISTING_SEARCH_VALUE, BulkListing, JobDetailsV2, TASKLIST_LOADER_FOR_SYNC } from '../lib/constants';
import JobListItem from '../components/JobListItem';
import { NO_NEXT_STATUS, OK, ALL } from '../lib/ContainerConstants';
import moment from 'moment';


function mapStateToProps(state) {
  return {
    jobTransactionCustomizationList: state.listing.jobTransactionCustomizationList,
    isRefreshing: state.listing.isRefreshing,
    selectedDate: state.taskList.selectedDate
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...taskListActions, ...globalActions, startSyncAndNavigateToContainer }, dispatch)
  }
}

class TaskListScreen extends PureComponent {

  componentDidMount() {
    if (_.isEmpty(this.props.jobTransactionCustomizationList)) {
      this.props.actions.fetchJobs()
    }
  }

  navigateToScene = (item, isGroup) => {
    this.props.actions.navigateToScene(JobDetailsV2,
      {
        jobSwipableDetails: item.jobSwipableDetails,
        jobTransaction: item,
        groupId: isGroup ? item.groupId : null,
        pageObjectAdditionalParams: this.props.pageObject.additionalParams
      }
    )
    this.props.actions.setState(LISTING_SEARCH_VALUE, {})
  }

  /**It renders each job transaction item
    * 
    * @param {*} item 
    * @param {*} lastId 
    * @param {*} groupId 
    */
  renderData = (item, index, section) => {
    let lastId = item.groupId == 'nullGroup' || section.data.length == 1 ? null : (section && section.data.length == (index + 1)) ? 'lastTransaction' : 'groupTransaction'
    return (
      <JobListItem
        data={item}
        showIconsInJobListing={true}
        onPressItem={() => { this.navigateToScene(item, lastId) }}
        lastId={lastId}
      />
    )
  }

  /**Navigate to bulk update when selecting a group of transactions
    *  
    */
  updateTransactionForGroupId(item) {
    let jobTransaction = item.data[0];
    if (jobTransaction.isNextStatusPresent) {
      this.props.actions.navigateToScene(BulkListing, {
        pageObject: {
          jobMasterIds: JSON.stringify([jobTransaction.jobMasterId]),
          additionalParams: JSON.stringify({ statusId: jobTransaction.statusId }),
          groupId: jobTransaction.groupId
        }
      })
    } else {
      Toast.show({
        text: NO_NEXT_STATUS, position: 'bottom', buttonText: OK
      })
    }
  }

  checkTransactionForSearchText(jobTransaction, searchEqualTransactionList) {
    let trimmedSearchText = _.trim(this.props.searchText.searchText);
    if (!_.trim(trimmedSearchText)) {
      return true
    }
    let result = false;
    let searchText = _.toLower(trimmedSearchText);
    let values = [jobTransaction.referenceNumber, jobTransaction.runsheetNo, jobTransaction.line1, jobTransaction.line2, jobTransaction.circleLine1, jobTransaction.circleLine2];
    if (_.isEqual(_.toLower(jobTransaction.referenceNumber), searchText) || _.isEqual(_.toLower(jobTransaction.runsheetNo), searchText)) {
      if (this.props.searchText.scanner) {
        searchEqualTransactionList.push(jobTransaction);
      }
      result = true;
    } else if (_.some(values, (data) => _.includes(_.toLower(data), searchText))) {
      result = true;
    }
    return result;
  }

  getTransactionView(jobMasterMap) {
    let tabJobTransactionList = {}, jobTransactionList = this.renderJobTransactionView(this.props.jobTransactionCustomizationList), searchEqualTransactionList = [];
    for (let index in jobTransactionList) {
      if (!jobMasterMap[jobTransactionList[index].jobMasterId] || !this.props.statusIdList.includes(jobTransactionList[index].statusId) || !this.checkTransactionForSearchText(jobTransactionList[index], searchEqualTransactionList)) {
        continue;
      } else if (!this.props.isFutureRunsheetEnabled) {
        this.prepareJobTrasactionListStructureForViewForNormalCase(tabJobTransactionList, jobTransactionList[index]);
      } else if (!jobTransactionList[index].runsheetDate) {
        continue;
      } else if (!this.props.selectedDate && moment(jobTransactionList[index].runsheetDate).isSame(moment(), 'day')) {
        this.prepareJobTrasactionListStructureForViewForNormalCase(tabJobTransactionList, jobTransactionList[index]);
      } else if (this.props.selectedDate && this.props.selectedDate == ALL) {
        this.prepareJobTrasactionListStructureForViewForFutureRunsheetDate(tabJobTransactionList, jobTransactionList[index]);
      } else if (this.props.selectedDate && this.props.selectedDate != ALL && moment(jobTransactionList[index].runsheetDate).isSame(this.props.selectedDate, 'day')) {
        this.prepareJobTrasactionListStructureForViewForNormalCase(tabJobTransactionList, jobTransactionList[index]);
      }
    }
    if (searchEqualTransactionList.length == 1) {
      this.navigateToScene(searchEqualTransactionList[0]);
    }
    let transactionListView = this.renderParticularTabJobTransactionList(tabJobTransactionList, this.props.isFutureRunsheetEnabled, false);
    return transactionListView;
  }

  prepareJobTrasactionListStructureForViewForFutureRunsheetDate(jobTransactionObject, jobTransaction) {
    jobTransactionObject[jobTransaction.runsheetDate] = jobTransactionObject[jobTransaction.runsheetDate] ? jobTransactionObject[jobTransaction.runsheetDate] : {};
    jobTransactionObject[jobTransaction.runsheetDate].title = jobTransaction.runsheetDate;
    jobTransactionObject[jobTransaction.runsheetDate].data = jobTransactionObject[jobTransaction.runsheetDate].data ? jobTransactionObject[jobTransaction.runsheetDate].data : {};
    this.prepareJobTrasactionListStructureForViewForNormalCase(jobTransactionObject[jobTransaction.runsheetDate].data, jobTransaction);
  }

  prepareJobTrasactionListStructureForViewForNormalCase(jobTransactionObject, jobTransaction) {
    jobTransaction.groupId = jobTransaction.groupId ? jobTransaction.groupId : 'nullGroup';
    jobTransactionObject[jobTransaction.groupId] = jobTransactionObject[jobTransaction.groupId] ? jobTransactionObject[jobTransaction.groupId] : {};
    jobTransactionObject[jobTransaction.groupId].title = jobTransaction.groupId;
    jobTransactionObject[jobTransaction.groupId].data = jobTransactionObject[jobTransaction.groupId].data ? jobTransactionObject[jobTransaction.groupId].data : [];
    jobTransactionObject[jobTransaction.groupId].data.push(jobTransaction);
  }

  renderParticularTabJobTransactionList(tabJobTransactionList, isFutureRunsheetEnabled) {
    let sections = Object.values(tabJobTransactionList);
    if (isFutureRunsheetEnabled && this.props.selectedDate == ALL) {
      let transactionView = [];
      for (let index in sections) {
        transactionView.push(this.renderDataForBothRusheetAndGroup(sections[index]));
      }
      return transactionView;
    } else {
      return (
        <SectionList
          sections={sections}
          renderItem={({ item, index, section }) => this.renderData(item, index, section)}
          renderSectionHeader={this.renderGroupSectionHeader}
          keyExtractor={item => (item.id + '')}
        />
      )
    }
  }

  renderSectionList(sections) {
    return (
      <SectionList
        sections={sections}
        renderItem={({ item, index, section }) => this.renderData(item, index, section)}
        renderSectionHeader={this.renderGroupSectionHeader}
        keyExtractor={item => (item.id + '')}
      />
    )
  }

  renderDataForBothRusheetAndGroup(item) {
    let sections = Object.values(item.data);
    return (
      <View key={item.title}>
        <View>
          <Separator bordered>
            <Text>{moment(item.title).format('YYYY-MM-DD')}</Text>
          </Separator>
        </View>
        <SectionList
          sections={sections}
          renderItem={({ item, index, section }) => this.renderData(item, index, section)}
          renderSectionHeader={this.renderGroupSectionHeader}
          keyExtractor={item => (item.id + '')}
        />
      </View>
    )
  }

  renderJobTransactionView(jobTransactionList) {
    return jobTransactionList.sort(function (transaction1, transaction2) {
      return transaction2.jobPriority - transaction1.jobPriority || transaction1.seqSelected - transaction2.seqSelected
    })
  }

  renderGroupSectionHeader = ({ section }) => {
    if (section.title == 'nullGroup' || section.data.length == 1) {
      return null;
    }
    return (
      <View>
        <TouchableOpacity style={[styles.row, styles.padding10, styles.justifyStart, styles.alignCenter, { height: 70 }]} onPress={() => { this.updateTransactionForGroupId(section) }}>
          <View style={{ position: 'absolute', width: 3, backgroundColor: '#d9d9d9', height: 40, top: 40, left: 36 }}></View>
          <View style={[styles.borderRadius50, { backgroundColor: section.data[0].identifierColor, width: 16, height: 16, marginLeft: 20 }]}>
          </View>
          <View style={{ marginLeft: 34, marginTop: 12 }}>
            <Text style={[styles.fontLg, styles.fontWeight500, styles.fontBlack]}> {section.title}</Text>
            <Text style={[styles.fontSm, styles.fontDarkGray]}>Total : {section.data.length} </Text>
          </View>
          <Icon name="ios-arrow-forward" style={{ marginLeft: 'auto', color: '#a3a3a3' }} />
        </TouchableOpacity>
      </View>
    )
  }



  render() {
    let jobMasterMap = _.mapKeys(JSON.parse(this.props.pageObject.jobMasterIds));
    let jobMasterList = JSON.parse(this.props.pageObject.jobMasterIds); // to be removed
    let jobTransactionViewStructure = this.getTransactionView(jobMasterMap)
    let jobList = null;
    if (this.props.isRefreshing) {
      return <Loader />
    } else {
      return (
        <Container>
          <Content>
            <List>
              {jobTransactionViewStructure}
            </List>
          </Content>
        </Container>
      )
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskListScreen)
