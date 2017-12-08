
'use strict'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Ionicons from 'react-native-vector-icons/Ionicons'
import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'

import React, {Component} from 'react'
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native'

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
  StyleProvider
} from 'native-base';


import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
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


class NewJobStatus extends Component {

  static navigationOptions = ({navigation}) => {
    return {header: null}
  }

  componentWillMount() {
    this.props.actions.getStatusAndIdForJobMaster(this.props.navigation.state.params.jobMaster.id)
  }

  renderData = (item)=>{
    return (
      <ListItem style={[style.jobListItem]} onPress={() => this.props.actions.redirectToFormLayout(item, 
      this.props.negativeId, 
      this.props.navigation.state.params.jobMaster.id)}>
          <View style={[styles.row, styles.alignCenter]}>
            <View style={item.statusCategory == 3  ? [style.statusCircle, {backgroundColor: '#4cd964'}] : 
                  item.statusCategory == 1 ? [style.statusCircle, {backgroundColor: '#006490'}] : 
                  [style.statusCircle, {backgroundColor: '#FF3B30'}]}></View>
            <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>{item.name}</Text>
          </View>
          <Right>
            <Icon name="ios-arrow-forward" style={[styles.fontDefault, styles.fontBlack]} />
          </Right>
        </ListItem>
    )
  }

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
            <Body>
              <View
                style={[styles.row, styles.width100, styles.justifySpaceBetween]}>
                <TouchableOpacity style={[style.headerLeft]} onPress={() => { this.props.navigation.goBack(null) }}>
                  <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl, styles.fontLeft]} />
                </TouchableOpacity>
                <View style={[style.headerBody]}>
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>New Task</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
              </View>
            </Body>
          </Header>
          <Content style={[styles.bgWhite]}>
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
  jobListItem: {
    borderBottomColor: '#f2f2f2', 
    borderBottomWidth: 1, 
    paddingTop: 20, 
    paddingBottom: 20,
    justifyContent: 'space-between'
  },
  statusCircle: {
    width: 6,
    height: 6,
    borderRadius: 3
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(NewJobStatus)
