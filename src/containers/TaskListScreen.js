'use strict'
import React, { PureComponent } from 'react';
import {  View, SectionList, TouchableOpacity, Text } from 'react-native';
import { Container, Content, List, Separator, Icon, Toast } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as taskListActions from '../modules/taskList/taskListActions';
import * as globalActions from '../modules/global/globalActions';
import _ from 'lodash';
import Loader from '../components/Loader';
import styles from '../themes/FeStyle';
import {  LISTING_SEARCH_VALUE, BulkListing, JobDetailsV2, TASKLIST_LOADER_FOR_SYNC} from '../lib/constants'
import JobListItem from '../components/JobListItem';
import { NO_NEXT_STATUS, OK, ALL, NO_RESULT_FOUND } from '../lib/ContainerConstants';
import moment from 'moment';
import { navigate } from '../modules/navigators/NavigationService';
import { startSyncAndNavigateToContainer } from '../modules/home/homeActions'


function mapStateToProps(state) {
  return {
    jobTransactionCustomizationList: state.listing.jobTransactionCustomizationList,
    isRefreshing: state.listing.isRefreshing,
    selectedDate: state.taskList.selectedDate,
    updatedTransactionListIds: state.listing.updatedTransactionListIds
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
  
  componentDidUpdate(){
    if(this.props.isRefreshing != 'UPDATING_DATA' && !_.isEmpty(this.props.updatedTransactionListIds) && this.checkForJobMasterIdsOfUpdatedJobs(this.props.updatedTransactionListIds)){
      this.props.actions.fetchJobs(Object.values(this.props.updatedTransactionListIds), this.props.jobTransactionCustomizationList)
    }
  }

  checkForJobMasterIdsOfUpdatedJobs(updatedTransactionListIds){
    let updatedJobMasterIdsList = Object.keys(updatedTransactionListIds)
    let jobMasterMap = _.mapKeys(JSON.parse(this.props.pageObject.jobMasterIds));
    for(let jobMaster in updatedJobMasterIdsList){
      if(jobMasterMap[updatedJobMasterIdsList[jobMaster]]){
        return true
      }
    }
    return false
  }

  componentWillUnmount(){
    this.props.actions.setState(LISTING_SEARCH_VALUE,{})
  }

  navigateToScene = (item) => {
    let setGroupId = item.groupId == 'nullGroup' ||  Object.values(this.props.jobTransactionCustomizationList).filter(jobTransaction => jobTransaction.groupId == item.groupId).length < 2 ? null : item.groupId;
    navigate(JobDetailsV2,
      {
        jobSwipableDetails: item.jobSwipableDetails,
        jobTransaction: item,
        groupId: setGroupId,
        pageObjectAdditionalParams: this.props.pageObject.additionalParams
      })
    this.props.actions.setState(LISTING_SEARCH_VALUE, {})
  }

  /**It renders each job transaction item
    * 
    * @param {*} item 
    * @param {*} index 
    * @param {*} section 
    */
  renderData = (item, index, section) => {
    let lastId = item.groupId == 'nullGroup' || section.data.length == 1 ? null : (section && section.data.length == (index + 1)) ? 'lastTransaction' : 'groupTransaction'
    return (
      <JobListItem
        data={item}
        onChatButtonPressed = {(contact, smsTemplatedata) => {this.props.actions.setSmsTemplateList(contact, smsTemplatedata, item)}}
        showIconsInJobListing={true}
        onPressItem={() => { this.navigateToScene(item) }}
        lastId={lastId}
      />
    )
  }

  /**Navigate to bulk update when selecting a group of transactions
    *  
    */
  updateTransactionForGroupId =(item) => {
    let jobTransaction = item.data[0];
    if (jobTransaction.isNextStatusPresent) {
   this.props.actions.startSyncAndNavigateToContainer({
          jobMasterIds: JSON.stringify([jobTransaction.jobMasterId]),
          additionalParams: JSON.stringify({ statusId: jobTransaction.statusId }),
          groupId: jobTransaction.groupId
        
      }, true, TASKLIST_LOADER_FOR_SYNC)
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
    if (!jobTransaction.isJobUnseen && _.isEqual(_.toLower(jobTransaction.referenceNumber), searchText) || _.isEqual(_.toLower(jobTransaction.runsheetNo), searchText)) {
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
    let tabJobTransactionList = {}, jobTransactionList = this.renderJobTransactionView(Object.values(this.props.jobTransactionCustomizationList)), searchEqualTransactionList = [];
    for (let index in jobTransactionList) {
      if (!jobMasterMap[jobTransactionList[index].jobMasterId] || !this.checkTransactionForSearchText(jobTransactionList[index], searchEqualTransactionList) || !this.props.statusIdList.includes(jobTransactionList[index].statusId)) {
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
    if (this.props.searchText && this.props.searchText.scanner) {
      this.props.actions.setState(LISTING_SEARCH_VALUE, { searchText: this.props.searchText.searchText, scanner: false })
      if (_.isEmpty(tabJobTransactionList) && searchEqualTransactionList.length != 1) {
        Toast.show({
          text: NO_RESULT_FOUND,
          position: 'bottom',
          buttonText: OK,
          duration: 5000
        })
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
          <Separator>
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
    let jobTransactionViewStructure = this.getTransactionView(jobMasterMap)
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
