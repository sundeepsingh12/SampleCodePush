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
}
  from 'react-native'

import { Form, Item, Input, Container, Content, ListItem, CheckBox, List, Body, Left, Right, Text, Header, Icon, Button } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as taskListActions from '../modules/taskList/taskListActions'
import * as globalActions from '../modules/global/globalActions'
import _ from 'underscore'
import renderIf from '../lib/renderIf'
import Swipeable from 'react-native-swipeable'
import Loader from '../components/Loader'
import styles from '../themes/FeStyle'
import { NavigationActions } from 'react-navigation'
import {
  JobDetails
} from '../lib/constants'
import JobListItem from '../components/JobListItem'


function mapStateToProps(state) {
  return {
    jobTransactionCustomizationList: state.listing.jobTransactionCustomizationList,
    isRefreshing: state.listing.isRefreshing
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
      this.props.actions.fetchJobs()
    }
  }

  toggleStatus() {
    console.log('toggle button handler')
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
        onPressItem={() => {this.navigateToScene(item)}}
      />
    )
  }

  renderList() {
    const list = this.props.jobTransactionCustomizationList ? this.props.jobTransactionCustomizationList.filter(transactionCustomizationObject => this.props.statusIdList.includes(transactionCustomizationObject.statusId)) : []
    list.sort(function (transaction1, transaction2) {
      return transaction1.seqSelected - transaction2.seqSelected
    })
    return list
  }

  render() {
    if (this.props.isRefreshing) {
      return <Loader />
    } else {
      return (
        <Container>
          <View style={{ flex: 1, flexDirection: 'column', bottom: 5, marginLeft: 5, marginRight: 5 }}>
            <List>
              <FlatList
                data={this.renderList()}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => item.id}
              />
            </List>
          </View>
        </Container>
      )
    }
  }

};

export default connect(mapStateToProps, mapDispatchToProps)(TaskListScreen)
