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
import _ from 'lodash'
import {NEXT_POSSIBLE_STATUS} from '../lib/AttributeConstants'
import {FormLayout,CLEAR_BULK_STATE} from '../lib/constants'


function mapStateToProps(state) {
  return {
    bulkTransactionList:state.bulk.bulkTransactionList,
    isLoaderRunning:state.bulk.isLoaderRunning,
    selectedItems:state.bulk.selectedItems,
    selectAllNone:state.bulk.selectAllNone,
    isSelectAllVisible:state.bulk.isSelectAllVisible
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

  selectAll = () =>{
      this.props.actions.toggleAllItems(this.props.bulkTransactionList,this.props.selectAllNone)
    }

    componentDidMount() {
      this.props.actions.getBulkJobTransactions(this.props.navigation.state.params)
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }

    render() {
      if (this.props.isLoaderRunning) {
        return <Loader />
      }
      else {
        if (_.isEmpty(this.props.bulkTransactionList)) {
          return (
            <StyleProvider style={getTheme(platform)}>
              <Container>
                    <Header  style={StyleSheet.flatten([styles.bgPrimary])}>
                  <Left>
                     <Button transparent onPress={() => { this.props.actions.setState(CLEAR_BULK_STATE)
                       this.props.navigation.goBack(null) }}>
                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} />
                    </Button>
                  </Left>
                  <Body>
                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>Bulk Update</Text>
                  </Body>
                  <Right />
                </Header>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                  <Text style={[styles.margin30, styles.fontDefault, styles.fontDarkGray]}>No jobs present</Text>
                </View>
              </Container>
            </StyleProvider>
          )
        } else {
          let nextStatusNames = []
          this.props.navigation.state.params.nextStatusList.forEach(object=>{
            let statusObject = 
              { text: object.name, icon:"md-arrow-dropright", iconColor: "#000000" }
              nextStatusNames.push(statusObject)
          })
          nextStatusNames.push( { text: "Cancel", icon: "close", iconColor: styles.bgDanger.backgroundColor })
          const nextStatusIds = this.props.navigation.state.params.nextStatusList.map(nextStatus => nextStatus.id)
          
          return (
            <StyleProvider style={getTheme(platform)}>
              <Container>
                <Header  style={StyleSheet.flatten([styles.bgPrimary])}>
                  <Left>
                     <Button transparent onPress={() => { this.props.actions.setState(CLEAR_BULK_STATE)
                       this.props.navigation.goBack(null) }}>
                    <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} />
                    </Button>
                  </Left>
                  <Body>
                    <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>Bulk Update</Text>
                  </Body>
                  {this.props.isSelectAllVisible? <Right>
                    <Text
                    onPress={this.selectAll} 
                    style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>{this.props.selectAllNone}</Text>
                  </Right>:<Right />}
                 
                </Header>
                  <FlatList
                    data={Object.values(this.props.bulkTransactionList)}
                    renderItem={({ item }) => this.renderData(item)}
                    keyExtractor={item => item.id}
                  />

                <Footer
                  style={[{ height: 'auto' }, styles.column, styles.padding10]}>
                  <Text
                    style={[styles.fontSm, styles.marginBottom10]}>Total Count : {this.props.selectedItems.length}</Text>
                  <Button
                    onPress={() => {
                      (nextStatusNames.length > 2) ? ActionSheet.show(
                        {
                          options: nextStatusNames,
                          cancelButtonIndex: nextStatusNames.length-1,
                          title: NEXT_POSSIBLE_STATUS
                        },
                        buttonIndex => { 
                        if(buttonIndex >=0 && buttonIndex!=nextStatusNames.length-1){
                          this.goToFormLayout(nextStatusIds[buttonIndex], nextStatusNames[buttonIndex])
                          } }
                      ) : this.goToFormLayout(nextStatusIds[0], nextStatusNames[0])
                    }}
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
    }

    

    goToFormLayout(statusId, statusName) {
      this.props.actions.navigateToScene(FormLayout, {
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

