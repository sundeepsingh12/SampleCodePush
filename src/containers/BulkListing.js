'use strict'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as bulkActions from '../modules/bulk/bulkActions'
import Loader from '../components/Loader'

import React, {Component} from 'react'
import {StyleSheet, View, Image, TouchableHighlight,Alert,FlatList} from 'react-native'

import {
  Container,
  Content,
  Header,
  Button,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
  Title,
  Footer,
  FooterTab,
  StyleProvider,
  Spinner
} from 'native-base'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import TitleHeader from '../components/TitleHeader'
import JobListItem from '../components/JobListItem'
import _ from 'underscore'


function mapStateToProps(state) {
  return {
    bulktTransactionList:state.bulk.bulktTransactionList,
    isLoaderRunning:state.bulk.isLoaderRunning
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...bulkActions}, dispatch)
  }
}

class BulkListing extends Component {

  renderData = (item) => {
    console.log('item',item)
    return (
      <JobListItem data={item}/>
    )
  }

    componentDidMount() {
      this.props.actions.getBulkJobTransactions(this.props.navigation.state.params)
    }

    render() {
      console.log('this.props.isLoaderRunning', this.props.isLoaderRunning)
      // if (this.props.isLoaderRunning || _.isEmpty(this.props.bulktTransactionList)) {
      //   return <Loader />
      // }
      console.log('this.bulktTransactionList',this.props.bulktTransactionList)
        return (
          <View>
            <StyleProvider style={getTheme(platform)}>
              <Container>
                <View style={[styles.flex1]}>
                  <FlatList
                    data={this.props.bulktTransactionList}
                    renderItem={({ item }) => this.renderData(item)}
                    keyExtractor={item => item.id}
                  />
                </View>

              </Container>
            </StyleProvider>
          </View>
        )
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(BulkListing)

