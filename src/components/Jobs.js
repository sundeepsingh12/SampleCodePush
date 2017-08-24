'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  ListView,
  Platform,
  TouchableHighlight,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
}
  from 'react-native'

import { Form, Item, Input, Container, Content, ListItem, CheckBox, List, Body, Left, Right, Text, Header, Icon, Button } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as homeActions from '../modules/home/homeActions'
import { Actions } from 'react-native-router-flux';
import _ from 'underscore'
import renderIf from '../lib/renderIf';
import Swipeable from 'react-native-swipeable';
import Loader from './Loader'
import styles from '../themes/FeStyle'
import theme from '../themes/feTheme'


function mapStateToProps(state) {
  return {
    jobTransactionCustomizationList: state.listing.jobTransactionCustomizationList,
    isRefreshing: state.listing.isRefreshing
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...homeActions }, dispatch)
  }
}

class Jobs extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (_.isEmpty(this.props.jobTransactionCustomizationList)) {
      this.props.actions.fetchJobs()
    }
  }

  toggleStatus() {
    console.log('toggle button handler:')
  }

  renderData = (item) => {
    return (
      <Swipeable
        leftButtons={[
          <Button style={[{ backgroundColor: 'red' }]}>
            <Ionicons name='ios-trash' style={{ fontSize: 34, color: '#ffffff', textAlign: 'right' }} />
          </Button>
        ]}
        rightButtons={[
          <Button style={[{ backgroundColor: '#062d4c' }]}>
            <Ionicons name='ios-call-outline' style={{ fontSize: 34, color: '#ffffff', marginLeft: 25 }} />
          </Button>,
          <Button style={[{ backgroundColor: '#395270' }]}>
            <Ionicons name='ios-pin-outline' style={{ fontSize: 34, color: '#ffffff', marginLeft: 25 }} />
          </Button>,
          <Button style={[{ backgroundColor: '#062d4c' }]}>
            <Ionicons name='ios-call-outline' style={{ fontSize: 34, color: '#ffffff', marginLeft: 25 }} />
          </Button>,
          <Button style={[{ backgroundColor: '#062d4c' }]}>
            <Ionicons name='ios-call-outline' style={{ fontSize: 34, color: '#ffffff', marginLeft: 25 }} />
          </Button>,
        ]}>
        <ListItem style={StyleSheet.flatten([styles.bgGray, {marging: 0, padding: 0}])} avatar button onPress={() => { Actions.JobDetails({ jobTransactionId: item.id }) }}>
          <Left>
            <TouchableHighlight underlayColor='#e7e7e7' onPress={() => this.toggleStatus()}>
              <View>
                <Text>{`${item.circleLine1}`}</Text>
                <Text>{`${item.circleLine2}`}</Text>
              </View>
            </TouchableHighlight>
          </Left>
          <Body >
            <Text adjustsFontSizeToFit>
              {`${item.line1}`}
            </Text>
            <Text note adjustsFontSizeToFit>
              {`${item.line2}`}
            </Text>
          </Body>
        </ListItem>
      </Swipeable>
    )
  }

  renderList() {
    const list = this.props.jobTransactionCustomizationList.filter(transactionCustomizationObject => this.props.statusIdList.includes(transactionCustomizationObject.statusId))
    list.sort(function (transaction1, transaction2) {
      return transaction1.seqSelected - transaction2.seqSelected
    })
    return list
  }

  render() {
    if (this.props.isRefreshing) {
      return <Loader />
    } else {
      return (
        <Container>
          <View>
            <List
              style={{ marging: 0, padding: 0}}>
              <FlatList
                data={this.renderList()}
                renderItem={({ item }) => this.renderData(item)}
                keyExtractor={item => item.id}
              />
            </List>
            <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 5, marginLeft: 5, marginRight: 5 }}>
              <View style={{ backgroundColor: '#fff', flexGrow: .90, height: 40 }}>
                <Input bordered='true' rounded style={{ fontSize: 14, backgroundColor: '#ffffff', borderColor: '#d3d3d3', borderWidth: 1 }}
                  placeholder="Search Reference No." />
              </View>
              <View style={{ backgroundColor: '#d7d7d7', flexGrow: .10, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name='ios-barcode-outline' style={{ fontSize: 34 }} />
              </View>
            </View>
          </View>
        </Container>
      )
    }
  }

};

export default connect(mapStateToProps, mapDispatchToProps)(Jobs)
