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
import {StyleSheet, View, Image, TouchableHighlight} from 'react-native'

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
import * as homeActions from '../modules/home/homeActions'
import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
  return {}
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...globalActions,
      ...homeActions
    }, dispatch)
  }
}

/**
 * ## App class
 */
class NewJobStatus extends Component {

  // constructor(props) {   super(props)   this.state = {     isMoving: false,
  // pointsDelta: 0,     points: 67   } }

  static navigationOptions = ({navigation}) => {
    return {header: null}
  }

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
              <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]}/>
            </Left>
            <Body>
              <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg]}>New Task</Text>
            </Body>
            <Right/>
          </Header>
          <Content>
            <Text style={[styles.fontSm, styles.fontPrimary, styles.padding15]}>Select Type for Delivery</Text>
            <List>
              <ListItem style={[style.jobListItem]}>
                <View style={[styles.row, styles.alignCenter]}>
                  <View style={[style.statusCircle, {backgroundColor: '#4cd964'}]}></View>
                  <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>Success</Text>
                </View>
                <Right>
                  <Icon name="arrow-forward" style={[styles.fontDefault, styles.fontBlack]} />
                </Right>
              </ListItem>
              <ListItem style={[style.jobListItem]}>
                <View style={[styles.row, styles.alignCenter]}>
                  <View style={[style.statusCircle, {backgroundColor: '#006490'}]}></View>
                  <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>Reschedule</Text>
                </View>
                <Right>
                  <Icon name="arrow-forward" style={[styles.fontDefault, styles.fontBlack]} />
                </Right>
              </ListItem>
              <ListItem style={[style.jobListItem]}>
                <View style={[styles.row, styles.alignCenter]}>
                  <View style={[style.statusCircle, {backgroundColor: '#FF3B30'}]}></View>
                  <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>Fail</Text>
                </View>
                <Right>
                  <Icon name="arrow-forward" style={[styles.fontDefault, styles.fontBlack]} />
                </Right>
              </ListItem>
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
