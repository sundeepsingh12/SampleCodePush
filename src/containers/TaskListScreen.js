'use strict'
import React, { Component } from 'react'
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

import { Form, Item, Input, Container, Content, ListItem, CheckBox, List, Body, Left, Right, Header,Separator, Icon, Footer, FooterTab, Button } from 'native-base';
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
} from '../lib/constants'
import JobListItem from '../components/JobListItem'
import moment from 'moment'

function mapStateToProps(state) {
  return {
    jobTransactionCustomizationList: state.listing.jobTransactionCustomizationList,
    isRefreshing: state.listing.isRefreshing,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...taskListActions, ...globalActions }, dispatch)
  }
}

class TaskListScreen extends Component {

  componentDidMount() {
    if (_.isEmpty(this.props.jobTransactionCustomizationList)) {
      this.props.actions.fetchJobs(moment().format('YYYY-MM-DD'))
    }
<<<<<<< HEAD
=======
    // this.props.actions.setSelectedState(moment(new Date()).format('YYYY-MM-DD'))
    // this.props.actions.futureRunsheetEnabled()
  }

  toggleStatus() {
    console.log('toggle button handler')
>>>>>>> master
  }

  navigateToScene = (item) => {
    this.props.actions.navigateToScene('JobDetailsV2',
      {
        jobSwipableDetails: item.jobSwipableDetails,
        jobTransaction: item,
      }
    )
  }

  renderData = (item) => {
    return (
      <JobListItem
        data={item}
        onPressItem={() => { this.navigateToScene(item) }}
      />
    )
  }

  renderListForAll() {
    let sectionList = []
    let listObject = this.props.jobTransactionCustomizationList
    if (!_.isEmpty(listObject)) {
      for (let key in listObject) {
        let sectionListObject = {
          data: listObject[key],
          key: key,
        }
        sectionList.push(sectionListObject)
      }
    }
    return sectionList
  }

  renderList() {
    let list = this.props.jobTransactionCustomizationList ? this.props.jobTransactionCustomizationList.filter(transactionCustomizationObject => this.props.statusIdList.includes(transactionCustomizationObject.statusId)) : []
    list.sort(function (transaction1, transaction2) {
      return transaction1.seqSelected - transaction2.seqSelected
    })
    return list
  }  

  renderItem = (row) => {
    return (
      <JobListItem
        data={row.item}
        onPressItem={() => { this.navigateToScene(row.item) }}
      />
    )
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
        keyExtractor={item => item.id}
      />
    )
  }

  sectionlist() {
    return (
      <SectionList
        sections={this.renderListForAll()}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
      />
    )
  }

  render() {
    if (this.props.isRefreshing) {
      return <Loader />
    } else {
      let joblist = (!Array.isArray(this.props.jobTransactionCustomizationList)) ? this.sectionlist() : this.flatlist()
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
