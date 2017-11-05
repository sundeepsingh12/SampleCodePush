
'use strict'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'

import React, {Component} from 'react'
import {StyleSheet, View, TouchableHighlight,FlatList} from 'react-native'

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

import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as newJobActions from '../modules/newJob/newJobActions'
import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
  return {
    jobMasterList : state.newJob.jobMasterList,
    statusList : state.newJob.statusList,
    negativeId : state.newJob.negativeId
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...globalActions,
      ...newJobActions
    }, dispatch)
  }
}


class NewJob extends Component {
  static navigationOptions = ({navigation}) => {
    return {header: null}
  }

  componentDidMount() {
    this.props.actions.getMastersWithNewJob()
  }

  renderData = (item)=>{
    return (
      
        <ListItem style={[style.jobListItem]} onPress= {() => this.props.actions.navigateToScene('NewJobStatus',{jobMaster : item})}>
          <View>
            <Text style={[styles.fontDefault, styles.fontWeight500]}>{item.title}</Text>
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
              <Icon name="arrow-back" style={[styles.fontWhite, styles.fontXl]}  onPress={() => { this.props.navigation.goBack(null) }}/>
            </Left>
            <Body>
              <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>New Task</Text>
            </Body>
          </Header>
          <Content>
            <Text style={[styles.fontSm, styles.fontPrimary, styles.padding15]}>Select Type</Text>
              <List>
                <FlatList
                data={(this.props.jobMasterList)}
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
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(NewJob)
