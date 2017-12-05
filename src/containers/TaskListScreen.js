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
  ActivityIndicator,
  TouchableOpacity,
  Text
}
  from 'react-native'

import { Form, Item, Input, Container, Content, ListItem, CheckBox, List, Body, Left, Right, Header, Icon, Footer, FooterTab, Button } from 'native-base';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as taskListActions from '../modules/taskList/taskListActions'
import * as globalActions from '../modules/global/globalActions'
import _ from 'lodash'
import renderIf from '../lib/renderIf'
import Loader from '../components/Loader'
import styles from '../themes/FeStyle'
import { NavigationActions } from 'react-navigation'
import {
  JobDetails,
  TABLE_RUNSHEET,
  TABLE_JOB_TRANSACTION,
  IS_CALENDAR_VISIBLE,
} from '../lib/constants'
import JobListItem from '../components/JobListItem'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import * as realm from '../repositories/realmdb'


function mapStateToProps(state) {
  return {
    jobTransactionCustomizationList: state.listing.jobTransactionCustomizationList,
    isRefreshing: state.listing.isRefreshing,
    isFutureRunsheetEnabled: state.taskList.isFutureRunsheetEnabled,
    selectedDate: state.taskList.selectedDate,
    isCalendarVisible: state.taskList.isCalendarVisible,
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
    // this.props.actions.setSelectedState(moment(new Date()).format('YYYY-MM-DD'))
    // this.props.actions.futureRunsheetEnabled()
  }

  toggleStatus() {
    console.log('toggle button handler')
  }

  function

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

  // renderList() {
  //   let list = []
  //   console.log("this.props.selectedDate", this.props.selectedDate)
  //   if (this.props.selectedDate != null) {
  //     let runsheetquery = `startDate BEGINSWITH '${this.props.selectedDate}' AND isClosed = false`
  //     let selectedDateRunsheets = realm.getRecordListOnQuery(TABLE_RUNSHEET, runsheetquery)
  //     console.log("selectedDateRunsheets")
  //     console.log("selectedDateRunsheets", selectedDateRunsheets)
  //     let selectedDateRunsheetIds = []
  //     for (let index in selectedDateRunsheets) {
  //       selectedDateRunsheetIds.push(selectedDateRunsheets[index].id)
  //     }
  //     console.log("this.props.jobTransactionCustomizationList", this.props.jobTransactionCustomizationList)
  //     console.log("selectedDateRunsheetIds", selectedDateRunsheetIds)
  //     list = this.props.jobTransactionCustomizationList.filter(transactionCustomizationObject => this.props.statusIdList.includes(transactionCustomizationObject.statusId) && selectedDateRunsheetIds.includes(transactionCustomizationObject.runsheetId))
  //     // let jobTransactionQuery = Array.from(selectedDateRunsheets.map(item => `runsheetId = ${item.id}`)).join(' OR ')      
  //     // let JobTransactions = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery)
  //     // console.log("JobTransactions", JobTransactions)
  //     // for(let index in JobTransactions){
  //     //     list.push({ ...JobTransactions[index] })
  //     // }
  //   } else if (this.props.jobTransactionCustomizationList) {
  //     list = this.props.jobTransactionCustomizationList.filter(transactionCustomizationObject => this.props.statusIdList.includes(transactionCustomizationObject.statusId))
  //   }
  //   else {
  //     list = []
  //   }

  //   list.sort(function (transaction1, transaction2) {
  //     return transaction1.seqSelected - transaction2.seqSelected
  //   })
  //   return list
  // }

  renderList() {
    let list = this.props.jobTransactionCustomizationList ? this.props.jobTransactionCustomizationList.filter(transactionCustomizationObject => this.props.statusIdList.includes(transactionCustomizationObject.statusId)) : []
    list.sort(function (transaction1, transaction2) {
      return transaction1.seqSelected - transaction2.seqSelected
    })
    return list
  }

  _onCancel = () => {
    this.props.actions.setState(IS_CALENDAR_VISIBLE,false)
  }

  _onConfirm = (date) => {
    this.props.actions.setState(IS_CALENDAR_VISIBLE,false)
    const formattedDate = moment(date).format('YYYY-MM-DD')
    this.props.actions.fetchJobs(formattedDate)
    // console.log('A date has been picked: ', formattedDate)
    // let runsheet = realm.getAll(TABLE_RUNSHEET)
    // for (let index in runsheet) {
    //   console.log("runsheet", { ...runsheet[index] })
    // }
    // let trans = realm.getAll(TABLE_JOB_TRANSACTION)
    // for (let index in trans) {
    //   console.log("trans", { ...trans[index] })
    // }

  }

  _jumpToTodayDate = () => {
    this.props.actions.fetchJobs(moment(new Date()).format('YYYY-MM-DD'))
  }

  _renderCalendar = () => {
    return (
      <Footer style={[styles.bgWhite, { borderTopWidth: 1, borderTopColor: '#f3f3f3' }]}>
        <FooterTab style={[styles.flexBasis30]}>
          <Button transparent
            onPress={
              this._jumpToTodayDate.bind(this, true)}
            style={[styles.alignStart]}>
            <Text style={[styles.fontPrimary, styles.fontSm]}>Today</Text>
          </Button>
        </FooterTab>
        <FooterTab style={[styles.flexBasis70]}>
          <DateTimePicker
            isVisible={this.props.isCalendarVisible}
            onConfirm={this._onConfirm}
            onCancel={this._onCancel}
            mode='date'
            datePickerModeAndroid='spinner'

          />
          <Button transparent
            onPress={() => {this.props.actions.setState(IS_CALENDAR_VISIBLE,true)}}
            style={[styles.row]}>
            <Text style={[styles.fontBlack, styles.fontWeight500, styles.fontSm]}>{moment(this.props.selectedDate).format('ddd, DD MMM, YYYY')}</Text>
            <Icon name='ios-arrow-down' style={[styles.fontBlack, styles.fontSm]} />
          </Button>
        </FooterTab>
        {/* <FooterTab style={[styles.flexBasis20]}>
          <Button transparent
            onPress={
              this._jumpToTodayDate.bind(this, true)}
            style={[styles.alignEnd]}>
            <Text style={[styles.fontPrimary, styles.fontSm]}>All</Text>
          </Button>
        </FooterTab> */}
        
      </Footer>
    )
  }

  render() {
    let calendar = null
    if (this.props.isFutureRunsheetEnabled) {
      calendar = this._renderCalendar()
    }
    if (this.props.isRefreshing) {
      return <Loader />
    } else {
      return (
        <Container>
          <Content>
            <List>
              <FlatList
                data={this.renderList()}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => item.id}
              />
            </List>
          </Content>
          {calendar}
        </Container>
      )
    }
  }

};

export default connect(mapStateToProps, mapDispatchToProps)(TaskListScreen)
