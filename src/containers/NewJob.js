
'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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
  Left,
  Body,
  Right,
  Icon,
  StyleProvider,
  Toast
} from 'native-base'
import {
  SET_ERROR_MSG_FOR_NEW_JOB
} from '../lib/constants'
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import styles from '../themes/FeStyle'
import * as newJobActions from '../modules/newJob/newJobActions'
import * as globalActions from '../modules/global/globalActions'

function mapStateToProps(state) {
  return {
    jobMasterList: state.newJob.jobMasterList,
    statusList: state.newJob.statusList,
    negativeId: state.newJob.negativeId,
    newJobError: state.newJob.newJobError,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...globalActions,
      ...newJobActions
    }, dispatch)
  }
}


class NewJob extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }

  componentDidUpdate() {
    if (this.props.newJobError != '') {
      Toast.show({
        text: this.props.newJobError,
        position: "bottom" | "center",
        buttonText: 'Okay',
        type: 'danger',
        duration: 10000
      })
      this.props.actions.setState(SET_ERROR_MSG_FOR_NEW_JOB, '')
    }
  }

  renderData = (item) => {
    return (
      <ListItem style={[style.jobListItem, styles.justifySpaceBetween]}
        onPress={() => this.props.actions.redirectToContainer(item)}>
        <View>
          <Text style={[styles.fontDefault, styles.fontWeight500]}>{item.title}</Text>
        </View>
        <Right>
          <Icon name="ios-arrow-forward" style={[styles.fontDefault, styles.fontBlack]} />
        </Right>
      </ListItem>
    )
  }

  _keyExtractor = (item, index) => String(item.id)

  render() {
    let headerView = this.props.navigation.state.params.displayName ? this.props.navigation.state.params.displayName : 'New Task'
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
                  <Text style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>{headerView}</Text>
                </View>
                <View style={[style.headerRight]}>
                </View>
              </View>
            </Body>

          </Header>
          <Content style={[styles.bgWhite]}>
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

}

const style = StyleSheet.create({
  jobListItem: {
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20
  },
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
});


export default connect(mapStateToProps, mapDispatchToProps)(NewJob)
