'use strict'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as bulkActions from '../modules/bulk/bulkActions'
import * as globalActions from '../modules/global/globalActions'
import Loader from '../components/Loader'

<<<<<<< 2e9f2bbd6a5775cdb5d43c0c0616429f82ed0db7
import React, {Component} from 'react'
import {StyleSheet, View, Image, TouchableHighlight,Alert,FlatList,TouchableOpacity,BackHandler} from 'react-native'
=======
import React, {PureComponent} from 'react'
import {StyleSheet, View, Image, TouchableHighlight,Alert,FlatList,TouchableOpacity} from 'react-native'
>>>>>>> Changed component inheritance tree: Made all the components inherit from PureComponent instead of Component

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
import {FormLayout,CLEAR_BULK_STATE,HardwareBackPress} from '../lib/constants'


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

class BulkListing extends PureComponent {

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
      BackHandler.addEventListener(HardwareBackPress, this._goBack)
    }

     componentWillUnmount() {
        BackHandler.removeEventListener(HardwareBackPress, this._goBack)
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
                 <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { 
                  this.props.actions.setState(CLEAR_BULK_STATE)
                  this.props.navigation.goBack(null) }}>
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>Bulk Update</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View />
              </View>
            </Body>
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
                          this.goToFormLayout(nextStatusIds[buttonIndex], nextStatusNames[buttonIndex].text)
                          } }
                      ) : this.goToFormLayout(nextStatusIds[0], nextStatusNames[0].text)
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

     _goBack = () => {
       this.props.actions.setState(CLEAR_BULK_STATE)
    }
}

const style = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    height: 'auto',
    padding: 0,
    paddingRight: 0,
    paddingLeft: 0
  },
  headerLeft: {
    width: '15%',
    padding: 15
  },
  headerBody: {
    width: '70%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  headerRight: {
    width: '15%',
    padding: 15
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(BulkListing)

