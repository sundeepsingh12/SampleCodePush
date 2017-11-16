'use strict'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as bulkActions from '../modules/bulk/bulkActions'
import * as globalActions from '../modules/global/globalActions'
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
  Spinner,
  ActionSheet
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
    bulkTransactionList:state.bulk.bulkTransactionList,
    isLoaderRunning:state.bulk.isLoaderRunning,
    selectedItems:state.bulk.selectedItems
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...bulkActions,...globalActions}, dispatch)
  }
}

class BulkListing extends Component {

  renderData = (item) => {
    return (
      <JobListItem data={item}
        onPressItem = {()=>this.onClickRowItem(item)}
      />
    )
  }

  onClickRowItem(item){
    this.props.actions.toggleListItemIsChecked(item.id,this.props.bulkTransactionList)
  }

    componentDidMount() {
      this.props.actions.getBulkJobTransactions(this.props.navigation.state.params)
    }

    render() {
      if (this.props.isLoaderRunning || _.isEmpty(this.props.bulkTransactionList)) {
        return <Loader />
      }
      else{
        const nextStatusNames = this.props.navigation.state.params.nextStatusList.map(nextStatus=>nextStatus.name)
        nextStatusNames.push('Cancel')
        const nextStatusIds = this.props.navigation.state.params.nextStatusList.map(nextStatus=>nextStatus.id)
        return (
          <StyleProvider style={getTheme(platform)}>
            <Container>
              <Content>
                <FlatList
                  data={Object.values(this.props.bulkTransactionList)}
                  renderItem={({ item }) => this.renderData(item)}
                  keyExtractor={item => item.id}
                />
              </Content>

              <Footer
                style={[{ height: 'auto' }, styles.column, styles.padding10]}>
                <Text
                  style={[styles.fontSm, styles.marginBottom10]}>Total Count : {this.props.selectedItems.length}</Text>
                <Button
                  onPress={() => ActionSheet.show(
                    {
                      options: nextStatusNames,
                      cancelButtonIndex: nextStatusNames.length - 1,
                      title: "Next possible status"
                    },
                    buttonIndex => { this.goToFormLayout(nextStatusIds[buttonIndex],nextStatusNames[buttonIndex]) }
                  )}
                  success full
                  disabled={_.isEmpty(this.props.selectedItems)}
                >
                  <Text style={[styles.fontLg, styles.fontWhite]}>Update All Selected</Text>
                </Button>
              </Footer>
            </Container>
          </StyleProvider>
        )
      }
    }

    goToFormLayout(statusId, statusName) {

      this.props.actions.navigateToScene('FormLayout', {
        statusId,
        statusName,
        jobMasterId: this.props.navigation.state.params.jobMasterId,
        transactionIdList: this.props.selectedItems,
        jobTransaction:{}
      }
      )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BulkListing)

