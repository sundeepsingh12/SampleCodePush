/**
 * # Main.js
 *  This is the main app screen
 *
 */
'use strict'
/*
 * ## Imports
 *
 * Imports from redux
 */
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

/**
 * The actions we need
 */
import * as preloaderActions from '../modules/pre-loader/preloaderActions'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'
import ResyncLoader from '../components/ResyncLoader'

/**
 * The components needed from React
 */
import React, {Component} from 'react'
import {StyleSheet, View, Image, TouchableHighlight, FlatList} from 'react-native'

import {
  Container,
  Content,
  Header,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
  Title,
  StyleProvider
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import styles from '../themes/FeStyle'
import * as newJobActions from '../modules/newJob/newJobActions'
import * as globalActions from '../modules/global/globalActions'


function mapStateToProps(state) {
  return {
    jobMasterList : state.newJob.jobMasterList,
    statusList : state.newJob.statusList,
    statusList1 : state.newJob.statusList,
    negativeId : state.newJob.negativeId
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...newJobActions,
      ...globalActions
    }, dispatch)
  }
}

/**
 * ## App class
 */
class NewJobStatus extends Component {

  static navigationOptions = ({navigation}) => {
    return {header: null}
  }

  componentWillMount() {
    this.props.actions.getStatusAndIdForJobMaster(this.props.navigation.state.params.jobMaster.id)
  }

  renderData = (item)=>{
    return (
        <ListItem style={[style.jobListItem]} onPress = {()=> this.props.actions.navigateToScene('FormLayout',
          {statusId:item.id,statusName:item.name,
          jobTransactionId:this.props.negativeId,
          jobMasterId : this.props.navigation.state.params.jobMaster.id})}>
          
          <View style={[styles.row, styles.alignCenter]}>
            <View style={item.statusCategory == 3  ? [style.statusCircle, {backgroundColor: '#4cd964'}] : 
                  item.statusCategory == 1 ? [style.statusCircle, {backgroundColor: '#006490'}] : 
                  [style.statusCircle, {backgroundColor: '#FF3B30'}]}></View>
            <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>{item.name}</Text>
          </View>
          <Right>
            <Icon name="arrow-forward" style={[styles.fontDefault, styles.fontBlack]} />
          </Right>
        </ListItem>
    )
  }

  _keyExtractor = (item, index) => item.id;

  render() {
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
              <Icon name="arrow-back" style={[styles.fontWhite, styles.fontXl]} onPress={() => { this.props.navigation.goBack(null) }}/>
            </Left>
            <Body>
              <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>New Task</Text>
            </Body>
            <Right/>
          </Header>
          <Content>
            <Text style={[styles.fontSm, styles.fontPrimary, styles.padding15]}>Select Type for {this.props.navigation.state.params.jobMaster.title}</Text>
            <List>
              <FlatList
                data={(this.props.statusList)}
                extraData={this.state}
                renderItem={(item) => this.renderData(item.item)}
                keyExtractor={this._keyExtractor}>
              </FlatList>
            </List>
          </Content>
        </Container>
      </StyleProvider>
    )
  }

};

const style = StyleSheet.create({
  jobListItem: {
    borderBottomColor: '#f2f2f2', 
    borderBottomWidth: 1, 
    paddingTop: 20, 
    paddingBottom: 20
  },
  statusCircle: {
    width: 6,
    height: 6,
    borderRadius: 3
  }
});

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(NewJobStatus)
