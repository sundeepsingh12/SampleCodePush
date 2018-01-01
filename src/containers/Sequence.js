
'use strict'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as sequenceActions from '../modules/sequence/sequenceActions'
import * as globalActions from '../modules/global/globalActions'

import Loader from '../components/Loader'

import React, {Component} from 'react'
import {StyleSheet, View, Image, TouchableHighlight,Alert,TouchableOpacity} from 'react-native'

import {ROUTE_OPTIMIZATION} from '../lib/AttributeConstants'

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
  Toast
} from 'native-base'

import {CLEAR_SEQUENCE_STATE} from '../lib/constants'

import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import renderIf from '../lib/renderIf'
import TitleHeader from '../components/TitleHeader'
import SortableListView from 'react-native-sortable-listview'
import JobListItem from '../components/JobListItem'

function mapStateToProps(state) {
  return {
    isSequenceScreenLoading:state.sequence.isSequenceScreenLoading,
    sequenceList:state.sequence.sequenceList,
    isResequencingDisabled:state.sequence.isResequencingDisabled,
    responseMessage:state.sequence.responseMessage
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...sequenceActions,
      ...globalActions
    }, dispatch)
  }
}

class Sequence extends Component {

  static navigationOptions = ({navigation}) => {
    return {header: null}
  }

  componentDidMount(){
    this.props.actions.prepareListForSequenceModule()
  }

  renderList() {
    const list = Object.values(this.props.sequenceList).sort((transaction1, transaction2) =>
       transaction1.seqSelected - transaction2.seqSelected
    )
    return list
  }

  render() {
    if(this.props.isSequenceScreenLoading){
        return <Loader />  
    }
    else {
      if (!_.isEmpty(this.props.sequenceList)) {
        let order = Object.keys(this.props.sequenceList)
        return (
          <StyleProvider style={getTheme(platform)}>
            <Container>
             <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { 
                  this.props.actions.setState(CLEAR_SEQUENCE_STATE)
                  this.props.navigation.goBack(null) }}>
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.displayName}</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
                <View />
              </View>
            </Body>
          </Header>
              <View style={[styles.flex1, styles.bgWhite]}>
                <SortableListView
                  style={{
                    flex: 1
                  }}
                  data={this.renderList()}
                  onRowMoved={e => {
                    order.splice(e.to, 0, order.splice(e.from, 1)[0])
                  }}
                  activeOpacity={1}
                  sortRowStyle={{
                    backgroundColor: '#f2f2f2'
                  }}
                  renderRow={row => <JobListItem data={row} callingActivity='Sequence' />} />
                  {(this.props.responseMessage)?this.showToast():null}
              </View>
              <Footer style={{
                height: 'auto'
              }}>
                <FooterTab style={StyleSheet.flatten([styles.padding10])}>
                  <Button
                    onPress={this.showAlert}
                    disabled={this.props.isResequencingDisabled}
                    success full>
                    <Text style={[styles.fontLg, styles.fontWhite]}>Update Sequence</Text>
                  </Button>
                </FooterTab>
              </Footer>
            </Container>
          </StyleProvider>

        )
      }
      else {
        return (
          <StyleProvider style={getTheme(platform)}>
            <Container>
               <Header
            style={StyleSheet.flatten([
            styles.bgPrimary, {
              borderBottomWidth: 0
            }
          ])}>
            <Left>
               <Button transparent onPress={() => { 
                 this.props.actions.setState(CLEAR_SEQUENCE_STATE)
                 this.props.navigation.goBack(null) }}>
              <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]}/>
              </Button>
            </Left>
            <Body>
              <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>{this.props.navigation.state.params.displayName}</Text>
            </Body>
            <Right/>
          </Header>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <Text style={[styles.margin30, styles.fontDefault, styles.fontDarkGray]}>No jobs present</Text>
              </View>
            </Container>
          </StyleProvider>
        )
      }
    }

  }

  showAlert = () => {
    Alert.alert(
       ROUTE_OPTIMIZATION ,
         `This will run route optimization for ${_.size(this.props.sequenceList)} job transactions`,
         [
    {text: 'Cancel', style: 'cancel'},
    {text: 'OK', onPress: this.OnOkButtonPressed},
  ],
    )
  }

  showToast() {
    Toast.show({
              text: `${this.props.responseMessage}`,
              position: 'bottom',
              buttonText: 'OK'
            })
  }

  OnOkButtonPressed = () => {
     const requestBody = this.props.actions.resequenceJobsFromServer(this.props.sequenceList)
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

export default connect(mapStateToProps, mapDispatchToProps)(Sequence)
