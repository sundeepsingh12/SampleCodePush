
'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Preloader from '../containers/Preloader'
import Loader from '../components/Loader'

import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native'

import {
  Container,
  Content,
  Header,
  Text,
  List,
  ListItem,
  Body,
  Right,
  Icon,
  StyleProvider
} from 'native-base'


import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as newJobActions from '../modules/newJob/newJobActions'
import * as globalActions from '../modules/global/globalActions'
import { SELECT_TYPE_FOR } from '../lib/ContainerConstants'


/**
 * This method convert state of new job {see newJobInitialState.js} to props of this container
 * @param {*} state 
 */
function mapStateToProps(state) {
  return {
    jobMasterList: state.newJob.jobMasterList,
    statusList: state.newJob.statusList,
    negativeId: state.newJob.negativeId
  }
}

/**
 * This method convert all the actions present in newJobActions.js and globalActions.js to props of this container
 * @param {*} dispatch 
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...newJobActions,
      ...globalActions
    }, dispatch)
  }
}


class NewJobStatus extends PureComponent {

  /**
   * remove default header of this container as we are using custom header
   */
  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  /**
   * renders a single list item of flat list which shows list of jobStatus
   */
  renderData = (item) => {
    return (
      <ListItem style={[style.jobListItem]}
        onPress={() => this.props.actions.redirectToFormLayout(item,
          this.props.negativeId,
          this.props.navigation.state.params.jobMasterId,
          this.props.navigation.state.params.jobMasterName)}>
        <View style={[styles.row, styles.alignCenter]}>
          <View style={[style.statusCircle, { backgroundColor: item.buttonColor }]}></View>
          <Text style={[styles.fontDefault, styles.fontWeight500, styles.marginLeft10]}>{item.name}</Text>
        </View>
        <Right>
          <Icon name="ios-arrow-forward" style={[styles.fontDefault, styles.fontBlack]} />
        </Right>
      </ListItem>
    )
  }

  _keyExtractor = (item, index) => String(item.id)

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
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{this.props.navigation.state.params.jobMasterName}</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
              </View>
            </Body>
          </Header>

          <Content style={[styles.bgWhite]}>
            <Text style={[styles.fontSm, styles.fontPrimary, styles.padding15]}>{SELECT_TYPE_FOR}{this.props.navigation.state.params.jobMasterName}</Text>
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
  jobListItem: {
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'space-between'
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
})


export default connect(mapStateToProps, mapDispatchToProps)(NewJobStatus)
