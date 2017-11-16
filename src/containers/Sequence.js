
'use strict'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as sequenceActions from '../modules/sequence/sequenceActions'
import Loader from '../components/Loader'

import React, {Component} from 'react'
import {StyleSheet, View, Image, TouchableHighlight,Alert} from 'react-native'

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
import SortableListView from 'react-native-sortable-listview'
import JobListItem from '../components/JobListItem'

function mapStateToProps(state) {
  return {
    isSequenceScreenLoading:state.sequence.isSequenceScreenLoading,
    sequenceList:state.sequence.sequenceList,
    isResequencingDisabled:state.sequence.isResequencingDisabled
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...sequenceActions
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

  render() {
    if(this.props.isSequenceScreenLoading || _.isEmpty(this.props.sequenceList)){
        return <Loader />  
    }
    
      let order = Object.keys(this.props.sequenceList)
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
              <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]}  onPress={() => { this.props.navigation.goBack(null) }}/>
            </Left>
            <Body>
              <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>Sequence</Text>
            </Body>
            <Right/>
          </Header>
          <View style={[styles.flex1, styles.bgWhite]}>

            <SortableListView
              style={{
              flex: 1
            }}
              data={this.props.sequenceList}
              onRowMoved={e => {
                order.splice(e.to, 0, order.splice(e.from, 1)[0])
            }}
              activeOpacity={1}
              sortRowStyle={{
              backgroundColor: '#f2f2f2'
            }}
              renderRow={row => <JobListItem data={row} callingActivity = 'Sequence'/>}/>
          </View>
          <Footer style={{
            height: 'auto'
          }}>
            <FooterTab style={StyleSheet.flatten([styles.padding10])}>
              <Button
              onPress={this.showAlert}
              disabled = {this.props.isResequencingDisabled}
               success full>
                <Text style={[styles.fontLg, styles.fontWhite]}>Update Sequence</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>

    )
  
  }

  showAlert = () => {
    Alert.alert(
       "Route optimisation" ,
         `This will run route optimization ${_.size(this.props.sequenceList)} job transactions`,
         [
    {text: 'Cancel', style: 'cancel'},
    {text: 'OK', onPress: this.OnOkButtonPressed},
  ],
    )
  }

  OnOkButtonPressed = () => {
     
     const requestBody = this.props.actions.resequenceJobsFromServer(this.props.sequenceList)
     
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Sequence)
